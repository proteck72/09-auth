import SidebarNotes from "@/components/SidebarNotes/SidebarNotes";
import css from "./layout.module.css";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        <SidebarNotes />
      </aside>
      <main className={css.mainContent}>{children}</main>
    </div>
  );
}