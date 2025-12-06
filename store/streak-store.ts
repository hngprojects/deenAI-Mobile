// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';

// export interface StreakDay {
//     date: string; // YYYY-MM-DD format
//     completed: boolean;
//     completedAt?: string; // ISO string for serialization
//     category?: 'morning' | 'evening';
// }

// export interface StreakStats {
//     currentStreak: number;
//     longestStreak: number;
//     totalDays: number;
//     lastCompletedDate: string | null;
//     streakHistory: StreakDay[];
// }

// interface StreakStore {
//     // Streak data
//     currentStreak: number;
//     longestStreak: number;
//     totalDays: number;
//     lastCompletedDate: string | null;
//     streakHistory: StreakDay[];

//     // UI state
//     hasSeenDrawerToday: boolean;
//     todayCompleted: boolean;
    
//     // Time-based modal tracking
//     hasSeenTimeModalToday: boolean;
//     timeModalShownAt: string | null; // ISO string for serialization
//     lastSessionDuration: number;

//     // Actions
//     completeStreakForToday: (category: 'morning' | 'evening') => void;
//     checkStreakStatus: () => void;
//     markDrawerAsSeen: () => void;
//     resetDrawerFlag: () => void;
//     getStreakForDate: (date: string) => StreakDay | undefined;
//     getWeekStreak: () => StreakDay[];
//     isStreakAtRisk: () => boolean;
//     getTimeUntilMidnight: () => number;
//     resetStreak: () => void;
//     getWeekdayLabel: (dateString: string) => string;
    
//     // Time-based modal methods
//     markTimeModalAsSeen: () => void;
//     resetDailyModalState: () => void;
//     shouldShowTimeModal: (sessionMinutes: number) => boolean;
//     recordSessionDuration: (minutes: number) => void;
//     getTodayDateString: () => string;
//     // New helper to safely parse dates
//     parseDateSafe: (dateString: string | null) => Date | null;
// }

