import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import SkillsMarquee from '../components/SkillsMarquee';
import Experience from '../components/Experience';
import Toolkit from '../components/Toolkit';
import ScrollProgress from '../components/motion/ScrollProgress';
import PointerFX from '../components/motion/PointerFX';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Home() {
  useScrollReveal(true);

  return (
    <>
      <ScrollProgress />
      <PointerFX />
      <Navbar />
      <Hero />
      <About />
      <SkillsMarquee />
      <Experience />
      <Projects />
      <Toolkit />
      <Contact />
      <Footer />
    </>
  );
}
