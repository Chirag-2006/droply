import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get Total Files (excluding folders and trash)
    const [totalFiles] = await db
      .select({ count: sql<number>`count(*)` })
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isFolder, false),
          eq(files.isTrash, false)
        )
      );

    // Get Total Folders (excluding trash)
    const [totalFolders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isFolder, true),
          eq(files.isTrash, false)
        )
      );

    // Get Total Storage Used (sum of sizes, excluding trash)
    const [totalStorage] = await db
      .select({ sum: sql<number>`sum(size)` })
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isTrash, false)
        )
      );

    // Get Total Starred Items (excluding trash)
    const [totalStarred] = await db
      .select({ count: sql<number>`count(*)` })
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isStarred, true),
          eq(files.isTrash, false)
        )
      );

    return NextResponse.json({
      totalFiles: Number(totalFiles?.count || 0),
      totalFolders: Number(totalFolders?.count || 0),
      totalStorage: Number(totalStorage?.sum || 0),
      totalStarred: Number(totalStarred?.count || 0),
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
