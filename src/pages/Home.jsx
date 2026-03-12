import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import SkillsMarquee from '../components/SkillsMarquee';
import Projects from '../components/Projects';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <SkillsMarquee />
      <Projects />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}
