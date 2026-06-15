import { create } from "zustand";

interface MapStore {
  selectedLocation: string | null;

  setSelectedLocation: (name: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedLocation: null,

  setSelectedLocation: (name) =>
    set({
      selectedLocation: name,
    }),
}));
