import Link from "next/link";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <Link href="/" className={css.logo}>
          NoteHub
        </Link>
        <ul className={css.navList}>
          <li>
            <Link href="/notes/filter/all" className={css.navLink}>
              Notes
            </Link>
          </li>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}