import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();

    const response = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        "GET Note by ID Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        error.response?.data || { message: "Error fetching note" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected GET Note Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const body = await req.json();

    const response = await api.patch(`/notes/${id}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("PATCH Note Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Error updating note" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected PATCH Note Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();

    const response = await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        "DELETE Note Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        error.response?.data || { message: "Error deleting note" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected DELETE Note Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
