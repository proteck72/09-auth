import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
}

export async function fetchNotes(
  params: {
    page?: number;
    perPage?: number;
    search?: string;
    tag?: string;
  } = {},
) {
  const headers = await getAuthHeaders();
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      headers,
    },
  );
  return data;
}

export async function fetchNoteById(id: string) {
  const headers = await getAuthHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
}

export async function getMe() {
  const headers = await getAuthHeaders();
  const { data } = await api.get<User>("/users/me", { headers });
  return data;
}

export async function checkSession() {
  const headers = await getAuthHeaders();
  const { data } = await api.get<User | null>("/auth/session", { headers });
  return data;
}
