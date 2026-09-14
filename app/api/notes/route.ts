import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    const response = await api.get("/notes", {
      params: {
        page,
        perPage: 12,
        search,
        tag,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    logErrorResponse(error);
    return NextResponse.json(
      error.response?.data || { message: "Failed to fetch notes" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();

    const response = await api.post("/notes", body, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    logErrorResponse(error);
    return NextResponse.json(
      error.response?.data || { message: "Failed to create note" },
      { status: error.response?.status || 400 },
    );
  }
}
