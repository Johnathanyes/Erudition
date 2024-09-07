import { ModeToggle } from "@/components/ui/ModeToggle";
import Image from "next/image";
import React from "react";
import { HeaderActions } from "./header-actions";
import Link from "next/link";

const Header = () => {

  return (
    <header className="bg-slate-900 py-4">
      <Link href="/" className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 text-2xl">
            <Image src="/logo.png" width={40} height={40} alt="image of brain"/>
            <h2>BigBrain</h2>
            <h2 className="text-lg">Documents</h2>
        </div>

        <div className="flex gap-4 items-center">
          <ModeToggle />
          <HeaderActions />
        </div>
      </Link>
    </header>
  );
};

export default Header;
