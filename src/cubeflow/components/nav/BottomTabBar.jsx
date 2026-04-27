import { NavLink } from 'react-router-dom';
import { GraduationCap, Box, Timer, User } from 'lucide-react';

const TABS = [
  { to: '/cubeflow/learn', label: 'Learn', icon: GraduationCap },
  { to: '/cubeflow/solver', label: 'Solver', icon: Box },
  { to: '/cubeflow/timer', label: 'Timer', icon: Timer },
  { to: '/cubeflow/profile', label: 'You', icon: User },
];

export default function BottomTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 cf-glass border-t border-cf-line">
      <div className="flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-cf-accent' : 'text-cf-mid'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_#6E5BFF]' : ''}`} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
