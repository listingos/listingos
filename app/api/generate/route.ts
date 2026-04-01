import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: 'not_logged_in' }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!dbUser || dbUser.listings_limit === 0) {
    return Response.json({ error: 'no_subscription' }, { status: 403 });
  }

  if (new Date() > new Date(dbUser.usage_reset_at)) {
    await supabase.from('users').update({
      usage_count: 0,
      usage_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('email', email);
    dbUser.usage_count = 0;
  }

  if (dbUser.listings_limit !== -1 && dbUser.usage_count >= dbUser.listings_limit) {
    return Response.json({
      error: 'limit_reached',
      used: dbUser.usage_count,
      limit: dbUser.listings_limit,
      plan: dbUser.plan
    }, { status: 403 });
  }

  await supabase.from('users')
    .update({ usage_count: dbUser.usage_count + 1 })
    .eq('email', email);

  const formData = await req.formData();
  const prompt = formData.get('prompt') as string;
  const photos = formData.getAll('photos') as File[];

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const allowedPhotos = photos.slice(0, dbUser.photo_limit ?? 0);

  const imageParts = await Promise.all(
    allowedPhotos.map(async (photo) => {
      const buf = Buffer.from(await photo.arrayBuffer());
      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: 'image/jpeg' as const,
          data: buf.toString('base64')
        }
      };
    })
  );

  const content = imageParts.length > 0
    ? [...imageParts, { type: 'text' as const, text: prompt }]
    : [{ type: 'text' as const, text: prompt }];

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content }],
  });

  let fullText = '';
  if (message.content[0].type === 'text') {
    fullText = message.content[0].text;
  }

  return Response.json({ text: fullText });
}