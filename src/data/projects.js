// Featured projects for the portfolio grid.
// Drop thumbnails in /public/projects/<slug>.png and run `node scripts/optimize-images.js`
// to generate .webp versions (3:4 portrait).
// codeLink → GitHub repo (or wherever the code lives). liveLink → live demo URL.
// Leave liveLink as '' if there's no live site yet — the "Live Site" button will hide.

const projects = [
  {
    slug: 'rydout',
    name: 'Rydout',
    tagline: 'Real-time motorcycle rider tracking for social riding and map-based coordination.',
    description:
      'Enables bike riders to form groups, track friends, coordinate rides, and share locations live via real-time syncing and geolocation.',
    tech: ['Firebase', 'Google Maps', 'React', 'Node.js'],
    thumb: '/projects/rydout.webp',
    codeLink: 'https://github.com/csaail/rydout',
    liveLink: '',
  },
  {
    slug: 'roastmyrepo',
    name: 'RoastMyRepo',
    tagline: 'An AI that humorously critiques GitHub repositories.',
    description:
      'Paste a repo link — the platform analyzes project structure, README quality, organization, and code practices, then generates a humorous roast with useful suggestions.',
    tech: ['React', 'Python', 'OpenAI API', 'GitHub API'],
    thumb: '/projects/roastmyrepo.webp',
    codeLink: 'https://github.com/csaail/roastmyrepo',
    liveLink: '',
  },
  {
    slug: 'readmyrepo',
    name: 'ReadMyRepo',
    tagline: 'A repository understanding engine that explains codebases.',
    description:
      'Parses repositories to generate architecture explanations, dependency maps, onboarding guides, and summaries of how modules interact.',
    tech: ['Python', 'Tree-sitter', 'Graphviz', 'Embeddings', 'React'],
    thumb: '/projects/readmyrepo.webp',
    codeLink: 'https://github.com/csaail/readmyrepo',
    liveLink: '',
  },
  {
    slug: 'equationos',
    name: 'EquationOS',
    tagline: 'A math knowledge engine + structured dataset generator for handwritten and digital math.',
    description:
      'Upload equations, PDFs, or screenshots and get structured JSON, topic graphs, explanations, and categorized relationships. Also converts OCR outputs into clean datasets for training AI models.',
    tech: ['Flask', 'OCR', 'Hugging Face', 'LaTeX', 'Python', 'React'],
    thumb: '/projects/equationos.webp',
    codeLink: 'https://github.com/csaail/equationos',
    liveLink: '',
  },
  {
    slug: 'cubeflow',
    name: 'CubeFlow',
    tagline: 'An interactive Rubik’s Cube learning platform with guided solving.',
    description:
      'Teaches cube solving through interactive 3D tutorials, webcam recognition, progress tracking, and skill-tree based learning experiences.',
    tech: ['Three.js', 'OpenCV', 'React', 'Firebase'],
    thumb: '/projects/cubeflow.webp',
    codeLink: 'https://github.com/csaail/cubeflow',
    liveLink: '',
  },
  {
    slug: 'parallax',
    name: 'parallax',
    tagline: 'A movie identity analyzer that reads your Letterboxd taste.',
    description:
      'Connects to Letterboxd profiles to analyze ratings, genres, directors, and viewing patterns — generating a personality profile and cinematic identity map.',
    tech: ['Letterboxd API', 'React', 'Python', 'Data Viz'],
    thumb: '/projects/parallax.webp',
    codeLink: 'https://github.com/csaail/parallax',
    liveLink: '',
  },
];

export default projects;
