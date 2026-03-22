'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { reportService } from '@/services/report.service';
import { useReportStore } from '@/store/report.store';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { extractApiError, isValidGithubUsername } from '@/utils/helpers';

export const AnalyzeForm = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const { setAnalyzing } = useReportStore();
  const router = useRouter();

  const validate = (v: string): string | undefined => {
    if (!v.trim()) return 'GitHub username is required';
    if (!isValidGithubUsername(v.trim())) return 'Invalid GitHub username format';
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsername(val);
    if (error) setError(validate(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(username);
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    try {
      const { jobId } = await reportService.analyze(username.trim());
      setAnalyzing(true, jobId);
      router.push(ROUTES.ANALYSIS);
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const charCount = username.length;
  const atLimit = charCount >= 39;
  const isValid = username.length > 0 && !validate(username);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(circle at top right, rgba(88,166,255,0.06), transparent 70%)' }}
      />

      <div className="flex items-center gap-3 mb-5">
        <div className="h-9 w-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <Github className="h-4.5 w-4.5 text-brand" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Analyze GitHub Profile</h2>
          <p className="text-xs text-text-muted mt-0.5">Get AI-powered insights on any developer</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/10 border border-accent-green/20">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[10px] font-medium text-accent-green">AI Ready</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <Input
              placeholder="e.g. torvalds, gaearon, sindresorhus"
              value={username}
              onChange={handleChange}
              error={error}
              icon={<Github className="h-3.5 w-3.5" />}
              maxLength={39}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="GitHub username"
              className="text-sm"
            />
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <span className="text-[11px] text-text-muted">
                {isValid && !error && (
                  <span className="text-accent-green flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green inline-block" />
                    Valid username
                  </span>
                )}
              </span>
              <span className={`text-[11px] ${atLimit ? 'text-accent-orange' : 'text-text-muted'}`}>
                {charCount}/39
              </span>
            </div>
          </div>
          <Button type="submit" loading={loading} className="shrink-0 mt-0.5 h-[38px]">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Analyzing…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Analyze
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
