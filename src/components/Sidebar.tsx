import {
  Activity,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';
import type { PortalTab, UserRole } from '../types.ts';

interface SidebarProps {
  username: string;
  role: UserRole;
  activeTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  onChangeRole: (role: UserRole) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: PortalTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'matches', label: 'Matches', icon: Swords },
  { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { id: 'feed', label: 'Live feed', icon: Activity },
];

export function Sidebar({
  username,
  role,
  activeTab,
  onSelectTab,
  onChangeRole,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="bg-[#131729] border-b lg:border-b-0 lg:border-r border-[#2A2F4A] px-4 py-4 lg:py-6 flex flex-col gap-5 lg:w-[248px] lg:shrink-0">
      <div className="flex items-center justify-between lg:justify-start gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm text-[#0F1220] shrink-0"
            style={{
              background:
                'conic-gradient(from 220deg, #7C5CFF, #F5A623, #7C5CFF)',
            }}
          >
            A
          </div>
          <div>
            <div className="font-display text-lg font-bold tracking-tight text-[#E7E9F5] leading-tight">
              Arena
            </div>
            <div className="text-[11px] text-[#9198B8]">Tournament portal</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          Logout
        </button>
      </div>

      <nav
        aria-label="Portal sections"
        className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2 ${
                isActive
                  ? 'bg-[#1F2440] text-[#E7E9F5] font-medium'
                  : 'text-[#9198B8] hover:bg-[#171B2E] hover:text-[#E7E9F5]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#7C5CFF]' : 'text-[#9198B8]'
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="lg:mt-auto flex flex-col sm:flex-row lg:flex-col gap-3 pt-2 lg:pt-4 border-t border-[#2A2F4A]/70">
        <div className="text-xs text-[#9198B8] px-1 truncate">
          Signed in as <span className="font-semibold text-[#E7E9F5]">{username}</span>
        </div>

        <div className="bg-[#171B2E] border border-[#2A2F4A] rounded-lg p-3 flex-1 lg:flex-initial">
          <label
            htmlFor="roleSelect"
            className="block text-[11px] text-[#9198B8] mb-1.5"
          >
            Viewing as
          </label>
          <select
            id="roleSelect"
            value={role}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-md px-2.5 py-2 text-[13px] focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
          >
            <option value="organizer">Organizer</option>
            <option value="player">Player</option>
            <option value="spectator">Spectator</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="hidden lg:inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#E7E9F5] border border-[#2A2F4A] rounded-lg hover:border-[#7C5CFF] hover:text-[#7C5CFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}
