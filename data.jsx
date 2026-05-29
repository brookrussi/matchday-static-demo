// data.jsx — fictional teams, matches, pods, predictions
// Generic placeholder teams styled like a real international tournament.

// ─── Teams (16 across 4 groups; tournament truncated for the prototype) ───
const TEAMS = [
  // Group A
  { id: 'arg', name: 'Argonia',   short: 'ARG', group: 'A', flag: { type: 'vstripes', colors: ['#c83a3a', '#f2e8d0', '#1c4f8c'] }, rank: 4 },
  { id: 'bel', name: 'Beluga',    short: 'BEL', group: 'A', flag: { type: 'hstripes', colors: ['#1a2e1a', '#f2e8d0', '#d4a843'] }, rank: 22 },
  { id: 'cas', name: 'Caspia',    short: 'CAS', group: 'A', flag: { type: 'vstripes', colors: ['#3d87b3', '#f7f2e8', '#3d87b3'] }, rank: 11 },
  { id: 'dra', name: 'Dravania',  short: 'DRA', group: 'A', flag: { type: 'cross',    colors: ['#b03a2e', '#f2e8d0'] }, rank: 31 },
  // Group B
  { id: 'emb', name: 'Emberia',   short: 'EMB', group: 'B', flag: { type: 'hstripes', colors: ['#c4622d', '#1c1c1a', '#f2e8d0'] }, rank: 6 },
  { id: 'flo', name: 'Floravia',  short: 'FLO', group: 'B', flag: { type: 'diag',     colors: ['#d4a843', '#1a2e1a'] }, rank: 18 },
  { id: 'gra', name: 'Grandura',  short: 'GRA', group: 'B', flag: { type: 'vstripes', colors: ['#1c4f8c', '#f7f2e8', '#1c4f8c'] }, rank: 14 },
  { id: 'hel', name: 'Helinor',   short: 'HEL', group: 'B', flag: { type: 'circle',   colors: ['#f2e8d0', '#b03a2e'] }, rank: 27 },
  // Group C
  { id: 'ica', name: 'Icarus',    short: 'ICA', group: 'C', flag: { type: 'vstripes', colors: ['#1c1c1a', '#d4a843', '#b03a2e'] }, rank: 2 },
  { id: 'jov', name: 'Joval',     short: 'JOV', group: 'C', flag: { type: 'hstripes', colors: ['#c4622d', '#f7f2e8', '#c4622d'] }, rank: 24 },
  { id: 'kes', name: 'Kestrelia', short: 'KES', group: 'C', flag: { type: 'cross',    colors: ['#1a2e1a', '#f7f2e8'] }, rank: 9 },
  { id: 'lyr', name: 'Lyrian',    short: 'LYR', group: 'C', flag: { type: 'diag',     colors: ['#b03a2e', '#1c4f8c'] }, rank: 33 },
  // Group D
  { id: 'mar', name: 'Marindor',  short: 'MAR', group: 'D', flag: { type: 'vstripes', colors: ['#1a2e1a', '#f2e8d0', '#c4622d'] }, rank: 1 },
  { id: 'nor', name: 'Norvalia',  short: 'NOR', group: 'D', flag: { type: 'cross',    colors: ['#1c4f8c', '#d4a843'] }, rank: 19 },
  { id: 'ost', name: 'Ostralia',  short: 'OST', group: 'D', flag: { type: 'hstripes', colors: ['#d4a843', '#1c1c1a', '#d4a843'] }, rank: 13 },
  { id: 'pet', name: 'Petralis',  short: 'PET', group: 'D', flag: { type: 'circle',   colors: ['#3d87b3', '#f7f2e8'] }, rank: 25 },
];

const TEAM_BY_ID = Object.fromEntries(TEAMS.map(t => [t.id, t]));

