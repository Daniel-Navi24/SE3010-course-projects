export type Session = {
  id: string;
  date: string; // ISO string
  gameTitle: string;
  durationMinutes: number;
  audioUri?: string;
  note: string;
};
