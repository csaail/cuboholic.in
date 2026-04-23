import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Vault from './pages/Vault';
import Shop from './pages/Shop';
import Career from './pages/Career';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vault" element={<Vault />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/career" element={<Career />} />
    </Routes>
  );
}
