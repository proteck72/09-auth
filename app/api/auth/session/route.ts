import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/lib/api/api";
export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await api.get("/auth/session", {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Session Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Unauthorized" },
        { status: error.response?.status || 401 },
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
