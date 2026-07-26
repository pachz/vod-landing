import { NextResponse } from "next/server";
import { recordBlogView } from "@/lib/server/blogs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let slug = searchParams.get("slug")?.trim() ?? "";

    if (!slug) {
      try {
        const body = (await request.json()) as { slug?: unknown };
        if (typeof body.slug === "string") {
          slug = body.slug.trim();
        }
      } catch {
        // Body may be empty when slug is provided via query.
      }
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Missing blog slug" },
        { status: 400 }
      );
    }

    const result = await recordBlogView(slug);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[blogs view API] Unexpected failure", error);
    return NextResponse.json(
      { error: "Unable to record blog view" },
      { status: 500 }
    );
  }
}
