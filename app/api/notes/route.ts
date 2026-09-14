import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    let tag = searchParams.get("tag");
    const search = searchParams.get("search");

    if (tag === "All") {
      tag = "";
    }

    const params: Record<string, string> = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (tag) params.tag = tag;
    if (search) params.search = search;

    const response = await api.get("/notes", {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("GET Notes Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Error fetching notes" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected GET Notes Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();

    const response = await api.post("/notes", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("POST Note Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Error creating note" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected POST Note Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
