// import { adhkarService } from '@/service/adhkar.service';
// import { Adhkar, AdhkarProgress } from '@/types/adhkar.types';
// import { create } from 'zustand';
// import { useStreakStore } from './streak-store';

// interface AdhkarStore {
//     currentCategory: 'morning' | 'evening' | null;
//     currentAdhkar: Adhkar[];
//     currentIndex: number;
//     completedCount: Record<number, number>;

//     morningProgress: AdhkarProgress | null;
//     eveningProgress: AdhkarProgress | null;

//     // Streak-related
//     sessionStartTime: Date | null;
//     showStreakCompleteModal: boolean;
    
//     // Time tracking for modal
//     lastInteractionTime: Date | null;

//     startAdhkarSession: (category: 'morning' | 'evening') => void;
//     nextAdhkar: () => void;
//     previousAdhkar: () => void;
//     incrementCount: () => void;
//     resetCount: () => void;
//     resetSession: () => void;
//     saveProgress: () => void;
//     loadProgress: () => void;

//     getCurrentAdhkar: () => Adhkar | undefined;
//     getCurrentCount: () => number;
//     getTotalProgress: () => { completed: number; total: number };
//     isCompleted: () => boolean;

//     // Streak methods
//     setShowStreakCompleteModal: (show: boolean) => void;
//     getSessionDuration: () => number;
//     checkAndMarkStreakCompletion: () => boolean;
    
//     // Time-based modal methods
//     checkTimeBasedModal: () => void;
//     recordInteraction: () => void;
// }

// export const useAdhkarStore = create<AdhkarStore>((set, get) => ({
//     currentCategory: null,
//     currentAdhkar: [],
//     currentIndex: 0,
//     completedCount: {},
//     morningProgress: null,
//     eveningProgress: null,
//     sessionStartTime: null,
//     showStreakCompleteModal: false,
//     lastInteractionTime: null,

//     startAdhkarSession: (category: 'morning' | 'evening') => {
//         const adhkarList = adhkarService.getAdhkarByCategory(category);
//         const now = new Date();

//         set({
//             currentCategory: category,
//             currentAdhkar: adhkarList,
//             currentIndex: 0,
//             completedCount: {},
//             sessionStartTime: now,
//             lastInteractionTime: now,
//             showStreakCompleteModal: false,
//         });
//     },

//     nextAdhkar: () => {
//         const { currentIndex, currentAdhkar } = get();

//         if (currentIndex < currentAdhkar.length - 1) {
//             set({ 
//                 currentIndex: currentIndex + 1,
//                 lastInteractionTime: new Date()
//             });
//         }
//     },

//     previousAdhkar: () => {
//         const { currentIndex } = get();

//         if (currentIndex > 0) {
//             set({ 
//                 currentIndex: currentIndex - 1,
//                 lastInteractionTime: new Date()
//             });
//         }
//     },

//     incrementCount: () => {
//         const state = get();
//         const { completedCount, currentIndex, currentAdhkar } = state;
//         const current = currentAdhkar[currentIndex];

//         if (!current) {
//             console.log('No current adhkar found');
//             return;
//         }

//         const currentCount = completedCount[currentIndex] || 0;

//         if (currentCount < current.count) {
//             const newCount = currentCount + 1;

//             const newCompletedCount = {
//                 ...completedCount,
//                 [currentIndex]: newCount,
//             };

//             set({
//                 completedCount: newCompletedCount,
//                 lastInteractionTime: new Date()
//             });

//             // Check for time-based modal on every interaction
//             setTimeout(() => {
//                 state.checkTimeBasedModal();
//             }, 100);

//             // Check if current adhkar is now completed
//             if (newCount >= current.count) {
//                 // Check if ALL adhkar are completed
//                 const allCompleted = state.isCompleted();
                
//                 if (allCompleted) {
//                     // Mark streak as complete
//                     const streakMarked = state.checkAndMarkStreakCompletion();
                    
//                     // Only show completion modal if time modal hasn't shown today
//                     const streakStore = useStreakStore.getState();
                    
//                     // Check if should show modal (time-based takes priority)
//                     const sessionMinutes = state.getSessionDuration();
//                     const shouldShowTimeModal = streakStore.shouldShowTimeModal(sessionMinutes);
                    
