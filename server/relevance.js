/**
 * RELEVANCE ENGINE — Multi-client
 * Layered scoring: Direct mention → Industry → Value chain → Risk/Opportunity
 */

const CLIENTS = {
  carlsberg: {
    name: 'Carlsberg',
    shortName: 'Carlsberg',
    directMentions: [
      'carlsberg', 'tuborg', 'jacobsen', 'kronenbourg', 'baltika',
      'carlsberg group', 'carlsbergfondet', 'carlsberg fondet',
    ],
    industry: [
      { term: 'bryggeri', label: 'Brewery industry' },
      { term: 'øl', label: 'Beer production' },
      { term: 'alkohol', label: 'Alcohol regulation' },
      { term: 'drikkevare', label: 'Beverage sector' },
      { term: 'spiritus', label: 'Spirits regulation' },
      { term: 'genstandsgrænse', label: 'Alcohol limits' },
      { term: 'alkoholreklame', label: 'Alcohol advertising' },
      { term: 'fødevare', label: 'Food & beverage' },
      { term: 'drikke', label: 'Beverage' },
      { term: 'aldersgræns', label: 'Age restriction' },
    ],
    valueChain: [
      { term: 'emballage', label: 'Packaging' },
      { term: 'pant', label: 'Deposit/return system' },
      { term: 'genbrug', label: 'Recycling' },
      { term: 'plastik', label: 'Plastics regulation' },
      { term: 'landbrug', label: 'Agriculture (barley supply)' },
      { term: 'korn', label: 'Grain supply chain' },
      { term: 'byg', label: 'Barley production' },
      { term: 'energi', label: 'Energy costs' },
      { term: 'el', label: 'Electricity' },
      { term: 'vand', label: 'Water usage' },
      { term: 'logistik', label: 'Logistics & transport' },
      { term: 'transport', label: 'Transport regulation' },
      { term: 'fragt', label: 'Freight' },
      { term: 'detail', label: 'Retail sector' },
      { term: 'supermarked', label: 'Supermarket/retail' },
      { term: 'dagligvare', label: 'FMCG/grocery' },
      { term: 'eksport', label: 'Export' },
      { term: 'import', label: 'Import/trade' },
      { term: 'told', label: 'Customs/tariffs' },
      { term: 'grænsehandel', label: 'Cross-border trade' },
    ],
    riskOpportunity: [
      { term: 'afgift', label: 'Tax/duty', area: 'Tax' },
      { term: 'skat', label: 'Taxation', area: 'Tax' },
      { term: 'moms', label: 'VAT', area: 'Tax' },
      { term: 'punktafgift', label: 'Excise duty', area: 'Tax' },
      { term: 'regulering', label: 'Regulation', area: 'Regulation' },
      { term: 'direktiv', label: 'EU Directive', area: 'Regulation' },
      { term: 'forordning', label: 'EU Regulation', area: 'Regulation' },
      { term: 'bæredygtighed', label: 'Sustainability', area: 'Sustainability' },
      { term: 'grøn omstilling', label: 'Green transition', area: 'Sustainability' },
      { term: 'klima', label: 'Climate policy', area: 'Sustainability' },
      { term: 'CO2', label: 'Carbon emissions', area: 'Sustainability' },
      { term: 'udledning', label: 'Emissions', area: 'Sustainability' },
      { term: 'miljø', label: 'Environment', area: 'Sustainability' },
      { term: 'handel', label: 'Trade policy', area: 'Trade' },
      { term: 'EU', label: 'EU policy', area: 'Trade' },
      { term: 'sundhed', label: 'Public health', area: 'Regulation' },
      { term: 'mærkning', label: 'Labeling requirements', area: 'Regulation' },
    ],
  },

  lego: {
    name: 'LEGO',
    shortName: 'LEGO',
    directMentions: [
      'lego', 'lego group', 'legoland', 'lego fonden', 'kirkbi',
    ],
    industry: [
      { term: 'legetøj', label: 'Toy industry' },
      { term: 'børn', label: 'Children/youth' },
      { term: 'leg', label: 'Play & education' },
      { term: 'produktion', label: 'Manufacturing' },
      { term: 'fremstilling', label: 'Manufacturing' },
      { term: 'fabrik', label: 'Factory/production' },
    ],
    valueChain: [
      { term: 'plastik', label: 'Plastics (core material)' },
      { term: 'emballage', label: 'Packaging' },
      { term: 'genbrug', label: 'Recycling' },
      { term: 'genanvend', label: 'Material reuse' },
      { term: 'energi', label: 'Energy costs' },
      { term: 'logistik', label: 'Logistics' },
      { term: 'transport', label: 'Transport' },
      { term: 'eksport', label: 'Export markets' },
      { term: 'told', label: 'Customs/tariffs' },
      { term: 'detail', label: 'Retail' },
      { term: 'e-handel', label: 'E-commerce' },
      { term: 'digital', label: 'Digital regulation' },
    ],
    riskOpportunity: [
      { term: 'skat', label: 'Taxation', area: 'Tax' },
      { term: 'afgift', label: 'Duties', area: 'Tax' },
      { term: 'bæredygtighed', label: 'Sustainability', area: 'Sustainability' },
      { term: 'klima', label: 'Climate', area: 'Sustainability' },
      { term: 'CO2', label: 'Carbon', area: 'Sustainability' },
      { term: 'miljø', label: 'Environment', area: 'Sustainability' },
      { term: 'grøn omstilling', label: 'Green transition', area: 'Sustainability' },
      { term: 'uddannelse', label: 'Education policy', area: 'Regulation' },
      { term: 'sikkerhed', label: 'Product safety', area: 'Regulation' },
      { term: 'EU', label: 'EU policy', area: 'Trade' },
      { term: 'handel', label: 'Trade', area: 'Trade' },
      { term: 'immateriel', label: 'IP rights', area: 'Regulation' },
      { term: 'patent', label: 'Patents', area: 'Regulation' },
      { term: 'ophavsret', label: 'Copyright', area: 'Regulation' },
    ],
  },

  vestas: {
    name: 'Vestas',
    shortName: 'Vestas',
    directMentions: [
      'vestas', 'vestas wind', 'vestas wind systems',
    ],
    industry: [
      { term: 'vindmølle', label: 'Wind turbines' },
      { term: 'vindenergi', label: 'Wind energy' },
      { term: 'vindkraft', label: 'Wind power' },
      { term: 'vedvarende energi', label: 'Renewable energy' },
      { term: 'havvind', label: 'Offshore wind' },
      { term: 'havvindmølle', label: 'Offshore turbines' },
      { term: 'energipark', label: 'Energy parks' },
      { term: 'turbine', label: 'Turbine manufacturing' },
    ],
    valueChain: [
      { term: 'energi', label: 'Energy sector' },
      { term: 'el', label: 'Electricity' },
      { term: 'elnet', label: 'Power grid' },
      { term: 'stål', label: 'Steel supply' },
      { term: 'produktion', label: 'Manufacturing' },
      { term: 'logistik', label: 'Logistics' },
      { term: 'transport', label: 'Transport' },
      { term: 'havn', label: 'Port infrastructure' },
      { term: 'eksport', label: 'Export' },
      { term: 'told', label: 'Customs' },
      { term: 'infrastruktur', label: 'Infrastructure' },
    ],
    riskOpportunity: [
      { term: 'klima', label: 'Climate policy', area: 'Sustainability' },
      { term: 'CO2', label: 'Carbon targets', area: 'Sustainability' },
      { term: 'grøn omstilling', label: 'Green transition', area: 'Sustainability' },
      { term: 'bæredygtighed', label: 'Sustainability', area: 'Sustainability' },
      { term: 'miljø', label: 'Environment', area: 'Sustainability' },
      { term: 'udledning', label: 'Emissions', area: 'Sustainability' },
      { term: 'skat', label: 'Tax', area: 'Tax' },
      { term: 'afgift', label: 'Duties', area: 'Tax' },
      { term: 'tilskud', label: 'Subsidies', area: 'Tax' },
      { term: 'støtte', label: 'State aid', area: 'Tax' },
      { term: 'EU', label: 'EU policy', area: 'Trade' },
      { term: 'handel', label: 'Trade', area: 'Trade' },
      { term: 'planlov', label: 'Planning law', area: 'Regulation' },
      { term: 'miljøvurdering', label: 'Environmental assessment', area: 'Regulation' },
      { term: 'arbejdsmiljø', label: 'Workplace safety', area: 'Regulation' },
    ],
  },

  maersk: {
    name: 'Mærsk',
    shortName: 'Mærsk',
    directMentions: [
      'mærsk', 'maersk', 'a.p. møller', 'ap møller', 'møller-mærsk',
    ],
    industry: [
      { term: 'shipping', label: 'Shipping' },
      { term: 'søfart', label: 'Maritime' },
      { term: 'rederi', label: 'Shipping company' },
      { term: 'containerskib', label: 'Container shipping' },
      { term: 'container', label: 'Container logistics' },
      { term: 'fragt', label: 'Freight' },
      { term: 'havn', label: 'Ports' },
      { term: 'terminal', label: 'Terminals' },
    ],
    valueChain: [
      { term: 'logistik', label: 'Logistics' },
      { term: 'transport', label: 'Transport' },
      { term: 'energi', label: 'Energy (fuel)' },
      { term: 'brændstof', label: 'Fuel' },
      { term: 'olie', label: 'Oil' },
      { term: 'gas', label: 'Gas' },
      { term: 'infrastruktur', label: 'Infrastructure' },
      { term: 'eksport', label: 'Export' },
      { term: 'import', label: 'Import' },
      { term: 'told', label: 'Customs' },
      { term: 'grænsehandel', label: 'Cross-border trade' },
      { term: 'digital', label: 'Digitalization' },
    ],
    riskOpportunity: [
      { term: 'klima', label: 'Climate', area: 'Sustainability' },
      { term: 'CO2', label: 'Carbon', area: 'Sustainability' },
      { term: 'grøn omstilling', label: 'Green transition', area: 'Sustainability' },
      { term: 'bæredygtighed', label: 'Sustainability', area: 'Sustainability' },
      { term: 'udledning', label: 'Emissions', area: 'Sustainability' },
      { term: 'miljø', label: 'Environment', area: 'Sustainability' },
      { term: 'skat', label: 'Tax', area: 'Tax' },
      { term: 'afgift', label: 'Duties', area: 'Tax' },
      { term: 'EU', label: 'EU policy', area: 'Trade' },
      { term: 'handel', label: 'Trade', area: 'Trade' },
      { term: 'sanktion', label: 'Sanctions', area: 'Trade' },
      { term: 'arbejdsmarked', label: 'Labor', area: 'Regulation' },
      { term: 'forsvar', label: 'Defense', area: 'Regulation' },
      { term: 'sikkerhed', label: 'Security', area: 'Regulation' },
    ],
  },

  novo: {
    name: 'Novo Nordisk',
    shortName: 'Novo',
    directMentions: [
      'novo nordisk', 'novo', 'novozymes', 'novo holdings', 'novo fonden',
      'ozempic', 'wegovy', 'saxenda', 'victoza',
    ],
    industry: [
      { term: 'medicin', label: 'Pharmaceuticals' },
      { term: 'lægemiddel', label: 'Medicines' },
      { term: 'farmaci', label: 'Pharma' },
      { term: 'biotek', label: 'Biotech' },
      { term: 'diabetes', label: 'Diabetes treatment' },
      { term: 'insulin', label: 'Insulin' },
      { term: 'fedme', label: 'Obesity treatment' },
      { term: 'sundhed', label: 'Healthcare' },
      { term: 'patient', label: 'Patient care' },
      { term: 'forskning', label: 'Research' },
    ],
    valueChain: [
      { term: 'produktion', label: 'Manufacturing' },
      { term: 'eksport', label: 'Export' },
      { term: 'import', label: 'Import' },
      { term: 'told', label: 'Customs' },
      { term: 'logistik', label: 'Logistics' },
      { term: 'transport', label: 'Transport' },
      { term: 'energi', label: 'Energy' },
      { term: 'vand', label: 'Water usage' },
      { term: 'patent', label: 'Patents' },
      { term: 'klinisk', label: 'Clinical trials' },
    ],
    riskOpportunity: [
      { term: 'sundhed', label: 'Public health', area: 'Regulation' },
      { term: 'folkesundhed', label: 'Public health', area: 'Regulation' },
      { term: 'regulering', label: 'Regulation', area: 'Regulation' },
      { term: 'skat', label: 'Tax', area: 'Tax' },
      { term: 'afgift', label: 'Duty', area: 'Tax' },
      { term: 'EU', label: 'EU policy', area: 'Trade' },
      { term: 'handel', label: 'Trade', area: 'Trade' },
      { term: 'klima', label: 'Climate', area: 'Sustainability' },
      { term: 'bæredygtighed', label: 'Sustainability', area: 'Sustainability' },
      { term: 'miljø', label: 'Environment', area: 'Sustainability' },
      { term: 'tilskud', label: 'Subsidies', area: 'Tax' },
      { term: 'godkendelse', label: 'Approvals', area: 'Regulation' },
      { term: 'sikkerhed', label: 'Safety', area: 'Regulation' },
      { term: 'pris', label: 'Pricing', area: 'Regulation' },
      { term: 'konkurrence', label: 'Competition', area: 'Regulation' },
    ],
  },
};

