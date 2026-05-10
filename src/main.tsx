import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { categories, featuredProjects, projects, type Project } from './data/projects';

type Category = (typeof categories)[number];

const githubUrl = 'https://github.com/ctclostio';
const emailUrl = 'mailto:ctclostio@users.noreply.github.com';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
}

function languageClass(language?: string) {
  return `language-dot ${language?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown'}`;
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
        <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
          GitHub <span aria-hidden="true">↗</span>
        </a>
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
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ctclostio portfolio home">
          <span className="brand-mark">ct</span>
          <span>ctclostio</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#featured">Featured</a>
          <a href="#projects">Projects</a>
          <a href="#focus">Focus</a>
          <a className="nav-cta" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero__copy">
            <div className="hero-pill">
              <span className="pulse" /> Public portfolio · GitHub Projects
            </div>
            <h1>AI tools, simulations, games, and utilities shipped in public.</h1>
            <p>
              I build practical experiments across Python, Go, Rust, web apps, local AI workflows, and interactive systems — from LLM-powered dungeon crawlers to 3D astronomy tools.
            </p>
            <div className="hero__actions">
              <a className="button primary" href="#projects">Explore projects</a>
              <a className="button secondary" href={githubUrl} target="_blank" rel="noreferrer">View GitHub ↗</a>
            </div>
          </div>
          <div className="hero-console" aria-label="Project summary terminal card">
            <div className="console-bar">
              <span />
              <span />
              <span />
            </div>
            <code>$ gh repo list ctclostio --public</code>
            <div className="console-grid">
              <Stat value={`${projects.length}`} label="curated repos" />
              <Stat value={`${languageCount}+`} label="languages" />
              <Stat value={`${aiProjects}`} label="AI projects" />
              <Stat value="2026" label="active builds" />
            </div>
          </div>
        </section>

        <section className="section-shell logo-strip" aria-label="Project domains">
          {['AI security', 'Local LLMs', 'Astronomy', 'Game systems', 'Automation', 'Developer tools'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>

        <section className="section-shell split" id="focus">
          <div>
            <span className="eyebrow">Build focus</span>
            <h2>Curious systems with a practical edge.</h2>
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
            <p>Representative projects chosen for technical variety, originality, and portfolio value.</p>
          </div>
          <div className="featured-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
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
                onChange={(event) => setQuery(event.target.value)}
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
                onClick={() => setCategory(item)}
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

        <section className="section-shell cta-panel">
          <div>
            <span className="eyebrow">Next up</span>
            <h2>Keep the portfolio alive as projects evolve.</h2>
            <p>
              The site is structured so project cards can be refreshed from GitHub metadata, then redeployed through GitHub Pages.
            </p>
          </div>
          <div className="hero__actions">
            <a className="button primary" href={emailUrl}>Contact</a>
            <a className="button secondary" href={githubUrl} target="_blank" rel="noreferrer">Follow on GitHub ↗</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} ctclostio</span>
        <span>Built with React, Vite, and GitHub Pages.</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
