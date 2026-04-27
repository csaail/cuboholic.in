import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopNav from './components/nav/TopNav.jsx';
import BottomTabBar from './components/nav/BottomTabBar.jsx';
import './styles/cf-globals.css';

export default function CubeFlowShell() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="cubeflow-app">
      <div className="cubeflow-bg" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        <BottomTabBar />
      </div>
    </div>
  );
}
