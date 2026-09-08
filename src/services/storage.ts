import { Work, Chapter, PenName, Comment, ReadingPreferences, ReadingProgress } from '../types';
import { INITIAL_WORKS, INITIAL_CHAPTERS, INITIAL_PEN_NAMES, INITIAL_COMMENTS } from '../data/initialData';
import { 
  saveWorkToFirestore, 
  deleteWorkFromFirestore, 
  saveChapterToFirestore, 
  deleteChapterFromFirestore, 
  savePenNameToFirestore, 
  saveCommentToFirestore, 
  deleteCommentFromFirestore 
} from './firebase';

const STORAGE_KEYS = {
  WORKS: 'st_author_works_v1',
  CHAPTERS: 'st_author_chapters_v1',
  PEN_NAMES: 'st_author_pen_names_v1',
  COMMENTS: 'st_author_comments_v1',
  PROGRESS: 'st_author_reading_progress_v1',
  PREFERENCES: 'st_author_reader_prefs_v1',
  ADMIN_AUTH: 'st_author_admin_logged_v1',
  NEWSLETTER: 'st_author_newsletter_subscribers_v1',
};

const DEFAULT_PREFERENCES: ReadingPreferences = {
  theme: 'dark',
  fontFamily: 'serif',
  fontSize: 18,
  lineHeight: 1.8,
  maxWidth: 'normal',
};

// Safe storage accessors
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading localStorage key: ${key}`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key: ${key}`, e);
  }
}

// ----------------- WORKS -----------------
export function getWorks(): Work[] {
  return loadFromStorage<Work[]>(STORAGE_KEYS.WORKS, INITIAL_WORKS);
}

export function setWorksFromFirestore(works: Work[]): void {
  saveToStorage(STORAGE_KEYS.WORKS, works);
}

export function getWorkById(id: string): Work | undefined {
  const works = getWorks();
  return works.find(w => w.id === id);
}

