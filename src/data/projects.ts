export type Project = {
  name: string;
  description: string;
  url: string;
  homepage?: string;
  language?: string;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  featured?: boolean;
  caseStudySlug?: string;
  category: 'AI' | 'Games' | 'Simulation' | 'Utilities' | 'Web' | 'Learning';
};

export type CaseStudy = {
  slug: string;
  projectName: string;
  kicker: string;
  summary: string;
  repoUrl: string;
  role: string;
  stack: string[];
  problem: string;
  approach: string[];
  implementation: string[];
  outcomes: string[];
  nextSteps: string[];
};

export const projects: Project[] = [
  {
    name: 'reaper',
    description: 'AI-powered black-box penetration testing tool focused on OWASP-style security workflows.',
    url: 'https://github.com/ctclostio/reaper',
    language: 'Python',
    topics: ['ai', 'claude', 'mcp', 'owasp', 'pentesting', 'python', 'security'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:06:19Z',
    featured: true,
    category: 'AI',
  },
  {
    name: 'MojaveAdventure',
    description: 'Terminal Fallout RPG with a local-LLM-powered AI Dungeon Master, written in Rust.',
    url: 'https://github.com/ctclostio/MojaveAdventure',
    language: 'Rust',
    topics: ['ai', 'fallout', 'game', 'llm', 'rpg', 'rust', 'terminal'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:08Z',
    featured: true,
    category: 'Games',
  },
  {
    name: 'SmolDungeon',
    description: 'Local-first tactical dungeon crawler with a Go CLI, YAML scenarios, SQLite-backed DM infrastructure, and optional LLM narration/enemy actions.',
    url: 'https://github.com/ctclostio/SmolDungeon',
    language: 'Go',
    topics: ['ai', 'dungeon-crawler', 'game', 'go', 'llm'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:01Z',
    featured: true,
    caseStudySlug: 'smoldungeon',
    category: 'Games',
  },
  {
    name: 'GoStarMap',
    description: 'Real-time 3D solar system and procedural-galaxy simulator in Go with raylib, custom shaders, and Keplerian orbital mechanics.',
    url: 'https://github.com/ctclostio/GoStarMap',
    language: 'Go',
    topics: ['3d', 'astronomy', 'go', 'visualization'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:48:53Z',
    featured: true,
    caseStudySlug: 'gostarmap',
    category: 'Simulation',
  },
  {
    name: 'ReaderTTS',
    description: 'VibeVoice-based TTS pipeline tuned to clone the voice of Kratos / Christopher Judge.',
    url: 'https://github.com/ctclostio/ReaderTTS',
    language: 'Python',
    topics: ['ai', 'python', 'tts', 'vibevoice', 'voice-cloning'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:04Z',
    featured: true,
    category: 'AI',
  },
  {
    name: 'SpaceSimulationPython',
    description: '3D solar system simulation built with Python and Ursina.',
    url: 'https://github.com/ctclostio/SpaceSimulationPython',
    language: 'Python',
    topics: ['3d', 'astronomy', 'python', 'simulation', 'ursina'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:07Z',
    featured: true,
    category: 'Simulation',
  },
  {
    name: 'pdf-splitter',
    description: 'Split PDFs into size-based chunks and compress them into ZIP files.',
    url: 'https://github.com/ctclostio/pdf-splitter',
    language: 'Python',
    topics: ['cli', 'compression', 'pdf', 'python'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:00Z',
    category: 'Utilities',
  },
  {
    name: 'whiteMonster',
    description: 'Lightweight PowerShell mouse jiggler that prevents idle timeouts and sleep mode.',
    url: 'https://github.com/ctclostio/whiteMonster',
    language: 'PowerShell',
    topics: ['mouse-jiggler', 'powershell', 'utility', 'windows'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:03:36Z',
    category: 'Utilities',
  },
  {
    name: 'baseball-stats-app',
    description: 'Modern web application for tracking and analyzing baseball statistics.',
    url: 'https://github.com/ctclostio/baseball-stats-app',
    language: 'Web',
    topics: ['baseball', 'stats', 'web'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:05Z',
    category: 'Web',
  },
  {
    name: 'Internal-OCR-Tool',
    description: 'Document OCR application that turns physical documents and images into searchable digital formats.',
    url: 'https://github.com/ctclostio/Internal-OCR-Tool',
    language: 'Python',
    topics: ['document-processing', 'ocr', 'python'],
    stars: 1,
    forks: 0,
    updatedAt: '2026-05-06T03:03:40Z',
    category: 'Utilities',
  },
  {
    name: 'PythonPlayground',
    description: 'Self-hosted portfolio of mini Python projects.',
    url: 'https://github.com/ctclostio/PythonPlayground',
    language: 'Python',
    topics: ['flask', 'portfolio', 'python'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:03:32Z',
    category: 'Learning',
  },
  {
    name: 'GameJAM',
    description: 'Weekly game-jam experiments and prototypes built while practicing game design.',
    url: 'https://github.com/ctclostio/GameJAM',
    language: 'Game Maker Language',
    topics: ['game-jam', 'gamemaker', 'games'],
    stars: 1,
    forks: 0,
    updatedAt: '2026-05-06T03:03:41Z',
    category: 'Games',
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: 'smoldungeon',
    projectName: 'SmolDungeon',
    kicker: 'AI-assisted terminal game architecture',
    summary:
      'A local-first tactical dungeon crawler that keeps the primary experience in the terminal while preserving room for a Go/Fiber Dungeon Master service, persistent game state, and optional LLM-driven narration.',
    repoUrl: 'https://github.com/ctclostio/SmolDungeon',
    role: 'Solo builder: gameplay loop, Go workspace, CLI UX, scenario format, persistence direction, and AI integration surface.',
    stack: ['Go', 'CLI', 'YAML scenarios', 'Fiber', 'SQLite', 'OpenAI-compatible LLM APIs'],
    problem:
      'Most LLM game prototypes lean on a browser shell or fragile one-shot prompts. SmolDungeon explores a more durable shape: a fast terminal-native tactics loop where scenarios, saves, and state transitions are explicit enough to test, continue, and evolve.',
    approach: [
      'Make the CLI the primary product surface so the game can run locally without a browser frontend or Node runtime.',
      'Use shared YAML scenarios to separate encounter design from engine code and make new adventures easy to add.',
      'Keep the Go DM/server module as optional infrastructure for APIs, tests, SQLite event sourcing, snapshots, and LLM-assisted enemy/narration features.',
      'Treat LLM output as an enhancement layer around deterministic game actions instead of the sole source of truth for game state.',
    ],
    implementation: [
      'Root Go workspace with `apps/cli` for the terminal client, `apps/dm-go` for the Go DM/server module, and `scenarios/` for shared encounter definitions.',
      'CLI commands for scenario discovery, starting a run, continuing saves, listing saves, and pointing to alternate scenario directories.',
      'Go/Fiber DM endpoints for state summaries, dice checks, action application, session management, and health checks.',
      'SQLite persistence model based on immutable events plus snapshots so sessions can be reconstructed instead of overwritten.',
      'OpenAI-compatible LLM configuration for narration and AI enemy actions through environment variables.',
    ],
    outcomes: [
      'A Go-first, CLI-first game surface that can be built as a single terminal binary.',
      'A cleaner architecture boundary between deterministic state, scenario data, optional API infrastructure, and LLM behavior.',
      'Test commands cover both modules: `go test ./apps/cli/...` and `go test ./apps/dm-go/...`.',
    ],
    nextSteps: [
      'Add richer scenario content and enemy behavior packs.',
      'Tighten save-game UX and replay/debug tooling around the event log.',
      'Add a short terminal demo GIF for the portfolio card once the visual loop is stable.',
    ],
  },
  {
    slug: 'gostarmap',
    projectName: 'GoStarMap',
    kicker: 'Real-time astronomy visualization',
    summary:
      'A Go/raylib 3D space simulator that combines a navigable solar system, real JPL orbital elements, custom GLSL planet lighting, and a procedural 100,000-star Milky Way.',
    repoUrl: 'https://github.com/ctclostio/GoStarMap',
    role: 'Solo builder: renderer, orbital package, galaxy generation, controls, HUD targeting, shader lighting, and performance strategy.',
    stack: ['Go', 'raylib-go', 'GLSL shaders', 'Kepler solver', 'JPL Horizons data', 'Procedural generation'],
    problem:
      'Astronomy demos often choose between visual spectacle and inspectable simulation. GoStarMap aims for both: a fast first-person 3D environment that is fun to fly through while still grounding planet positions in Keplerian mechanics and real orbital elements.',
    approach: [
      'Use Go and raylib for a compact real-time renderer with custom shader hooks for the Sun and planets.',
      'Split orbital math into a pure-Go package so Kepler solving, time scaling, and coordinate conversions can be tested without a graphics context.',
      'Generate a galaxy-scale backdrop procedurally, then use level-of-detail and distance culling to keep the frame budget under control.',
      'Expose simulation time, lighting presets, teleport targeting, and HUD overlays as keyboard-driven exploration tools.',
    ],
    implementation: [
      'Planet motion is advanced from JPL Horizons J2000.0 orbital elements through a Newton-Raphson Kepler solver.',
      'The renderer draws the Sun, eight planets, named nearby stars, and a procedural Milky Way disk/bulge/spiral-arm star field.',
      'Custom GLSL shaders provide HDR-style Sun emission and enhanced planet lighting with runtime lighting presets.',
      'The camera tracks yaw and pitch explicitly, clamps near-vertical look angles, and rebuilds forward/right vectors to avoid gimbal-lock navigation issues.',
      'Performance work includes star LOD bands, render-distance culling, precomputed star colors, cached planet meshes, and reduced per-frame shader uniform churn.',
    ],
    outcomes: [
      'Real-time 3D exploration with adjustable window size, fullscreen mode, target inspection, constellation lines, and time controls from paused to high-speed orbital motion.',
      'Pure-Go tests for `orbital/...` and `internal/...` keep math and celestial helpers CI-friendly despite native graphics dependencies.',
      'A strong visual portfolio piece that demonstrates simulation, rendering, input systems, data modeling, and performance trade-offs in Go.',
    ],
    nextSteps: [
      'Capture screenshots or a short fly-through clip for the portfolio once a preferred camera route is chosen.',
      'Reintroduce bloom/post-processing after the current shader pipeline is stable.',
      'Add more educational overlays for scale, orbital eccentricity, and selected-body comparisons.',
    ],
  },
];

export const categories = ['All', 'AI', 'Games', 'Simulation', 'Utilities', 'Web', 'Learning'] as const;

export const allTopics = Array.from(new Set(projects.flatMap((project) => project.topics))).sort();

export const featuredProjects = projects.filter((project) => project.featured);
