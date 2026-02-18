import { google } from "googleapis";
import { supabaseAdmin } from "@/src/lib/supabase";

function getSheetsClient(readonly: boolean) {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");

  const creds = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: readonly
      ? ["https://www.googleapis.com/auth/spreadsheets.readonly"]
      : ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const cell = (r: any[], i: number) => (r?.[i] ?? "").toString().trim();

type MapAny = Record<string, number>;

function parseMap(envKey: string, fallback: MapAny): MapAny {
  const raw = process.env[envKey];
  if (!raw) return fallback;
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return fallback;
    const out: MapAny = { ...fallback };
    for (const [k, v] of Object.entries(obj)) {
      const n = Number(v);
      if (Number.isFinite(n) && n >= 0) out[k] = n;
    }
    return out;
  } catch {
    return fallback;
  }
}

// ---------- IGNIZ (single-sheet) defaults ----------
// Adjust quickly via env: IGNIZ_COLUMN_MAP_JSON
const IGNIZ_DEFAULT_MAP = {
  timestamp: 0,
  full_name: 1,
  whatsapp: 2,
  college: 3,
  email: 4,
  country_pref1: 5,
  country_pref2: 6,
  country_pref3: 7,
  mun_experience: 8,
  pass_tier: 9,
};

// ---------- LEGACY (multi-round) mappings kept for compatibility ----------
const COL_PRIORITY = {
  timestamp: 0,
  full_name: 1,
  college: 2,
  course: 3,
  whatsapp: 4,
  email: 5,
  ca_code: 6,
  accommodation: 7,
  c1: 8,
  c1_p1: 9,
  c1_p2: 10,
  c1_p3: 11,
  c2: 12,
  c2_p1: 13,
  c2_p2: 14,
  c2_p3: 15,
  c3: 16,
  c3_p1: 17,
  c3_p2: 18,
  c3_p3: 19,
  mun_experience: 20,
};

const COL_FIRST = {
  timestamp: 0,
  full_name: 1,
  college: 3,
  course: 4,
  whatsapp: 5,
  email: 6,
  ca_code: 7,
  accommodation: 8,
  c1: 9,
  c1_p1: 10,
  c1_p2: 11,
  c1_p3: 12,
  c2: 13,
  c2_p1: 14,
  c2_p2: 15,
  c2_p3: 16,
  c3: 17,
  c3_p1: 18,
  c3_p2: 19,
  c3_p3: 20,
  mun_experience: 21,
};

