import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Landing page posts { kind: "woman" | "man", email, name? } here.
// Everyone lands as "pending". You vet by hand, then flip to "active".
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const kind = body.kind === "man" ? "man" : "woman";
  const name = (body.name ?? "").trim() || null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }

  const table = kind === "man" ? "men" : "women";
  const row = kind === "man"
    ? { email, name: name ?? "", status: "pending" }
    : { email, name, status: "pending" };

  const { error } = await supabase.from(table).upsert(row, { onConflict: "email" });
  if (error) {
    console.error("signup insert failed", error);
    return NextResponse.json({ error: "could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
