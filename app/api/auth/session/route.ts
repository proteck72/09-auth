import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const response = await api.get("/auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      cookieArray.forEach((cookieStr) => {
        const parsed = parseSetCookie(cookieStr);
        if (parsed && parsed.name) {
          const { name, value, ...options } = parsed;
          cookieStore.set(name, value, options);
        }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: error.response?.data?.message || "Session error",
        },
        { status: error.response?.status || 200 },
      );
    }
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
