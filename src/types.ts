export type WorkType = 'roman' | 'nouvelle';
export type WorkStatus = 'en_cours' | 'termine' | 'one_shot' | 'brouillon';

export interface PenName {
  id: string;
  name: string;
  tagline: string;
  genreFocus: string;
  bio: string;
  avatarUrl?: string;
}

export interface Chapter {
  id: string;
  workId: string;
  chapterNumber: number;
  title: string;
  content: string; // rich text or formatted paragraphs
  status: 'publie' | 'brouillon';
  publishedAt: string;
  scheduledDate?: string;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface Work {
  id: string;
  title: string;
  penNameId: string;
  type: WorkType;
  status: WorkStatus;
  genres: string[];
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  coverUrl: string;
  universeId?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
}

export interface Comment {
  id: string;
  targetType: 'work' | 'chapter';
  targetId: string; // workId or chapterId
  authorName: string;
  authorEmail?: string;
  isAuthorReply?: boolean; // Souleymane himself
  content: string;
  createdAt: string;
  parentId?: string | null;
  pinned?: boolean;
  likes: number;
}

export interface UniverseEra {
  id: string;
  era: string;
  title: string;
  description: string;
  workId?: string;
  workTitle?: string;
}

export interface UniverseFaction {
  name: string;
  title: string;
  description: string;
  crestIcon?: string;
}

export interface LoreUniverse {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  eras: UniverseEra[];
  factions: UniverseFaction[];
}

export interface ReadingPreferences {
  theme: 'dark' | 'sepia' | 'light';
  fontFamily: 'serif' | 'sans' | 'mono';
  fontSize: number; // 16 to 24
  lineHeight: number; // 1.5 to 2.2
  maxWidth: 'compact' | 'normal' | 'wide';
}

export interface ReadingProgress {
  [workId: string]: {
    lastChapterId: string;
    lastChapterNumber: number;
    updatedAt: string;
  };
}
