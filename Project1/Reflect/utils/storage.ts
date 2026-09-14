import AsyncStorage from "@react-native-async-storage/async-storage";

export type Mood = "great" | "good" | "okay" | "sad" | "awful";

export type Entry = {
  id: string;
  mood: Mood;
  text: string;
  date: string; // ISO string
};

const KEY = "reflect_entries";

export async function loadEntries(): Promise<Entry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveEntry(entry: Entry): Promise<Entry[]> {
  const all = await loadEntries();
  const updated = [entry, ...all];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function groupByDate(entries: Entry[]): Record<string, Entry[]> {
  return entries.reduce((groups, entry) => {
    const key = formatDateLabel(entry.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
    return groups;
  }, {} as Record<string, Entry[]>);
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

