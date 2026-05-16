import { db } from "@/src/db";
import { transactions, auditLogs, users, ledgerEntries } from "@/src/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin status
    const userData = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!userData?.isAdmin) {
      await logUnauthorizedAccess(session.user.id, request);
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch transactions
    const txList = await db.query.transactions.findMany({
      orderBy: [desc(transactions.createdAt)],
      limit: 100,
    });

    // Get ledger entries summary for each
    const transactionsWithEntries = await Promise.all(
      txList.map(async (tx) => {
        const entries = await db.query.ledgerEntries.findMany({
          where: eq(ledgerEntries.transactionId, tx.id),
        });

        const debitCount = entries.filter(e => e.entryType === "DEBIT").length;
        const creditCount = entries.filter(e => e.entryType === "CREDIT").length;

        return {
          transactionId: tx.id,
          userId: tx.userId,
          amount: Number(tx.amount) / 100,
          status: tx.status,
          createdAt: tx.createdAt,
          debitCount,
          creditCount,
        };
      })
    );

    // Log successful access
    await logAdminAccess(session.user.id, request, "transactions_viewed");

    return NextResponse.json(
      { transactions: transactionsWithEntries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function logAdminAccess(
  userId: string,
  request: NextRequest,
  action: string
) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await db.insert(auditLogs).values({
      userId: userId,
      eventType: "admin_access",
      entityType: "admin",
      entityId: action,
      ipAddress: clientIp,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log admin access:", error);
  }
}

async function logUnauthorizedAccess(
  userId: string,
  request: NextRequest
) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await db.insert(auditLogs).values({
      userId: userId,
      eventType: "unauthorized_admin_access",
      entityType: "admin",
      entityId: "access_denied",
      ipAddress: clientIp,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log unauthorized access:", error);
  }
}

