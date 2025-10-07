
import { sheets_v4 } from "googleapis";
import { getGoogleSheetsClient } from "../google-sheet-api";
import db, { DatabaseType } from "../db";
import { DbSyncHelper } from "../dbSyncHelper";


export type Category = {
  ID: string;
  name?: string; 
};


export class CategoryRepository {

  
  private sheetsClient: sheets_v4.Sheets | null = null;
  private db: DatabaseType;
  constructor() {
    this.initSheetsClient();
    this.db = db
  }

  private async initSheetsClient() {
    this.sheetsClient = await getGoogleSheetsClient();
  }



  async getAll(): Promise<Category[]> {
    if(!await this.cacheIsValid()) {
        await DbSyncHelper.sinc();
    }
  
    const stmt = db.prepare<[], Category>('SELECT * FROM categories');
    const categories = stmt.all(); 
    return categories;

}

private async cacheIsValid() {
    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000; // dois dias em milissegundos
    const lastSync = await  this.getLastSync();
    if(!lastSync)  {
        return false;
    }
    const isCacheExpired = Date.now() - lastSync > TWO_DAYS;
    if(isCacheExpired) {
        return false;
    }

    return true;

}

private async getLastSync(): Promise<number | null> {
  const result = this.db
    .prepare<[number], { last_sync: number }>(
      `SELECT last_sync FROM sync_info WHERE id = ?`
    )
    .get(1);

  return result ? result.last_sync : null;
}
}