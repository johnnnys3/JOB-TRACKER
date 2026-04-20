export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected' | 'accepted';

export interface Interview {
  id: string;
  type: string;
  date: string;
  interviewer?: string;
  notes?: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  description?: string;
  location?: string;
  jobLink?: string;
  salaryRange?: string;
  appliedDate: string;
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