// ─── Cities / venues ───
const VENUES = [
  { city: 'Mexico City',  country: 'MX', stadium: 'Estadio Azteca' },
  { city: 'Toronto',      country: 'CA', stadium: 'BMO Field' },
  { city: 'Los Angeles',  country: 'US', stadium: 'SoFi Stadium' },
  { city: 'New York',     country: 'US', stadium: 'MetLife Stadium' },
  { city: 'Dallas',       country: 'US', stadium: 'AT&T Stadium' },
  { city: 'Vancouver',    country: 'CA', stadium: 'BC Place' },
  { city: 'Miami',        country: 'US', stadium: 'Hard Rock Stadium' },
  { city: 'Guadalajara',  country: 'MX', stadium: 'Estadio Akron' },
  { city: 'Seattle',      country: 'US', stadium: 'Lumen Field' },
  { city: 'Boston',       country: 'US', stadium: 'Gillette Stadium' },
  { city: 'Atlanta',      country: 'US', stadium: 'Mercedes-Benz Stadium' },
  { city: 'Monterrey',    country: 'MX', stadium: 'Estadio BBVA' },
];

// ─── Match generator ───
// Mid group stage: matchday 2 done for group A & B (partial), matchday 1 done for all, MD3 upcoming
// "Now" is anchored: 2026-06-19T15:00:00-04:00 (mid group stage, mid-week)
const NOW = new Date('2026-06-19T19:00:00Z'); // 3pm ET on June 19, 2026

function mkMatch(id, homeId, awayId, kickoffISO, stage, group, venue, result) {
  return {
    id,
    home: homeId, away: awayId,
    kickoff_utc: kickoffISO,
    stage, group,
    venue: venue.stadium, city: venue.city, country: venue.country,
    result, // {h, a} if final; null if upcoming/live
  };
}

