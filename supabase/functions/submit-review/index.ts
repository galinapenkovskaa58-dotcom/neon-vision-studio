import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ALLOWED_SERVICES = ['neurophoto', 'ai-video', 'songs', 'vibe-coding'] as const;

const BodySchema = z.object({
  service: z.enum(ALLOWED_SERVICES),
  client_name: z.string().trim().min(2).max(100),
  text: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
  email: z.string().trim().email().max(200).optional().or(z.literal('').transform(() => undefined)),
  share_to_portfolio: z.boolean().optional().default(false),
  portfolio_description: z.string().trim().max(1000).optional(),
  portfolio_media_urls: z.array(z.string().url().max(500)).max(5).optional().default([]),
  portfolio_external_link: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
});

function generateCode(prefix: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${suffix}`;
}

async function createUniqueCode(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  prefix: string,
  discount_percent: number,
  source: 'review' | 'portfolio',
  links: { review_id?: string; portfolio_submission_id?: string }
): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = generateCode(prefix);
    const { error } = await supabase.from('promocodes').insert({
      code,
      discount_percent,
      source,
      review_id: links.review_id ?? null,
      portfolio_submission_id: links.portfolio_submission_id ?? null,
    });
    if (!error) return code;
    if (!/duplicate/i.test(error.message)) throw error;
  }
  throw new Error('Could not generate unique promocode');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const data = parsed.data;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Insert review (status pending)
    const { data: reviewRow, error: reviewErr } = await supabase
      .from('reviews')
      .insert({
        service: data.service,
        client_name: data.client_name,
        text: data.text,
        rating: data.rating,
        email: data.email ?? null,
        status: 'pending',
        is_visible: true,
      })
      .select('id')
      .single();

    if (reviewErr || !reviewRow) {
      console.error('review insert error', reviewErr);
      return new Response(JSON.stringify({ error: 'Could not save review' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reviewId = reviewRow.id as string;

    // 2. Promocode for review (10%)
    const reviewPromocode = await createUniqueCode(supabase, 'REVIEW', 10, 'review', {
      review_id: reviewId,
    });

    let portfolioPromocode: string | null = null;

    // 3. If user gave permission to share to portfolio — always create submission + extra 5% code
    if (data.share_to_portfolio) {
      const { data: submission, error: subErr } = await supabase
        .from('portfolio_submissions')
        .insert({
          service: data.service,
          client_name: data.client_name,
          description: data.portfolio_description ?? null,
          media_urls: data.portfolio_media_urls ?? [],
          external_link: data.portfolio_external_link ?? null,
          review_id: reviewId,
          status: 'pending',
        })
        .select('id')
        .single();

      if (subErr || !submission) {
        console.error('portfolio submission error', subErr);
      } else {
        portfolioPromocode = await createUniqueCode(supabase, 'PORTFOLIO', 15, 'portfolio', {
          portfolio_submission_id: submission.id as string,
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        review_promocode: reviewPromocode,
        portfolio_promocode: portfolioPromocode,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('submit-review error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
