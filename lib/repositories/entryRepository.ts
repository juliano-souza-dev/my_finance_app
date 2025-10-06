import { sheets_v4 } from "googleapis";
import { getGoogleSheetsClient } from "../google-sheet-api";
import { env } from "@/env";



export type Entry = {
  id: string; // TEXT PRIMARY KEY
  date: string; // pode ser ISO string (ex: "2025-09-29")
  description: string;
  category: string;
  value: number;
  type: string; // ex: "income" | "expense"
  status: string; // ex: "pending" | "paid"
};

export class EntryRepository {
  private sheetsClient: sheets_v4.Sheets | null = null;

  constructor() {
    this.initSheetsClient();
  }

  async getAll() {}

  async create({
    id,
    date,
    description,
    category,
    value,
    type,
    status,
  }: Entry): Promise<void> {
    const rowData = [id, date, description, category, value, type, status];
    const requestBody = {
      values: [rowData],
    };
    console.log(rowData);
    const range = "A:G";

    this.sheetsClient?.spreadsheets.values.append({
      spreadsheetId: env.spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody,
    });
  }

  private lastSync() {}
  private async initSheetsClient() {
    this.sheetsClient = await getGoogleSheetsClient();
  }
}
