import {ArrowLeft, ArrowRight, Info} from 'lucide-react';
import {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Button} from '../components/Button';
import {ProjectCard} from '../components/Cards';
import {PageHead} from '../components/PageHead';
import {RevealSection} from '../components/RevealSection';
import {SafeImage} from '../components/SafeImage';
import {useFirebase} from '../context/FirebaseContext';
import {useLanguage} from '../context/LanguageContext';
import type {ProjectCategory} from '../types';
import {filterProjectsByCategory} from '../utils/filters';

const PROJECT_CATEGORIES: {value: ProjectCategory | 'All'; idLabel: string; enLabel: string}[] = [
  {value: 'All', idLabel: 'Semua', enLabel: 'All'},
  {value: 'Website', idLabel: 'Website', enLabel: 'Website'},
  {value: 'Software', idLabel: 'Perangkat Lunak', enLabel: 'Software'},
  {value: 'Networking', idLabel: 'Jaringan', enLabel: 'Networking'},
  {value: 'Creative Design', idLabel: 'Desain Kreatif', enLabel: 'Creative Design'},
  {value: 'Digital Innovation', idLabel: 'Inovasi Digital', enLabel: 'Digital Innovation'},
];

export function ProjectsPage() {
  const {slug} = useParams<{slug?: string}>();
  const {language, t, localize} = useLanguage();
  const {divisions, projects} = useFirebase();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All');

  const selectedProject = slug ? projects.find((p) => p.slug === slug) : undefined;

  if (slug && !selectedProject) {
    return (
      <section className="py-20 dilux-glass-canvas-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="liquid-glass-light rounded-2xl p-10">
            <h1 className="font-display text-2xl font-bold text-[#0F172A]">
              {t.projects.headerTitle}
            </h1>
            <div className="mt-6">
              <Button to="/projects" variant="primary">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{t.projects.backToProjects}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (selectedProject) {
    const division = divisions.find((d) => d.id === selectedProject.divisionId);
    const projectTitle = localize(selectedProject.title);

    return (
      <>
        <PageHead
          title={`${projectTitle} — ${t.brand.name}`}
          description={localize(selectedProject.shortDescription)}
        />

        <section className="dilux-glass-canvas-dark text-white py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#60A5FA] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.projects.backToProjects}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-3">
              {selectedProject.isDemo && (
                <>
                  <span className="font-semibold text-[#60A5FA]">{t.common.demoLabel}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{localize(selectedProject.categoryLabel)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">{selectedProject.year}</span>
              <span aria-hidden="true">·</span>
              <span>{localize(selectedProject.status)}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              {projectTitle}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {localize(selectedProject.shortDescription)}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 dilux-glass-canvas-soft">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection variant="scale">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/80 shadow-lg ring-1 ring-slate-900/10 bg-[#0B1428] mb-10 liquid-glass-sheen">
                <SafeImage
                  src={selectedProject.image}
                  alt={localize(selectedProject.imageAlt)}
                  className="w-full h-full object-cover"
                  eager
                />
              </div>
            </RevealSection>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <RevealSection delayIndex={0}>
                  <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                    {t.projects.overviewTitle}
                  </h2>
                  <p className="mt-3 text-base text-[#0F172A] leading-relaxed">
                    {localize(selectedProject.overview)}
                  </p>
                </RevealSection>

                <RevealSection delayIndex={1} className="pt-6 border-t border-slate-200/80">
                  <h2 className="font-display text-xl font-bold text-[#0F172A]">
                    {t.projects.architectureTitle}
                  </h2>
                  <p className="mt-3 text-base text-[#64748B] leading-relaxed">
                    {localize(selectedProject.architectureNotes)}
                  </p>
                </RevealSection>
              </div>

              <aside className="lg:col-span-4">
                <RevealSection delayIndex={1} variant="scale">
                  <div className="rounded-2xl liquid-glass-light p-6 space-y-5">
                  <div>
                    <p className="text-xs font-medium text-[#64748B]">{t.common.statusLabel}</p>
                    <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                      {localize(selectedProject.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#64748B]">{t.common.yearLabel}</p>
                    <p className="mt-1 font-mono-tabular text-sm font-semibold text-[#0F172A]">
                      {selectedProject.year}
                    </p>
                  </div>
                  {division && (
                    <div>
                      <p className="text-xs font-medium text-[#64748B]">
                        {t.common.divisionLabel}
                      </p>
                      <Link
                        to={`/divisions/${division.slug}`}
                        className="mt-1 inline-block text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        {division.name}
                      </Link>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-[#64748B]">
                      {t.common.technologiesLabel}
                    </p>
                    <p className="mt-1 text-sm text-[#0F172A]">
                      {selectedProject.technologies.join(' · ')}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      to={`/contact?subject=${encodeURIComponent(projectTitle)}`}
                      variant="primary"
                      className="w-full"
                    >
                      <span>{t.common.contactUs}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                  </div>
                </RevealSection>
              </aside>
            </div>
          </div>
        </section>
      </>
    );
  }

  const filteredProjects = filterProjectsByCategory(projects, activeCategory);

  return (
    <>
      <PageHead title={t.projects.pageTitle} description={t.projects.pageDescription} />

      <section className="dilux-glass-canvas-dark text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-[#60A5FA] mb-3">
            {t.projects.headerKicker}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl">
            {t.projects.headerTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.projects.headerSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 dilux-glass-canvas-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection delayIndex={0}>
            <div className="mb-8 rounded-2xl liquid-glass-light p-4 sm:p-5 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-[#0F172A] leading-relaxed">{t.projects.demoBanner}</p>
            </div>
          </RevealSection>

          <RevealSection delayIndex={1}>
            <div
              role="group"
              aria-label="Project category filters"
              className="inline-flex flex-wrap items-center gap-1.5 p-1.5 liquid-glass-control rounded-2xl mb-8"
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.value
                      ? 'bg-[#0B1428] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  {language === 'id' ? cat.idLabel : cat.enLabel}
                </button>
              ))}
            </div>
          </RevealSection>

          {filteredProjects.length === 0 ? (
            <RevealSection>
              <div className="liquid-glass-light rounded-2xl p-10 text-center text-sm text-[#64748B]">
                {t.projects.emptyFilter}
              </div>
            </RevealSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <RevealSection key={`${activeCategory}-${project.id}`} delayIndex={idx} variant="scale" className="flex">
                  <ProjectCard project={project} />
                </RevealSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
