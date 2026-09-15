import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const tag = searchParams.get("tag") || "";
    const search = searchParams.get("search") || "";

    const params: Record<string, unknown> = {
      page,
      perPage: 12,
    };

    if (tag && tag !== "All") {
      params.tag = tag;
    }

    if (search) {
      params.search = search;
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
      const status = error.status
        ? Number(error.status)
        : error.response?.status || 400;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
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
      const status = error.status
        ? Number(error.status)
        : error.response?.status || 400;
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