const MATCHES = [
  // ── Group A — matchday 1 (all final) ──
  mkMatch('m001', 'arg', 'cas', '2026-06-11T20:00:00Z', 'group', 'A', VENUES[0], { h: 2, a: 1 }),
  mkMatch('m002', 'bel', 'dra', '2026-06-12T00:00:00Z', 'group', 'A', VENUES[2], { h: 1, a: 1 }),
  // ── Group A — matchday 2 (final) ──
  mkMatch('m003', 'arg', 'dra', '2026-06-16T20:00:00Z', 'group', 'A', VENUES[0], { h: 3, a: 0 }),
  mkMatch('m004', 'cas', 'bel', '2026-06-17T00:00:00Z', 'group', 'A', VENUES[3], { h: 0, a: 2 }),
  // ── Group A — matchday 3 (upcoming) ──
  mkMatch('m005', 'arg', 'bel', '2026-06-21T20:00:00Z', 'group', 'A', VENUES[0], null),
  mkMatch('m006', 'cas', 'dra', '2026-06-21T20:00:00Z', 'group', 'A', VENUES[3], null),

  // ── Group B — matchday 1 (final) ──
  mkMatch('m007', 'emb', 'gra', '2026-06-12T20:00:00Z', 'group', 'B', VENUES[4], { h: 2, a: 2 }),
  mkMatch('m008', 'flo', 'hel', '2026-06-13T00:00:00Z', 'group', 'B', VENUES[5], { h: 0, a: 1 }),
  // ── Group B — matchday 2 (final) ──
  mkMatch('m009', 'emb', 'hel', '2026-06-17T20:00:00Z', 'group', 'B', VENUES[4], { h: 4, a: 0 }),
  mkMatch('m010', 'gra', 'flo', '2026-06-18T00:00:00Z', 'group', 'B', VENUES[6], { h: 1, a: 1 }),
  // ── Group B — matchday 3 (upcoming) ──
  mkMatch('m011', 'emb', 'flo', '2026-06-22T20:00:00Z', 'group', 'B', VENUES[4], null),
  mkMatch('m012', 'gra', 'hel', '2026-06-22T20:00:00Z', 'group', 'B', VENUES[6], null),

  // ── Group C — matchday 1 (final) ──
  mkMatch('m013', 'ica', 'kes', '2026-06-13T19:00:00Z', 'group', 'C', VENUES[7], { h: 3, a: 1 }),
  mkMatch('m014', 'jov', 'lyr', '2026-06-13T23:00:00Z', 'group', 'C', VENUES[8], { h: 1, a: 0 }),
  // ── Group C — matchday 2 (TODAY — upcoming, kicks off in 4 hours) ──
  mkMatch('m015', 'ica', 'lyr', '2026-06-19T23:00:00Z', 'group', 'C', VENUES[7], null),
  mkMatch('m016', 'jov', 'kes', '2026-06-20T03:00:00Z', 'group', 'C', VENUES[8], null),
  // ── Group C — matchday 3 (upcoming) ──
  mkMatch('m017', 'ica', 'jov', '2026-06-24T19:00:00Z', 'group', 'C', VENUES[7], null),
  mkMatch('m018', 'kes', 'lyr', '2026-06-24T23:00:00Z', 'group', 'C', VENUES[9], null),

  // ── Group D — matchday 1 (final) ──
  mkMatch('m019', 'mar', 'ost', '2026-06-14T20:00:00Z', 'group', 'D', VENUES[10], { h: 2, a: 0 }),
  mkMatch('m020', 'nor', 'pet', '2026-06-15T00:00:00Z', 'group', 'D', VENUES[11], { h: 1, a: 0 }),
  // ── Group D — matchday 2 (upcoming, tomorrow) ──
  mkMatch('m021', 'mar', 'pet', '2026-06-20T20:00:00Z', 'group', 'D', VENUES[10], null),
  mkMatch('m022', 'nor', 'ost', '2026-06-21T00:00:00Z', 'group', 'D', VENUES[11], null),
  // ── Group D — matchday 3 ──
  mkMatch('m023', 'mar', 'nor', '2026-06-25T20:00:00Z', 'group', 'D', VENUES[10], null),
  mkMatch('m024', 'ost', 'pet', '2026-06-25T20:00:00Z', 'group', 'D', VENUES[11], null),

  // ── Round of 16 (TBD slots, upcoming) ──
  { id: 'm025', home: 'TBD', away: 'TBD', kickoff_utc: '2026-06-29T20:00:00Z', stage: 'round_of_16', group: null, venue: 'SoFi Stadium', city: 'Los Angeles', country: 'US', result: null, tbdLabel: ['Winner Group A', 'Runner-up Group B'] },
  { id: 'm026', home: 'TBD', away: 'TBD', kickoff_utc: '2026-06-30T00:00:00Z', stage: 'round_of_16', group: null, venue: 'MetLife Stadium', city: 'New York', country: 'US', result: null, tbdLabel: ['Winner Group C', 'Runner-up Group D'] },

  // ── Final ──
  { id: 'm104', home: 'TBD', away: 'TBD', kickoff_utc: '2026-07-19T19:00:00Z', stage: 'final', group: null, venue: 'MetLife Stadium', city: 'New York', country: 'US', result: null, tbdLabel: ['TBD', 'TBD'] },
];

// ─── Pod members (other users) ───
const POD_MEMBERS = [
  { id: 'me',  name: 'Riley',   initials: 'RL', avatarBg: '#c4622d', avatarFg: '#f7f2e8', timezone: 'America/New_York', isMe: true,  admin: true },
  { id: 'u2',  name: 'Marco',   initials: 'MA', avatarBg: '#d4a843', avatarFg: '#1c1c1a' },
  { id: 'u3',  name: 'Yuki',    initials: 'YU', avatarBg: '#6baed6', avatarFg: '#1c1c1a' },
  { id: 'u4',  name: 'Devon',   initials: 'DV', avatarBg: '#2d4a2d', avatarFg: '#f2e8d0' },
  { id: 'u5',  name: 'Priya',   initials: 'PR', avatarBg: '#b03a2e', avatarFg: '#f7f2e8' },
  { id: 'u6',  name: 'Sofia',   initials: 'SO', avatarBg: '#1c4f8c', avatarFg: '#f7f2e8' },
  { id: 'u7',  name: 'Hassan',  initials: 'HA', avatarBg: '#3a5d3a', avatarFg: '#f2e8d0' },
];

