import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const folderId = req.nextUrl.searchParams.get("folderId");
    if (!folderId) return NextResponse.json([]);

    const breadcrumbs = [];
    let currentId: string | null = folderId;

    // Fetch ancestors one by one (simplified for now, can be optimized with a recursive CTE)
    while (currentId) {
      const [folder] = await db
        .select({ id: files.id, name: files.name, parentId: files.parentId })
        .from(files)
        .where(eq(files.id, currentId));

      if (folder) {
        breadcrumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        currentId = null;
      }
    }

    return NextResponse.json(breadcrumbs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch path" }, { status: 500 });
  }
}
