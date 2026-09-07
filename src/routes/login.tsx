import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, KeyRound, LogIn, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/app-store";
import {
  COLLEGE_LOCATION,
  COLLEGE_SHORT,
  DEMO_ACCOUNTS,
  PROGRAM,
  ROLE_LABELS,
  type Role,
} from "@/lib/college-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — MMC Hetauda BICTE Portal" },
      {
        name: "description",
        content:
          "Prototype login for the MMC Hetauda BICTE student support portal. Choose a role and use the demo credentials.",
      },
      { property: "og:title", content: "Login — MMC Hetauda BICTE Portal" },
      {
        property: "og:description",
        content: "Sign in as a student, teacher, library staff member or admin.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState(DEMO_ACCOUNTS.student.email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS.student.password);

  const pickRole = (r: Role) => {
    setRole(r);
    setEmail(DEMO_ACCOUNTS[r].email);
    setPassword(DEMO_ACCOUNTS[r].password);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(email, password, role)) void navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-sidebar via-primary to-accent p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] [background-size:26px_26px]"
        />
        <Link to="/" className="relative flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap className="size-6" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">{COLLEGE_SHORT}</p>
            <p className="text-xs text-white/75">{COLLEGE_LOCATION}</p>
          </div>
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-bold">{PROGRAM} Student Support Portal</h2>
          <p className="mt-4 max-w-md text-white/80">
            Library requests, teacher free periods and digital identity cards — designed for
            everyday campus life at Makwanpur Multiple Campus.
          </p>
        </div>
        <p className="relative text-xs text-white/60">Prototype only — no real authentication.</p>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="font-display font-bold">{COLLEGE_SHORT}</p>
              <p className="text-xs text-muted-foreground">{PROGRAM} Support Portal</p>
            </div>
          </Link>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Sign in</CardTitle>
              <CardDescription>Choose your role and continue to the portal.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(v) => pickRole(v as Role)}>
                    <SelectTrigger id="role" className="w-full">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email / Username</Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="you@mmc.edu.np"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <LogIn className="size-4" /> Sign in as {ROLE_LABELS[role]}
                </Button>
              </form>

              <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/60 p-4">
                <p className="text-sm font-semibold">Demo Login</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tap a role to fill the credentials automatically.
                </p>
                <div className="mt-3 space-y-2">
                  {(Object.keys(DEMO_ACCOUNTS) as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => pickRole(r)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 text-left text-xs shadow-sm transition-colors hover:bg-accent/15"
                    >
                      <span className="font-semibold">{ROLE_LABELS[r]}</span>
                      <span className="truncate text-muted-foreground">
                        {DEMO_ACCOUNTS[r].email} / {DEMO_ACCOUNTS[r].password}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
