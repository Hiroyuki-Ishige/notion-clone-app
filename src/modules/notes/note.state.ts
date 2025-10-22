import { atom, useAtom } from "jotai";
import { Note } from "./note.entity";

const noteAtom = atom<Note[] | null>([]);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);

  const set = (newNotes: Note[]) => {
    setNotes((oldNotes) => {
      const combinedNotes = [...(oldNotes || []), ...newNotes];

      const uniqueNotes: { [key: number]: Note } = {}; //set type of uniqueNotes

      for (const note of combinedNotes) {
        uniqueNotes[note.id] = note;
      }

      return Object.values(uniqueNotes);
    });
  };

  return {
    getAll: () => notes,
    set,
  };
};
