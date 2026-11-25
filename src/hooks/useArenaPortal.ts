import { useCallback, useEffect, useState } from 'react';
import { createSeedData, uid } from '../data/seed.ts';
import type {
  ActionResult,
  ArenaDB,
  FeedType,
  PortalTab,
  TournamentFormat,
  TournamentMode,
  UserRole,
  UserSession,
} from '../types.ts';

const DB_KEY = 'arena_portal_db_v1';
const USER_KEY = 'arena_user';

function loadInitialDB(): ArenaDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ArenaDB;
      if (
        Array.isArray(parsed.tournaments) &&
        Array.isArray(parsed.teams) &&
        Array.isArray(parsed.matches) &&
        Array.isArray(parsed.feed)
      ) {
        return parsed;
      }
    }
  } catch {
    // Fall back to fresh seed data if storage is unavailable or corrupted
  }
  const seed = createSeedData();
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
  } catch {
    // Ignore quota errors
  }
  return seed;
}

function loadInitialSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    if (
      parsed.user &&
      (parsed.role === 'organizer' ||
        parsed.role === 'player' ||
        parsed.role === 'spectator')
    ) {
      return { user: parsed.user, role: parsed.role };
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

export function useArenaPortal() {
  const [db, setDb] = useState<ArenaDB>(loadInitialDB);
  const [session, setSession] = useState<UserSession | null>(loadInitialSession);
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [matchTournamentId, setMatchTournamentId] = useState<string>(
    () => db.tournaments[0]?.id ?? ''
  );
  const [leaderboardTournamentId, setLeaderboardTournamentId] = useState<string>(
    () => db.tournaments[0]?.id ?? ''
  );

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      // Ignore storage write errors
    }
  }, [db]);

  useEffect(() => {
    if (!db.tournaments.some((t) => t.id === matchTournamentId)) {
      setMatchTournamentId(db.tournaments[0]?.id ?? '');
    }
    if (!db.tournaments.some((t) => t.id === leaderboardTournamentId)) {
      setLeaderboardTournamentId(db.tournaments[0]?.id ?? '');
    }
  }, [db.tournaments, matchTournamentId, leaderboardTournamentId]);

  const login = useCallback(
    (username: string, password: string, role: UserRole): ActionResult => {
      const cleanUser = username.trim();
      if (!cleanUser || !password) {
        return { ok: false, error: 'Please enter username and password.' };
      }
      if (password.length < 4) {
        return { ok: false, error: 'Password must be at least 4 characters.' };
      }
      const nextSession: UserSession = { user: cleanUser, role };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(nextSession));
      } catch {
        // Ignore storage write errors
      }
      setSession(nextSession);
      setActiveTab('dashboard');
      return { ok: true };
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage errors
    }
    setSession(null);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated: UserSession = { ...prev, role };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  }, []);

  const createTournament = useCallback(
    (input: {
      name: string;
      game: string;
      format: TournamentFormat;
      mode: TournamentMode;
      date: string;
      maxTeams: number;
      prize: number;
    }): ActionResult => {
      const name = input.name.trim();
      const game = input.game.trim();
      if (!name || !game) {
        return {
          ok: false,
          error: 'Give the tournament a name and a game.',
        };
      }
      const id = uid('t');
      const newTournament = {
        id,
        name,
        game,
        format: input.format,
        mode: input.mode,
        date: input.date || new Date().toISOString().slice(0, 10),
        maxTeams: Math.max(2, Number(input.maxTeams) || 8),
        prize: Math.max(0, Number(input.prize) || 0),
        status: 'upcoming' as const,
      };
      const feedEntry = {
        id: uid('f'),
        type: 'info' as FeedType,
        text: `${newTournament.name} was created — ${newTournament.format}, ${newTournament.mode.toLowerCase()}, opens for registration.`,
        ts: Date.now(),
      };
      setDb((prev) => ({
        ...prev,
        tournaments: [...prev.tournaments, newTournament],
        feed: [feedEntry, ...prev.feed],
      }));
      return { ok: true };
    },
    []
  );

  const toggleTournamentStatus = useCallback((tournamentId: string) => {
    setDb((prev) => {
      const target = prev.tournaments.find((t) => t.id === tournamentId);
      if (!target) return prev;
      const nextStatus = target.status === 'live' ? 'done' : 'live';
      const feedEntry = {
        id: uid('f'),
        type: 'info' as FeedType,
        text: `${target.name} is now ${
          nextStatus === 'live' ? 'live' : 'marked complete'
        }.`,
        ts: Date.now(),
      };
      return {
        ...prev,
        tournaments: prev.tournaments.map((t) =>
          t.id === tournamentId ? { ...t, status: nextStatus } : t
        ),
        feed: [feedEntry, ...prev.feed],
      };
    });
  }, []);

  const registerTeam = useCallback(
    (input: {
      name: string;
      tag: string;
      tournamentId: string;
      players: string[];
    }): ActionResult => {
      const name = input.name.trim();
      if (!name || !input.tournamentId) {
        return {
          ok: false,
          error: 'Give the team a name and pick a tournament.',
        };
      }

      const tournament = db.tournaments.find((t) => t.id === input.tournamentId);
      if (!tournament) {
        return { ok: false, error: 'Selected tournament could not be found.' };
      }

      const registeredCount = db.teams.filter(
        (t) => t.tournamentId === input.tournamentId
      ).length;
      if (registeredCount >= tournament.maxTeams) {
        return {
          ok: false,
          error: 'This tournament has already reached its team limit.',
        };
      }

      const cleanTag =
        input.tag.trim().toUpperCase() || name.slice(0, 3).toUpperCase();
      const newTeam = {
        id: uid('tm'),
        name,
        tag: cleanTag,
        tournamentId: input.tournamentId,
        players: input.players,
      };
      const feedEntry = {
        id: uid('f'),
        type: 'reg' as FeedType,
        text: `${newTeam.name} registered for ${tournament.name}.`,
        ts: Date.now(),
      };

      setDb((prev) => ({
        ...prev,
        teams: [...prev.teams, newTeam],
        feed: [feedEntry, ...prev.feed],
      }));
      return { ok: true };
    },
    [db.tournaments, db.teams]
  );

  const scheduleMatch = useCallback(
    (input: {
      tournamentId: string;
      teamA: string;
      teamB: string;
      round: string;
      time: string;
    }): ActionResult => {
      if (!input.tournamentId) {
        return { ok: false, error: 'Create a tournament first.' };
      }
      if (!input.teamA || !input.teamB || input.teamA === input.teamB) {
        return { ok: false, error: 'Pick two different teams.' };
      }

      const tournament = db.tournaments.find((t) => t.id === input.tournamentId);
      const teamA = db.teams.find((t) => t.id === input.teamA);
      const teamB = db.teams.find((t) => t.id === input.teamB);
      if (!tournament || !teamA || !teamB) {
        return { ok: false, error: 'Selected teams or tournament not found.' };
      }

      const round = input.round.trim() || 'Round 1';
      const parsedTime = input.time
        ? new Date(input.time).toISOString()
        : new Date().toISOString();

      const newMatch = {
        id: uid('m'),
        tournamentId: input.tournamentId,
        round,
        teamA: input.teamA,
        teamB: input.teamB,
        scoreA: 0,
        scoreB: 0,
        status: 'scheduled' as const,
        time: parsedTime,
      };
      const feedEntry = {
        id: uid('f'),
        type: 'info' as FeedType,
        text: `${round} scheduled: ${teamA.name} vs ${teamB.name} (${tournament.name}).`,
        ts: Date.now(),
      };

      setDb((prev) => ({
        ...prev,
        matches: [...prev.matches, newMatch],
        feed: [feedEntry, ...prev.feed],
      }));
      return { ok: true };
    },
    [db.tournaments, db.teams]
  );

  const updateMatchScore = useCallback(
    (matchId: string, side: 'A' | 'B', rawValue: number) => {
      const value = Math.max(0, Number.isFinite(rawValue) ? rawValue : 0);
      setDb((prev) => ({
        ...prev,
        matches: prev.matches.map((m) =>
          m.id === matchId
            ? side === 'A'
              ? { ...m, scoreA: value }
              : { ...m, scoreB: value }
            : m
        ),
      }));
    },
    []
  );

  const finalizeMatch = useCallback((matchId: string) => {
    setDb((prev) => {
      const match = prev.matches.find((m) => m.id === matchId);
      if (!match) return prev;
      const teamA = prev.teams.find((t) => t.id === match.teamA);
      const teamB = prev.teams.find((t) => t.id === match.teamB);
      if (!teamA || !teamB) return prev;

      const winner =
        match.scoreA === match.scoreB
          ? null
          : match.scoreA > match.scoreB
            ? teamA.name
            : teamB.name;
      const text = winner
        ? `${winner} won ${Math.max(match.scoreA, match.scoreB)}–${Math.min(
            match.scoreA,
            match.scoreB
          )} against ${winner === teamA.name ? teamB.name : teamA.name} (${
            match.round
          }).`
        : `${teamA.name} and ${teamB.name} drew ${match.scoreA}–${match.scoreB} (${match.round}).`;

      const feedEntry = {
        id: uid('f'),
        type: 'result' as FeedType,
        text,
        ts: Date.now(),
      };

      return {
        ...prev,
        matches: prev.matches.map((m) =>
          m.id === matchId ? { ...m, status: 'final' } : m
        ),
        feed: [feedEntry, ...prev.feed],
      };
    });
  }, []);

  const reopenMatch = useCallback((matchId: string) => {
    setDb((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId ? { ...m, status: 'scheduled' } : m
      ),
    }));
  }, []);

  const navigateToMatches = useCallback((tournamentId: string) => {
    setMatchTournamentId(tournamentId);
    setActiveTab('matches');
  }, []);

  const navigateToLeaderboard = useCallback((tournamentId: string) => {
    setLeaderboardTournamentId(tournamentId);
    setActiveTab('leaderboard');
  }, []);

  return {
    db,
    session,
    activeTab,
    setActiveTab,
    matchTournamentId,
    setMatchTournamentId,
    leaderboardTournamentId,
    setLeaderboardTournamentId,
    login,
    logout,
    setRole,
    createTournament,
    toggleTournamentStatus,
    registerTeam,
    scheduleMatch,
    updateMatchScore,
    finalizeMatch,
    reopenMatch,
    navigateToMatches,
    navigateToLeaderboard,
  };
}
