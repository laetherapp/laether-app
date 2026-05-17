import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, pseudo, language } = await req.json();
    if (!email || !email.includes("@") || !pseudo?.trim()) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const supabase = createClient();
    const { data: existing } = await supabase.from("circle_queue").select("id,status,circle_id").eq("email", email.trim()).maybeSingle();
    if (existing) return NextResponse.json({ ok: true, status: existing.status });
    await supabase.from("circle_queue").insert({ email: email.trim(), pseudo: pseudo.trim().slice(0, 30), language: language ?? "fr", status: "waiting" });
    const { data: queue } = await supabase.from("circle_queue").select("*").eq("status", "waiting").order("created_at", { ascending: true });
    if (queue && queue.length >= 3) {
      const three = queue.slice(0, 3);
      const { data: circle } = await supabase.from("circles").insert({ language: "mixed", status: "active" }).select().single();
      if (circle) {
        await supabase.from("circle_members").insert(three.map((m) => ({ circle_id: circle.id, user_email: m.email, pseudo: m.pseudo, language: m.language })));
        await supabase.from("circle_queue").update({ status: "matched", circle_id: circle.id }).in("id", three.map((m) => m.id));
      }
    }
    return NextResponse.json({ ok: true, status: "queued" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
