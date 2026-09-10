import { useEffect, useMemo, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles.css';
import { posts, postUrl, formatPostDate, type BlogPost } from './data/blog';
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
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const plausibleScriptSrc = (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) || 'https://plausible.io/js/script.js';
const selectedProjects = ['GoStarMap', 'SmolDungeon', 'reaper']
  .map((name) => featuredProjects.find((project) => project.name === name)!);

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

function Star({ x, y, size = 9 }: { x: number; y: number; size?: number }) {
  return <path d={`M ${x - size} ${y} Q ${x} ${y} ${x} ${y - size} Q ${x} ${y} ${x + size} ${y} Q ${x} ${y} ${x} ${y + size} Q ${x} ${y} ${x - size} ${y}`} />;
}

function OrbitNotebook() {
  const [nudges, setNudges] = useState(0);
  const notes = ['A small system. A lot to get curious about.', 'A little momentum goes a long way.', 'Some ideas just need another orbit.', 'Still going around in very interesting circles.'];

  return (
    <figure className="orbit-notebook">
      <div className="notebook-label"><span>Fig. 01 — A wandering mind</span><span aria-hidden="true">✳</span></div>
      <svg className="orbit-drawing" viewBox="0 0 540 420" role="img" aria-label="An illustrated solar system with three planets. Use the nudge button to move them along their orbits.">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="270" cy="206" rx="97" ry="55" transform="rotate(-22 270 206)" />
          <ellipse cx="270" cy="206" rx="162" ry="101" transform="rotate(-22 270 206)" strokeDasharray="4 5" />
          <ellipse cx="270" cy="206" rx="226" ry="147" transform="rotate(-22 270 206)" />
          <Star x={72} y={88} /><Star x={432} y={70} size={13} /><Star x={462} y={304} />
          <Star x={132} y={313} size={6} /><Star x={348} y={369} size={7} />
          <path d="M89 54v8m-4-4h8M452 151v8m-4-4h8M205 353v8m-4-4h8" />
          <circle cx="394" cy="317" r="3" /><circle cx="171" cy="70" r="2" /><circle cx="63" cy="245" r="2" />
          <g className="notebook-sun">
            <circle cx="270" cy="206" r="38" fill="#e9b75c" />
            <ellipse cx="270" cy="206" rx="22" ry="38" /><ellipse cx="270" cy="206" rx="8" ry="38" />
            <path d="M234 194q36-10 72 0M234 219q36 10 72 0M232 206h76" />
          </g>
          {[{ rx: 97, ry: 55, angle: 0.4, radius: 10, color: '#df886e' }, { rx: 162, ry: 101, angle: 3.5, radius: 16, color: '#b8c69c' }, { rx: 226, ry: 147, angle: 5.6, radius: 24, color: '#c4c7e2' }].map((planet, index) => {
            const angle = planet.angle + nudges * (0.8 - index * 0.17);
            const x = planet.rx * Math.cos(angle);
            const y = planet.ry * Math.sin(angle);
            const tilt = -22 * Math.PI / 180;
            return (
              <g key={index} className="orbit-planet" style={{ transform: `translate(${270 + x * Math.cos(tilt) - y * Math.sin(tilt)}px, ${206 + x * Math.sin(tilt) + y * Math.cos(tilt)}px)` }}>
                <circle r={planet.radius} fill={planet.color} />
                {index === 2 ? <ellipse rx="36" ry="8" transform="rotate(-25)" /> : <path d={`M${-planet.radius / 3} ${-planet.radius * 0.7}q${-planet.radius / 2} ${planet.radius * 0.6} 0 ${planet.radius}`} />}
              </g>
            );
          })}
          <path d="M342 34q-39-21-72 15m1-9-1 9 10-1" />
          <path d="M73 349l28-17 27 18-8 31-31 1zM73 349l47 32-19-49-12 50 39-32z" fill="#f4e6c7" strokeLinejoin="round" />
          <path d="M380 350q23 0 33-15m-9 3 9-3-1 9" />
        </g>
        <g className="drawing-handwriting" fill="currentColor">
          <text x="348" y="24" transform="rotate(5 348 24)">what if...?</text>
          <text x="153" y="394" transform="rotate(-4 153 394)">side quests welcome</text>
        </g>
        <text x="365" y="377" className="drawing-caption" fill="currentColor">NOT TO SCALE. OBVIOUSLY.</text>
      </svg>
      <figcaption>
        <span className="notebook-note" aria-live="polite">{notes[nudges % notes.length]}</span>
        <button className="nudge-button" type="button" onClick={() => setNudges((value) => value + 1)}>Nudge the universe <span aria-hidden="true">↗</span></button>
      </figcaption>
      <span className="notebook-footnote">a doodle for <a href="#case-study-gostarmap">GoStarMap</a> · orbital accuracy sold separately</span>
    </figure>
  );
}

function ProjectSketch({ name }: { name: string }) {
  return (
    <div className={`project-sketch sketch-${name.toLowerCase()}`} aria-hidden="true">
      <span className="sketch-label">{name === 'GoStarMap' ? '01 / A LITTLE UNIVERSE' : name === 'SmolDungeon' ? '02 / DOWN THE RABBIT HOLE' : '03 / UNDER THE HOOD'}</span>
      <svg viewBox="0 0 340 180" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {name === 'GoStarMap' ? <>
          <ellipse cx="171" cy="92" rx="119" ry="43" transform="rotate(-18 171 92)" strokeDasharray="3 5" />
          <ellipse cx="171" cy="92" rx="87" ry="24" transform="rotate(-18 171 92)" />
          <circle cx="171" cy="92" r="32" fill="#e9b75c" /><ellipse cx="171" cy="92" rx="13" ry="32" />
          <path d="M140 92h62M143 78q29-7 56 0M143 106q29 7 56 0" />
          <circle cx="257" cy="54" r="13" fill="#c4c7e2" /><circle cx="89" cy="119" r="7" fill="#b8c69c" />
          <Star x={77} y={42} /><Star x={276} y={136} size={7} />
        </> : name === 'SmolDungeon' ? <>
          <path d="M114 158V66a56 56 0 0 1 112 0v92" fill="#cad1b7" />
          <path d="M133 158V69a37 37 0 0 1 74 0v89" fill="#334e45" />
          <path d="M114 68h19m-14-29 17 10m9-30 10 17m17-26v20m23-12-9 18m29 2-16 12m26 17h-18M114 98h19m-19 29h19m74-29h19m-19 29h19" />
          <path d="M155 139h36v13h19v13h22M148 152h-15v13h-23M86 80v37m-9-26h18m-9-31q-13 14 0 21 12-8 0-21" />
          <path d="M164 91h5m10 0h5" stroke="#f6e6aa" strokeWidth="4" />
          <Star x={258} y={72} /><path d="M248 136l12-8 13 8-5 15h-15zM248 136h25l-13 15z" />
        </> : <>
          <rect x="76" y="30" width="188" height="112" rx="6" fill="#f6dfd2" />
          <path d="M76 52h188M86 41h2m8 0h2m8 0h2M95 74l9 7-9 7m20 1h25M94 106h57m-57 10h36M68 152h145" />
          <circle cx="226" cy="113" r="30" fill="#f9f5ea" /><circle cx="226" cy="113" r="22" />
          <path d="M247 134l24 25M214 113l8 8 16-19" strokeWidth="3" />
          <Star x={54} y={86} size={9} /><Star x={287} y={41} size={7} />
        </>}
      </svg>
    </div>
  );
}

function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <article className={compact ? 'project-card compact' : 'project-card'}>
      {!compact ? <ProjectSketch name={project.name} /> : null}
      <div className="project-card__content">
        <div className="project-card__header">
          <span className="eyebrow">{project.category}</span>
          <span className="updated">Updated {formatDate(project.updatedAt)}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
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
                Field notes
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
      </div>
    </article>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const hash = `#case-study-${caseStudy.slug}`;
    const openLinkedStudy = () => {
      if (window.location.hash === hash) setExpanded(true);
    };
    const openClickedStudy = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a')?.getAttribute('href') === hash) {
        setExpanded(true);
      }
    };
    openLinkedStudy();
    window.addEventListener('hashchange', openLinkedStudy);
    document.addEventListener('click', openClickedStudy);
    return () => {
      window.removeEventListener('hashchange', openLinkedStudy);
      document.removeEventListener('click', openClickedStudy);
    };
  }, [caseStudy.slug]);

  return (
    <article className="case-study" id={`case-study-${caseStudy.slug}`}>
      <div className="case-study__intro">
        <span className="eyebrow">{caseStudy.kicker}</span>
        <h3>{caseStudy.projectName}</h3>
        <p>{caseStudy.summary}</p>
        <div className="hero__actions compact-actions">
          <button className="text-button" type="button" aria-expanded={expanded} aria-controls={`notes-${caseStudy.slug}`} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Close field notes −' : 'Read field notes +'}
          </button>
          <a
            className="button secondary"
            href={caseStudy.repoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('project_repo_click', { project: caseStudy.projectName, source: 'case_study' })}
          >
            Repository ↗
          </a>
        </div>
      </div>

      <div className="case-study__details" id={`notes-${caseStudy.slug}`} hidden={!expanded}>
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

  function handleSubmit() {
    trackEvent('contact_submit', {
      intent: form.intent,
      endpoint: 'configured',
    });
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
          Send message
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

function SiteHeader({ blog = false }: { blog?: boolean }) {
  return (
    <header className="site-header section-shell">
      <a className="brand" href="/#main-content">
        <span className="brand-mark" aria-hidden="true">✳</span>
        <span>Hannadio<span className="brand-caption">THE WORKSHOP OF CLAYTON CLOSTIO</span></span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="/#featured">The work</a>
        <a href="/#about">The human</a>
        <a href="/#case-studies">Roadmaps</a>
        <a href="/blog/" aria-current={blog ? 'page' : undefined}>Blog</a>
        <a className="nav-cta" href={githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer section-shell">
      <span>© {new Date().getFullYear()} Clayton Clostio <span aria-hidden="true">✳</span> Hannadio</span>
      <span>Made with curiosity. Occasionally, a plan.</span>
      <div className="footer-links"><a href="/feed.xml">RSS feed</a><a href="#main-content">Back to the top ↑</a></div>
    </footer>
  );
}

function NotebookSketch() {
  return (
    <div className="blog-doodle" aria-hidden="true">
      <svg viewBox="0 0 300 220" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-9 145 110)">
          <path d="M63 33h150v151H63z" fill="#e9dfc4" />
          <path d="M80 33h133v151H80z" fill="#fbf8ed" />
          <path d="M101 64h87m-87 19h87m-87 19h87m-87 19h60m-60 19h39" stroke="#a5b3a2" />
          <path d="M57 49h16m-16 24h16m-16 24h16m-16 24h16m-16 24h16m-16 24h16" strokeWidth="3" />
          <path d="M180 142l43-87 12 6-43 87-16 16z" fill="#e4b95e" />
          <path d="M180 142l12 6m-5-3 42-87M176 164l4-11" />
        </g>
        <Star x={249} y={142} size={12} /><Star x={41} y={93} size={8} />
        <path d="M236 34q20-11 28 1m-4-9 4 9-10 3" />
      </svg>
      <span className="handwritten">in progress, on purpose.</span>
    </div>
  );
}

function BlogEntry({ post }: { post: BlogPost }) {
  return (
    <article className="notebook-entry">
      <div className="entry-date"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>{post.minutes} min read</span></div>
      <div className="entry-copy">
        {post.project ? <span className="eyebrow">{post.project}</span> : null}
        <h3><a href={postUrl(post.slug)}>{post.title}</a></h3>
        <p>{post.description}</p>
        <div className="topic-row" aria-label="Post topics">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <a className="entry-arrow" href={postUrl(post.slug)} aria-label={`Read ${post.title}`}><span aria-hidden="true">↗</span></a>
    </article>
  );
}

function BlogIndex() {
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('All projects');
  const projectNames = Array.from(new Set(posts.map((post) => post.project).filter((name): name is string => Boolean(name)))).sort();
  const filtered = posts.filter((post) => (project === 'All projects' || post.project === project) &&
    [post.title, post.description, post.project, ...post.tags].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <>
      <AnalyticsLoader />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader blog />
      <main id="main-content" className="section-shell blog-page">
        <section className="blog-hero" aria-labelledby="blog-title">
          <div><span className="eyebrow">Hannadio / The notebook</span><h1 id="blog-title">Notes from<br /><em>the workbench.</em></h1><p>Small discoveries, experiments in progress, and the occasional useful wrong turn. A place for the bits between the milestones.</p><a className="text-link" href="/feed.xml">Follow along with RSS <span aria-hidden="true">↗</span></a></div>
          <NotebookSketch />
        </section>
        <section className="blog-archive" aria-labelledby="archive-title">
          <div className="blog-controls">
            <h2 id="archive-title">All the scribbles.</h2>
            <label className="search-box"><span>Search the notebook</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="A project, an idea, a rabbit hole…" /></label>
            <label className="project-select"><span>Project</span><select value={project} onChange={(event) => setProject(event.target.value)}><option>All projects</option>{projectNames.map((name) => <option key={name}>{name}</option>)}</select></label>
          </div>
          <p className="result-count" role="status">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} in the notebook</p>
          <div className="notebook-entries">{filtered.map((post) => <BlogEntry key={post.slug} post={post} />)}</div>
          {!filtered.length ? <div className="empty-state"><span aria-hidden="true">✳</span><h3>{posts.length ? 'That page is still blank.' : 'A fresh page, waiting for a story.'}</h3><p>{posts.length ? 'Try another search or wander through all the notes.' : 'Notes from the next experiment will land here.'}</p>{posts.length ? <button className="button secondary" onClick={() => { setSearch(''); setProject('All projects'); }}>Show all entries</button> : <a className="button secondary" href="/#projects">Explore the projects</a>}</div> : null}
        </section>
        <div className="blog-colophon"><span className="handwritten">More notes as the experiments continue.</span><a className="text-link" href="/#projects">Back to the workbench ↗</a></div>
      </main>
      <SiteFooter />
    </>
  );
}

function BlogArticle({ post }: { post: BlogPost }) {
  const index = posts.findIndex((entry) => entry.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const relatedProject = projects.find((entry) => entry.name === post.project);
  const projectHref = post.project === 'Portfolio' ? '/#featured' : relatedProject?.url;
  return (
    <>
      <AnalyticsLoader />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader blog />
      <main id="main-content" className="section-shell article-page">
        <a className="text-link article-back" href="/blog/">← Back to the notebook</a>
        <article>
          <header className="article-heading">
            <span className="eyebrow">The notebook{post.project ? ` / ${post.project}` : ''}</span>
            <h1>{post.title}</h1>
            <p className="article-description">{post.description}</p>
            <div className="article-meta"><span>Clayton Clostio</span><span aria-hidden="true">✳</span><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>{post.minutes} min read</span></div>
            <div className="topic-row" aria-label="Post topics">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </header>
          <div className="article-layout">
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            <aside className="article-margin" aria-label="Article navigation">
              {post.headings.length ? <nav aria-label="In this entry"><span className="eyebrow">In this entry</span>{post.headings.map((heading) => <a key={heading.id} href={`#${heading.id}`}>{heading.text}</a>)}</nav> : null}
              {projectHref ? <a className="text-link" href={projectHref}>Explore {post.project} ↗</a> : null}
              <span className="handwritten">a note from<br />the workbench.</span>
            </aside>
          </div>
        </article>
        <nav className="article-pagination" aria-label="More notebook entries">
          {newer ? <a href={postUrl(newer.slug)}><span className="eyebrow">← Newer note</span>{newer.title}</a> : <a className="text-link" href="/blog/">← All entries</a>}
          {older ? <a href={postUrl(older.slug)}><span className="eyebrow">Older note →</span>{older.title}</a> : <a className="text-link" href="/feed.xml">Follow the next experiment via RSS ↗</a>}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}

function MissingPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content" className="section-shell missing-page"><span className="eyebrow">404 / An unexpected detour</span><h1>This page<br /><em>wandered off.</em></h1><p>There’s still plenty to explore back at the workshop.</p><a className="button primary" href="/blog/">Back to the notebook ↗</a><a className="text-link" href="/">Visit the portfolio</a></main><SiteFooter /></>;
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

  function clearFilters() {
    setCategory('All');
    setQuery('');
  }

  function chooseProject() {
    const project = projects[Math.floor(Math.random() * projects.length)];
    setCategory('All');
    setQuery(project.name);
    document.getElementById('projects')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    trackEvent('surprise_project', { project: project.name });
  }

  return (
    <>
      <AnalyticsLoader />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />

      <main id="main-content">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero__copy">
            <div className="eyebrow hero-eyebrow"><span className="little-spark" aria-hidden="true">✳</span> A small corner of the internet, made by hand</div>
            <h1 id="hero-title">Serious curiosity -<br /><em>Odd little</em><br />creations.</h1>
            <p>I’m Clayton. I build tiny universes, send adventurers into dungeons, and write tools for the things I’d rather not do twice.</p>
            <p className="hero-aside">Sometimes in that order. Usually in Go, Python, or Rust.</p>
            <div className="hero__actions">
              <a className="button primary" href="#featured" onClick={() => trackEvent('hero_cta_click', { cta: 'featured' })}>Come have a look <span aria-hidden="true">↘</span></a>
              <button className="text-button surprise-button" type="button" onClick={chooseProject}><span aria-hidden="true">⚄</span> Pick a rabbit hole</button>
            </div>
            <span className="handwritten hero-note">follow the curiosity. see what happens.</span>
          </div>
          <OrbitNotebook />
        </section>

        <div className="section-shell interest-strip" aria-label="Things I build">
          <span className="eyebrow">CURRENT ORBITS</span>
          {['Little worlds', 'Local AI', 'Cosmic detours', 'Useful contraptions'].map((item) => <span key={item}><i aria-hidden="true">✦</i>{item}</span>)}
        </div>

        <section className="section-shell featured-section" id="featured">
          <div className="section-heading row-heading">
            <div><span className="eyebrow">01 / Selected experiments</span><h2>A few things from the workbench.</h2></div>
            <a className="text-link" href="#projects">All {projects.length} projects <span aria-hidden="true">↗</span></a>
          </div>
          <div className="featured-grid">
            {selectedProjects.map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
          <p className="handwritten shelf-note">a little whimsy, a healthy dose of “why not”</p>
        </section>

        <section className="section-shell about-section" id="about">
          <div className="about-doodle" aria-hidden="true">
            <svg viewBox="0 0 240 190" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M63 49h95l-7 92q-39 23-79 0z" fill="#e4b95e" />
              <path d="M156 69h16q36 33-18 48M64 58q46 13 93 0M89 28q-9-12 4-23M113 29q15-17 0-26M139 27q-10-13 2-20M47 161q75 15 141-1" />
              <Star x={189} y={31} size={11} /><Star x={38} y={98} size={8} />
              <path d="M103 91l-10 10 10 10m20-20 10 10-10 10m-8-23-5 26" />
            </svg>
            <span className="handwritten">one more experiment...</span>
          </div>
          <div className="about-copy">
            <span className="eyebrow">02 / The human behind the tabs</span>
            <h2>Hi, I’m Clayton.<br />Perpetually curious.</h2>
            <p>I’m an IT systems engineer who keeps finding reasons to make things. A solar system you can fly through. A dungeon that remembers your last visit. A script that makes a tedious afternoon a little shorter.</p>
            <p>This is where those detours live: games, simulations, local AI experiments, and useful tools. Some are practical. Some start with “I wonder if…” All give me something new to figure out.</p>
            <a className="text-link" href={githubUrl} target="_blank" rel="noreferrer">You’ll find me on GitHub as ctclostio <span aria-hidden="true">↗</span></a>
          </div>
          <span className="about-margin" aria-hidden="true">KEEP ASKING GOOD QUESTIONS.</span>
        </section>

        <section className="section-shell case-study-section" id="case-studies">
          <div className="section-heading row-heading">
            <div><span className="eyebrow">03 / Notes from the process</span><h2>Roadmaps! So many roadmaps, so many roads</h2></div>
            <p>The decisions, the moving parts,<br />and the next things to try.</p>
          </div>
          <div className="case-study-stack">
            {caseStudies.map((caseStudy) => <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />)}
          </div>
        </section>

        <section className="section-shell index-section" id="projects">
          <div className="section-heading row-heading">
            <div><span className="eyebrow">04 / The curiosity cabinet</span><h2>There’s more in the drawers.</h2></div>
            <label className="search-box">
              <span>Find something interesting</span>
              <input value={query} type="search" onChange={(event) => setQuery(event.target.value)}
                onBlur={() => { if (query.trim()) trackEvent('search_used', { query: query.trim().toLowerCase() }); }}
                placeholder="Try astronomy, Python, games…" />
            </label>
          </div>
          <div className="filter-row" role="group" aria-label="Filter projects by category">
            {categories.map((item) => (
              <button key={item} className={category === item ? 'active' : ''} type="button" aria-pressed={category === item}
                onClick={() => { setCategory(item); trackEvent('filter_selected', { category: item }); }}>{item}</button>
            ))}
          </div>
          <p className="result-count" role="status">{filteredProjects.length} of {projects.length} projects{category !== 'All' ? ` · ${category}` : ''}</p>
          <div className="project-grid">
            {filteredProjects.map((project) => <ProjectCard key={project.name} project={project} compact />)}
          </div>
          {filteredProjects.length === 0 ? (
            <div className="empty-state"><span aria-hidden="true">⌕</span><h3>No discoveries in this drawer.</h3><p>Try a different word, or open the whole cabinet.</p><button className="button secondary" type="button" onClick={clearFilters}>Show all projects</button></div>
          ) : null}
        </section>

        <section className="section-shell home-blog-section" aria-labelledby="home-blog-title">
          <div className="section-heading row-heading">
            <div><span className="eyebrow">05 / The notebook</span><h2 id="home-blog-title">The bits between the milestones.</h2></div>
            <a className="text-link" href="/blog/">Visit the blog <span aria-hidden="true">↗</span></a>
          </div>
          <p className="blog-introduction">Small discoveries, experiments in progress, and the occasional useful wrong turn.</p>
          {posts.length ? <div className="notebook-entries">{posts.slice(0, 2).map((post) => <BlogEntry key={post.slug} post={post} />)}</div> : <p className="handwritten">A fresh page. The next experiment starts here.</p>}
        </section>

        <section className="section-shell cta-panel" id="contact">
          <div>
            <span className="eyebrow">06 / Leave a little room for the unexpected</span>
            <h2>Got a curious idea?<br /><em>Pull up a chair.</em></h2>
            <p>A strange simulation, a useful little tool, a game that probably shouldn’t run in a terminal. I’d love to see what you’re working on.</p>
          </div>
          {contactEndpoint ? <ContactForm /> : <div className="contact-note"><span className="handwritten">Good things start with<br />“hey, what if we…”</span><a className="button primary" href={githubUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('final_cta_click', { cta: 'github_profile' })}>Find me on GitHub <span aria-hidden="true">↗</span></a><p>Explore the code, open an issue on a project,<br />or bring an experiment of your own.</p></div>}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

export function Page({ pathname }: { pathname: string }) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/blog') return <BlogIndex />;
  if (path.startsWith('/blog/')) {
    const post = posts.find((entry) => postUrl(entry.slug).replace(/\/$/, '') === path);
    return post ? <BlogArticle post={post} /> : <MissingPage />;
  }
  if (path === '/' || path === '/index.html') return <App />;
  return <MissingPage />;
}

if (!import.meta.env.SSR) {
  const root = document.getElementById('root')!;
  const page = <Page pathname={window.location.pathname} />;
  if (root.hasChildNodes()) hydrateRoot(root, page);
  else createRoot(root).render(page);
}
