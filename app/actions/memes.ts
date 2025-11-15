"use server"

import axios from "axios";
import { Meme } from "@/types/text";

export interface MemesResponse {
    success: boolean;
    data: {
        memes: Meme[];
    };
}

export async function fetchMemes(): Promise<MemesResponse> {
    try {
        const res = await axios.get<MemesResponse>(`https://api.imgflip.com/get_memes`);
        return res.data;
    } catch (error) {
        console.error("Error fetching memes:", error);
        throw new Error("Failed to fetch memes");
    }
}

