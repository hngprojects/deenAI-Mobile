import { adhkarService } from '@/service/adhkar.service';
import { Adhkar, AdhkarProgress } from '@/types/adhkar.types';
import { create } from 'zustand';
import { useStreakStore } from './streak-store';

interface AdhkarStore {
    currentCategory: 'morning' | 'evening' | null;
    currentAdhkar: Adhkar[];
    currentIndex: number;
    completedCount: Record<number, number>;

    morningProgress: AdhkarProgress | null;
    eveningProgress: AdhkarProgress | null;

    // Streak-related
    sessionStartTime: Date | null;
    showStreakCompleteModal: boolean;

    startAdhkarSession: (category: 'morning' | 'evening') => void;
    nextAdhkar: () => void;
    previousAdhkar: () => void;
    incrementCount: () => void;
    resetCount: () => void;
    resetSession: () => void;
    saveProgress: () => void;
    loadProgress: () => void;

    getCurrentAdhkar: () => Adhkar | undefined;
    getCurrentCount: () => number;
    getTotalProgress: () => { completed: number; total: number };
    isCompleted: () => boolean;

    // Streak methods
    setShowStreakCompleteModal: (show: boolean) => void;
    getSessionDuration: () => number;
}

export const useAdhkarStore = create<AdhkarStore>((set, get) => ({
    currentCategory: null,
    currentAdhkar: [],
    currentIndex: 0,
    completedCount: {},
    morningProgress: null,
    eveningProgress: null,
    sessionStartTime: null,
    showStreakCompleteModal: false,

    startAdhkarSession: (category: 'morning' | 'evening') => {
        const adhkarList = adhkarService.getAdhkarByCategory(category);

        set({
            currentCategory: category,
            currentAdhkar: adhkarList,
            currentIndex: 0,
            completedCount: {},
            sessionStartTime: new Date(),
        });

        // Mark streak as complete when user opens adhkar
        const streakStore = useStreakStore.getState();
        const today = new Date().toISOString().split('T')[0];
        const existingStreak = streakStore.getStreakForDate(today);

        if (!existingStreak?.completed) {
            streakStore.completeStreakForToday(category);

            // Show success modal after a brief delay
            setTimeout(() => {
                set({ showStreakCompleteModal: true });
            }, 1000);
        }
    },

    nextAdhkar: () => {
        const { currentIndex, currentAdhkar } = get();

        if (currentIndex < currentAdhkar.length - 1) {
            set({ currentIndex: currentIndex + 1 });
        }
    },

    previousAdhkar: () => {
        const { currentIndex } = get();

        if (currentIndex > 0) {
            set({ currentIndex: currentIndex - 1 });
        }
    },

    incrementCount: () => {
        const state = get();
        const { completedCount, currentIndex, currentAdhkar } = state;
        const current = currentAdhkar[currentIndex];

        if (!current) {
            console.log('No current adhkar found');
            return;
        }

        const currentCount = completedCount[currentIndex] || 0;

        if (currentCount < current.count) {
            const newCount = currentCount + 1;

            const newCompletedCount = {
                ...completedCount,
                [currentIndex]: newCount,
            };

            set({
                completedCount: newCompletedCount,
            });

            if (newCount >= current.count && currentIndex < currentAdhkar.length - 1) {
                // Small delay for better UX (user sees completion state)
                setTimeout(() => {
                    const { nextAdhkar } = get();
                    if (nextAdhkar) {
                        nextAdhkar();
                    }
                }, 800);
            }
        }
    },

    resetCount: () => {
        const { completedCount, currentIndex } = get();

        const newCompletedCount = { ...completedCount };
        delete newCompletedCount[currentIndex];

        set({ completedCount: newCompletedCount });
    },

    resetSession: () => {
        set({
            currentCategory: null,
            currentAdhkar: [],
            currentIndex: 0,
            completedCount: {},
            sessionStartTime: null,
        });
    },

    getCurrentAdhkar: () => {
        const { currentAdhkar, currentIndex } = get();
        return currentAdhkar[currentIndex];
    },

    getCurrentCount: () => {
        const { completedCount, currentIndex } = get();
        return completedCount[currentIndex] || 0;
    },

    getTotalProgress: () => {
        const { completedCount, currentAdhkar } = get();

        const completed = Object.entries(completedCount).reduce(
            (total, [indexStr, count]) => {
                const index = parseInt(indexStr);
                const adhkar = currentAdhkar[index];
                if (adhkar && count >= adhkar.count) {
                    return total + 1;
                }
                return total;
            },
            0
        );

        return {
            completed,
            total: currentAdhkar.length,
        };
    },

    isCompleted: () => {
        const { completed, total } = get().getTotalProgress();
        return completed === total;
    },

    saveProgress: () => {
        const { currentCategory, currentIndex, completedCount } = get();

        if (!currentCategory) return;

        const progress: AdhkarProgress = {
            adhkarId: currentCategory,
            categoryId: currentCategory,
            currentIndex,
            completedCount,
            totalCompleted: get().getTotalProgress().completed,
            lastUpdated: new Date(),
        };

        if (currentCategory === 'morning') {
            set({ morningProgress: progress });
        } else {
            set({ eveningProgress: progress });
        }

        // TODO: Persist to AsyncStorage
        // AsyncStorage.setItem(`adhkar_progress_${currentCategory}`, JSON.stringify(progress));
    },

    loadProgress: () => {
        // TODO: Load from AsyncStorage
        // const morningProgress = await AsyncStorage.getItem('adhkar_progress_morning');
    },

    setShowStreakCompleteModal: (show: boolean) => {
        set({ showStreakCompleteModal: show });
    },

    getSessionDuration: () => {
        const { sessionStartTime } = get();
        if (!sessionStartTime) return 0;
        
        const now = new Date();
        const diff = now.getTime() - sessionStartTime.getTime();
        return Math.floor(diff / 1000 / 60); // Convert to minutes
    },
}));