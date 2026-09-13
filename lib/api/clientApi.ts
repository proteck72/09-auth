import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

export interface AuthPayload {
  email: string;
  password: string;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export async function fetchNotes(params: FetchNotesParams = {}) {
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    { params },
  );
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: {
  title: string;
  content: string;
  tag: string;
}) {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(payload: AuthPayload) {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: AuthPayload) {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: Partial<User>) {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
