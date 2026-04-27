import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import Vault from './pages/Vault';
import Shop from './pages/Shop';
import Career from './pages/Career';

const CubeFlowShell = lazy(() => import('./cubeflow/CubeFlowShell.jsx'));
const Landing = lazy(() => import('./cubeflow/pages/Landing.jsx'));
const Onboarding = lazy(() => import('./cubeflow/pages/Onboarding.jsx'));
const Dashboard = lazy(() => import('./cubeflow/pages/Dashboard.jsx'));
const Learn = lazy(() => import('./cubeflow/pages/Learn.jsx'));
const Lesson = lazy(() => import('./cubeflow/pages/Lesson.jsx'));
const Algorithms = lazy(() => import('./cubeflow/pages/Algorithms.jsx'));
const AlgorithmDetail = lazy(() => import('./cubeflow/pages/AlgorithmDetail.jsx'));
const Solver = lazy(() => import('./cubeflow/pages/Solver.jsx'));
const Scan = lazy(() => import('./cubeflow/pages/Scan.jsx'));
const Trainer = lazy(() => import('./cubeflow/pages/Trainer.jsx'));
const Timer = lazy(() => import('./cubeflow/pages/Timer.jsx'));
const Community = lazy(() => import('./cubeflow/pages/Community.jsx'));
const Profile = lazy(() => import('./cubeflow/pages/Profile.jsx'));

function CubeFlowFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0B0F',
      color: '#A8AEC1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      Loading CubeFlow…
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vault" element={<Vault />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/career" element={<Career />} />
      <Route
        path="/cubeflow"
        element={
          <Suspense fallback={<CubeFlowFallback />}>
            <CubeFlowShell />
          </Suspense>
        }
      >
        <Route index element={<Suspense fallback={<CubeFlowFallback />}><Landing /></Suspense>} />
        <Route path="onboarding" element={<Suspense fallback={<CubeFlowFallback />}><Onboarding /></Suspense>} />
        <Route path="dashboard" element={<Suspense fallback={<CubeFlowFallback />}><Dashboard /></Suspense>} />
        <Route path="learn" element={<Suspense fallback={<CubeFlowFallback />}><Learn /></Suspense>} />
        <Route path="learn/:lessonId" element={<Suspense fallback={<CubeFlowFallback />}><Lesson /></Suspense>} />
        <Route path="algorithms" element={<Suspense fallback={<CubeFlowFallback />}><Algorithms /></Suspense>} />
        <Route path="algorithms/:algId" element={<Suspense fallback={<CubeFlowFallback />}><AlgorithmDetail /></Suspense>} />
        <Route path="solver" element={<Suspense fallback={<CubeFlowFallback />}><Solver /></Suspense>} />
        <Route path="scan" element={<Suspense fallback={<CubeFlowFallback />}><Scan /></Suspense>} />
        <Route path="trainer" element={<Suspense fallback={<CubeFlowFallback />}><Trainer /></Suspense>} />
        <Route path="timer" element={<Suspense fallback={<CubeFlowFallback />}><Timer /></Suspense>} />
        <Route path="community" element={<Suspense fallback={<CubeFlowFallback />}><Community /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<CubeFlowFallback />}><Profile /></Suspense>} />
        <Route path="*" element={<Navigate to="/cubeflow" replace />} />
      </Route>
    </Routes>
  );
}
