"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading && <p>Loading...</p>}
      {isError || !note ? (
        <p>Something went wrong.</p>
      ) : (
        <div className={css.container}>
          <h2 className={css.title}>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            Created at: {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </Modal>
  );
}