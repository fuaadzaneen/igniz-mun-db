type Args = {
  name: string;
  committee: string;
  country: string;
  passTier?: string | null;
  round?: number;
};

function esc(s: any) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderIgnizAllotmentRound2Email(args: Args) {
  const eventName = process.env.EVENT_NAME || "IGNIZ MUN";
  const orgName = process.env.ORG_NAME || "SSETMUN";
  const eventDate = process.env.EVENT_DATE || "26 February 2026";
  const venue = process.env.EVENT_VENUE || "Main Campus";

  const paymentLink = "https://snaptiqz.com/event/ignizmun";
  const whatsappLink = "https://chat.whatsapp.com/HgHb1FyH9WY4UMZrberqYV?mode=gi_t";
  const logoUrl = "https://i.ibb.co/ZRCgWkbP/Untitled-design-20260219-193546-0000.png";

  const pawanLink = "https://wa.me/+918075208923?text=";
  const hariLink = "https://wa.me/+918594085733?text=";

  const name = esc(args.name || "Delegate");
  const committee = esc(args.committee);
  const country = esc(args.country);
  const passTier = args.passTier ? esc(args.passTier) : "Silver";
  const round = args.round ?? 2;

  const subject = `${eventName} 2026 · Round ${round} Allotment Confirmed · ${args.committee} · ${args.country}`;

  const text =
    `${eventName} 2026 · Round ${round} Allotment Confirmed\n\n` +
    `Hey ${name},\n\n` +
    `You’ve been selected in Round ${round}. Your allotment is confirmed:\n` +
    `Committee: ${committee}\n` +
    `Portfolio/Country: ${country}\n` +
    `Pass: ${passTier}\n\n` +
    `Event Date: ${eventDate}\n` +
    (venue ? `Venue: ${venue}\n\n` : "\n") +
    `Payment Link: ${paymentLink}\n` +
    `WhatsApp Group: ${whatsappLink}\n\n` +
    `See you at committee.\n`;

  // Keep same vibe, but add a Round 2 badge at top
  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(eventName)} Round ${round} Allotment</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
      .cta:hover{filter:brightness(1.06)}
      .pill{display:inline-block;padding:8px 14px;border-radius:999px;border:1px solid rgba(212,175,55,0.55);background:rgba(0,0,0,0.45);font-family:'Cinzel',serif;letter-spacing:2px;font-size:11px;color:#f6d47b;text-transform:uppercase}
    </style>
  </head>
  <body style="margin:0;padding:0;background:#050001;color:#f7f5ef;font-family:'Lora', Georgia, serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0b0001;">
      <tr>
        <td align="center" style="padding:40px 14px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;border:1px solid rgba(212,175,55,0.28);border-radius:12px;overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,0.96);">
            <tr>
              <td style="background: radial-gradient(circle at top, #3c0204 0%, #190001 55%, #060001 100%); padding:40px 30px;">
                <div style="text-align:center;margin-bottom:18px;">
                  <img src="${logoUrl}" width="96" style="border-radius:50%;border:2px solid #d4af37;box-shadow:0 0 22px rgba(212,175,55,0.5);" />
                  <div style="margin-top:14px" class="pill">Round ${round} Selection</div>
                  <div style="font-family:'Cinzel',serif;font-size:28px;font-weight:800;color:#fff;margin-top:12px;">${esc(eventName)} 2026</div>
                  <div style="color:rgba(240,230,210,0.75);font-size:12px;letter-spacing:2px;text-transform:uppercase;">${esc(orgName)} Presents</div>
                </div>

                <div style="text-align:center;font-size:16px;line-height:1.6;color:#f7efe0;">
                  Dear <b style="color:#f6d47b;font-size:18px;">${name}</b>,<br/>
                  Your portfolio is officially secured in <b>Round ${round}</b>.
                </div>

                <div style="margin-top:26px;padding:22px;border-radius:12px;border:1px dashed rgba(212,175,55,0.45);background:rgba(0,0,0,0.4);">
                  <div style="font-family:'Cinzel',serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d4af37;text-align:center;margin-bottom:14px;">
                    Council Brief
                  </div>
                  <div style="text-align:center">
                    <div style="color:rgba(240,230,210,0.7);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Committee</div>
                    <div style="font-family:'Cinzel',serif;font-size:20px;font-weight:800;color:#fff;">${committee}</div>
                    <div style="height:12px"></div>
                    <div style="color:rgba(240,230,210,0.7);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Portfolio / Country</div>
                    <div style="font-family:'Cinzel',serif;font-size:20px;font-weight:800;color:#f6d47b;">${country}</div>
                    <div style="height:12px"></div>
                    <div style="color:rgba(240,230,210,0.7);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Pass Tier</div>
                    <div style="font-family:'Cinzel',serif;font-size:16px;font-weight:800;color:#ffd975;">${passTier}</div>
                  </div>
                </div>

                <div style="margin-top:22px;text-align:center;">
                  <a class="cta" href="${paymentLink}" style="display:inline-block;padding:14px 34px;border-radius:999px;text-decoration:none;font-family:'Cinzel',serif;font-weight:800;letter-spacing:2px;text-transform:uppercase;border:1px solid #f5cf64;color:#f9edc9;background:radial-gradient(circle at 50% 0,#f5cf64 0,#2a0000 55%,#050000 100%);box-shadow:0 0 22px rgba(245,207,100,0.7);">
                    Pay Now
                  </a>
                  <div style="margin-top:10px;color:rgba(240,230,210,0.75);font-size:11px;">Choose your tier and complete payment.</div>
                </div>

                <div style="height:1px;background:rgba(212,175,55,0.22);margin:26px 0;"></div>

                <div style="text-align:center;color:rgba(240,230,210,0.85);font-size:12px;">
                  <b style="color:#f6d47b">${esc(eventDate)}</b><br/>
                  ${esc(venue)}
                </div>

                <div style="margin-top:18px;text-align:center;">
                  <a href="${whatsappLink}" style="color:#d4af37;font-weight:bold;text-decoration:none;border-bottom:1px dotted #d4af37;">
                    Join the Official Delegate WhatsApp Group
                  </a>
                </div>

                <div style="margin-top:16px;text-align:center;font-size:12px;color:rgba(240,230,210,0.9);">
                  Queries: <a href="${pawanLink}" style="color:#f6d47b;text-decoration:none;border-bottom:1px dotted #f6d47b;font-weight:bold;">Pawan</a>
                  &nbsp;|&nbsp;
                  <a href="${hariLink}" style="color:#f6d47b;text-decoration:none;border-bottom:1px dotted #f6d47b;font-weight:bold;">Hari</a>
                </div>

                <div style="margin-top:20px;text-align:center;font-size:11px;color:rgba(240,230,210,0.5);">
                  © ${new Date().getFullYear()} ${esc(orgName)} · Show up prepared. Speak sharp. Leave unforgettable.
                </div>
                <div style="margin-top:20px;text-align:center;font-size:11px;color:rgba(240,230,210,0.5);">
                  Delegates can change their tier by selecting the appropriate tier in the ticket section
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