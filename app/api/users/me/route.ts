import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/app/api/api";
import { logErrorResponse } from "@/app/api/helpers";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const response = await api.get("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
    logErrorResponse(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();

    const response = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
    logErrorResponse(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
