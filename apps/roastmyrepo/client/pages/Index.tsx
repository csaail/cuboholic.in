import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import RoastPanel from "@/components/RoastPanel";
import HowItWorks from "@/components/HowItWorks";
import SampleRoasts from "@/components/SampleRoasts";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

// Sample roasts for demo purposes
const SAMPLE_ROASTS = [
  {
    headline: "Your commit messages are a hate crime against future you.",
    roasts: [
      "This repo has more branches than your career options.",
      "Test coverage so low it qualifies as a rounding error.",
      "Your README is just vibes and a badge collection.",
      "More commented-out code than working code. That's a commitment.",
      "The main branch hasn't been updated in 3 years. Bold strategy.",
    ],
  },
  {
    headline: "Your dependency tree has a substance abuse problem.",
    roasts: [
      "npm install just became sentient.",
      "You have 47 versions of lodash installed. Why.",
      "Your package.json looks like a ransom note.",
      "The node_modules folder is larger than some countries.",
      "Security vulnerabilities: yes. Fixes: we'll see.",
    ],
  },
  {
    headline: "This monolith is having an identity crisis.",
    roasts: [
      "It's so big, it has its own gravitational field.",
      "Refactoring might take longer than your career.",
      "Even the code comments sound exhausted.",
      "This isn't a codebase, it's a cry for help.",
      "Your DevOps team probably takes medication.",
    ],
  },
];

export default function Index() {
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roast, setRoast] = useState<{
    headline: string;
    roasts: string[];
  } | null>(null);

  const handleRoast = (url: string) => {
    setRepoUrl(url);
    setIsLoading(true);
    setRoast(null);

    // Simulate API call with delay
    setTimeout(() => {
      const randomRoast =
        SAMPLE_ROASTS[Math.floor(Math.random() * SAMPLE_ROASTS.length)];
      setRoast(randomRoast);
      setIsLoading(false);

      // Scroll to roast panel
      setTimeout(() => {
        const panel = document.getElementById("roast-panel");
        if (panel) {
          panel.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <main>
        <Hero onRoast={handleRoast} isLoading={isLoading} />

        <div id="roast-panel" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <RoastPanel
            repoUrl={repoUrl}
            isLoading={isLoading}
            roast={roast}
          />
        </div>

        <HowItWorks />
        <SampleRoasts />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
