// Career data — kept in sync with the résumé PDF (public/resume.pdf).
import { site } from './site';

export const contact = {
  email: site.email,
  phone: '+91 9326677607',
  location: 'Mumbai, India',
  github: 'https://github.com/csaail',
  linkedin: 'https://linkedin.com/in/saail',
};

export const summary = `AI and full-stack software engineer with 1.5+ years of experience building web applications and AI-powered products. Experienced in developing end-to-end solutions, from backend services and AI integration to responsive front ends, with a focus on clean, reliable and user-friendly software.`;

// location is optional — leave it '' to hide it.
export const experience = [
  {
    role: 'AI / Full-Stack Software Engineer',
    company: 'Sophos Educational Solutions Limited',
    location: '',
    dates: 'May 2025 — Nov 2026',
    stack: ['Python', 'FastAPI', 'Flask', 'LangChain', 'DeepSeek', 'React', 'TypeScript', 'Firebase', 'KaTeX', 'MathLive'],
    bullets: [
      'Built a bilingual (English/Cantonese) AI maths tutoring platform for HKDSE and TSA students: a diagnostic test finds each student’s weak topics, then they learn through AI-generated lessons with animated, narrated walkthroughs, practise from a curated question bank and sit mock papers that are marked automatically.',
      'Designed the content flow: a FastAPI backend uses LangChain with RAG over past exam papers to generate lessons, quizzes and SVG animation scenes for each concept, validates them automatically, and caches them in Firestore so every student is served the same checked content.',
      'Built the React/TypeScript front end, using KaTeX to display maths and MathLive for handwritten or typed answers, which the backend checks with SymPy; lessons are narrated with local text-to-speech.',
      'Built an AI maths evaluation system (Python/Flask) with Mathpix OCR input, automated result validation and DeepSeek multi-step reasoning.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'Drona Aviation',
    location: 'Mumbai',
    dates: 'Jan 2024 — Oct 2024',
    stack: ['Python', 'OpenCV', 'FFmpeg', 'Flask', 'ROS', 'React', 'Electron.js', 'VS Code Extension API', 'WordPress'],
    bullets: [
      'Built and published plutocontrol (Python drone-control library) and plutocam (drone camera capture) on PyPI.',
      'Built example projects on these libraries: drone control via joystick, keyboard, mouse and voice, an H.264 camera feed decoded with FFmpeg and streamed over Flask, and OpenCV object tracking driving automated flight adjustments.',
      'Implemented computer vision features (QR detection, gesture and colour recognition) with Python and OpenCV.',
      'Built a custom ROS library to integrate STM32-based drones with robotics platforms.',
      'Extended Plutoblocks, a Blockly-based C++ IDE (Electron.js), and designed its mobile/desktop UI/UX.',
      'Built HexFlash, a VS Code extension for STM32 DFU firmware flashing with auto device detection and progress monitoring.',
    ],
  },
];

export const education = [
  {
    degree: 'M.Sc. Computer Science',
    school: 'HSNC University, Mumbai',
    dates: '2023 — 2025',
  },
  {
    degree: 'B.Sc. (Hons) Computer Science',
    school: 'Somaiya Vidyavihar, Mumbai',
    dates: '2020 — 2023',
  },
];

// date and link are optional.
export const certifications = [
  {
    name: 'Cloud Engineering and Data Science & ML tracks',
    issuer: 'Google Cloud',
    date: '',
    link: '',
  },
];

// 'Spoken Languages' shows on the résumé page but not in the home-page skills section.
export const skills = [
  { group: 'Programming', items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'SQL'] },
  { group: 'AI / ML', items: ['LangChain', 'OpenAI API', 'RAG', 'Hugging Face', 'PyTorch', 'scikit-learn', 'OpenCV'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Three.js', 'Tailwind CSS', 'Vite'] },
  { group: 'Backend & Data', items: ['FastAPI', 'Flask', 'Firebase', 'MongoDB'] },
  { group: 'Tools & Testing', items: ['Git', 'GCP', 'Vitest', 'pytest'] },
  { group: 'Spoken Languages', items: ['English', 'Hindi', 'Marathi'] },
];

export const resumePath = '/resume.pdf';
