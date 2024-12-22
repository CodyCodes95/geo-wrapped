import { create } from "zustand";

type MapState = {
  bounds: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  } | null;
  zoom: number;
  setBounds: (bounds: MapState["bounds"]) => void;
  setZoom: (zoom: number) => void;
};

export const useMapStateStore = create<MapState>((set) => ({
  bounds: null,
  zoom: 1,
  setBounds: (bounds) => set({ bounds }),
  setZoom: (zoom) => set({ zoom }),
}));
