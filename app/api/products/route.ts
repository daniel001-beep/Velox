import { auth } from "@/auth";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allProducts = await db.select().from(products).limit(100);
    return Response.json({ products: allProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
