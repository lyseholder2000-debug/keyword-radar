/**
 * ODA.FT.DK Data Fetcher
 * Fetches recent parliamentary cases and transforms them into clean JSON.
 */

const fetch = require('node-fetch');

const BASE = 'https://oda.ft.dk/api';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('.')[0]; // 2026-03-15T00:00:00
}

async function fetchRecentCases(days = 30, top = 200) {
  const since = daysAgo(days);
  const url = `${BASE}/Sag?$filter=opdateringsdato gt datetime'${since}'&$orderby=opdateringsdato desc&$top=${top}`;

  console.log(`[fetcher] Fetching cases since ${since}...`);
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    timeout: 15000,
  });

  if (!res.ok) {
    throw new Error(`ODA API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const cases = data.value || [];
  console.log(`[fetcher] Got ${cases.length} cases`);
  return cases;
}

async function fetchCaseDetail(id) {
  const url = `${BASE}/Sag(${id})`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    timeout: 10000,
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchRecentVotes(days = 14, top = 50) {
  const since = daysAgo(days);
  const url = `${BASE}/Afstemning?$filter=opdateringsdato gt datetime'${since}'&$orderby=opdateringsdato desc&$top=${top}`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    timeout: 10000,
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.value || [];
}

module.exports = { fetchRecentCases, fetchCaseDetail, fetchRecentVotes };
