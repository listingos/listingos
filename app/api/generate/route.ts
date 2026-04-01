import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const user = await currentUser();
  if (!user) {
    return Response.json({ error: 'not_logged_in' }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get user from database
  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  // Check if user has a subscription
  if (!dbUser || dbUser.listings_limit === 0) {
    return Response.json({ error: 'no_subscription' }, { status: 403 });
  }

  // Reset monthly usage if needed
  if (new Date() > new Date(dbUser.usage_reset_at)) {
    await supabase.from('users').update({
      usage_count: 0,
      usage_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }).eq('email', email);
    dbUser.usage_count = 0;
  }

  // Check if user has hit their limit
  if (dbUser.listings_limit !== -1 && dbUser.usage_count >= dbUser.listings_limit) {
    return Response.json({
      error: 'limit_reached',
      used: dbUser.usage_count,
      limit: dbUser.listings_limit,
      plan: dbUser.plan
    }, { status: 403 });
  }

  // Increment usage count
  await supabase.from('users')
    .update({ usage_count: dbUser.usage_count + 1 })
    .eq('email', email);

  // Call Claude
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  let fullText = '';
  if (message.content[0].type === 'text') {
    fullText = message.content[0].text;
  }

  return Response.json({ text: fullText });
}