import React, { useState } from 'react';
import { 
  Lock, LogOut, Plus, Edit, Trash2, Layers, BookOpen, 
  Eye, Check, X, ArrowUp, ArrowDown, Sparkles, Download, 
  Upload, RefreshCw, Feather, MessageSquare, Pin, FileText, 
  Image as ImageIcon, Bold, Italic, Heading, Quote, SplitSquareVertical
} from 'lucide-react';
import { Work, Chapter, PenName, Comment, WorkType, WorkStatus } from '../types';
import { 
  isAdminAuthenticated, loginAdmin, logoutAdmin, 
  saveWork, deleteWork, saveChapter, deleteChapter, 
  reorderChapters, savePenName, deleteComment, togglePinComment, 
  exportCatalogData, importCatalogData, resetToInitialData 
} from '../services/storage';
import { PRESET_COVERS } from '../data/initialData';
import { compressImageSource } from '../utils/imageCompressor';

interface AdminViewProps {
  works: Work[];
  chapters: Chapter[];
  penNames: PenName[];
  comments: Comment[];
  onRefreshData: () => void;
  onOpenWorkPublic: (workId: string) => void;
  onOpenChapterPublic: (chapterId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  works,
  chapters,
  penNames,
  comments,
  onRefreshData,
  onOpenWorkPublic,
  onOpenChapterPublic,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAdminAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'works' | 'chapter_manager' | 'pen_names' | 'comments' | 'backup'>('works');

  // Work Create / Edit Modal state
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [isCompressingCover, setIsCompressingCover] = useState(false);
  const [workForm, setWorkForm] = useState<{
    title: string;
    penNameId: string;
    type: WorkType;
    status: WorkStatus;
    genres: string;
    tags: string;
    shortDescription: string;
    fullDescription: string;
    coverUrl: string;
  }>({
    title: '',
    penNameId: penNames[0]?.id || 'souleymane-thiao',
    type: 'roman',
    status: 'en_cours',
    genres: 'Dark Afrofantasy, Magie Solaire',
    tags: '#Ancêtres, #Guerrier, #Sahel',
    shortDescription: '',
    fullDescription: '',
    coverUrl: PRESET_COVERS[0].url,
  });

  // Chapter Manager state
  const [selectedWorkForChapters, setSelectedWorkForChapters] = useState<Work | null>(null);
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterPreviewMode, setChapterPreviewMode] = useState(false);
  const [chapterForm, setChapterForm] = useState<{
    title: string;
    chapterNumber: number;
    content: string;
    status: 'publie' | 'brouillon';
    publishedAt: string;
  }>({
    title: '',
    chapterNumber: 1,
    content: '',
    status: 'publie',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  // Pen Name Modal state
  const [isAddingPenName, setIsAddingPenName] = useState(false);
  const [penNameForm, setPenNameForm] = useState<{
    name: string;
    tagline: string;
    genreFocus: string;
    bio: string;
  }>({
    name: '',
    tagline: '',
    genreFocus: '',
    bio: '',
  });

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasscode('');
    } else {
      setAuthError(true);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // ---------------- WORK ACTIONS ----------------
  const openNewWorkModal = () => {
    setEditingWorkId(null);
    setWorkForm({
      title: '',
      penNameId: penNames[0]?.id || 'souleymane-thiao',
      type: 'roman',
      status: 'en_cours',
      genres: 'Dark Afrofantasy',
      tags: '#Légende, #Sahel',
      shortDescription: '',
      fullDescription: '',
      coverUrl: PRESET_COVERS[0].url,
    });
    setIsEditingWork(true);
  };

  const openEditWorkModal = (work: Work) => {
    setEditingWorkId(work.id);
    setWorkForm({
      title: work.title,
      penNameId: work.penNameId,
      type: work.type,
      status: work.status,
      genres: work.genres.join(', '),
      tags: work.tags.join(', '),
      shortDescription: work.shortDescription,
      fullDescription: work.fullDescription,
      coverUrl: work.coverUrl,
    });
    setIsEditingWork(true);
  };

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workForm.title.trim()) return;

    const parsedGenres = workForm.genres.split(',').map(g => g.trim()).filter(Boolean);
    const parsedTags = workForm.tags.split(',').map(t => {
      const clean = t.trim();
      return clean.startsWith('#') ? clean : `#${clean}`;
    }).filter(t => t.length > 1);

    const workToSave: Work = {
      id: editingWorkId || `work-${Date.now()}`,
      title: workForm.title.trim(),
      penNameId: workForm.penNameId,
      type: workForm.type,
      status: workForm.status,
      genres: parsedGenres.length > 0 ? parsedGenres : ['Afrofantasy'],
      tags: parsedTags.length > 0 ? parsedTags : ['#Légende'],
      shortDescription: workForm.shortDescription.trim(),
      fullDescription: workForm.fullDescription.trim(),
      coverUrl: workForm.coverUrl || PRESET_COVERS[0].url,
      createdAt: editingWorkId ? (works.find(w => w.id === editingWorkId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: editingWorkId ? (works.find(w => w.id === editingWorkId)?.viewsCount || 10) : 1,
    };

    saveWork(workToSave);
    onRefreshData();
    setIsEditingWork(false);
    showToast(editingWorkId ? 'Œuvre mise à jour avec succès !' : 'Nouvelle œuvre créée avec succès !');
  };

  const handleDeleteWork = (work: Work) => {
    if (window.confirm(`Supprimer définitivement l'œuvre "${work.title}" et tous ses chapitres associés ?`)) {
      deleteWork(work.id);
      onRefreshData();
      if (selectedWorkForChapters?.id === work.id) {
        setSelectedWorkForChapters(null);
      }
      showToast('Œuvre supprimée.');
    }
  };

  // Image Upload handler (Compressed and converted to Data URL)
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingCover(true);
      // Automatically compress and resize to ~50-80KB to guarantee 100% Firestore compatibility
      const optimizedUrl = await compressImageSource(file, 700, 1050, 0.82);
      setWorkForm(prev => ({ ...prev, coverUrl: optimizedUrl }));
      showToast('Image optimisée (~60 Ko) et prête pour la synchronisation Cloud !');
    } catch (err) {
      console.warn('Erreur de compression, repli sur le fichier standard:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setWorkForm(prev => ({ ...prev, coverUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingCover(false);
      e.target.value = '';
    }
  };

  // ---------------- CHAPTER ACTIONS ----------------
  const openChapterManager = (work: Work) => {
    setSelectedWorkForChapters(work);
    setIsEditingChapter(false);
    setActiveTab('chapter_manager');
  };

  const openNewChapterModal = () => {
    if (!selectedWorkForChapters) return;
    const workChapters = chapters.filter(c => c.workId === selectedWorkForChapters.id);
    const nextNumber = workChapters.length + 1;

    setEditingChapterId(null);
    setChapterPreviewMode(false);
    setChapterForm({
      title: '',
      chapterNumber: nextNumber,
      content: '',
      status: 'publie',
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setIsEditingChapter(true);
  };

  const openEditChapterModal = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setChapterPreviewMode(false);
    setChapterForm({
      title: chapter.title,
      chapterNumber: chapter.chapterNumber,
      content: chapter.content,
      status: chapter.status,
      publishedAt: chapter.publishedAt,
    });
    setIsEditingChapter(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkForChapters || !chapterForm.title.trim()) return;

    const words = chapterForm.content.trim().split(/\s+/).length;
    const chapterToSave: Chapter = {
      id: editingChapterId || `ch-${selectedWorkForChapters.id}-${Date.now()}`,
      workId: selectedWorkForChapters.id,
      chapterNumber: Number(chapterForm.chapterNumber),
      title: chapterForm.title.trim(),
      content: chapterForm.content,
      status: chapterForm.status,
      publishedAt: chapterForm.publishedAt || new Date().toISOString().split('T')[0],
      wordCount: words,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 220)),
    };

    saveChapter(chapterToSave);
    onRefreshData();
    setIsEditingChapter(false);
    showToast(editingChapterId ? 'Chapitre mis à jour !' : 'Nouveau chapitre enregistré !');
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('Supprimer ce chapitre ?')) {
      deleteChapter(chapterId);
      onRefreshData();
      showToast('Chapitre supprimé.');
    }
  };

  const moveChapter = (workId: string, currentIdx: number, direction: 'up' | 'down') => {
    const workChapters = chapters
      .filter(c => c.workId === workId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= workChapters.length) return;

    const newOrder = [...workChapters];
    const temp = newOrder[currentIdx];
    newOrder[currentIdx] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    reorderChapters(workId, newOrder.map(c => c.id));
    onRefreshData();
  };

  // Text formatting insert helpers
  const insertFormatting = (syntax: string, type: 'wrap' | 'prefix' | 'block') => {
    const textarea = document.getElementById('chapter-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = chapterForm.content;
    const selected = current.substring(start, end);

    let nextContent = '';
    if (type === 'wrap') {
      nextContent = current.substring(0, start) + syntax + selected + syntax + current.substring(end);
    } else if (type === 'prefix') {
      nextContent = current.substring(0, start) + syntax + selected + current.substring(end);
    } else {
      nextContent = current.substring(0, start) + '\n\n' + syntax + '\n\n' + current.substring(end);
    }

    setChapterForm({ ...chapterForm, content: nextContent });
  };

  // ---------------- PEN NAME ACTIONS ----------------
  const handleSavePenName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penNameForm.name.trim()) return;

    const id = penNameForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    savePenName({
      id,
      name: penNameForm.name.trim(),
      tagline: penNameForm.tagline.trim() || 'Plume littéraire de Souleymane Thiao',
      genreFocus: penNameForm.genreFocus.trim() || 'Littérature de l’Imaginaire',
      bio: penNameForm.bio.trim() || 'Auteur sahélien.',
    });
    onRefreshData();
    setIsAddingPenName(false);
    showToast(`Plume "${penNameForm.name}" créée avec succès !`);
  };

  // ---------------- BACKUP & RESTORE ----------------
  const handleExportData = () => {
    const json = exportCatalogData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `souleymane_thiao_catalogue_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Sauvegarde JSON téléchargée avec succès !');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importCatalogData(content)) {
        onRefreshData();
        showToast('Catalogue restauré avec succès depuis le fichier JSON !');
      } else {
        alert('Erreur lors de l’importation du fichier JSON. Vérifiez son format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser le catalogue avec les récits d’exemple de Souleymane Thiao ?')) {
      resetToInitialData();
      onRefreshData();
      showToast('Catalogue réinitialisé avec succès.');
    }
  };

  // If not authenticated, show sleek Login Card
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="relative overflow-hidden rounded-2xl border border-purple-900/60 bg-[#0e1122] p-8 shadow-2xl backdrop-blur-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-4">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="font-display text-2xl font-bold text-white">
            Espace Auteur
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Accès sécurisé réservé à Souleymane Thiao pour publier des chapitres et éditer le catalogue.
          </p>

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3">
            <div className="text-left">
              <label className="text-xs text-slate-400 font-medium">Code d'accès auteur</label>
              <input
                id="admin-passcode-input"
                type="password"
                required
                placeholder="Entrez votre mot de passe..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`mt-1 w-full rounded-xl border bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none ${
                  authError ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-purple-950 focus:border-amber-500'
                }`}
              />
              {authError && (
                <p className="mt-1 text-xs text-rose-400">Code d'accès erroné. Veuillez réessayer.</p>
              )}
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span>Se connecter</span>
            </button>
          </form>

          <div className="mt-6 border-t border-purple-950/60 pt-4 text-center">
            <span className="text-[11px] text-slate-400">
              Astuce pour la session de démonstration : tapez <code className="text-amber-400 font-mono">souleymane2026</code> ou <code className="text-amber-400 font-mono">admin</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- AUTHENTICATED ADMIN DASHBOARD ----------------
  const selectedWorkChapters = selectedWorkForChapters
    ? chapters.filter(c => c.workId === selectedWorkForChapters.id).sort((a, b) => a.chapterNumber - b.chapterNumber)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-950/90 px-4 py-2.5 text-xs font-semibold text-emerald-200 shadow-xl backdrop-blur-md">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-950/60 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tableau de Bord Auteur</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Cloud Firestore Actif
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Gestion du Catalogue & des Chapitres
          </h1>
          <p className="text-xs text-slate-400">
            Connecté en tant que Souleymane Thiao. {works.length} œuvres • {chapters.length} chapitres • Synchronisation cloud en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openNewWorkModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Œuvre</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-all"
            title="Se déconnecter"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-purple-950/40 pb-4">
        <button
          onClick={() => setActiveTab('works')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'works'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Mes Œuvres ({works.length})</span>
        </button>

        {selectedWorkForChapters && (
          <button
            onClick={() => setActiveTab('chapter_manager')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'chapter_manager'
                ? 'bg-purple-900/50 text-purple-200 border border-purple-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Chapitres : {selectedWorkForChapters.title} ({selectedWorkChapters.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('pen_names')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'pen_names'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Feather className="h-4 w-4" />
          <span>Plumes / Pseudonymes ({penNames.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'comments'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Modération Avis & Commentaires ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            activeTab === 'backup'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Sauvegarde & Export JSON</span>
        </button>
      </div>

      {/* ---------------- TAB 1: WORKS LIST ---------------- */}
      {activeTab === 'works' && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-200">
              Toutes les Œuvres du Catalogue
            </h2>
            <button
              onClick={openNewWorkModal}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter un roman ou une nouvelle</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-purple-950/60 bg-[#0e1122]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-purple-950/80 bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Couverture</th>
                  <th className="px-4 py-3">Titre & Plume</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Chapitres</th>
                  <th className="px-4 py-3">Mise à jour</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/40">
                {works.map((work) => {
                  const workChCount = chapters.filter(c => c.workId === work.id).length;
                  const pen = penNames.find(p => p.id === work.penNameId);

                  return (
                    <tr key={work.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <img
                          src={work.coverUrl}
                          alt={work.title}
                          referrerPolicy="no-referrer"
                          className="h-14 w-10 rounded object-cover border border-slate-700"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{work.title}</div>
                        <div className="text-[11px] text-amber-400 font-medium">
                          {pen?.name || 'Souleymane Thiao'}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {work.genres.join(', ')}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          work.type === 'roman'
                            ? 'bg-purple-950 text-purple-200 border border-purple-800/50'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        }`}>
                          {work.type === 'roman' ? 'Roman' : 'Nouvelle'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="capitalize">{work.status.replace('_', ' ')}</span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-bold text-cyan-300">{workChCount}</span> {workChCount > 1 ? 'chapitres' : 'chapitre'}
                      </td>

                      <td className="px-4 py-3 text-slate-400">
                        {work.updatedAt}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openChapterManager(work)}
                            className="flex items-center gap-1 rounded bg-purple-950/60 px-2.5 py-1 text-[11px] font-medium text-cyan-300 hover:bg-purple-900 border border-purple-800/50"
                            title="Gérer les chapitres de cette œuvre"
                          >
                            <Layers className="h-3 w-3" />
                            <span>Chapitres</span>
                          </button>

                          <button
                            onClick={() => openEditWorkModal(work)}
                            className="rounded p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800"
                            title="Modifier les détails de l'œuvre"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenWorkPublic(work.id)}
                            className="rounded p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Voir sur le site public"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteWork(work)}
                            className="rounded p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Supprimer cette œuvre"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: CHAPTER MANAGER ---------------- */}
      {activeTab === 'chapter_manager' && selectedWorkForChapters && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-950/40 pb-4">
            <div>
              <span className="text-xs text-slate-400">Gestion des chapitres pour :</span>
              <h2 className="font-display text-xl font-bold text-amber-300">
                {selectedWorkForChapters.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openNewChapterModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:brightness-110"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Rédiger un Nouveau Chapitre</span>
              </button>
              <button
                onClick={() => onOpenWorkPublic(selectedWorkForChapters.id)}
                className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 hover:text-white"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Voir la fiche</span>
              </button>
            </div>
          </div>

          {/* Chapters Table */}
          <div className="rounded-xl border border-purple-950/60 bg-[#0e1122] overflow-hidden">
            <div className="p-4 bg-slate-900/60 border-b border-purple-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedWorkChapters.length} chapitres ordonnés</span>
              <span>Utilisez les flèches pour réordonner</span>
            </div>

            <div className="divide-y divide-purple-950/40">
              {selectedWorkChapters.map((chapter, idx) => (
                <div key={chapter.id} className="flex items-center justify-between p-4 hover:bg-slate-800/20">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveChapter(selectedWorkForChapters.id, idx, 'up')}
                        className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        title="Monter"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        disabled={idx === selectedWorkChapters.length - 1}
                        onClick={() => moveChapter(selectedWorkForChapters.id, idx, 'down')}
                        className="rounded p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        title="Descendre"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-950/60 font-display text-xs font-bold text-amber-300 border border-purple-800/40">
                      {chapter.chapterNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-200">
                          {chapter.title}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                          chapter.status === 'publie' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {chapter.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {chapter.wordCount} mots • ~{chapter.readingTimeMinutes} min de lecture • Publié le {chapter.publishedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditChapterModal(chapter)}
                      className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Éditer</span>
                    </button>
                    <button
                      onClick={() => onOpenChapterPublic(chapter.id)}
                      className="rounded p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Lire comme un lecteur"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="rounded p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: PEN NAMES ---------------- */}
      {activeTab === 'pen_names' && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-200">
                Gestion des Plumes & Pseudonymes
              </h2>
              <p className="text-xs text-slate-400">
                Chaque œuvre peut être signée sous une plume distincte avec sa propre identité et son registre.
              </p>
            </div>
            <button
              onClick={() => setIsAddingPenName(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Créer une nouvelle plume</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {penNames.map((pen) => {
              const penWorksCount = works.filter(w => w.penNameId === pen.id).length;
              return (
                <div key={pen.id} className="rounded-xl border border-purple-950/60 bg-[#0e1122] p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-amber-300">{pen.name}</span>
                    <span className="rounded bg-purple-950 px-2 py-0.5 text-[10px] text-purple-300">
                      {penWorksCount} œuvres
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-300">{pen.genreFocus}</p>
                  <p className="mt-2 text-xs text-slate-400">{pen.bio}</p>
                </div>
              );
            })}
          </div>

          {/* Add Pen Name Modal */}
          {isAddingPenName && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-purple-900 bg-[#0e1122] p-6 shadow-2xl">
                <h3 className="font-display text-lg font-bold text-white mb-4">
                  Ajouter une Nouvelle Plume
                </h3>
                <form onSubmit={handleSavePenName} className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Nom de la plume *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Nox Diallo..."
                      value={penNameForm.name}
                      onChange={(e) => setPenNameForm({ ...penNameForm, name: e.target.value })}
                      className="mt-1 w-full rounded border border-purple-950 bg-slate-900 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Genre de prédilection *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cyberpunk, Dark Fantasy..."
                      value={penNameForm.genreFocus}
                      onChange={(e) => setPenNameForm({ ...penNameForm, genreFocus: e.target.value })}
                      className="mt-1 w-full rounded border border-purple-950 bg-slate-900 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Slogan court</label>
                    <input
                      type="text"
                      placeholder="Ex: Récits d'anticipation nocturne..."
                      value={penNameForm.tagline}
                      onChange={(e) => setPenNameForm({ ...penNameForm, tagline: e.target.value })}
                      className="mt-1 w-full rounded border border-purple-950 bg-slate-900 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Bio courte de la plume</label>
                    <textarea
                      rows={3}
                      placeholder="Description de cette voix littéraire..."
                      value={penNameForm.bio}
                      onChange={(e) => setPenNameForm({ ...penNameForm, bio: e.target.value })}
                      className="mt-1 w-full rounded border border-purple-950 bg-slate-900 p-2 text-white"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPenName(false)}
                      className="px-3 py-1.5 text-slate-400 hover:text-white"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-amber-500 px-4 py-1.5 font-bold text-slate-950 hover:bg-amber-400"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TAB 4: COMMENTS MODERATION ---------------- */}
      {activeTab === 'comments' && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-200">
              Modération des Commentaires ({comments.length})
            </h2>
            <span className="text-xs text-slate-400">
              Épinglez les meilleurs commentaires ou supprimez les spams
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between rounded-xl border border-purple-950/60 bg-[#0e1122] p-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">{c.authorName}</span>
                    <span className="text-[10px] text-slate-500">({c.targetType === 'work' ? 'Sur l’œuvre' : 'Sur chapitre'} - {c.createdAt})</span>
                    {c.pinned && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300 font-semibold">
                        Épinglé
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-300">{c.content}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      togglePinComment(c.id);
                      onRefreshData();
                      showToast(c.pinned ? 'Commentaire désépinglé.' : 'Commentaire épinglé en tête !');
                    }}
                    className={`rounded p-1.5 text-xs ${c.pinned ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400 hover:text-white'}`}
                    title="Épingler en haut"
                  >
                    <Pin className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Supprimer ce commentaire ?')) {
                        deleteComment(c.id);
                        onRefreshData();
                        showToast('Commentaire supprimé.');
                      }
                    }}
                    className="rounded p-1.5 text-slate-400 hover:text-rose-400"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 5: BACKUP & RESTORE ---------------- */}
      {activeTab === 'backup' && (
        <div className="mt-6 flex flex-col gap-8 max-w-3xl">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-100">
              Sauvegarde & Restauration du Catalogue
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Téléchargez l'intégralité de vos œuvres, chapitres et métadonnées en fichier JSON pour ne jamais rien perdre, ou restaurez une archive précédente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Download Backup */}
            <div className="rounded-xl border border-purple-950/70 bg-[#0e1122] p-6 flex flex-col justify-between">
              <div>
                <Download className="h-8 w-8 text-amber-400 mb-3" />
                <h3 className="font-display text-base font-bold text-white">
                  Exporter tout le catalogue
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Génère un fichier JSON complet contenant toutes vos œuvres, les textes de vos chapitres et les commentaires.
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger la sauvegarde JSON</span>
              </button>
            </div>

            {/* Upload Backup */}
            <div className="rounded-xl border border-purple-950/70 bg-[#0e1122] p-6 flex flex-col justify-between">
              <div>
                <Upload className="h-8 w-8 text-cyan-400 mb-3" />
                <h3 className="font-display text-base font-bold text-white">
                  Restaurer depuis un JSON
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Importez un fichier de sauvegarde JSON pour mettre à jour ou recharger vos œuvres en bloc.
                </p>
              </div>
              <label className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-950/40 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-950/80 transition-all">
                <Upload className="h-4 w-4" />
                <span>Sélectionner un fichier JSON</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

          </div>

          {/* Reset Demo Data */}
          <div className="rounded-xl border border-rose-950/40 bg-rose-950/10 p-6 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-rose-300">Réinitialiser le catalogue d'exemple</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Rétablit les œuvres, chapitres et plumes de démonstration de Souleymane Thiao.
              </p>
            </div>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 rounded-lg border border-rose-800/60 bg-rose-950/60 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: WORK CREATE / EDIT ---------------- */}
      {isEditingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-purple-900 bg-[#0e1122] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-950 pb-4">
              <h3 className="font-display text-xl font-bold text-white">
                {editingWorkId ? "Modifier l'Œuvre" : "Créer une Nouvelle Œuvre"}
              </h3>
              <button
                onClick={() => setIsEditingWork(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWork} className="mt-5 flex flex-col gap-4 text-xs">
              
              {/* Row 1: Title & Pen Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-slate-300 font-medium">Titre de l'œuvre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Les Cendres de Songhaï..."
                    value={workForm.title}
                    onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Plume / Pseudonyme *</label>
                  <select
                    value={workForm.penNameId}
                    onChange={(e) => setWorkForm({ ...workForm, penNameId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    {penNames.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.genreFocus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Type & Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-slate-300 font-medium">Format de l'œuvre *</label>
                  <select
                    value={workForm.type}
                    onChange={(e) => setWorkForm({ ...workForm, type: e.target.value as WorkType })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="roman">Roman à chapitres (Feuilleton)</option>
                    <option value="nouvelle">Nouvelle complète (One-Shot)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Statut de publication *</label>
                  <select
                    value={workForm.status}
                    onChange={(e) => setWorkForm({ ...workForm, status: e.target.value as WorkStatus })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="en_cours">En cours de publication</option>
                    <option value="termine">Terminé</option>
                    <option value="one_shot">One-Shot</option>
                    <option value="brouillon">Brouillon (non listé)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Genres & Tags */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-slate-300 font-medium">Genres (séparés par des virgules)</label>
                  <input
                    type="text"
                    placeholder="Ex: Dark Afrofantasy, Épique, Thriller"
                    value={workForm.genres}
                    onChange={(e) => setWorkForm({ ...workForm, genres: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Mots-clés / Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    placeholder="Ex: #Ancêtres, #Guerre, #Magie"
                    value={workForm.tags}
                    onChange={(e) => setWorkForm({ ...workForm, tags: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="text-slate-300 font-medium">Image de couverture</label>
                
                {/* Visual Preview & File Upload */}
                <div className="mt-2 flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={workForm.coverUrl}
                    alt="Aperçu couverture"
                    referrerPolicy="no-referrer"
                    className="h-28 w-20 rounded-lg object-cover border border-purple-700 shadow-md shrink-0"
                  />

                  <div className="flex-1 flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      placeholder="URL directe de l'image..."
                      value={workForm.coverUrl}
                      onChange={(e) => setWorkForm({ ...workForm, coverUrl: e.target.value })}
                      className="w-full rounded-lg border border-purple-950 bg-slate-900 p-2 text-white"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <label className={`flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 cursor-pointer hover:bg-slate-700 ${isCompressingCover ? 'opacity-50 cursor-wait' : ''}`}>
                        <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
                        <span>{isCompressingCover ? 'Optimisation en cours...' : 'Téléverser depuis mon ordinateur'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isCompressingCover}
                          onChange={handleCoverFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-emerald-400/80">
                        ✓ Compression automatique &lt; 100 Ko pour Cloud Firestore
                      </span>
                    </div>

                    {/* Preset Covers Selector */}
                    <div className="mt-1">
                      <span className="text-[10px] text-slate-400">Ou choisir une couverture afrofantasy prédéfinie :</span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {PRESET_COVERS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setWorkForm({ ...workForm, coverUrl: preset.url })}
                            className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:text-amber-300 hover:border-amber-500 border border-slate-700"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-slate-300 font-medium">Résumé court (accroche catalogue) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Une ou deux phrases d'accroche pour la carte du catalogue..."
                  value={workForm.shortDescription}
                  onChange={(e) => setWorkForm({ ...workForm, shortDescription: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Full Description / Synopsis */}
              <div>
                <label className="text-slate-300 font-medium">Synopsis complet (affiché sur la fiche œuvre) *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Présentation détaillée de l'intrigue, du monde et des protagonistes..."
                  value={workForm.fullDescription}
                  onChange={(e) => setWorkForm({ ...workForm, fullDescription: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="mt-4 flex justify-end gap-3 border-t border-purple-950 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingWork(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-5 py-2 font-bold text-slate-950 hover:brightness-110"
                >
                  {editingWorkId ? 'Mettre à jour l’œuvre' : 'Créer l’œuvre'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: CHAPTER EDITOR / WRITER ---------------- */}
      {isEditingChapter && selectedWorkForChapters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
          <div className="my-6 w-full max-w-4xl rounded-2xl border border-purple-900 bg-[#0c0f1e] p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-purple-950 pb-4">
              <div>
                <span className="text-[11px] text-amber-400 font-semibold uppercase">
                  {selectedWorkForChapters.title}
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {editingChapterId ? `Modifier le Chapitre ${chapterForm.chapterNumber}` : 'Rédiger un Nouveau Chapitre'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChapterPreviewMode(!chapterPreviewMode)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border ${
                    chapterPreviewMode
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{chapterPreviewMode ? 'Édition' : 'Aperçu Lecteur'}</span>
                </button>

                <button
                  onClick={() => setIsEditingChapter(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveChapter} className="mt-5 flex flex-col gap-4 text-xs">
              
              {/* Header Fields: Chapter number, Title, Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-slate-300 font-medium">N° Chapitre *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={chapterForm.chapterNumber}
                    onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-medium">Titre du chapitre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: La Braise dans la Gorge..."
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium">Statut *</label>
                  <select
                    value={chapterForm.status}
                    onChange={(e) => setChapterForm({ ...chapterForm, status: e.target.value as any })}
                    className="mt-1 w-full rounded-lg border border-purple-950 bg-slate-900 p-2 text-white"
                  >
                    <option value="publie">Publié immédiatement</option>
                    <option value="brouillon">Brouillon privé</option>
                  </select>
                </div>
              </div>

              {/* Text formatting toolbar */}
              {!chapterPreviewMode && (
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-purple-950/80 bg-slate-900/90 p-2">
                  <span className="text-[11px] text-slate-400 mr-2">Outils d'écriture :</span>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', 'wrap')}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:text-amber-300"
                    title="Gras"
                  >
                    <Bold className="h-3 w-3" />
                    <span>Gras</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', 'wrap')}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:text-amber-300"
                    title="Italique"
                  >
                    <Italic className="h-3 w-3" />
                    <span>Italique</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ', 'prefix')}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:text-amber-300"
                    title="Sous-titre"
                  >
                    <Heading className="h-3 w-3" />
                    <span>Titre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ', 'prefix')}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:text-amber-300"
                    title="Citation"
                  >
                    <Quote className="h-3 w-3" />
                    <span>Citation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('* * *', 'block')}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-slate-300 hover:text-amber-300"
                    title="Séparateur de scène"
                  >
                    <SplitSquareVertical className="h-3 w-3" />
                    <span>Séparateur (✦✦✦)</span>
                  </button>
                </div>
              )}

              {/* Main Content: Editor vs Preview */}
              {chapterPreviewMode ? (
                <div className="max-h-96 overflow-y-auto rounded-xl border border-purple-900/60 bg-[#0a0c16] p-6 text-sm font-serif-reading leading-relaxed text-slate-200">
                  <h3 className="font-display text-xl font-bold text-amber-300 mb-6 text-center">
                    Chapitre {chapterForm.chapterNumber} : {chapterForm.title || 'Sans titre'}
                  </h3>
                  {chapterForm.content.split('\n\n').map((p, i) => (
                    <p key={i} className="mb-4 text-justify">
                      {p === '* * *' ? <span className="block text-center text-amber-500 my-4">✦ ✦ ✦</span> : p}
                    </p>
                  ))}
                </div>
              ) : (
                <div>
                  <textarea
                    id="chapter-content-textarea"
                    required
                    rows={12}
                    placeholder="Écrivez ou collez le texte de votre chapitre ici. Séparez les paragraphes par un saut de ligne..."
                    value={chapterForm.content}
                    onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                    className="w-full rounded-xl border border-purple-950 bg-slate-950 p-4 font-serif-reading text-sm text-slate-200 leading-relaxed focus:border-amber-500 focus:outline-none"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>
                      {chapterForm.content ? chapterForm.content.trim().split(/\s+/).length : 0} mots
                    </span>
                    <span>
                      ~{Math.max(1, Math.ceil((chapterForm.content ? chapterForm.content.trim().split(/\s+/).length : 0) / 220))} minutes de lecture
                    </span>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-4 flex justify-end gap-3 border-t border-purple-950 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingChapter(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-5 py-2 font-bold text-slate-950 hover:brightness-110"
                >
                  Enregistrer le chapitre
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