function scoreCase(sag, client) {
  const text = `${sag.titel || ''} ${sag.titelkort || ''} ${sag.resume || ''}`.toLowerCase();
  let score = 0;
  const reasons = [];
  const tags = new Set();
  const matchedLayers = [];

  // Layer breakdowns
  const layerBreakdown = {
    direct: { score: 0, max: 60, matches: [] },
    industry: { score: 0, max: 40, matches: [] },
    valueChain: { score: 0, max: 25, matches: [] },
    risk: { score: 0, max: 20, matches: [] },
  };

  // Layer 1: Direct mention (+60)
  for (const mention of client.directMentions) {
    if (text.includes(mention)) {
      score += 60;
      reasons.push(`Directly mentions ${mention}`);
      tags.add('Direct');
      matchedLayers.push('direct');
      layerBreakdown.direct.score = 60;
      layerBreakdown.direct.matches.push(mention);
      break;
    }
  }

  // Layer 2: Industry (+15 per, max 40)
  let industryScore = 0;
  for (const { term, label } of client.industry) {
    if (text.includes(term)) {
      industryScore += 15;
      layerBreakdown.industry.matches.push(label);
      if (industryScore <= 40) { reasons.push(label); tags.add('Industry'); matchedLayers.push('industry'); }
    }
  }
  score += Math.min(industryScore, 40);
  layerBreakdown.industry.score = Math.min(industryScore, 40);

  // Layer 3: Value chain (+10 per, max 25)
  let chainScore = 0;
  for (const { term, label } of client.valueChain) {
    if (text.includes(term)) {
      chainScore += 10;
      layerBreakdown.valueChain.matches.push(label);
      if (chainScore <= 25) { reasons.push(label); tags.add('Value Chain'); matchedLayers.push('valuechain'); }
    }
  }
  score += Math.min(chainScore, 25);
  layerBreakdown.valueChain.score = Math.min(chainScore, 25);

  // Layer 4: Risk/Opportunity (+8 per, max 20)
  let riskScore = 0;
  for (const { term, label, area } of client.riskOpportunity) {
    if (text.includes(term)) {
      riskScore += 8;
      layerBreakdown.risk.matches.push(label);
      if (riskScore <= 20) { reasons.push(label); tags.add(area); matchedLayers.push('risk'); }
    }
  }
  score += Math.min(riskScore, 20);
  layerBreakdown.risk.score = Math.min(riskScore, 20);

  score = Math.min(100, Math.max(0, score));

  let level;
  if (score >= 60) level = 'high';
  else if (score >= 25) level = 'medium';
  else if (score > 0) level = 'low';
  else level = 'none';

  const uniqueReasons = [...new Set(reasons)];
  let relevanceReason = '';
  if (uniqueReasons.length > 0) {
    relevanceReason = `Relevant to ${client.name}: ${uniqueReasons.slice(0, 4).join(', ')}`;
    if (uniqueReasons.length > 4) relevanceReason += ` (+${uniqueReasons.length - 4} more)`;
  }

  return { relevance_score: score, relevance_level: level, relevance_reason: relevanceReason, tags: [...tags], matched_layers: [...new Set(matchedLayers)], layerBreakdown };
}

