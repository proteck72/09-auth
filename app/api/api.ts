import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/lib/api/api";
export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await api.get("/users/me", {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        "GET Profile Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        error.response?.data || { message: "Unauthorized" },
        { status: error.response?.status || 401 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();

    const response = await api.patch("/users/me", body, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        "PATCH Profile Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        error.response?.data || { message: "Error updating profile" },
        { status: error.response?.status || 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
