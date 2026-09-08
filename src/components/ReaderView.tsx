import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Settings, ListOrdered, Sparkles, 
  MessageSquare, ThumbsUp, Send, CornerDownRight, Sun, Moon, 
  BookOpen, Feather, Share2, Check, BookmarkCheck, ArrowUp
} from 'lucide-react';
import { Work, Chapter, ReadingPreferences, Comment } from '../types';
import { saveReadingProgress } from '../services/storage';

interface ReaderViewProps {
  work: Work;
  currentChapter: Chapter;
  allChapters: Chapter[];
  comments: Comment[];
  preferences: ReadingPreferences;
  onUpdatePreferences: (prefs: ReadingPreferences) => void;
  onSelectChapter: (chapterId: string) => void;
  onBackToWork: () => void;
  onAddComment: (targetType: 'work' | 'chapter', targetId: string, authorName: string, content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  work,
  currentChapter,
  allChapters,
  comments,
  preferences,
  onUpdatePreferences,
  onSelectChapter,
  onBackToWork,
  onAddComment,
  onLikeComment,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comment inputs
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Sorted published chapters
  const publishedChapters = allChapters
    .filter(c => c.status === 'publie')
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const currentIndex = publishedChapters.findIndex(c => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? publishedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < publishedChapters.length - 1 ? publishedChapters[currentIndex + 1] : null;

  // Auto-save reading progress on chapter open
  useEffect(() => {
    saveReadingProgress(work.id, currentChapter.id, currentChapter.chapterNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [work.id, currentChapter.id, currentChapter.chapterNumber]);

  // Scroll listener for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(100);
        return;
      }
      const currentScroll = window.scrollY;
      const progressPercent = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progressPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim()) return;
    if (mathAnswer.trim() !== '7') {
      alert('Vérification anti-robot : 4 + 3 = 7');
      return;
    }
    onAddComment('chapter', currentChapter.id, authorName.trim(), commentContent.trim());
    setCommentContent('');
    setMathAnswer('');
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyAuthor.trim() || !replyContent.trim()) return;
    onAddComment('chapter', currentChapter.id, replyAuthor.trim(), replyContent.trim(), parentId);
    setReplyToId(null);
    setReplyContent('');
  };

  // Theme styling presets
  const getThemeClasses = () => {
    switch (preferences.theme) {
      case 'sepia':
        return {
          bg: 'bg-[#1b1714]',
          text: 'text-[#dfd5c6]',
          muted: 'text-[#a39482]',
          border: 'border-[#3b322a]',
          panelBg: 'bg-[#241f1a]',
          accent: 'text-amber-400',
        };
      case 'light':
        return {
          bg: 'bg-[#f6f4ee]',
          text: 'text-[#1e293b]',
          muted: 'text-[#64748b]',
          border: 'border-[#e2dfd5]',
          panelBg: 'bg-[#ffffff]',
          accent: 'text-amber-600',
        };
      case 'dark':
      default:
        return {
          bg: 'bg-[#0a0c16]',
          text: 'text-[#e2e8f0]',
          muted: 'text-slate-400',
          border: 'border-purple-950/50',
          panelBg: 'bg-[#0e1122]',
          accent: 'text-amber-400',
        };
    }
  };

  const currentTheme = getThemeClasses();

  // Width presets
  const getWidthClass = () => {
    switch (preferences.maxWidth) {
      case 'compact':
        return 'max-w-xl';
      case 'wide':
        return 'max-w-4xl';
      case 'normal':
      default:
        return 'max-w-2xl';
    }
  };

  // Font family
  const getFontClass = () => {
    switch (preferences.fontFamily) {
      case 'sans':
        return 'font-sans-reading';
      case 'mono':
        return 'font-mono-reading';
      case 'serif':
      default:
        return 'font-serif-reading';
    }
  };

