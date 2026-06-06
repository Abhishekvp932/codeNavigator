"use client";

import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, LogOut, PanelLeft, Route, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/userSlice";
import { Logout } from "@/service/auth";

export default function Header() {
  const userData = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userData) router.push("/");
  }, [router, userData]);

  const displayName = userData?.name ?? userData?.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    dispatch(logout());
    await Logout();
    router.push("/");
    setOpen(false);
  };

  return (
    <header className="h-12 shrink-0 border-b border-border bg-background/95 px-3 sm:px-4 flex items-center gap-3 z-50">
      <div className="flex items-center gap-2 min-w-0">
        <div className="size-7 rounded-md bg-primary text-primary-foreground grid place-items-center text-[11px] font-black">
          CN
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold leading-none text-foreground truncate">
            Code Navigator
          </h1>
          <p className="hidden sm:block text-[10px] text-muted-foreground leading-4">
            Execution workspace
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 rounded-md border border-border bg-card p-1">
        <span className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium text-muted-foreground">
          <PanelLeft size={12} /> Editor
        </span>
        <span className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium text-muted-foreground">
          <Route size={12} /> Flow
        </span>
        <span className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium text-muted-foreground">
          <Terminal size={12} /> Output
        </span>
      </div>

      <div className="flex-1" />

      {userData && (
        <div className="relative">
          <button
            onClick={() => setOpen((value) => !value)}
            onBlur={() => setTimeout(() => setOpen(false), 140)}
            className="h-8 flex items-center gap-2 rounded-md border border-border bg-card px-2 hover:bg-secondary transition-colors"
          >
            <span className="size-5 rounded bg-secondary text-[10px] font-bold text-foreground grid place-items-center">
              {initials}
            </span>
            <span className="hidden sm:block max-w-[140px] truncate text-xs font-medium text-foreground">
              {displayName}
            </span>
            <ChevronDown
              size={13}
              className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-56 overflow-hidden rounded-lg border border-border bg-popover shadow-xl">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-xs font-semibold text-foreground">{displayName}</p>
                {userData.email && (
                  <p className="truncate text-[11px] text-muted-foreground">{userData.email}</p>
                )}
              </div>
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
