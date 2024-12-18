import * as React from "react";
import { MonthSelector } from "./_components/_layout/MonthSelector";
import { DarkModeToggle } from "./_components/_layout/DarkModeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-50 bg-[#282828] shadow-lg">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-14 items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* <SearchBar onSearch={onSearch} /> */}
                <DarkModeToggle />
              </div>
              <MonthSelector />
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