function enrichSignal(sag, clientKey) {
  const client = CLIENTS[clientKey];
  if (!client) return null;
  const rel = scoreCase(sag, client);

  let whyItMatters = '';
  if (rel.matched_layers.includes('direct')) {
    whyItMatters = `This case directly references ${client.name} or its brands. Immediate attention recommended.`;
  } else if (rel.matched_layers.includes('industry')) {
    whyItMatters = `Touches ${client.name}'s core industry — could affect operations, compliance, or market position.`;
  } else if (rel.matched_layers.includes('valuechain')) {
    whyItMatters = `Affects ${client.name}'s supply or distribution chain. Monitor for cost or regulatory impact.`;
  } else if (rel.matched_layers.includes('risk')) {
    whyItMatters = `General regulatory or policy signal in an area relevant to ${client.name}'s strategic interests.`;
  }

  let whatToDo = [];
  if (rel.relevance_level === 'high') {
    whatToDo = ['Brief the client team immediately', 'Prepare a position summary within 48 hours', 'Identify key parliamentary contacts for engagement', 'Draft talking points for client leadership'];
  } else if (rel.relevance_level === 'medium') {
    whatToDo = ['Add to weekly monitoring report', 'Flag for next client check-in', 'Track legislative progress for changes'];
  } else {
    whatToDo = ['Log for awareness', 'Review if status changes'];
  }

  const affected = {
    clients: rel.relevance_level === 'high' ? 3 : rel.relevance_level === 'medium' ? 2 : 1,
    leads: Math.floor(Math.random() * 20) + 3,
  };

  return {
    id: sag.id,
    title: sag.titelkort || sag.titel || 'Untitled case',
    fullTitle: sag.titel || '',
    summary: (sag.resume || '').replace(/<[^>]*>/g, '').substring(0, 500),
    caseNumber: sag.nummer || '',
    status: sag.statusid,
    type: sag.typeid,
    updatedAt: sag.opdateringsdato,
    odaUrl: `https://oda.ft.dk/api/Sag(${sag.id})`,
    whyItMatters, whatToDo, affected,
    client: client.name,
    clientKey,
    ...rel,
  };
}

function enrichAllNews(sag) {
  return {
    id: sag.id,
    title: sag.titelkort || sag.titel || 'Untitled case',
    fullTitle: sag.titel || '',
    summary: (sag.resume || '').replace(/<[^>]*>/g, '').substring(0, 500),
    caseNumber: sag.nummer || '',
    status: sag.statusid,
    type: sag.typeid,
    updatedAt: sag.opdateringsdato,
    odaUrl: `https://oda.ft.dk/api/Sag(${sag.id})`,
    relevance_score: 0,
    relevance_level: 'none',
    relevance_reason: '',
    tags: [],
    matched_layers: [],
    whyItMatters: '',
    whatToDo: [],
    affected: { clients: 0, leads: 0 },
    client: 'All',
    clientKey: 'all',
  };
}

module.exports = { enrichSignal, enrichAllNews, scoreCase, CLIENTS };
