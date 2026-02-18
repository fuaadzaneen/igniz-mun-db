import { supabaseAdmin } from "@/src/lib/supabase";
import { getFrom, getTransport } from "@/src/lib/mailer";
import { renderIgnizAllotmentEmail } from "@/src/email/ignizAllotmentTemplate";

export async function POST(req: Request) {
  const results: Array<{ id: string; ok: boolean; error?: string }> = [];

  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids.map(String) : [];
    const uniq = [...new Set(ids)].filter(Boolean);

    if (uniq.length === 0) throw new Error("Missing ids[]");

    const { data: delegates, error } = await supabaseAdmin
      .from("delegates")
      .select("id, full_name, email, reg_id, pass_tier, allotted_committee, allotted_portfolio")
      .in("id", uniq);

    if (error || !delegates) throw new Error("Failed to fetch delegates");

    const byId = new Map(delegates.map((d: any) => [String(d.id), d]));
    const ordered = uniq.map((x) => byId.get(x)).filter(Boolean) as any[];

    const transport = getTransport();
    const from = getFrom();

    for (const d of ordered) {
      try {
        if (!d.email) throw new Error("Missing email");
        if (!d.allotted_committee || !d.allotted_portfolio) {
          throw new Error("Allotment missing");
        }

        const mail = renderIgnizAllotmentEmail({
          name: d.full_name ?? "Delegate",
          committee: d.allotted_committee,
          country: d.allotted_portfolio,
          passTier: d.pass_tier,
          regId: d.reg_id,
        });

        await transport.sendMail({
          from,
          to: d.email,
          replyTo: process.env.REPLY_TO_EMAIL || undefined,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        });

        await supabaseAdmin
          .from("delegates")
          .update({
            email_status: "sent",
            email_sent_at: new Date().toISOString(),
            email_error: null,
          })
          .eq("id", d.id);

        results.push({ id: String(d.id), ok: true });
      } catch (e: any) {
        const msg = e?.message ?? "Send failed";

        await supabaseAdmin
          .from("delegates")
          .update({
            email_status: "failed",
            email_error: msg,
          })
          .eq("id", d.id);

        results.push({ id: String(d.id), ok: false, error: msg });
      }
    }

    return Response.json({
      ok: true,
      total: uniq.length,
      sent: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      results,
    });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? "Unknown error", results },
      { status: 400 }
    );
  }
}
