"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetailsClient.module.css";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p className={css.status}>Loading note details...</p>;
  }

  if (isError || !note) {
    return <p className={css.error}>Note not found or failed to load.</p>;
  }

  return (
    <div className={css.container}>
      <button
        type="button"
        className={css.backBtn}
        onClick={() => router.back()}
      >
        &larr; Back
      </button>

      <article className={css.card}>
        <div className={css.header}>
          <h1 className={css.title}>{note.title}</h1>
          {note.tag && <span className={css.tag}>{note.tag}</span>}
        </div>
        <p className={css.content}>{note.content}</p>
        {note.createdAt && (
          <span suppressHydrationWarning className={css.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </span>
        )}
      </article>
    </div>
  );
}
