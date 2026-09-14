import { NextRequest, NextResponse } from "next/server";
import { api } from "@/app/api/api";

function logErrorResponse(error: any) {
  console.error("API Error:", error?.response?.data || error?.message || error);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await api.get(`/notes/${id}`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    logErrorResponse(error);
    const status = error.status || error.response?.status || 500;
    return NextResponse.json(
      {
        message: error.message || "Failed to fetch note",
        response: error.response?.data,
      },
      { status },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const response = await api.patch(`/notes/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    logErrorResponse(error);
    const status = error.status || error.response?.status || 500;
    return NextResponse.json(
      {
        message: error.message || "Failed to update note",
        response: error.response?.data,
      },
      { status },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const response = await api.delete(`/notes/${id}`, {
      headers: { Cookie: req.headers.get("cookie") || "" },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    logErrorResponse(error);
    const status = error.status || error.response?.status || 500;
    return NextResponse.json(
      {
        message: error.message || "Failed to delete note",
        response: error.response?.data,
      },
      { status },
    );
  }
}
