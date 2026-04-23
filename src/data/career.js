// Career data — pulled from resume.
// Drop your resume PDF at /public/resume.pdf for the download button to work.

export const contact = {
  email: 'saail.work@gmail.com',
  phone: '+91 9326677607',
  location: 'Mumbai, India',
  github: 'https://github.com/csaail',
  linkedin: 'https://linkedin.com/in/csaail',
};

export const summary = `AI and full-stack engineer focused on building intelligent, user-centered solutions. Skilled in AI evaluation pipelines, RAG systems, and microservices using LangChain, OpenAI, DeepSeek, and Hugging Face. Experienced in computer vision (OpenCV), OCR (Mathpix), and extensive LaTeX-based math rendering. Strong front-end background with ReactJS.`;

export const experience = [
  {
    role: 'AI / Full-Stack Software Engineer',
    company: 'Aloes Tree EdTech',
    location: 'Remote',
    dates: 'May 2025 — Dec 2025',
    stack: ['Python', 'LangChain', 'OpenAI', 'React'],
    bullets: [
      'Built an AI-driven math evaluation system using Python and Flask, with OCR support and automated result validation.',
      'Developed backend services for evaluation, OCR processing, and analytics — integrated DeepSeek for complex reasoning workflows.',
      'Implemented a lightweight RAG pipeline using Firestore data and similarity search to improve response accuracy.',
      'Designed interactive math tools in React/Next.js with OCR input and real-time LaTeX rendering.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'Drona Aviation',
    location: 'Mumbai',
    dates: 'Jan 2024 — Oct 2024',
    stack: ['Python', 'ROS', 'ReactJS', 'ElectronJS', 'WordPress'],
    bullets: [
      'Developed plutocontrol (Python library for drone control) and plutocam (media capture via drone camera).',
      'Implemented image processing tasks — QR detection, gesture and color recognition — using Python + OpenCV.',
      'Worked on Plutoblocks, a Blockly-based C++ IDE built with Electron.js. Added new user-friendly features in JavaScript.',
      'Built a custom ROS library for integrating drone systems with robotics platforms.',
      'Designed UI/UX for Plutoblocks (mobile + desktop).',
    ],
  },
  {
    role: 'Freelance Developer — AI, Web Tools, Graphic Design',
    company: 'Self-employed',
    location: 'Remote',
    dates: '2023',
    stack: ['ReactJS', 'Python', 'VS Code APIs', 'Sketchbook'],
    bullets: [
      'Built responsive, user-friendly web interfaces with ReactJS — emphasis on performance and intuitive design.',
      'Designed UI/UX, custom graphics, and visual elements for projects like Plutoblocks.',
      'Created vector art and illustrations for various digital projects.',
      'Worked on AI model training, evaluation, and testing.',
      'Developed a custom VS Code extension for drone flashing, monitoring, and related tasks.',
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
    degree: 'B.Sc. Computer Science (Honours)',
    school: 'Somaiya Vidyavihar, Mumbai',
    dates: '2020 — 2023',
  },
  {
    degree: 'HSC — Science',
    school: 'Dombivli, MU',
    dates: '2018 — 2020',
  },
];

export const certifications = [
  {
    name: 'Google Cloud — Cloud Engineering Track',
    issuer: 'Google',
    date: '2021',
    link: '',
  },
  {
    name: 'Google Cloud — Data Science & ML Track',
    issuer: 'Google',
    date: '2021',
    link: '',
  },
];

export const skills = [
  { group: 'Programming', items: ['Python', 'JavaScript', 'C++', 'SQL'] },
  { group: 'AI / ML', items: ['LangChain', 'Hugging Face', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'BERT', 'Keras', 'NumPy', 'Pandas'] },
  { group: 'Frameworks', items: ['Flask', 'ReactJS', 'Next.js'] },
  { group: 'Databases', items: ['Firestore', 'MongoDB', 'SQL'] },
  { group: 'Tools & Platforms', items: ['ROS', 'LaTeX', 'OpenCV', 'GCP', 'Mathpix'] },
  { group: 'Languages', items: ['English', 'Hindi', 'Marathi'] },
];

export const resumePath = '/resume.pdf';
