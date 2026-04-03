import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/redux/userSlice';
import { Logout } from '@/service/auth';

/* ── Minimal scoped styles ── */
const STYLES = `
  @keyframes fadeSlideDown {
    from { opacity:0; transform: translateY(-6px) scale(0.97); }
    to   { opacity:1; transform: translateY(0)    scale(1); }
  }
  @keyframes gradientShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  .cn-avatar-ring {
    background: linear-gradient(135deg, #6366f1, #22d3ee, #a855f7);
    background-size: 200% 200%;
    animation: gradientShift 4s ease infinite;
  }
  .cn-dropdown {
    animation: fadeSlideDown 0.2s cubic-bezier(.22,1,.36,1) both;
  }
  .cn-logout-btn {
    transition: background .2s, color .2s, transform .15s;
  }
  .cn-logout-btn:hover {
    background: rgba(239,68,68,0.12);
    color: #f87171;
    transform: translateX(2px);
  }
`;

export default function Header() {
  const userData = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(()=>{
     if(!userData){
      router.push('/')
     }
  },[router,userData]);
  /* Derive initials and display name */
  const displayName = userData?.name ?? userData?.email ?? 'User';
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async() => {
    dispatch(logout()) 
    await Logout();
    router.push('/')
    setOpen(false);
  };

  return (
    <>
      <style>{STYLES}</style>

      <header className="h-[48px] bg-card border-b border-border flex items-center px-6 shrink-0 z-[100] shadow-sm">

        {/* ── Left: logo ── */}
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
            <span className="text-[10px] font-black text-primary-foreground italic">CN</span>
          </div>
          <h1 className="text-sm font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CodeNavigator
          </h1>
          <div className="ml-4 px-2 py-0.5 rounded bg-secondary/50 border border-border/50 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            IDE v2.5
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Right: user pill ── */}
        {userData && (
          <div className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-secondary/50 group"
            >
              {/* Avatar */}
              <div className="cn-avatar-ring p-[2px] rounded-full">
                <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center">
                  <span className="text-[10px] font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {initials}
                  </span>
                </div>
              </div>

              {/* Name */}
              <span className="text-xs font-semibold text-foreground max-w-[120px] truncate hidden sm:block">
                {displayName}
              </span>

              {/* Chevron */}
              <ChevronDown
                size={12}
                className="text-muted-foreground transition-transform duration-200"
                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* ── Dropdown ── */}
            {open && (
              <div
                className="cn-dropdown absolute right-0 top-[calc(100%+6px)] w-52 rounded-xl border shadow-xl shadow-black/30 overflow-hidden z-50"
                style={{ background: 'hsl(var(--card))', borderColor: 'rgba(99,102,241,.25)' }}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(99,102,241,.15)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="cn-avatar-ring p-[2px] rounded-full shrink-0">
                      <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                        <span className="text-xs font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                          {initials}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                      {userData?.email && (
                        <p className="text-[10px] text-muted-foreground truncate">{userData.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="cn-logout-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground"
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>

                {/* Bottom glow accent */}
                <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,.35),transparent)' }} />
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}