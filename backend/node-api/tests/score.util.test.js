const {
  computeConsistencyScore,
  computeActivityPattern,
  computeTopLanguages,
  computeEngagementScore,
} = require('../src/utils/score.util');

const makeCommit = (date) => ({ sha: '1', message: 'fix', date });

describe('score.util', () => {
  describe('computeConsistencyScore', () => {
    it('returns 0 for empty commits', () => {
      expect(computeConsistencyScore([])).toBe(0);
    });

    it('returns 100 for daily commits', () => {
      const commits = [
        makeCommit('2024-01-03T10:00:00Z'),
        makeCommit('2024-01-02T10:00:00Z'),
        makeCommit('2024-01-01T10:00:00Z'),
      ];
      expect(computeConsistencyScore(commits)).toBe(100);
    });
  });

  describe('computeActivityPattern', () => {
    it('returns 0/0 for empty commits', () => {
      expect(computeActivityPattern([])).toEqual({ day: 0, night: 0 });
    });

    it('correctly classifies day commits', () => {
      const commits = [makeCommit('2024-01-01T10:00:00Z'), makeCommit('2024-01-01T12:00:00Z')];
      const result = computeActivityPattern(commits);
      expect(result.day).toBe(100);
      expect(result.night).toBe(0);
    });
  });

  describe('computeTopLanguages', () => {
    it('returns top 5 languages sorted by count', () => {
      const repos = [
        { language: 'JavaScript' }, { language: 'JavaScript' },
        { language: 'Python' }, { language: null },
      ];
      const result = computeTopLanguages(repos);
      expect(result[0].lang).toBe('JavaScript');
      expect(result[0].count).toBe(2);
    });
  });

  describe('computeEngagementScore', () => {
    it('caps at 100', () => {
      const repos = Array(10).fill({ stargazers_count: 10, forks_count: 5 });
      expect(computeEngagementScore(repos)).toBe(100);
    });
  });
});
