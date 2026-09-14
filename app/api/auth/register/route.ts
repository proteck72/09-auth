import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { parseCookie } from "cookie";
import { api } from "@/app/api/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await api.post("/auth/register", body);

    const setCookieHeader = response.headers["set-cookie"];

    if (!setCookieHeader) {
      return NextResponse.json(
        { message: "Unauthorized: Missing set-cookie header" },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
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

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Register Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Registration failed" },
        { status: error.response?.status || 400 },
      );
    }
    console.error("Unexpected Register Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
