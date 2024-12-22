import { create } from "zustand";

export type RoundAnswer = {
    lat: number;
    lng: number;
    googlePanoId: string;
    pitch: number;
    heading: number;
    zoom: number;
  };

export type SelectedRound = {
  id: string;
  guess: {
    lat: number;
    lng: number;
  };
  answer: RoundAnswer;
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
