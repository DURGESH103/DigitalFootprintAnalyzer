'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Users, BookOpen, ExternalLink } from 'lucide-react';
import { GithubProfile } from '@/utils/types';
import { formatNumber } from '@/utils/helpers';

interface GithubProfileCardProps {
  profile: GithubProfile;
}

export const GithubProfileCard = ({ profile }: GithubProfileCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5 flex items-start gap-4"
  >
    <Image
      src={profile.avatar_url}
      alt={profile.login}
      width={56}
      height={56}
      className="rounded-full border-2 border-border"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-text-primary">{profile.name || profile.login}</h3>
        <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-brand">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="text-xs text-text-secondary mb-3">@{profile.login}</p>
      {profile.bio && <p className="text-sm text-text-secondary mb-3 line-clamp-2">{profile.bio}</p>}
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{formatNumber(profile.public_repos)} repos</span>
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{formatNumber(profile.followers)} followers</span>
        <span className="flex items-center gap-1"><Github className="h-3 w-3" />{formatNumber(profile.following)} following</span>
      </div>
    </div>
  </motion.div>
);
