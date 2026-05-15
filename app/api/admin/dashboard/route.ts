import { auth } from "@/auth";
import { db } from "@/src/db";
import { users, orders, products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - not authenticated" },
        { status: 401 }
      );
    }

    // Fetch the current user to check if admin
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!currentUser[0]?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - not an admin" },
        { status: 403 }
      );
    }

    // Fetch all users with error handling
    let allUsers = [];
    try {
      allUsers = await db.select().from(users);
    } catch (usersErr) {
      console.error("Error fetching users:", usersErr);
      allUsers = [];
    }

    // Fetch all orders with product and user details with error handling
    let allOrders = [];
    try {
      allOrders = await db
        .select({
          id: orders.id,
          userId: orders.userId,
          productName: products.name,
          productPrice: products.price,
          status: orders.status,
          createdAt: orders.createdAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .innerJoin(products, eq(orders.id, products.id));
    } catch (ordersErr) {
      console.error("Error fetching orders:", ordersErr);
      allOrders = [];
    }

    return NextResponse.json({
      users: allUsers,
      orders: allOrders,
      totalUsers: allUsers.length,
      totalOrders: allOrders.length,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
