import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(req.url);

    const pageParam = searchParams.get("page") || "1";
    const page = Number(pageParam);

    let tag = searchParams.get("tag") || "";
    if (tag === "All") {
      tag = "";
    }

    const search = searchParams.get("search") || "";

    const params: Record<string, unknown> = {
      page,
      perPage: 12,
    };

    if (search) {
      params.search = search;
    }

    if (tag) {
      params.tag = tag;
    }

    const response = await api.get("/notes", {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: "Failed to fetch notes" },
        { status: error.response?.status || 500 },
      );
    }
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
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    logErrorResponse(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: "Failed to create note" },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
