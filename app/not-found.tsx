import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "The page you are looking for does not exist.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "The page you are looking for does not exist.",
    url: "https://notehub.com/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 404",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page not found</h1>
      <p>Sorry, the page you requested could not be found.</p>
      <Link href="/notes/filter/all">Return to Notes</Link>
    </div>
  );
}