"use server"

import axios from "axios";
import { Meme } from "@/types/text";

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

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

// Fetch memes from Imgflip
async function fetchImgflipMemes(): Promise<Meme[]> {
  try {
    const res = await axios.get<MemesResponse>(`https://api.imgflip.com/get_memes`);
    return res.data.data.memes.map(meme => ({
      id: meme.id,
      name: meme.name,
      url: meme.url,
      width: meme.width,
      height: meme.height,
      box_count: meme.box_count,
    }));
  } catch (error) {
    console.error("Error fetching Imgflip memes:", error);
    return [];
  }
}

// Fetch memes from Tenor
async function fetchTenorMemes(): Promise<Meme[]> {
  try {
    // Using Tenor's public API endpoint for trending GIFs
    // Note: For production, you may want to use an API key
    const res = await axios.get<TenorResponse>(
      `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&client_key=my_test_app&limit=50&media_filter=gif`
    );

    return res.data.results.map((item, index) => {
      const media = item.media_formats.gif || item.media_formats.tinygif;
      return {
        id: `tenor-${item.id}`,
        name: item.title || `Tenor Meme ${index + 1}`,
        url: media?.url || "",
        width: media?.dims?.[0] || 500,
        height: media?.dims?.[1] || 500,
        box_count: 2, // Default box count for meme templates
      };
    }).filter(meme => meme.url !== "");
  } catch (error) {
    console.error("Error fetching Tenor memes:", error);
    return [];
  }
}

// Fetch memes from Giphy
async function fetchGiphyMemes(): Promise<Meme[]> {
  try {
    // Using Giphy's public API endpoint for trending GIFs
    // Note: For production, you should use your own API key
    const res = await axios.get<GiphyResponse>(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=50&rating=g`
    );

    return res.data.data.map((item) => ({
      id: `giphy-${item.id}`,
      name: item.title || `Giphy Meme`,
      url: item.images.original.url || item.images.fixed_height.url,
      width: parseInt(item.images.original.width) || 500,
      height: parseInt(item.images.original.height) || 500,
      box_count: 2, // Default box count for meme templates
    })).filter(meme => meme.url !== "");
  } catch (error) {
    console.error("Error fetching Giphy memes:", error);
    return [];
  }
}

// Main function to fetch memes from all sources
export async function fetchMemes(): Promise<MemesResponse> {
  try {
    // Fetch from all sources in parallel
    const [imgflipMemes, tenorMemes, giphyMemes] = await Promise.all([
      fetchImgflipMemes(),
      fetchTenorMemes(),
      fetchGiphyMemes(),
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

