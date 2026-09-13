import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { api } from "@/lib/api/api";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();

    const response = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("GET Note Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Note not found" },
        { status: error.response?.status || 404 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const cookieStore = await cookies();

    const response = await api.patch(`/notes/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("PATCH Note Error:", error.response?.data || error.message);
      return NextResponse.json(
        error.response?.data || { message: "Error updating note" },
        { status: error.response?.status || 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();

    const response = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        "DELETE Note Error:",
        error.response?.data || error.message,
      );
      return NextResponse.json(
        error.response?.data || { message: "Error deleting note" },
        { status: error.response?.status || 400 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
