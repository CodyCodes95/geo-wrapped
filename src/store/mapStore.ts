import { create } from "zustand";

export type SelectedRound = {
  id: string;
  guess: {
    lat: number;
    lng: number;
  };
  answer: {
    lat: number;
    lng: number;
  };
};

type MapStore = {
  selectedRounds: SelectedRound[];
  setSelectedRounds: (rounds: SelectedRound[]) => void;
  clearSelectedRounds: () => void;
};

export const useMapStore = create<MapStore>((set) => ({
  selectedRounds: [],
  setSelectedRounds: (rounds) => set({ selectedRounds: rounds }),
  clearSelectedRounds: () => set({ selectedRounds: [] }),
}));
