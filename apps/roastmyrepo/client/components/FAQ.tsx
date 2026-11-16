import { useState } from "react";

export default function FAQ() {
  const [expanded, setExpanded] = useState<number | null>(0);

  const faqs = [
    {
      question: "Are you actually reading my code?",
      answer:
        "Nope! We're using AI magic to scan public repo metadata, commit history, and README vibes. No actual code parsing (yet). Your secrets are safe.",
    },
    {
      question: "Will this delete or change anything?",
      answer:
        "Absolutely not. We're read-only. We'll roast you, but we won't touch your precious code. All pushes are emotional.",
    },
    {
      question: "Is this safe for work?",
      answer:
        "Depends on your workplace's tolerance for sarcasm and light roasting. We keep it PG-13 comedy, but results vary.",
    },
    {
      question: "Can I roast someone else's repo?",
      answer:
        "Yes! Paste any public repo URL. Great for code reviews or team bonding. Use responsibly (or don't).",
    },
    {
      question: "What if I have a private repo?",
      answer:
        "We need public repos for now. The roasting is free, but your privacy is priceless.",
    },
    {
      question: "Can I save or share my roast?",
      answer:
        "Not yet, but screenshot it for posterity. Roasts are temporary reminders of your code choices.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 md:py-20 bg-black border-t-2 border-neon-cyan/30 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-pixel text-white text-center mb-12 sm:mb-16">
          FAQ
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-2 border-neon-cyan/30 overflow-hidden hover:border-neon-cyan/60 transition-colors"
            >
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between bg-black hover:bg-gray-950 transition-colors"
              >
                <span className="font-pixel text-sm sm:text-base text-white text-left">
                  {faq.question}
                </span>
                <span className="text-neon-cyan ml-4 flex-shrink-0 font-mono">
                  {expanded === idx ? "−" : "+"}
                </span>
              </button>

              {expanded === idx && (
                <div className="bg-gray-950 border-t border-neon-cyan/30 px-6 py-4">
                  <p className="font-mono text-sm text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
