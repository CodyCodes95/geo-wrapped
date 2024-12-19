import * as React from "react";
import Navigation from "./wrapped/components/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
