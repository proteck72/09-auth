import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/lib/api/api";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await api.post("/auth/register", body);

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
      console.error("Register Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Registration failed" },
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
