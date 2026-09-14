import { create } from "zustand";

export interface DraftNote {
  title: string;
  content: string;
  tag: string;
}

export interface NoteState {
  draft: DraftNote;
  setDraftField: (field: keyof DraftNote, value: string) => void;
  resetDraft: () => void;
  // інші поля вашого стору...
}

const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Work",
};

export const useNoteStore = create<NoteState>((set) => ({
  draft: initialDraft,

  setDraftField: (field, value) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [field]: value,
      },
    })),

  resetDraft: () =>
    set({
      draft: initialDraft,
    }),
}));
