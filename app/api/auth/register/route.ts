import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      body,
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Internal Server Error" },
      { status: error.response?.status || 500 },
    );
  }
}
