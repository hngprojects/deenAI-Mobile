import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface StreakDay {
    date: string; // YYYY-MM-DD format
    completed: boolean;
    completedAt?: Date;
    category?: 'morning' | 'evening';
}

export interface StreakStats {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    lastCompletedDate: string | null;
    streakHistory: StreakDay[];
}

interface StreakStore {
    // Streak data
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    lastCompletedDate: string | null;
    streakHistory: StreakDay[];

    // UI state
    hasSeenDrawerToday: boolean;
    todayCompleted: boolean;

    // Actions
    completeStreakForToday: (category: 'morning' | 'evening') => void;
    checkStreakStatus: () => void;
    markDrawerAsSeen: () => void;
    resetDrawerFlag: () => void;
    getStreakForDate: (date: string) => StreakDay | undefined;
    getWeekStreak: () => StreakDay[];
    isStreakAtRisk: () => boolean;
    getTimeUntilMidnight: () => number;
    resetStreak: () => void;
}

const getTodayDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getYesterdayDateString = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
};

const calculateStreak = (history: StreakDay[]): number => {
    const sortedHistory = [...history].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = getTodayDateString();
    let currentDate = new Date(today);

    for (const day of sortedHistory) {
        const checkDate = currentDate.toISOString().split('T')[0];

        if (day.date === checkDate && day.completed) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (day.date < checkDate) {
            break;
        }
    }

    return streak;
};

export const useStreakStore = create<StreakStore>()(
    persist(
        (set, get) => ({
            currentStreak: 0,
            longestStreak: 0,
            totalDays: 0,
            lastCompletedDate: null,
            streakHistory: [],
            hasSeenDrawerToday: false,
            todayCompleted: false,

            completeStreakForToday: (category: 'morning' | 'evening') => {
                const state = get();
                const today = getTodayDateString();

                // Check if already completed today
                const existingDay = state.streakHistory.find(day => day.date === today);
                if (existingDay?.completed) {
                    return; // Already completed today
                }

                // Create or update today's entry
                const updatedHistory = state.streakHistory.filter(day => day.date !== today);
                const newDay: StreakDay = {
                    date: today,
                    completed: true,
                    completedAt: new Date(),
                    category,
                };
                updatedHistory.push(newDay);

                // Calculate new streak
                const newCurrentStreak = calculateStreak(updatedHistory);
                const newLongestStreak = Math.max(state.longestStreak, newCurrentStreak);
                const newTotalDays = updatedHistory.filter(day => day.completed).length;

                set({
                    streakHistory: updatedHistory,
                    currentStreak: newCurrentStreak,
                    longestStreak: newLongestStreak,
                    totalDays: newTotalDays,
                    lastCompletedDate: today,
                    todayCompleted: true,
                });
            },

            checkStreakStatus: () => {
                const state = get();
                const today = getTodayDateString();
                const yesterday = getYesterdayDateString();

                // Check if we need to reset the drawer flag (new day)
                if (state.lastCompletedDate !== today) {
                    set({ hasSeenDrawerToday: false, todayCompleted: false });
                }

                // Check if streak is broken
                const todayEntry = state.streakHistory.find(day => day.date === today);
                const yesterdayEntry = state.streakHistory.find(day => day.date === yesterday);

                if (!todayEntry?.completed && state.lastCompletedDate && state.lastCompletedDate < yesterday) {
                    // Streak is broken - reset to 0
                    const newCurrentStreak = 0;
                    set({ currentStreak: newCurrentStreak });
                } else {
                    // Recalculate streak
                    const newCurrentStreak = calculateStreak(state.streakHistory);
                    set({ currentStreak: newCurrentStreak });
                }
            },

            markDrawerAsSeen: () => {
                set({ hasSeenDrawerToday: true });
            },

            resetDrawerFlag: () => {
                set({ hasSeenDrawerToday: false });
            },

            getStreakForDate: (date: string) => {
                const state = get();
                return state.streakHistory.find(day => day.date === date);
            },

            getWeekStreak: () => {
                const state = get();
                const week: StreakDay[] = [];
                const today = new Date();

                // Get last 7 days
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateString = date.toISOString().split('T')[0];

                    const existingDay = state.streakHistory.find(day => day.date === dateString);
                    week.push(
                        existingDay || {
                            date: dateString,
                            completed: false,
                        }
                    );
                }

                return week;
            },

            isStreakAtRisk: () => {
                const state = get();
                const today = getTodayDateString();
                const todayEntry = state.streakHistory.find(day => day.date === today);

                return state.currentStreak > 0 && !todayEntry?.completed;
            },

            getTimeUntilMidnight: () => {
                const now = new Date();
                const midnight = new Date();
                midnight.setHours(24, 0, 0, 0);
                return Math.floor((midnight.getTime() - now.getTime()) / 1000 / 60 / 60); // hours
            },

            resetStreak: () => {
                set({
                    currentStreak: 0,
                    longestStreak: 0,
                    totalDays: 0,
                    lastCompletedDate: null,
                    streakHistory: [],
                    hasSeenDrawerToday: false,
                    todayCompleted: false,
                });
            },
        }),
        {
            name: 'streak-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);