const POD_MEMBER_BY_ID = Object.fromEntries(POD_MEMBERS.map(m => [m.id, m]));

// ─── Pods ───
const PODS = [
  { id: 'p1', name: 'The Offside Trap',  members: ['me', 'u2', 'u3', 'u4', 'u5'], adminId: 'me' },
  { id: 'p2', name: 'Sunday League',     members: ['me', 'u3', 'u6', 'u7'],       adminId: 'u6' },
  { id: 'p3', name: "Couch's XI",        members: ['me', 'u2', 'u7'],              adminId: 'me' },
];

// ─── User's watched matches per pod ───
const WATCHED = {
  // p1 has matches on multi-game days so the calendar chip stacking is visible:
  //   Jun 16 ET: m003 (4pm) + m004 (8pm)
  //   Jun 20 ET: m021 (4pm) + m022 (8pm)
  //   Jun 21 ET: m005 (4pm) + m006 (4pm)
  //   Jun 22 ET: m011 (4pm) + m012 (4pm)
  p1: ['m003','m004','m005','m006','m009','m011','m012','m015','m017','m021','m022','m023','m025','m104'],
  p2: ['m015', 'm017', 'm021', 'm025'],
  p3: ['m011', 'm015', 'm023'],
};

// Which other members are watching each match in pod p1
const POD_WATCHING = {
  m001: ['me', 'u2', 'u3', 'u4', 'u5'],
  m003: ['me', 'u2', 'u3', 'u4'],
  m005: ['me', 'u2', 'u3', 'u4', 'u5'],   // Everyone's in
  m007: ['me', 'u2', 'u5'],
  m009: ['me', 'u3', 'u4'],
  m011: ['me', 'u2', 'u4'],
  m013: ['me', 'u3'],
  m015: ['me', 'u2', 'u3', 'u4', 'u5'],   // Everyone's in (today)
  m017: ['me', 'u2', 'u5'],
  m019: ['me', 'u4'],
  m021: ['me', 'u2', 'u3'],
  m023: ['me', 'u2', 'u3', 'u5'],
  m025: ['me', 'u2', 'u3', 'u4', 'u5'],
  m104: ['me', 'u2', 'u3', 'u4', 'u5'],
};

