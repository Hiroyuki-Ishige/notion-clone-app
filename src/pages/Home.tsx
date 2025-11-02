import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { noteRepository } from "@/modules/notes/note.repository";
import { useNoteStore } from "@/modules/notes/note.state";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Home() {
  const [title, setTitle] = useState<string>("");
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();

  const handleCreatTitle = async () => {
    try {
      if (!currentUser) {
        console.error("No authenticated user found.");
        return;
      }
      const newNote = await noteRepository.create(currentUser.id, { title });
      console.log("Note created:", newNote);
      noteStore.set([newNote]); // Add the new note to the global state

      setTitle(""); // Clear the input field after creation
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <Card className="border-0 shadow-none w-1/2 m-auto">
      <CardHeader className="px-4 pb-3">
        <CardTitle className="text-lg font-medium">
          Let's create new note!
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            placeholder="Enter note title"
            type="text"
          />
          <button
            disabled={title.trim() === ""}
            onClick={handleCreatTitle}
            className={cn(
              "flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
              title.trim() !== "" && "hover:scale-105"
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1">Create Note</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
