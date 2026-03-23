/**
 * DISCOVER ENGINE
 * Scans parliamentary cases for organizations, companies, and actors
 * that are frequently mentioned but NOT already in the monitored client list.
 */

const { CLIENTS } = require('./relevance');

// Known Danish and international companies/organizations to scan for.
// This is the "radar" — we look for these in case text and count mentions.
const KNOWN_ENTITIES = [
  // Danish companies
  { name: 'Danske Bank', terms: ['danske bank'], sector: 'Finance' },
  { name: 'Ørsted', terms: ['ørsted'], sector: 'Energy' },
  { name: 'DSV', terms: ['dsv', 'dsv panalpina'], sector: 'Logistics' },
  { name: 'Pandora', terms: ['pandora'], sector: 'Consumer goods' },
  { name: 'Coloplast', terms: ['coloplast'], sector: 'Healthcare' },
  { name: 'Demant', terms: ['demant', 'william demant'], sector: 'Healthcare' },
  { name: 'GN Store Nord', terms: ['gn store nord', 'gn audio', 'jabra'], sector: 'Technology' },
  { name: 'Rockwool', terms: ['rockwool'], sector: 'Building materials' },
  { name: 'Chr. Hansen', terms: ['chr. hansen', 'christian hansen'], sector: 'Biotech' },
  { name: 'ISS', terms: ['iss a/s', 'iss facility'], sector: 'Services' },
  { name: 'FLSmidth', terms: ['flsmidth'], sector: 'Engineering' },
  { name: 'Tryg', terms: ['tryg'], sector: 'Insurance' },
  { name: 'Topdanmark', terms: ['topdanmark'], sector: 'Insurance' },
  { name: 'Jyske Bank', terms: ['jyske bank'], sector: 'Finance' },
  { name: 'Sydbank', terms: ['sydbank'], sector: 'Finance' },
  { name: 'Salling Group', terms: ['salling group', 'føtex', 'bilka', 'netto'], sector: 'Retail' },
  { name: 'Coop Danmark', terms: ['coop danmark', 'coop'], sector: 'Retail' },
  { name: 'Arla', terms: ['arla', 'arla foods'], sector: 'Food & dairy' },
  { name: 'Danish Crown', terms: ['danish crown'], sector: 'Food & meat' },
  { name: 'Danfoss', terms: ['danfoss'], sector: 'Engineering' },
  { name: 'Grundfos', terms: ['grundfos'], sector: 'Engineering' },
  { name: 'Ecco', terms: ['ecco'], sector: 'Consumer goods' },
  { name: 'Bestseller', terms: ['bestseller', 'jack & jones', 'vero moda'], sector: 'Fashion' },
  { name: 'DONG Energy', terms: ['dong energy'], sector: 'Energy' },
  { name: 'SAS', terms: ['sas', 'scandinavian airlines'], sector: 'Aviation' },
  { name: 'DSB', terms: ['dsb'], sector: 'Transport' },
  { name: 'PostNord', terms: ['postnord'], sector: 'Logistics' },
  { name: 'TDC', terms: ['tdc', 'tdc net', 'nuuday'], sector: 'Telecom' },
  { name: 'Energinet', terms: ['energinet'], sector: 'Energy infrastructure' },
  { name: 'HOFOR', terms: ['hofor'], sector: 'Utilities' },
  { name: 'Lundbeck', terms: ['lundbeck'], sector: 'Pharma' },
  { name: 'LEO Pharma', terms: ['leo pharma'], sector: 'Pharma' },
  { name: 'Zealand Pharma', terms: ['zealand pharma'], sector: 'Pharma' },
  { name: 'Bavarian Nordic', terms: ['bavarian nordic'], sector: 'Pharma' },
  { name: 'SimCorp', terms: ['simcorp'], sector: 'Fintech' },
  { name: 'Netcompany', terms: ['netcompany'], sector: 'IT consulting' },
  { name: 'KMD', terms: ['kmd'], sector: 'IT / public sector' },
  { name: 'Rambøll', terms: ['rambøll', 'ramboll'], sector: 'Engineering consulting' },
  { name: 'COWI', terms: ['cowi'], sector: 'Engineering consulting' },
  { name: 'Haldor Topsøe', terms: ['haldor topsøe', 'topsøe', 'topsoe'], sector: 'Green technology' },
  { name: 'Copenhagen Airports', terms: ['københavns lufthavn', 'copenhagen airports', 'cph'], sector: 'Aviation' },
  // International with DK presence
  { name: 'Microsoft', terms: ['microsoft'], sector: 'Technology' },
  { name: 'Google', terms: ['google', 'alphabet'], sector: 'Technology' },
  { name: 'Apple', terms: ['apple'], sector: 'Technology' },
  { name: 'Meta', terms: ['meta', 'facebook'], sector: 'Technology' },
  { name: 'Amazon', terms: ['amazon'], sector: 'E-commerce' },
  { name: 'Tesla', terms: ['tesla'], sector: 'Automotive / Energy' },
  { name: 'Shell', terms: ['shell'], sector: 'Energy' },
  { name: 'TotalEnergies', terms: ['totalenergies', 'total energies'], sector: 'Energy' },
];

