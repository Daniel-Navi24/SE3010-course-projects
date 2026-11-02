export type Game = {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: { name: string }[];
};

export type Genre = {
  id: number;
  name: string;
  image_background: string;
};
