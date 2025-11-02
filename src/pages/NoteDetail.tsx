import { TitleInput } from "@/components/TitleInput";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { noteRepository } from "@/modules/notes/note.repository";
import { useNoteStore } from "@/modules/notes/note.state";
import { title } from "process";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NoteDetail = () => {
  const params = useParams();
  const id = parseInt(params.id!);
  const { currentUser } = useCurrentUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const noteStore = useNoteStore();
  const note = noteStore.getOne(id);

  useEffect(() => {
    fetchOne();
  }, [id]);

  const fetchOne = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const fetchedNote = await noteRepository.findOne(currentUser.id, id);
      if (fetchedNote == null) return;
      noteStore.set([fetchedNote]);
    } catch (error) {
      console.error("Error fetching note:", error);
    } finally {
      setIsLoading(false);
    }
    
    console.log("note detail:", note);
  };

  const updateNote= async (id: number, note: { title?: string; content?: string }) => {
    try {
      const updatedNote = await noteRepository.update(id, note);
      if(updatedNote == null) return;
      noteStore.set([updatedNote]);
      return updatedNote
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  if (note == null) {
      return <div>Note not found</div>;
    }

  return (
    <div className="pb-40 pt-20">
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TitleInput initialData={note} onTitleChange={(newTitle) => updateNote(id, { title: newTitle })} />
      </div>
    </div>
  );
};

export default NoteDetail;
