export interface HadithGrade {
  name: string;
  grade: string;
}

export interface HadithReference {
  book: number;
  hadith: number;
}

export interface Hadith {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: HadithGrade[];
  reference: HadithReference;
}

export interface SectionDetail {
  hadithnumber_first: number;
  hadithnumber_last: number;
  arabicnumber_first: number;
  arabicnumber_last: number;
}

export interface HadithMetadata {
  name: string;
  sections: {
    [key: string]: string; // sectionNumber: sectionTitle
  };
  section_details: {
    [key: string]: SectionDetail;
  };
}

export interface HadithDataset {
  metadata: HadithMetadata;
  hadiths: Hadith[];
}

export interface HadithBook {
  bookNumber: number;
  book: string;
  hadiths: Hadith[];
  hadithStartNumber: number;
  hadithEndNumber: number;
  arabicStartNumber: number;
  arabicEndNumber: number;
  numberOfHadith: number;
}

export interface HadithCollection {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  image: any; // For require() image
  color: string;
  totalHadiths: number;
}

export type HadithCollectionId = 'muslim' | 'bukhari' | 'abudawud' | 'tirmidhi';

export interface HadithLanguage {
  arabic: HadithDataset;
  english: HadithDataset;
}

export interface HadithState {
  collections: HadithCollection[];
  currentCollection: HadithCollectionId | null;
  currentBook: HadithBook | null;
  currentHadith: number | null;
  language: 'english' | 'arabic' | 'both';

  // Data storage
  loadedData: {
    [key in HadithCollectionId]?: {
      arabic: HadithDataset;
      english: HadithDataset;
      books: HadithBook[];
    };
  };

  isLoading: boolean;
  error: string | null;
}