import { atom, useAtom } from "jotai";
import { Note } from "./note.entity";

const noteAtom = atom<Note[] | null>([]);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);

  // Set notes, ensuring no duplicates based on note ID
  const set = (newNotes: Note[]) => {
    setNotes((oldNotes) => {
      const combinedNotes = [...(oldNotes || []), ...newNotes];

      const uniqueNotes: { [key: number]: Note } = {}; //set type of uniqueNotes

      /*to remove duplicate notes based on their id(update old notes with new ones)
      //Object keys must be unique
      //When you assign uniqueNotes[note.id] = note, if the key already exists, it overwrites the previous value
      */
      for (const note of combinedNotes) {
        uniqueNotes[note.id] = note;
      }

      return Object.values(uniqueNotes);
    });
  };
  const getOne = (id: number) => notes?.find((note) => note.id === id);

  return {
    getAll: () => notes,
    set,
    getOne,
  };
};
