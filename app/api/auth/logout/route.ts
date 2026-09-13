import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/lib/api/api";
export async function POST() {
  try {
    const cookieStore = await cookies();
    const response = await api.post(
      "/auth/logout",
      {},
      { headers: { Cookie: cookieStore.toString() } },
    );

    const res = NextResponse.json(response.data);
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      setCookieHeader.forEach((cookieStr) => {
        res.headers.append("Set-Cookie", cookieStr);
      });
    }

    return res;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Logout Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Logout failed" },
        { status: error.response?.status || 500 },
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
