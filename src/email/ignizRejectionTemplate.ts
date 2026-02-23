type Args = {
  name: string;
  round?: number;
};

function esc(s: any) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderIgnizRejectionEmail(args: Args) {
  const eventName = process.env.EVENT_NAME || "IGNIZ MUN";
  const orgName = process.env.ORG_NAME || "SSETMUN";
  const eventDate = process.env.EVENT_DATE || "26 February 2026";
  const venue = process.env.EVENT_VENUE || "Main Campus";

  const logoUrl = "https://i.ibb.co/ZRCgWkbP/Untitled-design-20260219-193546-0000.png";
  const whatsappLink = "https://chat.whatsapp.com/HgHb1FyH9WY4UMZrberqYV?mode=gi_t"; // optional: or remove if you want
  const name = esc(args.name || "Delegate");
  const round = args.round ?? 2;

  const subject = `${eventName} 2026 · Round ${round} Update`;

  const text =
    `${eventName} 2026 · Round ${round} Update\n\n` +
    `Hey ${name},\n\n` +
    `Thank you for registering for ${eventName} 2026.\n` +
    `After reviewing Round ${round} registrations and council capacity, we’re unable to confirm an allotment for you at this time.\n\n` +
    `This is not a judgement of your potential—committee capacities are limited and selections are competitive.\n\n` +
    `Event: ${eventDate}\n` +
    (venue ? `Venue: ${venue}\n\n` : "\n") +
    `If additional seats open up, we may reach out again.\n\n` +
    `Regards,\n${orgName}\n`;

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(eventName)} Round ${round} Update</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
      .card{border:1px solid rgba(212,175,55,0.28);border-radius:12px;overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,0.96);}
      .pill{display:inline-block;padding:8px 14px;border-radius:999px;border:1px solid rgba(212,175,55,0.55);background:rgba(0,0,0,0.45);font-family:'Cinzel',serif;letter-spacing:2px;font-size:11px;color:#f6d47b;text-transform:uppercase}
    </style>
  </head>
  <body style="margin:0;padding:0;background:#050001;color:#f7f5ef;font-family:'Lora', Georgia, serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0b0001;">
      <tr>
        <td align="center" style="padding:40px 14px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;" class="card">
            <tr>
              <td style="background: radial-gradient(circle at top, #3c0204 0%, #190001 55%, #060001 100%); padding:40px 30px;">
                <div style="text-align:center;margin-bottom:18px;">
                  <img src="${logoUrl}" width="92" style="border-radius:50%;border:2px solid #d4af37;box-shadow:0 0 22px rgba(212,175,55,0.5);" />
                  <div style="margin-top:14px" class="pill">Round ${round} Update</div>
                  <div style="font-family:'Cinzel',serif;font-size:28px;font-weight:800;color:#fff;margin-top:12px;">${esc(eventName)} 2026</div>
                  <div style="color:rgba(240,230,210,0.75);font-size:12px;letter-spacing:2px;text-transform:uppercase;">${esc(orgName)} Presents</div>
                </div>

                <div style="font-size:16px;line-height:1.7;color:#f7efe0;text-align:center;">
                  Dear <b style="color:#f6d47b;font-size:18px;">${name}</b>,<br/>
                  Thank you for registering for ${esc(eventName)} 2026.
                </div>

                <div style="margin-top:22px;padding:20px;border-radius:12px;border:1px dashed rgba(212,175,55,0.45);background:rgba(0,0,0,0.4);">
                  <div style="font-family:'Cinzel',serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d4af37;text-align:center;margin-bottom:12px;">
                    Decision
                  </div>
                  <div style="text-align:center;color:rgba(240,230,210,0.92);font-size:14px;line-height:1.7;">
                    After reviewing <b>Round ${round}</b> registrations and council capacity, we’re unable to confirm an allotment for you at this time.
                    <br/><br/>
                    This isn’t a judgement of your potential—seats are limited and selections are competitive.
                  </div>
                </div>

                <div style="margin-top:18px;text-align:center;color:rgba(240,230,210,0.85);font-size:12px;">
                  <b style="color:#f6d47b">${esc(eventDate)}</b><br/>
                  ${esc(venue)}
                </div>

                <div style="margin-top:18px;text-align:center;color:rgba(240,230,210,0.75);font-size:12px;line-height:1.6;">
                  If additional seats open up, we may reach out again.
                </div>

                <div style="margin-top:14px;text-align:center;font-size:11px;color:rgba(240,230,210,0.55);">
                  (Optional) Updates channel: <a href="${whatsappLink}" style="color:#d4af37;text-decoration:none;border-bottom:1px dotted #d4af37;">Delegate Updates</a>
                </div>

                <div style="margin-top:20px;text-align:center;font-size:11px;color:rgba(240,230,210,0.5);">
                  © ${new Date().getFullYear()} ${esc(orgName)}
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