// // Helper function to get date string in local timezone (YYYY-MM-DD)
// const getLocalDateString = (date?: Date): string => {
//     const dateObj = date || new Date();
//     const year = dateObj.getFullYear();
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const day = String(dateObj.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

// // Helper function to safely parse date strings
// const parseDateSafe = (dateString: string | null): Date | null => {
//     if (!dateString) return null;
    
//     // If it's already a Date object (shouldn't happen with serialization)
//     if (typeof dateString === 'object' && dateString instanceof Date) {
//         return dateString;
//     }
    
//     // If it's a string, parse it
//     if (typeof dateString === 'string') {
//         try {
//             // Try parsing as ISO string
//             const parsed = new Date(dateString);
//             // Check if parsing was successful
//             if (!isNaN(parsed.getTime())) {
//                 return parsed;
//             }
            
//             // Try parsing as YYYY-MM-DD format
//             if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//                 const yyyyMMDD = new Date(dateString + 'T00:00:00');
//                 if (!isNaN(yyyyMMDD.getTime())) {
//                     return yyyyMMDD;
//                 }
//             }
            
//             console.warn('Failed to parse date string:', dateString);
//             return null;
//         } catch (error) {
//             console.error('Error parsing date:', dateString, error);
//             return null;
//         }
//     }
    
//     return null;
// };

// // Helper function to check if modal was shown today
// const wasModalShownToday = (modalShownAt: string | null): boolean => {
//     if (!modalShownAt) return false;
    
//     const today = getLocalDateString();
//     const modalDate = parseDateSafe(modalShownAt);
    
//     if (!modalDate) return false;
    
//     const modalDateStr = getLocalDateString(modalDate);
//     return today === modalDateStr;
// };

// // Helper function to calculate streak correctly
// const calculateStreak = (history: StreakDay[]): number => {
//     const sortedHistory = [...history]
//         .filter(day => day.completed)
//         .sort((a, b) => {
//             const dateA = parseDateSafe(a.date);
//             const dateB = parseDateSafe(b.date);
//             if (!dateA || !dateB) return 0;
//             return dateB.getTime() - dateA.getTime();
//         });

//     if (sortedHistory.length === 0) return 0;

//     const today = getLocalDateString();
//     let streak = 0;
//     let expectedDate = new Date(today);

//     for (const day of sortedHistory) {
//         const dayDate = parseDateSafe(day.date);
//         if (!dayDate) continue;
        
//         const expectedDateStr = getLocalDateString(expectedDate);
        
//         if (day.date === expectedDateStr) {
//             streak++;
//             expectedDate.setDate(expectedDate.getDate() - 1);
//         } else {
//             break;
//         }
//     }

//     return streak;
// };

// export const useStreakStore = create<StreakStore>()(
//     persist(
//         (set, get) => ({
//             currentStreak: 0,
//             longestStreak: 0,
//             totalDays: 0,
//             lastCompletedDate: null,
//             streakHistory: [],
//             hasSeenDrawerToday: false,
//             todayCompleted: false,
//             hasSeenTimeModalToday: false,
//             timeModalShownAt: null,
//             lastSessionDuration: 0,

//             completeStreakForToday: (category: 'morning' | 'evening') => {
//                 const state = get();
//                 const today = getLocalDateString();

//                 const existingDay = state.streakHistory.find(day => day.date === today);
//                 if (existingDay?.completed) {
//                     return;
//                 }

//                 const updatedHistory = state.streakHistory.filter(day => day.date !== today);
//                 const newDay: StreakDay = {
//                     date: today,
//                     completed: true,
//                     completedAt: new Date().toISOString(),
//                     category,
//                 };
//                 updatedHistory.push(newDay);

//                 // Sort by date
//                 updatedHistory.sort((a, b) => {
//                     const dateA = parseDateSafe(a.date);
//                     const dateB = parseDateSafe(b.date);
//                     if (!dateA || !dateB) return 0;
//                     return dateA.getTime() - dateB.getTime();
//                 });

//                 const newCurrentStreak = calculateStreak(updatedHistory);
//                 const newLongestStreak = Math.max(state.longestStreak, newCurrentStreak);
//                 const newTotalDays = updatedHistory.filter(day => day.completed).length;

//                 set({
//                     streakHistory: updatedHistory,
//                     currentStreak: newCurrentStreak,
//                     longestStreak: newLongestStreak,
//                     totalDays: newTotalDays,
//                     lastCompletedDate: today,
//                     todayCompleted: true,
//                 });
//             },

//             checkStreakStatus: () => {
//                 const state = get();
//                 const today = getLocalDateString();

//                 // Check if we need to reset the drawer flag (new day)
//                 if (state.lastCompletedDate !== today) {
//                     set({ hasSeenDrawerToday: false, todayCompleted: false });
//                 }

//                 // Recalculate streak based on current history
//                 const newCurrentStreak = calculateStreak(state.streakHistory);
//                 set({ currentStreak: newCurrentStreak });
//             },

//             markDrawerAsSeen: () => {
//                 set({ hasSeenDrawerToday: true });
//             },

//             resetDrawerFlag: () => {
//                 set({ hasSeenDrawerToday: false });
//             },

//             getStreakForDate: (date: string) => {
//                 const state = get();
//                 return state.streakHistory.find(day => day.date === date);
//             },

//             getWeekStreak: () => {
//                 const state = get();
//                 const week: StreakDay[] = [];
//                 const today = new Date();

//                 // Get last 7 days including today
//                 for (let i = 0; i < 7; i++) {
//                     const date = new Date(today);
//                     date.setDate(date.getDate() - (6 - i));
//                     const dateString = getLocalDateString(date);

//                     const existingDay = state.streakHistory.find(day => day.date === dateString);
//                     week.push(
//                         existingDay || {
//                             date: dateString,
//                             completed: false,
//                         }
//                     );
//                 }

//                 return week;
//             },

//             getWeekdayLabel: (dateString: string) => {
//                 const date = parseDateSafe(dateString);
//                 if (!date) return '---';
//                 return date.toLocaleDateString('en-US', { weekday: 'short' });
//             },

//             parseDateSafe: (dateString: string | null) => {
//                 return parseDateSafe(dateString);
//             },

//             isStreakAtRisk: () => {
//                 const state = get();
//                 const today = getLocalDateString();
//                 const todayEntry = state.streakHistory.find(day => day.date === today);

//                 return state.currentStreak > 0 && !todayEntry?.completed;
//             },

//             getTimeUntilMidnight: () => {
//                 const now = new Date();
//                 const midnight = new Date();
//                 midnight.setHours(24, 0, 0, 0);
//                 return Math.floor((midnight.getTime() - now.getTime()) / 1000 / 60 / 60);
//             },

//             resetStreak: () => {
//                 set({
//                     currentStreak: 0,
//                     longestStreak: 0,
//                     totalDays: 0,
//                     lastCompletedDate: null,
//                     streakHistory: [],
//                     hasSeenDrawerToday: false,
//                     todayCompleted: false,
//                     hasSeenTimeModalToday: false,
//                     timeModalShownAt: null,
//                     lastSessionDuration: 0,
//                 });
//             },

//             // Time-based modal methods
//             markTimeModalAsSeen: () => {
//                 set({ 
//                     hasSeenTimeModalToday: true,
//                     timeModalShownAt: new Date().toISOString()
//                 });
//             },

//             resetDailyModalState: () => {
//                 const today = getLocalDateString();
//                 const modalShownAt = get().timeModalShownAt;
                
//                 if (!modalShownAt) {
//                     // No modal shown yet today, ensure flag is false
//                     if (get().hasSeenTimeModalToday) {
//                         set({ 
//                             hasSeenTimeModalToday: false,
//                         });
//                     }
//                     return;
//                 }
                
//                 const modalDate = parseDateSafe(modalShownAt);
                
//                 if (!modalDate) {
//                     // Can't parse date, reset to be safe
//                     set({ 
//                         hasSeenTimeModalToday: false,
//                         timeModalShownAt: null
//                     });
//                     return;
//                 }
                
//                 const modalDateStr = getLocalDateString(modalDate);
                
//                 // Only reset if modal was shown on a different day
//                 if (modalDateStr !== today) {
//                     set({ 
//                         hasSeenTimeModalToday: false,
//                         timeModalShownAt: null
//                     });
//                 }
//             },

//             shouldShowTimeModal: (sessionMinutes: number) => {
//                 const state = get();
                
//                 // First, check if we need to reset for new day
//                 state.resetDailyModalState();
                
//                 // Already seen modal today? Don't show again
//                 if (state.hasSeenTimeModalToday) {
//                     return false;
//                 }
                
//                 // Spent at least 2 minutes?
//                 if (sessionMinutes >= 2) {
//                     return true;
//                 }
                
//                 return false;
//             },

//             recordSessionDuration: (minutes: number) => {
//                 set({ lastSessionDuration: minutes });
//             },

//             getTodayDateString: () => {
//                 return getLocalDateString();
//             },
//         }),
//         {
//             name: 'streak-storage',
//             storage: createJSONStorage(() => AsyncStorage),
//         }
//     )
// );