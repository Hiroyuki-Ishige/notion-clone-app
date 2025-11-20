import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Note } from "@/types/note";
//import { on } from "events";
import { useDebouncedCallback } from "use-debounce";
//import { NoteList } from "./NoteList";
//import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  isOpen: boolean;
  notes: Note[];
  onItemSelect: (noteId: number) => void;
  onKeywordChanged: (keyword: string) => void;
  onClose: () => void;
}

export function SearchModal({
  isOpen,
  notes,
  onItemSelect,
  onKeywordChanged,
  onClose,
}: SearchModalProps) {
  const debounced = useDebouncedCallback(onKeywordChanged, 250);

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={"Search notes..."}
          onValueChange={debounced}
        />
        <CommandList>
          <CommandEmpty>No notes match your search</CommandEmpty>
          <CommandGroup>
            {notes?.map((note) => (
              <CommandItem
                key={note.id}
                title={note.title || "No Title"}
                onSelect={() => onItemSelect(note.id)}
              >
                <span>{note.title || "No Title"}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
