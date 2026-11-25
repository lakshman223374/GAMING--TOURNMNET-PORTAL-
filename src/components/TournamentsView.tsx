import { useState, type FormEvent } from 'react';
import type {
  ActionResult,
  Team,
  Tournament,
  TournamentFormat,
  TournamentMode,
  TournamentStatus,
  UserRole,
} from '../types.ts';
import { TournamentCard } from './TournamentCard.tsx';

interface TournamentsViewProps {
  tournaments: Tournament[];
  teams: Team[];
  role: UserRole;
  onCreateTournament: (input: {
    name: string;
    game: string;
    format: TournamentFormat;
    mode: TournamentMode;
    date: string;
    maxTeams: number;
    prize: number;
  }) => ActionResult;
  onViewMatches: (tournamentId: string) => void;
  onViewStandings: (tournamentId: string) => void;
  onToggleStatus: (tournamentId: string) => void;
}

type FilterState = 'all' | TournamentStatus;

export function TournamentsView({
  tournaments,
  teams,
  role,
  onCreateTournament,
  onViewMatches,
  onViewStandings,
  onToggleStatus,
}: TournamentsViewProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<FilterState>('all');
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('Single elimination');
  const [mode, setMode] = useState<TournamentMode>('Online');
  const [date, setDate] = useState('');
  const [maxTeams, setMaxTeams] = useState(8);
  const [prize, setPrize] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const res = onCreateTournament({
      name,
      game,
      format,
      mode,
      date,
      maxTeams,
      prize,
    });
    if (!res.ok) {
      setError(res.error ?? 'Could not create tournament.');
      return;
    }
    setError('');
    setName('');
    setGame('');
    setDate('');
    setPrize(0);
    setMaxTeams(8);
    setShowCreate(false);
  };

  const filtered =
    filter === 'all'
      ? tournaments
      : tournaments.filter((t) => t.status === filter);

  return (
    <section aria-labelledby="tournaments-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            id="tournaments-heading"
            className="font-display text-2xl sm:text-[26px] font-bold text-[#E7E9F5] tracking-tight"
          >
            Tournaments
          </h1>
          <p className="text-sm text-[#9198B8] mt-1 max-w-[56ch]">
            Browse open brackets, check schedules, and register your team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#171B2E] border border-[#2A2F4A] rounded-lg">
            {(
              [
                ['all', 'All'],
                ['live', 'Live'],
                ['upcoming', 'Upcoming'],
                ['done', 'Completed'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === key
                    ? 'bg-[#1F2440] text-[#E7E9F5]'
                    : 'text-[#9198B8] hover:text-[#E7E9F5]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {role === 'organizer' && (
            <button
              type="button"
              onClick={() => {
                setShowCreate((prev) => !prev);
                setError('');
              }}
              className="px-4 py-2 text-sm font-semibold bg-[#7C5CFF] hover:bg-[#5B44BE] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
            >
              Create tournament
            </button>
          )}
        </div>
      </div>

      {role === 'organizer' && showCreate && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 space-y-4"
        >
          <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
            New tournament
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="ntName"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Tournament name
              </label>
              <input
                id="ntName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Midnight Cup"
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              />
            </div>
            <div>
              <label
                htmlFor="ntGame"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Game
              </label>
              <input
                id="ntGame"
                type="text"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                placeholder="Valorant"
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="ntFormat"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Format
              </label>
              <select
                id="ntFormat"
                value={format}
                onChange={(e) => setFormat(e.target.value as TournamentFormat)}
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              >
                <option value="Single elimination">Single elimination</option>
                <option value="Double elimination">Double elimination</option>
                <option value="Round robin">Round robin</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="ntMode"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Mode
              </label>
              <select
                id="ntMode"
                value={mode}
                onChange={(e) => setMode(e.target.value as TournamentMode)}
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              >
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="ntDate"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Start date
              </label>
              <input
                id="ntDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              />
            </div>
            <div>
              <label
                htmlFor="ntMax"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Max teams
              </label>
              <input
                id="ntMax"
                type="number"
                min={2}
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              />
            </div>
            <div>
              <label
                htmlFor="ntPrize"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Prize pool ($)
              </label>
              <input
                id="ntPrize"
                type="number"
                min={0}
                value={prize}
                onChange={(e) => setPrize(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="text-[13px] text-[#FF5D7A] bg-[#FF5D7A]/10 border border-[#FF5D7A]/30 rounded-lg px-3 py-2"
            >
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-[#7C5CFF] hover:bg-[#5B44BE] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Create tournament
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setError('');
              }}
              className="px-4 py-2 text-sm font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl py-12 px-5 text-center">
          <h3 className="font-display text-base font-semibold text-[#E7E9F5] mb-1">
            No tournaments match this view
          </h3>
          <p className="text-sm text-[#9198B8]">
            {tournaments.length === 0
              ? 'Create your first tournament to get started.'
              : 'Switch the status filter above to see other tournaments.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              teamCount={
                teams.filter((tm) => tm.tournamentId === tournament.id).length
              }
              role={role}
              onViewMatches={onViewMatches}
              onViewStandings={onViewStandings}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}
