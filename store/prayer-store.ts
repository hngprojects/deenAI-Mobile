// stores/usePrayerStore.ts
import { create } from 'zustand';
import { LocationCoordinates } from '../service/location.service';

export interface PrayerTimes {
  Subh: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Tahajjud: string;
}

interface PrayerState {
  prayerTimes: PrayerTimes | null;
  location: LocationCoordinates | null;
  locationName: string | null;
  currentDate: Date;
  islamicDate: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPrayerTimes: (times: PrayerTimes) => void;
  setLocation: (location: LocationCoordinates) => void;
  setLocationName: (name: string) => void;
  setCurrentDate: (date: Date) => void;
  setIslamicDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  prayerTimes: null,
  location: null,
  locationName: null,
  currentDate: new Date(),
  islamicDate: null,
  isLoading: false,
  error: null,
};

export const usePrayerStore = create<PrayerState>((set) => ({
  ...initialState,

  setPrayerTimes: (times) => set({ prayerTimes: times }),
  
  setLocation: (location) => set({ location }),
  
  setLocationName: (name) => set({ locationName: name }),
  
  setCurrentDate: (date) => set({ currentDate: date }),
  
  setIslamicDate: (date) => set({ islamicDate: date }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}));