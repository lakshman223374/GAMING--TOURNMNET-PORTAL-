import { computeStandings } from '../data/seed.ts';
import type { Match, Team, Tournament } from '../types.ts';

interface LeaderboardViewProps {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  selectedTournamentId: string;
  onSelectTournament: (id: string) => void;
}

export function LeaderboardView({
  tournaments,
  teams,
  matches,
  selectedTournamentId,
  onSelectTournament,
}: LeaderboardViewProps) {
  const rows = computeStandings(selectedTournamentId, teams, matches);

  return (
    <section aria-labelledby="leaderboard-heading" className="space-y-5">
      <div>
        <h1
          id="leaderboard-heading"
          className="font-display text-2xl sm:text-[26px] font-bold text-[#E7E9F5] tracking-tight"
        >
          Leaderboard
        </h1>
        <p className="text-sm text-[#9198B8] mt-1 max-w-[56ch]">
          Standings update automatically as match results are posted. 3 points
          for a win, 1 each for a draw.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor="lbTournamentSelect"
          className="text-xs font-medium text-[#9198B8]"
        >
          Tournament
        </label>
        <select
          id="lbTournamentSelect"
          value={selectedTournamentId}
          onChange={(e) => onSelectTournament(e.target.value)}
          className="bg-[#171B2E] border border-[#2A2F4A] text-[#E7E9F5] rounded-lg px-3 py-2 text-sm min-w-[220px] focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
        >
          {tournaments.length === 0 ? (
            <option value="">No tournaments yet</option>
          ) : (
            tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="py-12 px-5 text-center">
            <h3 className="font-display text-base font-semibold text-[#E7E9F5] mb-1">
              No standings yet
            </h3>
            <p className="text-sm text-[#9198B8]">
              Results will appear here once teams register and matches are
              played.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#2A2F4A] text-[11.5px] font-semibold text-[#9198B8]">
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4 text-right">Played</th>
                  <th className="py-3 px-4 text-right">W</th>
                  <th className="py-3 px-4 text-right">L</th>
                  <th className="py-3 px-4 text-right">D</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F4A]">
                {rows.map((row, idx) => {
                  const rankColor =
                    idx === 0
                      ? 'text-[#F5A623]'
                      : idx === 1
                        ? 'text-[#C7CCE4]'
                        : idx === 2
                          ? 'text-[#C98A4B]'
                          : 'text-[#9198B8]';
                  return (
                    <tr
                      key={row.team.id}
                      className="hover:bg-[#1F2440]/50 transition-colors"
                    >
                      <td
                        className={`py-3 px-4 font-display font-mono tabular-nums text-base ${rankColor}`}
                      >
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-[#E7E9F5]">
                        {row.team.name}
                        <span className="font-mono text-xs font-normal text-[#9198B8] ml-2">
                          {row.team.tag}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono tabular-nums text-right text-[#E7E9F5]">
                        {row.played}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono tabular-nums text-right text-[#E7E9F5]">
                        {row.w}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono tabular-nums text-right text-[#E7E9F5]">
                        {row.l}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono tabular-nums text-right text-[#E7E9F5]">
                        {row.d}
                      </td>
                      <td className="py-3 px-4 text-sm font-display font-mono tabular-nums font-semibold text-right text-[#F5A623]">
                        {row.pts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
