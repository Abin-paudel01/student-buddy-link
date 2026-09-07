export type Role = "student" | "teacher" | "librarian" | "admin";

export type BookStatus = "Available" | "Issued";
export type RequestStatus = "Pending" | "Approved" | "Rejected";
export type TeacherRequestStatus = "Pending" | "Accepted" | "Declined";
export type TeacherStatus = "Free" | "Busy";

export interface Book {
  book_id: string;
  book_name: string;
  author: string;
  subject: string;
  availability_status: BookStatus;
  request_count: number;
}

export interface BookRequest {
  request_id: string;
  book_id: string;
  book_name: string;
  requested_by: string;
  status: RequestStatus;
}

export interface Teacher {
  teacher_id: string;
  teacher_name: string;
  subject: string;
  period: string;
  availability_status: TeacherStatus;
}

export interface TeacherRequest {
  request_id: string;
  class_name: string;
  teacher_id: string;
  period: string;
  status: TeacherRequestStatus;
}

export const CURRENT_STUDENT = "Aarav Sharma";
export const CURRENT_CLASS = "BCA 3rd Sem — Section A";

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  librarian: "Library Staff",
  admin: "Admin",
};

export const SUBJECTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Management",
  "English",
  "Electronics",
];

export const PERIODS = [
  "Period 1 (9:00 – 9:50)",
  "Period 2 (10:00 – 10:50)",
  "Period 3 (11:00 – 11:50)",
  "Period 4 (12:30 – 1:20)",
  "Period 5 (1:30 – 2:20)",
  "Period 6 (2:30 – 3:20)",
];

export const initialBooks: Book[] = [
  {
    book_id: "BK-1001",
    book_name: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest",
    subject: "Computer Science",
    availability_status: "Available",
    request_count: 3,
  },
  {
    book_id: "BK-1002",
    book_name: "Clean Code",
    author: "Robert C. Martin",
    subject: "Computer Science",
    availability_status: "Issued",
    request_count: 7,
  },
  {
    book_id: "BK-1003",
    book_name: "Higher Engineering Mathematics",
    author: "B. S. Grewal",
    subject: "Mathematics",
    availability_status: "Available",
    request_count: 2,
  },
  {
    book_id: "BK-1004",
    book_name: "Concepts of Physics — Vol. 1",
    author: "H. C. Verma",
    subject: "Physics",
    availability_status: "Issued",
    request_count: 5,
  },
  {
    book_id: "BK-1005",
    book_name: "Principles of Management",
    author: "Harold Koontz",
    subject: "Management",
    availability_status: "Available",
    request_count: 1,
  },
  {
    book_id: "BK-1006",
    book_name: "Wren & Martin English Grammar",
    author: "P. C. Wren",
    subject: "English",
    availability_status: "Available",
    request_count: 0,
  },
  {
    book_id: "BK-1007",
    book_name: "Digital Design",
    author: "M. Morris Mano",
    subject: "Electronics",
    availability_status: "Issued",
    request_count: 4,
  },
  {
    book_id: "BK-1008",
    book_name: "Database System Concepts",
    author: "Silberschatz, Korth",
    subject: "Computer Science",
    availability_status: "Available",
    request_count: 6,
  },
  {
    book_id: "BK-1009",
    book_name: "Operating System Concepts",
    author: "Abraham Silberschatz",
    subject: "Computer Science",
    availability_status: "Issued",
    request_count: 8,
  },
  {
    book_id: "BK-1010",
    book_name: "Discrete Mathematics",
    author: "Kenneth H. Rosen",
    subject: "Mathematics",
    availability_status: "Available",
    request_count: 2,
  },
];

export const initialBookRequests: BookRequest[] = [
  {
    request_id: "BR-2001",
    book_id: "BK-1002",
    book_name: "Clean Code",
    requested_by: CURRENT_STUDENT,
    status: "Pending",
  },
  {
    request_id: "BR-2002",
    book_id: "BK-1009",
    book_name: "Operating System Concepts",
    requested_by: "Nisha Thapa",
    status: "Pending",
  },
  {
    request_id: "BR-2003",
    book_id: "BK-1004",
    book_name: "Concepts of Physics — Vol. 1",
    requested_by: "Rohan Gupta",
    status: "Approved",
  },
  {
    request_id: "BR-2004",
    book_id: "BK-1007",
    book_name: "Digital Design",
    requested_by: "Sneha Rai",
    status: "Rejected",
  },
];

export const initialTeachers: Teacher[] = [
  {
    teacher_id: "T-01",
    teacher_name: "Dr. Meera Joshi",
    subject: "Computer Science",
    period: "Period 3 (11:00 – 11:50)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-02",
    teacher_name: "Prof. Anil Karki",
    subject: "Mathematics",
    period: "Period 2 (10:00 – 10:50)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-03",
    teacher_name: "Ms. Priya Sen",
    subject: "English",
    period: "Period 5 (1:30 – 2:20)",
    availability_status: "Busy",
  },
  {
    teacher_id: "T-04",
    teacher_name: "Dr. Sanjay Verma",
    subject: "Physics",
    period: "Period 4 (12:30 – 1:20)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-05",
    teacher_name: "Prof. Kavita Rao",
    subject: "Management",
    period: "Period 1 (9:00 – 9:50)",
    availability_status: "Busy",
  },
  {
    teacher_id: "T-06",
    teacher_name: "Mr. Deepak Shah",
    subject: "Electronics",
    period: "Period 6 (2:30 – 3:20)",
    availability_status: "Free",
  },
];

export const initialTeacherRequests: TeacherRequest[] = [
  {
    request_id: "TR-3001",
    class_name: CURRENT_CLASS,
    teacher_id: "T-02",
    period: "Period 2 (10:00 – 10:50)",
    status: "Pending",
  },
  {
    request_id: "TR-3002",
    class_name: "BBA 1st Sem — Section B",
    teacher_id: "T-01",
    period: "Period 3 (11:00 – 11:50)",
    status: "Accepted",
  },
  {
    request_id: "TR-3003",
    class_name: "BSc CSIT 5th Sem",
    teacher_id: "T-04",
    period: "Period 4 (12:30 – 1:20)",
    status: "Pending",
  },
  {
    request_id: "TR-3004",
    class_name: "BCA 1st Sem — Section C",
    teacher_id: "T-03",
    period: "Period 5 (1:30 – 2:20)",
    status: "Declined",
  },
];
