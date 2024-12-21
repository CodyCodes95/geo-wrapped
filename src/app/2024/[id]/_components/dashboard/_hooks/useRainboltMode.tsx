import { useState } from "react";
import { create } from "zustand";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type RainboltModeStore = {
  isRainboltMode: boolean;
  toggleRainboltMode: () => void;
};

export const useRainboltModeStore = create<RainboltModeStore>((set) => ({
  isRainboltMode: false,
  toggleRainboltMode: () =>
    set((state) => ({ isRainboltMode: !state.isRainboltMode })),
}));

export const useRainboltMode = () => {
  const { isRainboltMode, toggleRainboltMode } = useRainboltModeStore();

  const RainboltMode = () => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <img
              src="/obama.png"
              className="absolute -right-8 -top-10 h-16 w-20 cursor-pointer rounded-full"
              onClick={toggleRainboltMode}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Rainbolt mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return {
    isRainboltMode,
    toggleRainboltMode,
    RainboltMode,
  };
};
