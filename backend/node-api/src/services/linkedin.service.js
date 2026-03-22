const cache = require('./cache.service');
const logger = require('../utils/logger');

/**
 * LinkedIn data collector.
 * Uses mock/simulated data since LinkedIn's API is heavily restricted.
 * In production, replace with actual OAuth + LinkedIn API calls.
 */
const fetchUserData = async (username) => {
  const cacheKey = `linkedin:${username}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  logger.info('LinkedIn: generating mock data', { username });

  // Simulate realistic LinkedIn profile data
  const seed = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (min, max) => min + (seed % (max - min + 1));

  const data = {
    username,
    displayName: username.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    headline: pickFrom(seed, [
      'Senior Software Engineer', 'Full Stack Developer', 'Backend Engineer',
      'ML Engineer', 'DevOps Engineer', 'Frontend Developer',
    ]),
    connections: rand(150, 2500),
    posts: rand(5, 80),
    postFrequency: rand(1, 12), // posts per month
    endorsements: rand(10, 200),
    recommendations: rand(2, 25),
    skills: pickSkills(seed),
    experience_years: rand(1, 15),
    education: pickFrom(seed, ['B.Tech CS', 'B.Sc Computer Science', 'M.Tech', 'Self-taught']),
    certifications: rand(0, 8),
    profileCompleteness: rand(60, 100),
    activityScore: rand(20, 90), // LinkedIn activity score
  };

  await cache.set(cacheKey, data, 3600);
  return data;
};

function pickFrom(seed, arr) {
  return arr[seed % arr.length];
}

function pickSkills(seed) {
  const allSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
    'Kubernetes', 'TypeScript', 'SQL', 'MongoDB', 'Redis', 'GraphQL',
    'Machine Learning', 'System Design', 'CI/CD', 'Agile',
  ];
  const count = 4 + (seed % 6);
  return allSkills.slice(seed % 5, (seed % 5) + count);
}

module.exports = { fetchUserData };
