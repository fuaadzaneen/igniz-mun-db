import { supabaseAdmin } from "@/src/lib/supabase";
import { getFrom, getTransport } from "@/src/lib/mailer";
import { renderIgnizAllotmentEmail } from "@/src/email/ignizAllotmentTemplate";

export async function POST(req: Request) {
  let id: string | null = null;

  try {
    const body = await req.json();
    id = body?.id ? String(body.id) : null;
    if (!id) throw new Error("Missing delegate id");

    const { data: d, error } = await supabaseAdmin
      .from("delegates")
      .select("id, full_name, email, reg_id, pass_tier, allotted_committee, allotted_portfolio")
      .eq("id", id)
      .single();

    if (error || !d) throw new Error("Delegate not found");
    if (!d.email) throw new Error("Delegate email missing");
    if (!d.allotted_committee || !d.allotted_portfolio) {
      throw new Error("Allotment missing (committee/country)");
    }

    const mail = renderIgnizAllotmentEmail({
      name: d.full_name ?? "Delegate",
      committee: d.allotted_committee,
      country: d.allotted_portfolio,
      passTier: d.pass_tier,
    });

    const transport = getTransport();
    const from = getFrom();

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
      .eq("id", id);

    return Response.json({ ok: true });
  } catch (e: any) {
    const msg = e?.message ?? "Unknown error";

    if (id) {
      await supabaseAdmin
        .from("delegates")
        .update({
          email_status: "failed",
          email_error: msg,
        })
        .eq("id", id);
    }

    return Response.json({ ok: false, error: msg }, { status: 400 });
  }
}
