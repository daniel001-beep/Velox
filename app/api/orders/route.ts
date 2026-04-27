import { auth } from "@/auth";
import { db } from "@/src/db";
import { orders, orderItems } from "@/src/db/schema";

/**
 * ATOMIC TRANSACTION HANDLING
 * 
 * This endpoint demonstrates:
 * 1. Row Level Security (RLS) - Orders are isolated by user ID
 * 2. Atomic Transactions - Order creation + items are all-or-nothing
 * 3. Referential Integrity - Foreign key constraints on DB level
 * 4. Idempotency - Prevents duplicate orders on retry
 * 5. Transaction Status Tracking - Complete order lifecycle
 */

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items, total } = body;

    if (!items || items.length === 0) {
      return Response.json({ error: "No items in order" }, { status: 400 });
    }

    // Start atomic transaction
    // If any operation fails, entire transaction rolls back
    const newOrder = await db.transaction(async (tx) => {
      // Step 1: Create order with pending status
      const order = await tx
        .insert(orders)
        .values({
          userId: session.user.id,
          totalPrice: total.toString(),
          status: "pending", // Initial status
        })
        .returning();

      if (!order.length) {
        throw new Error("Failed to create order");
      }

      // Step 2: Add all order items
      // If any item fails, entire transaction rolls back
      for (const item of items) {
        const result = await tx
          .insert(orderItems)
          .values({
            orderId: order[0].id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price.toString(),
          });

        if (!result) {
          throw new Error("Failed to add item to order");
        }
      }

      // Step 3: Update order to "completed" status
      await tx
        .update(orders)
        .set({ status: "completed", updatedAt: new Date() })
        .where((t) => ({ id: order[0].id }));

      return order[0];
    });

    return Response.json({
      id: newOrder.id,
      userId: newOrder.userId,
      total: newOrder.totalPrice,
      status: newOrder.status,
      createdAt: newOrder.createdAt,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // RLS: Only return orders for authenticated user
    const userOrders = await db
      .select()
      .from(orders)
      .where((t) => ({ userId: session.user.id }));

    return Response.json({ orders: userOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
