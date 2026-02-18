import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div
        className="w-full max-w-4xl rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl p-10 shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
        style={{
          background:
            "radial-gradient(900px 600px at 20% -10%, rgba(196,156,26,0.15), transparent 55%), radial-gradient(800px 500px at 120% 0%, rgba(100,8,4,0.45), transparent 60%), rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
            <div>
              <div className="text-sm tracking-widest text-white/70">IGNIZ SSET</div>
              <div className="text-2xl font-extrabold text-white">IGNIZ MUN · Registration Ops</div>
            </div>
          </div>

          <p className="max-w-2xl text-white/80 leading-7">
            One place to sync registrations from Google Sheets, assign committee/country, and send polished allotment emails.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <Feature title="Sync" desc="Pull new registrations from your Google Sheet (no manual copy-paste)." />
            <Feature title="Allot" desc="Set committee + country for each delegate and track status." />
            <Feature title="Email" desc="Send creative allotment mails matching the IG poster vibe." />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-extrabold border border-[#c49c1a]/40 bg-[#c49c1a]/15 text-white hover:bg-[#c49c1a]/20 transition"
            >
              Open Dashboard
            </Link>
            <a
              href="/api/export/delegates"
              className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-extrabold border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 transition"
            >
              Export Delegates JSON
            </a>
          </div>

          <div className="pt-6 text-xs text-white/50">
            Tip: protect this site with a private Vercel deployment / password / firewall rules (no auth is included here).
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-[#e8ca4b] font-extrabold tracking-wide">{title}</div>
      <div className="text-white/80 text-sm leading-6 mt-2">{desc}</div>
    </div>
  );
}
