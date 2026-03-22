'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Code2, ExternalLink } from 'lucide-react';
import { PlatformData } from '@/utils/types';
import { Card } from '@/components/ui/Card';

interface PlatformStatsProps { platforms: PlatformData; githubUsername: string; }

const PLATFORM_CONFIG = {
  github:        { icon: Github,   label: 'GitHub',        color: 'text-text-primary', bg: 'bg-bg-tertiary' },
  linkedin:      { icon: Linkedin, label: 'LinkedIn',      color: 'text-[#0a66c2]',    bg: 'bg-[#0a66c2]/10' },
  twitter:       { icon: Twitter,  label: 'Twitter / X',   color: 'text-[#1d9bf0]',    bg: 'bg-[#1d9bf0]/10' },
  stackoverflow: { icon: Code2,    label: 'StackOverflow', color: 'text-[#f48024]',    bg: 'bg-[#f48024]/10' },
};

export const PlatformStats = ({ platforms, githubUsername }: PlatformStatsProps) => {
  const items = [
    { key: 'github', data: { username: githubUsername } },
    ...(platforms.linkedin      ? [{ key: 'linkedin',      data: platforms.linkedin      as any }] : []),
    ...(platforms.twitter       ? [{ key: 'twitter',       data: platforms.twitter       as any }] : []),
    ...(platforms.stackoverflow ? [{ key: 'stackoverflow', data: platforms.stackoverflow as any }] : []),
  ];

  return (
    <Card>
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4">Connected Platforms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ key, data }, i) => {
          const cfg = PLATFORM_CONFIG[key as keyof typeof PLATFORM_CONFIG];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-border ${cfg.bg}`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cfg.bg} border border-border`}>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
              <p className="text-xs font-medium text-text-secondary">{cfg.label}</p>
              {data.username && (
                <p className="text-[10px] text-text-muted truncate max-w-full">@{data.username}</p>
              )}
              {data.reputation && (
                <p className="text-[10px] text-accent-yellow font-medium">{data.reputation} rep</p>
              )}
              {data.followers && (
                <p className="text-[10px] text-text-muted">{data.followers} followers</p>
              )}
              {data.connections && (
                <p className="text-[10px] text-text-muted">{data.connections} connections</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
