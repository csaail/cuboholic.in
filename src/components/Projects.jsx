import { useState, useEffect } from 'react';

const GITHUB_USER = 'csaail';
const EXCLUDED = ['csaail', 'generative-ai-for-beginners', 'blockly']; // forks / profile readme

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`)
      .then((r) => {
        if (!r.ok) throw new Error('GitHub API error');
        return r.json();
      })
      .then((data) => {
        const filtered = data
          .filter((r) => !r.fork && !EXCLUDED.includes(r.name))
          .slice(0, 6);
        setRepos(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-label reveal">02 — Projects</div>
        <h2 className="editorial-heading reveal">
          Selected <em>work</em>
        </h2>

        {loading && (
          <div className="project-list">
            {[1, 2, 3].map((i) => (
              <div className="project-card project-skeleton" key={i}>
                <div className="project-info">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-desc" />
                  <div className="skeleton-line skeleton-desc short" />
                  <div className="project-tags">
                    <span className="skeleton-tag" />
                    <span className="skeleton-tag" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="gh-error">
            <p>Couldn't load repos from GitHub.</p>
            <a
              href={`https://github.com/${GITHUB_USER}?tab=repositories`}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub &rarr;
            </a>
          </div>
        )}

        {!loading && !error && (
          <div className="project-list">
            {repos.map((repo, i) => (
              <a
                href={repo.html_url}
                className="project-card reveal"
                key={repo.id}
                target="_blank"
                rel="noreferrer"
              >
                <div className="project-info">
                  <span className="project-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{repo.name}</h3>
                  <p>{repo.description || 'No description yet.'}</p>

                  <div className="project-meta">
                    {repo.language && (
                      <span className="gh-lang">
                        <span
                          className="gh-lang-dot"
                          style={{
                            background: LANG_COLORS[repo.language] || '#888',
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="gh-stat">
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="gh-stat">
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-1.5 0v.878H6.75v-.878a2.25 2.25 0 1 0-1.5 0ZM8 14.25a.75.75 0 0 1-.75-.75v-4.876a2.25 2.25 0 1 1 1.5 0V13.5a.75.75 0 0 1-.75.75Z" />
                        </svg>
                        {repo.forks_count}
                      </span>
                    )}
                    <span className="gh-updated">{timeAgo(repo.pushed_at)}</span>
                  </div>

                  <div className="project-tags">
                    {(repo.topics || []).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                <span className="project-arrow">
                  <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5H4.56l7.72 7.72a.75.75 0 1 1-1.06 1.06L3.5 4.56v2.69a.75.75 0 0 1-1.5 0v-3.5A1.75 1.75 0 0 1 3.75 2Zm9.5 3.25a.75.75 0 0 1 .75.75v6.25a1.75 1.75 0 0 1-1.75 1.75H6a.75.75 0 0 1 0-1.5h6.25a.25.25 0 0 0 .25-.25V6a.75.75 0 0 1 .75-.75Z" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        )}

        <div className="gh-profile-link reveal">
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noreferrer"
            className="gh-view-all"
          >
            <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            View all repositories on GitHub
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}
