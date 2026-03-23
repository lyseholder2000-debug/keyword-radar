/**
 * PROSPECT DETECTION — Find non-client companies mentioned in parliamentary cases
 */

const { CLIENTS } = require('./relevance');

// Danish companies (C25 + notable others), excluding current clients
const PROSPECT_COMPANIES = [
  { name: 'DSV', aliases: ['dsv', 'dsv panalpina'], sector: 'Logistics' },
  { name: 'Coloplast', aliases: ['coloplast'], sector: 'Medical devices' },
  { name: 'Demant', aliases: ['demant', 'william demant', 'oticon'], sector: 'Healthcare' },
  { name: 'Genmab', aliases: ['genmab'], sector: 'Biotech' },
  { name: 'Pandora', aliases: ['pandora'], sector: 'Jewellery' },
  { name: 'Ørsted', aliases: ['ørsted', 'orsted', 'dong energy'], sector: 'Energy' },
  { name: 'Tryg', aliases: ['tryg', 'tryg forsikring'], sector: 'Insurance' },
  { name: 'Topdanmark', aliases: ['topdanmark'], sector: 'Insurance' },
  { name: 'Rockwool', aliases: ['rockwool'], sector: 'Building materials' },
  { name: 'GN Store Nord', aliases: ['gn store nord', 'gn audio', 'jabra'], sector: 'Electronics' },
  { name: 'Chr. Hansen', aliases: ['chr. hansen', 'chr hansen', 'christian hansen'], sector: 'Bioscience' },
  { name: 'Ambu', aliases: ['ambu'], sector: 'Medical devices' },
  { name: 'FLSmidth', aliases: ['flsmidth', 'fl smidth'], sector: 'Engineering' },
  { name: 'ISS', aliases: ['iss a/s', 'iss facility'], sector: 'Facility services' },
  { name: 'Bavarian Nordic', aliases: ['bavarian nordic'], sector: 'Biotech' },
  { name: 'SimCorp', aliases: ['simcorp'], sector: 'Fintech' },
  { name: 'NetCompany', aliases: ['netcompany', 'net company'], sector: 'IT consulting' },
  { name: 'Danske Bank', aliases: ['danske bank'], sector: 'Banking' },
  { name: 'Jyske Bank', aliases: ['jyske bank'], sector: 'Banking' },
  { name: 'Sydbank', aliases: ['sydbank'], sector: 'Banking' },
  { name: 'Nordea', aliases: ['nordea'], sector: 'Banking' },
  { name: 'Nykredit', aliases: ['nykredit'], sector: 'Banking' },
  { name: 'Danfoss', aliases: ['danfoss'], sector: 'Engineering' },
  { name: 'Grundfos', aliases: ['grundfos'], sector: 'Engineering' },
  { name: 'Ecco', aliases: ['ecco'], sector: 'Fashion' },
  { name: 'Arla', aliases: ['arla', 'arla foods'], sector: 'Dairy' },
  { name: 'Danish Crown', aliases: ['danish crown'], sector: 'Food processing' },
  { name: 'Bestseller', aliases: ['bestseller'], sector: 'Fashion' },
  { name: 'Saxo Bank', aliases: ['saxo bank'], sector: 'Fintech' },
  { name: 'Hempel', aliases: ['hempel'], sector: 'Coatings' },
  { name: 'Velux', aliases: ['velux'], sector: 'Building materials' },
  { name: 'Rambøll', aliases: ['rambøll', 'ramboll'], sector: 'Engineering' },
  { name: 'COWI', aliases: ['cowi'], sector: 'Engineering' },
  { name: 'Lundbeck', aliases: ['lundbeck', 'h. lundbeck'], sector: 'Pharma' },
  { name: 'Zealand Pharma', aliases: ['zealand pharma'], sector: 'Pharma' },
  { name: 'Netto', aliases: ['netto'], sector: 'Retail' },
  { name: 'Coop', aliases: ['coop', 'coop danmark'], sector: 'Retail' },
  { name: 'Salling Group', aliases: ['salling group', 'salling', 'føtex', 'bilka'], sector: 'Retail' },
  { name: 'SAS', aliases: ['sas', 'scandinavian airlines'], sector: 'Aviation' },
  { name: 'DSB', aliases: ['dsb'], sector: 'Transport' },
  { name: 'Energinet', aliases: ['energinet'], sector: 'Energy' },
  { name: 'TDC', aliases: ['tdc', 'tdc net', 'nuuday'], sector: 'Telecom' },
  { name: 'Nets', aliases: ['nets', 'nets a/s'], sector: 'Fintech' },
  { name: 'KMD', aliases: ['kmd'], sector: 'IT' },
  { name: 'Bang & Olufsen', aliases: ['bang & olufsen', 'bang og olufsen', 'b&o'], sector: 'Electronics' },
  { name: 'Terma', aliases: ['terma'], sector: 'Defense' },
  { name: 'Falck', aliases: ['falck'], sector: 'Emergency services' },
  { name: 'NKT', aliases: ['nkt', 'nkt cables'], sector: 'Cables & energy' },
  { name: 'Atos Medical', aliases: ['atos medical'], sector: 'Medical devices' },
  { name: 'Widex', aliases: ['widex'], sector: 'Healthcare' },
];

// Build set of existing client aliases to exclude
function getClientAliases() {
  const aliases = new Set();
  for (const client of Object.values(CLIENTS)) {
    for (const m of client.directMentions) {
      aliases.add(m.toLowerCase());
    }
  }
  return aliases;
}

function detectProspects(cases) {
  const clientAliases = getClientAliases();
  const results = new Map(); // name -> { ...company, mentionCount, cases }

  for (const sag of cases) {
    const text = `${sag.titel || ''} ${sag.titelkort || ''} ${sag.resume || ''}`.toLowerCase();

    for (const company of PROSPECT_COMPANIES) {
      // Skip if any alias overlaps with existing clients
      if (company.aliases.some(a => clientAliases.has(a))) continue;

      const matched = company.aliases.some(alias => text.includes(alias));
      if (!matched) continue;

      if (!results.has(company.name)) {
        results.set(company.name, {
          name: company.name,
          sector: company.sector,
          mentionCount: 0,
          cases: [],
        });
      }

      const entry = results.get(company.name);
      entry.mentionCount++;
      entry.cases.push({
        id: sag.id,
        title: sag.titelkort || sag.titel || 'Untitled',
        updatedAt: sag.opdateringsdato,
      });
    }
  }

  return [...results.values()].sort((a, b) => b.mentionCount - a.mentionCount);
}

module.exports = { detectProspects, PROSPECT_COMPANIES };
