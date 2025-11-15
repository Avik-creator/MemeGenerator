"use server"

import axios from "axios";
import { Meme, MemeSource } from "@/types/text";

export interface MemesResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

interface TenorResult {
  id: string;
  title: string;
  media_formats: {
    gif?: { url: string; dims: number[] };
    tinygif?: { url: string; dims: number[] };
  };
}

interface TenorResponse {
  results: TenorResult[];
}

interface GiphyResult {
  id: string;
  title: string;
  images: {
    original: { url: string; width: string; height: string };
    fixed_height: { url: string; width: string; height: string };
  };
}

interface GiphyResponse {
  data: GiphyResult[];
}

const GIPHY_API_KEY = process.env.GIPHY_API_KEY || "dc6zaTOxFJmzC"; // Fallback to public key
const TENOR_API_KEY = process.env.TENOR_API_KEY || "AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ"; // Fallback to public key

// Fetch memes from Imgflip
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
      source: "imgflip" as MemeSource,
      isGif: false,
    }));

    // Filter by search query if provided
    if (searchQuery) {
      memes = memes.filter(meme =>
        meme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return memes;
  } catch (error) {
    console.error("Error fetching Imgflip memes:", error);
    return [];
  }
}

// Fetch memes from Tenor
async function fetchTenorMemes(searchQuery?: string): Promise<Meme[]> {
  try {
    const endpoint = searchQuery
      ? `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchQuery)}&key=${TENOR_API_KEY}&client_key=my_test_app&limit=50&media_filter=gif`
      : `https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&client_key=my_test_app&limit=50&media_filter=gif`;

    const res = await axios.get<TenorResponse>(endpoint);

    return res.data.results.map((item, index) => {
      const media = item.media_formats.gif || item.media_formats.tinygif;
      return {
        id: `tenor-${item.id}`,
        name: item.title || `Tenor Meme ${index + 1}`,
        url: media?.url || "",
        width: media?.dims?.[0] || 500,
        height: media?.dims?.[1] || 500,
        box_count: 2, // Default box count for meme templates
        source: "tenor" as MemeSource,
        isGif: true,
      };
    }).filter(meme => meme.url !== "");
  } catch (error) {
    console.error("Error fetching Tenor memes:", error);
    return [];
  }
}

// Fetch memes from Giphy
async function fetchGiphyMemes(searchQuery?: string): Promise<Meme[]> {
  try {
    const endpoint = searchQuery
      ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=50&rating=g`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=50&rating=g`;

    const res = await axios.get<GiphyResponse>(endpoint);

    return res.data.data.map((item) => ({
      id: `giphy-${item.id}`,
      name: item.title || `Giphy Meme`,
      url: item.images.original.url || item.images.fixed_height.url,
      width: parseInt(item.images.original.width) || 500,
      height: parseInt(item.images.original.height) || 500,
      box_count: 2, // Default box count for meme templates
      source: "giphy" as MemeSource,
      isGif: true,
    })).filter(meme => meme.url !== "");
  } catch (error) {
    console.error("Error fetching Giphy memes:", error);
    return [];
  }
}

// Main function to fetch memes from all sources
export async function fetchMemes(searchQuery?: string): Promise<MemesResponse> {
  try {
    // Fetch from all sources in parallel
    const [imgflipMemes, tenorMemes, giphyMemes] = await Promise.all([
      fetchImgflipMemes(searchQuery),
      fetchTenorMemes(searchQuery),
      fetchGiphyMemes(searchQuery),
    ]);

    // Combine all memes
    const allMemes = [...imgflipMemes, ...tenorMemes, ...giphyMemes];

    return {
      success: true,
      data: {
        memes: allMemes,
      },
    };
  } catch (error) {
    console.error("Error fetching memes:", error);
    throw new Error("Failed to fetch memes");
  }
}

// Search memes across all sources
export async function searchMemes(query: string): Promise<MemesResponse> {
  if (!query || !query.trim()) {
    return fetchMemes();
  }
  return fetchMemes(query.trim());
}

