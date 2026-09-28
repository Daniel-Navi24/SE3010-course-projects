export type Crime = {
  id: string;
  title: string;
  details: string;
  date: string;        // ISO string, e.g. new Date().toISOString()
  solved: boolean;
  photoUri?: string;   // local file URI from expo-image-picker
};
