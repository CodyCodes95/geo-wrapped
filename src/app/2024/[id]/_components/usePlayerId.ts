import { usePathname } from "next/navigation";

export const usePlayerId = () => {
  const path = usePathname();
  const playerId = path.split("/").pop();
  return playerId;
};