// ─── Predictions (per pod) ───
// For finalized matches we have everyone's predictions; for upcoming, only the user's may be locked or not
const PREDICTIONS = {
  // p1 / m001 (Argonia 2-1 Caspia) — exact: u2; winner: me, u4; wrong: u3, u5
  'p1:m001:me': { h: 2, a: 0, locked: true }, // winner correct
  'p1:m001:u2': { h: 2, a: 1, locked: true }, // exact
  'p1:m001:u3': { h: 0, a: 1, locked: true },
  'p1:m001:u4': { h: 3, a: 2, locked: true },
  'p1:m001:u5': { h: 1, a: 2, locked: true },

  // p1 / m003 (Argonia 3-0 Dravania) — exact: u3; winner: me, u2, u4
  'p1:m003:me': { h: 2, a: 0, locked: true },
  'p1:m003:u2': { h: 4, a: 1, locked: true },
  'p1:m003:u3': { h: 3, a: 0, locked: true }, // exact
  'p1:m003:u4': { h: 2, a: 1, locked: true },

  // p1 / m005 (Argonia v Beluga, upcoming Sun) — user predicted
  'p1:m005:me': { h: 1, a: 1, locked: false },
  'p1:m005:u2': { h: 2, a: 0, locked: false },

  // p1 / m007 (Emberia 2-2 Grandura) — winner none (draw); me + u5 got draw
  'p1:m007:me': { h: 1, a: 1, locked: true },
  'p1:m007:u2': { h: 3, a: 1, locked: true },
  'p1:m007:u5': { h: 2, a: 2, locked: true }, // exact

  // p1 / m009 (Emberia 4-0 Helinor) — exact: u4
  'p1:m009:me': { h: 3, a: 0, locked: true },
  'p1:m009:u3': { h: 2, a: 1, locked: true },
  'p1:m009:u4': { h: 4, a: 0, locked: true }, // exact

  // p1 / m011 (Emberia v Floravia, upcoming Mon)
  // user has not predicted yet

  // p1 / m013 (Icarus 3-1 Kestrelia)
  'p1:m013:me': { h: 2, a: 1, locked: true },
  'p1:m013:u3': { h: 3, a: 2, locked: true },

  // p1 / m015 (Icarus v Lyrian — TODAY, kicks off in ~4hr) — predictions still open but user predicted
  'p1:m015:me': { h: 3, a: 0, locked: false },
  'p1:m015:u2': { h: 2, a: 1, locked: false },
  'p1:m015:u3': { h: 4, a: 0, locked: false },
  'p1:m015:u5': { h: 2, a: 0, locked: false },
  // u4 has not predicted yet

  // p1 / m019 (Marindor 2-0 Ostralia)
  'p1:m019:me': { h: 2, a: 0, locked: true }, // exact
  'p1:m019:u4': { h: 1, a: 0, locked: true },
};

// ─── Venue votes (per pod / match) ───
// Each entry: { matchId, options: [{id, label, address?, voters: [userIds]}] }
const VENUE_VOTES = {
  'p1:m005': {
    options: [
      { id: 'v1', label: 'Bar',              address: null, voters: ['me', 'u2', 'u4'] },
      { id: 'v2', label: "Someone's place",  address: null, voters: ['u3'] },
      { id: 'v3', label: 'Solo',             address: null, voters: [] },
      { id: 'v4', label: "The Stag's Head",  address: '124 Atlantic Ave, Brooklyn',  voters: ['u5'] },
    ],
  },
  'p1:m015': {
    options: [
      { id: 'v1', label: 'Bar',              address: null, voters: ['u3', 'u5'] },
      { id: 'v2', label: "Someone's place",  address: null, voters: ['me', 'u2'] },
      { id: 'v3', label: 'Solo',             address: null, voters: [] },
      { id: 'v4', label: "Marco's apartment", address: '88 Bedford Ave, Brooklyn', voters: ['u4'] },
    ],
  },
  'p1:m011': {
    options: [
      { id: 'v1', label: 'Bar',              address: null, voters: [] },
      { id: 'v2', label: "Someone's place",  address: null, voters: ['me'] },
      { id: 'v3', label: 'Solo',             address: null, voters: [] },
    ],
  },
  'p1:m025': {
    options: [
      { id: 'v1', label: 'Bar',              address: null, voters: ['me', 'u2', 'u3', 'u4'] },
      { id: 'v2', label: "Someone's place",  address: null, voters: ['u5'] },
      { id: 'v3', label: 'Solo',             address: null, voters: [] },
    ],
  },
};

// ─── Contextual labels generator ───
function matchLabels(match) {
  if (!match || match.home === 'TBD') return [];
  const home = TEAM_BY_ID[match.home];
  const away = TEAM_BY_ID[match.away];
  const labels = [];
  if (home && away) {
    if ((home.rank <= 10 && away.rank > 25) || (away.rank <= 10 && home.rank > 25)) {
      labels.push('UPSET WATCH');
    }
    if (home.rank <= 5 && away.rank <= 10) labels.push('BIG MATCH');
    else if (away.rank <= 5 && home.rank <= 10) labels.push('BIG MATCH');
  }
  // Early kick (hardcoded: m016 = 11pm ET, m020 = 8pm ET, m013 = 3pm ET)
  if (match.id === 'm013') labels.push('EARLY KICK');
  return labels;
}

