import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const items = await db.query.products.findMany({ limit: 50 });
    const contextStr = items.map(i => `- ${i.name} ($${i.price}): ${i.description.substring(0, 100)}...`).join('\n');

    const systemPrompt = `You are a helpful and polite shopping assistant for Redstore, an elegant ecommerce store.
Here is the current inventory context available in the database:
${contextStr}

Use ONLY the provided inventory to answer the user's questions. Do not hallucinate products. If the user asks about an item we do not stock, politely inform them we do not have it.`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
