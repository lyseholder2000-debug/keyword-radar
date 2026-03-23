const express = require('express');
const path = require('path');
const { fetchRecentCases } = require('./fetcher');
const { enrichSignal, enrichAllNews, CLIENTS } = require('./relevance');
const { detectProspects } = require('./prospects');

const app = express();
const PORT = process.env.PORT || 3847;

app.use(express.json());

// Allow iframe embedding from portfolio site
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.removeHeader('X-Frame-Options');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// Cache
let rawCaseCache = null;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

// In-memory notes store (per signal)
const notesStore = {}; // { signalId: [{ id, author, text, timestamp }] }

// In-memory assessment store (per signal)
const assessmentStore = {}; // { signalId: { impact_operations, impact_financial, impact_timeline, stakeholders_decisionmakers, stakeholders_allies, risk_level, opportunity_level, risk_inaction, strategy_options[], strategy_rationale, rec_headline, rec_talkingpoints, updatedAt } }

async function getRawCases() {
  const now = Date.now();
  if (rawCaseCache && now - lastFetch < CACHE_TTL) return rawCaseCache;
  rawCaseCache = await fetchRecentCases(30, 200);
  lastFetch = now;
  return rawCaseCache;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/clients', (req, res) => {
  const list = Object.entries(CLIENTS).map(([key, c]) => ({
    key,
    name: c.name,
    shortName: c.shortName,
  }));
  res.json({ clients: list });
});

app.get('/api/signals', async (req, res) => {
  try {
    const cases = await getRawCases();
    const clientKey = req.query.client; // 'carlsberg', 'lego', etc. or 'all'
    const level = req.query.level;

    let signals;
    if (!clientKey || clientKey === 'all') {
      // All news — return all cases, no relevance scoring
      signals = cases.map(enrichAllNews).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else {
      signals = cases
        .map(c => enrichSignal(c, clientKey))
        .filter(s => s && s.relevance_score > 0)
        .sort((a, b) => b.relevance_score - a.relevance_score);
    }

    if (level && level !== 'all') {
      signals = signals.filter(s => s.relevance_level === level);
    }

    res.json({
      count: signals.length,
      client: clientKey || 'all',
      lastUpdated: new Date(lastFetch).toISOString(),
      signals,
    });
  } catch (err) {
    console.error('[api] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch signals', detail: err.message });
  }
});

