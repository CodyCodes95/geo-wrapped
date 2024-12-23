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
  bounds: {
    // default bounds should fit whole earth
    ne: {
      lat: 90,
      lng: 180,
    },
    sw: {
      lat: -90,
      lng: -180,
    },
  },
  zoom: 2,
  setBounds: (bounds) => set({ bounds }),
  setZoom: (zoom) => set({ zoom }),
}));
