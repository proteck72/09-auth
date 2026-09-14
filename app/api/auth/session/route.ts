import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { parseCookie } from "cookie";
import { api } from "@/app/api/api";

export async function GET() {
  try {
    const cookieStore = await cookies();
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
        const parsed = parseCookie(cookieStr);
        for (const [name, value] of Object.entries(parsed)) {
          if (
            ![
              "path",
              "httponly",
              "samesite",
              "max-age",
              "expires",
              "domain",
            ].includes(name.toLowerCase()) &&
            value !== undefined
          ) {
            cookieStore.set(name, value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
          }
        }
      });
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Session Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Session invalid or expired" },
        { status: error.response?.status || 401 },
      );
    }
    console.error("Unexpected Session Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
