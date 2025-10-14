import { atom} from "jotai";
import { useAtom } from "jotai/react";
import { User } from "@supabase/supabase-js";

const currentUserAtom = atom<User | null>(null);

export const useCurrentUserStore = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
    return { currentUser, set: setCurrentUser };
};
