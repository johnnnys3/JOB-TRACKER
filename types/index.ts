export type ApplicationStatus = 'WISHLIST' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'ACCEPTED';

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ACCEPTED', label: 'Accepted' },
];

export interface Interview {
  id: string;
  stage: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  company: string;
  jobTitle: string;
  description?: string;
  location?: string;
  jobLink?: string;
  salaryRange?: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes?: string;
  interviews?: Interview[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDto {
  company: string;
  jobTitle: string;
  description?: string;
  location?: string;
  jobLink?: string;
  salaryRange?: string;
  applicationDate: string;
  status?: ApplicationStatus;
  notes?: string;
}

export interface UpdateApplicationDto {
  company?: string;
  jobTitle?: string;
  description?: string;
  location?: string;
  jobLink?: string;
  salaryRange?: string;
  applicationDate?: string;
  status?: ApplicationStatus;
  notes?: string;
  tags?: string[];
}

export interface CreateInterviewDto {
  stage: string;
  date: string;
  notes?: string;
}

export interface UpdateInterviewDto {
  stage?: string;
  date?: string;
  notes?: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalApplications: number;
  interviews: number;
  offers: number;
  rejections: number;
  recentApplications: Application[];
  upcomingInterviews: (Interview & { company: string; role: string; applicationId: string })[];
}

export interface AnalyticsData {
  totalApplications: number;
  totalInterviews: number;
  applicationsByStatus: { status: ApplicationStatus; count: number }[];
  interviewsByStage: { stage: string; count: number }[];
  recentApplications: Pick<Application, 'id' | 'company' | 'jobTitle' | 'status' | 'applicationDate'>[];
  upcomingInterviews: (Interview & {
    application: Pick<Application, 'id' | 'company' | 'jobTitle'>;
  })[];
  statusDistribution: Partial<Record<ApplicationStatus, number>>;
  applicationTrends: { date: string; count: number }[];
  interviewRate: number;
  offerRate: number;
  activeApplications: number;
}
