"use server"

import axios from "axios";
import { Meme } from "@/types/text";

export interface MemesResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

// Fetch all memes from Imgflip
async function fetchImgflipMemes(searchQuery?: string): Promise<Meme[]> {
  try {
    const res = await axios.get<MemesResponse>(`https://api.imgflip.com/get_memes`);
    let memes = res.data.data.memes.map(meme => ({
      id: meme.id,
      name: meme.name,
      url: meme.url,
      width: meme.width,
      height: meme.height,
      box_count: meme.box_count,
    }));

    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      memes = memes.filter(meme =>
        meme.name.toLowerCase().includes(query)
      );
    }

    return memes;
  } catch (error) {
    console.error("Error fetching Imgflip memes:", error);
    return [];
  }
}

// Main function to fetch memes from Imgflip
export async function fetchMemes(searchQuery?: string): Promise<MemesResponse> {
  try {
    const memes = await fetchImgflipMemes(searchQuery);

    return {
      success: true,
      data: {
        memes: memes,
      },
    };
  } catch (error) {
    console.error("Error fetching memes:", error);
    throw new Error("Failed to fetch memes");
  }
}

// Search memes from Imgflip
export async function searchMemes(query: string): Promise<MemesResponse> {
  if (!query || !query.trim()) {
    return fetchMemes();
  }
  return fetchMemes(query.trim());
}

