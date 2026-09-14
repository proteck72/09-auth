"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDraftStore } from "@/lib/store/draftStore";
import { createNote } from "@/lib/api/clientApi";

const TAG_OPTIONS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { title, content, tag, setField, resetDraft } = useDraftStore();

  const mutation = useMutation({
    mutationFn: async (newNote: {
      title: string;
      content: string;
      tag: string;
    }) => {
      return await createNote(newNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      resetDraft();
      router.push("/notes");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content, tag: tag || TAG_OPTIONS[0] });
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
      <select
        value={tag || TAG_OPTIONS[0]}
        onChange={(e) => setField("tag", e.target.value)}
      >
        {TAG_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => router.back()}>
        Cancel
      </button>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