//                     if (streakMarked && !shouldShowTimeModal) {
//                         // Mark as seen to prevent duplicate modals
//                         streakStore.markTimeModalAsSeen();
//                         setTimeout(() => {
//                             set({ showStreakCompleteModal: true });
//                         }, 800);
//                     }
//                 }
                
//                 // Auto-advance to next adhkar if not the last one
//                 if (currentIndex < currentAdhkar.length - 1) {
//                     setTimeout(() => {
//                         const { nextAdhkar } = get();
//                         if (nextAdhkar) {
//                             nextAdhkar();
//                         }
//                     }, 800);
//                 }
//             }
//         }
//     },

//     resetCount: () => {
//         const { completedCount, currentIndex } = get();

//         const newCompletedCount = { ...completedCount };
//         delete newCompletedCount[currentIndex];

//         set({ 
//             completedCount: newCompletedCount,
//             lastInteractionTime: new Date()
//         });
//     },

//     resetSession: () => {
//         set({
//             currentCategory: null,
//             currentAdhkar: [],
//             currentIndex: 0,
//             completedCount: {},
//             sessionStartTime: null,
//             lastInteractionTime: null,
//         });
//     },

//     getCurrentAdhkar: () => {
//         const { currentAdhkar, currentIndex } = get();
//         return currentAdhkar[currentIndex];
//     },

//     getCurrentCount: () => {
//         const { completedCount, currentIndex } = get();
//         return completedCount[currentIndex] || 0;
//     },

//     getTotalProgress: () => {
//         const { completedCount, currentAdhkar } = get();

//         const completed = Object.entries(completedCount).reduce(
//             (total, [indexStr, count]) => {
//                 const index = parseInt(indexStr);
//                 const adhkar = currentAdhkar[index];
//                 if (adhkar && count >= adhkar.count) {
//                     return total + 1;
//                 }
//                 return total;
//             },
//             0
//         );

//         return {
//             completed,
//             total: currentAdhkar.length,
//         };
//     },

//     isCompleted: () => {
//         const { completed, total } = get().getTotalProgress();
//         return completed === total;
//     },

//     saveProgress: () => {
//         const { currentCategory, currentIndex, completedCount } = get();

//         if (!currentCategory) return;

//         const progress: AdhkarProgress = {
//             adhkarId: currentCategory,
//             categoryId: currentCategory,
//             currentIndex,
//             completedCount,
//             totalCompleted: get().getTotalProgress().completed,
//             lastUpdated: new Date(),
//         };

//         if (currentCategory === 'morning') {
//             set({ morningProgress: progress });
//         } else {
//             set({ eveningProgress: progress });
//         }
//     },

//     loadProgress: () => {
//         // TODO: Load from AsyncStorage
//     },

//     setShowStreakCompleteModal: (show: boolean) => {
//         set({ showStreakCompleteModal: show });
//     },

//     getSessionDuration: () => {
//         const { sessionStartTime } = get();
//         if (!sessionStartTime) return 0;
        
//         const now = new Date();
//         const diff = now.getTime() - sessionStartTime.getTime();
//         return Math.floor(diff / 1000 / 60); // Convert to minutes
//     },

//     checkAndMarkStreakCompletion: () => {
//         const state = get();
//         const { currentCategory, isCompleted } = state;
        
//         if (!currentCategory || !isCompleted()) {
//             return false;
//         }
        
//         const streakStore = useStreakStore.getState();
        
//         // Use streak store's method to get today's date string
//         const todayString = streakStore.getTodayDateString();
        
//         const existingStreak = streakStore.getStreakForDate(todayString);
        
//         if (!existingStreak?.completed) {
//             streakStore.completeStreakForToday(currentCategory);
//             return true;
//         }
        
//         return false;
//     },

//     // Check if should show time-based modal
//     checkTimeBasedModal: () => {
//         const state = get();
//         const sessionMinutes = state.getSessionDuration();
//         const streakStore = useStreakStore.getState();
        
//         // Check if should show modal based on time
//         if (streakStore.shouldShowTimeModal(sessionMinutes)) {
//             // Mark modal as seen
//             streakStore.markTimeModalAsSeen();
//             streakStore.recordSessionDuration(sessionMinutes);
            
//             // Show modal
//             setTimeout(() => {
//                 set({ showStreakCompleteModal: true });
//             }, 500);
//         }
//     },

//     // Record user interaction
//     recordInteraction: () => {
//         set({ lastInteractionTime: new Date() });
//     },
// }));