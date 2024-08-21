import { ModeToggle } from "@/components/ui/ModeToggle";
import Image from "next/image";
import React from "react";
import { HeaderActions } from "./header-actions";

const Header = () => {

  return (
    <header className="bg-slate-900 py-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex items-center gap-4 text-2xl">
            <Image src="/logo.png" width={40} height={40} alt="image of brain"/>
            BigBrain
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
