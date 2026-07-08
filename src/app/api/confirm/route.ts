import { supabase } from "@/lib/supabase";

// A man taps the link in his re-confirmation email: /api/confirm?m=<manId>
// This refreshes last_confirmed_at so he stays eligible, and reactivates him.
// MVP note: the token is just his id. Before real use, swap for a signed token.
export async function GET(req: Request) {
  const m = new URL(req.url).searchParams.get("m");
  if (!m) return html("Something's off with this link.", 400);

  const { error } = await supabase
    .from("men")
    .update({ last_confirmed_at: new Date().toISOString(), status: "active" })
    .eq("id", m);

  if (error) {
    console.error("confirm failed", error);
    return html("We couldn't update that just now. Try the link again shortly.", 500);
  }
  return html("You're confirmed. You'll stay in the weekly letter. You can close this tab.", 200);
}

function html(message: string, status: number) {
  const body = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <div style="font-family:Georgia,serif;background:#F4EDE1;color:#24201B;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">
    <p style="max-width:34ch;font-size:19px;line-height:1.5;text-align:center">${message}</p>
  </div>`;
  return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}
