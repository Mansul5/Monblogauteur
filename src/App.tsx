import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogueView } from './components/CatalogueView';
import { WorkDetailView } from './components/WorkDetailView';
import { ReaderView } from './components/ReaderView';
import { AboutView } from './components/AboutView';
import { UniverseView } from './components/UniverseView';
import { AdminView } from './components/AdminView';

import { 
  getWorks, getChapters, getPenNames, getComments, 
  getReadingProgress, getReadingPreferences, saveReadingPreferences, 
  addComment, likeComment, saveWork,
  setWorksFromFirestore, setChaptersFromFirestore, setPenNamesFromFirestore, setCommentsFromFirestore
} from './services/storage';
import { 
  seedFirestoreIfEmpty, 
  subscribeToWorks, 
  subscribeToChapters, 
  subscribeToPenNames, 
  subscribeToComments,
  syncAndRepairOversizedLocalWorks 
} from './services/firebase';
import { Work, Chapter, PenName, Comment, ReadingPreferences, ReadingProgress } from './types';

export default function App() {
  // Navigation & Routing State
  const [currentView, setCurrentView] = useState<'catalogue' | 'work-detail' | 'reader' | 'about' | 'universe' | 'admin'>('catalogue');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Core Data States (synchronized with storage & Firestore)
  const [works, setWorks] = useState<Work[]>(() => getWorks());
  const [chapters, setChapters] = useState<Chapter[]>(() => getChapters());
  const [penNames, setPenNames] = useState<PenName[]>(() => getPenNames());
  const [comments, setComments] = useState<Comment[]>(() => getComments());
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() => getReadingProgress());
  const [readingPreferences, setReadingPreferences] = useState<ReadingPreferences>(() => getReadingPreferences());

  // Real-time Firestore sync & Initial Seeding
  useEffect(() => {
    // Seed initial data if Firestore is empty and repair any works with oversized covers
    const initSync = async () => {
      await seedFirestoreIfEmpty();
      const localWorks = getWorks();
      await syncAndRepairOversizedLocalWorks(localWorks, (repaired) => {
        saveWork(repaired);
        setWorks(getWorks());
      });
    };
    initSync();

    // Subscribe to Firestore collections in real time
    const unsubWorks = subscribeToWorks((remoteWorks) => {
      if (remoteWorks && remoteWorks.length > 0) {
        setWorks(remoteWorks);
        setWorksFromFirestore(remoteWorks);
      }
    });

    const unsubChapters = subscribeToChapters((remoteChapters) => {
      if (remoteChapters && remoteChapters.length > 0) {
        setChapters(remoteChapters);
        setChaptersFromFirestore(remoteChapters);
      }
    });

    const unsubPenNames = subscribeToPenNames((remotePenNames) => {
      if (remotePenNames && remotePenNames.length > 0) {
        setPenNames(remotePenNames);
        setPenNamesFromFirestore(remotePenNames);
      }
    });

    const unsubComments = subscribeToComments((remoteComments) => {
      if (remoteComments && remoteComments.length > 0) {
        setComments(remoteComments);
        setCommentsFromFirestore(remoteComments);
      }
    });

    return () => {
      unsubWorks();
      unsubChapters();
      unsubPenNames();
      unsubComments();
    };
  }, []);

  // Function to refresh state from storage
  const refreshData = () => {
    setWorks(getWorks());
    setChapters(getChapters());
    setPenNames(getPenNames());
    setComments(getComments());
    setReadingProgress(getReadingProgress());
  };

  // Preference update handler
  const handleUpdatePreferences = (prefs: ReadingPreferences) => {
    setReadingPreferences(prefs);
    saveReadingPreferences(prefs);
  };

  // Navigation handlers
  const handleNavigate = (view: 'catalogue' | 'about' | 'universe' | 'admin') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWork = (workId: string) => {
    setSelectedWorkId(workId);
    setCurrentView('work-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChapter = (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      setSelectedWorkId(chapter.workId);
      setSelectedChapterId(chapterId);
      setCurrentView('reader');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToCatalogue = () => {
    setCurrentView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWork = () => {
    if (selectedWorkId) {
      setCurrentView('work-detail');
    } else {
      setCurrentView('catalogue');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tag filter selection
  const handleSelectTag = (tag: string) => {
    setSelectedTagFilter(tag);
    setCurrentView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Comment Handlers
  const handleAddComment = (
    targetType: 'work' | 'chapter',
    targetId: string,
    authorName: string,
    content: string,
    parentId?: string
  ) => {
    addComment({
      targetType,
      targetId,
      authorName,
      content,
      parentId: parentId || null,
    });
    refreshData();
  };

  const handleLikeComment = (commentId: string) => {
    likeComment(commentId);
    refreshData();
  };

  // Current active records
  const currentWork = works.find(w => w.id === selectedWorkId) || works[0];
  const currentWorkChapters = chapters.filter(c => c.workId === currentWork?.id);
  const currentChapter = chapters.find(c => c.id === selectedChapterId) || currentWorkChapters[0];
  const currentWorkPenName = penNames.find(p => p.id === currentWork?.penNameId);
  const currentWorkComments = comments.filter(c => c.targetType === 'work' && c.targetId === currentWork?.id);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0c16] text-[#e2e8f0]">
      
      {/* Top Navigation Bar (hidden in full immersion reader mode if preferred, or available with reader context) */}
      {currentView !== 'reader' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenWork={handleOpenWork}
          onOpenChapter={handleOpenChapter}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalogue' && (
          <CatalogueView
            works={works}
            chapters={chapters}
            penNames={penNames}
            onSelectWork={handleOpenWork}
            selectedTagFilter={selectedTagFilter}
            onClearTagFilter={() => setSelectedTagFilter(null)}
          />
        )}

        {currentView === 'work-detail' && currentWork && (
          <WorkDetailView
            work={currentWork}
            chapters={currentWorkChapters}
            penName={currentWorkPenName}
            comments={currentWorkComments}
            readingProgress={readingProgress}
            onBack={handleBackToCatalogue}
            onOpenChapter={handleOpenChapter}
            onSelectTag={handleSelectTag}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        )}

        {currentView === 'reader' && currentWork && currentChapter && (
          <ReaderView
            work={currentWork}
            currentChapter={currentChapter}
            allChapters={currentWorkChapters}
            comments={comments}
            preferences={readingPreferences}
            onUpdatePreferences={handleUpdatePreferences}
            onSelectChapter={handleOpenChapter}
            onBackToWork={handleBackToWork}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />
        )}

        {currentView === 'universe' && (
          <UniverseView
            onOpenWork={handleOpenWork}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            penNames={penNames}
            onSelectPenName={(penId) => {
              setCurrentView('catalogue');
              // trigger catalog filter by pen name
            }}
            onNavigateCatalogue={() => handleNavigate('catalogue')}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            works={works}
            chapters={chapters}
            penNames={penNames}
            comments={comments}
            onRefreshData={refreshData}
            onOpenWorkPublic={handleOpenWork}
            onOpenChapterPublic={handleOpenChapter}
          />
        )}
      </main>

      {/* Persistent Footer (only shown outside reader view for total immersion) */}
      {currentView !== 'reader' && (
        <Footer
          penNames={penNames}
          onSelectPenName={(penId) => {
            setCurrentView('catalogue');
          }}
          onNavigate={handleNavigate}
        />
      )}

    </div>
  );
}
