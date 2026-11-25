import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import type { ActionResult, Team, Tournament } from '../types.ts';

interface TeamsViewProps {
  tournaments: Tournament[];
  teams: Team[];
  onRegisterTeam: (input: {
    name: string;
    tag: string;
    tournamentId: string;
    players: string[];
  }) => ActionResult;
}

export function TeamsView({
  tournaments,
  teams,
  onRegisterTeam,
}: TeamsViewProps) {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [tournamentId, setTournamentId] = useState(tournaments[0]?.id ?? '');
  const [playerInput, setPlayerInput] = useState('');
  const [draftPlayers, setDraftPlayers] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tournaments.some((t) => t.id === tournamentId)) {
      setTournamentId(tournaments[0]?.id ?? '');
    }
  }, [tournaments, tournamentId]);

  const addPlayer = () => {
    const trimmed = playerInput.trim();
    if (!trimmed) return;
    setDraftPlayers((prev) => [...prev, trimmed]);
    setPlayerInput('');
  };

  const handlePlayerKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addPlayer();
    }
  };

  const removeDraftPlayer = (index: number) => {
    setDraftPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const res = onRegisterTeam({
      name,
      tag,
      tournamentId,
      players: draftPlayers,
    });
    if (!res.ok) {
      setError(res.error ?? 'Could not register team.');
      return;
    }
    setError('');
    setName('');
    setTag('');
    setDraftPlayers([]);
  };

  return (
    <section aria-labelledby="teams-heading" className="space-y-6">
      <div>
        <h1
          id="teams-heading"
          className="font-display text-2xl sm:text-[26px] font-bold text-[#E7E9F5] tracking-tight"
        >
          Teams
        </h1>
        <p className="text-sm text-[#9198B8] mt-1 max-w-[56ch]">
          Create a team and register it for a tournament, or review current
          rosters.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 space-y-4"
      >
        <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
          Register a team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="teamName"
              className="block text-xs text-[#9198B8] mb-1"
            >
              Team name
            </label>
            <input
              id="teamName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nova Wolves"
              className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
            />
          </div>
          <div>
            <label
              htmlFor="teamTag"
              className="block text-xs text-[#9198B8] mb-1"
            >
              Tag
            </label>
            <input
              id="teamTag"
              type="text"
              maxLength={6}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="NVW"
              className="w-full px-3 py-2 text-sm font-mono uppercase bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="teamTournament"
            className="block text-xs text-[#9198B8] mb-1"
          >
            Tournament
          </label>
          <select
            id="teamTournament"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
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

        <div>
          <label
            htmlFor="playerNameInput"
            className="block text-xs text-[#9198B8] mb-1"
          >
            Players
          </label>
          <div className="flex gap-2">
            <input
              id="playerNameInput"
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyDown={handlePlayerKeyDown}
              placeholder="Add a player and press Enter"
              className="flex-1 px-3 py-2 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF]"
            />
            <button
              type="button"
              onClick={addPlayer}
              className="px-3.5 py-2 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Add
            </button>
          </div>

          {draftPlayers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {draftPlayers.map((player, idx) => (
                <button
                  key={`${player}-${idx}`}
                  type="button"
                  onClick={() => removeDraftPlayer(idx)}
                  aria-label={`Remove ${player}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-md hover:border-[#FF5D7A] hover:text-[#FF5D7A] transition-colors cursor-pointer"
                >
                  <span>{player}</span>
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
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
          className="px-4 py-2 text-sm font-semibold bg-[#7C5CFF] hover:bg-[#5B44BE] text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
        >
          Register team
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
          All teams
        </h2>

        {teams.length === 0 ? (
          <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl py-12 px-5 text-center">
            <h3 className="font-display text-base font-semibold text-[#E7E9F5] mb-1">
              No teams registered yet
            </h3>
            <p className="text-sm text-[#9198B8]">
              Register a team above to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {teams.map((team) => {
              const tournament = tournaments.find(
                (t) => t.id === team.tournamentId
              );
              return (
                <article
                  key={team.id}
                  className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 flex flex-col gap-2.5"
                >
                  <div className="text-xs font-semibold text-[#F5A623]">
                    {tournament ? tournament.name : 'Unassigned'}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#E7E9F5]">
                    {team.name}{' '}
                    <span className="font-mono text-xs font-normal text-[#9198B8] ml-1">
                      {team.tag}
                    </span>
                  </h3>
                  <div className="text-xs text-[#9198B8] tabular-nums">
                    {team.players.length} player
                    {team.players.length === 1 ? '' : 's'}
                  </div>
                  <div className="text-[13px] text-[#E7E9F5]/90 pt-1 border-t border-[#2A2F4A]/70">
                    {team.players.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {team.players.map((p, idx) => (
                          <span key={`${team.id}-${p}-${idx}`} className="inline-flex items-center gap-2">
                            <span>{p}</span>
                            {idx < team.players.length - 1 && (
                              <span className="text-[#9198B8]" aria-hidden="true">
                                ·
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-[#9198B8]">
                        No players added yet
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
