import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
      {
        headers: { Authorization: authHeader || "" },
      },
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Note not found" },
      { status: error.response?.status || 404 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`,
      {
        headers: { Authorization: authHeader || "" },
      },
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Error deleting note" },
      { status: error.response?.status || 400 },
    );
  }
}
