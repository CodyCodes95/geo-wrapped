"use client";
import React from "react";
import { DarkModeToggle } from "../../_components/_layout/DarkModeToggle";
import { MonthSelector } from "../../_components/_layout/MonthSelector";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const path = usePathname();

  if (path.toLowerCase().includes("wrapped")) return null;

  return (
    <nav className="sticky top-0 z-50  shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          <MonthSelector />
          <div className="flex items-center gap-4">
            {/* <SearchBar onSearch={onSearch} /> */}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
