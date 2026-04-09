import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;

    const queryUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");

    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // fetching file from db and get latest file
    let userFiles;
    if (parentId) {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.parentId, parentId)))
        .orderBy(desc(files.updatedAt));
    } else {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.userId, userId), isNull(files.parentId)))
        .orderBy(desc(files.updatedAt));
    }

    return NextResponse.json(userFiles);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
