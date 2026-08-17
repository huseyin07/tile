import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase";
import {
  normalizeXPostUrl,
  normalizeXUsername,
  verifyWithXApi,
} from "@/lib/x-verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const applicationId = typeof body.applicationId === "string" ? body.applicationId : "";
    const post = normalizeXPostUrl(body.xPostUrl);
    if (!/^[0-9a-f-]{36}$/i.test(applicationId) || !post) {
      return NextResponse.json(
        { error: "Enter a valid x.com or twitter.com status URL." },
        { status: 400 },
      );
    }

    const db = adminDb();
    const { data: application, error: readError } = await db
      .from("whitelist_applications")
      .select("id,x_username,applicant_tile_number,status")
      .eq("id", applicationId)
      .single();
    if (readError || !application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }
    if (application.status !== "pending_verification") {
      return NextResponse.json(
        { error: "This application is not awaiting verification." },
        { status: 409 },
      );
    }
    if (normalizeXUsername(application.x_username) !== normalizeXUsername(post.username)) {
      return NextResponse.json(
        { error: "The X post username must match the X username in your application." },
        { status: 400 },
      );
    }

    const { data: duplicate } = await db
      .from("whitelist_applications")
      .select("id")
      .eq("x_post_id", post.postId)
      .neq("id", applicationId)
      .maybeSingle();
    if (duplicate) {
      return NextResponse.json(
        { error: "This X post is already connected to another application." },
        { status: 409 },
      );
    }

    const verification = await verifyWithXApi(post, application.applicant_tile_number);
    const { error: updateError } = await db
      .from("whitelist_applications")
      .update({
        x_post_url: post.url,
        x_post_id: post.postId,
        x_verified_at: new Date().toISOString(),
        verification_status:
          verification.level === "content" ? "x_api_verified" : "url_ownership_verified",
        status: "verified",
      })
      .eq("id", applicationId)
      .eq("status", "pending_verification");
    if (updateError) {
      if (updateError.code === "23505") {
        return NextResponse.json(
          { error: "This X post is already connected to another application." },
          { status: 409 },
        );
      }
      throw updateError;
    }

    return NextResponse.json({ ok: true, verificationLevel: verification.level });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Signal verification failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
