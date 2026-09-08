import React from 'react';
import { Compass, Sparkles, Clock, Flame, BookOpen, Shield, Cpu, ArrowRight } from 'lucide-react';
import { LoreUniverse } from '../types';
import { INITIAL_LORE_UNIVERSE } from '../data/initialData';

interface UniverseViewProps {
  onOpenWork: (workId: string) => void;
}

export const UniverseView: React.FC<UniverseViewProps> = ({ onOpenWork }) => {
  const universe: LoreUniverse = INITIAL_LORE_UNIVERSE;

  const getFactionIcon = (name: string) => {
    if (name.includes('Braise') || name.includes('Forgerons')) return <Flame className="h-5 w-5 text-amber-400" />;
    if (name.includes('Dozo')) return <Shield className="h-5 w-5 text-emerald-400" />;
    return <Cpu className="h-5 w-5 text-cyan-400" />;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Universe Hero Header */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-900/60 bg-gradient-to-br from-[#13162b] via-[#0d1020] to-[#070912] p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/60 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30 mb-4">
            <Compass className="h-3.5 w-3.5" />
            <span>Lore & Mondes Connectés</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {universe.name}
          </h1>

          <p className="mt-3 text-base text-amber-400 font-medium font-serif-reading">
            {universe.tagline}
          </p>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300 max-w-3xl">
            {universe.summary}
          </p>
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="mt-14">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Frise Historique Partagée</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            La Chronologie des Quatre Âges
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Chaque roman ou nouvelle prend place à un carrefour clé de la grande histoire du Sahel.
          </p>
        </div>

        {/* Vertical Timeline Nodes */}
        <div className="relative border-l-2 border-purple-900/40 ml-4 sm:ml-8 space-y-10 py-4">
          {universe.eras.map((era, idx) => (
            <div key={era.id} className="relative pl-8 sm:pl-10">
              
              {/* Glowing Node Marker */}
              <div className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0a0c16] border-2 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              </div>

              {/* Node Card */}
              <div className="rounded-xl border border-purple-950/60 bg-[#0e1122]/90 p-5 sm:p-6 transition-all hover:border-purple-600/50 hover:bg-[#12162c]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-block rounded-md bg-purple-950/80 px-2.5 py-1 text-xs font-bold text-amber-300 border border-purple-800/40">
                    {era.era}
                  </span>

                  {era.workId && (
                    <button
                      onClick={() => onOpenWork(era.workId!)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Lire : {era.workTitle}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-slate-100">
                  {era.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300 font-serif-reading">
                  {era.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Factions & Guilds */}
      <section className="mt-16">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Forces en Présence</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Ordres, Confréries & Factions
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {universe.factions.map((f, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-xl border border-purple-950/60 bg-[#0e1122]/80 p-6 transition-all hover:border-cyan-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-700">
                  {getFactionIcon(f.name)}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-100">
                    {f.name}
                  </h3>
                  <span className="text-[11px] text-amber-400/90 font-medium">
                    {f.title}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-300">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
