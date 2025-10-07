
import { EntryRepository } from "@/lib/repositories/entryRepository";
import { EntryService } from "@/lib/services/EntryService";
import { NextResponse } from "next/server";

const repository = new EntryRepository();
const service = new EntryService(repository);

export async function GET() {
  try {
    const entryRepository = new EntryRepository();
    const response = await entryRepository.getAll();
    return NextResponse.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const { date, category, description, status, type, value } =
      await request.json();
    await service.create({
      date,
      category,
      description,
      status,
      type,
      value,
    });

    return NextResponse.json({});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message });
    }
    return NextResponse.json({ message: "Erro interno", statusCode: 500 });
  }
}
