import { Application, ApplicationStatus } from '@/types';

export const mockApplications: Application[] = [
  {
    id: '1',
    company: 'TechCorp',
    role: 'Senior Frontend Developer',
    description: 'Building modern web applications with React and TypeScript',
    location: 'San Francisco, CA',
    jobLink: 'https://example.com/job1',
    salaryRange: '$120k - $160k',
    appliedDate: '2024-01-15',
    status: 'interview',
    notes: 'Great company culture, interesting projects',
    interviews: [
      {
        id: '1',
        type: 'Technical Interview',
        date: '2024-01-25',
        interviewer: 'John Smith',
        notes: 'Focus on React patterns and system design'
      },
      {
        id: '2',
        type: 'System Design',
        date: '2024-02-01',
        interviewer: 'Jane Doe',
        notes: 'Design a job tracking system'
      }
    ],
    tags: ['react', 'typescript', 'frontend'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    company: 'StartupXYZ',
    role: 'Full Stack Engineer',
    description: 'End-to-end development of web applications',
    location: 'Remote',
    jobLink: 'https://example.com/job2',
    salaryRange: '$100k - $140k',
    appliedDate: '2024-01-10',
    status: 'applied',
    notes: 'Remote-first company, good work-life balance',
    tags: ['nodejs', 'react', 'mongodb'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    company: 'Enterprise Inc',
    role: 'Frontend Developer',
    description: 'Maintaining and improving enterprise web applications',
    location: 'New York, NY',
    jobLink: 'https://example.com/job3',
    salaryRange: '$90k - $120k',
    appliedDate: '2024-01-05',
    status: 'rejected',
    notes: 'Not a good culture fit based on interview',
    interviews: [
      {
        id: '3',
        type: 'HR Screening',
        date: '2024-01-08',
        interviewer: 'HR Team',
        notes: 'Basic screening call'
      }
    ],
    tags: ['angular', 'javascript', 'enterprise'],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z'
  },
  {
    id: '4',
    company: 'CloudTech',
    role: 'React Developer',
    description: 'Building cloud-based applications',
    location: 'Seattle, WA',
    jobLink: 'https://example.com/job4',
    salaryRange: '$110k - $150k',
    appliedDate: '2024-01-20',
    status: 'offer',
    notes: 'Great team, competitive offer',
    interviews: [
      {
        id: '4',
        type: 'Technical Interview',
        date: '2024-01-22',
        interviewer: 'Tech Lead',
        notes: 'React and TypeScript focus'
      },
      {
        id: '5',
        type: 'Final Interview',
        date: '2024-01-24',
        interviewer: 'Engineering Manager',
        notes: 'Team fit and career discussion'
      }
    ],
    tags: ['react', 'typescript', 'cloud'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z'
  },
  {
    id: '5',
    company: 'DevShop',
    role: 'Senior TypeScript Developer',
    description: 'Consulting and development services',
    location: 'Austin, TX',
    jobLink: 'https://example.com/job5',
    salaryRange: '$130k - $170k',
    appliedDate: '2024-01-18',
    status: 'wishlist',
    notes: 'Interesting consulting work, flexible hours',
    tags: ['typescript', 'consulting', 'fullstack'],
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  }
];

export const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'accepted', label: 'Accepted' }
];
