// Projects for the home page list.
//
// No images needed: the list preview is generated ink artwork (style picked by
// `category`), and opening a project shows an architecture diagram drawn from
// `flow` — the stages data passes through, input first, output last (4–6 steps,
// keep each label under ~14 characters so it fits its box).
//
// category    → 'AI & LLMs' | 'Vision & robotics' | anything else (chart artwork).
// work        → optional { company, bullets } for things built in a job; the project
//               intro pulls that company's bullets from career.js (`bullets` picks
//               which ones, by position, when the job covered other work too).
// links       → optional extra buttons: [{ label, url }] (e.g. package pages).
// status      → optional note shown in the project intro (e.g. for a preview build).
// codeLink    → GitHub repo (leave '' for private/work code).
// liveLink    → live demo. '/path' = a page inside this React app (e.g. '/cubeflow');
//               '/path/' (trailing slash) = a separate app built into public/path/
//               (e.g. '/roastmyrepo/', see apps/); anything else = external URL.

const projects = [
  {
    slug: 'math-eval',
    name: 'AI Math Evaluator',
    tagline: 'Grades handwritten maths with Mathpix OCR and DeepSeek multi-step reasoning.',
    description:
      'An AI maths evaluation system built with Python and Flask. Mathpix OCR reads the submitted answer, DeepSeek works through the solution with multi-step reasoning, and every result is validated automatically before it is returned.',
    category: 'AI & LLMs',
    flow: ['Answer image', 'Mathpix OCR', 'LaTeX parse', 'DeepSeek', 'Validation', 'Graded result'],
    tech: ['Python', 'Flask', 'Mathpix', 'DeepSeek'],
    work: { company: 'Sophos Educational Solutions Limited', bullets: [3] }, // the evaluator bullet
    codeLink: '',
    liveLink: '',
  },
  {
    slug: 'roastmyrepo',
    name: 'RoastMyRepo',
    tagline: 'Paste a GitHub repo, get roasted — a retro arcade-style roast generator.',
    description:
      'A retro, arcade-style web app: paste a GitHub repo link and get roasted — punchy burns about READMEs, commit messages, tests and code habits, with tips to fix them. Built as a fast, playful single-page app with a pixel-art UI.',
    category: 'AI & LLMs',
    flow: ['Paste repo URL', 'Roast engine', 'Burn lines', 'Fix-it tips'],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    codeLink: 'https://github.com/csaail/roastmyrepo',
    liveLink: '/roastmyrepo/',
  },
  {
    slug: 'plutocontrol',
    name: 'plutocontrol & plutocam',
    tagline: 'Python libraries for programmable drone flight and on-board vision.',
    description:
      'plutocontrol (pip install plutocontrol) is a Python library for controlling Pluto drones — connecting, flight control and sensor data; plutocam streams and records from the drone’s camera module. On top of the feed, OpenCV handles QR detection plus gesture and colour recognition, and a custom ROS library connects the drone to robotics platforms.',
    category: 'Vision & robotics',
    flow: ['Python script', 'plutocontrol', 'Drone', 'plutocam feed', 'OpenCV', 'QR · gestures'],
    tech: ['Python', 'OpenCV', 'ROS'],
    work: { company: 'Drona Aviation', bullets: [0, 1, 3] }, // skips the Plutoblocks + UI/UX bullets
    links: [
      { label: 'plutocontrol on PyPI', url: 'https://pypi.org/project/plutocontrol/' },
      { label: 'plutocam on PyPI', url: 'https://pypi.org/project/plutocam/' },
    ],
    codeLink: '',
    liveLink: '',
  },
  {
    slug: 'cubeflow',
    name: 'CubeFlow',
    tagline: 'An interactive Rubik’s Cube learning platform with guided solving.',
    description:
      'Teaches cube solving through interactive 3D tutorials, webcam recognition, progress tracking, and skill-tree based learning experiences.',
    category: 'Vision & robotics',
    flow: ['Webcam', 'OpenCV scan', 'Cube state', 'Three.js 3D', 'Lessons'],
    tech: ['Three.js', 'OpenCV', 'React', 'Firebase'],
    codeLink: 'https://github.com/csaail/cubeflow',
    liveLink: '/cubeflow',
  },
  {
    slug: 'shortclub',
    name: 'Shortclub',
    tagline: 'A curated streaming home for independent short films from around the world.',
    description:
      'A film-club style site for discovering short films: a searchable catalogue (title, director or genre), curated collections, filmmaker pages and editorial picks. Every film and collection page is statically generated with its own metadata, and the screening room ships with a preview player while streaming is out of scope.',
    category: 'Web app',
    flow: ['Film data', 'Static pages', 'Collections', 'Title search', 'Screening room'],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS'],
    codeLink: '',
    liveLink: '',
  },
];

export default projects;
