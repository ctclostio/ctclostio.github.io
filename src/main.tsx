import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { categories, featuredProjects, projects, type Project } from './data/projects';

type Category = (typeof categories)[number];

const githubUrl = 'https://github.com/ctclostio';
const emailUrl = 'mailto:ctclostio@users.noreply.github.com';
const photoPath = '/profile/clayton-clostio.jpg';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(value));
}

function languageClass(language?: string) {
  return `language-dot ${language?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown'}`;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-card__topline">
        <span>{project.category}</span>
        <span>Updated {formatDate(project.updatedAt)}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="project-card__footer">
        <span className="language">
          <i className={languageClass(project.language)} />
          {project.language || 'Mixed'}
        </span>
        <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
          Repository
        </a>
      </div>
    </article>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="project-row">
      <div>
        <span className="project-row__category">{project.category}</span>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <div className="project-row__meta">
        <span className="language">
          <i className={languageClass(project.language)} />
          {project.language || 'Mixed'}
        </span>
        <span>{formatDate(project.updatedAt)}</span>
        <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
          GitHub
        </a>
      </div>
    </article>
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

  const highlightedProjects = featuredProjects.slice(0, 4);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Clayton Clostio portfolio home">
          Clayton Clostio
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#featured">Work</a>
          <a href="#projects">Index</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero__copy">
            <p className="kicker">Hannadio / ctclostio</p>
            <h1>Practical software projects, kept simple.</h1>
            <p>
              I am Clayton Clostio, an IT systems engineer building focused experiments across AI tools, games,
              simulations, automation, and developer utilities.
            </p>
            <div className="hero__actions">
              <a className="button primary" href="#featured">
                View work
              </a>
              <a className="button secondary" href={emailUrl}>
                Contact
              </a>
            </div>
          </div>

          <aside className="profile-summary" aria-label="Clayton Clostio profile summary">
            <img src={photoPath} alt="Clayton Clostio monogram" />
            <div>
              <h2>Builder profile</h2>
              <p>Local-first projects with clear boundaries, small surfaces, and practical outcomes.</p>
            </div>
            <dl>
              <div>
                <dt>Focus</dt>
                <dd>AI systems, simulation, tools</dd>
              </div>
              <div>
                <dt>Public repos</dt>
                <dd>{projects.length} curated projects</dd>
              </div>
              <div>
                <dt>GitHub</dt>
                <dd>
                  <a href={githubUrl} target="_blank" rel="noreferrer">
                    @ctclostio
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="section-shell about" id="about">
          <div className="section-heading">
            <p className="kicker">About</p>
            <h2>Focused experiments with a practical edge.</h2>
          </div>
          <div className="focus-list">
            <article>
              <h3>AI-native workflows</h3>
              <p>Local LLM gameplay, AI-assisted security tools, voice experiments, and automation.</p>
            </article>
            <article>
              <h3>Interactive systems</h3>
              <p>Game loops, simulations, astronomy visualizations, and terminal-first experiences.</p>
            </article>
            <article>
              <h3>Useful utilities</h3>
              <p>Small tools for documents, diagnostics, productivity, and everyday development work.</p>
            </article>
          </div>
        </section>

        <section className="section-shell" id="featured">
          <div className="section-heading">
            <p className="kicker">Selected Work</p>
            <h2>A smaller set of representative projects.</h2>
          </div>
          <div className="featured-grid">
            {highlightedProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>

        <section className="section-shell projects-section" id="projects">
          <div className="section-heading row-heading">
            <div>
              <p className="kicker">Project Index</p>
              <h2>All public portfolio entries.</h2>
            </div>
            <label className="search-box">
              <span>Search projects</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="AI, Go, Python, game..."
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

          <div className="project-list">
            {filteredProjects.map((project) => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Clayton Clostio / Hannadio</span>
        <span>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={emailUrl}>Contact</a>
        </span>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
