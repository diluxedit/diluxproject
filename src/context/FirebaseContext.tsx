import {
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ARTICLES as SEED_ARTICLES} from '../data/articles';
import {DIVISIONS as SEED_DIVISIONS} from '../data/divisions';
import {PRODUCTS as SEED_PRODUCTS} from '../data/products';
import {PROJECTS as SEED_PROJECTS} from '../data/projects';
import {SERVICES as SEED_SERVICES} from '../data/services';
import {OperationType, auth, db, handleFirestoreError} from '../firebase';
import {enLocale} from '../locales/en';
import {idLocale} from '../locales/id';
import type {
  ArticleItem,
  Division,
  DivisionId,
  ProductItem,
  ProjectItem,
  ServiceItem,
} from '../types';
import {
  ID_PATTERN,
  type SiteHomeSettings,
  clampStr,
  sanitizeSlug,
  serializeArticlePayload,
  serializeDivisionPayload,
  serializeProductPayload,
  serializeProjectPayload,
  serializeServicePayload,
  serializeSiteHomePayload,
} from '../utils/cmsPayloads';

export const BOOTSTRAPPED_ADMIN_EMAIL = 'ramdanitomi6@gmail.com';

export interface AdminRecord {
  uid: string;
  email: string;
  label: string;
  createdBy: string;
}

