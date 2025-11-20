import { Navigate, Outlet, useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import { SearchModal } from "./components/SearchModal";
import { useCurrentUserStore } from "./modules/auth/current-user.state";
import { useNoteStore } from "./modules/notes/note.state";
import { useEffect, useState } from "react";
import { noteRepository } from "./modules/notes/note.repository";
//import { no } from "@blocknote/core/locales";
import { Note } from "./modules/notes/note.entity";
//import { setServers } from "dns";
import { subscribe, unsubscribe } from "./lib/supabase";

const Layout = () => {
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore(); //use global note store
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchResult, setSearchResult] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
    const chanel = subscribeNote();
    return () => {
      unsubscribe(chanel!);
    };
  }, []); // Fetch notes on 1st component mount

  const subscribeNote = () => {
    if (currentUser == null) return;
    return subscribe(currentUser!.id, (payload) => {
      console.log("Received payload:", payload);
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        noteStore.set([payload.new]); // Add or update the note in the global store
      } else if (payload.eventType === "DELETE") {
        noteStore.delete(payload.old.id!); // Remove the note from the global store
      }
    });
  };

  const fetchNotes = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const notes = await noteRepository.find(currentUser!.id); //fetch notes that has currentUser id.
      if (notes == null) return;
      noteStore.set(notes); //set notes to global store
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
    </div>
  );

  const handleSearchButtonClicked = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
    setSearchResult([]);
  };

  const searchNotes = async (keyword: string) => {
    if (!currentUser) return;

    const notes = await noteRepository.findByKeyword(currentUser.id, keyword);
    if (notes == null) return;
    setSearchResult(notes);
    noteStore.set(notes || []);
  };

  // Set as Layout can be seen only longin user.
  if (currentUser === null) return <Navigate to="/signin" />;

  const moveToDetail = async (noteId: number) => {
    try {
      console.log("Attempting navigation to:", `/notes/${noteId}`);
      noteStore.setSelectedNoteId(noteId);
      navigate(`/notes/${noteId}`);
      console.log("Navigation command sent successfully");
    } catch (error) {
      console.error("Navigation error:", error);
    }
    setIsShowModal(false);
    setSearchResult([]);
  };

  return (
    <div className="h-full flex">
      {!isLoading ? (
        <SideBar onSearchButtonClicked={handleSearchButtonClicked} />
      ) : (
        <LoadingSpinner />
      )}
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
        <SearchModal
          isOpen={isShowModal}
          notes={searchResult}
          onItemSelect={moveToDetail}
          onKeywordChanged={searchNotes}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
};

export default Layout;
