export type Role = "student" | "teacher" | "librarian" | "admin";

export type BookStatus = "Available" | "Issued";
export type RequestStatus = "Pending" | "Approved" | "Rejected";
export type TeacherRequestStatus = "Pending" | "Accepted" | "Declined";
export type TeacherStatus = "Free" | "Busy";
export type IdCardStatus = "Ready" | "Not Ready" | "Collected";

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

export interface IdentityCard {
  card_id: string;
  student_name: string;
  student_id: string;
  program: string;
  semester: string;
  status: IdCardStatus;
}

export const COLLEGE_NAME = "Makwanpur Multiple Campus";
export const COLLEGE_SHORT = "MMC Hetauda";
export const COLLEGE_LOCATION = "Hetauda, Makwanpur";
export const PROGRAM = "BICTE";

export const CURRENT_STUDENT = "Abin Thapa";
export const CURRENT_STUDENT_ID = "BICTE-079-014";
export const CURRENT_CLASS = "BICTE 5th Semester — Section A";

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  librarian: "Library Staff",
  admin: "Admin",
};

export const DEMO_ACCOUNTS: Record<Role, { email: string; password: string; name: string }> = {
  student: { email: "abin@mmc.edu.np", password: "student123", name: CURRENT_STUDENT },
  teacher: { email: "rajan@mmc.edu.np", password: "teacher123", name: "Mr. Rajan Sharma" },
  librarian: { email: "library@mmc.edu.np", password: "library123", name: "Bina Shrestha" },
  admin: { email: "admin@mmc.edu.np", password: "admin123", name: "Campus Admin" },
};

export const SUBJECTS = [
  "Programming",
  "Database Management",
  "Computer Networks",
  "Web Technology",
  "Operating System",
  "Data Structures",
  "Software Engineering",
  "Computer Graphics",
  "Artificial Intelligence",
  "Mathematics",
];

export const PERIODS = [
  "1st Period (10:15 – 11:00)",
  "2nd Period (11:00 – 11:45)",
  "3rd Period (11:45 – 12:30)",
  "4th Period (12:30 – 1:15)",
  "5th Period (1:15 – 2:00)",
  "6th Period (2:00 – 2:45)",
];

export const initialBooks: Book[] = [
  {
    book_id: "BK-1001",
    book_name: "C Programming",
    author: "Balagurusamy",
    subject: "Programming",
    availability_status: "Available",
    request_count: 4,
  },
  {
    book_id: "BK-1002",
    book_name: "Object Oriented Programming with C++",
    author: "E. Balagurusamy",
    subject: "Programming",
    availability_status: "Issued",
    request_count: 7,
  },
  {
    book_id: "BK-1003",
    book_name: "Database Management Systems",
    author: "Raghu Ramakrishnan",
    subject: "Database Management",
    availability_status: "Available",
    request_count: 3,
  },
  {
    book_id: "BK-1004",
    book_name: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    subject: "Computer Networks",
    availability_status: "Issued",
    request_count: 6,
  },
  {
    book_id: "BK-1005",
    book_name: "Web Technology",
    author: "Achyut Godbole",
    subject: "Web Technology",
    availability_status: "Available",
    request_count: 2,
  },
  {
    book_id: "BK-1006",
    book_name: "Operating System Concepts",
    author: "Abraham Silberschatz",
    subject: "Operating System",
    availability_status: "Issued",
    request_count: 8,
  },
  {
    book_id: "BK-1007",
    book_name: "Data Structures and Algorithms",
    author: "Seymour Lipschutz",
    subject: "Data Structures",
    availability_status: "Available",
    request_count: 5,
  },
  {
    book_id: "BK-1008",
    book_name: "Software Engineering",
    author: "Ian Sommerville",
    subject: "Software Engineering",
    availability_status: "Available",
    request_count: 1,
  },
  {
    book_id: "BK-1009",
    book_name: "Computer Graphics",
    author: "Donald Hearn & Pauline Baker",
    subject: "Computer Graphics",
    availability_status: "Issued",
    request_count: 3,
  },
  {
    book_id: "BK-1010",
    book_name: "Artificial Intelligence",
    author: "Stuart Russell & Peter Norvig",
    subject: "Artificial Intelligence",
    availability_status: "Available",
    request_count: 6,
  },
  {
    book_id: "BK-1011",
    book_name: "Discrete Mathematics",
    author: "Kenneth H. Rosen",
    subject: "Mathematics",
    availability_status: "Available",
    request_count: 2,
  },
  {
    book_id: "BK-1012",
    book_name: "Fundamentals of Database Systems",
    author: "Elmasri & Navathe",
    subject: "Database Management",
    availability_status: "Issued",
    request_count: 4,
  },
];