// Build a set of all terms already monitored so we can exclude them
function getMonitoredTerms() {
  const terms = new Set();
  for (const client of Object.values(CLIENTS)) {
    for (const m of client.directMentions) terms.add(m);
    terms.add(client.name.toLowerCase());
    terms.add(client.shortName.toLowerCase());
  }
  return terms;
}

// Also scan for high-signal generic sectors/topics not tied to a specific company
const SECTOR_SIGNALS = [
  { name: 'Fintech & Banking', terms: ['fintech', 'betalingstjeneste', 'banksektor', 'kreditinstitut', 'hvidvask'], sector: 'Finance' },
  { name: 'Real Estate', terms: ['ejendom', 'boligmarked', 'huslejeloft', 'byggebranch'], sector: 'Real estate' },
  { name: 'Agriculture', terms: ['landbrug', 'landmænd', 'pesticid', 'gødning', 'kvæg', 'svineproduktion'], sector: 'Agriculture' },
  { name: 'Fishing', terms: ['fiskeri', 'fiskekvoter', 'havbrug'], sector: 'Fishing' },
  { name: 'Defense', terms: ['forsvar', 'forsvarsindustri', 'våben', 'militær'], sector: 'Defense' },
  { name: 'AI & Technology', terms: ['kunstig intelligens', 'ai', 'dataetik', 'digitalisering'], sector: 'Technology' },
  { name: 'Cannabis / Hemp', terms: ['cannabis', 'hamp', 'medicinsk cannabis'], sector: 'Cannabis' },
  { name: 'Gambling', terms: ['gambling', 'spillemyndighed', 'lotteri', 'betting'], sector: 'Gambling' },
  { name: 'Crypto & Blockchain', terms: ['kryptovaluta', 'blockchain', 'bitcoin'], sector: 'Crypto' },
];

function discoverEntities(cases) {
  const monitoredTerms = getMonitoredTerms();
  const results = new Map(); // name -> { ...entity, mentions, caseIds }

  // Combine all text per case
  const caseTexts = cases.map(c => ({
    id: c.id,
    text: `${c.titel || ''} ${c.titelkort || ''} ${c.resume || ''}`.toLowerCase(),
    title: c.titelkort || c.titel || '',
    date: c.opdateringsdato,
  }));

  // Scan for known entities
  for (const entity of [...KNOWN_ENTITIES, ...SECTOR_SIGNALS]) {
    // Skip if this entity overlaps with monitored clients
    const isMonitored = entity.terms.some(t => monitoredTerms.has(t));
    if (isMonitored) continue;

    let mentions = 0;
    const matchedCases = [];

    for (const c of caseTexts) {
      const matched = entity.terms.some(term => c.text.includes(term));
      if (matched) {
        mentions++;
        if (matchedCases.length < 5) {
          matchedCases.push({ id: c.id, title: c.title, date: c.date });
        }
      }
    }

    if (mentions > 0) {
      results.set(entity.name, {
        name: entity.name,
        sector: entity.sector,
        type: SECTOR_SIGNALS.includes(entity) ? 'sector' : 'company',
        mentions,
        cases: matchedCases,
      });
    }
  }

  // Sort by mentions descending
  const sorted = [...results.values()].sort((a, b) => b.mentions - a.mentions);

  return sorted;
}

module.exports = { discoverEntities, KNOWN_ENTITIES, SECTOR_SIGNALS };
