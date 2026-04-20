export type ApplicationStatus = 'WISHLIST' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'ACCEPTED';

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
  notes?: string;
}

export interface UpdateApplicationDto {
  company?: string;
  jobTitle?: string;
  description?: string;
  location?: string;
  jobLink?: string;
  salaryRange?: string;
  status?: ApplicationStatus;
  notes?: string;
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
  statusDistribution: Record<ApplicationStatus, number>;
  applicationTrends: { date: string; count: number }[];
  companyStats: { company: string; count: number }[];
  interviewRate: number;
  offerRate: number;
}
