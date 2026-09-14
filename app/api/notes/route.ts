import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const tag = searchParams.get("tag") || "";

    const response = await api.get("/notes", {
      params: {
        search,
        page,
        tag,
        perPage: 12,
      },
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Failed to fetch notes" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post("/notes", body, {
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Failed to create note" },
      { status: error.response?.status || 500 },
    );
  }
}
