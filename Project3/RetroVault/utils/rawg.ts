export type Game = {
  id: string;
  name: string;
  background_image: string;
  rating: number;
  released: string;
};

const BASE_URL = "https://www.cheapshark.com/api/1.0";

export async function getDeals(title: string = "", storeID: string = ""): Promise<Game[]> {
  try {
    let url = `${BASE_URL}/deals?pageSize=30`;
    if (title) url += `&title=${encodeURIComponent(title)}`;
    if (storeID) url += `&storeID=${storeID}`;
    
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
    const res = await fetch(`${BASE_URL}/deals?id=${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}
