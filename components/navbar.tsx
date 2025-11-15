"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import { Plus, Star } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const Navbar = () => {
  return (
    <div className='flex items-center justify-center w-full'>
      <motion.div
        initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className='xl:w-[80rem] w-full flex items-center justify-between'
      >
        <Link
          href={'/'}
          className="flex items-center gap-2"
        >
          <div className="md:size-6 size-4.5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white md:text-sm text-xs font-bold">M</span>
          </div>
          <p className="font-medium md:text-2xl text-base">MemeGenerator</p>
        </Link>
        <div className="md:text-sm text-xs dark flex items-center gap-2">
          <Link
            href="https://github.com/Avik-creator/memegenerator"
            target="_blank"
            rel="noopener noreferrer"
            className="md:flex hidden text-gray-400 hover:text-gray-200 transition-colors"
          >
            Avik-creator
          </Link>
          <Button
            className="md:flex hidden"
            onClick={() => window.open("https://github.com/Avik-creator/memegenerator")}
            variant={"secondary"}
          >
            <Star />
            Star
          </Button>
          <Link href={'/create/custom'}>
            <Button
              className="md:text-sm text-xs"
              variant={"default"}
            >
              <Plus className="md:size-4 size-2.5" />
              Create
            </Button>
          </Link>
        </div>
      </motion.div>
    </div >
  )
}

export default Navbar

