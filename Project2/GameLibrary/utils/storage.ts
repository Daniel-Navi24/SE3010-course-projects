import { Session } from "../types/Session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Game } from "../types/Game";
import { Prefs, DefaultFilter } from "../types/Prefs";

const GAMES_KEY = "@gamelibrary/games";
const PREFS_KEY = "@gamelibrary/prefs";

export const DEFAULT_PREFS: Prefs = {
  defaultFilter: "all",
  hapticsEnabled: true,
};

// ---- GAMES ----

export async function loadGames(): Promise<Game[]> {
  try {
    const raw = await AsyncStorage.getItem(GAMES_KEY);
    if (!raw) return [];
    const list: Game[] = JSON.parse(raw);
    return list.sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  } catch (err) {
    console.warn("Failed to load games:", err);
    return [];
  }
}

export async function getGame(id: string): Promise<Game | null> {
  const all = await loadGames();
  return all.find((g) => g.id === id) ?? null;
}

export async function upsertGame(game: Game): Promise<void> {
  const all = await loadGames();
  const idx = all.findIndex((g) => g.id === game.id);
  if (idx >= 0) all[idx] = game;
  else all.push(game);
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(all));
}

export async function deleteGame(id: string): Promise<void> {
  const all = await loadGames();
  const next = all.filter((g) => g.id !== id);
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(next));
}

// ---- PREFS ----

export async function loadPrefs(): Promise<Prefs> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export async function savePrefs(prefs: Prefs): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

// helper for the filter chips
export function applyFilter(games: Game[], filter: DefaultFilter, query: string): Game[] {
  const q = query.trim().toLowerCase();
  return games.filter((g) => {
    if (filter !== "all" && g.status !== filter) return false;
    if (q && !g.title.toLowerCase().includes(q)) return false;
    return true;
  });
}

// ---- SESSIONS ----
const SESSIONS_KEY = "@gamelibrary/sessions";

export async function loadSessions(): Promise<Session[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const list: Session[] = JSON.parse(raw);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    return [];
  }
}

export async function saveSession(session: Session): Promise<void> {
  const current = await loadSessions();
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify([session, ...current]));
}
