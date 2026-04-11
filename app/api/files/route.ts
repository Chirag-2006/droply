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
    const isStarred = searchParams.get("isStarred") === "true";
    const isTrash = searchParams.get("isTrash") === "true";

    if (!queryUserId || queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // fetching file from db and get latest file
    // let userFiles;

    const conditions = [eq(files.userId, userId)];

    if (isTrash) {
      conditions.push(eq(files.isTrash, true));
    } else {
      conditions.push(eq(files.isTrash, false));
      if (isStarred) {
        conditions.push(eq(files.isStarred, true));
      } else {
        if (parentId) {
          conditions.push(eq(files.parentId, parentId));
        } else {
          conditions.push(isNull(files.parentId));
        }
      }
    }


    const userFiles = await db
      .select()
      .from(files)
      .where(and(...conditions))
      .orderBy(desc(files.createdAt));

    return NextResponse.json(userFiles);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
