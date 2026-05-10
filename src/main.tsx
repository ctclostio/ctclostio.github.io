import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { caseStudies, categories, featuredProjects, projects, type CaseStudy, type Project } from './data/projects';

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

function ProfilePhoto() {
  const [showPhoto, setShowPhoto] = useState(true);

  return (
    <div className="profile-photo" aria-label="Clayton Clostio profile photo slot">
      {showPhoto ? (
        <img
          src={photoPath}
          alt="Clayton Clostio"
          onError={() => setShowPhoto(false)}
        />
      ) : (
        <div className="profile-photo__placeholder">
          <span>CC</span>
          <small>Photo slot ready</small>
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
            <a href={`#case-study-${project.caseStudySlug}`}>Case study</a>
          ) : null}
          <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
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
          <a className="button secondary" href={caseStudy.repoUrl} target="_blank" rel="noreferrer">
            Repository ↗
          </a>
          <a className="button secondary" href="#projects">
            Back to index
          </a>
        </div>
      </div>

      <div className="case-study__meta">
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
        <a className="brand" href="#top" aria-label="Clayton Clostio portfolio home">
          <span className="brand-mark">HC</span>
          <span>Hannadio</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#featured">Featured</a>
          <a href="#case-studies">Case studies</a>
          <a href="#projects">Projects</a>
          <a className="nav-cta" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero__copy">
            <div className="hero-pill">
              <span className="pulse" /> Clayton Clostio · Hannadio
            </div>
            <h1>AI-native games, simulations, and utilities shipped in public.</h1>
            <p>
              Hello! I am Clayton Clostio (Hannadio), an IT systems engineer and developer of many hobby projects, building practical experiments across Go, Python, Rust, local AI workflows, graphics, terminal tools, and interactive systems.
            </p>
            <div className="hero__actions">
              <a className="button primary" href="#case-studies">Read case studies</a>
              <a className="button secondary" href={githubUrl} target="_blank" rel="noreferrer">View GitHub ↗</a>
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
              <Stat value="2" label="case studies" />
            </div>
            <code className="photo-note">Drop photo at public/profile/clayton-clostio.jpg</code>
          </aside>
        </section>

        <section className="section-shell logo-strip" aria-label="Project domains">
          {['AI security', 'Local LLMs', 'Astronomy', 'Game systems', 'Automation', 'Developer tools'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>

        <section className="section-shell split" id="about">
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
            <p>Representative projects chosen for technical variety, originality, and portfolio value.</p>
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
            <p>
              Two projects now have story-driven breakdowns: what they are, what design problem they solve, how they are built, and where they can go next.
            </p>
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
            <h2>Add Clayton’s photo and keep the portfolio evolving.</h2>
            <p>
              The profile card is ready for a portrait image. Once the file is added, the deployed site will automatically swap the initials placeholder for the photo.
            </p>
          </div>
          <div className="hero__actions">
            <a className="button primary" href={emailUrl}>Contact</a>
            <a className="button secondary" href={githubUrl} target="_blank" rel="noreferrer">Follow on GitHub ↗</a>
          </div>
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
