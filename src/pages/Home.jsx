import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import SkillsMarquee from '../components/SkillsMarquee';
import Projects from '../components/Projects';
import Gallery from '../components/Gallery';
import Artwork from '../components/Artwork';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Home() {
  useScrollReveal(true);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <SkillsMarquee />
      <Projects />
      <Gallery />
      <Artwork />
      <Contact />
      <Footer />
    </>
  );
}
