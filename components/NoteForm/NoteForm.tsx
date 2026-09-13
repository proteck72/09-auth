"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api/clientApi";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose?: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState({
    title: "",
    content: "",
    tag: "Work",
  });

  const setDraftField = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDraft({ title: "", content: "", tag: "Work" });
      if (onClose) {
        onClose();
      } else {
        router.push("/notes");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(draft);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={draft.title}
          onChange={(e) => setDraftField("title", e.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={draft.content}
          onChange={(e) => setDraftField("content", e.target.value)}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={draft.tag}
          onChange={(e) => setDraftField("tag", e.target.value)}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Important">Important</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create Note"}
        </button>
        <button
          type="button"
          onClick={() => (onClose ? onClose() : router.back())}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
