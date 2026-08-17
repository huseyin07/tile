import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase";

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const xUsername = clean(body.x_username, 64).replace(/^@/, "");
    const wallet = clean(body.wallet_address, 128);

    if (!/^[A-Za-z0-9_]{1,15}$/.test(xUsername) || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Enter a valid X username and EVM wallet address." }, { status: 400 });
    }
    if (body.tasks_confirmed !== true) {
      return NextResponse.json({ error: "Complete and confirm the X whitelist tasks first." }, { status: 400 });
    }

    const db = adminDb();
    const { data: existing } = await db.from("whitelist_applications").select("id").ilike("wallet_address", wallet).maybeSingle();
    if (existing) return NextResponse.json({ error: "An application already exists for this wallet." }, { status: 409 });

    const { data, error } = await db.from("whitelist_applications").insert({
      x_username: xUsername,
      wallet_address: wallet,
      social_contact: null,
      reason: "X whitelist tasks confirmed",
      discovery_source: "X",
      assembly_completed: true,
      verification_status: "awaiting_x_url",
      status: "pending_verification",
    }).select("id,applicant_tile_number").single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "An application already exists for this wallet." }, { status: 409 });
      throw error;
    }
    return NextResponse.json({ applicationId: data.id, tileNumber: data.applicant_tile_number }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "We could not receive your application. Please try again later." }, { status: 500 });
  }
}
