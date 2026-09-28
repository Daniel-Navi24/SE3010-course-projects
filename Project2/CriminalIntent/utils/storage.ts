import AsyncStorage from "@react-native-async-storage/async-storage";
import { Crime } from "../types/Crime";

const CRIMES_KEY = "@criminal_intent/crimes";

/**
 * Returns all crimes as an array.
 * Sorted by date descending (newest first) so the list matches the
 * instructor's screenshots.
 */
export async function loadCrimes(): Promise<Crime[]> {
  try {
    const raw = await AsyncStorage.getItem(CRIMES_KEY);
    if (!raw) return [];
    const parsed: Crime[] = JSON.parse(raw);
    return parsed.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.warn("Failed to load crimes:", err);
    return [];
  }
}

/**
 * Fetch a single crime by id. Returns null if not found.
 */
export async function getCrime(id: string): Promise<Crime | null> {
  const all = await loadCrimes();
  return all.find((c) => c.id === id) ?? null;
}

/**
 * Insert or update a crime. Only called from the Detail screen's Save button.
 */
export async function upsertCrime(crime: Crime): Promise<void> {
  const all = await loadCrimes();
  const idx = all.findIndex((c) => c.id === crime.id);
  if (idx >= 0) {
    all[idx] = crime;
  } else {
    all.push(crime);
  }
  await AsyncStorage.setItem(CRIMES_KEY, JSON.stringify(all));
}
