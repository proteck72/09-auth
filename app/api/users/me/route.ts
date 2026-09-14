import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

export async function GET(req: NextRequest) {
  try {
    const response = await api.get("/users/me", {
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await api.patch("/users/me", body, {
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
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
