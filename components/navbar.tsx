"use client"

import { Poppins } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import profilePic from "@/public/RU_s.png"

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";

const font = Poppins({
    weight: "600",
    subsets: ["latin"],
});

export const Navbar = () => {
    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="w-full flex items-center justify-between border border-white">
                <MobileSidebar />
                <Link href={`/`} className="flex justify-between  items-end">
                    <Image
                        src={profilePic}
                        alt="Picture of the author"
                        width={60}
                        height={60}
                    />
                    <h1 className={cn(
                        "hidden md:block text-xl md:text-base font-bold text-primary",
                        font.className
                    )}>
                        abshaga.5
                    </h1>
                </Link>
                <div className="flex items-center gap-x-3">
                    <div>
                        <h3 className="font-bold">Student</h3>
                    </div>
                    <ModeToggle />
                    <UserButton />
                </div>
            </div>
        </div>
    )
}