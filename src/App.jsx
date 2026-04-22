import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Vault from './pages/Vault';
import Shop from './pages/Shop';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vault" element={<Vault />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  );
}
