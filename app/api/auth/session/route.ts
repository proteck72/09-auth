import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
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
        if (parsed) {
          cookieStore.set(parsed);
        }
      });
    }

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 200 },
    );
  } catch (error: any) {
    logErrorResponse(error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
