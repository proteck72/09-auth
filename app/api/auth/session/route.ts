import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "set-cookie-parser";
import { api } from "@/app/api/api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 401 },
    );
  }

  try {
    const response = await api.get("/auth/session", {
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
    });

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
      error.response?.data || { message: "Session invalid" },
      { status: error.response?.status || 401 },
    );
  }
}
