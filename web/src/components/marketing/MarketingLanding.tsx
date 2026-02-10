"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import InsightsChart from "@/components/marketing/InsightsChart";
import WorkflowNode from "@/components/marketing/WorkflowNode";

export default function MarketingLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isNavCondensed, setIsNavCondensed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavCondensed(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };
    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const pointerHandlers: Array<{
      node: HTMLElement;
      move: (event: MouseEvent) => void;
      leave: () => void;
    }> = [];

    const context = gsap.context(() => {
      if (bgTextRef.current) {
        gsap.to(bgTextRef.current, {
          x: -200,
          opacity: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 2,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((element, index) => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power4.out",
          delay: (index % 3) * 0.1,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
          },
        });
      });
    }, rootRef);

    rootRef.current
      .querySelectorAll<HTMLElement>(".node-care[data-interactive='true']")
      .forEach((node) => {
        const move = (event: MouseEvent) => {
          const rect = node.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(node, {
            rotateY: x * 8,
            rotateX: -y * 8,
            x: x * 10,
            y: y * 10,
            duration: 0.45,
            ease: "power2.out",
          });
        };

        const leave = () => {
          gsap.to(node, {
            rotateY: 0,
            rotateX: 0,
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)",
          });
        };

        node.addEventListener("mousemove", move);
        node.addEventListener("mouseleave", leave);
        pointerHandlers.push({ node, move, leave });
      });

    return () => {
      pointerHandlers.forEach(({ node, move, leave }) => {
        node.removeEventListener("mousemove", move);
        node.removeEventListener("mouseleave", leave);
      });
      context.revert();
    };
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    const root = document.documentElement;

    root.classList.toggle("dark", nextIsDark);
    root.classList.toggle("light", !nextIsDark);
    window.localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);
  };

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-x-clip" data-testid="marketing-page">
      <div className="canvas-dots" />
      <div ref={bgTextRef} className="bg-text-fixed" aria-hidden>
        WORKFLOW
      </div>

      <nav
        id="main-nav"
        className={`fixed top-0 z-50 flex w-full items-center justify-between px-6 md:px-12 ${
          isNavCondensed
            ? "bg-background/85 py-4 backdrop-blur-md border-b border-border"
            : "bg-transparent py-8"
        }`}
      >
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-foreground" />
            <span className="text-xl font-bold tracking-tight">Lynco.</span>
          </div>
          <div className="hidden gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground md:flex">
            <Link href="#canvas" className="transition-colors hover:text-primary">
              Engine
            </Link>
            <Link href="#insights" className="transition-colors hover:text-primary">
              Insights
            </Link>
            <Link href="#auth" className="transition-colors hover:text-primary">
              Access
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-lg transition-colors hover:bg-secondary"
            aria-label="Toggle theme"
          >
            {isDark ? "Light" : "Dark"}
          </button>
          <Link
            href="#auth"
            className="rounded-full bg-primary px-7 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105"
          >
            Talk to us
          </Link>
        </div>
      </nav>

      <section id="canvas" className="relative flex min-h-screen flex-col items-center px-6 pb-20 pt-44 md:px-12">
        <div className="z-10 mb-24 max-w-4xl text-center md:mb-32">
          <h1
            className="reveal-up mb-10 text-5xl font-bold leading-[0.9] tracking-tighter md:text-8xl"
            data-testid="hero-heading"
          >
            Logic and <span className="text-primary">care,</span> <br />
            unified.
          </h1>
          <p className="reveal-up mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            We design high-fidelity revenue workflows for teams that value precision and clarity in every transaction.
          </p>
        </div>

        <div className="relative w-full max-w-7xl">
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
            aria-hidden
          >
            <path className="connection-path" d="M 250 250 Q 410 120 570 250" />
            <path className="connection-path" d="M 790 250 Q 950 380 1110 250" />
            <circle r="3.5" className="pulse-particle">
              <animateMotion dur="4s" repeatCount="indefinite" path="M 250 250 Q 410 120 570 250" />
            </circle>
            <circle r="3.5" className="pulse-particle">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                begin="2s"
                path="M 790 250 Q 950 380 1110 250"
              />
            </circle>
          </svg>

          <div id="canvas-stage" className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <WorkflowNode
              index="01"
              title="Lead Source"
              description="Multi-channel leads normalized into a single, clean data stream."
              accentClass="text-primary"
              iconClass="bg-primary"
              footer={
                <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-3/4 bg-primary" />
                </div>
              }
            />
            <WorkflowNode
              index="02"
              title="Flow Logic"
              description="Dynamic approval routing based on custom business heuristics."
              accentClass="text-indigo-500"
              iconClass="bg-indigo-500"
              footer={
                <div className="rounded-xl bg-secondary p-4 font-mono text-[11px] leading-loose text-muted-foreground">
                  {"{"}
                  <br />
                  &nbsp;&nbsp;margin: &quot;min 25%&quot;,
                  <br />
                  &nbsp;&nbsp;auto_approve: true
                  <br />
                  {"}"}
                </div>
              }
            />
            <WorkflowNode
              index="03"
              title="Settlement"
              description="Automated reconciliation with immutable audit trails."
              accentClass="text-emerald-500"
              iconClass="bg-emerald-500"
              badge="Verified"
              footer={<div className="text-2xl font-bold tracking-tighter">$128,400.00</div>}
            />
          </div>
        </div>
      </section>

      <section id="insights" className="bg-card/70 px-6 py-32 transition-colors md:px-12 md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-24 grid items-center gap-16 lg:mb-40 lg:grid-cols-2 lg:gap-32">
            <div className="reveal-up">
              <span className="mb-8 block text-xs font-bold uppercase tracking-[0.35em] text-primary">
                The Studio Insight
              </span>
              <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                Clarity is <br />
                the ultimate feature.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Every workflow state is readable and measurable. Operators can focus on decisions while the system
                handles repetitive handoffs.
              </p>
            </div>
            <div className="reveal-up grid grid-cols-2 gap-8">
              <div className="border-l-2 border-border py-4 pl-6 md:pl-8">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Revenue Speed
                </div>
                <div className="text-3xl font-bold tracking-tighter md:text-4xl">+24.5%</div>
              </div>
              <div className="border-l-2 border-border py-4 pl-6 md:pl-8">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Efficiency
                </div>
                <div className="text-3xl font-bold tracking-tighter md:text-4xl">99.8%</div>
              </div>
            </div>
          </div>

          <div className="reveal-up relative h-[460px] overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl md:h-[500px] md:p-12">
            <div className="relative z-10 mb-8 flex items-start justify-between">
              <div>
                <h3 className="mb-1 text-2xl font-bold">Cashflow Monitor</h3>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Real-time Data Stream</p>
              </div>
            </div>
            <InsightsChart isDark={isDark} />
          </div>
        </div>
      </section>

      <section id="auth" className="relative border-t border-border px-6 py-36 md:px-12 md:py-56">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-40">
          <div className="reveal-up">
            <h2 className="mb-10 text-6xl font-bold tracking-tighter md:text-7xl">
              Start the <br />
              <span className="text-primary">Flow.</span>
            </h2>
            <p className="mb-12 text-xl text-muted-foreground">
              Start your journey with Lynco.
              <br />
              Experience revenue infrastructure as it should be.
            </p>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-sm font-bold opacity-30">
                G
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-sm font-bold opacity-30">
                Gh
              </div>
            </div>
          </div>
          <div className="reveal-up">
            <LeadCaptureForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/80 px-6 py-16 transition-colors md:px-12 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-current" />
            <span className="text-lg font-bold tracking-tight">Lynco Studio</span>
          </div>
          <div className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
            2026 Crafted with Care by Lynco Studio
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-primary">
              LinkedIn
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

