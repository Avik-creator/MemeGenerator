"use client"

import Meme from "@/components/meme"
import Navbar from "@/components/navbar"

const CustomPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center bg-black text-white px-4 md:px-8">
            <Navbar />
            <div className="flex flex-col items-center md:mt-32 mt-12 gap-4 justify-center overflow-y-auto w-full">
                <Meme />
            </div>
        </div>
    )
}

export default CustomPage

