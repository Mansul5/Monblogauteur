import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, X, BookOpen, Layers, BookMarked, ArrowUpDown, Feather } from 'lucide-react';
import { Work, PenName, Chapter } from '../types';
import { WorkCard } from './WorkCard';

interface CatalogueViewProps {
  works: Work[];
  chapters: Chapter[];
  penNames: PenName[];
  onSelectWork: (workId: string) => void;
  selectedTagFilter?: string | null;
  onClearTagFilter?: () => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  works,
  chapters,
  penNames,
  onSelectWork,
  selectedTagFilter,
  onClearTagFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'roman' | 'nouvelle'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [penNameFilter, setPenNameFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'chapters' | 'title'>('recent');

  // Map of pen names by ID
  const penNamesMap = useMemo(() => {
    return new Map(penNames.map(p => [p.id, p]));
  }, [penNames]);

  // Chapters count by workId
  const chaptersCountByWork = useMemo(() => {
    const map = new Map<string, number>();
    chapters.forEach(c => {
      if (c.status === 'publie') {
        map.set(c.workId, (map.get(c.workId) || 0) + 1);
      }
    });
    return map;
  }, [chapters]);

  // All unique genres from works
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    works.forEach(w => w.genres.forEach(g => set.add(g)));
    return Array.from(set);
  }, [works]);

  // Filtered & sorted works
  const filteredWorks = useMemo(() => {
    return works.filter(w => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const pen = penNamesMap.get(w.penNameId)?.name.toLowerCase() || '';
        const matchTitle = w.title.toLowerCase().includes(q);
        const matchShortDesc = w.shortDescription.toLowerCase().includes(q);
        const matchTags = w.tags.some(t => t.toLowerCase().includes(q));
        const matchGenres = w.genres.some(g => g.toLowerCase().includes(q));
        const matchPen = pen.includes(q);

        if (!matchTitle && !matchShortDesc && !matchTags && !matchGenres && !matchPen) {
          return false;
        }
      }

      // Selected tag filter from outside (e.g. clicked tag)
      if (selectedTagFilter) {
        const cleanTag = selectedTagFilter.replace('#', '').toLowerCase();
        const hasTag = w.tags.some(t => t.replace('#', '').toLowerCase() === cleanTag);
        if (!hasTag) return false;
      }

      // Type filter
      if (typeFilter !== 'all' && w.type !== typeFilter) {
        return false;
      }

      // Genre filter
      if (genreFilter !== 'all' && !w.genres.includes(genreFilter)) {
        return false;
      }

      // Pen name filter
      if (penNameFilter !== 'all' && w.penNameId !== penNameFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
      if (sortBy === 'views') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'chapters') {
        return (chaptersCountByWork.get(b.id) || 0) - (chaptersCountByWork.get(a.id) || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [works, searchQuery, selectedTagFilter, typeFilter, genreFilter, penNameFilter, sortBy, penNamesMap, chaptersCountByWork]);

  // Overall counts
  const novelsCount = works.filter(w => w.type === 'roman').length;
  const shortStoriesCount = works.filter(w => w.type === 'nouvelle').length;
  const totalPublishedChapters = chapters.filter(c => c.status === 'publie').length;

  const hasActiveFilters = searchQuery || selectedTagFilter || typeFilter !== 'all' || genreFilter !== 'all' || penNameFilter !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setGenreFilter('all');
    setPenNameFilter('all');
    if (onClearTagFilter) onClearTagFilter();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-900/40 bg-gradient-to-br from-[#121528] via-[#0e1122] to-[#080a14] p-6 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {/* Glow ambient circle */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/10 via-purple-600/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-800/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Plateforme Littéraire Officielle</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Les Récits de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Souleymane Thiao</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
            Bienvenue dans mon atelier de récits. Explorez mes <strong>romans-feuilletons en chapitres</strong> et mes <strong>nouvelles complètes</strong>, naviguant entre légendes d'afrofantasy sombre, thriller technologique à Dakar et contes initiatiques.
          </p>

          {/* Quick Stats Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-300 border-t border-purple-950/60 pt-5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 text-sm">{works.length}</span>
              <span>œuvres disponibles</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-300 text-sm">{totalPublishedChapters}</span>
              <span>chapitres en ligne</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-300 text-sm">{penNames.length}</span>
              <span>plumes d'écriture</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lecture libre & gratuite</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Filters Bar */}
      <section className="mt-10 flex flex-col gap-6">
        
        {/* Search Bar & Type Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              id="catalogue-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, mot-clé, tag, plume (#ancêtres, Songhaï, cyber...)"
              className="w-full rounded-xl border border-purple-950/70 bg-[#0e1122]/90 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-400 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                title="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Work Type Tabs (Tous / Romans / Nouvelles) */}
          <div className="inline-flex rounded-xl border border-purple-950/80 bg-[#0e1122] p-1 shadow-sm">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                typeFilter === 'all'
                  ? 'bg-purple-900/50 text-amber-300 border border-purple-700/50 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Tout ({works.length})</span>
            </button>

            <button
              onClick={() => setTypeFilter('roman')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                typeFilter === 'roman'
                  ? 'bg-purple-900/50 text-amber-300 border border-purple-700/50 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-purple-400" />
              <span>Romans ({novelsCount})</span>
            </button>

            <button
              onClick={() => setTypeFilter('nouvelle')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                typeFilter === 'nouvelle'
                  ? 'bg-purple-900/50 text-amber-300 border border-purple-700/50 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookMarked className="h-3.5 w-3.5 text-amber-400" />
              <span>Nouvelles One-shot ({shortStoriesCount})</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters Bar: Genres & Pen Names & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-purple-950/40 py-3">
          
          {/* Genre Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-400 mr-1">
              <Filter className="h-3 w-3 text-purple-400" />
              <span>Genre :</span>
            </span>

            <button
              onClick={() => setGenreFilter('all')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                genreFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Tous
            </button>

            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => setGenreFilter(genreFilter === g ? 'all' : g)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  genreFilter === g
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Plumes & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Pen Names Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Feather className="h-3 w-3 text-amber-400" />
              <select
                aria-label="Filtrer par plume"
                value={penNameFilter}
                onChange={(e) => setPenNameFilter(e.target.value)}
                className="rounded-lg border border-purple-950/80 bg-[#0e1122] px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="all">Toutes les plumes</option>
                {penNames.map((p) => (
                  <option key={p.id} value={p.id}>
                    Plume : {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowUpDown className="h-3 w-3 text-cyan-400" />
              <select
                aria-label="Trier par"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-purple-950/80 bg-[#0e1122] px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="recent">Plus récents</option>
                <option value="views">Popularité (lectures)</option>
                <option value="chapters">Nombre de chapitres</option>
                <option value="title">Titre alphabétique</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Filters Tag Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Filtres actifs :</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-950/80 px-2.5 py-1 text-purple-300 border border-purple-800/50">
                Recherche: "{searchQuery}"
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedTagFilter && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 px-2.5 py-1 text-amber-300 border border-amber-800/50">
                Tag: {selectedTagFilter}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={onClearTagFilter} />
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-cyan-950/80 px-2.5 py-1 text-cyan-300 border border-cyan-800/50">
                Type: {typeFilter === 'roman' ? 'Romans' : 'Nouvelles'}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => setTypeFilter('all')} />
              </span>
            )}
            {genreFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-950/80 px-2.5 py-1 text-purple-300 border border-purple-800/50">
                Genre: {genreFilter}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => setGenreFilter('all')} />
              </span>
            )}
            {penNameFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 px-2.5 py-1 text-amber-300 border border-amber-800/50">
                Plume: {penNamesMap.get(penNameFilter)?.name}
                <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => setPenNameFilter('all')} />
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="ml-2 text-xs text-amber-400 underline hover:text-amber-300"
            >
              Réinitialiser tout
            </button>
          </div>
        )}

      </section>

      {/* Works Grid Display */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            {filteredWorks.length} {filteredWorks.length > 1 ? 'œuvres trouvées' : 'œuvre trouvée'}
          </span>
        </div>

        {filteredWorks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                penName={penNamesMap.get(work.penNameId)}
                onSelectWork={onSelectWork}
                onSelectTag={(tag) => setSearchQuery(tag)}
                chaptersCount={chaptersCountByWork.get(work.id) || 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-purple-900/40 bg-[#0e1122]/40 py-16 text-center px-4">
            <BookOpen className="h-12 w-12 text-purple-400/40 mb-3" />
            <h3 className="font-display text-lg font-semibold text-slate-200">
              Aucune œuvre ne correspond à vos filtres
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-400">
              Essayez d'élargir votre recherche ou de réinitialiser les filtres pour voir tout le catalogue de Souleymane Thiao.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-5 rounded-lg bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
            >
              Voir tout le catalogue
            </button>
          </div>
        )}
      </section>

    </div>
  );
};