export const DEFAULT_HOME_SETTINGS: SiteHomeSettings = {
  heroEyebrowId: idLocale.home.heroEyebrow,
  heroEyebrowEn: enLocale.home.heroEyebrow,
  heroHeadlineId: idLocale.home.heroHeadline,
  heroHeadlineEn: enLocale.home.heroHeadline,
  heroDescriptionId: idLocale.home.heroDescription,
  heroDescriptionEn: enLocale.home.heroDescription,
  introTitleId: idLocale.home.introTitle,
  introTitleEn: enLocale.home.introTitle,
  introParagraph1Id: idLocale.home.introParagraph1,
  introParagraph1En: enLocale.home.introParagraph1,
  introParagraph2Id: idLocale.home.introParagraph2,
  introParagraph2En: enLocale.home.introParagraph2,
  ctaHeadlineId: idLocale.home.ctaHeadline,
  ctaHeadlineEn: enLocale.home.ctaHeadline,
  ctaDescriptionId: idLocale.home.ctaDescription,
  ctaDescriptionEn: enLocale.home.ctaDescription,
};

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminCheckReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutAdmin: () => Promise<void>;
  homeSettings: SiteHomeSettings;
  hasFirestoreHomeSettings: boolean;
  divisions: Division[];
  services: ServiceItem[];
  products: ProductItem[];
  projects: ProjectItem[];
  articles: ArticleItem[];
  admins: AdminRecord[];
  firestoreSyncedCounts: {
    siteSettings: number;
    divisions: number;
    services: number;
    products: number;
    projects: number;
    articles: number;
  };
  seedInitialDataToFirestore: () => Promise<void>;
  saveHomeSettings: (settings: SiteHomeSettings) => Promise<void>;
  saveDivision: (division: Division, isNew?: boolean) => Promise<void>;
  saveService: (service: ServiceItem, isNew?: boolean) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveProduct: (product: ProductItem, isNew?: boolean) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveProject: (project: ProjectItem, isNew?: boolean) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveArticle: (article: ArticleItem, isNew?: boolean) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addAdminUser: (uid: string, email: string, label: string) => Promise<void>;
  removeAdminUser: (uid: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

function parseArticleSections(
  headingStr: string,
  bodyStr: string,
  headingEnStr: string,
  bodyEnStr: string
): ArticleItem['sections'] {
  const idBlocks = bodyStr.split(/\n\n+/).filter(Boolean);
  const enBlocks = bodyEnStr.split(/\n\n+/).filter(Boolean);
  const idHeadings = headingStr.split(' | ').filter(Boolean);
  const enHeadings = headingEnStr.split(' | ').filter(Boolean);

  const count = Math.max(1, idBlocks.length, enBlocks.length);
  return Array.from({length: count}, (_, i) => {
    const rawId = idBlocks[i] || '';
    const rawEn = enBlocks[i] || '';
    const idLines = rawId.split('\n');
    const enLines = rawEn.split('\n');

    const hId = idHeadings[i] || (idLines.length > 1 ? idLines[0] : headingStr || 'Ringkasan');
    const bId = idLines.length > 1 ? idLines.slice(1).join('\n') : rawId || bodyStr;
    const hEn = enHeadings[i] || (enLines.length > 1 ? enLines[0] : headingEnStr || 'Overview');
    const bEn = enLines.length > 1 ? enLines.slice(1).join('\n') : rawEn || bodyEnStr;

    return {
      heading: {id: hId, en: hEn},
      body: {id: bId, en: bEn},
    };
  });
}

export function FirebaseProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckReady, setAdminCheckReady] = useState(false);

  const [dbHomeSettings, setDbHomeSettings] = useState<SiteHomeSettings | null>(null);
  const [dbDivisions, setDbDivisions] = useState<Division[]>([]);
  const [dbServices, setDbServices] = useState<ServiceItem[]>([]);
  const [dbProducts, setDbProducts] = useState<ProductItem[]>([]);
  const [dbProjects, setDbProjects] = useState<ProjectItem[]>([]);
  const [dbArticles, setDbArticles] = useState<ArticleItem[]>([]);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (!currentUser || !currentUser.emailVerified) {
        setIsAdmin(false);
        setAdminCheckReady(true);
        return;
      }

      if (currentUser.email === BOOTSTRAPPED_ADMIN_EMAIL) {
        setIsAdmin(true);
        setAdminCheckReady(true);
        return;
      }

      try {
        const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
        setIsAdmin(adminSnap.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminCheckReady(true);
      }
    });
    return unsubscribe;
  }, []);

  // Public content live listeners
  useEffect(() => {
    if (!authReady) {
      return;
    }

    const unsubHome = onSnapshot(
      doc(db, 'siteSettings', 'home'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setDbHomeSettings({
            heroEyebrowId: d.heroEyebrowId,
            heroEyebrowEn: d.heroEyebrowEn,
            heroHeadlineId: d.heroHeadlineId,
            heroHeadlineEn: d.heroHeadlineEn,
            heroDescriptionId: d.heroDescriptionId,
            heroDescriptionEn: d.heroDescriptionEn,
            introTitleId: d.introTitleId,
            introTitleEn: d.introTitleEn,
            introParagraph1Id: d.introParagraph1Id,
            introParagraph1En: d.introParagraph1En,
            introParagraph2Id: d.introParagraph2Id,
            introParagraph2En: d.introParagraph2En,
            ctaHeadlineId: d.ctaHeadlineId,
            ctaHeadlineEn: d.ctaHeadlineEn,
            ctaDescriptionId: d.ctaDescriptionId,
            ctaDescriptionEn: d.ctaDescriptionEn,
          });
        } else {
          setDbHomeSettings(null);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'siteSettings/home')
    );

    const unsubDivisions = onSnapshot(
      collection(db, 'divisions'),
      (snap) => {
        const list: Division[] = snap.docs.map((item) => {
          const d = item.data();
          return {
            id: item.id as DivisionId,
            slug: d.slug,
            name: d.name,
            shortLabel: {id: d.shortLabelId, en: d.shortLabelEn},
            icon: d.icon,
            description: {id: d.descriptionId, en: d.descriptionEn},
            extendedOverview: {id: d.extendedOverviewId, en: d.extendedOverviewEn},
            methodology: {id: d.methodologyId, en: d.methodologyEn},
            focusAreas: {id: d.focusAreasId || [], en: d.focusAreasEn || []},
            sortOrder: d.sortOrder ?? 0,
          };
        });
        list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setDbDivisions(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'divisions')
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        const list: ServiceItem[] = snap.docs.map((item) => {
          const d = item.data();
          return {
            id: item.id,
            number: d.number,
            divisionId: d.divisionId,
            icon: d.icon,
            name: {id: d.nameId, en: d.nameEn},
            shortDescription: {id: d.shortDescriptionId, en: d.shortDescriptionEn},
            scopeDetails: {id: d.scopeDetailsId || [], en: d.scopeDetailsEn || []},
            featured: Boolean(d.featured),
            sortOrder: d.sortOrder ?? 0,
          };
        });
        list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setDbServices(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'services')
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        const list: ProductItem[] = snap.docs.map((item) => {
          const d = item.data();
          return {
            id: item.id,
            slug: d.slug,
            isDemo: Boolean(d.isDemo),
            featured: Boolean(d.featured),
            sortOrder: d.sortOrder ?? 0,
            name: d.name,
            category: d.category,
            categoryLabel: {id: d.categoryLabelId, en: d.categoryLabelEn},
            status: {id: d.statusId, en: d.statusEn},
            image: d.image,
            imageAlt: {id: d.imageAltId, en: d.imageAltEn},
            shortDescription: {id: d.shortDescriptionId, en: d.shortDescriptionEn},
            fullDescription: {id: d.fullDescriptionId, en: d.fullDescriptionEn},
            capabilities: {id: d.capabilitiesId || [], en: d.capabilitiesEn || []},
          };
        });
        list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setDbProducts(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'products')
    );

    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        const list: ProjectItem[] = snap.docs.map((item) => {
          const d = item.data();
          return {
            id: item.id,
            slug: d.slug,
            isDemo: Boolean(d.isDemo),
            featured: Boolean(d.featured),
            sortOrder: d.sortOrder ?? 0,
            title: {id: d.titleId, en: d.titleEn},
            category: d.category,
            categoryLabel: {id: d.categoryLabelId, en: d.categoryLabelEn},
            divisionId: d.divisionId,
            year: d.year,
            status: {id: d.statusId, en: d.statusEn},
            image: d.image,
            imageAlt: {id: d.imageAltId, en: d.imageAltEn},
            shortDescription: {id: d.shortDescriptionId, en: d.shortDescriptionEn},
            overview: {id: d.overviewId, en: d.overviewEn},
            architectureNotes: {id: d.architectureNotesId, en: d.architectureNotesEn},
            technologies: d.technologies || [],
          };
        });
        list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setDbProjects(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'projects')
    );

    const unsubArticles = onSnapshot(
      collection(db, 'articles'),
      (snap) => {
        const list: ArticleItem[] = snap.docs.map((item) => {
          const d = item.data();
          return {
            id: item.id,
            slug: d.slug,
            isDemo: Boolean(d.isDemo),
            featured: Boolean(d.featured),
            sortOrder: d.sortOrder ?? 0,
            title: {id: d.titleId, en: d.titleEn},
            excerpt: {id: d.excerptId, en: d.excerptEn},
            category: d.category,
            categoryLabel: {id: d.categoryLabelId, en: d.categoryLabelEn},
            publishedAt: d.publishedAt,
            publishedLabel: {id: d.publishedLabelId, en: d.publishedLabelEn},
            readingMinutes: d.readingMinutes ?? 3,
            image: d.image,
            imageAlt: {id: d.imageAltId, en: d.imageAltEn},
            author: d.author,
            sections: parseArticleSections(
              d.sectionHeadingId || '',
              d.sectionBodyId || '',
              d.sectionHeadingEn || '',
              d.sectionBodyEn || ''
            ),
          };
        });
        list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setDbArticles(list);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'articles')
    );

    return () => {
      unsubHome();
      unsubDivisions();
      unsubServices();
      unsubProducts();
      unsubProjects();
      unsubArticles();
    };
  }, [authReady]);

  // Admin-only collection listener (only attached when authenticated as Admin)
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setAdmins([]);
      return;
    }

    const unsubAdmins = onSnapshot(
      collection(db, 'admins'),
      (snap) => {
        setAdmins(
          snap.docs.map((item) => {
            const d = item.data();
            return {
              uid: d.uid,
              email: d.email,
              label: d.label,
              createdBy: d.createdBy,
            };
          })
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'admins')
    );

    return unsubAdmins;
  }, [authReady, user, isAdmin]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({prompt: 'select_account'});
    await signInWithPopup(auth, provider);
  };

  const signOutAdmin = async () => {
    await signOut(auth);
  };

  const requireAdminUid = (): string => {
    if (!auth.currentUser || !isAdmin) {
      throw new Error('Admin authentication required.');
    }
    return auth.currentUser.uid;
  };

  const seedInitialDataToFirestore = async () => {
    const uid = requireAdminUid();
    const batch = writeBatch(db);
    const now = serverTimestamp();

    if (!dbHomeSettings) {
      batch.set(
        doc(db, 'siteSettings', 'home'),
        serializeSiteHomePayload(DEFAULT_HOME_SETTINGS, uid, {createdAt: now, updatedAt: now})
      );
    }

    if (dbDivisions.length === 0) {
      SEED_DIVISIONS.forEach((div, idx) => {
        batch.set(
          doc(db, 'divisions', div.id),
          serializeDivisionPayload({...div, sortOrder: idx}, uid, {createdAt: now, updatedAt: now})
        );
      });
    }

    if (dbServices.length === 0) {
      SEED_SERVICES.forEach((svc, idx) => {
        batch.set(
          doc(db, 'services', svc.id),
          serializeServicePayload(
            {...svc, featured: idx < 4, sortOrder: idx},
            uid,
            {createdAt: now, updatedAt: now}
          )
        );
      });
    }

    if (dbProducts.length === 0) {
      SEED_PRODUCTS.forEach((prod, idx) => {
        batch.set(
          doc(db, 'products', prod.id),
          serializeProductPayload(
            {...prod, featured: idx < 2, sortOrder: idx},
            uid,
            {createdAt: now, updatedAt: now}
          )
        );
      });
    }

    if (dbProjects.length === 0) {
      SEED_PROJECTS.forEach((proj, idx) => {
        batch.set(
          doc(db, 'projects', proj.id),
          serializeProjectPayload(
            {...proj, featured: idx < 3, sortOrder: idx},
            uid,
            {createdAt: now, updatedAt: now}
          )
        );
      });
    }

    if (dbArticles.length === 0) {
      SEED_ARTICLES.forEach((art, idx) => {
        batch.set(
          doc(db, 'articles', art.id),
          serializeArticlePayload(
            {...art, featured: idx < 3, sortOrder: idx},
            uid,
            {createdAt: now, updatedAt: now}
          )
        );
      });
    }

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
    }
  };

  const saveHomeSettings = async (settings: SiteHomeSettings) => {
    const uid = requireAdminUid();
    const docRef = doc(db, 'siteSettings', 'home');
    try {
      const existingSnap = await getDoc(docRef);
      const timestamps = existingSnap.exists()
        ? {createdAt: existingSnap.data().createdAt, updatedAt: serverTimestamp()}
        : {createdAt: serverTimestamp(), updatedAt: serverTimestamp()};
      await setDoc(docRef, serializeSiteHomePayload(settings, uid, timestamps));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'siteSettings/home');
    }
  };

  const saveDivision = async (division: Division, isNew = false) => {
    const uid = requireAdminUid();
    const id = sanitizeSlug(division.id, 'division');
    const docRef = doc(db, 'divisions', id);
    try {
      const existingSnap = isNew ? null : await getDoc(docRef);
      const timestamps =
        existingSnap && existingSnap.exists()
          ? {createdAt: existingSnap.data().createdAt, updatedAt: serverTimestamp()}
          : {createdAt: serverTimestamp(), updatedAt: serverTimestamp()};
      await setDoc(docRef, serializeDivisionPayload(division, uid, timestamps));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `divisions/${id}`);
    }
  };

  const saveService = async (service: ServiceItem, isNew = false) => {
    const uid = requireAdminUid();
    const id = sanitizeSlug(service.id, `service-${Date.now()}`);
    const docRef = doc(db, 'services', id);
    try {
      const existingSnap = isNew ? null : await getDoc(docRef);
      const timestamps =
        existingSnap && existingSnap.exists()
          ? {createdAt: existingSnap.data().createdAt, updatedAt: serverTimestamp()}
          : {createdAt: serverTimestamp(), updatedAt: serverTimestamp()};
      await setDoc(docRef, serializeServicePayload(service, uid, timestamps));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `services/${id}`);
    }
  };

  const deleteService = async (id: string) => {
    requireAdminUid();
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
    }
  };

  const saveProduct = async (product: ProductItem, isNew = false) => {
    const uid = requireAdminUid();
    const id = sanitizeSlug(product.id || product.slug, `product-${Date.now()}`);
    const docRef = doc(db, 'products', id);
    try {
      const existingSnap = isNew ? null : await getDoc(docRef);
      const timestamps =
        existingSnap && existingSnap.exists()
          ? {createdAt: existingSnap.data().createdAt, updatedAt: serverTimestamp()}
          : {createdAt: serverTimestamp(), updatedAt: serverTimestamp()};
      await setDoc(docRef, serializeProductPayload({...product, slug: product.slug || id}, uid, timestamps));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    requireAdminUid();
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const saveProject = async (project: ProjectItem, isNew = false) => {
    const uid = requireAdminUid();
    const id = sanitizeSlug(project.id || project.slug, `project-${Date.now()}`);
    const docRef = doc(db, 'projects', id);
    try {
      const existingSnap = isNew ? null : await getDoc(docRef);
      const timestamps =
        existingSnap && existingSnap.exists()
          ? {createdAt: existingSnap.data().createdAt, updatedAt: serverTimestamp()}
          : {createdAt: serverTimestamp(), updatedAt: serverTimestamp()};
      await setDoc(docRef, serializeProjectPayload({...project, slug: project.slug || id}, uid, timestamps));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${id}`);
    }
  };

  const deleteProject = async (id: string) => {
    requireAdminUid();
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const saveArticle = async (article: ArticleItem, isNew = false) => {
    const uid = requireAdminUid();
    const id = sanitizeSlug(article.id || article.slug, `article-${Date.now()}`);
    const docRef = doc(db, 'articles', id);
    try {
      const existingSnap = isNew ? null : await getDoc(docRef);
      const timestamps =
        existingSnap && existingSnap.exists()
          ? {createdAt: existingSnap.data().createdAt, updatedAt: serverTimestamp()}
          : {createdAt: serverTimestamp(), updatedAt: serverTimestamp()};
      await setDoc(docRef, serializeArticlePayload({...article, slug: article.slug || id}, uid, timestamps));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `articles/${id}`);
    }
  };

  const deleteArticle = async (id: string) => {
    requireAdminUid();
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `articles/${id}`);
    }
  };

  const addAdminUser = async (targetUid: string, email: string, label: string) => {
    const uid = requireAdminUid();
    const cleanUid = targetUid.trim();
    if (!cleanUid || cleanUid.length > 128 || !ID_PATTERN.test(cleanUid)) {
      throw new Error('UID tidak valid.');
    }
    try {
      await setDoc(doc(db, 'admins', cleanUid), {
        uid: cleanUid,
        email: clampStr(email, 200),
        label: clampStr(label, 120, 'Admin'),
        createdBy: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `admins/${cleanUid}`);
    }
  };

  const removeAdminUser = async (targetUid: string) => {
    requireAdminUid();
    try {
      await deleteDoc(doc(db, 'admins', targetUid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `admins/${targetUid}`);
    }
  };

  const effectiveDivisions = dbDivisions.length > 0 ? dbDivisions : SEED_DIVISIONS;
  const effectiveServices =
    dbServices.length > 0
      ? dbServices
      : SEED_SERVICES.map((s, i) => ({...s, featured: i < 4, sortOrder: i}));
  const effectiveProducts =
    dbProducts.length > 0
      ? dbProducts
      : SEED_PRODUCTS.map((p, i) => ({...p, featured: i < 2, sortOrder: i}));
  const effectiveProjects =
    dbProjects.length > 0
      ? dbProjects
      : SEED_PROJECTS.map((p, i) => ({...p, featured: i < 3, sortOrder: i}));
  const effectiveArticles =
    dbArticles.length > 0
      ? dbArticles
      : SEED_ARTICLES.map((a, i) => ({...a, featured: i < 3, sortOrder: i}));

  const value = useMemo<FirebaseContextValue>(
    () => ({
      user,
      authReady,
      isAdmin,
      adminCheckReady,
      signInWithGoogle,
      signOutAdmin,
      homeSettings: dbHomeSettings ?? DEFAULT_HOME_SETTINGS,
      hasFirestoreHomeSettings: Boolean(dbHomeSettings),
      divisions: effectiveDivisions,
      services: effectiveServices,
      products: effectiveProducts,
      projects: effectiveProjects,
      articles: effectiveArticles,
      admins,
      firestoreSyncedCounts: {
        siteSettings: dbHomeSettings ? 1 : 0,
        divisions: dbDivisions.length,
        services: dbServices.length,
        products: dbProducts.length,
        projects: dbProjects.length,
        articles: dbArticles.length,
      },
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
    }),
    [
      user,
      authReady,
      isAdmin,
      adminCheckReady,
      dbHomeSettings,
      effectiveDivisions,
      effectiveServices,
      effectiveProducts,
      effectiveProjects,
      effectiveArticles,
      admins,
      dbDivisions.length,
      dbServices.length,
      dbProducts.length,
      dbProjects.length,
      dbArticles.length,
    ]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return ctx;
}
