"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes } from "@/lib/api/clientApi";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, searchQuery, tag],
    queryFn: () => fetchNotes({ page, perPage: 12, search: searchQuery, tag }),
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Failed to load notes.</p>}

      {notes.length > 0 && <NoteList notes={notes} />}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
