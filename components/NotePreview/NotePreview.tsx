import Link from "next/link";
import css from "./NotePreview.module.css";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}

interface NotePreviewProps {
  note: Note;
}

export default function NotePreview({ note }: NotePreviewProps) {
  return (
    <article className={css.card}>
      <div>
        <h3 className={css.title}>{note.title}</h3>
        <p className={css.content}>{note.content}</p>
      </div>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
        <Link href={`/notes/${note.id}`} className={css.link}>
          Details
        </Link>
      </div>
    </article>
  );
}