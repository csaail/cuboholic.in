import { motion } from 'framer-motion';
import { Trophy, Users, Heart, MessageCircle, Flame } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Chip from '../components/ui/Chip.jsx';
import { formatTime } from '../lib/format.js';

const MOCK_LEADERBOARD = [
  { rank: 1, handle: '@feliks', country: '🇵🇱', single: 3470, ao5: 4180, solves: 12834 },
  { rank: 2, handle: '@yusheng', country: '🇨🇳', single: 3540, ao5: 4290, solves: 9241 },
  { rank: 3, handle: '@maxpark', country: '🇺🇸', single: 3690, ao5: 4480, solves: 8123 },
  { rank: 4, handle: '@tymonkolasinski', country: '🇵🇱', single: 4010, ao5: 4920, solves: 7250 },
  { rank: 5, handle: '@asianspeedcuber', country: '🇸🇬', single: 4200, ao5: 5180, solves: 6432 },
  { rank: 6, handle: '@tornadocuber', country: '🇮🇳', single: 4880, ao5: 5810, solves: 5821 },
  { rank: 7, handle: '@cubeflow_demo', country: '🇮🇳', single: 5240, ao5: 6120, solves: 4012 },
];

const MOCK_FEED = [
  {
    id: 1,
    handle: '@speedy_chen',
    avatar: 'SC',
    time: '2m ago',
    title: 'New PB: 7.84!',
    body: 'Got an OLL skip on the daily challenge. Lucky scramble but I\'ll take it.',
    likes: 142,
    replies: 18,
  },
  {
    id: 2,
    handle: '@lila_cubes',
    avatar: 'LC',
    time: '14m ago',
    title: 'Finally finished full PLL',
    body: 'Took me 3 weeks of drilling. The Y perm was the hardest. Anyone else?',
    likes: 87,
    replies: 23,
  },
  {
    id: 3,
    handle: '@cube_dad',
    avatar: 'CD',
    time: '1h ago',
    title: '30-day streak — let\'s go',
    body: 'Started CubeFlow last month. Today I solved in under 60s for the first time.',
    likes: 213,
    replies: 41,
  },
];

export default function Community() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Chip tone="mint">Community</Chip>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Cubers worldwide.</h1>
        <p className="mt-3 text-cf-mid max-w-2xl">
          See what other cubers are solving. Compete on the daily leaderboard.
          Share your PBs.
        </p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-cf-accent" />
            <h2 className="font-display font-semibold text-xl text-cf-hi">Recent shares</h2>
          </div>
          {MOCK_FEED.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassPanel hover>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cf-accent to-cf-accent2 flex items-center justify-center font-display font-bold text-white text-sm shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-semibold text-cf-hi text-sm">{post.handle}</span>
                      <span className="text-xs text-cf-lo">{post.time}</span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-cf-hi mt-0.5">{post.title}</h3>
                    <p className="text-sm text-cf-mid mt-1.5 leading-relaxed">{post.body}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-cf-mid">
                      <button className="flex items-center gap-1 hover:text-cf-danger transition-colors">
                        <Heart className="w-3.5 h-3.5" /> {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-cf-hi transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> {post.replies}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
          <GlassPanel className="!bg-cf-accent/5 !border-cf-accent/20 text-center !py-6">
            <div className="text-sm text-cf-mid">
              Community sharing launches with the next release.
              <br />
              Sign in to claim your @handle when it goes live.
            </div>
          </GlassPanel>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-cf-warn" />
            <h2 className="font-display font-semibold text-xl text-cf-hi">All-time leaderboard</h2>
          </div>
          <GlassPanel padded={false}>
            <div className="overflow-hidden rounded-cf-lg">
              <table className="w-full">
                <thead className="text-[10px] uppercase tracking-wider text-cf-lo bg-white/[0.03]">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-left px-3 py-2">Cuber</th>
                    <th className="text-right px-3 py-2">Single</th>
                    <th className="text-right px-3 py-2">ao5</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LEADERBOARD.map((row) => (
                    <tr key={row.rank} className="border-t border-cf-line text-sm">
                      <td className="px-3 py-2.5">
                        <RankBadge rank={row.rank} />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="text-cf-hi font-medium">{row.handle}</div>
                        <div className="text-xs text-cf-lo">{row.country} · {row.solves.toLocaleString()} solves</div>
                      </td>
                      <td className="px-3 py-2.5 text-right cf-notation text-cf-accent2">{formatTime(row.single)}</td>
                      <td className="px-3 py-2.5 text-right cf-notation text-cf-mid">{formatTime(row.ao5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>

          <GlassPanel className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-cf-warn" />
              <span className="font-display font-semibold text-cf-hi text-sm">Daily challenge</span>
            </div>
            <div className="text-xs text-cf-mid mb-3">
              Solve today's scramble — your time joins the daily leaderboard.
            </div>
            <div className="cf-notation text-xs text-cf-hi bg-cf-bg2 rounded px-2.5 py-2 border border-cf-line break-words">
              R U R' U' F' U2 F R U' R' D' L F2 D L' U2
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function RankBadge({ rank }) {
  const styles = rank === 1
    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
    : rank === 2
    ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900'
    : rank === 3
    ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100'
    : 'bg-white/5 text-cf-mid';
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold ${styles}`}>
      {rank}
    </div>
  );
}
