import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function POST(req: NextRequest) {
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
      const parsed = parseSetCookie(cookieStr);
      if (parsed) {
        cookieStore.set(parsed);
      }
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    logErrorResponse(error);
    return NextResponse.json(
      error.response?.data || { message: "Registration failed" },
      { status: error.response?.status || 400 },
    );
  }
}
