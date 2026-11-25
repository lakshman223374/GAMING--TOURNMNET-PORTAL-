import type { Tournament, UserRole } from '../types.ts';

interface TournamentCardProps {
  tournament: Tournament;
  teamCount: number;
  role: UserRole;
  onViewMatches: (tournamentId: string) => void;
  onViewStandings: (tournamentId: string) => void;
  onToggleStatus: (tournamentId: string) => void;
}

const STATUS_META: Record<
  Tournament['status'],
  { label: string; className: string }
> = {
  live: { label: 'Live', className: 'text-[#33D6A6]' },
  upcoming: { label: 'Upcoming', className: 'text-[#7C5CFF]' },
  done: { label: 'Completed', className: 'text-[#9198B8]' },
};

export function TournamentCard({
  tournament,
  teamCount,
  role,
  onViewMatches,
  onViewStandings,
  onToggleStatus,
}: TournamentCardProps) {
  const pct = Math.min(
    100,
    Math.round((teamCount / Math.max(1, tournament.maxTeams)) * 100)
  );
  const statusInfo = STATUS_META[tournament.status];

  return (
    <article className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#F5A623] truncate">
          {tournament.game}
        </span>
        <span className={`font-medium shrink-0 ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold text-[#E7E9F5] leading-snug">
        {tournament.name}
      </h3>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#9198B8]">
        <span>{tournament.format}</span>
        <span aria-hidden="true">·</span>
        <span>{tournament.mode}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{tournament.date}</span>
      </div>

      <div className="font-display text-xl font-semibold text-[#F5A623] tabular-nums">
        ${Number(tournament.prize).toLocaleString()} prize pool
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-[#9198B8] mb-1.5 tabular-nums">
          <span>
            {teamCount} / {tournament.maxTeams} teams registered
          </span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1F2440] overflow-hidden">
          <div
            className="h-full bg-[#7C5CFF] transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 mt-auto">
        <button
          type="button"
          onClick={() => onViewMatches(tournament.id)}
          className="px-3 py-1.5 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
        >
          View matches
        </button>
        <button
          type="button"
          onClick={() => onViewStandings(tournament.id)}
          className="px-3 py-1.5 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
        >
          Standings
        </button>
        {role === 'organizer' && (
          <button
            type="button"
            onClick={() => onToggleStatus(tournament.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2 ${
              tournament.status === 'live'
                ? 'bg-[#FF5D7A] text-[#2A0A10] hover:opacity-90'
                : 'bg-[#33D6A6] text-[#08281F] hover:opacity-90'
            }`}
          >
            {tournament.status === 'live' ? 'Mark complete' : 'Go live'}
          </button>
        )}
      </div>
    </article>
  );
}
