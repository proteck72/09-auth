import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
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
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
    logErrorResponse(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
