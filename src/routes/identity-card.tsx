import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, IdCard, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/app-store";
import {
  COLLEGE_LOCATION,
  COLLEGE_NAME,
  COLLEGE_SHORT,
  PROGRAM,
  type IdCardStatus,
  type IdentityCard,
} from "@/lib/college-data";

export const Route = createFileRoute("/identity-card")({
  head: () => ({
    meta: [
      { title: "Identity Card — MMC Hetauda BICTE Portal" },
      {
        name: "description",
        content:
          "View your MMC Hetauda BICTE digital identity card details and check whether your card is ready to collect.",
      },
      { property: "og:title", content: "Identity Card — MMC Hetauda BICTE Portal" },
      {
        property: "og:description",
        content: "Digital college ID card and card status tracking for BICTE students.",
      },
    ],
  }),
  component: IdentityCardPage,
});

const STATUSES: IdCardStatus[] = ["Ready", "Not Ready", "Collected"];

function DigitalCard({ card }: { card: IdentityCard }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar via-primary to-accent p-[1px] shadow-xl">
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-sidebar via-primary to-accent p-6 text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/10"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-base font-bold">{COLLEGE_NAME}</p>
            <p className="truncate text-xs text-white/75">
              {COLLEGE_SHORT} • {COLLEGE_LOCATION}
            </p>
          </div>
        </div>

        <div className="relative mt-6 flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold">
            {card.student_name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-xl font-bold">{card.student_name}</p>
            <p className="truncate text-sm text-white/80">
              {card.program} • {card.semester}
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-white/60">Student ID</p>
            <p className="font-semibold">{card.student_id}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Card ID</p>
            <p className="font-semibold">{card.card_id}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Program</p>
            <p className="font-semibold">{PROGRAM}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Status</p>
            <StatusBadge status={card.status} className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityCardPage() {
  const { role, identityCards, myIdentityCard, setIdentityCardStatus } = useStore();
  const [query, setQuery] = useState("");

  const isStaff = role === "admin" || role === "librarian";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return identityCards;
    return identityCards.filter(
      (c) =>
        c.student_name.toLowerCase().includes(q) ||
        c.student_id.toLowerCase().includes(q) ||
        c.card_id.toLowerCase().includes(q),
    );
  }, [identityCards, query]);

  return (
    <AppLayout
      title="Identity Card"
      description="Your digital college ID card and its collection status."
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          {myIdentityCard ? (
            <DigitalCard card={myIdentityCard} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No identity card record found.
              </CardContent>
            </Card>
          )}

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Card information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Identity cards are printed at the campus administration office. Once the status
                shows <strong>Ready</strong>, collect your card from the admin desk during office
                hours. After collection the status changes to <strong>Collected</strong>.
              </p>
              <ul className="divide-y divide-border">
                <li className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Program</span>
                  <span className="font-medium">{PROGRAM}</span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Campus</span>
                  <span className="font-medium">{COLLEGE_SHORT}</span>
                </li>
                <li className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Current status</span>
                  <StatusBadge status={myIdentityCard?.status ?? "Not Ready"} />
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {isStaff && (
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <IdCard className="size-4" /> Manage identity cards
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, student ID or card ID"
                  className="pl-9"
                  aria-label="Search identity cards"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Card ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Update status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.card_id}>
                        <TableCell className="font-medium">{c.student_name}</TableCell>
                        <TableCell className="whitespace-nowrap">{c.student_id}</TableCell>
                        <TableCell className="whitespace-nowrap">{c.card_id}</TableCell>
                        <TableCell>
                          <StatusBadge status={c.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {STATUSES.map((s) => (
                              <Button
                                key={s}
                                size="sm"
                                variant={c.status === s ? "default" : "outline"}
                                onClick={() => setIdentityCardStatus(c.card_id, s)}
                              >
                                {s}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                          No matching identity card records.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
