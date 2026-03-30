import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { consumeRateLimit } from '@/lib/rate-limit';
import { getClientIp, sanitizeText } from '@/lib/sanitize';

const schema = z.object({
  businessType: z.string().max(200)
});

const nvidia = process.env.NVIDIA_API_KEY
  ? new OpenAI({
      baseURL: 'https://integrate.api.nvidia.com/v1',
      apiKey: process.env.NVIDIA_API_KEY
    })
  : null;

type Suggestion = {
  automation: string;
  timeSaved: string;
  tools: string[];
};

function fallbackSuggestion(businessType: string): Suggestion {
  const value = businessType.toLowerCase();

  if (value.includes('salon') || value.includes('spa')) {
    return {
      automation: 'When a client books, send a WhatsApp confirmation, reminder, and cancellation-fill follow-up automatically.',
      timeSaved: '3 hours per week',
      tools: ['WhatsApp', 'Calendar', 'Bookings']
    };
  }

  if (value.includes('shop') || value.includes('store') || value.includes('ecommerce') || value.includes('shopify')) {
    return {
      automation: 'When an order is placed, update inventory, notify fulfilment, and send the customer a delivery update automatically.',
      timeSaved: '4 hours per week',
      tools: ['Shopify', 'Google Sheets', 'WhatsApp']
    };
  }

  if (value.includes('freelance') || value.includes('designer') || value.includes('developer')) {
    return {
      automation: 'When a proposal is approved, create the project workspace, send the contract, and issue the invoice automatically.',
      timeSaved: '2 hours per week',
      tools: ['Gmail', 'Drive', 'Invoices']
    };
  }

  if (value.includes('agency') || value.includes('consult')) {
    return {
      automation: 'Every Monday, compile each client report and send it automatically with the right numbers and commentary.',
      timeSaved: '5 hours per week',
      tools: ['Analytics', 'Google Docs', 'Email']
    };
  }

  return {
    automation: 'When a new lead comes in, reply immediately, assign an owner, and schedule the next follow-up automatically.',
    timeSaved: '2 hours per week',
    tools: ['Email', 'CRM', 'Calendar']
  };
}

function parseSuggestion(content: string | null | undefined) {
  if (!content) return null;

  const direct = safeParse(content);
  if (direct) return direct;

  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return safeParse(match[0]);
}

function safeParse(content: string) {
  try {
    const value = JSON.parse(content) as Partial<Suggestion>;
    if (!value.automation || !value.timeSaved || !Array.isArray(value.tools)) {
      return null;
    }

    return {
      automation: sanitizeText(value.automation, 240),
      timeSaved: sanitizeText(value.timeSaved, 40),
      tools: value.tools.slice(0, 5).map((tool) => sanitizeText(String(tool), 40))
    } satisfies Suggestion;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(fallbackSuggestion(''));
    }

    const businessType = sanitizeText(parsed.data.businessType, 200);
    const ip = getClientIp(request.headers.get('x-forwarded-for'), request.headers.get('x-real-ip'));
    const limit = consumeRateLimit('personalise', ip, 5, 60 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(fallbackSuggestion(businessType));
    }

    if (!nvidia || !businessType) {
      return NextResponse.json(fallbackSuggestion(businessType));
    }

    try {
      const response = await nvidia.chat.completions.create({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'system',
            content:
              'You are Dobly onboarding AI. Given a person job or business type, generate one high-value automation. Respond only with valid JSON: {"automation":"When ... automatically ...","timeSaved":"X hours/week","tools":["tool1","tool2","tool3"]}'
          },
          {
            role: 'user',
            content: `Business/job type: ${businessType}`
          }
        ],
        max_tokens: 200,
        temperature: 0.4
      });

      const suggestion = parseSuggestion(response.choices[0]?.message?.content);
      return NextResponse.json(suggestion ?? fallbackSuggestion(businessType));
    } catch {
      return NextResponse.json(fallbackSuggestion(businessType));
    }
  } catch {
    return NextResponse.json(fallbackSuggestion(''));
  }
}
