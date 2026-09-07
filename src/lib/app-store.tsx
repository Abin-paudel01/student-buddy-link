import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  CURRENT_CLASS,
  CURRENT_STUDENT,
  initialBookRequests,
  initialBooks,
  initialTeacherRequests,
  initialTeachers,
  type Book,
  type BookRequest,
  type Role,
  type Teacher,
  type TeacherRequest,
} from "./college-data";

interface AppStore {
  role: Role;
  setRole: (role: Role) => void;
  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;
  books: Book[];
  bookRequests: BookRequest[];
  teachers: Teacher[];
  teacherRequests: TeacherRequest[];
  requestBook: (book: Book) => void;
  saveBook: (book: Book, isNew: boolean) => void;
  toggleBookAvailability: (bookId: string) => void;
  decideBookRequest: (requestId: string, approve: boolean) => void;
  requestTeacher: (teacher: Teacher, className: string) => void;
  decideTeacherRequest: (requestId: string, accept: boolean) => void;
  teacherName: (teacherId: string) => string;
}

const StoreContext = createContext<AppStore | null>(null);

let counter = 100;
const nextId = (prefix: string) => `${prefix}-${++counter}`;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("student");
  const [activeTeacherId, setActiveTeacherId] = useState("T-01");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [bookRequests, setBookRequests] = useState<BookRequest[]>(initialBookRequests);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [teacherRequests, setTeacherRequests] =
    useState<TeacherRequest[]>(initialTeacherRequests);

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
        return { ...r, status: approve ? "Approved" : "Rejected" };
      }),
    );
    if (approve) {
      setBookRequests((prev) => {
        const req = prev.find((r) => r.request_id === requestId);
        if (req) {
          setBooks((books) =>
            books.map((b) => (b.book_id === req.book_id ? { ...b, availability_status: "Issued" } : b)),
          );
        }
        return prev;
      });
    }
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
            toast.success(`${teacherName(r.teacher_id)} will come to teach your class during ${r.period}.`, {
              duration: 6000,
            });
          } else {
            toast.info(`Request from ${r.class_name} declined.`);
          }
          return { ...r, status: accept ? "Accepted" : "Declined" };
        }),
      );
      if (accept) {
        setTeachers((prev) =>
          prev.map((t) =>
            t.teacher_id === teacherRequests.find((r) => r.request_id === requestId)?.teacher_id
              ? { ...t, availability_status: "Busy" }
              : t,
          ),
        );
      }
    },
    [teacherName, teacherRequests],
  );

  const value = useMemo<AppStore>(
    () => ({
      role,
      setRole,
      activeTeacherId,
      setActiveTeacherId,
      books,
      bookRequests,
      teachers,
      teacherRequests,
      requestBook,
      saveBook,
      toggleBookAvailability,
      decideBookRequest,
      requestTeacher,
      decideTeacherRequest,
      teacherName,
    }),
    [
      role,
      activeTeacherId,
      books,
      bookRequests,
      teachers,
      teacherRequests,
      requestBook,
      saveBook,
      toggleBookAvailability,
      decideBookRequest,
      requestTeacher,
      decideTeacherRequest,
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
