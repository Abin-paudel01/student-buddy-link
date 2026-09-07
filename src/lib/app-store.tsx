import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  CURRENT_CLASS,
  CURRENT_STUDENT,
  CURRENT_STUDENT_ID,
  DEMO_ACCOUNTS,
  initialBookRequests,
  initialBooks,
  initialIdentityCards,
  initialTeacherRequests,
  initialTeachers,
  type Book,
  type BookRequest,
  type IdCardStatus,
  type IdentityCard,
  type Role,
  type Teacher,
  type TeacherRequest,
} from "./college-data";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
}

interface AppStore {
  user: SessionUser | null;
  login: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
  role: Role;
  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;
  books: Book[];
  bookRequests: BookRequest[];
  teachers: Teacher[];
  teacherRequests: TeacherRequest[];
  identityCards: IdentityCard[];
  myIdentityCard: IdentityCard | undefined;
  requestBook: (book: Book) => void;
  saveBook: (book: Book, isNew: boolean) => void;
  toggleBookAvailability: (bookId: string) => void;
  decideBookRequest: (requestId: string, approve: boolean) => void;
  requestTeacher: (teacher: Teacher, className: string) => void;
  decideTeacherRequest: (requestId: string, accept: boolean) => void;
  setIdentityCardStatus: (cardId: string, status: IdCardStatus) => void;
  teacherName: (teacherId: string) => string;
}

const StoreContext = createContext<AppStore | null>(null);

let counter = 100;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [activeTeacherId, setActiveTeacherId] = useState("T-01");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>(initialBookRequests);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [teacherRequests, setTeacherRequests] =
    useState<TeacherRequest[]>(initialTeacherRequests);
  const [identityCards, setIdentityCards] = useState<IdentityCard[]>(initialIdentityCards);

  const login = useCallback((email: string, password: string, role: Role) => {
    const demo = DEMO_ACCOUNTS[role];
    if (email.trim().toLowerCase() !== demo.email || password !== demo.password) {
      toast.error("Incorrect demo credentials for the selected role.");
      return false;
    }
    setUser({ name: demo.name, email: demo.email, role });
    if (role === "teacher") {
      const match = initialTeachers.find((t) => t.teacher_name === demo.name);
      if (match) setActiveTeacherId(match.teacher_id);
    }
    toast.success(`Welcome back, ${demo.name.replace(/^(Mr\.|Ms\.|Dr\.)\s*/, "").split(" ")[0]}!`);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.info("You have been signed out.");
  }, []);

  const role: Role = user?.role ?? "student";

  const teacherName = useCallback(
    (teacherId: string) =>
      teachers.find((t) => t.teacher_id === teacherId)?.teacher_name ?? "Unknown teacher",
    [teachers],
  );

  const requestBook = useCallback((book: Book) => {
    setBookRequests((prev) => {
      if (
        prev.some(
          (r) =>
            r.book_id === book.book_id &&
            r.requested_by === CURRENT_STUDENT &&
            r.status === "Pending",
        )
      ) {
        toast.info("You already have a pending request for this book.");
        return prev;
      }
      toast.success(`Request sent for "${book.book_name}".`);
      return [
        {
          request_id: nextId("BR"),
          book_id: book.book_id,
          book_name: book.book_name,
          requested_by: CURRENT_STUDENT,
          status: "Pending",
        },
        ...prev,
      ];
    });
    setBooks((prev) =>
      prev.map((b) =>
        b.book_id === book.book_id ? { ...b, request_count: b.request_count + 1 } : b,
      ),
    );
  }, []);

  const saveBook = useCallback((book: Book, isNew: boolean) => {
    setBooks((prev) =>
      isNew ? [{ ...book }, ...prev] : prev.map((b) => (b.book_id === book.book_id ? book : b)),
    );
    toast.success(isNew ? `"${book.book_name}" added to the catalogue.` : "Book details updated.");
  }, []);

  const toggleBookAvailability = useCallback((bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.book_id !== bookId) return b;
        const next: Book = {
          ...b,
          availability_status: b.availability_status === "Available" ? "Issued" : "Available",
        };
        toast.success(`"${b.book_name}" marked as ${next.availability_status}.`);
        return next;
      }),
    );
  }, []);

  const decideBookRequest = useCallback((requestId: string, approve: boolean) => {
    setBookRequests((prev) =>
      prev.map((r) => {
        if (r.request_id !== requestId) return r;
        toast[approve ? "success" : "info"](
          `Request for "${r.book_name}" ${approve ? "approved" : "rejected"}.`,
        );
        if (approve) {
          setBooks((books) =>
            books.map((b) =>
              b.book_id === r.book_id ? { ...b, availability_status: "Issued" } : b,
            ),
          );
        }
        return { ...r, status: approve ? "Approved" : "Rejected" };
      }),
    );
  }, []);

  const requestTeacher = useCallback((teacher: Teacher, className: string) => {
    setTeacherRequests((prev) => {
      if (
        prev.some(
          (r) =>
            r.teacher_id === teacher.teacher_id &&
            r.class_name === className &&
            r.status === "Pending",
        )
      ) {
        toast.info("A pending request to this teacher already exists.");
        return prev;
      }
      toast.success(`Request sent to ${teacher.teacher_name}.`);
      return [
        {
          request_id: nextId("TR"),
          class_name: className,
          teacher_id: teacher.teacher_id,
          period: teacher.period,
          status: "Pending",
        },
        ...prev,
      ];
    });
  }, []);

  const decideTeacherRequest = useCallback(
    (requestId: string, accept: boolean) => {
      setTeacherRequests((prev) =>
        prev.map((r) => {
          if (r.request_id !== requestId) return r;
          if (accept) {
            toast.success(
              `${teacherName(r.teacher_id)} will come to teach your class during ${r.period}.`,
              { duration: 6000 },
            );
            setTeachers((ts) =>
              ts.map((t) =>
                t.teacher_id === r.teacher_id ? { ...t, availability_status: "Busy" } : t,
              ),
            );
          } else {
            toast.info(`Request from ${r.class_name} declined.`);
          }
          return { ...r, status: accept ? "Accepted" : "Declined" };
        }),
      );
    },
    [teacherName],
  );

  const setIdentityCardStatus = useCallback((cardId: string, status: IdCardStatus) => {
    setIdentityCards((prev) =>
      prev.map((c) => {
        if (c.card_id !== cardId) return c;
        toast.success(`${c.student_name}'s ID card marked as "${status}".`);
        return { ...c, status };
      }),
    );
  }, []);

  const myIdentityCard = identityCards.find((c) => c.student_id === CURRENT_STUDENT_ID);

  const value = useMemo<AppStore>(
    () => ({
      user,
      login,
      logout,
      role,
      activeTeacherId,
      setActiveTeacherId,
      books,
      bookRequests,
      teachers,
      teacherRequests,
      identityCards,
      myIdentityCard,
      requestBook,
      saveBook,
      toggleBookAvailability,
      decideBookRequest,
      requestTeacher,
      decideTeacherRequest,
      setIdentityCardStatus,
      teacherName,
    }),
    [
      user,
      login,
      logout,
      role,
      activeTeacherId,
      books,
      bookRequests,
      teachers,
      teacherRequests,
      identityCards,
      myIdentityCard,
      requestBook,
      saveBook,
      toggleBookAvailability,
      decideBookRequest,
      requestTeacher,
      decideTeacherRequest,
      setIdentityCardStatus,
      teacherName,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}

export { CURRENT_CLASS, CURRENT_STUDENT };