// ─── Time helpers ───
function fmtKickoff(utc, tz, opts = {}) {
  const d = new Date(utc);
  const day = d.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' });
  if (opts.dayOnly) return day;
  if (opts.timeOnly) return time;
  return { day, time };
}

function relativeDay(utc, tz, now = NOW) {
  const d = new Date(utc);
  const sameDay = (a, b) => {
    const af = a.toLocaleDateString('en-US', { timeZone: tz });
    const bf = b.toLocaleDateString('en-US', { timeZone: tz });
    return af === bf;
  };
  if (sameDay(d, now)) return 'Today';
  const tom = new Date(now.getTime() + 86400000);
  if (sameDay(d, tom)) return 'Tomorrow';
  const yesterday = new Date(now.getTime() - 86400000);
  if (sameDay(d, yesterday)) return 'Yesterday';
  return null;
}

function minutesUntil(utc, now = NOW) {
  const diff = (new Date(utc).getTime() - now.getTime()) / 60000;
  return Math.round(diff);
}

function isLocked(utc, now = NOW) {
  return minutesUntil(utc, now) <= 1;
}
function isFinal(match) {
  return !!match.result;
}
function isUpcoming(match, now = NOW) {
  return !match.result && minutesUntil(match.kickoff_utc, now) > 0;
}
function isLive(match, now = NOW) {
  // Within 2 hours of kickoff and no result
  const m = minutesUntil(match.kickoff_utc, now);
  return !match.result && m <= 0 && m > -120;
}

// ─── Scoring ───
function calcPoints(prediction, result) {
  if (!prediction || !result) return null;
  if (prediction.h === result.h && prediction.a === result.a) return 3;
  const predDiff = prediction.h - prediction.a;
  const realDiff = result.h - result.a;
  const sameSign = Math.sign(predDiff) === Math.sign(realDiff);
  if (sameSign) return 1;
  return 0;
}

// ─── Leaderboard ───
function leaderboard(podId) {
  const members = PODS.find(p => p.id === podId).members;
  return members.map(uid => {
    let pts = 0, exact = 0, predictions = 0, wins = 0;
    for (const m of MATCHES) {
      if (!m.result) continue;
      const pred = PREDICTIONS[`${podId}:${m.id}:${uid}`];
      if (!pred) continue;
      predictions++;
      const p = calcPoints(pred, m.result);
      pts += p;
      if (p === 3) exact++;
      if (p >= 1) wins++;
    }
    return { uid, member: POD_MEMBER_BY_ID[uid], pts, exact, predictions, wins };
  }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);
}

// ─── Contextual leaderboard taglines ───
function leaderboardTag(entry, rank, allEntries) {
  if (rank === allEntries.length - 1 && entry.predictions > 0) return 'In last, unbothered';
  if (entry.exact >= 2) return 'Exact score merchant';
  if (entry.predictions > 0 && entry.exact === 0 && entry.wins / entry.predictions > 0.6) return 'Perfectly average';
  if (rank === 0) return 'Pace setter';
  if (entry.predictions >= 4 && entry.wins === entry.predictions) return 'Cold-blooded';
  return null;
}

Object.assign(window, {
  TEAMS, TEAM_BY_ID, MATCHES, POD_MEMBERS, POD_MEMBER_BY_ID, PODS, WATCHED, POD_WATCHING,
  PREDICTIONS, VENUE_VOTES, VENUES, NOW,
  matchLabels, fmtKickoff, relativeDay, minutesUntil, isLocked, isFinal, isUpcoming, isLive,
  calcPoints, leaderboard, leaderboardTag,
});
