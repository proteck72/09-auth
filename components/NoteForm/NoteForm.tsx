"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDraftStore } from "@/store/draftStore"; // або ваш кастомний хук чернетки

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Використовуємо глобальний стан чернетки
  const { title, content, tag, setField, resetDraft } = useDraftStore();

  const mutation = useMutation({
    mutationFn: async (newNote: {
      title: string;
      content: string;
      tag: string;
    }) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      resetDraft(); // Обов'язкове скидання глобальної чернетки
      router.push("/notes");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content, tag });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setField("title", e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setField("content", e.target.value)}
        placeholder="Content"
        required
      />
      <input
        type="text"
        value={tag}
        onChange={(e) => setField("tag", e.target.value)}
        placeholder="Tag"
      />
      <button type="button" onClick={() => router.back()}>
        Cancel
      </button>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
