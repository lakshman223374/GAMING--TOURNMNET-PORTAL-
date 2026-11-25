import { timeAgo } from '../data/seed.ts';
import type { ArenaDB, FeedType, PortalTab, UserRole } from '../types.ts';
import { TournamentCard } from './TournamentCard.tsx';

interface DashboardViewProps {
  username: string;
  role: UserRole;
  db: ArenaDB;
  onNavigateTab: (tab: PortalTab) => void;
  onViewMatches: (tournamentId: string) => void;
  onViewStandings: (tournamentId: string) => void;
  onToggleTournamentStatus: (tournamentId: string) => void;
}

const ROLE_BLURBS: Record<UserRole, string> = {
  organizer: 'Create tournaments, manage registrations, and post match results.',
  player: 'Register your team, check your schedule, and track the standings.',
  spectator: 'Follow live standings and results across every tournament.',
};

const FEED_LABELS: Record<FeedType, { label: string; colorClass: string }> = {
  result: { label: 'Result', colorClass: 'text-[#33D6A6]' },
  reg: { label: 'Registration', colorClass: 'text-[#F5A623]' },
  info: { label: 'Update', colorClass: 'text-[#7C5CFF]' },
};

export function DashboardView({
  username,
  role,
  db,
  onNavigateTab,
  onViewMatches,
  onViewStandings,
  onToggleTournamentStatus,
}: DashboardViewProps) {
  const liveTournaments = db.tournaments.filter((t) => t.status === 'live');
  const totalPrize = db.tournaments.reduce(
    (sum, t) => sum + Number(t.prize || 0),
    0
  );

  const stats = [
    { label: 'Tournaments', value: String(db.tournaments.length) },
    { label: 'Live now', value: String(liveTournaments.length) },
    { label: 'Registered teams', value: String(db.teams.length) },
    { label: 'Total prize pool', value: `$${totalPrize.toLocaleString()}` },
  ];

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            id="dashboard-heading"
            className="font-display text-2xl sm:text-[26px] font-bold text-[#E7E9F5] tracking-tight"
          >
            Welcome back, {username}
          </h1>
          <p className="text-sm text-[#9198B8] mt-1 max-w-[56ch]">
            {ROLE_BLURBS[role]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
              At a glance
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 my-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-[#2A2F4A]/70 pt-3">
                <div className="font-display text-2xl font-semibold text-[#E7E9F5] tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-[#9198B8] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
              Latest activity
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('feed')}
              className="px-3 py-1.5 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              View all
            </button>
          </div>

          {db.feed.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#9198B8]">
              Actions you take will show up here.
            </div>
          ) : (
            <div className="divide-y divide-[#2A2F4A]">
              {db.feed.slice(0, 4).map((item) => {
                const meta = FEED_LABELS[item.type];
                return (
                  <div key={item.id} className="py-3 first:pt-1 last:pb-0">
                    <div className="text-[13.5px] text-[#E7E9F5] leading-snug">
                      {item.text}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#9198B8] mt-1">
                      <span className={`font-medium ${meta.colorClass}`}>
                        {meta.label}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {timeAgo(item.ts)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-display text-base font-semibold text-[#E7E9F5]">
            Tournaments in progress
          </h2>
          <button
            type="button"
            onClick={() => onNavigateTab('tournaments')}
            className="px-3 py-1.5 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse all
          </button>
        </div>

        {liveTournaments.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="font-display text-base font-semibold text-[#E7E9F5] mb-1">
              Nothing live right now
            </h3>
            <p className="text-sm text-[#9198B8]">
              Start a tournament to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {liveTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                teamCount={
                  db.teams.filter((tm) => tm.tournamentId === tournament.id)
                    .length
                }
                role={role}
                onViewMatches={onViewMatches}
                onViewStandings={onViewStandings}
                onToggleStatus={onToggleTournamentStatus}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
