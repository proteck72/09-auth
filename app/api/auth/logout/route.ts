import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const cookieHeader = [
      accessToken ? `accessToken=${accessToken}` : "",
      refreshToken ? `refreshToken=${refreshToken}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieHeader || cookieStore.toString(),
        },
      },
    );

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    if (isAxiosError(error)) {
      console.error("Logout Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Logout failed" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected Logout Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
