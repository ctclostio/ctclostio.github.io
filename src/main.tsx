import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { caseStudies, categories, featuredProjects, projects, type CaseStudy, type Project } from './data/projects';

type Category = (typeof categories)[number];
type ContactFormState = {
  name: string;
  email: string;
  intent: string;
  message: string;
};

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    umami?: { track?: (event: string, props?: Record<string, string>) => void };
    goatcounter?: { count?: (options: { path: string; title?: string; event?: boolean }) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

const githubUrl = 'https://github.com/ctclostio';
const contactEmail = 'ctclostio@users.noreply.github.com';
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const plausibleScriptSrc = (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) || 'https://plausible.io/js/script.js';
const photoPath = '/profile/clayton-clostio.jpg';
const audiencePaths = [
  {
    title: 'For hiring teams',
    copy: 'Start with the case studies, then scan the project index for Go, Python, Rust, AI, simulation, and automation work.',
    href: '#case-studies',
    cta: 'Read case studies',
  },
  {
    title: 'For collaborators',
    copy: 'Use the proof points and repository links to see where a project is headed and what would make a useful next contribution.',
    href: '#featured',
    cta: 'See featured work',
  },
  {
    title: 'For technical readers',
    copy: 'Search by topic or language, then jump into repositories for implementation details, tests, and trade-offs.',
    href: '#projects',
    cta: 'Browse index',
  },
];

function trackEvent(event: string, props: Record<string, string> = {}) {
  window.plausible?.(event, { props });
  window.umami?.track?.(event, props);
  window.goatcounter?.count?.({
    path: `event/${event}`,
    title: new URLSearchParams(props).toString(),
    event: true,
  });
  window.gtag?.('event', event, props);
}

function AnalyticsLoader() {
  useEffect(() => {
    if (!plausibleDomain || document.querySelector('script[data-portfolio-analytics="plausible"]')) {
      return;
    }

    const script = document.createElement('script');
    script.defer = true;
    script.src = plausibleScriptSrc;
    script.dataset.domain = plausibleDomain;
    script.dataset.portfolioAnalytics = 'plausible';
    document.head.appendChild(script);
  }, []);

  return null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
}

function languageClass(language?: string) {
  return `language-dot ${language?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown'}`;
}

function ProfilePhoto() {
  const [showPhoto, setShowPhoto] = useState(true);

  return (
    <div className="profile-photo" aria-label="Clayton Clostio profile image">
      {showPhoto ? (
        <img
          src={photoPath}
          alt="Clayton Clostio"
          onError={() => setShowPhoto(false)}
        />
      ) : (
        <div className="profile-photo__placeholder">
          <span>CC</span>
          <small>Clayton Clostio</small>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <article className={compact ? 'project-card compact' : 'project-card'}>
      <div className="project-card__header">
        <span className="eyebrow">{project.category}</span>
        <span className="updated">Updated {formatDate(project.updatedAt)}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      {project.status ? <span className="status-pill">{project.status}</span> : null}
      {project.proofPoints?.length ? (
        <ul className="proof-list" aria-label={`${project.name} proof points`}>
          {project.proofPoints.slice(0, compact ? 2 : 3).map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
      <div className="topic-row" aria-label={`${project.name} topics`}>
        {project.topics.slice(0, compact ? 3 : 5).map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>
      <div className="project-card__footer">
        <span className="language">
          <i className={languageClass(project.language)} />
          {project.language || 'Mixed'}
        </span>
        <span className="project-links">
          {project.caseStudySlug ? (
            <a
              href={`#case-study-${project.caseStudySlug}`}
              onClick={() => trackEvent('case_study_click', { project: project.name, source: compact ? 'index' : 'featured' })}
            >
              Case study
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('project_demo_click', { project: project.name })}
            >
              Demo <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} on GitHub`}
            onClick={() => trackEvent('project_repo_click', { project: project.name, source: compact ? 'index' : 'featured' })}
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </span>
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <article className="case-study" id={`case-study-${caseStudy.slug}`}>
      <div className="case-study__intro">
        <span className="eyebrow">{caseStudy.kicker}</span>
        <h3>{caseStudy.projectName}</h3>
        <p>{caseStudy.summary}</p>
        <div className="hero__actions compact-actions">
          <a
            className="button secondary"
            href={caseStudy.repoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('project_repo_click', { project: caseStudy.projectName, source: 'case_study' })}
          >
            Repository ↗
          </a>
          <a className="button secondary" href="#projects">
            Back to index
          </a>
        </div>
      </div>

      <div className="case-study__meta">
        <div>
          <span>Proof</span>
          <ul className="case-proof-list">
            {caseStudy.proofPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <span>Role</span>
          <p>{caseStudy.role}</p>
        </div>
        <div>
          <span>Stack</span>
          <div className="topic-row compact-topic-row">
            {caseStudy.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="case-study__body">
        <section>
          <h4>Problem</h4>
          <p>{caseStudy.problem}</p>
        </section>
        <section>
          <h4>Approach</h4>
          <ul>
            {caseStudy.approach.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Implementation details</h4>
          <ul>
            {caseStudy.implementation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Outcomes</h4>
          <ul>
            {caseStudy.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Next steps</h4>
          <ul>
            {caseStudy.nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    intent: 'Hiring / interview',
    message: '',
  });

  function updateField(field: keyof ContactFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    trackEvent('contact_submit', {
      intent: form.intent,
      endpoint: contactEndpoint ? 'configured' : 'mailto',
    });

    if (contactEndpoint) {
      return;
    }

    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact: ${form.intent}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Intent: ${form.intent}`,
        '',
        form.message,
      ].join('\n'),
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" action={contactEndpoint} method="POST" onSubmit={handleSubmit}>
      <div className="contact-form__grid">
        <label>
          <span>Name</span>
          <input
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
          />
        </label>
      </div>
      <label>
        <span>Reason</span>
        <select
          name="intent"
          value={form.intent}
          onChange={(event) => updateField('intent', event.target.value)}
          required
        >
          <option>Hiring / interview</option>
          <option>Collaboration</option>
          <option>Project question</option>
          <option>Security tooling</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows={6}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          required
        />
      </label>
      <div className="contact-form__footer">
        <button className="button primary" type="submit">
          {contactEndpoint ? 'Send message' : 'Open email draft'}
        </button>
        <a
          className="button secondary"
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent('final_cta_click', { cta: 'github_profile' })}
        >
          GitHub profile ↗
        </a>
      </div>
    </form>
  );
}

function App() {
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category;
      const haystack = [project.name, project.description, project.language, project.category, ...project.topics]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, query]);

  const languageCount = new Set(projects.map((project) => project.language).filter(Boolean)).size;
  const aiProjects = projects.filter((project) => project.topics.includes('ai')).length;

  return (
    <>
      <AnalyticsLoader />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="Clayton Clostio portfolio home">
          <span className="brand-mark">HC</span>
          <span>Hannadio</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#featured">Featured</a>
          <a href="#case-studies">Case studies</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a className="nav-cta" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero section-shell">
          <div className="hero__copy">
            <div className="hero-pill">
              <span className="pulse" /> Clayton Clostio · Hannadio
            </div>
            <h1>AI-native games, simulations, and utilities shipped in public.</h1>
            <p>
              I am Clayton Clostio (Hannadio), an IT systems engineer building practical public software across Go, Python, Rust, local AI workflows, graphics, terminal tools, and interactive systems.
            </p>
            <div className="hero__actions">
              <a className="button primary" href="#case-studies" onClick={() => trackEvent('hero_cta_click', { cta: 'case_studies' })}>Read case studies</a>
              <a className="button secondary" href={githubUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('hero_cta_click', { cta: 'github' })}>View GitHub ↗</a>
              <a className="button secondary" href="#contact" onClick={() => trackEvent('hero_cta_click', { cta: 'contact' })}>Contact</a>
            </div>
          </div>

          <aside className="profile-card" aria-label="Clayton Clostio profile summary">
            <ProfilePhoto />
            <div className="profile-card__copy">
              <span className="eyebrow">Builder profile</span>
              <h2>Clayton Clostio</h2>
              <p>@Hannadio · GitHub: ctclostio</p>
            </div>
            <div className="profile-meta-grid">
              <Stat value={`${projects.length}`} label="curated repos" />
              <Stat value={`${languageCount}+`} label="languages" />
              <Stat value={`${aiProjects}`} label="AI projects" />
              <Stat value={`${caseStudies.length}`} label="case studies" />
            </div>
          </aside>
        </section>

        <section className="section-shell logo-strip" aria-label="Project domains">
          {['AI security', 'Local LLMs', 'Astronomy', 'Game systems', 'Automation', 'Developer tools'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>

        <section className="section-shell audience-section" id="about">
          <div className="section-heading">
            <span className="eyebrow">Visitor paths</span>
            <h2>Choose the fastest way into the work.</h2>
          </div>
          <div className="audience-grid">
            {audiencePaths.map((path) => (
              <article className="audience-card" key={path.title}>
                <h3>{path.title}</h3>
                <p>{path.copy}</p>
                <a href={path.href} onClick={() => trackEvent('audience_path_click', { path: path.title })}>
                  {path.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell split">
          <div>
            <span className="eyebrow">Build focus</span>
            <h2>Creative systems with a practical edge.</h2>
          </div>
          <div className="focus-grid">
            <div>
              <h3>AI-native software</h3>
              <p>Local LLM gameplay, AI-assisted security, voice cloning experiments, and pragmatic automation.</p>
            </div>
            <div>
              <h3>Interactive simulations</h3>
              <p>3D astronomy, solar-system visualizations, and toys that make abstract spaces easier to explore.</p>
            </div>
            <div>
              <h3>Useful utilities</h3>
              <p>PDF tooling, OCR workflows, hardware diagnostics, and quality-of-life scripts.</p>
            </div>
          </div>
        </section>

        <section className="section-shell" id="featured">
          <div className="section-heading">
            <span className="eyebrow">Featured projects</span>
            <h2>Selected public work</h2>
          </div>
          <div className="featured-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        <section className="section-shell case-study-section" id="case-studies">
          <div className="section-heading">
            <span className="eyebrow">Project case studies</span>
            <h2>Deeper looks at the strongest portfolio pieces</h2>
          </div>
          <div className="case-study-stack">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        </section>

        <section className="section-shell" id="projects">
          <div className="section-heading row-heading">
            <div>
              <span className="eyebrow">Project index</span>
              <h2>Browse the portfolio</h2>
            </div>
            <label className="search-box">
              <span>Search</span>
              <input
                value={query}
                type="search"
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => {
                  if (query.trim()) {
                    trackEvent('search_used', { query: query.trim().toLowerCase() });
                  }
                }}
                placeholder="Try AI, Go, Python, game..."
              />
            </label>
          </div>

          <div className="filter-row" aria-label="Filter projects by category">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? 'active' : ''}
                type="button"
                onClick={() => {
                  setCategory(item);
                  trackEvent('filter_selected', { category: item });
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} compact />
            ))}
          </div>
        </section>

        <section className="section-shell cta-panel" id="contact">
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Send a short brief or start with the code.</h2>
            <p>
              Share the role, project, collaboration idea, or technical question you want to discuss. Specific context makes the fastest path to a useful reply.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Clayton Clostio · Hannadio</span>
        <span>Built with React, Vite, and GitHub Pages.</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
