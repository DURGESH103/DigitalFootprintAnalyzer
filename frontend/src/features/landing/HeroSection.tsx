'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Zap, Brain, BarChart3, Shield, Star, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Icons and feature data live here — inside the Client Component boundary.
// Never pass icon components as props from a Server Component.
const features = [
  { Icon: Github,    title: 'GitHub Integration',     desc: 'Deep analysis of repos, commits, languages, stars and forks',         color: 'text-brand' },
  { Icon: Brain,     title: 'AI Personality Analysis', desc: 'Discover your developer personality type and coding style',            color: 'text-accent-purple' },
  { Icon: BarChart3, title: 'Visual Analytics',        desc: 'Beautiful charts showing your activity patterns and growth',           color: 'text-accent-green' },
  { Icon: Zap,       title: 'Real-Time Updates',       desc: 'Live progress tracking via WebSocket as analysis runs',                color: 'text-accent-yellow' },
  { Icon: Shield,    title: 'Hireability Score',       desc: 'Get a score that reflects your profile strength for employers',        color: 'text-accent-orange' },
  { Icon: Star,      title: 'Improvement Tips',        desc: 'Actionable suggestions to level up your developer profile',           color: 'text-brand' },
];

export const HeroSection = () => (
  <motion.div variants={container} initial="hidden" animate="show" className="text-center">
    <motion.div
      variants={item}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-xs text-brand mb-6"
    >
      <Zap className="h-3 w-3" aria-hidden="true" />
      AI-Powered Developer Analytics
    </motion.div>

    <motion.h1
      variants={item}
      className="text-4xl sm:text-6xl font-extrabold text-text-primary leading-tight mb-6"
    >
      Understand Your{' '}
      <span className="gradient-text">Digital Footprint</span>
    </motion.h1>

    <motion.p
      variants={item}
      className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
    >
      Analyze any GitHub profile with AI to uncover personality traits, coding patterns,
      strengths, and actionable insights — in seconds.
    </motion.p>

    <motion.div
      variants={item}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <Link
        href={ROUTES.SIGNUP}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-dim text-white font-semibold text-sm transition-all duration-200 shadow-glow-brand group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      >
        <Github className="h-4 w-4" aria-hidden="true" />
        Analyze Your GitHub
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </Link>
      <Link
        href={ROUTES.LOGIN}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-border-bright text-text-secondary hover:text-text-primary text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        Sign In
      </Link>
    </motion.div>

    <motion.div
      variants={item}
      className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto"
      aria-label="Platform statistics"
    >
      {([['10k+', 'Profiles Analyzed'], ['95%', 'Accuracy Rate'], ['< 30s', 'Analysis Time']] as const).map(
        ([val, label]) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold text-text-primary">{val}</div>
            <div className="text-xs text-text-secondary mt-1">{label}</div>
          </div>
        )
      )}
    </motion.div>
  </motion.div>
);

// Self-contained grid — owns its own data, no props cross the server/client boundary
export const FeaturesGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {features.map(({ Icon, title, desc, color }, i) => (
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: i * 0.07 }}
        className="glass-card p-5 hover:glow-border hover:border-brand/20 transition-all duration-300 group"
      >
        <div
          className={`${color} mb-3 group-hover:scale-110 transition-transform inline-block`}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
      </motion.div>
    ))}
  </div>
);
