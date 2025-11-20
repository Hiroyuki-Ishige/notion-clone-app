import { FC } from "react";
import { Item } from "./Item";
import { NoteList } from "../NoteList";
import UserItem from "./UserItem";
import { Plus, Search } from "lucide-react";
import { useNoteStore } from "@/modules/notes/note.state";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { noteRepository } from "@/modules/notes/note.repository";
import { useNavigate } from "react-router-dom";
import { authRepository } from "@/modules/auth/auth.repository";

type Props = {
  onSearchButtonClicked: () => void;
};

const SideBar: FC<Props> = ({ onSearchButtonClicked }) => {
  const currentUserStore  = useCurrentUserStore();
  const noteStore = useNoteStore();
  const navigate = useNavigate();
  

  const handleCreatTitle = async () => {
    try {
      if (!currentUserStore.currentUser) {
        console.error("No authenticated user found.");
        return;
      }
      const newNote = await noteRepository.create(currentUserStore.currentUser.id, {});
      console.log("Note created:", newNote);
      noteStore.set([newNote]); // Add the new note to the global state
      navigate(`/notes/${newNote.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authRepository.signOut();
      currentUserStore.set(null);
      noteStore.clear();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <>
      <aside className="group/sidebar h-full bg-neutral-100 overflow-y-auto relative flex flex-col w-60">
        <div>
          <div>
            <UserItem
              user={{
                id: currentUserStore.currentUser ? currentUserStore.currentUser.id : "",
                aud: "test",
                email: currentUserStore.currentUser ? currentUserStore.currentUser.email! : "",
                user_metadata: { name: currentUserStore.currentUser ? currentUserStore.currentUser.user_metadata.name : "" },
                app_metadata: {},
                created_at: currentUserStore.currentUser ? currentUserStore.currentUser.created_at : "",
              }}
              signout={handleSignOut}
            />
            <Item
              label="Search"
              icon={Search}
              onClick={onSearchButtonClicked}
            />
          </div>
          <div className="mt-4">
            <NoteList />
            <Item onClick={handleCreatTitle} label="Create Note" icon={Plus} />
          </div>
        </div>
      </aside>
      <div className="absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]"></div>
    </>
  );
};

export default SideBar;