app.get('/api/signals/:id', async (req, res) => {
  try {
    const cases = await getRawCases();
    const sag = cases.find(c => c.id === parseInt(req.params.id));
    if (!sag) return res.status(404).json({ error: 'Not found' });

    const clientKey = req.query.client || 'carlsberg';
    const signal = clientKey === 'all' ? enrichAllNews(sag) : enrichSignal(sag, clientKey);
    res.json(signal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notes API
app.get('/api/notes/:signalId', (req, res) => {
  const notes = notesStore[req.params.signalId] || [];
  res.json({ notes });
});

app.post('/api/notes/:signalId', (req, res) => {
  const { author, text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  const signalId = req.params.signalId;
  if (!notesStore[signalId]) notesStore[signalId] = [];

  const note = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    author: author || 'Advisor',
    text,
    timestamp: new Date().toISOString(),
  };

  notesStore[signalId].push(note);
  res.json({ note, total: notesStore[signalId].length });
});

app.delete('/api/notes/:signalId/:noteId', (req, res) => {
  const { signalId, noteId } = req.params;
  if (notesStore[signalId]) {
    notesStore[signalId] = notesStore[signalId].filter(n => n.id !== noteId);
  }
  res.json({ ok: true });
});

// Assessment API
app.get('/api/assessment/:signalId', (req, res) => {
  const assessment = assessmentStore[req.params.signalId] || null;
  res.json({ assessment });
});

app.post('/api/assessment/:signalId', (req, res) => {
  const signalId = req.params.signalId;
  const existing = assessmentStore[signalId] || {};
  assessmentStore[signalId] = { ...existing, ...req.body, updatedAt: new Date().toISOString() };
  res.json({ assessment: assessmentStore[signalId] });
});

// Draft generation
app.post('/api/actions/draft', (req, res) => {
  const { signalId, recipientName, type } = req.body;
  const assessment = assessmentStore[signalId] || {};
  const hasAssessment = assessment.rec_headline || assessment.impact_operations || assessment.rec_talkingpoints;

  let emailDraft, callDraft;

  if (hasAssessment) {
    const headline = assessment.rec_headline || 'a recent development in the Danish Parliament';
    const impactBlock = assessment.impact_operations ? `\nOur assessment of the operational impact:\n${assessment.impact_operations}\n` : '';
    const financialBlock = assessment.impact_financial ? `\nFinancial considerations:\n${assessment.impact_financial}\n` : '';
    const timelineBlock = assessment.impact_timeline ? `\nExpected timeline: ${assessment.impact_timeline}\n` : '';
    const riskBlock = assessment.risk_level ? `\nWe assess the risk level as ${assessment.risk_level.toUpperCase()}.` : '';
    const inactionBlock = assessment.risk_inaction ? ` If no action is taken: ${assessment.risk_inaction}` : '';
    const strategyBlock = assessment.strategy_rationale ? `\n\nRecommended approach:\n${assessment.strategy_rationale}\n` : '';
    const talkingPoints = assessment.rec_talkingpoints ? `\nKey points:\n${assessment.rec_talkingpoints}\n` : '';

    emailDraft = `Dear ${recipientName || 'Client'},\n\nRe: ${headline}\n\nI wanted to bring to your attention a development we've identified through our parliamentary monitoring that is relevant to your business.${impactBlock}${financialBlock}${timelineBlock}${riskBlock}${inactionBlock}${strategyBlock}${talkingPoints}\nI'd welcome the opportunity to discuss this in more detail and align on next steps.\n\nBest regards,\nForte Advisory`;

    const strategies = assessment.strategy_options || [];
    callDraft = `CALL PREP NOTES\n\nSubject: ${headline}\n\n• Open with: "We've identified something in our Folketinget monitoring that needs your attention"\n${assessment.impact_operations ? `• Impact: ${assessment.impact_operations.split('\n')[0]}\n` : ''}${assessment.risk_level ? `• Risk assessment: ${assessment.risk_level.toUpperCase()}\n` : ''}${strategies.length > 0 ? `• Strategic options to discuss: ${strategies.join(', ')}\n` : ''}${assessment.strategy_rationale ? `• Our recommendation: ${assessment.strategy_rationale.split('\n')[0]}\n` : ''}${assessment.rec_talkingpoints ? `• Talking points:\n${assessment.rec_talkingpoints.split('\n').map(l => '  - ' + l.trim()).join('\n')}\n` : ''}• Ask: "How is your team currently positioned on this?"\n• Close: Agree on follow-up actions and timeline`;
  } else {
    emailDraft = `Dear ${recipientName || 'Client'},\n\nI wanted to bring to your attention a recent development in the Danish Parliament that may be relevant to your business.\n\nWe've identified a new signal in our monitoring of Folketinget that touches on areas directly connected to your operations. I'd recommend we schedule a brief call to discuss the implications and potential next steps.\n\nI've attached a summary of the case and our initial assessment of its relevance.\n\nBest regards,\nForte Advisory`;
    callDraft = `CALL PREP NOTES\n\n• Open with: "We've been monitoring Folketinget and spotted something relevant"\n• Key point: Explain the signal and why it matters to their business\n• Ask: "How is your team currently thinking about this area?"\n• Offer: "We can prepare a detailed impact assessment"\n• Close: Agree on follow-up timeline`;
  }

  const drafts = { email: emailDraft, call: callDraft };
  res.json({ type: type || 'email', draft: drafts[type] || drafts.email, recipientName: recipientName || 'Client', signalId, generatedAt: new Date().toISOString() });
});

app.get('/api/prospects', async (req, res) => {
  try {
    const cases = await getRawCases();
    const prospects = detectProspects(cases);
    res.json({ count: prospects.length, prospects });
  } catch (err) {
    console.error('[api] Prospects error:', err.message);
    res.status(500).json({ error: 'Failed to detect prospects', detail: err.message });
  }
});

app.get('/api/refresh', async (req, res) => {
  rawCaseCache = null;
  lastFetch = 0;
  const cases = await getRawCases();
  res.json({ refreshed: true, count: cases.length });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[server] KeywordRadar running on http://localhost:${PORT}`);
});

module.exports = app;
