import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: authHeader || "" },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Unauthorized" },
      { status: error.response?.status || 401 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      body,
      {
        headers: { Authorization: authHeader || "" },
      },
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Error updating user" },
      { status: error.response?.status || 400 },
    );
  }
}
