/*
  IGNIZ MUN allotment email (poster vibe): deep maroon + gold.
  Pure TS (no React) so it works in a Next.js route on Vercel.
*/

type Args = {
  name: string;
  committee: string;
  country: string;
  passTier?: string | null;
  regId?: string | null;
};

function esc(s: any) {
  return String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function renderIgnizAllotmentEmail(args: Args) {
  const eventName = process.env.EVENT_NAME || "IGNIZ MUN";
  const orgName = process.env.ORG_NAME || "IGNIZ SSET";
  const eventDate = process.env.EVENT_DATE || "26 February 2026";
  const venue = process.env.EVENT_VENUE || "";
  const supportEmail = process.env.SUPPORT_EMAIL || process.env.REPLY_TO_EMAIL || "";
  const supportWhatsApp = process.env.SUPPORT_WHATSAPP || "";
  const paymentNote = process.env.PAYMENT_NOTE || "";

  const name = esc(args.name || "Delegate");
  const committee = esc(args.committee);
  const country = esc(args.country);
  const passTier = args.passTier ? esc(args.passTier) : "";
  const regId = args.regId ? esc(args.regId) : "";

  const subject = `${eventName} Allotment · ${args.committee} · ${args.country}`;

  const text =
    `${eventName} — Allotment Confirmed\n` +
    `\n` +
    `Hi ${args.name || "Delegate"},\n` +
    `\n` +
    `Committee: ${args.committee}\n` +
    `Country/Portfolio: ${args.country}\n` +
    (args.passTier ? `Pass: ${args.passTier}\n` : "") +
    (args.regId ? `Reg ID: ${args.regId}\n` : "") +
    `\n` +
    `Event Date: ${eventDate}\n` +
    (venue ? `Venue: ${venue}\n` : "") +
    `\n` +
    (paymentNote ? `Payment: ${paymentNote}\n\n` : "") +
    `See you at ${eventName}!`;

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(eventName)} Allotment</title>
  </head>
  <body style="margin:0;padding:0;background:#0f0404;color:#f7f5ef;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${esc(eventName)} allotment confirmed — ${committee} · ${country}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0f0404;">
      <tr>
        <td align="center" style="padding:28px 14px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;border-collapse:separate;border-spacing:0;border:1px solid rgba(255,255,255,0.10);border-radius:22px;overflow:hidden;box-shadow:0 30px 120px rgba(0,0,0,0.65);">
            <tr>
              <td style="padding:0;">
                <div style="background:radial-gradient(900px 600px at 18% -10%, rgba(196,156,26,0.22), transparent 55%),radial-gradient(800px 520px at 115% 0%, rgba(100,8,4,0.65), transparent 60%),linear-gradient(180deg,#1b0505,#0f0404);padding:26px 24px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;border-radius:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);"></div>
                    <div>
                      <div style="font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(247,245,239,0.7);">${esc(orgName)}</div>
                      <div style="font-size:22px;font-weight:800;letter-spacing:0.2px;">${esc(eventName)} · Allotment Confirmed</div>
                    </div>
                  </div>

                  <div style="margin-top:18px;font-size:14px;line-height:1.7;color:rgba(247,245,239,0.86);">
                    Hey <b style="color:#f7f5ef;">${name}</b> — your allocation has been locked in.
                    Show up prepared. Speak sharp. Leave unforgettable.
                  </div>

                  <div style="height:1px;background:rgba(255,255,255,0.10);margin:18px 0;"></div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:0 0 12px 0;">
                        <div style="font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:rgba(247,245,239,0.65);">Your Allotment</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style="display:flex;flex-wrap:wrap;gap:10px;">
                          ${pill("Committee", committee)}
                          ${pill("Country / Portfolio", country)}
                          ${passTier ? pill("Pass", passTier) : ""}
                          ${regId ? pill("Reg ID", regId) : ""}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap;">
                    ${infoCard("Date", esc(eventDate))}
                    ${venue ? infoCard("Venue", esc(venue)) : ""}
                    ${paymentNote ? infoCard("Payment", esc(paymentNote)) : ""}
                  </div>

                  <div style="margin-top:18px;padding:14px;border-radius:16px;border:1px solid rgba(196,156,26,0.25);background:rgba(196,156,26,0.08);">
                    <div style="font-weight:800;color:#e8ca4b;">Quick checklist</div>
                    <ul style="margin:10px 0 0 18px;padding:0;color:rgba(247,245,239,0.86);line-height:1.7;">
                      <li>Start research + draft your opening speech.</li>
                      <li>Bring ID card + writing kit (and laptop if you use one).</li>
                      <li>Dress code: formal (unless your EB says otherwise).</li>
                    </ul>
                  </div>

                  <div style="margin-top:18px;font-size:12.5px;line-height:1.7;color:rgba(247,245,239,0.70);">
                    Need help? Reply to this email${supportEmail ? ` (${esc(supportEmail)})` : ""}${supportWhatsApp ? ` or WhatsApp: ${esc(supportWhatsApp)}` : ""}.
                  </div>

                  <div style="margin-top:14px;font-size:12px;color:rgba(247,245,239,0.50);">
                    © ${new Date().getFullYear()} ${esc(orgName)} · Sent by an automated system.
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return { subject, html, text };
}

function pill(label: string, value: string) {
  return `
    <div style="flex:0 1 auto;min-width:180px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,255,255,0.10);background:rgba(0,0,0,0.25);">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:rgba(247,245,239,0.60);">${esc(label)}</div>
      <div style="margin-top:6px;font-size:15px;font-weight:800;color:#f7f5ef;">${value}</div>
    </div>
  `;
}

function infoCard(label: string, value: string) {
  return `
    <div style="flex:1 1 160px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.04);">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:rgba(247,245,239,0.60);">${esc(label)}</div>
      <div style="margin-top:6px;font-size:13.5px;font-weight:700;color:rgba(247,245,239,0.92);line-height:1.5;">${value}</div>
    </div>
  `;
}
