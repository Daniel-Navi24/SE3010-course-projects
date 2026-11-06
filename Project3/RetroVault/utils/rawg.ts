import { Game, Genre } from "../types/Game";
const API_KEY = "cbe9c56cab2741edb306b3c1a62a6049";
const BASE_URL = "https://api.rawg.io/api";
export async function getGamesByGenre(genreId: number): Promise<Game[]> {
  try {
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genreId}&page_size=20`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}
export async function getGameDetails(id: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}
export async function getGenres(): Promise<Genre[]> {
  return [
    { id: 4, name: "Action", image_background: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg" },
    { id: 5, name: "RPG", image_background: "https://media.rawg.io/media/games/6cd/6cd653e0aaef5ff8bbd295bf4ff0a109.jpg" },
    { id: 3, name: "Adventure", image_background: "https://media.rawg.io/media/games/9dd/9ddabb34840ea9227556670606cf8ea3.jpg" },
    { id: 2, name: "Shooter", image_background: "https://media.rawg.io/media/games/bc0/bc06a29ceac58652b684deefe7d56099.jpg" },
    { id: 10, name: "Strategy", image_background: "https://media.rawg.io/media/games/fb5/fb5e0fdb1f6bb0e0a3f8d6634d6bbf0a.jpg" },
    { id: 7, name: "Puzzle", image_background: "https://media.rawg.io/media/games/8d6/8d6c2a8a4c1c8d31d2a2d4a3e3d4a6b1.jpg" }
  ];
}
