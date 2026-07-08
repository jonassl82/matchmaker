import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { planWeeklyDrops } from "@/lib/matching";
import { CONFIRM_WINDOW_WEEKS } from "@/lib/config";
import Drop from "@/emails/Drop";
import type { Man, Woman, Impression } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function mondayOfThisWeek(): string {
  const d = new Date();
  const day = (d.getUTCDay() + 6) % 7; // 0 = Monday
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

function mapMan(r: any): Man {
  return {
    id: r.id, name: r.name, age: r.age, city: r.city, ig: r.ig,
    linkedin: r.linkedin, description: r.description, openTo: r.open_to,
    places: r.places ?? [], vibes: r.vibes ?? [], status: r.status,
    lastConfirmedAt: r.last_confirmed_at, addedAt: r.added_at,
  };
}
function mapWoman(r: any): Woman {
  return {
    id: r.id, name: r.name, email: r.email, age: r.age, city: r.city, ig: r.ig,
    ageMin: r.age_min, ageMax: r.age_max, likedVibes: r.liked_vibes ?? [],
    regions: r.regions ?? [], status: r.status, joinedAt: r.joined_at,
  };
}

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);
  const week = mondayOfThisWeek();
  const cutoff = new Date(Date.now() - CONFIRM_WINDOW_WEEKS * 7 * 86_400_000).toISOString();

  const [{ data: womenRows }, { data: menRows }, { data: impRows }] = await Promise.all([
    supabase.from("women").select("*").eq("status", "active"),
    supabase.from("men").select("*").eq("status", "active").gte("last_confirmed_at", cutoff),
    supabase.from("impressions").select("man_id, woman_id, drop_week"),
  ]);

  const women = (womenRows ?? []).map(mapWoman);
  const men = (menRows ?? []).map(mapMan);
  const menById = new Map(men.map((m) => [m.id, m]));
  const womenById = new Map(women.map((w) => [w.id, w]));
  const impressions: Impression[] = (impRows ?? []).map((r: any) => ({
    manId: r.man_id, womanId: r.woman_id, dropWeek: r.drop_week,
  }));

  const seed = Math.floor(Date.now() / 604_800_000); // week number, stable within a week
  const plan = planWeeklyDrops({ women, men, impressions, seed });

  let sent = 0;
  const newImpressions: { man_id: string; woman_id: string; drop_week: string }[] = [];

  for (const a of plan) {
    if (a.manIds.length === 0) continue;
    const woman = womenById.get(a.womanId)!;
    const dropMen = a.manIds.map((id) => menById.get(id)!).filter(Boolean);
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: woman.email,
        subject: "Matchmaker · this week's introductions",
        react: Drop({ woman, men: dropMen }),
      });
      sent++;
      for (const id of a.manIds) newImpressions.push({ man_id: id, woman_id: a.womanId, drop_week: week });
    } catch (err) {
      console.error(`send failed for ${woman.email}`, err);
    }
  }

  if (newImpressions.length) {
    // Only record impressions for letters that actually sent.
    await supabase.from("impressions").insert(newImpressions);
  }

  return NextResponse.json({ week, activeWomen: women.length, eligibleMen: men.length, sent });
}