export const initialBookRequests: BookRequest[] = [
  {
    request_id: "BR-2001",
    book_id: "BK-1002",
    book_name: "Object Oriented Programming with C++",
    requested_by: CURRENT_STUDENT,
    status: "Pending",
  },
  {
    request_id: "BR-2002",
    book_id: "BK-1006",
    book_name: "Operating System Concepts",
    requested_by: "Nisha Ghimire",
    status: "Pending",
  },
  {
    request_id: "BR-2003",
    book_id: "BK-1004",
    book_name: "Computer Networks",
    requested_by: "Sujan Bhandari",
    status: "Approved",
  },
  {
    request_id: "BR-2004",
    book_id: "BK-1009",
    book_name: "Computer Graphics",
    requested_by: "Pooja Lamichhane",
    status: "Rejected",
  },
  {
    request_id: "BR-2005",
    book_id: "BK-1012",
    book_name: "Fundamentals of Database Systems",
    requested_by: CURRENT_STUDENT,
    status: "Approved",
  },
];

export const initialTeachers: Teacher[] = [
  {
    teacher_id: "T-01",
    teacher_name: "Mr. Rajan Sharma",
    subject: "Programming",
    period: "2nd Period (11:00 – 11:45)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-02",
    teacher_name: "Ms. Sita Adhikari",
    subject: "Database Management",
    period: "3rd Period (11:45 – 12:30)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-03",
    teacher_name: "Mr. Prakash Lama",
    subject: "Computer Networks",
    period: "4th Period (12:30 – 1:15)",
    availability_status: "Busy",
  },
  {
    teacher_id: "T-04",
    teacher_name: "Ms. Nisha Karki",
    subject: "Web Technology",
    period: "5th Period (1:15 – 2:00)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-05",
    teacher_name: "Mr. Sunil Thapa",
    subject: "Mathematics",
    period: "1st Period (10:15 – 11:00)",
    availability_status: "Free",
  },
  {
    teacher_id: "T-06",
    teacher_name: "Ms. Anita Poudel",
    subject: "Software Engineering",
    period: "6th Period (2:00 – 2:45)",
    availability_status: "Busy",
  },
];

export const initialTeacherRequests: TeacherRequest[] = [
  {
    request_id: "TR-3001",
    class_name: CURRENT_CLASS,
    teacher_id: "T-01",
    period: "2nd Period (11:00 – 11:45)",
    status: "Pending",
  },
  {
    request_id: "TR-3002",
    class_name: "BICTE 3rd Semester — Section B",
    teacher_id: "T-01",
    period: "2nd Period (11:00 – 11:45)",
    status: "Accepted",
  },
  {
    request_id: "TR-3003",
    class_name: "BICTE 1st Semester — Section A",
    teacher_id: "T-05",
    period: "1st Period (10:15 – 11:00)",
    status: "Pending",
  },
  {
    request_id: "TR-3004",
    class_name: "BICTE 7th Semester",
    teacher_id: "T-03",
    period: "4th Period (12:30 – 1:15)",
    status: "Declined",
  },
];

export const initialIdentityCards: IdentityCard[] = [
  {
    card_id: "MMC-ID-4021",
    student_name: CURRENT_STUDENT,
    student_id: CURRENT_STUDENT_ID,
    program: PROGRAM,
    semester: "5th Semester",
    status: "Ready",
  },
  {
    card_id: "MMC-ID-4022",
    student_name: "Nisha Ghimire",
    student_id: "BICTE-079-021",
    program: PROGRAM,
    semester: "5th Semester",
    status: "Not Ready",
  },
  {
    card_id: "MMC-ID-4023",
    student_name: "Sujan Bhandari",
    student_id: "BICTE-080-007",
    program: PROGRAM,
    semester: "3rd Semester",
    status: "Collected",
  },
  {
    card_id: "MMC-ID-4024",
    student_name: "Pooja Lamichhane",
    student_id: "BICTE-080-011",
    program: PROGRAM,
    semester: "3rd Semester",
    status: "Ready",
  },
  {
    card_id: "MMC-ID-4025",
    student_name: "Bibek Syangtan",
    student_id: "BICTE-081-002",
    program: PROGRAM,
    semester: "1st Semester",
    status: "Not Ready",
  },
];
