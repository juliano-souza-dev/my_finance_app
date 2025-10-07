import { sheets_v4 } from "googleapis";

import { env } from "@/env"; // Assumindo que você usa o '@/env' para variáveis de ambiente
import db, { DatabaseType } from '../lib/db'
import { getGoogleSheetsClient } from "./google-sheet-api";
import { Category } from "./repositories/CategoryRepository";

export class DbSyncHelper {
    private sheetsClient: sheets_v4.Sheets | null = null;
    private db!: DatabaseType;
   
    constructor() {
        this.initSync();
    }
    private  async initSync() {
        this.db = db;
        this.sheetsClient = await getGoogleSheetsClient();
        await  this.syncCategories();
        this.syncEntries();
        this.updateLastSync()



    }
    static async sinc() {
         new DbSyncHelper();
    }

    private async syncCategories() {
          if (!this.sheetsClient) {
            console.error("Cliente Sheets não inicializado.");
            return;
    }
              try {
      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId: env.spreadsheetId, 
        range: `Categorias!A1:B20`,
      });

      const values = response.data.values;
      
      if (!values || values.length === 0) {
        return [];
      }

     
     
     const categories: Category[] = values.slice(1) 
            .map((row: string[]) => ({
                ID: String(row[0] || '').trim(), 
                name: String(row[1] || '').trim(), 
            }))
            .filter(cat => cat.name.length > 0)
    
     this.db.prepare("DELETE from categories").run();

      const statement =  this.db.prepare(
            `INSERT INTO categories (id, name) VALUES (?, ?)`
      );

      for(const category of categories) {
         statement.run(category.ID, category.name);
      }
    
    } catch (error) {
      console.error("Erro ao buscar categorias do Google Sheets:", error);
      return false;
    }
    }
    private syncEntries(){}
    private updateLastSync(){}

}