export function saveWork(work: Work): void {
  const works = getWorks();
  const existingIdx = works.findIndex(w => w.id === work.id);
  let updated: Work[];
  let savedItem: Work;

  if (existingIdx >= 0) {
    savedItem = {
      ...work,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    updated = [...works];
    updated[existingIdx] = savedItem;
  } else {
    savedItem = {
      ...work,
      createdAt: work.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    updated = [savedItem, ...works];
  }
  saveToStorage(STORAGE_KEYS.WORKS, updated);
  saveWorkToFirestore(savedItem);
}

export function deleteWork(workId: string): void {
  const works = getWorks().filter(w => w.id !== workId);
  saveToStorage(STORAGE_KEYS.WORKS, works);

  // Also remove all chapters belonging to this work
  const chapters = getChapters().filter(c => c.workId !== workId);
  saveToStorage(STORAGE_KEYS.CHAPTERS, chapters);

  deleteWorkFromFirestore(workId);
}

// ----------------- CHAPTERS -----------------
export function getChapters(workId?: string): Chapter[] {
  const all = loadFromStorage<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
  if (!workId) return all;
  return all
    .filter(c => c.workId === workId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export function setChaptersFromFirestore(chapters: Chapter[]): void {
  saveToStorage(STORAGE_KEYS.CHAPTERS, chapters);
}

export function getChapterById(chapterId: string): Chapter | undefined {
  const chapters = getChapters();
  return chapters.find(c => c.id === chapterId);
}

export function saveChapter(chapter: Chapter): void {
  const chapters = getChapters();
  const existingIdx = chapters.findIndex(c => c.id === chapter.id);
  let updated: Chapter[];

  // compute word count and reading time
  const words = chapter.content ? chapter.content.trim().split(/\s+/).length : 0;
  const computedChapter: Chapter = {
    ...chapter,
    wordCount: words,
    readingTimeMinutes: Math.max(1, Math.ceil(words / 220)),
  };

  if (existingIdx >= 0) {
    updated = [...chapters];
    updated[existingIdx] = computedChapter;
  } else {
    updated = [...chapters, computedChapter];
  }

  saveToStorage(STORAGE_KEYS.CHAPTERS, updated);
  saveChapterToFirestore(computedChapter);

  // Update work's updatedAt
  const work = getWorkById(chapter.workId);
  if (work) {
    saveWork({
      ...work,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  }
}

export function deleteChapter(chapterId: string): void {
  const chapters = getChapters().filter(c => c.id !== chapterId);
  saveToStorage(STORAGE_KEYS.CHAPTERS, chapters);
  deleteChapterFromFirestore(chapterId);
}

export function reorderChapters(workId: string, orderedChapterIds: string[]): void {
  const allChapters = getChapters();
  const otherChapters = allChapters.filter(c => c.workId !== workId);
  const workChaptersMap = new Map(allChapters.filter(c => c.workId === workId).map(c => [c.id, c]));

  const updatedWorkChapters: Chapter[] = [];
  orderedChapterIds.forEach((id, index) => {
    const ch = workChaptersMap.get(id);
    if (ch) {
      const updated = {
        ...ch,
        chapterNumber: index + 1,
      };
      updatedWorkChapters.push(updated);
      saveChapterToFirestore(updated);
    }
  });

  saveToStorage(STORAGE_KEYS.CHAPTERS, [...otherChapters, ...updatedWorkChapters]);
}

// ----------------- PEN NAMES -----------------
export function getPenNames(): PenName[] {
  return loadFromStorage<PenName[]>(STORAGE_KEYS.PEN_NAMES, INITIAL_PEN_NAMES);
}

export function setPenNamesFromFirestore(penNames: PenName[]): void {
  saveToStorage(STORAGE_KEYS.PEN_NAMES, penNames);
}

export function savePenName(penName: PenName): void {
  const penNames = getPenNames();
  const idx = penNames.findIndex(p => p.id === penName.id);
  let updated: PenName[];
  if (idx >= 0) {
    updated = [...penNames];
    updated[idx] = penName;
  } else {
    updated = [...penNames, penName];
  }
  saveToStorage(STORAGE_KEYS.PEN_NAMES, updated);
  savePenNameToFirestore(penName);
}

// ----------------- COMMENTS -----------------
export function getComments(targetType?: 'work' | 'chapter', targetId?: string): Comment[] {
  const all = loadFromStorage<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  if (!targetType || !targetId) return all;
  return all
    .filter(c => c.targetType === targetType && c.targetId === targetId)
    .sort((a, b) => {
      // Pinned comments first, then recent
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function setCommentsFromFirestore(comments: Comment[]): void {
  saveToStorage(STORAGE_KEYS.COMMENTS, comments);
}

export function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Comment {
  const all = getComments();
  const newComment: Comment = {
    ...comment,
    id: 'comm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    likes: 0,
  };
  saveToStorage(STORAGE_KEYS.COMMENTS, [newComment, ...all]);
  saveCommentToFirestore(newComment);
  return newComment;
}

export function deleteComment(commentId: string): void {
  const all = getComments().filter(c => c.id !== commentId && c.parentId !== commentId);
  saveToStorage(STORAGE_KEYS.COMMENTS, all);
  deleteCommentFromFirestore(commentId);
}

export function togglePinComment(commentId: string): void {
  let updatedItem: Comment | undefined;
  const all = getComments().map(c => {
    if (c.id === commentId) {
      updatedItem = { ...c, pinned: !c.pinned };
      return updatedItem;
    }
    return c;
  });
  saveToStorage(STORAGE_KEYS.COMMENTS, all);
  if (updatedItem) {
    saveCommentToFirestore(updatedItem);
  }
}

export function likeComment(commentId: string): void {
  let updatedItem: Comment | undefined;
  const all = getComments().map(c => {
    if (c.id === commentId) {
      updatedItem = { ...c, likes: (c.likes || 0) + 1 };
      return updatedItem;
    }
    return c;
  });
  saveToStorage(STORAGE_KEYS.COMMENTS, all);
  if (updatedItem) {
    saveCommentToFirestore(updatedItem);
  }
}

// ----------------- READING PROGRESS -----------------
export function getReadingProgress(): ReadingProgress {
  return loadFromStorage<ReadingProgress>(STORAGE_KEYS.PROGRESS, {});
}

export function saveReadingProgress(workId: string, chapterId: string, chapterNumber: number): void {
  const progress = getReadingProgress();
  progress[workId] = {
    lastChapterId: chapterId,
    lastChapterNumber: chapterNumber,
    updatedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.PROGRESS, progress);
}

// ----------------- READING PREFERENCES -----------------
export function getReadingPreferences(): ReadingPreferences {
  return loadFromStorage<ReadingPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
}

export function saveReadingPreferences(prefs: ReadingPreferences): void {
  saveToStorage(STORAGE_KEYS.PREFERENCES, prefs);
}

// ----------------- ADMIN AUTH -----------------
// Simple author passcode for Souleymane Thiao
const AUTHOR_PASSCODE = 'souleymane2026';
const ALTERNATE_PASSCODE = 'admin';

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function loginAdmin(passcode: string): boolean {
  if (passcode.trim().toLowerCase() === AUTHOR_PASSCODE || passcode.trim().toLowerCase() === ALTERNATE_PASSCODE) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
}

// ----------------- NEWSLETTER -----------------
export function subscribeNewsletter(email: string, penNameId?: string): boolean {
  const subs = loadFromStorage<{ email: string; penNameId?: string; date: string }[]>(STORAGE_KEYS.NEWSLETTER, []);
  if (subs.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    return true; // already subscribed
  }
  subs.push({
    email,
    penNameId,
    date: new Date().toISOString(),
  });
  saveToStorage(STORAGE_KEYS.NEWSLETTER, subs);
  return true;
}

// ----------------- EXPORT / IMPORT JSON -----------------
export function exportCatalogData(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    author: 'Souleymane Thiao',
    works: getWorks(),
    chapters: getChapters(),
    penNames: getPenNames(),
    comments: getComments(),
  };
  return JSON.stringify(data, null, 2);
}

export function importCatalogData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.works && Array.isArray(parsed.works)) {
      saveToStorage(STORAGE_KEYS.WORKS, parsed.works);
    }
    if (parsed.chapters && Array.isArray(parsed.chapters)) {
      saveToStorage(STORAGE_KEYS.CHAPTERS, parsed.chapters);
    }
    if (parsed.penNames && Array.isArray(parsed.penNames)) {
      saveToStorage(STORAGE_KEYS.PEN_NAMES, parsed.penNames);
    }
    if (parsed.comments && Array.isArray(parsed.comments)) {
      saveToStorage(STORAGE_KEYS.COMMENTS, parsed.comments);
    }
    return true;
  } catch (e) {
    console.error('Failed to import catalog JSON:', e);
    return false;
  }
}

export function resetToInitialData(): void {
  saveToStorage(STORAGE_KEYS.WORKS, INITIAL_WORKS);
  saveToStorage(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
  saveToStorage(STORAGE_KEYS.PEN_NAMES, INITIAL_PEN_NAMES);
  saveToStorage(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
}
