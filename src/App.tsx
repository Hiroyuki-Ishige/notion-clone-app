import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { Home } from "./pages/Home";
import NoteDetail from "./pages/NoteDetail";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { authRepository } from "./modules/auth/auth.repository";
import { useEffect, useState } from "react";
import { useCurrentUserStore } from "./modules/auth/current-user.state";

// Main application component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const currentUserStore = useCurrentUserStore();

  useEffect(() => {
    setSession();
  }, []);

  // Check if there's an existing user session on app load
  const setSession = async () => {
    const currentUser = await authRepository.getCurrentUser();
    currentUserStore.set(currentUser ?? null);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="h-full">
        <Routes>
          {/* Layout can be seen only longin user. */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

//TODO Section 7: show detail of note.
