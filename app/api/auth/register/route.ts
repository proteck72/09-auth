import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post("/auth/register", body);

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const cookieStore = await cookies();
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      cookieArray.forEach((cookieStr) => {
        const parsed = parseSetCookie(cookieStr);
        if (parsed && parsed.name && typeof parsed.value === "string") {
          const { name, value, ...options } = parsed;
          cookieStore.set(name, value, options);
        }
      });
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: "Registration failed" },
        { status: error.response?.status || 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
