"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteCard.module.css";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <div className={css.card}>
      <div className={css.header}>
        <h3 className={css.title}>{note.title}</h3>
        <span className={css.tag}>{note.tag}</span>
      </div>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <Link href={`/notes/${note.id}`} className={css.link}>
          Details
        </Link>
        <button
          className={css.button}
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          type="button"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}