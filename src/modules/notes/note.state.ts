import { atom, useAtom } from "jotai";
import { Note } from "./note.entity";

const noteAtom = atom<Note[] | null>([]);
const selectedNoteIdAtom = atom<number | null>(null);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);

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

  const deleteNote = (id: number) => {
    const findChildrenIds = (parentId: number): number[] => {
      const childrenIds =
        notes
          ?.filter((note) => note.parent_document === parentId)
          .map((child) => child.id) || [];
      return childrenIds.concat(
        ...childrenIds.map((childId) => findChildrenIds(childId))
      );
    };
    const childrenIds = findChildrenIds(id);

    //setNotes that exludes deleted note and its children
    setNotes(
      (oldNotes) =>
        oldNotes?.filter((note) => ![...childrenIds, id].includes(note.id)) ||
        null
    );
  };

  const getOne = (id: number) => notes?.find((note) => note.id === id);
  const clear = () => {
    setNotes([]);
  };

  return {
    getAll: () => notes,
    set,
    getOne,
    delete: deleteNote,
    clear: clear,
    selectedNoteId,
    setSelectedNoteId,
  };
};
