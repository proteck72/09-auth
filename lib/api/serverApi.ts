import { cookies } from "next/headers";
import { api } from "@/lib/api/api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

export const checkSession = async () => {
  const cookieStore = await cookies();
  const response = await api.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNotes = async (params?: Record<string, unknown>) => {
  const cookieStore = await cookies();
  const { data } = await api.get("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
