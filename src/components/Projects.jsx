const projects = [
  {
    num: '01',
    title: 'Project Alpha',
    desc: 'A full-stack web app built with React, Node.js, and MongoDB. Replace with your real project.',
    tags: ['React', 'Node.js', 'MongoDB'],
    href: '#',
  },
  {
    num: '02',
    title: 'Project Beta',
    desc: 'Backend API with Flask and PostgreSQL. Replace with your actual project details.',
    tags: ['Python', 'Flask', 'PostgreSQL'],
    href: '#',
  },
  {
    num: '03',
    title: 'Project Gamma',
    desc: 'Next.js app with Firebase integration. Customize with your work!',
    tags: ['TypeScript', 'Next.js', 'Firebase'],
    href: '#',
  },
];

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-label reveal">02 — Projects</div>
        <h2 className="editorial-heading reveal">Selected <em>work</em></h2>

        <div className="project-list">
          {projects.map((p) => (
            <a href={p.href} className="project-card reveal" key={p.num}>
              <div className="project-image">
                <div className="image-placeholder dark"><span>PROJECT IMAGE</span></div>
              </div>
              <div className="project-info">
                <span className="project-num">{p.num}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
              <span className="project-arrow">&rarr;</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
