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
  category: 'AI' | 'Games' | 'Simulation' | 'Utilities' | 'Web' | 'Learning';
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
    description: 'Turn-based dungeon crawler with a Go Fiber backend, SQLite event sourcing, and LLM-driven enemies.',
    url: 'https://github.com/ctclostio/SmolDungeon',
    language: 'Go',
    topics: ['ai', 'dungeon-crawler', 'game', 'go', 'llm'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:05:01Z',
    featured: true,
    category: 'Games',
  },
  {
    name: 'GoStarMap',
    description: '3D star map and celestial-distance toy in Go.',
    url: 'https://github.com/ctclostio/GoStarMap',
    language: 'Go',
    topics: ['3d', 'astronomy', 'go', 'visualization'],
    stars: 0,
    forks: 0,
    updatedAt: '2026-05-06T03:48:53Z',
    featured: true,
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

export const categories = ['All', 'AI', 'Games', 'Simulation', 'Utilities', 'Web', 'Learning'] as const;

export const allTopics = Array.from(new Set(projects.flatMap((project) => project.topics))).sort();

export const featuredProjects = projects.filter((project) => project.featured);
