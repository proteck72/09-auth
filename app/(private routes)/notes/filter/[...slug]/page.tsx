import type { Metadata } from "next";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "@/components/NotesClient/NotesClient";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filterName = slug?.[0] || "all";

  return {
    title: `Notes - ${filterName} | NoteHub`,
    description: `View and manage notes filtered by ${filterName}.`,
    openGraph: {
      title: `Notes - ${filterName} | NoteHub`,
      description: `View and manage notes filtered by ${filterName}.`,
      url: `https://notehub.com/notes/filter/${filterName}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Filter",
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { tag, page: 1, search: "" }],
    queryFn: () => fetchNotes({ tag, page: 1, search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}