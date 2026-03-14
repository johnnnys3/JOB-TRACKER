export type ApplicationStatus = "applied" | "interview" | "offer" | "rejected" | "withdrawn";

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  jobLink?: string;
  salaryRange?: string;
  notes?: string;
  tags?: string[];
  interviews?: Interview[];
  timeline?: TimelineEvent[];
}

export interface Interview {
  id: string;
  date: string;
  type: string;
  interviewer?: string;
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  event: string;
  description?: string;
}
