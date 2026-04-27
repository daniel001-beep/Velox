import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * CART MANAGEMENT
 * 
 * Session-based cart handling with:
 * - User-specific data isolation
 * - In-memory session storage (can be persisted to DB)
 * - Atomic cart operations
 */

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

interface UserCart {
  items: CartItem[];
  updatedAt: Date;
}

// Store admin's session cart in server-side context
const cartSessions = new Map<string, UserCart>();

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userCart = cartSessions.get(session.user.id) || { items: [] };
    
    // Calculate totals
    const subtotal = userCart.items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return NextResponse.json({
      items: userCart.items || [],
      subtotal,
      tax,
      total,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, productName, price, quantity } = body;

    if (!productId || !quantity || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Atomic operation: Add or update item
    let userCart = cartSessions.get(session.user.id) || { items: [], updatedAt: new Date() };

    const existingItemIndex = userCart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      userCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      userCart.items.push({
        productId,
        productName,
        price,
        quantity,
      });
    }

    userCart.updatedAt = new Date();
    cartSessions.set(session.user.id, userCart);

    return NextResponse.json({
      success: true,
      cartSize: userCart.items.length,
    });
  } catch (error) {
    console.error("Cart add error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Clear cart for user
    cartSessions.delete(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart clear error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
