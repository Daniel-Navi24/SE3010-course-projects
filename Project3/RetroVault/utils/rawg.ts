export type Game = {
  id: string;
  name: string;
  background_image: string;
  rating: number;
  released: string;
};

const BASE_URL = "https://www.cheapshark.com/api/1.0";

export async function getDeals(title: string = ""): Promise<Game[]> {
  try {
    let url = `${BASE_URL}/deals?pageSize=30`;
    if (title) url += `&title=${encodeURIComponent(title)}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    
    return data.map((deal: any) => ({
      id: deal.dealID,
      name: deal.title,
      background_image: deal.thumb,
      rating: parseFloat(deal.dealRating) || 0,
      released: deal.releaseDate ? new Date(deal.releaseDate * 1000).getFullYear().toString() : "N/A",
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getDealDetails(id: string): Promise<any> {
  try {
    // Changed endpoint from /deals?id= to /games?id=
    const res = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${id}`);
    
    // If the API returns a 404 or error, don't crash, return null
    if (!res.ok) {
      console.warn(`API returned ${res.status} for id: ${id}`);
      return null; 
    }
    
    const json = await res.json();
    return json;
  } catch (e) {
    console.error("Fetch error details:", e);
    return null;
  }
}
