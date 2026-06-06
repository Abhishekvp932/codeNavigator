"use client";

import { Button } from "@/components/ui/button";
import LandingHeader from "@/layout/LandingHeader";
import { ArrowRight, Braces, GitBranch, Layers3, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Braces,
    title: "Readable execution state",
    description: "Track variables, stack frames, heap references, and console output without jumping between tools.",
  },
  {
    icon: GitBranch,
    title: "Flow-first debugging",
    description: "Generate a control-flow map from pasted JavaScript and step through the active path.",
  },
  {
    icon: Layers3,
    title: "Dense workspace layout",
    description: "Resizable panels keep the editor, graph, and output visible when snippets become real programs.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingHeader />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
              Code visualization workspace
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              Understand code by watching its state change.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Code Navigator combines a source editor, control-flow map, stack viewer,
              heap explorer, and output console into one focused debugging surface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => router.push("/user/signup")} className="gap-2">
                Start visualizing <ArrowRight size={16} />
              </Button>
              <Button onClick={() => router.push("/user/login")} variant="outline">
                Sign in
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Execution workspace</p>
                <p className="text-[11px] text-muted-foreground">Resizable panels, live state, flow map</p>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded bg-primary/10 px-2 py-1 text-[11px] text-primary">
                <PlayCircle size={12} /> Ready
              </div>
            </div>
            <div className="grid h-[430px] grid-cols-[0.95fr_1.05fr] gap-3">
              <div className="flex flex-col overflow-hidden rounded-md border border-border bg-[#0b1017]">
                <div className="cn-panel-header">Source editor</div>
                <pre className="flex-1 overflow-hidden p-4 font-mono text-[12px] leading-6 text-muted-foreground">
{`function sumTree(node) {
  if (!node) return 0;

  const left = sumTree(node.left);
  const right = sumTree(node.right);

  return node.value + left + right;
}

console.log(sumTree(root));`}
                </pre>
              </div>
              <div className="grid grid-rows-[1.35fr_0.65fr] gap-3">
                <div className="overflow-hidden rounded-md border border-border bg-background">
                  <div className="cn-panel-header">Control flow map</div>
                  <div className="grid h-full place-items-center p-6">
                    <div className="grid gap-3 text-center text-xs text-muted-foreground">
                      {["start", "if condition", "recursive calls", "return value"].map((label) => (
                        <div key={label} className="rounded-md border border-border bg-card px-5 py-2">
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-md border border-border bg-[#0b1017]">
                  <div className="cn-panel-header">Console</div>
                  <div className="space-y-2 p-3 font-mono text-[12px] text-muted-foreground">
                    <p>1  Visiting root</p>
                    <p>2  Stack frame: sumTree()</p>
                    <p className="text-accent">3  Returned: 42</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg border border-border bg-card p-5">
                <Icon size={18} className="mb-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
