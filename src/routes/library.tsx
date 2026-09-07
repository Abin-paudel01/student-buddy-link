import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CURRENT_STUDENT, useStore } from "@/lib/app-store";
import { SUBJECTS, type Book, type BookStatus } from "@/lib/college-data";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library Catalogue — Campus Desk" },
      {
        name: "description",
        content:
          "Search the college library catalogue, check book availability and track book requests.",
      },
      { property: "og:title", content: "Library Catalogue — Campus Desk" },
      {
        property: "og:description",
        content: "Search books, check availability and manage library requests.",
      },
    ],
  }),
  component: LibraryPage,
});

const EMPTY_BOOK: Book = {
  book_id: "",
  book_name: "",
  author: "",
  subject: SUBJECTS[0] as string,
  availability_status: "Available",
  request_count: 0,
};

function LibraryPage() {
  const {
    role,
    books,
    bookRequests,
    requestBook,
    saveBook,
    toggleBookAvailability,
    decideBookRequest,
  } = useStore();

  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Book | null>(null);
  const [isNew, setIsNew] = useState(false);

  const isStaff = role === "librarian" || role === "admin";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesQuery =
        !q ||
        b.book_name.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q);
      const matchesSubject = subject === "all" || b.subject === subject;
      const matchesStatus = status === "all" || b.availability_status === status;
      return matchesQuery && matchesSubject && matchesStatus;
    });
  }, [books, query, subject, status]);

  const myRequests = bookRequests.filter((r) => r.requested_by === CURRENT_STUDENT);
  const pendingRequests = bookRequests.filter((r) => r.status === "Pending");

  function openNew() {
    setEditing({ ...EMPTY_BOOK, book_id: `BK-${1000 + books.length + 1}` });
    setIsNew(true);
  }

  function submitBook() {
    if (!editing) return;
    if (!editing.book_name.trim() || !editing.author.trim()) return;
    saveBook(editing, isNew);
    setEditing(null);
  }

  return (
    <AppLayout
      title="Library"
      description={
        isStaff
          ? "Manage the catalogue, update availability and review student requests."
          : "Search the catalogue, check availability and request books."
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Catalogue ({filtered.length})</CardTitle>
            {isStaff && (
              <Button onClick={openNew} className="w-full sm:w-auto">
                <Plus className="size-4" /> Add book
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by book name, author or subject"
                  className="pl-9"
                />
              </div>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="w-full sm:w-[190px]" aria-label="Filter by subject">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Issued">Issued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden sm:table-cell">Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Requests</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((book) => (
                    <TableRow key={book.book_id}>
                      <TableCell className="font-medium">
                        {book.book_name}
                        <span className="block text-xs text-muted-foreground md:hidden">
                          {book.author}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{book.author}</TableCell>
                      <TableCell className="hidden sm:table-cell">{book.subject}</TableCell>
                      <TableCell>
                        <StatusBadge status={book.availability_status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{book.request_count}</TableCell>
                      <TableCell className="text-right">
                        {isStaff ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditing(book);
                                setIsNew(false);
                              }}
                            >
                              <Pencil className="size-3.5" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => toggleBookAvailability(book.book_id)}
                            >
                              <RefreshCw className="size-3.5" />
                              {book.availability_status === "Available" ? "Issue" : "Return"}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant={book.availability_status === "Available" ? "outline" : "default"}
                            disabled={book.availability_status === "Available"}
                            onClick={() => requestBook(book)}
                          >
                            {book.availability_status === "Available" ? "On shelf" : "Request"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        No books match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {isStaff ? (
          <Card>
            <CardHeader>
              <CardTitle>Book requests ({pendingRequests.length} pending)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead className="hidden sm:table-cell">Requested by</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookRequests.map((r) => (
                    <TableRow key={r.request_id}>
                      <TableCell className="font-mono text-xs">{r.request_id}</TableCell>
                      <TableCell className="font-medium">{r.book_name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{r.requested_by}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {r.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" onClick={() => decideBookRequest(r.request_id, true)}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => decideBookRequest(r.request_id, false)}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Closed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>My book requests</CardTitle>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  You haven't requested any books yet.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {myRequests.map((r) => (
                    <li key={r.request_id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{r.book_name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{r.request_id}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNew ? "Add book" : "Edit book"}</DialogTitle>
            <DialogDescription>
              {isNew ? "Add a new title to the catalogue." : `Update details for ${editing?.book_id}.`}
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="book_name">Book name</Label>
                <Input
                  id="book_name"
                  value={editing.book_name}
                  onChange={(e) => setEditing({ ...editing, book_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={editing.author}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={editing.subject}
                    onValueChange={(v) => setEditing({ ...editing, subject: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select
                    value={editing.availability_status}
                    onValueChange={(v) =>
                      setEditing({ ...editing, availability_status: v as BookStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Issued">Issued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={submitBook}>{isNew ? "Add book" : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
