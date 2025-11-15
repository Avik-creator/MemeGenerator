"use client"

import Image from "next/image";
import { motion } from "framer-motion"
import { useMemeStore } from "@/store/meme-store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { Meme } from "@/types/text";
import { Button } from "./ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { fetchMemes, searchMemes } from "@/app/actions/memes";
import { MemeSource } from "@/types/text";

const MemeContainer = () => {
    const { setSelectedMeme, filteredMemes, searchQuery, setSearchQuery, setMemes } = useMemeStore();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSource, setSelectedSource] = useState<MemeSource | "all">("all");
    const itemsPerPage = 25;

    // Fetch memes using React Query with server action
    // Use search API when there's a search query, otherwise fetch trending
    const { data, isLoading, error } = useQuery({
        queryKey: ['memes', searchQuery],
        queryFn: () => searchQuery ? searchMemes(searchQuery) : fetchMemes(),
        enabled: true,
    });

    // Update Zustand store when data is fetched
    useEffect(() => {
        if (data?.data?.memes) {
            setMemes(data.data.memes);
        }
    }, [data, setMemes]);

    // Filter by source if selected
    const sourceFilteredMemes = useMemo(() => {
        if (!filteredMemes) return [];
        if (selectedSource === "all") return filteredMemes;
        return filteredMemes.filter(meme => meme.source === selectedSource);
    }, [filteredMemes, selectedSource]);

    // Calculate paginated results
    const paginatedMemes = useMemo(() => {
        if (!sourceFilteredMemes) return [];

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sourceFilteredMemes.slice(startIndex, endIndex);
    }, [sourceFilteredMemes, currentPage]);

    // Calculate total pages
    const totalPages = useMemo(() => {
        if (!sourceFilteredMemes) return 0;
        return Math.ceil(sourceFilteredMemes.length / itemsPerPage);
    }, [sourceFilteredMemes]);

    // Reset to first page when search or source filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedSource]);

    const handleMemeClick = (meme: Meme) => {
        flushSync(() => {
            setSelectedMeme({
                name: meme.name,
                url: meme.url
            });
        });
        router.push('/create/custom');
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="flex flex-col items-center gap-2">
            <div className="md:h-56 h-42 w-full bg-gradient-to-br from-purple-900/60 to-purple-800/60 rounded-xl relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <div className="w-3/4 h-4 rounded-full bg-gradient-to-r from-purple-900/60 to-purple-800/60" />
        </div>
    )

    // Meme item component with GIF support
    const MemeItem = ({ item }: { item: Meme }) => (
        <div
            className="w-full transition-all duration-200 hover:scale-[103%] cursor-pointer"
            onClick={() => handleMemeClick(item)}
        >
            <div className="md:h-56 h-42 w-full rounded-xl overflow-hidden relative">
                {item.isGif ? (
                    <img
                        className="h-full w-full object-cover brightness-90 hover:brightness-100 transition-all duration-200"
                        src={item.url}
                        alt={`${item.name} meme`}
                        loading="lazy"
                    />
                ) : (
                    <Image
                        className="h-full w-full object-cover brightness-90 hover:brightness-100 transition-all duration-200"
                        width={600}
                        height={600}
                        src={item.url}
                        alt={`${item.name} meme`}
                        loading="lazy"
                    />
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    {item.isGif && (
                        <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                            GIF
                        </div>
                    )}
                    {item.source && (
                        <div className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded capitalize">
                            {item.source}
                        </div>
                    )}
                </div>
            </div>
            <p className="md:text-sm text-xs font-medium text-center mt-2 text-gray-200">
                {item.name}
            </p>
        </div>
    )

    // No results message
    const NoResults = () => (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
            >
                <p className="md:text-lg text-sm font-medium mb-1">No memes found</p>
                <p className="md:text-sm text-xs">Try adjusting your search terms</p>
            </motion.div>
        </div>
    );

    // Source filter tabs
    const SourceFilter = () => (
        <div className="col-span-full flex items-center gap-2 mb-4 flex-wrap">
            <Button
                onClick={() => setSelectedSource("all")}
                variant={selectedSource === "all" ? "default" : "secondary"}
                size="sm"
                className="md:text-sm text-xs"
            >
                All
            </Button>
            <Button
                onClick={() => setSelectedSource("imgflip")}
                variant={selectedSource === "imgflip" ? "default" : "secondary"}
                size="sm"
                className="md:text-sm text-xs"
            >
                Imgflip
            </Button>
            <Button
                onClick={() => setSelectedSource("tenor")}
                variant={selectedSource === "tenor" ? "default" : "secondary"}
                size="sm"
                className="md:text-sm text-xs"
            >
                Tenor
            </Button>
            <Button
                onClick={() => setSelectedSource("giphy")}
                variant={selectedSource === "giphy" ? "default" : "secondary"}
                size="sm"
                className="md:text-sm text-xs"
            >
                Giphy
            </Button>
        </div>
    );

    // Search active header
    const SearchHeader = () => (
        <div className="col-span-full w-full flex items-center justify-between mb-4 md:text-sm text-xs">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-300 md:w-auto w-1/2"
            >
                <span>Search results for: </span>
                <span className="font-medium text-purple-300 break-words">&quot;{searchQuery}&quot;</span>
            </motion.div>
            <Button
                onClick={handleClearSearch}
                variant="secondary"
                size="sm"
                className="md:text-sm text-xs dark text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
            >
                <X className="w-4 h-4" />
                Clear Search
            </Button>
        </div>
    );

    // Pagination component
    const Pagination = () => {
        if (totalPages <= 1) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full flex items-center justify-center gap-4 mt-8"
            >
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>Page</span>
                    <span className="font-medium text-purple-300">{currentPage}</span>
                    <span>of</span>
                    <span className="font-medium text-purple-300">{totalPages}</span>
                </div>
                <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 1.5 }}
            className="md:mt-12 mt-6 w-full"
        >
            {/* Search Header */}
            {searchQuery && <SearchHeader />}

            {/* Source Filter */}
            <SourceFilter />

            {/* Memes Grid */}
            <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-6 w-full">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                        <LoadingSkeleton key={`skeleton-${idx}`} />
                    ))
                ) : searchQuery && sourceFilteredMemes?.length === 0 ? (
                    <NoResults />
                ) : (
                    paginatedMemes?.map((item: Meme, idx: number) => (
                        <MemeItem key={`meme-${item.id}-${idx}`} item={item} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {!isLoading && sourceFilteredMemes && sourceFilteredMemes.length > 0 && (
                <Pagination />
            )}
        </motion.div>
    )
}

export default MemeContainer

