"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./SidebarNotes.module.css";

const TAGS = [
  { name: "All notes", value: "all" },
  { name: "Todo", value: "Todo" },
  { name: "Work", value: "Work" },
  { name: "Personal", value: "Personal" },
  { name: "Meeting", value: "Meeting" },
  { name: "Shopping", value: "Shopping" },
];

export default function SidebarNotes() {
  const pathname = usePathname();

  return (
    <aside className={css.sidebar}>
      <ul className={css.list}>
        {TAGS.map((tag) => {
          const href = `/notes/filter/${tag.value}`;
          const isActive =
            pathname === href ||
            (tag.value === "all" && pathname.includes("/filter/all"));

          return (
            <li key={tag.value} className={css.item}>
              <Link
                href={href}
                className={`${css.link} ${isActive ? css.active : ""}`}
              >
                {tag.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}