  // Filter comments for this chapter
  const chapterComments = comments.filter(c => c.targetType === 'chapter' && c.targetId === currentChapter.id);
  const topLevelComments = chapterComments.filter(c => !c.parentId);
  const repliesMap = new Map<string, Comment[]>();
  chapterComments.forEach(c => {
    if (c.parentId) {
      const list = repliesMap.get(c.parentId) || [];
      list.push(c);
      repliesMap.set(c.parentId, list);
    }
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${currentTheme.bg} ${currentTheme.text}`}>
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900/40">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-purple-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Sticky Header Bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${currentTheme.panelBg}/90 ${currentTheme.border}`}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          
          {/* Back to Book button & Title */}
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={onBackToWork}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-slate-800/40 ${currentTheme.muted} hover:${currentTheme.text}`}
              title="Retourner à la fiche de l'œuvre"
            >
              <ArrowLeft className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Sommaire</span>
            </button>

            <div className="flex flex-col truncate">
              <span className="truncate text-xs font-semibold text-slate-300">
                {work.title}
              </span>
              <span className="truncate text-[11px] text-amber-400 font-medium">
                {work.type === 'roman' ? `Chapitre ${currentChapter.chapterNumber} : ` : ''}{currentChapter.title}
              </span>
            </div>
          </div>

          {/* Reader Tools: Table of Contents, Theme Settings, Comments */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Table of Contents Button */}
            <button
              onClick={() => setShowToc(!showToc)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all ${
                showToc
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : `border-transparent ${currentTheme.muted} hover:${currentTheme.text}`
              }`}
              title="Table des chapitres"
            >
              <ListOrdered className="h-4 w-4 text-cyan-400" />
              <span className="hidden md:inline">Chapitres</span>
            </button>

