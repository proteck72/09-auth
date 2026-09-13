"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteNote } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => {
      toast.error("Failed to delete note.");
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <div>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
          </div>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deleteMutation.isPending}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
