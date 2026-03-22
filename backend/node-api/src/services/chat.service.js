const axios = require('axios');
const { ai } = require('../config/env');
const chatRepo   = require('../repositories/chat.repository');
const reportRepo = require('../repositories/report.repository');
const logger     = require('../utils/logger');

const aiClient = axios.create({ baseURL: ai.url, timeout: 30000 });

const chat = async ({ userId, reportId, message }) => {
  // Load report context
  const report = reportId
    ? await reportRepo.findById(reportId)
    : await reportRepo.findLatestByUserId(userId);

  // Save user message
  await chatRepo.save({ userId, reportId: report?.id || null, role: 'user', content: message });

  // Build context-aware prompt
  const context = report
    ? `User: ${report.github_username}
Hireability: ${report.scores.hireability}/100
Consistency: ${report.scores.consistency}/100
Visibility: ${report.scores.visibility}/100
Growth: ${report.scores.growth}/100
Influence: ${report.scores.influence}/100
Personality: ${report.ai_insights.personality_type}
Strengths: ${report.ai_insights.strengths?.join(', ')}
Weaknesses: ${report.ai_insights.weaknesses?.join(', ')}
Top Languages: ${report.scores.topLanguages?.map(l => l.lang).join(', ')}`
    : 'No report data available yet.';

  // Get chat history for context
  const history = await chatRepo.getHistory(userId, report?.id || null, 10);

  let reply;
  try {
    const { data } = await aiClient.post('/chat', {
      context,
      history: history.map(m => ({ role: m.role, content: m.content })),
      message,
    });
    reply = data.reply;
  } catch (err) {
    logger.warn('AI chat service unavailable, using fallback', { message: err.message });
    reply = generateFallbackReply(message, report);
  }

  // Save assistant reply
  await chatRepo.save({ userId, reportId: report?.id || null, role: 'assistant', content: reply });

  return { reply, reportId: report?.id || null };
};

function generateFallbackReply(message, report) {
  const msg = message.toLowerCase();
  if (!report) return "Please run an analysis first so I can give you personalized advice!";

  if (msg.includes('improve') || msg.includes('better')) {
    const suggestions = report.ai_insights.suggestions || [];
    return suggestions.length
      ? `Here are your top improvement areas:\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : "Focus on consistency and visibility — commit regularly and share your work publicly.";
  }
  if (msg.includes('strength') || msg.includes('good')) {
    const strengths = report.ai_insights.strengths || [];
    return strengths.length
      ? `Your key strengths are:\n${strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : "You have solid technical foundations. Keep building!";
  }
  if (msg.includes('score') || msg.includes('hireab')) {
    return `Your hireability score is ${report.scores.hireability}/100. Focus on improving visibility (${report.scores.visibility}/100) and growth (${report.scores.growth}/100) to boost it.`;
  }
  if (msg.includes('language') || msg.includes('skill')) {
    const langs = report.scores.topLanguages?.map(l => l.lang).join(', ') || 'N/A';
    return `Your top languages are: ${langs}. Consider adding complementary skills to your stack.`;
  }
  return `Based on your profile as "${report.ai_insights.personality_type}", I recommend focusing on: ${report.ai_insights.suggestions?.[0] || 'consistent daily contributions'}.`;
}

module.exports = { chat };
