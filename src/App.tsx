import { DashboardView } from './components/DashboardView.tsx';
import { FeedView } from './components/FeedView.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { LoginView } from './components/LoginView.tsx';
import { MatchesView } from './components/MatchesView.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { TeamsView } from './components/TeamsView.tsx';
import { TournamentsView } from './components/TournamentsView.tsx';
import { useArenaPortal } from './hooks/useArenaPortal.ts';

export default function App() {
  const {
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
  } = useArenaPortal();

  if (!session) {
    return <LoginView onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-[#0F1220] text-[#E7E9F5] flex flex-col lg:flex-row">
      <Sidebar
        username={session.user}
        role={session.role}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onChangeRole={setRole}
        onLogout={logout}
      />

      <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8 max-w-[1180px]">
        {activeTab === 'dashboard' && (
          <DashboardView
            username={session.user}
            role={session.role}
            db={db}
            onNavigateTab={setActiveTab}
            onViewMatches={navigateToMatches}
            onViewStandings={navigateToLeaderboard}
            onToggleTournamentStatus={toggleTournamentStatus}
          />
        )}

        {activeTab === 'tournaments' && (
          <TournamentsView
            tournaments={db.tournaments}
            teams={db.teams}
            role={session.role}
            onCreateTournament={createTournament}
            onViewMatches={navigateToMatches}
            onViewStandings={navigateToLeaderboard}
            onToggleStatus={toggleTournamentStatus}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsView
            tournaments={db.tournaments}
            teams={db.teams}
            onRegisterTeam={registerTeam}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            tournaments={db.tournaments}
            teams={db.teams}
            matches={db.matches}
            selectedTournamentId={matchTournamentId}
            onSelectTournament={setMatchTournamentId}
            role={session.role}
            onScheduleMatch={scheduleMatch}
            onUpdateScore={updateMatchScore}
            onFinalizeMatch={finalizeMatch}
            onReopenMatch={reopenMatch}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            tournaments={db.tournaments}
            teams={db.teams}
            matches={db.matches}
            selectedTournamentId={leaderboardTournamentId}
            onSelectTournament={setLeaderboardTournamentId}
          />
        )}

        {activeTab === 'feed' && <FeedView feed={db.feed} />}
      </main>
    </div>
  );
}
