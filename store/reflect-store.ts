import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReflectionDraft {
    surahNumber?: number;
    verseNumber?: number;
    arabicText?: string;
    translation?: string;
    surahName?: string;
    content?: string;
}

interface ReflectStore {
    // Current draft for reflection
    draft: ReflectionDraft;

    // Actions
    setDraft: (draft: Partial<ReflectionDraft>) => void;
    clearDraft: () => void;
    getDraftForSubmission: () => {
        surah: number;
        startAyah: number;
        endAyah: number;
        content: string;
    };
}

export const useReflectStore = create<ReflectStore>()(
    persist(
        (set, get) => ({
            // Initial state
            draft: {},

            // Set draft data (merges with existing draft)
            setDraft: (newDraft: Partial<ReflectionDraft>) => {
                console.log('📝 Updating draft:', newDraft);
                set((state) => ({
                    draft: { ...state.draft, ...newDraft }
                }));
            },

            // Clear draft completely
            clearDraft: () => {
                console.log('🧹 Clearing draft');
                set({ draft: {} });
            },

            // Get formatted data for API submission
            getDraftForSubmission: () => {
                const { draft } = get();

                console.log('📤 Preparing draft for submission:', draft);

                // Validation
                if (!draft.surahNumber) {
                    throw new Error('Surah information is required for reflection');
                }

                if (!draft.content?.trim()) {
                    throw new Error('Reflection content cannot be empty');
                }

                if (draft.content.trim().length < 5) {
                    throw new Error('Reflection content must be at least 5 characters long');
                }

                return {
                    surah: draft.surahNumber,
                    startAyah: draft.verseNumber || 1,
                    endAyah: draft.verseNumber || 1,
                    content: draft.content.trim(),
                };
            },
        }),
        {
            name: 'reflect-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);