import React from 'react';
import { Sparkles, Feather, Compass, BookOpen, Quote, Mail, Globe, ArrowRight } from 'lucide-react';
import { PenName } from '../types';

interface AboutViewProps {
  penNames: PenName[];
  onSelectPenName: (penNameId: string) => void;
  onNavigateCatalogue: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  penNames,
  onSelectPenName,
  onNavigateCatalogue,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Author Hero Header */}
      <section className="relative overflow-hidden rounded-2xl border border-purple-900/50 bg-gradient-to-br from-[#121528] via-[#0d1020] to-[#080a14] p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          
          {/* Stylized Author Emblem / Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-purple-950 via-slate-900 to-amber-950/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] p-2">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#0a0c16] text-center p-3">
                <Sparkles className="h-10 w-10 text-amber-400 mb-2" />
                <span className="font-display text-sm font-bold tracking-widest text-slate-100">
                  S. THIAO
                </span>
                <span className="text-[10px] text-amber-500 uppercase tracking-widest">
                  Auteur & Conteur
                </span>
              </div>
            </div>
          </div>

          {/* Author Intro */}
          <div className="flex flex-1 flex-col text-center md:text-left">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              <Feather className="h-3.5 w-3.5" />
              <span>Profil de l'auteur</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Souleymane Thiao
            </h1>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
              Romancier et nouvelliste. Mon travail explore les lisières où les traditions orales ouest-africaines rencontrent l'imaginaire spéculatif contemporain : la dark afrofantasy, le cyberpunk saharien et les récits d'initiation magique.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={onNavigateCatalogue}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 transition-all"
              >
                <BookOpen className="h-4 w-4" />
                <span>Explorer mes œuvres</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Manifesto / Démarche littéraire */}
      <section className="mt-14 rounded-2xl border border-purple-950/60 bg-[#0e1122]/70 p-6 sm:p-10">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Quote className="h-4 w-4" />
          <span>Démarche Littéraire & Thèmes</span>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
          Forger l’Imaginaire Sahélien dans l'Encre Noire & l'Or
        </h2>

        <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-slate-300 font-serif-reading">
          <p>
            Grandir bercé par les épopées de Soundiata Keïta, les contes initiatiques mandingues et la poésie des anciens royaumes du fleuve Sénégal a façonné ma conviction intime : les mythologies d'Afrique de l'Ouest recèlent une puissance d'évocation fabuleuse, prête à être propulsée dans les genres de l'imaginaire moderne.
          </p>
          <p>
            À travers ce site personnel, je publie de manière sérialisée (romans en chapitres réguliers et nouvelles one-shot), offrant aux lecteurs une immersion directe sans intermédiaires. Que ce soit dans les sables calcinés des forges de Songhaï ou sous les néons holographiques d'un Dakar rétrofuturiste en 2099, mon écriture cherche toujours l'harmonie entre le souffle des ancêtres et les tensions du monde de demain.
          </p>
        </div>

        {/* Pillars / 3 Themes */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-purple-950/60 bg-[#090b14] p-5">
            <span className="font-display text-xs font-bold text-amber-400 uppercase tracking-wider">
              01. Afrofantasy Sombre
            </span>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Magie solaire, alliances avec les esprits de la brousse, nécropoles impériales et malédictions de cendre.
            </p>
          </div>

          <div className="rounded-xl border border-purple-950/60 bg-[#090b14] p-5">
            <span className="font-display text-xs font-bold text-cyan-400 uppercase tracking-wider">
              02. Cyber-Sahel & Dystopie
            </span>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Griots cybernétisés, Cloud ancestral, IA totémiques et mégalopoles sahéliennes aux gratte-ciels en bio-titane.
            </p>
          </div>

          <div className="rounded-xl border border-purple-950/60 bg-[#090b14] p-5">
            <span className="font-display text-xs font-bold text-purple-400 uppercase tracking-wider">
              03. Conte Ésotérique & Dozo
            </span>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Rituels de chasse nocturne, pactes millénaires, respect des serments sacrés et bêtes sans ombre.
            </p>
          </div>
        </div>
      </section>

      {/* Les Plumes / Pseudonymes */}
      <section className="mt-14">
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            <Feather className="h-3.5 w-3.5" />
            <span>Multiples Identités Littéraires</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Mes Plumes & Pseudonymes
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
            Pour donner une couleur et une tonalité distincte à chaque univers, j'écris sous différentes plumes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {penNames.map((pen) => (
            <div
              key={pen.id}
              className="flex flex-col justify-between rounded-xl border border-purple-950/60 bg-[#0e1122]/90 p-6 transition-all hover:border-amber-500/40 hover:shadow-[0_8px_25px_rgba(245,158,11,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                    Plume Officielle
                  </span>
                  <Feather className="h-4 w-4 text-purple-400" />
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-slate-100">
                  {pen.name}
                </h3>

                <p className="mt-1 text-xs font-semibold text-purple-300">
                  {pen.genreFocus}
                </p>

                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {pen.bio}
                </p>
              </div>

              <div className="mt-6 border-t border-purple-950/50 pt-4">
                <button
                  onClick={() => onSelectPenName(pen.id)}
                  className="flex w-full items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Voir les récits de cette plume</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Dialogue */}
      <section className="mt-16 rounded-2xl border border-purple-900/40 bg-gradient-to-r from-purple-950/40 via-[#0e1122] to-amber-950/30 p-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-100">
              Une remarque, un mot d'encouragement ou une question d'univers ?
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              L'auteur lit personnellement chaque commentaire déposé sur les chapitres du site.
            </p>
          </div>

          <button
            onClick={onNavigateCatalogue}
            className="shrink-0 rounded-xl bg-amber-500/20 px-4 py-2.5 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
          >
            Choisir un chapitre à lire
          </button>
        </div>
      </section>

    </div>
  );
};
