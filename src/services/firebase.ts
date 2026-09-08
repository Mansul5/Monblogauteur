import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Work, Chapter, PenName, Comment } from '../types';
import { INITIAL_WORKS, INITIAL_CHAPTERS, INITIAL_PEN_NAMES, INITIAL_COMMENTS } from '../data/initialData';
import { compressImageSource } from '../utils/imageCompressor';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Database instance (using custom named database if present)
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

// Collection References
export const COLLECTIONS = {
  WORKS: 'works',
  CHAPTERS: 'chapters',
  PEN_NAMES: 'penNames',
  COMMENTS: 'comments',
};

/**
 * Seed initial catalog to Firestore if collections are empty.
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  if (!isFirebaseConfigured) return;

  try {
    const worksSnapshot = await getDocs(collection(db, COLLECTIONS.WORKS));
    if (worksSnapshot.empty) {
      console.log('Seeding initial works to Firestore...');
      const batch = writeBatch(db);

      // Seed Pen Names
      for (const pen of INITIAL_PEN_NAMES) {
        const ref = doc(db, COLLECTIONS.PEN_NAMES, pen.id);
        batch.set(ref, pen);
      }

      // Seed Works
      for (const work of INITIAL_WORKS) {
        const ref = doc(db, COLLECTIONS.WORKS, work.id);
        batch.set(ref, work);
      }

      // Seed Chapters
      for (const chapter of INITIAL_CHAPTERS) {
        const ref = doc(db, COLLECTIONS.CHAPTERS, chapter.id);
        batch.set(ref, chapter);
      }

      // Seed Comments
      for (const comment of INITIAL_COMMENTS) {
        const ref = doc(db, COLLECTIONS.COMMENTS, comment.id);
        batch.set(ref, comment);
      }

      await batch.commit();
      console.log('Initial data seeded to Firestore successfully.');
    }
  } catch (error) {
    console.warn('Firestore initial seeding skipped or failed (will use local fallback):', error);
  }
}

// ----------------- REALTIME SUBSCRIPTIONS -----------------

export function subscribeToWorks(callback: (works: Work[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.WORKS), (snapshot) => {
    if (!snapshot.empty) {
      const works = snapshot.docs.map(doc => doc.data() as Work);
      callback(works);
    }
  }, (err) => {
    console.warn('Firestore subscribeToWorks error:', err);
  });
}

export function subscribeToChapters(callback: (chapters: Chapter[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.CHAPTERS), (snapshot) => {
    if (!snapshot.empty) {
      const chapters = snapshot.docs.map(doc => doc.data() as Chapter);
      callback(chapters);
    }
  }, (err) => {
    console.warn('Firestore subscribeToChapters error:', err);
  });
}

export function subscribeToPenNames(callback: (penNames: PenName[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.PEN_NAMES), (snapshot) => {
    if (!snapshot.empty) {
      const penNames = snapshot.docs.map(doc => doc.data() as PenName);
      callback(penNames);
    }
  }, (err) => {
    console.warn('Firestore subscribeToPenNames error:', err);
  });
}

export function subscribeToComments(callback: (comments: Comment[]) => void) {
  return onSnapshot(collection(db, COLLECTIONS.COMMENTS), (snapshot) => {
    if (!snapshot.empty) {
      const comments = snapshot.docs.map(doc => doc.data() as Comment);
      callback(comments);
    }
  }, (err) => {
    console.warn('Firestore subscribeToComments error:', err);
  });
}

// ----------------- FIRESTORE WRITE ACTIONS -----------------

export async function saveWorkToFirestore(work: Work): Promise<void> {
  try {
    let payload = { ...work };

    // Cloud Firestore document limit is 1,048,576 bytes (~1MB).
    // If a user uploads an uncompressed high-res cover (e.g. 2-5MB base64),
    // automatically compress it down to ~40-80KB to guarantee painless Firestore saving.
    if (payload.coverUrl && payload.coverUrl.startsWith('data:image/') && payload.coverUrl.length > 250000) {
      try {
        payload.coverUrl = await compressImageSource(payload.coverUrl, 700, 1050, 0.8);
      } catch (compErr) {
        console.warn('Could not compress coverUrl before Firestore save:', compErr);
      }
    }

    const docRef = doc(db, COLLECTIONS.WORKS, payload.id);
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.error('Error saving work to Firestore:', err);
  }
}

/**
 * Scans local storage works to repair any works whose cover was too large
 * to save to Firestore, and pushes them safely to Cloud Firestore.
 */
export async function syncAndRepairOversizedLocalWorks(
  localWorks: Work[], 
  updateLocalWork: (work: Work) => void
): Promise<void> {
  if (!isFirebaseConfigured || !localWorks || localWorks.length === 0) return;

  for (const work of localWorks) {
    if (work.coverUrl && work.coverUrl.startsWith('data:image/') && work.coverUrl.length > 250000) {
      try {
        console.log(`Optimizing oversized cover image for work "${work.title}" (${work.id})...`);
        const compressed = await compressImageSource(work.coverUrl, 700, 1050, 0.8);
        const fixedWork: Work = { ...work, coverUrl: compressed };
        updateLocalWork(fixedWork);
        await saveWorkToFirestore(fixedWork);
        console.log(`Successfully synced repaired work "${work.title}" to Firestore!`);
      } catch (e) {
        console.warn('Failed to repair oversized work:', e);
      }
    } else {
      // Ensure work exists in Firestore
      try {
        await saveWorkToFirestore(work);
      } catch (e) {
        console.warn('Work sync check error:', e);
      }
    }
  }
}

export async function deleteWorkFromFirestore(workId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.WORKS, workId);
    await deleteDoc(docRef);

    // Delete associated chapters
    const chaptersSnap = await getDocs(collection(db, COLLECTIONS.CHAPTERS));
    const batch = writeBatch(db);
    chaptersSnap.docs.forEach((d) => {
      const data = d.data() as Chapter;
      if (data.workId === workId) {
        batch.delete(d.ref);
      }
    });
    await batch.commit();
  } catch (err) {
    console.error('Error deleting work from Firestore:', err);
  }
}

export async function saveChapterToFirestore(chapter: Chapter): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CHAPTERS, chapter.id);
    await setDoc(docRef, chapter, { merge: true });
  } catch (err) {
    console.error('Error saving chapter to Firestore:', err);
  }
}

export async function deleteChapterFromFirestore(chapterId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CHAPTERS, chapterId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting chapter from Firestore:', err);
  }
}

export async function savePenNameToFirestore(penName: PenName): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.PEN_NAMES, penName.id);
    await setDoc(docRef, penName, { merge: true });
  } catch (err) {
    console.error('Error saving pen name to Firestore:', err);
  }
}

export async function saveCommentToFirestore(comment: Comment): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.COMMENTS, comment.id);
    await setDoc(docRef, comment, { merge: true });
  } catch (err) {
    console.error('Error saving comment to Firestore:', err);
  }
}

export async function deleteCommentFromFirestore(commentId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.COMMENTS, commentId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting comment from Firestore:', err);
  }
}
