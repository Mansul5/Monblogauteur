import React, { useState } from 'react';
import { Sparkles, Mail, CheckCircle2, Feather, Heart, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../services/storage';
import { PenName } from '../types';

interface FooterProps {
  penNames: PenName[];
  onSelectPenName: (penNameId: string) => void;
  onNavigate: (view: 'catalogue' | 'about' | 'universe' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({
  penNames,
  onSelectPenName,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    subscribeNewsletter(email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="relative mt-24 border-t border-purple-950/60 bg-[#080911] text-slate-400">
      {/* Glow highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Manifesto */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-wider text-slate-100">
                SOULEYMANE THIAO
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Plateforme littéraire officielle. Romans à chapitres, nouvelles et chroniques en afrofantasy, cyberpunk saharien et fantastique ésotérique.
            </p>
            <div className="text-xs text-amber-500/70 font-medium">
              « Là où la braise s'éveille, les légendes reprennent souffle. »
            </div>
          </div>

          {/* Les Plumes de l'Auteur */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold tracking-wider text-slate-200 uppercase">
              Les Plumes de l'Auteur
            </h3>
            <p className="text-xs text-slate-400">
              Chaque pseudonyme explore un territoire d'écriture singulier :
            </p>
            <ul className="flex flex-col gap-2.5">
              {penNames.map((pen) => (
                <li key={pen.id}>
                  <button
                    onClick={() => {
                      onNavigate('catalogue');
                      onSelectPenName(pen.id);
                    }}
                    className="group flex flex-col text-left transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300 group-hover:text-amber-300">
                      <Feather className="h-3 w-3 text-purple-400 transition-transform group-hover:rotate-12" />
                      <span>{pen.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 group-hover:text-slate-400">
                      {pen.genreFocus}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Rapide */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold tracking-wider text-slate-200 uppercase">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('catalogue')}
                  className="hover:text-amber-300 transition-colors text-slate-400"
                >
                  Tous les romans & nouvelles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('universe')}
                  className="hover:text-amber-300 transition-colors text-slate-400"
                >
                  Chronologie & Factions du Monde
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-300 transition-colors text-slate-400"
                >
                  Biographie & Démarche d'Écriture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-300 transition-colors text-amber-500/80 font-medium"
                >
                  Espace Administration (Auteur)
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Alerte Nouveaux Chapitres */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold tracking-wider text-slate-200 uppercase">
              Alertes Nouveaux Chapitres
            </h3>
            <p className="text-xs text-slate-400">
              Recevez une notification discrète par email lors de la parution d'un nouveau chapitre ou d'une nouvelle.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Merci ! Vous serez averti dès la prochaine publication.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Votre adresse email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-purple-950/80 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-purple-700 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-amber-500 hover:to-purple-600 active:scale-[0.98]"
                >
                  <span>S'abonner aux alertes</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/60 pt-6 text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Souleymane Thiao. Tous droits réservés. Textes & univers protégés.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Écrit avec passion, légendes et encres solaires</span>
            <Heart className="h-3.5 w-3.5 text-amber-500 inline fill-amber-500/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};
