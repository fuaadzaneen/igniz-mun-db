type Args = {
  name: string;
  committee: string;
  country: string;
  passTier?: string | null;
};

function esc(s: any) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderIgnizAllotmentEmail(args: Args) {
  const eventName = process.env.EVENT_NAME || "IGNIZ MUN";
  const orgName = process.env.ORG_NAME || "SSETMUN";
  const eventDate = process.env.EVENT_DATE || "26 February 2026";
  const venue = process.env.EVENT_VENUE || "Main Campus";

  // Links
  const paymentLink = "https://snaptiqz.com/event/ignizmun";
  const whatsappLink = "https://chat.whatsapp.com/HgHb1FyH9WY4UMZrberqYV?mode=gi_t";
  const logoUrl = "https://i.ibb.co/ZRCgWkbP/Untitled-design-20260219-193546-0000.png";

  const pawanLink = "https://wa.me/+918075208923?text=";
  const hariLink = "https://wa.me/+918594085733?text=";

  const name = esc(args.name || "Delegate");
  const committee = esc(args.committee);
  const country = esc(args.country);
  const passTier = args.passTier ? esc(args.passTier) : "Silver"; // default Silver

  const isGold = passTier.toLowerCase().includes("gold");
  const passDescription = isGold
    ? "Includes full access to IGNIZ MUN sessions AND the IGNIZ Proshow concert."
    : "Includes full access to IGNIZ MUN sessions only.";

  // Hotter subject line, no fake-confidential
  const subject = `IGNIZ MUN 2026 · Your Portfolio has Confirmed · ${args.committee} · ${args.country}`;

  const text =
    `IGNIZ MUN 2026 · Your Portfolio is Confirmed\n\n` +
    `Hey ${name},\n\n` +
    `Your committee and country are locked in.\n` +
    `Committee: ${committee}\n` +
    `Country/Portfolio: ${country}\n` +
    `Pass: ${passTier} (${passDescription})\n\n` +
    `Event Date: ${eventDate}\n` +
    (venue ? `Venue: ${venue}\n\n` : "\n") +
    `Grab your pass and complete payment here: ${paymentLink}\n\n` +
    `Join the Official Delegates WhatsApp Group: ${whatsappLink}\n\n` +
    `Show up prepared. Speak sharp. Leave unforgettable.\n`;

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(eventName)} Allotment</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');

      .cta-main:hover {
        background: radial-gradient(circle at 50% 0, #ffe9a8 0, #2a0000 55%, #000000 100%) !important;
        color: #f9f2d0 !important;
      }
      .ticket-pill:hover {
        border-color: #ffd87a !important;
        background: rgba(212, 175, 55, 0.14) !important;
      }
      .dossier:hover {
        border-color: #d4af37 !important;
        background: rgba(212, 175, 55, 0.09) !important;
      }
      .ghost-link:hover {
        color: #ffe699 !important;
      }

      @media (max-width: 480px) {
        .stack {
          display: block !important;
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#050001;color:#f7f5ef;font-family:'Lora', Georgia, serif;">
    <!-- Preheader -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Your IGNIZ MUN 2026 committee & country are locked. Tap to choose Silver or Gold tier.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0b0001;">
      <tr>
        <td align="center" style="padding:40px 14px;">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;border-collapse:separate;border-spacing:0;border:1px solid rgba(212, 175, 55, 0.28);border-radius:12px;overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,0.96);">
            <tr>
              <td style="padding:0;">
                <div style="background: radial-gradient(circle at top, #3c0204 0%, #190001 55%, #060001 100%); padding:40px 30px;">

                  <!-- HEADER / LOGO -->
                  <div style="text-align:center; margin-bottom: 28px;">
                    <img src="${logoUrl}" alt="${esc(eventName)} Logo" width="104" style="display:inline-block; margin-bottom: 18px; border-radius: 50%; border: 2px solid #d4af37; box-shadow: 0 0 22px rgba(212, 175, 55, 0.5);" />
                    <div style="font-family:'Cinzel', Times, serif; font-size:13px; letter-spacing:4px; text-transform:uppercase; color:#d4af37;">${esc(orgName)} PRESENTS</div>
                    <div style="font-family:'Cinzel', Times, serif; font-size:30px; font-weight:800; letter-spacing:1px; color:#ffffff; margin-top: 6px;">${esc(eventName)} 2026</div>
                    <div style="font-family:'Cinzel', Times, serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(240, 230, 210, 0.8); margin-top: 4px;">Model United Nations · Tech Fest Edition</div>
                  </div>

                  <!-- BIG DATE STRIP -->
                  <div style="margin-top:4px; margin-bottom:26px; text-align:center;">
                    <div style="font-family:'Cinzel', Times, serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(255, 230, 170, 0.85);">
                      Event Date
                    </div>
                    <div style="font-family:'Cinzel', Times, serif; font-size:22px; font-weight:800; letter-spacing:1px; color:#f6d47b; margin-top:4px;">
                      ${esc(eventDate)}
                    </div>
                    <div style="font-size:12px; color:rgba(240, 230, 210, 0.8); margin-top:2px;">
                      ${esc(venue)}
                    </div>
                    <div style="height: 2px; width: 70px; background: #d4af37; margin: 14px auto 0;"></div>
                  </div>

                  <!-- INTRO -->
                  <div style="font-size:16px; line-height:1.6; color:#f7efe0; text-align: center;">
                    Dear <b style="color:#f6d47b; font-size: 18px;">${name}</b>,<br>
                    Your portfolio has been officially secured.
                  </div>

                  <!-- DOSSIER BLOCK (NO PASS TIER LINE) -->
                  <div class="dossier" style="margin-top:28px; padding:25px; border-radius:12px; border:1px dashed rgba(212, 175, 55, 0.45); background:rgba(0,0,0,0.4); transition: all 0.3s ease;">
                    <div style="font-family:'Cinzel', Times, serif; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#d4af37; text-align: center; margin-bottom: 18px;">
                      [ Council Brief ]
                    </div>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 15px;">
                          <div style="font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(240, 230, 210, 0.7);">Committee</div>
                          <div style="font-family:'Cinzel', Times, serif; font-size:20px; font-weight:800; color:#ffffff;">${committee}</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div style="font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(240, 230, 210, 0.7);">Portfolio / Country</div>
                          <div style="font-family:'Cinzel', Times, serif; font-size:20px; font-weight:800; color:#f6d47b;">${country}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- TICKET CHOICE + CREEPY CTA -->
                  <div style="margin-top:34px; padding:22px 18px; border-radius:14px; background: radial-gradient(circle at top, rgba(212,175,55,0.32), transparent 68%); border:1px solid rgba(212, 175, 55, 0.34);">
                    <div style="font-family:'Cinzel', Times, serif; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#ffe699; text-align:center; margin-bottom:14px;">
                      Choose Your Tier
                    </div>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Silver pill -->
                        <td class="stack" style="text-align:center; padding:6px 4px;">
                          <div class="ticket-pill" style="display:inline-block; padding:11px 20px; border-radius:999px; border:1px solid rgba(200,200,200,0.9); background:rgba(0,0,0,0.65);">
                            <div style="font-family:'Cinzel', Times, serif; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; color:#e4e4e4;">Silver</div>
                            <div style="font-size:11px; color:rgba(240,230,210,0.85); margin-top:2px;">MUN access only · ₹300</div>
                          </div>
                        </td>

                        <!-- Gold pill -->
                        <td class="stack" style="text-align:center; padding:6px 4px;">
                          <div class="ticket-pill" style="display:inline-block; padding:11px 20px; border-radius:999px; border:1px solid rgba(212,175,55,0.98); background:linear-gradient(135deg, #3c0000, #900000); box-shadow:0 0 16px rgba(212,175,55,0.45);">
                            <div style="font-family:'Cinzel', Times, serif; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; color:#ffd975;">Gold</div>
                            <div style="font-size:11px; color:rgba(255,241,200,0.92); margin-top:2px;">MUN + Proshow concert · ₹450</div>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align:center; margin-top:20px;">
                      <a href="${paymentLink}" class="cta-main" style="display:inline-block; padding: 16px 40px; background: radial-gradient(circle at 50% 0, #f5cf64 0, #2a0000 55%, #050000 100%); color: #f9edc9; font-family:'Cinzel', Times, serif; font-weight: 800; font-size: 15px; text-decoration: none; border-radius: 999px; text-transform: uppercase; letter-spacing: 2px; border: 1px solid #f5cf64; box-shadow: 0 0 22px rgba(245, 207, 100, 0.7);">
                        Pay Now!!
                      </a>
                      <div style="font-size:11px; color:rgba(240, 230, 210, 0.75); margin-top:8px;">
                        Proceeds to Snaptiqz to choose your pass and complete payment.
                      </div>
                    </div>
                  </div>

                  <!-- SEPARATOR -->
                  <div style="height:1px; background:rgba(212, 175, 55, 0.22); margin:32px 0;"></div>

                  <!-- BIG CENTERED DATE + VENUE -->
                  <div style="text-align:center; padding:24px 18px; border-radius:14px; border:1px solid rgba(212,175,55,0.3); background:rgba(0,0,0,0.55); margin-bottom:22px;">
                    <div style="font-family:'Cinzel', Times, serif; font-size:12px; letter-spacing:3px; text-transform:uppercase; color:rgba(255, 230, 170, 0.9); margin-bottom:4px;">
                      Event Date & Venue
                    </div>
                    <div style="font-family:'Cinzel', Times, serif; font-size:20px; font-weight:800; color:#f6d47b; margin-bottom:4px;">
                      ${esc(eventDate)}
                    </div>
                    <div style="font-family:'Cinzel', Times, serif; font-size:15px; font-weight:700; color:#f6d47b;">
                      ${esc(venue)}
                    </div>
                  </div>

                  <!-- WHATSAPP BOX (CUTE) -->
                  <div style="text-align:center; padding:16px 18px; border-radius:999px; border:1px dashed rgba(212,175,55,0.7); background:rgba(0,0,0,0.6); margin-bottom:10px;">
                    <a href="${whatsappLink}" class="ghost-link" style="color: #d4af37; font-weight: bold; text-decoration: none; border-bottom: 1px dotted #d4af37;">
                      Join the Official Delegate WhatsApp Group
                    </a>
                    <span style="font-size:12px; color:rgba(240, 230, 210, 0.8);">
                      &nbsp;for live updates and crucial last-minute info.
                    </span>
                  </div>

                  <!-- CONTACTS BOX -->
                  <div style="text-align:center; padding:16px 18px; border-radius:999px; border:1px solid rgba(212,175,55,0.6); background:rgba(0,0,0,0.7); margin-bottom:6px; font-size:12px; color:rgba(240,230,210,0.9);">
                    For any queries, contact&nbsp;
                    <a href="${pawanLink}" class="ghost-link" style="color:#f6d47b; font-weight:bold; text-decoration:none; border-bottom:1px dotted #f6d47b;">
                      Pawan (Sec Gen)
                    </a>
                    &nbsp;or&nbsp;
                    <a href="${hariLink}" class="ghost-link" style="color:#f6d47b; font-weight:bold; text-decoration:none; border-bottom:1px dotted #f6d47b;">
                      Hari (Dep Sec Gen)
                    </a>.
                  </div>

                  <!-- FOOTER / FUN CLICKER-TEXT -->
                  <div style="margin-top:24px; text-align:center; font-family: Arial, sans-serif; font-size:11px; color:rgba(240, 230, 210, 0.5);">
                    © ${new Date().getFullYear()} ${esc(orgName)}<br>
                    Show up prepared. Speak sharp. Leave unforgettable.
                    <br><br>
                    <a href="${paymentLink}" style="color:rgba(212,175,55,0.9); text-decoration:none; border-bottom:1px dotted rgba(212,175,55,0.7); font-size:10px;">
                      P.S. If you reached this line,what are you even waiting for.
                    </a>
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

function infoCard(label: string, value: string) {
  return `
    <div style="flex:1 1 140px; padding:15px; border-radius:4px; border:1px solid rgba(212, 175, 55, 0.2); background:rgba(0,0,0,0.2); text-align: center;">
      <div style="font-family: Arial, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:rgba(240, 230, 210, 0.5);">${esc(label)}</div>
      <div style="margin-top:8px; font-family:'Cinzel', Times, serif; font-size:15px; font-weight:700; color:#f6d47b;">${value}</div>
    </div>
  `;
}
