import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { ActionResult, Match, Team, Tournament, UserRole } from '../types.ts';

interface MatchesViewProps {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  selectedTournamentId: string;
  onSelectTournament: (id: string) => void;
  role: UserRole;
  onScheduleMatch: (input: {
    tournamentId: string;
    teamA: string;
    teamB: string;
    round: string;
    time: string;
  }) => ActionResult;
  onUpdateScore: (matchId: string, side: 'A' | 'B', score: number) => void;
  onFinalizeMatch: (matchId: string) => void;
  onReopenMatch: (matchId: string) => void;
}

export function MatchesView({
  tournaments,
  teams,
  matches,
  selectedTournamentId,
  onSelectTournament,
  role,
  onScheduleMatch,
  onUpdateScore,
  onFinalizeMatch,
  onReopenMatch,
}: MatchesViewProps) {
  const scopedTeams = useMemo(
    () => teams.filter((t) => t.tournamentId === selectedTournamentId),
    [teams, selectedTournamentId]
  );

  const scopedMatches = useMemo(
    () =>
      matches
        .filter((m) => m.tournamentId === selectedTournamentId)
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        ),
    [matches, selectedTournamentId]
  );

  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [round, setRound] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setTeamA(scopedTeams[0]?.id ?? '');
    setTeamB(scopedTeams[1]?.id ?? scopedTeams[0]?.id ?? '');
  }, [selectedTournamentId, scopedTeams]);

  const handleSchedule = (event: FormEvent) => {
    event.preventDefault();
    const res = onScheduleMatch({
      tournamentId: selectedTournamentId,
      teamA,
      teamB,
      round,
      time,
    });
    if (!res.ok) {
      setError(res.error ?? 'Could not schedule match.');
      return;
    }
    setError('');
    setRound('');
    setTime('');
  };

  const selectedTournament = tournaments.find(
    (t) => t.id === selectedTournamentId
  );

  return (
    <section aria-labelledby="matches-heading" className="space-y-5">
      <div>
        <h1
          id="matches-heading"
          className="font-display text-2xl sm:text-[26px] font-bold text-[#E7E9F5] tracking-tight"
        >
          Matches
        </h1>
        <p className="text-sm text-[#9198B8] mt-1 max-w-[56ch]">
          Schedule matches between registered teams and post results as they
          happen.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor="matchTournamentSelect"
          className="text-xs font-medium text-[#9198B8]"
        >
          Tournament
        </label>
        <select
          id="matchTournamentSelect"
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

      {role === 'organizer' && (
        <form
          onSubmit={handleSchedule}
          noValidate
          className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 space-y-4"
        >
          <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
            Schedule a match
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="matchTeamA"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Team A
              </label>
              <select
                id="matchTeamA"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              >
                {scopedTeams.length === 0 ? (
                  <option value="">No teams yet</option>
                ) : (
                  scopedTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="matchTeamB"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Team B
              </label>
              <select
                id="matchTeamB"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              >
                {scopedTeams.length === 0 ? (
                  <option value="">No teams yet</option>
                ) : (
                  scopedTeams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="matchRound"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Round
              </label>
              <input
                id="matchRound"
                type="text"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                placeholder="Round 1"
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
              />
            </div>
            <div>
              <label
                htmlFor="matchTime"
                className="block text-xs text-[#9198B8] mb-1"
              >
                Scheduled time
              </label>
              <input
                id="matchTime"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
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

          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold bg-[#7C5CFF] hover:bg-[#5B44BE] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Schedule match
          </button>
        </form>
      )}

      {scopedMatches.length === 0 ? (
        <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl py-12 px-5 text-center">
          <h3 className="font-display text-base font-semibold text-[#E7E9F5] mb-1">
            No matches scheduled
          </h3>
          <p className="text-sm text-[#9198B8]">
            {role === 'organizer'
              ? 'Schedule a match above.'
              : 'Check back once the organizer sets the bracket.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scopedMatches.map((m) => {
            const sideA = teams.find((t) => t.id === m.teamA);
            const sideB = teams.find((t) => t.id === m.teamB);
            if (!sideA || !sideB) return null;
            const isFinal = m.status === 'final';
            const canEdit = role === 'organizer';

            return (
              <article
                key={m.id}
                className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-4 space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-[#E7E9F5]">
                    <span>{sideA.name}</span>
                    <span className="font-mono text-xs font-normal text-[#9198B8]">
                      {sideA.tag}
                    </span>
                  </div>

                  {canEdit ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        aria-label={`${sideA.name} score`}
                        value={m.scoreA}
                        onChange={(e) =>
                          onUpdateScore(m.id, 'A', Number(e.target.value))
                        }
                        className="w-12 text-center font-mono tabular-nums text-base bg-[#1F2440] border border-[#2A2F4A] text-[#E7E9F5] rounded-md py-1 focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
                      />
                      <span className="text-[#9198B8]">–</span>
                      <input
                        type="number"
                        min={0}
                        aria-label={`${sideB.name} score`}
                        value={m.scoreB}
                        onChange={(e) =>
                          onUpdateScore(m.id, 'B', Number(e.target.value))
                        }
                        className="w-12 text-center font-mono tabular-nums text-base bg-[#1F2440] border border-[#2A2F4A] text-[#E7E9F5] rounded-md py-1 focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
                      />
                    </div>
                  ) : (
                    <div className="font-display font-mono tabular-nums text-xl font-semibold text-[#E7E9F5] md:text-center min-w-[72px]">
                      {m.scoreA} – {m.scoreB}
                    </div>
                  )}

                  <div className="flex items-center gap-2 md:justify-end text-[15px] font-semibold text-[#E7E9F5]">
                    <span className="font-mono text-xs font-normal text-[#9198B8]">
                      {sideB.tag}
                    </span>
                    <span>{sideB.name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2A2F4A]/70 text-xs text-[#9198B8]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>{m.round}</span>
                    {selectedTournament && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{selectedTournament.name}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(m.time).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-medium ${
                        isFinal ? 'text-[#9198B8]' : 'text-[#33D6A6]'
                      }`}
                    >
                      {isFinal ? 'Final' : 'Scheduled'}
                    </span>

                    {canEdit && !isFinal && (
                      <button
                        type="button"
                        onClick={() => onFinalizeMatch(m.id)}
                        className="px-3 py-1 text-xs font-semibold bg-[#33D6A6] text-[#08281F] rounded-md hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Post result
                      </button>
                    )}

                    {canEdit && isFinal && (
                      <button
                        type="button"
                        onClick={() => onReopenMatch(m.id)}
                        className="px-3 py-1 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-md hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
