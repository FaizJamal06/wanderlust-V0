import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { vibe, listings } = await req.json();

    if (!vibe || typeof vibe !== 'string' || vibe.trim().length < 3) {
      return NextResponse.json({ error: 'Please describe your travel vibe.' }, { status: 400 });
    }

    const listingSummaries = listings
      .slice(0, 30) // cap to keep prompt tight
      .map((l: { _id: string; title: string; location: string; country: string; category: string; description: string }) => ({
        id:       l._id,
        title:    l.title,
        location: `${l.location}, ${l.country}`,
        category: l.category,
        desc:     l.description?.slice(0, 120),
      }));

    const systemPrompt = `You are an elite luxury travel curator with poetic sensibility. 
Given a traveler's vibe description and a set of available listings, identify the 3 best matches.
Return ONLY valid JSON in this exact shape:
{
  "recommendations": [
    { "id": "<listing _id>", "reason": "<one elegant sentence why this listing fits the vibe>" },
    { "id": "<listing _id>", "reason": "..." },
    { "id": "<listing _id>", "reason": "..." }
  ]
}
Be evocative and specific in your reasoning. Match the traveler's emotional tone.`;

    const userPrompt = `Traveler vibe: "${vibe.trim()}"

Available listings:
${JSON.stringify(listingSummaries, null, 2)}`;

    const completion = await groq.chat.completions.create({
      model:    'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      temperature:    0.7,
      max_tokens:     512,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error('[AI recommend]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
