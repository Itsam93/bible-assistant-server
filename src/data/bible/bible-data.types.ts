export interface BibleDataVerse {
  verse: number;
  text: string;
}

export interface BibleDataChapter {
  chapter: number;
  verses: BibleDataVerse[];
}

export interface BibleDataBook {
  bookId: string;
  name: string;
  chapters: BibleDataChapter[];
}

export interface BibleTranslationData {
  translationId: string;
  books: BibleDataBook[];
}