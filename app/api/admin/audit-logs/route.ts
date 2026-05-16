import { db } from "@/src/db";
import { auditLogs, users } from "@/src/db/schema";
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
      await logUnauthorizedAccess(session.user.id, request, "audit_logs");
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");
    const eventType = searchParams.get("event_type");

    // Fetch audit logs
    const filters = [];
    if (eventType && eventType !== "all") {
      filters.push(eq(auditLogs.eventType, eventType));
    }

    const logs = await db.query.auditLogs.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      orderBy: [desc(auditLogs.timestamp)],
      limit: limit,
      offset: offset,
    });

    // Log successful access
    await logAdminAccess(session.user.id, request, "audit_logs_viewed");

    return NextResponse.json(
      {
        logs: logs || [],
        total: logs.length, // Rough total for demo
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Audit logs API error:", error);
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
      eventType: "admin_action",
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
  request: NextRequest,
  resource: string
) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await db.insert(auditLogs).values({
      userId: userId,
      eventType: "unauthorized_access_attempt",
      entityType: "admin",
      entityId: resource,
      ipAddress: clientIp,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log unauthorized access:", error);
  }
}

