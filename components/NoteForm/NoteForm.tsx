"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose?: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNote({
        title: draft.title || "",
        content: draft.content || "",
        tag: (draft.tag || "Todo") as Note["tag"],
      });
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      if (onClose) {
        onClose();
      } else {
        router.push("/notes/filter/all");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={draft.title || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={draft.content || ""}
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={draft.tag || "Todo"}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" onClick={handleCancel} className={css.cancelBtn}>
          Cancel
        </button>
        <button type="submit" className={css.submitBtn}>
          Create note
        </button>
      </div>
    </form>
  );
}
