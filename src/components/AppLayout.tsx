import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  IdCard,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/app-store";
import { COLLEGE_SHORT, PROGRAM, ROLE_LABELS, type Role } from "@/lib/college-data";
import { cn } from "@/lib/utils";

type NavPath = "/dashboard" | "/library" | "/teacher-requests" | "/identity-card";
type NavItem = { to: NavPath; label: string; icon: typeof BookOpen };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/teacher-requests", label: "Teacher Requests", icon: CalendarClock },
  { to: "/identity-card", label: "Identity Card", icon: IdCard },
];

const ROLE_NAV: Record<Role, NavPath[]> = {
  student: ["/dashboard", "/library", "/teacher-requests", "/identity-card"],
  teacher: ["/dashboard", "/teacher-requests"],
  librarian: ["/dashboard", "/library"],
  admin: ["/dashboard", "/library", "/teacher-requests", "/identity-card"],
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
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-r from-sidebar-primary to-accent text-sidebar-primary-foreground shadow-lg shadow-black/20"
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
  const { user, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <Link to="/" className="flex items-center gap-3 px-1 pt-2" onClick={onNavigate}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-accent text-sidebar-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-display truncate text-base leading-tight font-bold text-sidebar-accent-foreground">
            {COLLEGE_SHORT}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/70">{PROGRAM} Support Portal</p>
        </div>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto space-y-3">
        <div className="rounded-xl bg-sidebar-accent p-3">
          <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
            {user?.name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {ROLE_LABELS[user?.role ?? "student"]}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => {
            onNavigate?.();
            logout();
            void navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" /> Sign out
        </Button>
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
  const { user, role, activeTeacherId, setActiveTeacherId, teachers } = useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) void navigate({ to: "/login" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/85 px-4 py-3 backdrop-blur sm:px-6">
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
          <span className="hidden lg:block" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {ROLE_LABELS[role]} • {COLLEGE_SHORT}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {role === "teacher" && (
              <Select value={activeTeacherId} onValueChange={setActiveTeacherId}>
                <SelectTrigger className="w-[170px]" aria-label="Select teacher profile">
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
            <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground sm:inline">
              {PROGRAM}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
