import React, { useState } from 'react';
import { BookOpen, Sparkles, Compass, User, Lock, Menu, X, BookmarkCheck, ArrowRight } from 'lucide-react';
import { getReadingProgress, getWorkById, getChapterById } from '../services/storage';

interface NavbarProps {
  currentView: 'catalogue' | 'work-detail' | 'reader' | 'about' | 'universe' | 'admin';
  onNavigate: (view: 'catalogue' | 'about' | 'universe' | 'admin') => void;
  onOpenWork: (workId: string) => void;
  onOpenChapter: (chapterId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenWork,
  onOpenChapter,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if there is active reading progress
  const progress = getReadingProgress();
  const progressEntries = Object.entries(progress);
  const lastActiveWorkId = progressEntries.length > 0 ? progressEntries[progressEntries.length - 1][0] : null;
  const lastActiveChapterId = lastActiveWorkId ? progress[lastActiveWorkId]?.lastChapterId : null;
  const lastActiveWork = lastActiveWorkId ? getWorkById(lastActiveWorkId) : null;
  const lastActiveChapter = lastActiveChapterId ? getChapterById(lastActiveChapterId) : null;

  const handleNav = (view: 'catalogue' | 'about' | 'universe' | 'admin') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/40 bg-[#0a0c16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNav('catalogue')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 via-purple-600/30 to-cyan-500/20 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0c0f1d]">
              <Sparkles className="h-5 w-5 text-amber-400 transition-colors group-hover:text-amber-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-bold tracking-wider text-slate-100 group-hover:text-amber-300 transition-colors">
              SOULEYMANE THIAO
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-amber-500/80">
              Récits & Légendes
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            id="nav-catalogue-btn"
            onClick={() => handleNav('catalogue')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
              currentView === 'catalogue' || currentView === 'work-detail' || currentView === 'reader'
                ? 'bg-purple-950/50 text-amber-300 border border-purple-800/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Catalogue</span>
          </button>

          <button
            id="nav-universe-btn"
            onClick={() => handleNav('universe')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
              currentView === 'universe'
                ? 'bg-purple-950/50 text-amber-300 border border-purple-800/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Univers & Chronologie</span>
            <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-700/40">
              Lore
            </span>
          </button>

          <button
            id="nav-about-btn"
            onClick={() => handleNav('about')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
              currentView === 'about'
                ? 'bg-purple-950/50 text-amber-300 border border-purple-800/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <User className="h-4 w-4" />
            <span>L’Auteur</span>
          </button>

          <button
            id="nav-admin-btn"
            onClick={() => handleNav('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
              currentView === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/40'
            }`}
            title="Espace réservé à l'auteur pour ajouter et gérer les œuvres"
          >
            <Lock className="h-4 w-4 text-amber-400" />
            <span>Espace Auteur</span>
          </button>
        </nav>

        {/* Right side CTA / Reading resume badge */}
        <div className="hidden lg:flex items-center gap-3">
          {lastActiveWork && lastActiveChapter && (
            <button
              id="nav-resume-reading-btn"
              onClick={() => onOpenChapter(lastActiveChapter.id)}
              className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1.5 text-xs text-purple-200 transition-all hover:border-purple-400 hover:bg-purple-900/50 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]"
            >
              <BookmarkCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span className="truncate max-w-[140px]">
                {lastActiveWork.title} (Ch. {lastActiveChapter.chapterNumber})
              </span>
              <ArrowRight className="h-3 w-3 text-purple-300" />
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {lastActiveChapter && (
            <button
              onClick={() => onOpenChapter(lastActiveChapter.id)}
              className="rounded-lg border border-purple-600/40 bg-purple-950/60 p-2 text-cyan-400 hover:text-cyan-300"
              title="Reprendre la lecture"
            >
              <BookmarkCheck className="h-4 w-4" />
            </button>
          )}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-slate-700 bg-slate-900/60 p-2 text-slate-300 hover:text-white"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-purple-950/60 bg-[#0c0f1d] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNav('catalogue')}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                currentView === 'catalogue'
                  ? 'bg-purple-950 text-amber-300 border border-purple-800/40'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Catalogue des Œuvres</span>
            </button>
            <button
              onClick={() => handleNav('universe')}
              className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                currentView === 'universe'
                  ? 'bg-purple-950 text-amber-300 border border-purple-800/40'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="h-4 w-4 text-cyan-400" />
                <span>Univers & Chronologie</span>
              </div>
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] text-cyan-400">Lore</span>
            </button>
            <button
              onClick={() => handleNav('about')}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                currentView === 'about'
                  ? 'bg-purple-950 text-amber-300 border border-purple-800/40'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <User className="h-4 w-4 text-purple-400" />
              <span>À propos de Souleymane Thiao</span>
            </button>
            <button
              onClick={() => handleNav('admin')}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                currentView === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Espace Auteur / Administration</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
