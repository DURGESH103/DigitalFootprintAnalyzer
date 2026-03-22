'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Activity, User, Github, X, Menu, Zap } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { ROUTES } from '@/constants';

const links = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & reports' },
  { href: ROUTES.ANALYSIS,  label: 'Analyze',   icon: Activity,         desc: 'Run new analysis' },
  { href: ROUTES.PROFILE,   label: 'Profile',   icon: User,             desc: 'Account settings' },
];

const SidebarContent = ({ pathname, onNav }: { pathname: string; onNav?: () => void }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
      <div className="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
        <Github className="h-4 w-4 text-brand" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary leading-none">DFA</p>
        <p className="text-[10px] text-text-muted mt-0.5">Digital Footprint</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1">
      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest px-3 mb-3">Navigation</p>
      {links.map(({ href, label, icon: Icon, desc }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
              active
                ? 'nav-active text-brand'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
            )}
          >
            <Icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', active ? 'text-brand' : 'text-text-muted group-hover:text-text-secondary')} />
            <div className="min-w-0">
              <p className="leading-none">{label}</p>
              <p className={cn('text-[10px] mt-0.5 truncate transition-colors', active ? 'text-brand/60' : 'text-text-muted')}>{desc}</p>
            </div>
            {active && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute right-2 h-1.5 w-1.5 rounded-full bg-brand"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>

    {/* Footer hint */}
    <div className="px-3 py-4 border-t border-border">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-brand/5 border border-brand/10">
        <Zap className="h-3.5 w-3.5 text-brand flex-shrink-0" />
        <p className="text-[11px] text-text-secondary leading-snug">
          Analyze any GitHub profile instantly
        </p>
      </div>
    </div>
  </div>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-bg-secondary/80 backdrop-blur-sm min-h-screen flex-shrink-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-brand shadow-glow-brand flex items-center justify-center text-white"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-bg-secondary border-r border-border"
            >
              <button
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent pathname={pathname} onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
