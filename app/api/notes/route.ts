import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get("authorization");
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notes?${searchParams.toString()}`,
      {
        headers: { Authorization: authHeader || "" },
      },
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Error fetching notes" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/notes`,
      body,
      {
        headers: { Authorization: authHeader || "" },
      },
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Error creating note" },
      { status: error.response?.status || 400 },
    );
  }
}
