'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowRight, ChevronDown, ChevronUp, Linkedin, Twitter, Code2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { reportService } from '@/services/report.service';
import { useReportStore } from '@/store/report.store';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { extractApiError, isValidGithubUsername } from '@/utils/helpers';

const PLATFORM_FIELDS = [
  { id: 'linkedin',      label: 'LinkedIn Username',      icon: Linkedin, placeholder: 'e.g. john-doe', color: 'text-[#0a66c2]' },
  { id: 'twitter',       label: 'Twitter / X Username',   icon: Twitter,  placeholder: 'e.g. johndoe',  color: 'text-[#1d9bf0]' },
  { id: 'stackoverflow', label: 'StackOverflow Username', icon: Code2,    placeholder: 'e.g. johndoe',  color: 'text-[#f48024]' },
];

export const AnalyzeForm = () => {
  const [github, setGithub]       = useState('');
  const [platforms, setPlatforms] = useState<Record<string, string>>({});
  const [error, setError]         = useState<string | undefined>();
  const [loading, setLoading]     = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const { setAnalyzing } = useReportStore();
  const router = useRouter();

  const validate = (v: string) => {
    if (!v.trim()) return 'GitHub username is required';
    if (!isValidGithubUsername(v.trim())) return 'Invalid GitHub username format';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(github);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const { jobId } = await reportService.analyze(github.trim(), platforms);
      setAnalyzing(true, jobId);
      router.push(ROUTES.ANALYSIS);
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const connectedCount = Object.values(platforms).filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(88,166,255,0.05), transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Github className="h-4.5 w-4.5 text-brand" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-text-primary">Analyze Digital Footprint</h2>
          <p className="text-xs text-text-muted mt-0.5">GitHub required · LinkedIn, Twitter, SO optional</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[10px] font-medium text-accent-green">AI Ready</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* GitHub input */}
        <div className="flex gap-3 items-start mb-3">
          <div className="flex-1">
            <Input
              placeholder="GitHub username (required)"
              value={github}
              onChange={e => { setGithub(e.target.value); if (error) setError(validate(e.target.value)); }}
              error={error}
              icon={<Github className="h-3.5 w-3.5" />}
              maxLength={39}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="GitHub username"
            />
          </div>
          <Button type="submit" loading={loading} className="shrink-0 mt-0.5 h-[38px]">
            {loading ? 'Analyzing…' : <><span>Analyze</span><ArrowRight className="h-3.5 w-3.5" /></>}
          </Button>
        </div>

        {/* Optional platforms toggle */}
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors mb-1"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          Add more platforms for deeper insights
          {connectedCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-medium">
              {connectedCount} added
            </span>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border mt-2">
                {PLATFORM_FIELDS.map(({ id, label, icon: Icon, placeholder, color }) => (
                  <div key={id}>
                    <Input
                      label={label}
                      placeholder={placeholder}
                      value={platforms[id] || ''}
                      onChange={e => setPlatforms(p => ({ ...p, [id]: e.target.value }))}
                      icon={<Icon className={`h-3.5 w-3.5 ${color}`} />}
                      autoComplete="off"
                      autoCapitalize="none"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-muted mt-2">
                <Zap className="h-3 w-3 inline mr-1 text-accent-yellow" />
                More platforms = richer AI insights and higher accuracy scores
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};
