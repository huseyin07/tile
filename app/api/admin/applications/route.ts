import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { adminDb } from "@/lib/supabase";

const allowedTransitions: Record<string, string[]> = {
  verified: ["whitelisted", "rejected"],
  whitelisted: ["verified"],
  rejected: ["verified"],
};

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await adminDb()
    .from("whitelist_applications")
    .select("id,applicant_tile_number,x_username,wallet_address,social_contact,discovery_source,assembly_completed,x_post_url,x_verified_at,verification_status,status,created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await request.json();
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["verified", "whitelisted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status request." }, { status: 400 });
  }
  const db = adminDb();
  const { data: current } = await db.from("whitelist_applications").select("status").eq("id", id).single();
  if (!current || !allowedTransitions[current.status]?.includes(status)) {
    return NextResponse.json({ error: "This status transition is not allowed." }, { status: 409 });
  }
  const { error } = await db.from("whitelist_applications").update({ status }).eq("id", id).eq("status", current.status);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
