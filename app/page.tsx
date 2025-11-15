"use client"

import Navbar from "@/components/navbar"
import HeroHeader from "@/components/hero-header"
import MemeContainer from "@/components/meme-container"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white px-4 md:px-8">
      <Navbar />
      <HeroHeader />
      <MemeContainer />
    </div>
  );
}
