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
