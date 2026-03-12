const skills = [
  'JavaScript', 'React', 'Next.js', 'Node.js',
  'Python', 'TypeScript', 'Photography', 'Illustration',
];

export default function SkillsMarquee() {
  const items = [...skills, ...skills];

  return (
    <div className="marquee">
      <div className="marquee-track">
        {items.map((skill, i) => (
          <span key={i}>
            {i > 0 && <span style={{ margin: '0 16px' }}>·</span>}
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
