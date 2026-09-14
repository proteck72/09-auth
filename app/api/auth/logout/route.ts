import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/app/api/api";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  try {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
      },
    );
  } catch {}

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );
}
