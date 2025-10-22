import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './components/SideBar';
import { SearchModal } from './components/SearchModal';
import { useCurrentUserStore } from './modules/auth/current-user.state';
import { useNoteStore } from './modules/notes/note.state';
import { useEffect, useState } from 'react';
import { noteRepository } from './modules/notes/note.repository';


const Layout = () => {

const {currentUser} = useCurrentUserStore();
const noteStore = useNoteStore(); //use global note store
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  fetchNotes();
}, []); // Fetch notes on 1st component mount

const fetchNotes = async () => {
  if (!currentUser) return;

  setIsLoading(true);
  try {
    const notes = await noteRepository.find(currentUser!.id); //fetch notes from repository
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
  
// Set as Layout can be seen only longin user.
if(currentUser===null) return <Navigate to="/signin" />;

  return (
    <div className="h-full flex">
      {!isLoading ? <SideBar onSearchButtonClicked={() => {}} />: <LoadingSpinner />}
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
        <SearchModal
          isOpen={false}
          notes={[]}
          onItemSelect={() => {}}
          onKeywordChanged={() => {}}
          onClose={() => {}}
        />
      </main>
    </div>
  );
};

export default Layout;