const COL_LIGHTNING = {
  timestamp: 0,
  full_name: 1,
  college: 2,
  course: 3,
  whatsapp: 4,
  email: 5,
  ca_code: 6,
  mun_experience: 7,
  accommodation: 8,
  c1: 9,
  c1_p1: 10,
  c1_p2: 11,
  c1_p3: 12,
  c2: 13,
  c2_p1: 14,
  c2_p2: 15,
  c2_p3: 16,
  c3: 17,
  c3_p1: 18,
  c3_p2: 19,
  c3_p3: 20,
};

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roundParam = searchParams.get("round")?.trim() || "";

    // If IGNIZ sheet env exists, default to IGNIZ mode.
    const ignizSheetId = process.env.IGNIZ_SHEET_ID;
    const ignizSheetName = process.env.IGNIZ_SHEET_NAME;

    if (ignizSheetId && ignizSheetName) {
      const mapping = parseMap("IGNIZ_COLUMN_MAP_JSON", IGNIZ_DEFAULT_MAP);
      const sheets = getSheetsClient(true);

      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: ignizSheetId,
        range: `${ignizSheetName}!A1:AZ`,
      });

      const values = resp.data.values ?? [];
      if (values.length < 2) return Response.json({ ok: true, imported: 0 });

      const rows = values.slice(1);

      const payload = rows
        .filter((r) => cell(r, mapping.email))
        .map((r) => {
          const email = cell(r, mapping.email);
          const ts = cell(r, mapping.timestamp);
          const emailKey = email.split("@")[0].slice(0, 6);
          const tsTail = ts.replace(/\D+/g, "").slice(-8);
          const prefix = process.env.EVENT_PREFIX || "IG";

          const countries = [
            cell(r, mapping.country_pref1),
            cell(r, mapping.country_pref2),
            cell(r, mapping.country_pref3),
          ].filter(Boolean);

          return {
            reg_id: `${prefix}-${emailKey}-${tsTail}`,
            source_timestamp: ts,
            round: roundParam || "Main",

            full_name: cell(r, mapping.full_name),
            whatsapp: cell(r, mapping.whatsapp),
            email,

            college: cell(r, mapping.college),
            course: "",
            category: "Delegate",
            ca_code: "",

            mun_experience: cell(r, mapping.mun_experience),
            accommodation: "",

            pass_tier: cell(r, mapping.pass_tier),

            preferences: {
              country_preferences: countries,
            },
          };
        });

      const unique = new Map<string, any>();
      for (const row of payload) unique.set(row.email.toLowerCase(), row);

      const { error } = await supabaseAdmin.from("delegates").upsert([...unique.values()], {
        onConflict: "email",
      });
      if (error) throw error;

      return Response.json({ ok: true, imported: unique.size, mode: "igniz" });
    }

    // ----- Legacy mode (multi-round) -----
    const round = roundParam;
    if (!round || !["Priority", "First", "Lightning"].includes(round)) {
      throw new Error(
        "Missing or invalid round. Provide ?round=Priority|First|Lightning, or set IGNIZ_SHEET_ID+IGNIZ_SHEET_NAME for IGNIZ mode."
      );
    }

    const mapping = round === "Priority" ? COL_PRIORITY : round === "First" ? COL_FIRST : COL_LIGHTNING;

    const SHEET_ID =
      round === "Priority" ? process.env.PRIORITY_SHEET_ID : round === "First" ? process.env.FIRST_SHEET_ID : process.env.LIGHTNING_SHEET_ID;

    const SHEET_NAME =
      round === "Priority" ? process.env.PRIORITY_SHEET_NAME : round === "First" ? process.env.FIRST_SHEET_NAME : process.env.LIGHTNING_SHEET_NAME;

    if (!SHEET_ID || !SHEET_NAME) throw new Error("Missing sheet env vars");

    const sheets = getSheetsClient(true);

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:AZ`,
    });

    const values = resp.data.values ?? [];
    if (values.length < 2) return Response.json({ ok: true, imported: 0 });

    const rows = values.slice(1);

    const payload = rows
      .filter((r) => cell(r, mapping.email))
      .map((r) => {
        const email = cell(r, mapping.email);
        const ts = cell(r, mapping.timestamp);
        const emailKey = email.split("@")[0].slice(0, 6);
        const tsTail = ts.replace(/\D+/g, "").slice(-8);

        const prefix = round === "Priority" ? "PR" : round === "First" ? "FR" : "LR";

        return {
          reg_id: `${prefix}-${emailKey}-${tsTail}`,
          source_timestamp: ts,
          round,

          full_name: cell(r, mapping.full_name),
          whatsapp: cell(r, mapping.whatsapp),
          email,

          college: cell(r, mapping.college),
          course: cell(r, mapping.course),
          category: "Delegate",
          ca_code: cell(r, mapping.ca_code),

          mun_experience: cell(r, mapping.mun_experience),
          accommodation: cell(r, mapping.accommodation),

          preferences: {
            pref1: {
              committee: cell(r, mapping.c1),
              portfolios: [cell(r, mapping.c1_p1), cell(r, mapping.c1_p2), cell(r, mapping.c1_p3)].filter(Boolean),
            },
            pref2: {
              committee: cell(r, mapping.c2),
              portfolios: [cell(r, mapping.c2_p1), cell(r, mapping.c2_p2), cell(r, mapping.c2_p3)].filter(Boolean),
            },
            pref3: {
              committee: cell(r, mapping.c3),
              portfolios: [cell(r, mapping.c3_p1), cell(r, mapping.c3_p2), cell(r, mapping.c3_p3)].filter(Boolean),
            },
          },
          // NOTE: Status omitted to preserve existing "Allotted" statuses
        };
      });

    const unique = new Map<string, any>();
    for (const row of payload) unique.set(row.email.toLowerCase(), row);

    const { error } = await supabaseAdmin.from("delegates").upsert([...unique.values()], {
      onConflict: "email",
    });

    if (error) throw error;

    return Response.json({ ok: true, imported: unique.size, mode: "legacy" });
  } catch (e: any) {
    console.error(e);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
