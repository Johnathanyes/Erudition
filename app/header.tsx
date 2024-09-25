import { ModeToggle } from "@/components/ui/ModeToggle";
import Image from "next/image";
import React from "react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-stone-950 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 text-2xl">
          <Link href="/">
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="image of brain"
              />

              <h2>Erudition</h2>
            </div>
          </Link>
          <Link href="/dashboard">
            <h2 className="text-lg">Dashboard</h2>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};

export default Header;
