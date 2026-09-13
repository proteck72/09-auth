"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesClient.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag = "all" }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { tag, page, search }],
    queryFn: () => fetchNotes({ tag, page, search }),
  });

  return (
    <div className={css.container}>
      <div className={css.topBar}>
        <SearchBox
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
        {data && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.createBtn}>
          Create note +
        </Link>
      </div>

      {isLoading && <p className={css.loading}>Loading notes...</p>}
      {isError && <p className={css.error}>Failed to load notes.</p>}

      {data && <NoteList notes={data.notes} />}
    </div>
  );
}