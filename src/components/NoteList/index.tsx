import { cn } from "@/lib/utils";
import { NoteItem } from "./NoteItem";
import { useNoteStore } from "@/modules/notes/note.state";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { noteRepository } from "@/modules/notes/note.repository";
import { Note } from "@/modules/notes/note.entity";
import { useState } from "react";

interface NoteListProps {
  layer?: number;
  parentId?: number;
}

export function NoteList({ layer = 0, parentId }: NoteListProps) {
  const noteStore = useNoteStore();
  const notes = noteStore.getAll();
  const { currentUser } = useCurrentUserStore();
  const [expanded, setExpanded] = useState<Map<number, boolean>>(new Map());

  const createChild = async (e: React.MouseEvent, parentId: number) => {
    e.stopPropagation();
    if (!currentUser) return;

    // Create a new note with the specified parentId to supabase
    const newNote = await noteRepository.create(currentUser!.id, { parentId });

    // Add the new note to the note store
    noteStore.set([newNote]);
    setExpanded((prev)=> prev.set(parentId, true));
  };

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const children = await noteRepository.find(currentUser!.id, note.id); //fetch child (find data in database that has note.id in parent_document column)
    if (children == null) return;
    noteStore.set(children); //set fetched child notes to global store
    setExpanded((prev)=> {
      const newExpanded = new Map(prev);
      newExpanded.set(note.id, !(prev.get(note.id)));
      return newExpanded;
    });
  }

  return (
    <>
      <p
        className={cn(
          `hidden text-sm font-medium text-muted-foreground/80`,
          layer === 0 && "hidden"
        )}
        style={{ paddingLeft: layer ? `${layer * 12 + 25}px` : undefined }}
      >
        Page not exist
      </p>
      {notes &&
        notes.filter((note) => note.parent_document == parentId).
        map((note) => {
          return (
            <div key={note.id}>
              <NoteItem
                note={note}
                layer={layer}
                expanded={expanded.get(note.id)}
                onCreate={(e) => createChild(e, note.id)}
                onExpand={(e: React.MouseEvent) => fetchChildren(e, note)}
              />
              {expanded.get(note.id) && (<NoteList layer={layer + 1} parentId={note.id} />)}
              {/* <NoteList layer={layer + 1} parentId={note.id} /> */}
            </div>
          );
        })}
    </>
  );
}
