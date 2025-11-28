export interface Adhkar {
  order: number;
  content: string;
  translation: string;
  transliteration: string;
  count: number;
  count_description: string;
  fadl: string;
  source: string;
  type: AdhkarType;
  audio: string;
  hadith_text: string;
  explanation_of_hadith_vocabulary: string;
}

export enum AdhkarType {
  Both = 0,      // Morning and Evening
  Morning = 1,   // Morning only
  Evening = 2    // Evening only
}

export interface AdhkarCategory {
  id: 'morning' | 'evening';
  title: string;
  items: Adhkar[];
}

export interface AdhkarProgress {
  adhkarId: string;
  categoryId: 'morning' | 'evening';
  currentIndex: number;
  completedCount: Record<number, number>; // { adhkarOrder: currentCount }
  totalCompleted: number;
  lastUpdated: Date;
}