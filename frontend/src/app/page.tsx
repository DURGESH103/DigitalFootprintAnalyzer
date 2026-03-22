import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection, FeaturesGrid } from '@/features/landing/HeroSection';
import { ROUTES } from '@/constants';

export const metadata = {
  title: 'Digital Footprint Analyzer — AI GitHub Profile Analysis',
  description: 'Analyze any GitHub profile with AI to uncover personality traits, coding patterns, strengths, and actionable insights.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden bg-hero-glow"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <HeroSection />
        </div>
      </section>

      {/* Features */}
      <section
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20"
        aria-labelledby="features-heading"
      >
        <div className="text-center mb-12">
          <h2 id="features-heading" className="text-3xl font-bold text-text-primary mb-3">
            Everything you need
          </h2>
          <p className="text-text-secondary">
            Comprehensive analysis powered by AI and real GitHub data
          </p>
        </div>
        <FeaturesGrid />
      </section>

      {/* CTA */}
      <section
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center"
        aria-labelledby="cta-heading"
      >
        <div className="glass-card p-10 glow-border">
          <h2 id="cta-heading" className="text-3xl font-bold text-text-primary mb-3">
            Ready to analyze?
          </h2>
          <p className="text-text-secondary mb-6">
            Join thousands of developers who understand their coding DNA
          </p>
          <Link
            href={ROUTES.SIGNUP}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand hover:bg-brand-dim text-white font-semibold transition-all duration-200 shadow-glow-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-text-muted">
        <p>© {new Date().getFullYear()} Digital Footprint Analyzer. Built with Next.js &amp; FastAPI.</p>
      </footer>
    </div>
  );
}
