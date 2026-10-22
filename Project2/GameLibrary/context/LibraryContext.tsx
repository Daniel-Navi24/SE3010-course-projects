import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Game, GameStatus } from "../types/Game";
import { Prefs, DefaultFilter } from "../types/Prefs";
import {
  loadGames,
  loadPrefs,
  savePrefs,
  upsertGame,
  deleteGame,
} from "../utils/storage";

type LibraryContextValue = {
  games: Game[];
  prefs: Prefs;
  ready: boolean;
  filter: DefaultFilter;
  query: string;
  setFilter: (f: DefaultFilter) => void;
  setQuery: (q: string) => void;
  refresh: () => Promise<void>;
  saveGame: (game: Game) => Promise<void>;
  removeGame: (id: string) => Promise<void>;
  updatePrefs: (patch: Partial<Prefs>) => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [prefs, setPrefs] = useState<Prefs>({
    defaultFilter: "all",
    hapticsEnabled: true,
  });
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<DefaultFilter>("all");
  const [query, setQuery] = useState("");

  const refresh = async () => {
    const [g, p] = await Promise.all([loadGames(), loadPrefs()]);
    setGames(g);
    setPrefs(p);
    setFilter(p.defaultFilter);
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setReady(true);
    })();
  }, []);

  const saveGame = async (game: Game) => {
    await upsertGame(game);
    await refresh();
  };

  const removeGame = async (id: string) => {
    await deleteGame(id);
    await refresh();
  };

  const updatePrefs = async (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    await savePrefs(next);
    setPrefs(next);
    if (patch.defaultFilter) setFilter(patch.defaultFilter);
  };

  return (
    <LibraryContext.Provider
      value={{
        games,
        prefs,
        ready,
        filter,
        query,
        setFilter,
        setQuery,
        refresh,
        saveGame,
        removeGame,
        updatePrefs,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
