import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  GraduationCap,
  IdCard,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  COLLEGE_LOCATION,
  COLLEGE_NAME,
  COLLEGE_SHORT,
  PROGRAM,
} from "@/lib/college-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MMC Hetauda — BICTE Student Support Portal" },
      {
        name: "description",
        content:
          "Makwanpur Multiple Campus, Hetauda: BICTE student support portal for library books, teacher free-period requests and digital identity cards.",
      },
      { property: "og:title", content: "MMC Hetauda — BICTE Student Support Portal" },
      {
        property: "og:description",
        content: "Making everyday college services simpler for BICTE students at MMC Hetauda.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: BookOpen,
    title: "Library Services",
    text: "Search the BICTE book catalogue, check availability and request the books you need.",
  },
  {
    icon: CalendarClock,
    title: "Teacher Free Periods",
    text: "See which teachers are free and request a class during their free period.",
  },
  {
    icon: IdCard,
    title: "Digital Identity Card",
    text: "View your college ID details and track whether your card is ready to collect.",
  },
];

const STATS = [
  { value: "1,200+", label: "Library books" },
  { value: "45+", label: "Faculty members" },
  { value: "8", label: "BICTE semesters" },
  { value: "100%", label: "Paperless requests" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display truncate text-base font-bold">{COLLEGE_SHORT}</p>
              <p className="truncate text-xs text-muted-foreground">
                {PROGRAM} Student Support Portal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/dashboard">Explore</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-primary to-accent text-primary-foreground">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:26px_26px]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="size-3.5" /> {COLLEGE_LOCATION}
              </span>
              <h1 className="font-display mt-5 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                MMC Hetauda
              </h1>
              <p className="mt-3 text-xl font-semibold text-white/90 sm:text-2xl">
                {PROGRAM} Student Support Portal
              </p>
              <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
                Making everyday college services simpler for BICTE students — library books,
                teacher free-period requests and identity cards, all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/login">
                    Login <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link to="/dashboard">Explore Portal</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-white/10 p-4 transition-colors hover:bg-white/20"
                  >
                    <Icon className="size-6" />
                    <p className="mt-3 font-semibold">{title}</p>
                    <p className="mt-1 text-xs text-white/75">{text}</p>
                  </div>
                ))}
                <div className="rounded-2xl bg-white/10 p-4">
                  <ShieldCheck className="size-6" />
                  <p className="mt-3 font-semibold">Role-based Access</p>
                  <p className="mt-1 text-xs text-white/75">
                    Separate views for students, teachers, library staff and admins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <Card key={s.label} className="border-border/70 shadow-sm">
                <CardContent className="py-6 text-center">
                  <p className="font-display text-3xl font-bold text-primary">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 rounded-3xl bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">About {COLLEGE_SHORT}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {COLLEGE_NAME} is a community campus in Hetauda serving students from across
                Makwanpur district. The campus offers bachelor level programs with a strong focus
                on information technology and education, and the Bachelor in Information
                Communication Technology Education ({PROGRAM}) program prepares future ICT
                teachers with a blend of computing and teaching practice.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                This portal is a student support prototype that brings the campus library, teacher
                availability and identity card services together in a single, simple interface.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                  <MapPin className="size-4" /> {COLLEGE_LOCATION}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 font-medium text-secondary-foreground">
                  <Users className="size-4" /> Program: {PROGRAM}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="border-border/70 shadow-sm">
                  <CardContent className="py-6">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-4 font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-border/70 bg-gradient-to-br from-primary to-sidebar text-primary-foreground shadow-sm">
                <CardContent className="py-6">
                  <p className="font-semibold">Ready to start?</p>
                  <p className="mt-1 text-sm text-white/80">
                    Sign in with a demo account to explore every role.
                  </p>
                  <Button asChild className="mt-4 bg-white text-primary hover:bg-white/90">
                    <Link to="/login">Go to Login</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          {COLLEGE_NAME} ({COLLEGE_SHORT}) • {COLLEGE_LOCATION} • {PROGRAM} Student Support Portal
          prototype
        </div>
      </footer>
    </div>
  );
}
