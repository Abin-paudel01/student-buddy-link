import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, BookX, CalendarClock, Clock } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/app-store";
import { ROLE_LABELS } from "@/lib/college-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Campus Desk — College Library & Teacher Support" },
      {
        name: "description",
        content:
          "A college support dashboard for library books and teacher free-period requests, with views for students, teachers, library staff and admins.",
      },
      { property: "og:title", content: "Campus Desk — College Library & Teacher Support" },
      {
        property: "og:description",
        content: "Track library books and teacher free-period requests from one simple dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof BookOpen;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-semibold">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { role, books, bookRequests, teachers, teacherRequests, teacherName } = useStore();

  const availableBooks = books.filter((b) => b.availability_status === "Available").length;
  const issuedBooks = books.filter((b) => b.availability_status === "Issued").length;
  const freeTeachers = teachers.filter((t) => t.availability_status === "Free").length;
  const pending =
    bookRequests.filter((r) => r.status === "Pending").length +
    teacherRequests.filter((r) => r.status === "Pending").length;

  return (
    <AppLayout
      title={`Welcome, ${ROLE_LABELS[role]}`}
      description="A quick overview of the library and teacher free-period activity today."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Available books" value={availableBooks} icon={BookOpen} />
          <Stat label="Issued books" value={issuedBooks} icon={BookX} />
          <Stat label="Available teachers" value={freeTeachers} icon={CalendarClock} />
          <Stat label="Pending requests" value={pending} icon={Clock} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
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

          <Card>
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
        </div>
      </div>
    </AppLayout>
  );
}