            {/* Font & Appearance Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all ${
                showSettings
                  ? 'bg-purple-900/50 text-purple-200 border-purple-700/50'
                  : `border-transparent ${currentTheme.muted} hover:${currentTheme.text}`
              }`}
              title="Réglages de lecture (police, taille, thème)"
            >
              <Settings className="h-4 w-4 text-purple-400" />
              <span className="hidden md:inline">Affichage</span>
            </button>

            {/* Jump to Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all ${
                showComments
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : `border-transparent ${currentTheme.muted} hover:${currentTheme.text}`
              }`}
              title="Commentaires du chapitre"
            >
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <span>{chapterComments.length}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className={`rounded-lg p-2 text-xs transition-colors ${currentTheme.muted} hover:${currentTheme.text}`}
              title="Partager ce chapitre"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </button>

          </div>
        </div>

        {/* Floating Table of Contents Modal/Drawer */}
        {showToc && (
          <div className={`absolute top-full left-0 right-0 border-b shadow-2xl ${currentTheme.panelBg} ${currentTheme.border} p-4 sm:p-6 z-50`}>
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Table des chapitres
                </h3>
                <span className="text-xs text-slate-400">
                  {publishedChapters.length} chapitres publiés
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {publishedChapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSelectChapter(ch.id);
                      setShowToc(false);
                    }}
                    className={`flex items-center justify-between rounded-lg p-2.5 text-left text-xs transition-all border ${
                      ch.id === currentChapter.id
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 hover:border-purple-700/40 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">
                      Ch. {ch.chapterNumber} : {ch.title}
                    </span>
                    <span className="shrink-0 text-[10px] text-slate-500">
                      {ch.readingTimeMinutes} min
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Display & Theme Settings Bar */}
        {showSettings && (
          <div className={`absolute top-full left-0 right-0 border-b shadow-2xl ${currentTheme.panelBg} ${currentTheme.border} p-4 sm:p-6 z-50`}>
            <div className="mx-auto max-w-3xl flex flex-col gap-5 text-xs">
              
              {/* Row 1: Themes */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-semibold text-slate-300">Thème de lecture :</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdatePreferences({ ...preferences, theme: 'dark' })}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium border ${
                      preferences.theme === 'dark'
                        ? 'border-purple-500 bg-purple-950 text-purple-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5 text-purple-400" />
                    <span>Néon Sombre</span>
                  </button>

                  <button
                    onClick={() => onUpdatePreferences({ ...preferences, theme: 'sepia' })}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium border ${
                      preferences.theme === 'sepia'
                        ? 'border-amber-600 bg-[#29221c] text-amber-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full bg-[#c9ab86]" />
                    <span>Sépia / Parchemin</span>
                  </button>

                  <button
                    onClick={() => onUpdatePreferences({ ...preferences, theme: 'light' })}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium border ${
                      preferences.theme === 'light'
                        ? 'border-amber-500 bg-amber-50 text-slate-900'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span>Clair</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Typography family */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-3">
                <span className="font-semibold text-slate-300">Police de caractères :</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdatePreferences({ ...preferences, fontFamily: 'serif' })}
                    className={`rounded-lg px-3 py-1.5 font-serif-reading text-sm border ${
                      preferences.fontFamily === 'serif'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Serif Littéraire (Newsreader)
                  </button>
                  <button
                    onClick={() => onUpdatePreferences({ ...preferences, fontFamily: 'sans' })}
                    className={`rounded-lg px-3 py-1.5 font-sans-reading text-sm border ${
                      preferences.fontFamily === 'sans'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Sans Moderne (Jakarta)
                  </button>
                  <button
                    onClick={() => onUpdatePreferences({ ...preferences, fontFamily: 'mono' })}
                    className={`rounded-lg px-3 py-1.5 font-mono-reading text-sm border ${
                      preferences.fontFamily === 'mono'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Monospace
                  </button>
                </div>
              </div>

              {/* Row 3: Size & Width */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-300">Taille de texte :</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdatePreferences({ ...preferences, fontSize: Math.max(14, preferences.fontSize - 1) })}
                      className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                    >
                      A-
                    </button>
                    <span className="w-8 text-center text-xs text-amber-300">{preferences.fontSize}px</span>
                    <button
                      onClick={() => onUpdatePreferences({ ...preferences, fontSize: Math.min(26, preferences.fontSize + 1) })}
                      className="rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                    >
                      A+
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-300">Largeur de page :</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdatePreferences({ ...preferences, maxWidth: 'compact' })}
                      className={`rounded px-2.5 py-1 text-xs border ${
                        preferences.maxWidth === 'compact' ? 'border-amber-500 text-amber-300' : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      Étroite
                    </button>
                    <button
                      onClick={() => onUpdatePreferences({ ...preferences, maxWidth: 'normal' })}
                      className={`rounded px-2.5 py-1 text-xs border ${
                        preferences.maxWidth === 'normal' ? 'border-amber-500 text-amber-300' : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      Normale
                    </button>
                    <button
                      onClick={() => onUpdatePreferences({ ...preferences, maxWidth: 'wide' })}
                      className={`rounded px-2.5 py-1 text-xs border ${
                        preferences.maxWidth === 'wide' ? 'border-amber-500 text-amber-300' : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      Large
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </header>

      {/* Main Chapter Content Container */}
      <main ref={containerRef} className={`mx-auto ${getWidthClass()} px-4 sm:px-6 py-12 sm:py-16`}>
        
        {/* Chapter Header Card */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/40 px-3 py-1 text-xs text-purple-300 border border-purple-800/40 mb-3">
            <span>{work.title}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-amber-300">
            {work.type === 'roman' ? `Chapitre ${currentChapter.chapterNumber} : ` : ''}{currentChapter.title}
          </h1>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>Publié le {currentChapter.publishedAt}</span>
            <span>•</span>
            <span>{currentChapter.wordCount} mots</span>
            <span>•</span>
            <span>~{currentChapter.readingTimeMinutes} minutes de lecture</span>
          </div>

          {/* Decorative Solar Rune Divider */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
            <Sparkles className="h-4 w-4 text-amber-400/80" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
        </header>

        {/* Chapter Body with custom typography */}
        <article
          className={`${getFontClass()} prose prose-invert max-w-none leading-relaxed transition-all`}
          style={{
            fontSize: `${preferences.fontSize}px`,
            lineHeight: preferences.lineHeight,
          }}
        >
          {currentChapter.content ? (
            currentChapter.content.split('\n\n').map((paragraph, idx) => {
              // Scene break separator check
              if (paragraph.trim() === '* * *' || paragraph.trim() === '---') {
                return (
                  <div key={idx} className="my-8 flex justify-center text-amber-500/70 tracking-widest text-base">
                    ✦ ✦ ✦
                  </div>
                );
              }

              // Normal formatted paragraph
              return (
                <p key={idx} className="mb-6 whitespace-pre-line text-justify text-slate-200">
                  {paragraph}
                </p>
              );
            })
          ) : (
            <p className="text-center italic text-slate-400">Contenu en cours de finalisation par l'auteur.</p>
          )}
        </article>

        {/* Chapter Completion Marker */}
        <div className="mt-16 border-t border-purple-950/40 pt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30">
            <BookmarkCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Fin du chapitre {currentChapter.chapterNumber} • Progression enregistrée</span>
          </div>
        </div>

        {/* Bottom Chapter Navigation Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-y border-purple-950/40 py-6">
          {prevChapter ? (
            <button
              onClick={() => onSelectChapter(prevChapter.id)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-purple-900/50 bg-[#0e1122] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-amber-300 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Précédent : Ch. {prevChapter.chapterNumber}</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400">Début de l'œuvre</div>
          )}

          <button
            onClick={onBackToWork}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Fiche de l’œuvre</span>
          </button>

          {nextChapter ? (
            <button
              onClick={() => onSelectChapter(nextChapter.id)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Suivant : Ch. {nextChapter.chapterNumber}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="text-xs text-amber-400/80 font-medium">Dernier chapitre paru</div>
          )}
        </div>

        {/* Chapter Comments Section */}
        <section className="mt-14">
          <div className="flex items-center justify-between border-b border-purple-950/50 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <h2 className="font-display text-base font-bold text-slate-200">
                Commentaires du Chapitre ({chapterComments.length})
              </h2>
            </div>
          </div>

          {/* New comment input */}
          <div className="mt-6 rounded-xl border border-purple-950/60 bg-[#0e1122] p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Qu'avez-vous pensé de ce chapitre ?
            </h3>

            <form onSubmit={handleCommentSubmit} className="mt-3 flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] text-slate-400">Votre nom / pseudo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: LecteurCurieux..."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Anti-spam : Combien font 4 + 3 ? *</label>
                  <input
                    type="text"
                    required
                    placeholder="7"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <textarea
                  required
                  rows={2}
                  placeholder="Écrivez votre réaction..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full rounded-lg border border-purple-950 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all"
                >
                  <Send className="h-3 w-3" />
                  <span>Envoyer mon commentaire</span>
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="mt-6 flex flex-col gap-4">
            {topLevelComments.length > 0 ? (
              topLevelComments.map((c) => {
                const replies = repliesMap.get(c.id) || [];
                return (
                  <div key={c.id} className="rounded-xl border border-purple-950/40 bg-[#0e1122]/70 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-200">{c.authorName}</span>
                        {c.isAuthorReply && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/40">
                            Auteur
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{c.content}</p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                      <button
                        onClick={() => onLikeComment(c.id)}
                        className="flex items-center gap-1 hover:text-amber-300"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{c.likes || 0}</span>
                      </button>
                      <button
                        onClick={() => setReplyToId(replyToId === c.id ? null : c.id)}
                        className="flex items-center gap-1 hover:text-purple-300"
                      >
                        <CornerDownRight className="h-3.5 w-3.5" />
                        <span>Répondre</span>
                      </button>
                    </div>

                    {/* Reply form */}
                    {replyToId === c.id && (
                      <div className="mt-3 rounded border border-purple-950 bg-slate-900 p-2.5">
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Votre pseudo..."
                            value={replyAuthor}
                            onChange={(e) => setReplyAuthor(e.target.value)}
                            className="rounded border border-purple-950 bg-slate-950 px-2 py-1 text-xs text-white"
                          />
                          <textarea
                            rows={2}
                            placeholder="Votre réponse..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="rounded border border-purple-950 bg-slate-950 px-2 py-1 text-xs text-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setReplyToId(null)}
                              className="px-2 py-1 text-xs text-slate-400"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleReplySubmit(c.id)}
                              className="rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-950"
                            >
                              Répondre
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2 border-l border-purple-900/40 pl-3">
                        {replies.map(r => (
                          <div key={r.id} className="rounded bg-slate-900/40 p-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-300">{r.authorName}</span>
                              <span className="text-[10px] text-slate-400">{r.createdAt}</span>
                            </div>
                            <p className="mt-1 text-slate-400">{r.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">
                Aucun commentaire sur ce chapitre pour le moment.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Floating Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-purple-950/80 text-amber-300 border border-purple-700/50 shadow-lg backdrop-blur-sm hover:bg-purple-900 hover:text-white transition-all"
        title="Remonter en haut"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

    </div>
  );
};
