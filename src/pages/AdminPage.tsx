import {
  Check,
  Copy,
  Database,
  ExternalLink,
  FolderKanban,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Newspaper,
  Package,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import firebaseConfig from '../../firebase-applet-config.json';
import {ImagePickerField} from '../components/ImagePickerField';
import {PageHead} from '../components/PageHead';
import {SafeImage} from '../components/SafeImage';
import {BOOTSTRAPPED_ADMIN_EMAIL, useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import type {
  ArticleCategory,
  ArticleItem,
  ContactMessageStatus,
  Division,
  DivisionIconName,
  ProductCategory,
  ProductItem,
  ProjectCategory,
  ProjectItem,
  ServiceIconName,
  ServiceItem,
} from '../types';
import {type SiteHomeSettings, sanitizeSlug} from '../utils/cmsPayloads';
import {
  DEFAULT_BRAND_LOGO_URL,
  DEFAULT_HERO_IMAGE_URL,
  PRESET_IMAGE_ASSETS,
} from '../utils/imageMedia';

type AdminTab =
  | 'home'
  | 'media'
  | 'projects'
  | 'products'
  | 'insights'
  | 'divisions'
  | 'messages'
  | 'admins';

const PROJECT_CATEGORY_MAP: Record<ProjectCategory, {id: string; en: string}> = {
  Website: {id: 'Website', en: 'Website'},
  Software: {id: 'Perangkat Lunak', en: 'Software'},
  Networking: {id: 'Jaringan', en: 'Networking'},
  'Creative Design': {id: 'Desain Kreatif', en: 'Creative Design'},
  'Digital Innovation': {id: 'Inovasi Digital', en: 'Digital Innovation'},
};

const PRODUCT_CATEGORY_MAP: Record<ProductCategory, {id: string; en: string}> = {
  Software: {id: 'Perangkat Lunak', en: 'Software'},
  'Web Applications': {id: 'Aplikasi Web', en: 'Web Applications'},
  'Digital Tools': {id: 'Perangkat Digital', en: 'Digital Tools'},
  'Technology Products': {id: 'Produk Teknologi', en: 'Technology Products'},
};

const ARTICLE_CATEGORY_MAP: Record<ArticleCategory, {id: string; en: string}> = {
  Technology: {id: 'Teknologi', en: 'Technology'},
  Networking: {id: 'Jaringan', en: 'Networking'},
  Software: {id: 'Perangkat Lunak', en: 'Software'},
  Hardware: {id: 'Perangkat Keras', en: 'Hardware'},
  'Digital Innovation': {id: 'Inovasi Digital', en: 'Digital Innovation'},
  Tutorials: {id: 'Tutorial', en: 'Tutorials'},
};

const SERVICE_ICONS: ServiceIconName[] = [
  'Globe',
  'AppWindow',
  'Terminal',
  'Network',
  'Router',
  'Headphones',
  'Cpu',
  'Layout',
  'PenTool',
  'Sparkles',
];

const DIVISION_ICONS: DivisionIconName[] = ['Code2', 'Server', 'Palette', 'Compass'];

function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function createEmptyProject(): ProjectItem {
  const ts = Date.now().toString().slice(-4);
  return {
    id: `proyek-baru-${ts}`,
    slug: `proyek-baru-${ts}`,
    isDemo: false,
    featured: true,
    sortOrder: 0,
    title: {id: '', en: ''},
    category: 'Website',
    categoryLabel: {id: 'Website', en: 'Website'},
    divisionId: 'dilux-development',
    year: '2026',
    status: {id: 'Aktif', en: 'Active'},
    image: PRESET_IMAGE_ASSETS[2].value,
    imageAlt: {id: 'Pratinjau proyek DILUX GROUP', en: 'DILUX GROUP project preview'},
    shortDescription: {id: '', en: ''},
    overview: {id: '', en: ''},
    architectureNotes: {id: '', en: ''},
    technologies: ['TypeScript', 'React'],
  };
}

function createEmptyProduct(): ProductItem {
  const ts = Date.now().toString().slice(-4);
  return {
    id: `produk-baru-${ts}`,
    slug: `produk-baru-${ts}`,
    isDemo: false,
    featured: true,
    sortOrder: 0,
    name: '',
    category: 'Web Applications',
    categoryLabel: {id: 'Aplikasi Web', en: 'Web Applications'},
    status: {id: 'Rilis Aktif', en: 'Active Release'},
    image: PRESET_IMAGE_ASSETS[2].value,
    imageAlt: {id: 'Pratinjau produk digital DILUX GROUP', en: 'DILUX GROUP digital product preview'},
    shortDescription: {id: '', en: ''},
    fullDescription: {id: '', en: ''},
    capabilities: {id: [''], en: ['']},
  };
}

function createEmptyArticle(): ArticleItem {
  const ts = Date.now().toString().slice(-4);
  return {
    id: `artikel-baru-${ts}`,
    slug: `artikel-baru-${ts}`,
    isDemo: false,
    featured: true,
    sortOrder: 0,
    title: {id: '', en: ''},
    excerpt: {id: '', en: ''},
    category: 'Technology',
    categoryLabel: {id: 'Teknologi', en: 'Technology'},
    publishedAt: new Date().toISOString().slice(0, 10),
    publishedLabel: {id: 'November 2026', en: 'November 2026'},
    readingMinutes: 4,
    image: PRESET_IMAGE_ASSETS[5].value,
    imageAlt: {id: 'Ilustrasi artikel DILUX GROUP', en: 'DILUX GROUP article illustration'},
    author: 'DILUX EDITORIAL',
    sections: [
      {
        heading: {id: 'Ringkasan Utama', en: 'Core Overview'},
        body: {id: '', en: ''},
      },
    ],
  };
}

function createEmptyService(): ServiceItem {
  const ts = Date.now().toString().slice(-3);
  return {
    id: `layanan-${ts}`,
    number: '11',
    divisionId: 'dilux-development',
    icon: 'Globe',
    name: {id: '', en: ''},
    shortDescription: {id: '', en: ''},
    scopeDetails: {id: [''], en: ['']},
    featured: false,
    sortOrder: 10,
  };
}

const inputClass =
  'w-full px-3.5 py-2.5 text-sm text-[#0F172A] bg-white/85 backdrop-blur-sm border border-slate-200/90 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]';
const labelClass = 'block text-xs font-semibold text-[#0F172A] mb-1.5';

export function AdminPage() {
  const {language, t, localize} = useLanguage();
  const {
    user,
    authReady,
    isAdmin,
    adminCheckReady,
    redirectAuthErrorCode,
    clearRedirectAuthError,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOutAdmin,
    homeSettings,
    divisions,
    services,
    products,
    projects,
    articles,
    admins,
    contactMessages,
    firestoreSyncedCounts,
    seedInitialDataToFirestore,
    saveHomeSettings,
    saveDivision,
    saveService,
    deleteService,
    saveProduct,
    deleteProduct,
    saveProject,
    deleteProject,
    saveArticle,
    deleteArticle,
    addAdminUser,
    removeAdminUser,
    updateContactMessageStatus,
    deleteContactMessage,
  } = useFirebase();

  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [messageStatusFilter, setMessageStatusFilter] = useState<'all' | ContactMessageStatus>('all');
  const [authError, setAuthError] = useState('');
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error'; text: string} | null>(
    null
  );
  const [busyAction, setBusyAction] = useState(false);
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  // Home settings draft
  const [homeDraft, setHomeDraft] = useState<SiteHomeSettings>(homeSettings);
  useEffect(() => {
    setHomeDraft(homeSettings);
  }, [homeSettings]);

  // Project editor state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectTechText, setProjectTechText] = useState('');

  // Product editor state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productCapIdText, setProductCapIdText] = useState('');
  const [productCapEnText, setProductCapEnText] = useState('');

  // Article editor state
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [articleHeadingId, setArticleHeadingId] = useState('');
  const [articleHeadingEn, setArticleHeadingEn] = useState('');
  const [articleBodyId, setArticleBodyId] = useState('');
  const [articleBodyEn, setArticleBodyEn] = useState('');

  // Division & Service editor state
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [divFocusIdText, setDivFocusIdText] = useState('');
  const [divFocusEnText, setDivFocusEnText] = useState('');

  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNewService, setIsNewService] = useState(false);
  const [serviceScopeIdText, setServiceScopeIdText] = useState('');
  const [serviceScopeEnText, setServiceScopeEnText] = useState('');

  // Admin management state
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminLabel, setNewAdminLabel] = useState('');

  // Quick image drafts for the Media & Images manager tab
  const [mediaDrafts, setMediaDrafts] = useState<Record<string, string>>({});
  const getMediaDraft = (key: string, currentValue: string) =>
    key in mediaDrafts ? mediaDrafts[key] : currentValue;
  const setMediaDraft = (key: string, nextValue: string) => {
    setMediaDrafts((prev) => ({...prev, [key]: nextValue}));
  };

  const notify = (type: 'success' | 'error', text: string) => {
    setStatusMessage({type, text});
  };

  const hasUnseededCollections =
    firestoreSyncedCounts.siteSettings === 0 ||
    firestoreSyncedCounts.divisions === 0 ||
    firestoreSyncedCounts.services === 0 ||
    firestoreSyncedCounts.products === 0 ||
    firestoreSyncedCounts.projects === 0 ||
    firestoreSyncedCounts.articles === 0;

  const isInIframe =
    typeof window !== 'undefined' &&
    (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

  const formatAuthError = (code: string): string => {
    switch (code) {
      case 'auth/popup-blocked':
        return t.admin.loginErrorPopupBlocked;
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return t.admin.loginErrorPopupClosed;
      case 'auth/unauthorized-domain':
        return `${t.admin.loginErrorUnauthorizedDomain} (${
          typeof window !== 'undefined' ? window.location.hostname : ''
        })`;
      case 'auth/network-request-failed':
        return t.admin.loginErrorNetwork;
      case 'auth/operation-not-allowed':
        return t.admin.loginErrorNotAllowed;
      default:
        return `${t.admin.loginError} (${code})`;
    }
  };

  const effectiveAuthError =
    authError || (redirectAuthErrorCode ? formatAuthError(redirectAuthErrorCode) : '');
  const effectiveAuthErrorCode = authErrorCode || redirectAuthErrorCode;
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const officialAdminUrl =
    'https://ais-pre-ucdnkyf5hf4s56scm2hx4k-481567574201.asia-northeast1.run.app/admin';
  const firebaseAuthSettingsUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`;

  const handleCopyHostname = async () => {
    if (!currentHostname || typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthErrorCode(null);
    clearRedirectAuthError();
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as {code?: unknown}).code)
          : 'auth/unknown';
      if (code === 'auth/popup-blocked' && !isInIframe) {
        try {
          await signInWithGoogleRedirect();
          return;
        } catch (redirectErr: unknown) {
          const rCode =
            typeof redirectErr === 'object' && redirectErr !== null && 'code' in redirectErr
              ? String((redirectErr as {code?: unknown}).code)
              : code;
          setAuthErrorCode(rCode);
          setAuthError(formatAuthError(rCode));
        }
      } else {
        setAuthErrorCode(code);
        setAuthError(formatAuthError(code));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleRedirectLogin = async () => {
    setAuthError('');
    setAuthErrorCode(null);
    clearRedirectAuthError();
    setAuthLoading(true);
    try {
      await signInWithGoogleRedirect();
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as {code?: unknown}).code)
          : 'auth/redirect-failed';
      setAuthErrorCode(code);
      setAuthError(formatAuthError(code));
      setAuthLoading(false);
    }
  };

  const handleSeedData = async () => {
    setBusyAction(true);
    setStatusMessage(null);
    try {
      await seedInitialDataToFirestore();
      notify('success', t.admin.seedSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const handleSaveHomeSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction(true);
    setStatusMessage(null);
    try {
      await saveHomeSettings(homeDraft);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const startEditProject = (proj: ProjectItem, asNew = false) => {
    setEditingProject({...proj});
    setIsNewProject(asNew);
    setProjectTechText(proj.technologies.join(', '));
    setStatusMessage(null);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) {
      return;
    }
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const cleanSlug = sanitizeSlug(editingProject.slug || editingProject.title.en || 'project');
      const technologies = projectTechText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      await saveProject(
        {
          ...editingProject,
          id: isNewProject ? cleanSlug : editingProject.id,
          slug: cleanSlug,
          technologies: technologies.length > 0 ? technologies : ['TypeScript'],
        },
        isNewProject
      );
      setEditingProject(null);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const startEditProduct = (prod: ProductItem, asNew = false) => {
    setEditingProduct({...prod});
    setIsNewProduct(asNew);
    setProductCapIdText(prod.capabilities.id.join('\n'));
    setProductCapEnText(prod.capabilities.en.join('\n'));
    setStatusMessage(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) {
      return;
    }
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const cleanSlug = sanitizeSlug(editingProduct.slug || editingProduct.name || 'product');
      await saveProduct(
        {
          ...editingProduct,
          id: isNewProduct ? cleanSlug : editingProduct.id,
          slug: cleanSlug,
          capabilities: {
            id: splitLines(productCapIdText),
            en: splitLines(productCapEnText),
          },
        },
        isNewProduct
      );
      setEditingProduct(null);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const startEditArticle = (art: ArticleItem, asNew = false) => {
    setEditingArticle({...art});
    setIsNewArticle(asNew);
    setArticleHeadingId(art.sections.map((s) => s.heading.id).join(' | '));
    setArticleHeadingEn(art.sections.map((s) => s.heading.en).join(' | '));
    setArticleBodyId(art.sections.map((s) => s.body.id).join('\n\n'));
    setArticleBodyEn(art.sections.map((s) => s.body.en).join('\n\n'));
    setStatusMessage(null);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) {
      return;
    }
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const cleanSlug = sanitizeSlug(editingArticle.slug || editingArticle.title.en || 'article');
      await saveArticle(
        {
          ...editingArticle,
          id: isNewArticle ? cleanSlug : editingArticle.id,
          slug: cleanSlug,
          sections: [
            {
              heading: {
                id: articleHeadingId.trim() || 'Ringkasan',
                en: articleHeadingEn.trim() || 'Overview',
              },
              body: {
                id: articleBodyId.trim() || editingArticle.excerpt.id,
                en: articleBodyEn.trim() || editingArticle.excerpt.en,
              },
            },
          ],
        },
        isNewArticle
      );
      setEditingArticle(null);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const startEditDivision = (div: Division) => {
    setEditingDivision({...div});
    setDivFocusIdText(div.focusAreas.id.join('\n'));
    setDivFocusEnText(div.focusAreas.en.join('\n'));
    setStatusMessage(null);
  };

  const handleSaveDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDivision) {
      return;
    }
    setBusyAction(true);
    setStatusMessage(null);
    try {
      await saveDivision(
        {
          ...editingDivision,
          focusAreas: {
            id: splitLines(divFocusIdText),
            en: splitLines(divFocusEnText),
          },
        },
        false
      );
      setEditingDivision(null);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const startEditService = (svc: ServiceItem, asNew = false) => {
    setEditingService({...svc});
    setIsNewService(asNew);
    setServiceScopeIdText(svc.scopeDetails.id.join('\n'));
    setServiceScopeEnText(svc.scopeDetails.en.join('\n'));
    setStatusMessage(null);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) {
      return;
    }
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const cleanId = sanitizeSlug(editingService.id || editingService.name.en || 'service');
      await saveService(
        {
          ...editingService,
          id: isNewService ? cleanId : editingService.id,
          scopeDetails: {
            id: splitLines(serviceScopeIdText),
            en: splitLines(serviceScopeEnText),
          },
        },
        isNewService
      );
      setEditingService(null);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUid.trim() || !newAdminEmail.trim()) {
      return;
    }
    setBusyAction(true);
    setStatusMessage(null);
    try {
      await addAdminUser(newAdminUid.trim(), newAdminEmail.trim(), newAdminLabel.trim() || 'Admin');
      setNewAdminUid('');
      setNewAdminEmail('');
      setNewAdminLabel('');
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const toggleProjectFeatured = async (proj: ProjectItem) => {
    setBusyAction(true);
    try {
      await saveProject({...proj, featured: !proj.featured}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const toggleProductFeatured = async (prod: ProductItem) => {
    setBusyAction(true);
    try {
      await saveProduct({...prod, featured: !prod.featured}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const toggleServiceFeatured = async (svc: ServiceItem) => {
    setBusyAction(true);
    try {
      await saveService({...svc, featured: !svc.featured}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const toggleArticleFeatured = async (art: ArticleItem) => {
    setBusyAction(true);
    try {
      await saveArticle({...art, featured: !art.featured}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const handleSaveProjectImage = async (proj: ProjectItem) => {
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const nextImage = getMediaDraft(`proj:${proj.id}`, proj.image);
      await saveProject({...proj, image: nextImage}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const handleSaveProductImage = async (prod: ProductItem) => {
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const nextImage = getMediaDraft(`prod:${prod.id}`, prod.image);
      await saveProduct({...prod, image: nextImage}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  const handleSaveArticleImage = async (art: ArticleItem) => {
    setBusyAction(true);
    setStatusMessage(null);
    try {
      const nextImage = getMediaDraft(`art:${art.id}`, art.image);
      await saveArticle({...art, image: nextImage}, false);
      notify('success', t.admin.saveSuccess);
    } catch (err) {
      notify('error', err instanceof Error ? err.message : t.admin.actionError);
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <>
      <PageHead title={t.admin.pageTitle} description={t.admin.pageDescription} />

      <section className="dilux-glass-canvas-dark text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-2">
              {t.admin.headerKicker}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              {t.admin.headerTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {t.admin.headerSubtitle}
            </p>
          </div>

          {user && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-200 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
              >
                <span>{t.admin.backToSite}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => void signOutAdmin()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white liquid-glass-control-dark rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.admin.signOut}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 sm:py-14 dilux-glass-canvas-light min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading */}
          {(!authReady || !adminCheckReady) && (
            <div className="liquid-glass-light rounded-2xl p-10 flex items-center justify-center gap-3 text-sm text-[#64748B]">
              <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" aria-hidden="true" />
              <span>{t.admin.loadingStatus}</span>
            </div>
          )}

          {/* Signed Out -> Login View */}
          {authReady && adminCheckReady && !user && (
            <div className="max-w-xl mx-auto liquid-glass-light rounded-2xl p-8 sm:p-10">
              <div className="w-12 h-12 rounded-xl bg-[#0B1428] text-[#60A5FA] flex items-center justify-center mb-5 shadow-md">
                <Lock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                {t.admin.loginTitle}
              </h2>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                {t.admin.loginDescription}
              </p>

              {isInIframe && (
                <div className="mt-5 p-4 rounded-xl bg-white/65 border border-white/80 ring-1 ring-slate-900/5 space-y-3">
                  <p className="text-xs text-[#0F172A] leading-relaxed">{t.admin.iframeNotice}</p>
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '/admin'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B1428] hover:bg-[#142B4D] rounded-lg transition-colors"
                  >
                    <span>{t.admin.openNewTabButton}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}

              {effectiveAuthError && (
                <div
                  role="alert"
                  className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed space-y-3"
                >
                  <p className="font-semibold">{effectiveAuthError}</p>
                  {effectiveAuthErrorCode === 'auth/unauthorized-domain' && (
                    <div className="pt-2 border-t border-red-200/80 space-y-3">
                      <p className="text-red-700">{t.admin.unauthorizedDomainHelp}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {currentHostname && (
                          <button
                            type="button"
                            onClick={() => void handleCopyHostname()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-white hover:bg-slate-50 border border-red-200 rounded-lg cursor-pointer"
                          >
                            {copiedDomain ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                            <span>
                              {copiedDomain
                                ? t.admin.copiedDomainLabel
                                : `${t.admin.copyDomainButton}: ${currentHostname}`}
                            </span>
                          </button>
                        )}
                        <a
                          href={firebaseAuthSettingsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0B1428] hover:bg-[#142B4D] rounded-lg transition-colors"
                        >
                          <span>{t.admin.openFirebaseConsoleButton}</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                        <a
                          href={officialAdminUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                        >
                          <span>{t.admin.openOfficialAdminButton}</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void handleGoogleLogin()}
                  disabled={authLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{t.admin.loginButton}</span>
                </button>

                {!isInIframe && (
                  <button
                    type="button"
                    onClick={() => void handleGoogleRedirectLogin()}
                    disabled={authLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <span>{t.admin.loginRedirectButton}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Signed In -> Not Admin */}
          {authReady && adminCheckReady && user && !isAdmin && (
            <div className="max-w-xl mx-auto liquid-glass-light border-red-200/80 rounded-2xl p-8 sm:p-10 space-y-5">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                  {t.admin.deniedTitle}
                </h2>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">
                  {t.admin.deniedDescription}
                </p>
              </div>
              <div className="rounded-xl bg-white/70 border border-slate-200/80 p-4 text-xs space-y-1.5">
                <p className="text-[#0F172A]">
                  <span className="font-semibold">{t.admin.signedInAs}:</span>{' '}
                  {user.email || '-'}
                </p>
                <p className="text-[#64748B] font-mono-tabular break-all">
                  <span className="font-semibold text-[#0F172A]">{t.admin.uidLabel}:</span>{' '}
                  {user.uid}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void signOutAdmin()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1428] hover:bg-[#142B4D] rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>{t.admin.signOut}</span>
              </button>
            </div>
          )}

          {/* Authorized Admin Dashboard */}
          {authReady && adminCheckReady && user && isAdmin && (
            <div className="space-y-6">
              {/* Account & Firestore Seed Banner */}
              <div className="liquid-glass-light rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#2563EB]">
                      <Database className="w-3.5 h-3.5" aria-hidden="true" />
                      {hasUnseededCollections ? t.admin.seedBannerTitle : t.admin.seedSyncedTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {t.admin.signedInAs}: <strong className="text-[#0F172A]">{user.email}</strong>
                    </span>
                  </div>
                  <p className="text-sm text-[#64748B] max-w-2xl">
                    {hasUnseededCollections
                      ? t.admin.seedBannerDescription
                      : t.admin.seedSyncedDescription}
                  </p>
                  <p className="text-xs text-[#64748B] font-mono-tabular">
                    Home: {firestoreSyncedCounts.siteSettings} · Divisi: {firestoreSyncedCounts.divisions}{' '}
                    · Layanan: {firestoreSyncedCounts.services} · Produk: {firestoreSyncedCounts.products}{' '}
                    · Proyek: {firestoreSyncedCounts.projects} · Wawasan: {firestoreSyncedCounts.articles}{' '}
                    · Pesan: {contactMessages.length}
                  </p>
                </div>

                {hasUnseededCollections && (
                  <button
                    type="button"
                    onClick={() => void handleSeedData()}
                    disabled={busyAction}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors cursor-pointer disabled:opacity-60 shrink-0 shadow-sm"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${busyAction ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    <span>{busyAction ? t.admin.seedingButton : t.admin.seedButton}</span>
                  </button>
                )}
              </div>

              {statusMessage && (
                <div
                  role="status"
                  className={`rounded-2xl border backdrop-blur-md px-4 py-3 text-sm flex items-center justify-between gap-3 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                      : 'bg-red-50/90 border-red-200 text-red-800'
                  }`}
                >
                  <span>{statusMessage.text}</span>
                  <button
                    type="button"
                    onClick={() => setStatusMessage(null)}
                    className="text-xs font-semibold underline cursor-pointer"
                  >
                    {t.admin.cancelButton}
                  </button>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="liquid-glass-control rounded-2xl p-1.5 overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max">
                  {(
                    [
                      {id: 'home', label: t.admin.tabs.home, icon: LayoutDashboard},
                      {id: 'media', label: t.admin.tabs.media, icon: ImageIcon},
                      {id: 'projects', label: t.admin.tabs.projects, icon: FolderKanban},
                      {id: 'products', label: t.admin.tabs.products, icon: Package},
                      {id: 'insights', label: t.admin.tabs.insights, icon: Newspaper},
                      {id: 'divisions', label: t.admin.tabs.divisionsServices, icon: Layers},
                      {
                        id: 'messages',
                        label:
                          contactMessages.filter((m) => m.status === 'new').length > 0
                            ? `${t.admin.tabs.messages} (${contactMessages.filter((m) => m.status === 'new').length})`
                            : t.admin.tabs.messages,
                        icon: Mail,
                      },
                      {id: 'admins', label: t.admin.tabs.admins, icon: Users},
                    ] as const
                  ).map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setConfirmDeleteKey(null);
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-[#0B1428] text-white shadow-sm'
                            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TAB 1: HOME & FEATURED */}
              {activeTab === 'home' && (
                <div className="space-y-8">
                  <form
                    onSubmit={(e) => void handleSaveHomeSettings(e)}
                    className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
                      <h2 className="font-display text-xl font-bold text-[#0F172A]">
                        {t.admin.homeForm.sectionCopyTitle}
                      </h2>
                      <button
                        type="submit"
                        disabled={busyAction}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>{busyAction ? t.admin.savingButton : t.admin.saveButton}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.heroEyebrowId}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.heroEyebrowId}
                          onChange={(e) => setHomeDraft({...homeDraft, heroEyebrowId: e.target.value})}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.heroEyebrowEn}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.heroEyebrowEn}
                          onChange={(e) => setHomeDraft({...homeDraft, heroEyebrowEn: e.target.value})}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.heroHeadlineId}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.heroHeadlineId}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, heroHeadlineId: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.heroHeadlineEn}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.heroHeadlineEn}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, heroHeadlineEn: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.heroDescriptionId}</label>
                        <textarea
                          rows={2}
                          required
                          value={homeDraft.heroDescriptionId}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, heroDescriptionId: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.heroDescriptionEn}</label>
                        <textarea
                          rows={2}
                          required
                          value={homeDraft.heroDescriptionEn}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, heroDescriptionEn: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.introTitleId}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.introTitleId}
                          onChange={(e) => setHomeDraft({...homeDraft, introTitleId: e.target.value})}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.introTitleEn}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.introTitleEn}
                          onChange={(e) => setHomeDraft({...homeDraft, introTitleEn: e.target.value})}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.introParagraph1Id}</label>
                        <textarea
                          rows={3}
                          required
                          value={homeDraft.introParagraph1Id}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, introParagraph1Id: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.introParagraph1En}</label>
                        <textarea
                          rows={3}
                          required
                          value={homeDraft.introParagraph1En}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, introParagraph1En: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.introParagraph2Id}</label>
                        <textarea
                          rows={3}
                          required
                          value={homeDraft.introParagraph2Id}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, introParagraph2Id: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.introParagraph2En}</label>
                        <textarea
                          rows={3}
                          required
                          value={homeDraft.introParagraph2En}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, introParagraph2En: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.ctaHeadlineId}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.ctaHeadlineId}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, ctaHeadlineId: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.ctaHeadlineEn}</label>
                        <input
                          type="text"
                          required
                          value={homeDraft.ctaHeadlineEn}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, ctaHeadlineEn: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>{t.admin.homeForm.ctaDescriptionId}</label>
                        <textarea
                          rows={2}
                          required
                          value={homeDraft.ctaDescriptionId}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, ctaDescriptionId: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{t.admin.homeForm.ctaDescriptionEn}</label>
                        <textarea
                          rows={2}
                          required
                          value={homeDraft.ctaDescriptionEn}
                          onChange={(e) =>
                            setHomeDraft({...homeDraft, ctaDescriptionEn: e.target.value})
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </form>

                  {/* Featured Sections Manager */}
                  <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#0F172A]">
                        {t.admin.homeForm.featuredManagerTitle}
                      </h2>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {t.admin.homeForm.featuredManagerDesc}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Featured Projects */}
                      <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {t.admin.homeForm.featuredProjects}
                        </h3>
                        <ul className="divide-y divide-slate-100">
                          {projects.map((proj) => (
                            <li
                              key={proj.id}
                              className="py-2.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#0F172A] truncate">
                                  {localize(proj.title)}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  {localize(proj.categoryLabel)} · {proj.year}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={busyAction}
                                onClick={() => void toggleProjectFeatured(proj)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 ${
                                  proj.featured
                                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                    : 'bg-white border-slate-200 text-[#64748B] hover:text-[#0F172A]'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>
                                  {proj.featured
                                    ? t.admin.featuredBadge
                                    : t.admin.notFeaturedLabel}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Featured Products */}
                      <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {t.admin.homeForm.featuredProducts}
                        </h3>
                        <ul className="divide-y divide-slate-100">
                          {products.map((prod) => (
                            <li
                              key={prod.id}
                              className="py-2.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#0F172A] truncate">
                                  {prod.name}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  {localize(prod.categoryLabel)}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={busyAction}
                                onClick={() => void toggleProductFeatured(prod)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 ${
                                  prod.featured
                                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                    : 'bg-white border-slate-200 text-[#64748B] hover:text-[#0F172A]'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>
                                  {prod.featured
                                    ? t.admin.featuredBadge
                                    : t.admin.notFeaturedLabel}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Featured Services */}
                      <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {t.admin.homeForm.featuredServices}
                        </h3>
                        <ul className="divide-y divide-slate-100">
                          {services.map((svc) => (
                            <li
                              key={svc.id}
                              className="py-2.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#0F172A] truncate">
                                  {svc.number} · {localize(svc.name)}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={busyAction}
                                onClick={() => void toggleServiceFeatured(svc)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 ${
                                  svc.featured
                                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                    : 'bg-white border-slate-200 text-[#64748B] hover:text-[#0F172A]'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>
                                  {svc.featured
                                    ? t.admin.featuredBadge
                                    : t.admin.notFeaturedLabel}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Featured Insights */}
                      <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          {t.admin.homeForm.featuredInsights}
                        </h3>
                        <ul className="divide-y divide-slate-100">
                          {articles.map((art) => (
                            <li
                              key={art.id}
                              className="py-2.5 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#0F172A] truncate">
                                  {localize(art.title)}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                  {localize(art.categoryLabel)}
                                </p>
                              </div>
                              <button
                                type="button"
                                disabled={busyAction}
                                onClick={() => void toggleArticleFeatured(art)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 ${
                                  art.featured
                                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                                    : 'bg-white border-slate-200 text-[#64748B] hover:text-[#0F172A]'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>
                                  {art.featured
                                    ? t.admin.featuredBadge
                                    : t.admin.notFeaturedLabel}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1B: SITE IMAGES & MEDIA */}
              {activeTab === 'media' && (
                <div className="space-y-8">
                  {/* Global Logo & Hero Showcase */}
                  <form
                    onSubmit={(e) => void handleSaveHomeSettings(e)}
                    className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {t.admin.mediaTab.globalTitle}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-[#64748B] max-w-2xl">
                          {t.admin.mediaTab.globalSubtitle}
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={busyAction}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors cursor-pointer disabled:opacity-60 shadow-sm shrink-0"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {busyAction
                            ? t.admin.savingButton
                            : t.admin.mediaTab.saveGlobalButton}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ImagePickerField
                        label={t.admin.mediaTab.brandLogoLabel}
                        value={homeDraft.brandLogoUrl}
                        onChange={(next) =>
                          setHomeDraft({...homeDraft, brandLogoUrl: next})
                        }
                        defaultValue={DEFAULT_BRAND_LOGO_URL}
                        language={language}
                        maxDimension={420}
                        maxChars={90000}
                        aspectClass="aspect-square max-w-[180px] mx-auto"
                        previewFit="contain"
                        helperText={t.admin.mediaTab.brandLogoHelper}
                        labels={t.admin.imagePicker}
                      />

                      <ImagePickerField
                        label={t.admin.mediaTab.heroImageLabel}
                        value={homeDraft.heroImageUrl}
                        onChange={(next) =>
                          setHomeDraft({...homeDraft, heroImageUrl: next})
                        }
                        defaultValue={DEFAULT_HERO_IMAGE_URL}
                        language={language}
                        maxDimension={1080}
                        maxChars={220000}
                        aspectClass="aspect-[16/10]"
                        helperText={t.admin.mediaTab.heroImageHelper}
                        labels={t.admin.imagePicker}
                      />
                    </div>
                  </form>

                  {/* Projects Photos */}
                  <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                    <h2 className="font-display text-xl font-bold text-[#0F172A]">
                      {t.admin.mediaTab.projectsSectionTitle} ({projects.length})
                    </h2>
                    {projects.length === 0 ? (
                      <p className="text-sm text-[#64748B]">{t.admin.mediaTab.emptyItems}</p>
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        {projects.map((proj) => {
                          const draftKey = `proj:${proj.id}`;
                          const currentVal = getMediaDraft(draftKey, proj.image);
                          const isDirty = currentVal !== proj.image;
                          return (
                            <div
                              key={proj.id}
                              className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 sm:p-5 space-y-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#2563EB]">
                                    {localize(proj.categoryLabel)} · {proj.year}
                                  </p>
                                  <p className="font-display text-base font-bold text-[#0F172A] truncate">
                                    {localize(proj.title)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={busyAction || !isDirty}
                                  onClick={() => void handleSaveProjectImage(proj)}
                                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 ${
                                    isDirty
                                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-sm'
                                      : 'bg-slate-200/70 text-[#64748B] cursor-not-allowed'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>{t.admin.mediaTab.saveItemPhotoButton}</span>
                                </button>
                              </div>
                              <ImagePickerField
                                label={t.admin.fields.image}
                                value={currentVal}
                                onChange={(next) => setMediaDraft(draftKey, next)}
                                language={language}
                                labels={t.admin.imagePicker}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Digital Products Photos */}
                  <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                    <h2 className="font-display text-xl font-bold text-[#0F172A]">
                      {t.admin.mediaTab.productsSectionTitle} ({products.length})
                    </h2>
                    {products.length === 0 ? (
                      <p className="text-sm text-[#64748B]">{t.admin.mediaTab.emptyItems}</p>
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        {products.map((prod) => {
                          const draftKey = `prod:${prod.id}`;
                          const currentVal = getMediaDraft(draftKey, prod.image);
                          const isDirty = currentVal !== prod.image;
                          return (
                            <div
                              key={prod.id}
                              className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 sm:p-5 space-y-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#2563EB]">
                                    {localize(prod.categoryLabel)}
                                  </p>
                                  <p className="font-display text-base font-bold text-[#0F172A] truncate">
                                    {prod.name}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={busyAction || !isDirty}
                                  onClick={() => void handleSaveProductImage(prod)}
                                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 ${
                                    isDirty
                                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-sm'
                                      : 'bg-slate-200/70 text-[#64748B] cursor-not-allowed'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>{t.admin.mediaTab.saveItemPhotoButton}</span>
                                </button>
                              </div>
                              <ImagePickerField
                                label={t.admin.fields.image}
                                value={currentVal}
                                onChange={(next) => setMediaDraft(draftKey, next)}
                                language={language}
                                labels={t.admin.imagePicker}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Insights Article Cover Photos */}
                  <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                    <h2 className="font-display text-xl font-bold text-[#0F172A]">
                      {t.admin.mediaTab.insightsSectionTitle} ({articles.length})
                    </h2>
                    {articles.length === 0 ? (
                      <p className="text-sm text-[#64748B]">{t.admin.mediaTab.emptyItems}</p>
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        {articles.map((art) => {
                          const draftKey = `art:${art.id}`;
                          const currentVal = getMediaDraft(draftKey, art.image);
                          const isDirty = currentVal !== art.image;
                          return (
                            <div
                              key={art.id}
                              className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 sm:p-5 space-y-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#2563EB]">
                                    {localize(art.categoryLabel)}
                                  </p>
                                  <p className="font-display text-base font-bold text-[#0F172A] truncate">
                                    {localize(art.title)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={busyAction || !isDirty}
                                  onClick={() => void handleSaveArticleImage(art)}
                                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors shrink-0 ${
                                    isDirty
                                      ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-sm'
                                      : 'bg-slate-200/70 text-[#64748B] cursor-not-allowed'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>{t.admin.mediaTab.saveItemPhotoButton}</span>
                                </button>
                              </div>
                              <ImagePickerField
                                label={t.admin.fields.image}
                                value={currentVal}
                                onChange={(next) => setMediaDraft(draftKey, next)}
                                language={language}
                                labels={t.admin.imagePicker}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {editingProject ? (
                    <form
                      onSubmit={(e) => void handleSaveProject(e)}
                      className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {isNewProject ? t.admin.createNewButton : t.admin.editButton}:{' '}
                          {localize(editingProject.title) || editingProject.slug}
                        </h2>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg hover:text-[#0F172A] cursor-pointer"
                          >
                            {t.admin.cancelButton}
                          </button>
                          <button
                            type="submit"
                            disabled={busyAction}
                            className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer disabled:opacity-60"
                          >
                            {busyAction ? t.admin.savingButton : t.admin.saveButton}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>{t.admin.fields.titleId}</label>
                          <input
                            type="text"
                            required
                            value={editingProject.title.id}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                title: {...editingProject.title, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.titleEn}</label>
                          <input
                            type="text"
                            required
                            value={editingProject.title.en}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                title: {...editingProject.title, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.slug}</label>
                          <input
                            type="text"
                            required
                            value={editingProject.slug}
                            onChange={(e) =>
                              setEditingProject({...editingProject, slug: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.category}</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) => {
                              const cat = e.target.value as ProjectCategory;
                              setEditingProject({
                                ...editingProject,
                                category: cat,
                                categoryLabel: PROJECT_CATEGORY_MAP[cat],
                              });
                            }}
                            className={inputClass}
                          >
                            {(Object.keys(PROJECT_CATEGORY_MAP) as ProjectCategory[]).map((cat) => (
                              <option key={cat} value={cat}>
                                {language === 'id'
                                  ? PROJECT_CATEGORY_MAP[cat].id
                                  : PROJECT_CATEGORY_MAP[cat].en}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.division}</label>
                          <select
                            value={editingProject.divisionId}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                divisionId: e.target.value as ProjectItem['divisionId'],
                              })
                            }
                            className={inputClass}
                          >
                            {divisions.map((div) => (
                              <option key={div.id} value={div.id}>
                                {div.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.year}</label>
                          <input
                            type="text"
                            required
                            value={editingProject.year}
                            onChange={(e) =>
                              setEditingProject({...editingProject, year: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.statusId}</label>
                          <input
                            type="text"
                            required
                            value={editingProject.status.id}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                status: {...editingProject.status, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.statusEn}</label>
                          <input
                            type="text"
                            required
                            value={editingProject.status.en}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                status: {...editingProject.status, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <ImagePickerField
                            label={t.admin.fields.image}
                            value={editingProject.image}
                            onChange={(next) =>
                              setEditingProject({...editingProject, image: next})
                            }
                            defaultValue={PRESET_IMAGE_ASSETS[2].value}
                            language={language}
                            labels={t.admin.imagePicker}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescId}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingProject.shortDescription.id}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                shortDescription: {
                                  ...editingProject.shortDescription,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescEn}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingProject.shortDescription.en}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                shortDescription: {
                                  ...editingProject.shortDescription,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.overviewId}</label>
                          <textarea
                            rows={4}
                            required
                            value={editingProject.overview.id}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                overview: {...editingProject.overview, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.overviewEn}</label>
                          <textarea
                            rows={4}
                            required
                            value={editingProject.overview.en}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                overview: {...editingProject.overview, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.archNotesId}</label>
                          <textarea
                            rows={3}
                            required
                            value={editingProject.architectureNotes.id}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                architectureNotes: {
                                  ...editingProject.architectureNotes,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.archNotesEn}</label>
                          <textarea
                            rows={3}
                            required
                            value={editingProject.architectureNotes.en}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                architectureNotes: {
                                  ...editingProject.architectureNotes,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.technologies}</label>
                          <input
                            type="text"
                            value={projectTechText}
                            onChange={(e) => setProjectTechText(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.sortOrder}</label>
                          <input
                            type="number"
                            min={0}
                            max={1000}
                            value={editingProject.sortOrder ?? 0}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                sortOrder: Number(e.target.value) || 0,
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingProject.featured)}
                              onChange={(e) =>
                                setEditingProject({...editingProject, featured: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isFeatured}</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingProject.isDemo)}
                              onChange={(e) =>
                                setEditingProject({...editingProject, isDemo: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isDemo}</span>
                          </label>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {t.admin.tabs.projects} ({projects.length})
                        </h2>
                        <button
                          type="button"
                          onClick={() => startEditProject(createEmptyProject(), true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                          <span>{t.admin.createNewButton}</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-200/70">
                        {projects.map((proj) => {
                          const delKey = `proj-${proj.id}`;
                          return (
                            <div
                              key={proj.id}
                              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-16 h-11 rounded-lg overflow-hidden bg-[#0B1428] shrink-0 border border-slate-200/80">
                                  <SafeImage
                                    src={proj.image}
                                    alt={localize(proj.imageAlt)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-1">
                                    <span className="font-semibold text-[#2563EB]">
                                      {proj.featured ? t.admin.featuredBadge : t.admin.notFeaturedLabel}
                                    </span>
                                    <span>·</span>
                                    <span>{localize(proj.categoryLabel)}</span>
                                    <span>·</span>
                                    <span className="font-mono-tabular">{proj.year}</span>
                                    {proj.isDemo && (
                                      <>
                                        <span>·</span>
                                        <span>{t.common.demoLabel}</span>
                                      </>
                                    )}
                                  </div>
                                  <p className="font-display text-base font-bold text-[#0F172A] truncate">
                                    {localize(proj.title)}
                                  </p>
                                  <p className="text-xs text-[#64748B] line-clamp-1">
                                    {localize(proj.shortDescription)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditProject(proj, false)}
                                  className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-slate-200 rounded-lg cursor-pointer"
                                >
                                  {t.admin.editButton}
                                </button>
                                {confirmDeleteKey === delKey ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmDeleteKey(null);
                                        void deleteProject(proj.id).then(() =>
                                          notify('success', t.admin.deleteSuccess)
                                        );
                                      }}
                                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.confirmDeleteButton}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(null)}
                                      className="px-3 py-1.5 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.cancelButton}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteKey(delKey)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{t.admin.deleteButton}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DIGITAL PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  {editingProduct ? (
                    <form
                      onSubmit={(e) => void handleSaveProduct(e)}
                      className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {isNewProduct ? t.admin.createNewButton : t.admin.editButton}:{' '}
                          {editingProduct.name || editingProduct.slug}
                        </h2>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                          >
                            {t.admin.cancelButton}
                          </button>
                          <button
                            type="submit"
                            disabled={busyAction}
                            className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer disabled:opacity-60"
                          >
                            {busyAction ? t.admin.savingButton : t.admin.saveButton}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>{t.admin.fields.name}</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.name}
                            onChange={(e) =>
                              setEditingProduct({...editingProduct, name: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.slug}</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.slug}
                            onChange={(e) =>
                              setEditingProduct({...editingProduct, slug: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.category}</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => {
                              const cat = e.target.value as ProductCategory;
                              setEditingProduct({
                                ...editingProduct,
                                category: cat,
                                categoryLabel: PRODUCT_CATEGORY_MAP[cat],
                              });
                            }}
                            className={inputClass}
                          >
                            {(Object.keys(PRODUCT_CATEGORY_MAP) as ProductCategory[]).map((cat) => (
                              <option key={cat} value={cat}>
                                {language === 'id'
                                  ? PRODUCT_CATEGORY_MAP[cat].id
                                  : PRODUCT_CATEGORY_MAP[cat].en}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.sortOrder}</label>
                          <input
                            type="number"
                            min={0}
                            max={1000}
                            value={editingProduct.sortOrder ?? 0}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                sortOrder: Number(e.target.value) || 0,
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.statusId}</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.status.id}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                status: {...editingProduct.status, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.statusEn}</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.status.en}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                status: {...editingProduct.status, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <ImagePickerField
                            label={t.admin.fields.image}
                            value={editingProduct.image}
                            onChange={(next) =>
                              setEditingProduct({...editingProduct, image: next})
                            }
                            defaultValue={PRESET_IMAGE_ASSETS[2].value}
                            language={language}
                            labels={t.admin.imagePicker}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescId}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingProduct.shortDescription.id}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                shortDescription: {
                                  ...editingProduct.shortDescription,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescEn}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingProduct.shortDescription.en}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                shortDescription: {
                                  ...editingProduct.shortDescription,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.overviewId}</label>
                          <textarea
                            rows={4}
                            required
                            value={editingProduct.fullDescription.id}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                fullDescription: {
                                  ...editingProduct.fullDescription,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.overviewEn}</label>
                          <textarea
                            rows={4}
                            required
                            value={editingProduct.fullDescription.en}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                fullDescription: {
                                  ...editingProduct.fullDescription,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.capabilitiesId}</label>
                          <textarea
                            rows={4}
                            value={productCapIdText}
                            onChange={(e) => setProductCapIdText(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.capabilitiesEn}</label>
                          <textarea
                            rows={4}
                            value={productCapEnText}
                            onChange={(e) => setProductCapEnText(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingProduct.featured)}
                              onChange={(e) =>
                                setEditingProduct({...editingProduct, featured: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isFeatured}</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingProduct.isDemo)}
                              onChange={(e) =>
                                setEditingProduct({...editingProduct, isDemo: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isDemo}</span>
                          </label>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {t.admin.tabs.products} ({products.length})
                        </h2>
                        <button
                          type="button"
                          onClick={() => startEditProduct(createEmptyProduct(), true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                          <span>{t.admin.createNewButton}</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-200/70">
                        {products.map((prod) => {
                          const delKey = `prod-${prod.id}`;
                          return (
                            <div
                              key={prod.id}
                              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-16 h-11 rounded-lg overflow-hidden bg-[#0B1428] shrink-0 border border-slate-200/80">
                                  <SafeImage
                                    src={prod.image}
                                    alt={localize(prod.imageAlt)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-1">
                                    <span className="font-semibold text-[#2563EB]">
                                      {prod.featured ? t.admin.featuredBadge : t.admin.notFeaturedLabel}
                                    </span>
                                    <span>·</span>
                                    <span>{localize(prod.categoryLabel)}</span>
                                    <span>·</span>
                                    <span>{localize(prod.status)}</span>
                                  </div>
                                  <p className="font-display text-base font-bold text-[#0F172A] truncate">
                                    {prod.name}
                                  </p>
                                  <p className="text-xs text-[#64748B] line-clamp-1">
                                    {localize(prod.shortDescription)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditProduct(prod, false)}
                                  className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-slate-200 rounded-lg cursor-pointer"
                                >
                                  {t.admin.editButton}
                                </button>
                                {confirmDeleteKey === delKey ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmDeleteKey(null);
                                        void deleteProduct(prod.id).then(() =>
                                          notify('success', t.admin.deleteSuccess)
                                        );
                                      }}
                                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.confirmDeleteButton}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(null)}
                                      className="px-3 py-1.5 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.cancelButton}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteKey(delKey)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{t.admin.deleteButton}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: INSIGHTS */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {editingArticle ? (
                    <form
                      onSubmit={(e) => void handleSaveArticle(e)}
                      className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {isNewArticle ? t.admin.createNewButton : t.admin.editButton}:{' '}
                          {localize(editingArticle.title) || editingArticle.slug}
                        </h2>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setEditingArticle(null)}
                            className="px-4 py-2 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                          >
                            {t.admin.cancelButton}
                          </button>
                          <button
                            type="submit"
                            disabled={busyAction}
                            className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer disabled:opacity-60"
                          >
                            {busyAction ? t.admin.savingButton : t.admin.saveButton}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>{t.admin.fields.titleId}</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.title.id}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                title: {...editingArticle.title, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.titleEn}</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.title.en}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                title: {...editingArticle.title, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.slug}</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.slug}
                            onChange={(e) =>
                              setEditingArticle({...editingArticle, slug: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.category}</label>
                          <select
                            value={editingArticle.category}
                            onChange={(e) => {
                              const cat = e.target.value as ArticleCategory;
                              setEditingArticle({
                                ...editingArticle,
                                category: cat,
                                categoryLabel: ARTICLE_CATEGORY_MAP[cat],
                              });
                            }}
                            className={inputClass}
                          >
                            {(Object.keys(ARTICLE_CATEGORY_MAP) as ArticleCategory[]).map((cat) => (
                              <option key={cat} value={cat}>
                                {language === 'id'
                                  ? ARTICLE_CATEGORY_MAP[cat].id
                                  : ARTICLE_CATEGORY_MAP[cat].en}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.publishedAt}</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.publishedAt}
                            onChange={(e) =>
                              setEditingArticle({...editingArticle, publishedAt: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>{t.admin.fields.readingMinutes}</label>
                            <input
                              type="number"
                              min={1}
                              max={120}
                              value={editingArticle.readingMinutes}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  readingMinutes: Number(e.target.value) || 3,
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>{t.admin.fields.author}</label>
                            <input
                              type="text"
                              required
                              value={editingArticle.author}
                              onChange={(e) =>
                                setEditingArticle({...editingArticle, author: e.target.value})
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.publishedLabelId}</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.publishedLabel.id}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                publishedLabel: {
                                  ...editingArticle.publishedLabel,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.publishedLabelEn}</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.publishedLabel.en}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                publishedLabel: {
                                  ...editingArticle.publishedLabel,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <ImagePickerField
                            label={t.admin.fields.image}
                            value={editingArticle.image}
                            onChange={(next) =>
                              setEditingArticle({...editingArticle, image: next})
                            }
                            defaultValue={PRESET_IMAGE_ASSETS[5].value}
                            language={language}
                            labels={t.admin.imagePicker}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.excerptId}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingArticle.excerpt.id}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                excerpt: {...editingArticle.excerpt, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.excerptEn}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingArticle.excerpt.en}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                excerpt: {...editingArticle.excerpt, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.sectionHeadingId}</label>
                          <input
                            type="text"
                            required
                            value={articleHeadingId}
                            onChange={(e) => setArticleHeadingId(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.sectionHeadingEn}</label>
                          <input
                            type="text"
                            required
                            value={articleHeadingEn}
                            onChange={(e) => setArticleHeadingEn(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.sectionBodyId}</label>
                          <textarea
                            rows={6}
                            required
                            value={articleBodyId}
                            onChange={(e) => setArticleBodyId(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.sectionBodyEn}</label>
                          <textarea
                            rows={6}
                            required
                            value={articleBodyEn}
                            onChange={(e) => setArticleBodyEn(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingArticle.featured)}
                              onChange={(e) =>
                                setEditingArticle({...editingArticle, featured: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isFeatured}</span>
                          </label>
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingArticle.isDemo)}
                              onChange={(e) =>
                                setEditingArticle({...editingArticle, isDemo: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isDemo}</span>
                          </label>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {t.admin.tabs.insights} ({articles.length})
                        </h2>
                        <button
                          type="button"
                          onClick={() => startEditArticle(createEmptyArticle(), true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                          <span>{t.admin.createNewButton}</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-200/70">
                        {articles.map((art) => {
                          const delKey = `art-${art.id}`;
                          return (
                            <div
                              key={art.id}
                              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="w-16 h-11 rounded-lg overflow-hidden bg-[#0B1428] shrink-0 border border-slate-200/80">
                                  <SafeImage
                                    src={art.image}
                                    alt={localize(art.imageAlt)}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-1">
                                    <span className="font-semibold text-[#2563EB]">
                                      {art.featured ? t.admin.featuredBadge : t.admin.notFeaturedLabel}
                                    </span>
                                    <span>·</span>
                                    <span>{localize(art.categoryLabel)}</span>
                                    <span>·</span>
                                    <span>{localize(art.publishedLabel)}</span>
                                  </div>
                                  <p className="font-display text-base font-bold text-[#0F172A] truncate">
                                    {localize(art.title)}
                                  </p>
                                  <p className="text-xs text-[#64748B] line-clamp-1">
                                    {localize(art.excerpt)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditArticle(art, false)}
                                  className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-slate-200 rounded-lg cursor-pointer"
                                >
                                  {t.admin.editButton}
                                </button>
                                {confirmDeleteKey === delKey ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmDeleteKey(null);
                                        void deleteArticle(art.id).then(() =>
                                          notify('success', t.admin.deleteSuccess)
                                        );
                                      }}
                                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.confirmDeleteButton}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(null)}
                                      className="px-3 py-1.5 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.cancelButton}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteKey(delKey)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{t.admin.deleteButton}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: DIVISIONS & SERVICES */}
              {activeTab === 'divisions' && (
                <div className="space-y-8">
                  {/* Divisions Editor / List */}
                  {editingDivision ? (
                    <form
                      onSubmit={(e) => void handleSaveDivision(e)}
                      className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {t.admin.editButton}: {editingDivision.name}
                        </h2>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setEditingDivision(null)}
                            className="px-4 py-2 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                          >
                            {t.admin.cancelButton}
                          </button>
                          <button
                            type="submit"
                            disabled={busyAction}
                            className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer disabled:opacity-60"
                          >
                            {busyAction ? t.admin.savingButton : t.admin.saveButton}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>{t.admin.fields.name}</label>
                          <input
                            type="text"
                            required
                            value={editingDivision.name}
                            onChange={(e) =>
                              setEditingDivision({...editingDivision, name: e.target.value})
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.icon}</label>
                          <select
                            value={editingDivision.icon}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                icon: e.target.value as DivisionIconName,
                              })
                            }
                            className={inputClass}
                          >
                            {DIVISION_ICONS.map((ic) => (
                              <option key={ic} value={ic}>
                                {ic}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.shortLabelId}</label>
                          <input
                            type="text"
                            required
                            value={editingDivision.shortLabel.id}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                shortLabel: {...editingDivision.shortLabel, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.shortLabelEn}</label>
                          <input
                            type="text"
                            required
                            value={editingDivision.shortLabel.en}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                shortLabel: {...editingDivision.shortLabel, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescId}</label>
                          <textarea
                            rows={3}
                            required
                            value={editingDivision.description.id}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                description: {...editingDivision.description, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescEn}</label>
                          <textarea
                            rows={3}
                            required
                            value={editingDivision.description.en}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                description: {...editingDivision.description, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.overviewId}</label>
                          <textarea
                            rows={3}
                            required
                            value={editingDivision.extendedOverview.id}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                extendedOverview: {
                                  ...editingDivision.extendedOverview,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.overviewEn}</label>
                          <textarea
                            rows={3}
                            required
                            value={editingDivision.extendedOverview.en}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                extendedOverview: {
                                  ...editingDivision.extendedOverview,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.methodologyId}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingDivision.methodology.id}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                methodology: {...editingDivision.methodology, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.methodologyEn}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingDivision.methodology.en}
                            onChange={(e) =>
                              setEditingDivision({
                                ...editingDivision,
                                methodology: {...editingDivision.methodology, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.focusAreasId}</label>
                          <textarea
                            rows={4}
                            value={divFocusIdText}
                            onChange={(e) => setDivFocusIdText(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.focusAreasEn}</label>
                          <textarea
                            rows={4}
                            value={divFocusEnText}
                            onChange={(e) => setDivFocusEnText(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-4">
                      <h2 className="font-display text-xl font-bold text-[#0F172A]">
                        {t.nav.divisions} ({divisions.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {divisions.map((div) => (
                          <div
                            key={div.id}
                            className="border border-slate-200/80 bg-white/60 rounded-xl p-4 flex items-start justify-between gap-4"
                          >
                            <div>
                              <p className="font-display text-base font-bold text-[#0F172A]">
                                {div.name}
                              </p>
                              <p className="text-xs text-[#2563EB] mt-0.5">
                                {localize(div.shortLabel)}
                              </p>
                              <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                                {localize(div.description)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => startEditDivision(div)}
                              className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-slate-200 rounded-lg cursor-pointer shrink-0"
                            >
                              {t.admin.editButton}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Editor / List */}
                  {editingService ? (
                    <form
                      onSubmit={(e) => void handleSaveService(e)}
                      className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {isNewService ? t.admin.createNewButton : t.admin.editButton}:{' '}
                          {localize(editingService.name) || editingService.id}
                        </h2>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setEditingService(null)}
                            className="px-4 py-2 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                          >
                            {t.admin.cancelButton}
                          </button>
                          <button
                            type="submit"
                            disabled={busyAction}
                            className="px-5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer disabled:opacity-60"
                          >
                            {busyAction ? t.admin.savingButton : t.admin.saveButton}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={labelClass}>{t.admin.fields.nameId}</label>
                          <input
                            type="text"
                            required
                            value={editingService.name.id}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                name: {...editingService.name, id: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.nameEn}</label>
                          <input
                            type="text"
                            required
                            value={editingService.name.en}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                name: {...editingService.name, en: e.target.value},
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.division}</label>
                          <select
                            value={editingService.divisionId}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                divisionId: e.target.value as ServiceItem['divisionId'],
                              })
                            }
                            className={inputClass}
                          >
                            {divisions.map((div) => (
                              <option key={div.id} value={div.id}>
                                {div.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className={labelClass}>{t.admin.fields.number}</label>
                            <input
                              type="text"
                              required
                              value={editingService.number}
                              onChange={(e) =>
                                setEditingService({...editingService, number: e.target.value})
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>{t.admin.fields.icon}</label>
                            <select
                              value={editingService.icon}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  icon: e.target.value as ServiceIconName,
                                })
                              }
                              className={inputClass}
                            >
                              {SERVICE_ICONS.map((ic) => (
                                <option key={ic} value={ic}>
                                  {ic}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>{t.admin.fields.sortOrder}</label>
                            <input
                              type="number"
                              min={0}
                              max={1000}
                              value={editingService.sortOrder ?? 0}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  sortOrder: Number(e.target.value) || 0,
                                })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescId}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingService.shortDescription.id}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                shortDescription: {
                                  ...editingService.shortDescription,
                                  id: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.shortDescEn}</label>
                          <textarea
                            rows={2}
                            required
                            value={editingService.shortDescription.en}
                            onChange={(e) =>
                              setEditingService({
                                ...editingService,
                                shortDescription: {
                                  ...editingService.shortDescription,
                                  en: e.target.value,
                                },
                              })
                            }
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>{t.admin.fields.scopeDetailsId}</label>
                          <textarea
                            rows={4}
                            value={serviceScopeIdText}
                            onChange={(e) => setServiceScopeIdText(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>{t.admin.fields.scopeDetailsEn}</label>
                          <textarea
                            rows={4}
                            value={serviceScopeEnText}
                            onChange={(e) => setServiceScopeEnText(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div className="md:col-span-2 pt-2">
                          <label className="inline-flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(editingService.featured)}
                              onChange={(e) =>
                                setEditingService({...editingService, featured: e.target.checked})
                              }
                              className="w-4 h-4 rounded border-slate-300 text-[#2563EB]"
                            />
                            <span>{t.admin.fields.isFeatured}</span>
                          </label>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="font-display text-xl font-bold text-[#0F172A]">
                          {t.nav.services} ({services.length})
                        </h2>
                        <button
                          type="button"
                          onClick={() => startEditService(createEmptyService(), true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                          <span>{t.admin.createNewButton}</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-200/70">
                        {services.map((svc) => {
                          const delKey = `svc-${svc.id}`;
                          return (
                            <div
                              key={svc.id}
                              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-0.5">
                                  <span className="font-mono-tabular font-semibold text-[#0F172A]">
                                    {svc.number}
                                  </span>
                                  <span>·</span>
                                  <span className="font-semibold text-[#2563EB]">
                                    {svc.featured
                                      ? t.admin.featuredBadge
                                      : t.admin.notFeaturedLabel}
                                  </span>
                                </div>
                                <p className="font-display text-sm sm:text-base font-bold text-[#0F172A]">
                                  {localize(svc.name)}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditService(svc, false)}
                                  className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] hover:bg-slate-200 rounded-lg cursor-pointer"
                                >
                                  {t.admin.editButton}
                                </button>
                                {confirmDeleteKey === delKey ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmDeleteKey(null);
                                        void deleteService(svc.id).then(() =>
                                          notify('success', t.admin.deleteSuccess)
                                        );
                                      }}
                                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.confirmDeleteButton}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(null)}
                                      className="px-3 py-1.5 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                                    >
                                      {t.admin.cancelButton}
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteKey(delKey)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{t.admin.deleteButton}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: INBOX MESSAGES */}
              {activeTab === 'messages' && (
                <div className="liquid-glass-light rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#0F172A]">
                        {t.admin.messagesTab.title} ({contactMessages.length})
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                        {t.admin.messagesTab.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {(
                        [
                          {id: 'all', label: t.admin.messagesTab.filterAll},
                          {id: 'new', label: t.admin.messagesTab.statusLabels.new},
                          {id: 'read', label: t.admin.messagesTab.statusLabels.read},
                          {id: 'replied', label: t.admin.messagesTab.statusLabels.replied},
                          {id: 'archived', label: t.admin.messagesTab.statusLabels.archived},
                        ] as const
                      ).map((flt) => (
                        <button
                          key={flt.id}
                          type="button"
                          onClick={() => setMessageStatusFilter(flt.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            messageStatusFilter === flt.id
                              ? 'bg-[#0B1428] text-white'
                              : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                          }`}
                        >
                          {flt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const filteredMessages =
                      messageStatusFilter === 'all'
                        ? contactMessages
                        : contactMessages.filter((item) => item.status === messageStatusFilter);

                    if (filteredMessages.length === 0) {
                      return (
                        <div className="rounded-xl bg-[#F1F5F9] border border-slate-200 p-8 text-center text-sm text-[#64748B]">
                          {t.admin.messagesTab.empty}
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {filteredMessages.map((msg) => {
                          const delKey = `msg-${msg.id}`;
                          const formattedDate = msg.createdAtMillis
                            ? new Date(msg.createdAtMillis).toLocaleString(
                                language === 'id' ? 'id-ID' : 'en-US',
                                {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                }
                              )
                            : '-';
                          const replySubject = `Re: ${msg.subject}`;
                          const mailtoHref = `mailto:${encodeURIComponent(
                            msg.email
                          )}?subject=${encodeURIComponent(replySubject)}`;

                          return (
                            <article
                              key={msg.id}
                              className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="space-y-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                                    <span
                                      className={`font-semibold px-2 py-0.5 rounded ${
                                        msg.status === 'new'
                                          ? 'bg-[#2563EB] text-white'
                                          : msg.status === 'replied'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : 'bg-[#F1F5F9] text-[#475569]'
                                      }`}
                                    >
                                      {t.admin.messagesTab.statusLabels[msg.status]}
                                    </span>
                                    <span>·</span>
                                    <span className="font-mono-tabular">{msg.id}</span>
                                    <span>·</span>
                                    <span>
                                      {t.admin.messagesTab.receivedAtLabel}: {formattedDate}
                                    </span>
                                  </div>
                                  <h3 className="font-display text-base sm:text-lg font-bold text-[#0F172A] pt-1">
                                    {msg.subject}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-[#475569]">
                                    <span className="text-[#64748B]">
                                      {t.admin.messagesTab.senderLabel}:{' '}
                                    </span>
                                    <span className="font-semibold text-[#0F172A]">
                                      {msg.fullName}
                                    </span>{' '}
                                    &lt;{msg.email}&gt;
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  <select
                                    aria-label={t.admin.messagesTab.statusUpdateLabel}
                                    value={msg.status}
                                    disabled={busyAction}
                                    onChange={(e) => {
                                      const nextStatus = e.target.value as ContactMessageStatus;
                                      setBusyAction(true);
                                      void updateContactMessageStatus(msg.id, nextStatus)
                                        .then(() => notify('success', t.admin.saveSuccess))
                                        .catch((err) =>
                                          notify(
                                            'error',
                                            err instanceof Error ? err.message : t.admin.actionError
                                          )
                                        )
                                        .finally(() => setBusyAction(false));
                                    }}
                                    className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                  >
                                    <option value="new">
                                      {t.admin.messagesTab.statusLabels.new}
                                    </option>
                                    <option value="read">
                                      {t.admin.messagesTab.statusLabels.read}
                                    </option>
                                    <option value="replied">
                                      {t.admin.messagesTab.statusLabels.replied}
                                    </option>
                                    <option value="archived">
                                      {t.admin.messagesTab.statusLabels.archived}
                                    </option>
                                  </select>

                                  <a
                                    href={mailtoHref}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
                                  >
                                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{t.admin.messagesTab.replyEmailButton}</span>
                                  </a>

                                  {confirmDeleteKey === delKey ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setConfirmDeleteKey(null);
                                          setBusyAction(true);
                                          void deleteContactMessage(msg.id)
                                            .then(() => notify('success', t.admin.deleteSuccess))
                                            .catch((err) =>
                                              notify(
                                                'error',
                                                err instanceof Error
                                                  ? err.message
                                                  : t.admin.actionError
                                              )
                                            )
                                            .finally(() => setBusyAction(false));
                                        }}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                                      >
                                        {t.admin.confirmDeleteButton}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteKey(null)}
                                        className="px-3 py-1.5 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                                      >
                                        {t.admin.cancelButton}
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(delKey)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                      <span>{t.admin.deleteButton}</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="rounded-lg bg-[#F1F5F9] border border-slate-200 p-4 text-sm text-[#0F172A] whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 7: ADMINS */}
              {activeTab === 'admins' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="liquid-glass-light rounded-2xl p-6 space-y-3">
                      <h2 className="font-display text-lg font-bold text-[#0F172A]">
                        {t.admin.adminsTab.primaryTitle}
                      </h2>
                      <div className="rounded-xl bg-white/70 border border-slate-200/80 p-4 text-sm space-y-1">
                        <p className="font-semibold text-[#0F172A]">{BOOTSTRAPPED_ADMIN_EMAIL}</p>
                        <p className="text-xs text-[#64748B] font-mono-tabular break-all">
                          {t.admin.uidLabel}: {user.uid}
                        </p>
                      </div>
                    </div>

                    <div className="liquid-glass-light rounded-2xl p-6 space-y-4">
                      <h2 className="font-display text-lg font-bold text-[#0F172A]">
                        {t.admin.adminsTab.additionalTitle} ({admins.length})
                      </h2>
                      {admins.length === 0 ? (
                        <p className="text-sm text-[#64748B]">{t.admin.adminsTab.emptyAdditional}</p>
                      ) : (
                        <div className="divide-y divide-slate-200/70">
                          {admins.map((item) => {
                            const delKey = `adm-${item.uid}`;
                            return (
                              <div
                                key={item.uid}
                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-[#0F172A]">
                                    {item.label} — {item.email}
                                  </p>
                                  <p className="text-xs text-[#64748B] font-mono-tabular break-all">
                                    UID: {item.uid}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {confirmDeleteKey === delKey ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setConfirmDeleteKey(null);
                                          void removeAdminUser(item.uid).then(() =>
                                            notify('success', t.admin.deleteSuccess)
                                          );
                                        }}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg cursor-pointer"
                                      >
                                        {t.admin.confirmDeleteButton}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteKey(null)}
                                        className="px-3 py-1.5 text-xs font-semibold text-[#64748B] border border-slate-200 rounded-lg cursor-pointer"
                                      >
                                        {t.admin.cancelButton}
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(delKey)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                      <span>{t.admin.deleteButton}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => void handleAddAdmin(e)}
                    className="lg:col-span-5 liquid-glass-light rounded-2xl p-6 space-y-4 self-start"
                  >
                    <h2 className="font-display text-lg font-bold text-[#0F172A]">
                      {t.admin.adminsTab.addTitle}
                    </h2>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {t.admin.adminsTab.addDesc}
                    </p>
                    <div>
                      <label className={labelClass}>{t.admin.fields.adminUid}</label>
                      <input
                        type="text"
                        required
                        value={newAdminUid}
                        onChange={(e) => setNewAdminUid(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.admin.fields.adminEmail}</label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t.admin.fields.adminLabel}</label>
                      <input
                        type="text"
                        required
                        value={newAdminLabel}
                        onChange={(e) => setNewAdminLabel(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={busyAction}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer disabled:opacity-60"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                      <span>{t.admin.adminsTab.addButton}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
