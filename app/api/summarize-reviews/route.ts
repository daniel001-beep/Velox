import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/src/db";
import { reviews as reviewsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return new Response("Product ID required", { status: 400 });
    }

    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.productId, productId));

    if (reviews.length === 0) {
      return new Response("No reviews found to summarize.", { status: 200 });
    }

    const reviewsText = reviews.map(r => `Rating: ${r.rating}, Comment: ${r.comment}`).join("\n");

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: "You are a helpful e-commerce shopping assistant. Summarize product reviews into a concise Pros and Cons list. Use markdown formatting.",
      messages: [{ role: "user", content: `Please summarize these reviews for Product ID ${productId}:\n\n${reviewsText}` }],
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Summary Error:", error);
    return new Response(error.message || "Internal server error", { status: 500 });
  }
}
