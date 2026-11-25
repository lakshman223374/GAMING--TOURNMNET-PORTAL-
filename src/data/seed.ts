import type { ArenaDB, Match, StandingRow, Team } from '../types.ts';

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createSeedData(): ArenaDB {
  const t1 = uid('t');
  const t2 = uid('t');
  const teamA = uid('tm');
  const teamB = uid('tm');
  const teamC = uid('tm');
  const teamD = uid('tm');
  const now = Date.now();

  return {
    tournaments: [
      {
        id: t1,
        name: 'Midnight Cup',
        game: 'Valorant',
        format: 'Single elimination',
        mode: 'Online',
        date: new Date(now + 86400000 * 2).toISOString().slice(0, 10),
        maxTeams: 8,
        prize: 2000,
        status: 'live',
      },
      {
        id: t2,
        name: 'Grand Clash Invitational',
        game: 'Rocket League',
        format: 'Round robin',
        mode: 'In-person',
        date: new Date(now + 86400000 * 9).toISOString().slice(0, 10),
        maxTeams: 6,
        prize: 500,
        status: 'upcoming',
      },
    ],
    teams: [
      {
        id: teamA,
        name: 'Nova Wolves',
        tag: 'NVW',
        tournamentId: t1,
        players: ['Kira', '.dust', 'Ren'],
      },
      {
        id: teamB,
        name: 'Iron Vultures',
        tag: 'IRV',
        tournamentId: t1,
        players: ['Beau', 'Mochi', 'Sable', 'Quill'],
      },
      {
        id: teamC,
        name: 'Static Bloom',
        tag: 'STB',
        tournamentId: t2,
        players: ['Pax', 'Umi'],
      },
      {
        id: teamD,
        name: 'Redline Circuit',
        tag: 'RLC',
        tournamentId: t2,
        players: ['Vex', 'Onyx', 'Toro'],
      },
    ],
    matches: [
      {
        id: uid('m'),
        tournamentId: t1,
        round: 'Round 1',
        teamA,
        teamB,
        scoreA: 2,
        scoreB: 1,
        status: 'final',
        time: new Date(now - 3600000 * 5).toISOString(),
      },
    ],
    feed: [
      {
        id: uid('f'),
        type: 'result',
        text: 'Nova Wolves defeated Iron Vultures 2–1 in Round 1 of Midnight Cup.',
        ts: now - 3600000 * 5,
      },
      {
        id: uid('f'),
        type: 'reg',
        text: 'Redline Circuit registered for Grand Clash Invitational.',
        ts: now - 3600000 * 20,
      },
      {
        id: uid('f'),
        type: 'info',
        text: 'Midnight Cup bracket opened for registration.',
        ts: now - 3600000 * 40,
      },
    ],
  };
}

export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function computeStandings(
  tournamentId: string,
  teams: Team[],
  matches: Match[]
): StandingRow[] {
  const scopedTeams = teams.filter((t) => t.tournamentId === tournamentId);
  const table: Record<string, StandingRow> = {};

  for (const team of scopedTeams) {
    table[team.id] = { team, played: 0, w: 0, l: 0, d: 0, pts: 0 };
  }

  for (const m of matches) {
    if (m.tournamentId !== tournamentId || m.status !== 'final') continue;
    const rowA = table[m.teamA];
    const rowB = table[m.teamB];
    if (!rowA || !rowB) continue;

    rowA.played += 1;
    rowB.played += 1;

    if (m.scoreA > m.scoreB) {
      rowA.w += 1;
      rowB.l += 1;
      rowA.pts += 3;
    } else if (m.scoreB > m.scoreA) {
      rowB.w += 1;
      rowA.l += 1;
      rowB.pts += 3;
    } else {
      rowA.d += 1;
      rowB.d += 1;
      rowA.pts += 1;
      rowB.pts += 1;
    }
  }

  return Object.values(table).sort(
    (a, b) => b.pts - a.pts || b.w - b.l - (a.w - a.l)
  );
}
