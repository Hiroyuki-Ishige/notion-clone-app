import { FC} from "react";
import { Item } from "./Item";
import { NoteList } from "../NoteList";
import UserItem from "./UserItem";
import { Plus, Search } from "lucide-react";
import { useNoteStore } from "@/modules/notes/note.state";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { noteRepository } from "@/modules/notes/note.repository";

type Props = {
  onSearchButtonClicked: () => void;
};

const SideBar: FC<Props> = ({ onSearchButtonClicked }) => {
  const { currentUser } = useCurrentUserStore();
  const noteStore = useNoteStore();

  const handleCreatTitle = async () => {
    try {
      if (!currentUser) {
        console.error("No authenticated user found.");
        return;
      }
      const newNote = await noteRepository.create(currentUser.id, {});
      console.log("Note created:", newNote);
      noteStore.set([newNote]); // Add the new note to the global state
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <>
      <aside className="group/sidebar h-full bg-neutral-100 overflow-y-auto relative flex flex-col w-60">
        <div>
          <div>
            <UserItem
              user={{
                id: "test",
                aud: "test",
                email: "test@gmail.com",
                user_metadata: { name: "testさん" },
                app_metadata: {},
                created_at: "test",
              }}
              signout={() => {}}
            />
            <Item
              label="Search"
              icon={Search}
              onClick={onSearchButtonClicked}
            />
          </div>
          <div className="mt-4">
            <NoteList />
            <Item 
            onClick={handleCreatTitle}
            label="Create Note" icon={Plus} />
          </div>
        </div>
      </aside>
      <div className="absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]"></div>
    </>
  );
};

export default SideBar;
