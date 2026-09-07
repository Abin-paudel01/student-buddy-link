import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, CalendarClock, GraduationCap, LayoutDashboard, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/app-store";
import { CURRENT_CLASS, CURRENT_STUDENT, ROLE_LABELS, type Role } from "@/lib/college-data";
import { cn } from "@/lib/utils";

type NavItem = { to: "/" | "/library" | "/teacher-requests"; label: string; icon: typeof BookOpen };

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/teacher-requests", label: "Teacher Requests", icon: CalendarClock },
];

const ROLE_NAV: Record<Role, string[]> = {
  student: ["/", "/library", "/teacher-requests"],
  teacher: ["/", "/teacher-requests"],
  librarian: ["/", "/library"],
  admin: ["/", "/library", "/teacher-requests"],
};

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { role } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV.filter((item) => ROLE_NAV[role].includes(item.to));

  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <div className="flex items-center gap-3 px-1 pt-2">
        <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        <div>
          <p className="font-display text-base leading-tight font-semibold text-sidebar-accent-foreground">
            Campus Desk
          </p>
          <p className="text-xs text-sidebar-foreground/70">College Support Portal</p>
        </div>
      </div>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-accent-foreground/80">
        Prototype only — all data is mock data stored in the browser session.
      </div>
    </div>
  );
}

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { role, setRole, activeTeacherId, setActiveTeacherId, teachers } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-none p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="mr-auto min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {role === "student" ? CURRENT_STUDENT : ROLE_LABELS[role]}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {role === "student"
                ? CURRENT_CLASS
                : role === "teacher"
                  ? teachers.find((t) => t.teacher_id === activeTeacherId)?.subject
                  : "Staff view"}
            </p>
          </div>

          {role === "teacher" && (
            <Select value={activeTeacherId} onValueChange={setActiveTeacherId}>
              <SelectTrigger className="w-[190px]" aria-label="Select teacher profile">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.teacher_id} value={t.teacher_id}>
                    {t.teacher_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-[150px]" aria-label="Select role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
