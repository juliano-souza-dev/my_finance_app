
import { CategoryRepository } from "@/lib/repositories/CategoryRepository";
import { CategoryService } from "@/lib/services/CategoryService";
import { NextResponse } from "next/server";

const repository = new CategoryRepository();
const service = new CategoryService(repository)

export async function GET() {
  try {
    const categories = await service.get();
    console.log('===>', categories)
    return NextResponse.json(categories);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}


