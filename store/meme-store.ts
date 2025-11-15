"use client"

import { create } from "zustand";
import { Meme } from "@/types/text";

export interface MemeData {
    name: string;
    url: string;
}

interface MemeStore {
    selectedMeme: MemeData | null;
    setSelectedMeme: (meme: MemeData | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    memes: Meme[] | undefined;
    setMemes: (memes: Meme[] | undefined) => void;
    filteredMemes: Meme[] | undefined;
}

export const useMemeStore = create<MemeStore>((set, get) => ({
    selectedMeme: null,
    setSelectedMeme: (meme) => set({ selectedMeme: meme }),
    searchQuery: "",
    setSearchQuery: (query) => {
        set({ searchQuery: query });
        // Calculate filtered memes
        const { memes } = get();
        if (!memes || !query.trim()) {
            set({ filteredMemes: memes });
        } else {
            const filtered = memes.filter((meme: Meme) =>
                meme.name.toLowerCase().includes(query.toLowerCase().trim())
            );
            set({ filteredMemes: filtered });
        }
    },
    memes: undefined,
    setMemes: (memes) => {
        set({ memes });
        // Recalculate filtered memes when memes are set
        const { searchQuery } = get();
        if (!memes || !searchQuery.trim()) {
            set({ filteredMemes: memes });
        } else {
            const filtered = memes.filter((meme: Meme) =>
                meme.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
            );
            set({ filteredMemes: filtered });
        }
    },
    filteredMemes: undefined,
}));

