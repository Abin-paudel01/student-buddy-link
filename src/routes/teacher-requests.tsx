import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CURRENT_CLASS, useStore } from "@/lib/app-store";
import type { Teacher } from "@/lib/college-data";

export const Route = createFileRoute("/teacher-requests")({
  head: () => ({
    meta: [
      { title: "Teacher Free-Period Requests — MMC Hetauda BICTE Portal" },
      {
        name: "description",
        content:
          "See which teachers are free this period and request a class cover, or review incoming requests.",
      },
      { property: "og:title", content: "Teacher Free-Period Requests — MMC Hetauda BICTE Portal" },
      {
        property: "og:description",
        content: "Request a free teacher for your class period and track the response.",
      },
    ],
  }),
  component: TeacherRequestsPage,
});

function TeacherRequestsPage() {
  const {
    role,
    teachers,
    teacherRequests,
    requestTeacher,
    decideTeacherRequest,
    activeTeacherId,
    teacherName,
  } = useStore();

  const [target, setTarget] = useState<Teacher | null>(null);
  const [className, setClassName] = useState(CURRENT_CLASS);

  const isTeacher = role === "teacher";
  const incoming = teacherRequests.filter((r) => r.teacher_id === activeTeacherId);
  const myRequests = teacherRequests.filter((r) => r.class_name === CURRENT_CLASS);

  function send() {
    if (!target || !className.trim()) return;
    requestTeacher(target, className.trim());
    setTarget(null);
  }

  return (
    <AppLayout
      title="Teacher Requests"
      description={
        isTeacher
          ? "Review free-period requests from classes and respond."
          : "Find a free teacher and request them for your class period."
      }
    >
      <div className="space-y-6">
        {isTeacher ? (
          <Card>
            <CardHeader>
              <CardTitle>
                Incoming requests for {teacherName(activeTeacherId)} ({incoming.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="hidden sm:table-cell">Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incoming.map((r) => (
                    <TableRow key={r.request_id}>
                      <TableCell className="font-mono text-xs">{r.request_id}</TableCell>
                      <TableCell className="font-medium">
                        {r.class_name}
                        <span className="block text-xs text-muted-foreground sm:hidden">
                          {r.period}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{r.period}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {r.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => decideTeacherRequest(r.request_id, true)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => decideTeacherRequest(r.request_id, false)}
                            >
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Closed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {incoming.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        No requests yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {teachers.map((t) => (
                <Card key={t.teacher_id} className="flex flex-col">
                  <CardHeader className="gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{t.teacher_name}</CardTitle>
                      <StatusBadge status={t.availability_status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{t.subject}</p>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Free period: </span>
                      {t.period}
                    </p>
                    <Button
                      className="w-full"
                      disabled={t.availability_status !== "Free"}
                      onClick={() => {
                        setTarget(t);
                        setClassName(CURRENT_CLASS);
                      }}
                    >
                      {t.availability_status === "Free" ? "Send request" : "Not available"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>My class requests</CardTitle>
              </CardHeader>
              <CardContent>
                {myRequests.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No requests sent yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {myRequests.map((r) => (
                      <li
                        key={r.request_id}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {teacherName(r.teacher_id)}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{r.period}</p>
                          {r.status === "Accepted" && (
                            <p className="mt-1 text-xs font-medium text-success-foreground">
                              {teacherName(r.teacher_id)} will come to teach your class during{" "}
                              {r.period}.
                            </p>
                          )}
                        </div>
                        <StatusBadge status={r.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={target !== null} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request {target?.teacher_name}</DialogTitle>
            <DialogDescription>
              {target?.subject} · {target?.period}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="class_name">Class name</Label>
            <Input
              id="class_name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button onClick={send}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
