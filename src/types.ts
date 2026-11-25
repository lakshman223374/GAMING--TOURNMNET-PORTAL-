export type UserRole = 'organizer' | 'player' | 'spectator';

export type PortalTab =
  | 'dashboard'
  | 'tournaments'
  | 'teams'
  | 'matches'
  | 'leaderboard'
  | 'feed';

export type TournamentStatus = 'live' | 'upcoming' | 'done';

export type TournamentFormat =
  | 'Single elimination'
  | 'Double elimination'
  | 'Round robin';

export type TournamentMode = 'Online' | 'In-person';

export interface Tournament {
  id: string;
  name: string;
  game: string;
  format: TournamentFormat;
  mode: TournamentMode;
  date: string;
  maxTeams: number;
  prize: number;
  status: TournamentStatus;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  tournamentId: string;
  players: string[];
}

export type MatchStatus = 'scheduled' | 'final';

export interface Match {
  id: string;
  tournamentId: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  time: string;
}

export type FeedType = 'result' | 'reg' | 'info';

export interface FeedItem {
  id: string;
  type: FeedType;
  text: string;
  ts: number;
}

export interface ArenaDB {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  feed: FeedItem[];
}

export interface UserSession {
  user: string;
  role: UserRole;
}

export interface StandingRow {
  team: Team;
  played: number;
  w: number;
  l: number;
  d: number;
  pts: number;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}
