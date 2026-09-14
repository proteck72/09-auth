import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "set-cookie-parser";
import { api } from "@/app/api/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post("/auth/login", body);

    const cookieStore = await cookies();
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const parsedCookies = parseSetCookie(setCookieHeader);
      for (const cookie of parsedCookies) {
        cookieStore.set(cookie.name, cookie.value, {
          maxAge: cookie.maxAge,
          expires: cookie.expires,
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite as "strict" | "lax" | "none",
        });
      }
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Login failed" },
      { status: error.response?.status || 500 },
    );
  }
}
