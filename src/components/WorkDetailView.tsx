import React, { useState } from 'react';
import { 
  ArrowLeft, BookOpen, Layers, Clock, Calendar, Eye, Share2, 
  BookmarkCheck, Feather, Sparkles, MessageSquare, Send, ThumbsUp, 
  CornerDownRight, Check, Pin
} from 'lucide-react';
import { Work, Chapter, PenName, Comment, ReadingProgress } from '../types';

interface WorkDetailViewProps {
  work: Work;
  chapters: Chapter[];
  penName?: PenName;
  comments: Comment[];
  readingProgress: ReadingProgress;
  onBack: () => void;
  onOpenChapter: (chapterId: string) => void;
  onSelectTag: (tag: string) => void;
  onAddComment: (targetType: 'work' | 'chapter', targetId: string, authorName: string, content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
}

export const WorkDetailView: React.FC<WorkDetailViewProps> = ({
  work,
  chapters,
  penName,
  comments,
  readingProgress,
  onBack,
  onOpenChapter,
  onSelectTag,
  onAddComment,
  onLikeComment,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'comments'>('chapters');

  // Comment form state
  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  // Fixed simple anti-spam: 4 + 3 = 7
  const mathExpected = '7';

  const publishedChapters = chapters
    .filter(c => c.status === 'publie')
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const totalWords = publishedChapters.reduce((acc, c) => acc + c.wordCount, 0);
  const totalReadingMinutes = Math.max(1, Math.ceil(totalWords / 200));

  // Check user reading progress on this work
  const userProgress = readingProgress[work.id];
  const lastReadChapter = userProgress ? publishedChapters.find(c => c.id === userProgress.lastChapterId) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentContent.trim()) return;
    if (mathAnswer.trim() !== mathExpected) {
      alert('Veuillez résoudre correctement le calcul anti-spam : 4 + 3 = 7');
      return;
    }
    onAddComment('work', work.id, authorName.trim(), commentContent.trim());
    setCommentContent('');
    setMathAnswer('');
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyAuthor.trim() || !replyContent.trim()) return;
    onAddComment('work', work.id, replyAuthor.trim(), replyContent.trim(), parentId);
    setReplyToId(null);
    setReplyContent('');
  };

  // Group comments: top level and their replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const repliesMap = new Map<string, Comment[]>();
  comments.forEach(c => {
    if (c.parentId) {
      const list = repliesMap.get(c.parentId) || [];
      list.push(c);
      repliesMap.set(c.parentId, list);
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-slate-800/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-amber-400" />
          <span>Retour au catalogue</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg border border-purple-950/80 bg-[#0e1122] px-3 py-1.5 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-all"
        >
          {copiedLink ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300">Lien copié !</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Partager l’œuvre</span>
            </>
          )}
        </button>
      </nav>

      {/* Main Work Header & Presentation */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-950/60 bg-[#0d1020]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gradient-to-bl from-amber-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Large Cover Image with 3D Depth */}
          <div className="mx-auto w-full max-w-[280px] shrink-0 sm:max-w-[320px] md:mx-0">
            <div className="group relative overflow-hidden rounded-xl border-2 border-purple-900/60 bg-slate-900 shadow-[0_15px_40px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_20px_50px_rgba(245,158,11,0.25)]">
              <img
                src={work.coverUrl}
                alt={work.title}
                referrerPolicy="no-referrer"
                className="aspect-[2/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c16] via-transparent to-transparent opacity-60" />
            </div>

            {/* Quick Action Button under Cover for Mobile */}
            <div className="mt-5 flex flex-col gap-2">
              {publishedChapters.length > 0 ? (
                <button
                  id="start-reading-btn"
                  onClick={() => {
                    if (lastReadChapter) {
                      onOpenChapter(lastReadChapter.id);
                    } else {
                      onOpenChapter(publishedChapters[0].id);
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] active:scale-[0.98]"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {lastReadChapter
                      ? `Reprendre (Ch. ${lastReadChapter.chapterNumber})`
                      : work.type === 'roman'
                      ? 'Commencer la lecture (Ch. 1)'
                      : 'Lire la nouvelle intégrale'}
                  </span>
                </button>
              ) : (
                <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-3 text-center text-xs text-slate-400">
                  Chapitres en cours de révision par l'auteur
                </div>
              )}
            </div>
          </div>

          {/* Details & Information Column */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Type */}
                <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                  work.type === 'roman'
                    ? 'bg-purple-950 text-purple-200 border border-purple-700/50'
                    : 'bg-amber-950 text-amber-200 border border-amber-700/50'
                }`}>
                  {work.type === 'roman' ? <Layers className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  <span>{work.type === 'roman' ? 'Roman à chapitres' : 'Nouvelle One-shot'}</span>
                </span>

                {/* Status */}
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700/50">
                  <span className={`h-2 w-2 rounded-full ${
                    work.status === 'en_cours' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                  <span className="capitalize">{work.status.replace('_', ' ')}</span>
                </span>

                {/* Views */}
                {work.viewsCount && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span>{work.viewsCount.toLocaleString()} lectures</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {work.title}
              </h1>

              {/* Pen Name Card */}
              {penName && (
                <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-purple-900/40 bg-purple-950/20 px-4 py-2.5 backdrop-blur-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Feather className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Écrit sous la plume de</span>
                      <span className="text-sm font-bold text-amber-300">{penName.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{penName.tagline}</p>
                  </div>
                </div>
              )}

              {/* Genres List */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {work.genres.map((g, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-purple-200 border border-purple-900/50"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Synopsis Title & Body */}
              <div className="mt-6 border-t border-purple-950/40 pt-5">
                <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-amber-500/80">
                  Synopsis
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300 whitespace-pre-line font-serif-reading">
                  {work.fullDescription}
                </p>
              </div>

              {/* Tags Cloud (clickable) */}
              <div className="mt-6 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Thèmes :</span>
                {work.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectTag(tag)}
                    className="rounded bg-purple-950/50 px-2.5 py-0.5 text-xs text-purple-300 border border-purple-800/30 hover:border-amber-500/50 hover:text-amber-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Metadata Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-purple-950/50 pt-5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span><strong>{publishedChapters.length}</strong> chapitres</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span>Environ <strong>{totalReadingMinutes} min</strong> de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-400" />
                <span>Mis à jour le {work.updatedAt}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Tabs Switcher: Chapters vs Reviews/Comments */}
      <section className="mt-10">
        <div className="flex border-b border-purple-950/60 pb-px gap-6">
          <button
            id="tab-chapters-btn"
            onClick={() => setActiveTab('chapters')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'chapters'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Sommaire des Chapitres ({publishedChapters.length})</span>
          </button>

          <button
            id="tab-comments-btn"
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'comments'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Avis & Commentaires ({comments.length})</span>
          </button>
        </div>

        {/* Tab 1: Chapters List */}
        {activeTab === 'chapters' && (
          <div className="mt-6 flex flex-col gap-3">
            {publishedChapters.length > 0 ? (
              publishedChapters.map((chapter) => {
                const isCurrentRead = userProgress?.lastChapterId === chapter.id;

                return (
                  <div
                    key={chapter.id}
                    onClick={() => onOpenChapter(chapter.id)}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-purple-950/50 bg-[#0e1122]/70 p-4 transition-all hover:border-purple-600/50 hover:bg-[#12162c] hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)]"
                  >
                    <div className="flex items-center gap-4">
                      {/* Chapter Number Badge */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold border transition-colors ${
                        isCurrentRead
                          ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300'
                          : 'border-purple-900/60 bg-purple-950/40 text-purple-300 group-hover:border-amber-500/40 group-hover:text-amber-300'
                      }`}>
                        {chapter.chapterNumber}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-slate-200 transition-colors group-hover:text-amber-300">
                            {chapter.title}
                          </h3>
                          {isCurrentRead && (
                            <span className="flex items-center gap-1 rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] text-cyan-400 border border-cyan-800/40">
                              <BookmarkCheck className="h-3 w-3" />
                              Dernier lu
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                          <span>{chapter.publishedAt}</span>
                          <span>•</span>
                          <span>{chapter.wordCount} mots</span>
                          <span>•</span>
                          <span>~{chapter.readingTimeMinutes} min de lecture</span>
                        </div>
                      </div>
                    </div>

                    <button className="hidden sm:flex items-center gap-1.5 rounded-lg border border-purple-900/50 bg-purple-950/30 px-3 py-1.5 text-xs font-medium text-purple-300 transition-all group-hover:border-amber-500/40 group-hover:bg-amber-500/20 group-hover:text-amber-300">
                      <span>Lire</span>
                      <BookOpen className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-400">
                Aucun chapitre publié pour le moment.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Comments & Reviews */}
        {activeTab === 'comments' && (
          <div className="mt-6 flex flex-col gap-8">
            
            {/* New Comment Box */}
            <div className="rounded-xl border border-purple-950/60 bg-[#0e1122]/90 p-5 sm:p-6 shadow-md">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-200">
                Laisser un avis sur cette œuvre
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Partagez vos impressions avec Souleymane Thiao et les autres lecteurs.
              </p>

              <form onSubmit={handleCommentSubmit} className="mt-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Votre nom ou pseudo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Awa, ChasseurDozo, Ibrahima..."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium">Contrôle anti-robot : Combien font 4 + 3 ? *</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre réponse (ex: 7)"
                      value={mathAnswer}
                      onChange={(e) => setMathAnswer(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Votre commentaire *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Qu'avez-vous pensé de l'intrigue, du style d'écriture, des personnages ?"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-purple-700 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-amber-500 hover:to-purple-600 transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Publier mon commentaire</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Comments List */}
            <div className="flex flex-col gap-4">
              {topLevelComments.length > 0 ? (
                topLevelComments.map((comment) => {
                  const replies = repliesMap.get(comment.id) || [];

                  return (
                    <div
                      key={comment.id}
                      className={`rounded-xl border p-4 sm:p-5 transition-all ${
                        comment.pinned
                          ? 'border-amber-500/40 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                          : 'border-purple-950/40 bg-[#0e1122]/70'
                      }`}
                    >
                      {/* Comment Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-200">
                            {comment.authorName}
                          </span>
                          {comment.isAuthorReply && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                              <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                              Auteur
                            </span>
                          )}
                          {comment.pinned && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-900/40 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                              <Pin className="h-2.5 w-2.5 text-amber-400" />
                              Épinglé
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-400">{comment.createdAt}</span>
                      </div>

                      {/* Comment Body */}
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300">
                        {comment.content}
                      </p>

                      {/* Comment Actions: Like & Reply button */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                        <button
                          onClick={() => onLikeComment(comment.id)}
                          className="flex items-center gap-1 hover:text-amber-300 transition-colors"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{comment.likes || 0}</span>
                        </button>

                        <button
                          onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 hover:text-purple-300 transition-colors"
                        >
                          <CornerDownRight className="h-3.5 w-3.5" />
                          <span>Répondre</span>
                        </button>
                      </div>

                      {/* Reply input form if opened */}
                      {replyToId === comment.id && (
                        <div className="mt-4 rounded-lg border border-purple-950 bg-slate-900/90 p-3">
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              placeholder="Votre pseudo..."
                              value={replyAuthor}
                              onChange={(e) => setReplyAuthor(e.target.value)}
                              className="rounded border border-purple-950 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                            />
                            <textarea
                              rows={2}
                              placeholder="Votre réponse..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="rounded border border-purple-950 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyToId(null)}
                                className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-amber-400"
                              >
                                Répondre
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Thread Replies */}
                      {replies.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3 border-l-2 border-purple-900/40 pl-4">
                          {replies.map((reply) => (
                            <div key={reply.id} className="rounded-lg bg-slate-900/50 p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs text-slate-200">
                                    {reply.authorName}
                                  </span>
                                  {reply.isAuthorReply && (
                                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/40">
                                      Auteur
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-300">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-400">
                  Aucun avis pour l'instant. Soyez le premier à commenter cette œuvre !
                </div>
              )}
            </div>

          </div>
        )}

      </section>

    </div>
  );
};
