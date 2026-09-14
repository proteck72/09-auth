import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraftState {
  title: string;
  content: string;
  tag: string;
  setField: (field: "title" | "content" | "tag", value: string) => void;
  resetDraft: () => void;
}

const initialDraft = {
  title: "",
  content: "",
  tag: "",
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      ...initialDraft,
      setField: (field, value) =>
        set((state) => ({ ...state, [field]: value })),
      resetDraft: () => set(initialDraft),
    }),
    {
      name: "note-draft-storage",
    },
  ),
);
