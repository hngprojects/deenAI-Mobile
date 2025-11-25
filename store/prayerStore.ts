import { create } from "zustand";
import { useMemo } from "react";
import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
} from "adhan";

interface PrayerState {
  currentDate: Date;
  coordinates: { lat: number; lng: number };
  // Actions

  setDate: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
}

export const usePrayerStore = create<PrayerState>((set, get) => ({
  currentDate: new Date(),
  coordinates: { lat: 6.5244, lng: 3.3792 },

  setDate: (date) => set({ currentDate: date }),

  nextMonth: () =>
    set((state) => {
      const next = new Date(state.currentDate);
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      return { currentDate: next };
    }),

  prevMonth: () =>
    set((state) => {
      const prev = new Date(state.currentDate);
      prev.setMonth(prev.getMonth() - 1);
      prev.setDate(1);
      return { currentDate: prev };
    }),
}));

export const usePrayerTimes = () => {
  // 🚨 We need to access the store state directly from the hook:
  const { currentDate, coordinates } = usePrayerStore();

  return useMemo(() => {
    if (!coordinates) return {};

    const coords = new Coordinates(coordinates.lat, coordinates.lng);
    const params = CalculationMethod.MuslimWorldLeague();
    const times = new PrayerTimes(coords, currentDate, params);
    const sunnah = new SunnahTimes(times);

    const format = (d: Date) =>
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return {
      Subh: format(times.fajr),
      Dhuhr: format(times.dhuhr),
      Asr: format(times.asr),
      Maghrib: format(times.maghrib),
      Isha: format(times.isha),
      Tahajjud: format(sunnah.lastThirdOfTheNight),
    };
  }, [currentDate, coordinates]);
};
