"use client";
import { usePathname } from "next/navigation";

export const usePlayerId = () => {
  const path = usePathname();
  const playerId = path.split("/").at(-2);
  return playerId;
};
