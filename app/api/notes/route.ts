import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/lib/api/api";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cookieStore = await cookies();

    const response = await api.get(`/notes?${searchParams.toString()}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("GET Notes Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Error fetching notes" },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();

    const response = await api.post("/notes", body, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("POST Note Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Error creating note" },
        { status: error.response?.status || 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
