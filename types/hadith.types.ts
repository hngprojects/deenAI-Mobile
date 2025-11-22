// types/hadith.types.ts

export interface HadithMetadata {
  name: string;
  sections: {
    [key: string]: string;
  };
}

export interface SectionDetail {
  hadithnumber_first: number;
  hadithnumber_last: number;
  arabicnumber_first: number;
  arabicnumber_last: number;
}

export interface HadithReference {
  book: number;
  hadith: number;
}

export interface HadithData {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: any[];
  reference: HadithReference;
}

export interface HadithCollection {
  metadata: HadithMetadata;
  section_details: {
    [key: string]: SectionDetail;
  };
  hadiths: HadithData[];
}

export interface HadithBook {
  id: string;
  name: string;
  title: string;
  description: string;
  image: any;
}

export interface HadithCategory {
  id: string;
  number: string;
  title: string;
  hadithRange: string;
}

export interface HadithDisplayData {
  english: HadithData[];
  arabic: HadithData[];
}

export type CollectionId = 'bukhari' | 'muslim' | 'abudawud' | 'tirmidhi';
export type Language = 'eng' | 'ara';