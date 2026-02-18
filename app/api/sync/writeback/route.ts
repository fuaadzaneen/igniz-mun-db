import { google } from "googleapis";
import { supabaseAdmin } from "@/src/lib/supabase";

function getSheetsClientRW() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON in .env.local");

  const creds = JSON.parse(raw);

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // read + write
  });

  return google.sheets({ version: "v4", auth });
}

const cell = (row: any[], idx: number) => (row?.[idx] ?? "").toString().trim();

function parseNum(s: any, fallback: number) {
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

export async function POST() {
  try {
    // Prefer IGNIZ env (single sheet), fallback to legacy env
    const sheetId = process.env.IGNIZ_SHEET_ID || process.env.SHEET_ID;
    const sheetName = process.env.IGNIZ_SHEET_NAME || process.env.REG_SHEET_NAME;

    if (!sheetId) throw new Error("Missing IGNIZ_SHEET_ID (or SHEET_ID) in .env.local");
    if (!sheetName) throw new Error("Missing IGNIZ_SHEET_NAME (or REG_SHEET_NAME) in .env.local");

    // Which column contains EMAIL in your Google Sheet (0-based)
    const emailCol = parseNum(process.env.WRITEBACK_EMAIL_COL, 3);

    // Where to write back the 4 columns (W:X:Y:Z by default)
    // Write range is computed as startColLetter..(start+3)
    const startCol = (process.env.WRITEBACK_START_COL || "W").toUpperCase();

    const sheets = getSheetsClientRW();

    // 1) Read sheet rows
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:AZ`,
    });

    const values = resp.data.values ?? [];
    if (values.length < 2) {
      return Response.json({ ok: true, updated: 0, note: "No rows found" });
    }

    const rows = values.slice(1);

    // Map email -> sheet row number (Google Sheets is 1-based; + header => start at 2)
    const emailToRowNum = new Map<string, number>();
    rows.forEach((r, i) => {
      const em = cell(r, emailCol).toLowerCase();
      if (!em) return;
      emailToRowNum.set(em, i + 2);
    });

    // 2) Pull delegates data from Supabase that we want to write back
    const { data, error } = await supabaseAdmin
      .from("delegates")
      .select("email, allotted_committee, allotted_portfolio, status, allotted_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const updates: { range: string; values: any[][] }[] = [];

    // helper for column letters
    const colToNum = (c: string) => c.charCodeAt(0) - 64; // A=1
    const numToCol = (n: number) => String.fromCharCode(64 + n);

    const start = colToNum(startCol);
    const end = start + 3;

    for (const d of data ?? []) {
      const email = (d.email ?? "").toLowerCase().trim();
      if (!email) continue;

      const rowNum = emailToRowNum.get(email);
      if (!rowNum) continue;

      updates.push({
        range: `${sheetName}!${numToCol(start)}${rowNum}:${numToCol(end)}${rowNum}`,
        values: [[d.allotted_committee ?? "", d.allotted_portfolio ?? "", d.status ?? "", d.allotted_at ?? ""]],
      });
    }

    if (updates.length === 0) {
      return Response.json({ ok: true, updated: 0, note: "Nothing to write back" });
    }

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: updates,
      },
    });

    return Response.json({ ok: true, updated: updates.length });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
