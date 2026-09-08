import React from 'react';
import { BookMarked, Sparkles, Clock, Layers, ArrowUpRight, Feather } from 'lucide-react';
import { Work, PenName } from '../types';

interface WorkCardProps {
  work: Work;
  penName?: PenName;
  onSelectWork: (workId: string) => void;
  onSelectTag?: (tag: string) => void;
  chaptersCount: number;
}

export const WorkCard: React.FC<WorkCardProps> = ({
  work,
  penName,
  onSelectWork,
  onSelectTag,
  chaptersCount,
}) => {
  const isNovel = work.type === 'roman';

  // Status visual mapping
  const statusBadge = () => {
    switch (work.status) {
      case 'en_cours':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            En cours
          </span>
        );
      case 'termine':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Terminé
          </span>
        );
      case 'one_shot':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
            One-Shot
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
            Brouillon
          </span>
        );
    }
  };

  return (
    <article
      id={`work-card-${work.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-purple-950/50 bg-[#0e1122]/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-600/50 hover:bg-[#12162b] hover:shadow-[0_12px_30px_rgba(168,85,247,0.15)]"
    >
      {/* Top Cover Image Area */}
      <div
        className="relative h-60 w-full cursor-pointer overflow-hidden bg-slate-900"
        onClick={() => onSelectWork(work.id)}
      >
        <img
          src={work.coverUrl}
          alt={`Couverture de ${work.title}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Neon dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1122] via-[#0e1122]/30 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Work Type: Roman vs Nouvelle */}
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
              isNovel
                ? 'bg-purple-950/90 text-purple-200 border border-purple-500/40'
                : 'bg-amber-950/90 text-amber-200 border border-amber-500/40'
            }`}
          >
            {isNovel ? (
              <>
                <Layers className="h-3 w-3 text-purple-400" />
                <span>Roman</span>
              </>
            ) : (
              <>
                <BookMarked className="h-3 w-3 text-amber-400" />
                <span>Nouvelle</span>
              </>
            )}
          </span>

          {/* Status Badge */}
          {statusBadge()}
        </div>

        {/* Bottom cover chapter/time count */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1 rounded-full bg-[#0a0c16]/80 px-2.5 py-1 backdrop-blur-md border border-slate-700/40">
            {isNovel ? (
              <>
                <Layers className="h-3 w-3 text-cyan-400" />
                <span>{chaptersCount} {chaptersCount > 1 ? 'chapitres' : 'chapitre'}</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3 text-amber-400" />
                <span>Nouvelle intégrale</span>
              </>
            )}
          </div>

          {penName && (
            <div className="flex items-center gap-1 rounded-full bg-[#0a0c16]/80 px-2.5 py-1 backdrop-blur-md border border-purple-500/30 text-amber-300 font-medium text-[11px]">
              <Feather className="h-2.5 w-2.5" />
              <span>{penName.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Genres */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {work.genres.slice(0, 2).map((g, idx) => (
            <span
              key={idx}
              className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/50"
            >
              {g}
            </span>
          ))}
          {work.genres.length > 2 && (
            <span className="text-[10px] text-slate-400">+{work.genres.length - 2}</span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectWork(work.id)}
          className="font-display text-lg font-bold leading-snug text-white cursor-pointer transition-colors group-hover:text-amber-300"
        >
          {work.title}
        </h3>

        {/* Short Synopsis */}
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-300">
          {work.shortDescription}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1">
          {work.tags.slice(0, 3).map((tag, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectTag) onSelectTag(tag);
              }}
              className="text-[10px] text-purple-300/80 hover:text-amber-300 hover:underline transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Divider & Action Button */}
        <div className="mt-5 border-t border-purple-950/40 pt-4">
          <button
            onClick={() => onSelectWork(work.id)}
            className="group/btn flex w-full items-center justify-between rounded-lg bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-200 border border-purple-800/40 transition-all hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-amber-950/40 hover:text-amber-300 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <span>Découvrir l’œuvre</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
