import { useState, type FormEvent } from 'react';
import type { ActionResult, UserRole } from '../types.ts';

interface LoginViewProps {
  onLogin: (username: string, password: string, role: UserRole) => ActionResult;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('organizer');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = onLogin(username, password, role);
    if (!result.ok && result.error) {
      setError(result.error);
      return;
    }
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#0F1220] flex items-center justify-center p-5">
      <div className="w-full max-w-[390px] bg-[#171B2E] border border-[#2A2F4A] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            aria-hidden="true"
            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-[15px] text-[#0F1220] shrink-0"
            style={{
              background:
                'conic-gradient(from 220deg, #7C5CFF, #F5A623, #7C5CFF)',
            }}
          >
            A
          </div>
          <div>
            <div className="font-display text-xl font-bold tracking-tight text-[#E7E9F5]">
              Arena
            </div>
            <div className="text-xs text-[#9198B8]">Tournament portal</div>
          </div>
        </div>

        <p className="text-sm text-[#9198B8] mt-4 mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="loginUser"
              className="block text-xs text-[#9198B8] mb-1.5"
            >
              Username
            </label>
            <input
              id="loginUser"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2.5 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
            />
          </div>

          <div>
            <label
              htmlFor="loginPass"
              className="block text-xs text-[#9198B8] mb-1.5"
            >
              Password
            </label>
            <input
              id="loginPass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2.5 text-sm bg-[#1F2440] text-[#E7E9F5] placeholder-[#6B7194] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
            />
          </div>

          <div>
            <label
              htmlFor="loginRole"
              className="block text-xs text-[#9198B8] mb-1.5"
            >
              Login as
            </label>
            <select
              id="loginRole"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 text-sm bg-[#1F2440] text-[#E7E9F5] border border-[#2A2F4A] rounded-lg focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
            >
              <option value="organizer">Organizer</option>
              <option value="player">Player</option>
              <option value="spectator">Spectator</option>
            </select>
          </div>

          {error ? (
            <div
              role="alert"
              className="text-[13px] text-[#FF5D7A] bg-[#FF5D7A]/10 border border-[#FF5D7A]/30 rounded-lg px-3 py-2"
            >
              {error}
            </div>
          ) : (
            <div className="h-[18px]" aria-hidden="true" />
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#7C5CFF] hover:bg-[#5B44BE] text-white font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7C5CFF] focus-visible:outline-offset-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-[#9198B8] mt-5">
          Demo project — any username and a password of 4+ characters will work
        </p>
      </div>
    </div>
  );
}
