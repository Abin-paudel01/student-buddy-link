import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, BookX, CalendarClock, Clock, IdCard } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/app-store";
import { COLLEGE_SHORT, PROGRAM, ROLE_LABELS } from "@/lib/college-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MMC Hetauda BICTE Portal" },
      {
        name: "description",
        content:
          "Overview of library books, teacher availability, pending requests and identity card status for BICTE students at MMC Hetauda.",
      },
      { property: "og:title", content: "Dashboard — MMC Hetauda BICTE Portal" },
      {
        property: "og:description",
        content: "Track books, teacher free periods and identity cards from one dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof BookOpen;
}) {
  return (
    <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-3 py-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-2xl leading-tight font-semibold">{value}</p>
          <p className="text-xs leading-tight text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const {
    user,
    role,
    books,
    bookRequests,
    teachers,
    teacherRequests,
    identityCards,
    myIdentityCard,
    teacherName,
  } = useStore();

  const availableBooks = books.filter((b) => b.availability_status === "Available").length;
  const issuedBooks = books.filter((b) => b.availability_status === "Issued").length;
  const freeTeachers = teachers.filter((t) => t.availability_status === "Free").length;
  const pending =
    bookRequests.filter((r) => r.status === "Pending").length +
    teacherRequests.filter((r) => r.status === "Pending").length;
  const idStatus =
    role === "student"
      ? (myIdentityCard?.status ?? "Not Ready")
      : `${identityCards.filter((c) => c.status === "Ready").length} Ready`;

  const showLibrary = role !== "teacher";
  const showTeachers = role !== "librarian";

  return (
    <AppLayout
      title={`Welcome back, ${user?.name?.split(" ")[0] ?? ""}`}
      description={`${role === "student" ? `${PROGRAM} Student` : ROLE_LABELS[role]} • ${COLLEGE_SHORT}`}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Stat label="Available books" value={availableBooks} icon={BookOpen} />
          <Stat label="Issued books" value={issuedBooks} icon={BookX} />
          <Stat label="Available teachers" value={freeTeachers} icon={CalendarClock} />
          <Stat label="Pending requests" value={pending} icon={Clock} />
          <Stat label="Identity card status" value={idStatus} icon={IdCard} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {showLibrary && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent book requests</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/library">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {bookRequests.slice(0, 5).map((r) => (
                    <li key={r.request_id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{r.book_name}</p>
                        <p className="truncate text-xs text-muted-foreground">{r.requested_by}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {showTeachers && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent teacher requests</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/teacher-requests">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {teacherRequests.slice(0, 5).map((r) => (
                    <li key={r.request_id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{r.class_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {teacherName(r.teacher_id)} · {r.period}
                        </p>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Teachers free today</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {teachers.slice(0, 5).map((t) => (
                  <li key={t.teacher_id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{t.teacher_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.subject} · {t.period}
                      </p>
                    </div>
                    <StatusBadge status={t.availability_status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {(role === "student" || role === "admin") && (
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Identity cards</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/identity-card">Open</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border">
                  {(role === "student" && myIdentityCard
                    ? [myIdentityCard]
                    : identityCards.slice(0, 5)
                  ).map((c) => (
                    <li key={c.card_id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.student_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.student_id} · {c.card_id}
                        </p>
                      </div>
                      <StatusBadge status={c.status} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
