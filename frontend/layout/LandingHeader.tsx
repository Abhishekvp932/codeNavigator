"use client";

import { Button } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (user) router.push("/user/home");
  }, [router, user]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-black text-primary-foreground">
              CN
            </span>
            <span className="text-sm font-semibold text-foreground">Code Navigator</span>
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Features
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button onClick={() => router.push("/user/login")} variant="ghost">
              Log in
            </Button>
            <Button onClick={() => router.push("/user/signup")}>Sign up</Button>
          </div>

          <button
            className="grid size-8 place-items-center rounded-md border border-border md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-2 border-t border-border py-3 md:hidden">
            <Button onClick={() => router.push("/user/login")} variant="outline" className="w-full">
              Log in
            </Button>
            <Button onClick={() => router.push("/user/signup")} className="w-full">
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
