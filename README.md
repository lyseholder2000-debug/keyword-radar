# KeywordRadar

Political signal monitoring for advisors. Turns Danish Parliament data into actionable client insights.

**DATA → SIGNAL → ACTION**

## Quick Start

```bash
cd ~/Documents/KeywordRadar
npm install
npm start
```

## Keep in Dock

After `npm start`, right-click the Electron icon in the Dock → **Options → Keep in Dock**.

## Architecture

```
KeywordRadar/
  main.js              ← Electron window
  server/
    index.js           ← Express API (port 3847)
    fetcher.js         ← ODA.FT.DK data fetcher
    relevance.js       ← Layered relevance scoring engine
  public/
    index.html         ← Full SPA (feed + detail + action panel)
```

## How It Works

1. **Fetcher** pulls recent cases from `oda.ft.dk/api/Sag`
2. **Relevance engine** scores each case across 4 layers:
   - Direct mention (Carlsberg, Tuborg, etc.)
   - Industry (brewery, alcohol, beverage)
   - Value chain (packaging, agriculture, energy, logistics, retail)
   - Risk/Opportunity (tax, regulation, sustainability, trade)
3. **Frontend** displays scored signals in a scannable feed
4. **Detail view** shows: What happened → Why it matters → Who's affected → What to do
5. **Action panel** generates draft outreach (email/call prep)

## Extending the Relevance Model

Edit `server/relevance.js` → the `CLIENT` object. Add terms to any layer:
- `directMentions` — exact brand/company names
- `industry` — sector keywords
- `valueChain` — supply/distribution chain terms
- `riskOpportunity` — policy area keywords

To add a new client, duplicate the `CLIENT` object and create a client selector in the UI.

## API Endpoints

- `GET /api/signals` — All scored signals (optional `?level=high|medium|low`)
- `GET /api/signals/:id` — Single signal detail
- `GET /api/refresh` — Force re-fetch from Parliament
- `POST /api/actions/draft` — Generate outreach draft
