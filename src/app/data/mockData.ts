import { Application } from "../types";

export const mockApplications: Application[] = [
  {
    id: "1",
    company: "Google",
    role: "Senior Frontend Engineer",
    location: "Mountain View, CA",
    status: "interview",
    appliedDate: "2026-03-01",
    jobLink: "https://careers.google.com",
    salaryRange: "$150k - $200k",
    notes: "Really excited about this opportunity. Team seems great.",
    tags: ["frontend", "react", "typescript"],
    interviews: [
      {
        id: "i1",
        date: "2026-03-20",
        type: "Technical Screen",
        interviewer: "Sarah Chen",
        notes: "Went well, discussed React architecture"
      }
    ],
    timeline: [
      { id: "t1", date: "2026-03-01", event: "Applied", description: "Submitted application" },
      { id: "t2", date: "2026-03-05", event: "Recruiter Call", description: "Initial screening call" },
      { id: "t3", date: "2026-03-20", event: "Technical Interview", description: "First round technical" }
    ]
  },
  {
    id: "2",
    company: "Meta",
    role: "Product Engineer",
    location: "Menlo Park, CA",
    status: "applied",
    appliedDate: "2026-03-10",
    jobLink: "https://careers.meta.com",
    salaryRange: "$140k - $190k",
    tags: ["fullstack", "react", "graphql"],
    timeline: [
      { id: "t1", date: "2026-03-10", event: "Applied", description: "Submitted application" }
    ]
  },
  {
    id: "3",
    company: "Stripe",
    role: "Frontend Developer",
    location: "San Francisco, CA",
    status: "offer",
    appliedDate: "2026-02-15",
    jobLink: "https://stripe.com/jobs",
    salaryRange: "$160k - $210k",
    notes: "Received offer! Need to respond by March 25th",
    tags: ["frontend", "typescript", "payments"],
    interviews: [
      {
        id: "i1",
        date: "2026-02-28",
        type: "Technical Screen",
        interviewer: "John Smith"
      },
      {
        id: "i2",
        date: "2026-03-08",
        type: "Onsite - System Design",
        interviewer: "Emily Johnson"
      },
      {
        id: "i3",
        date: "2026-03-08",
        type: "Onsite - Coding",
        interviewer: "Michael Brown"
      }
    ],
    timeline: [
      { id: "t1", date: "2026-02-15", event: "Applied" },
      { id: "t2", date: "2026-02-20", event: "Recruiter Call" },
      { id: "t3", date: "2026-02-28", event: "Technical Screen" },
      { id: "t4", date: "2026-03-08", event: "Onsite Interview" },
      { id: "t5", date: "2026-03-12", event: "Offer Received" }
    ]
  },
  {
    id: "4",
    company: "Airbnb",
    role: "Software Engineer",
    location: "Remote",
    status: "rejected",
    appliedDate: "2026-02-20",
    tags: ["fullstack", "react"],
    timeline: [
      { id: "t1", date: "2026-02-20", event: "Applied" },
      { id: "t2", date: "2026-03-01", event: "Rejected", description: "Moving forward with other candidates" }
    ]
  },
  {
    id: "5",
    company: "Netflix",
    role: "UI Engineer",
    location: "Los Gatos, CA",
    status: "interview",
    appliedDate: "2026-02-25",
    salaryRange: "$155k - $205k",
    tags: ["frontend", "react", "streaming"],
    interviews: [
      {
        id: "i1",
        date: "2026-03-18",
        type: "Phone Screen",
        interviewer: "Alex Martinez"
      }
    ],
    timeline: [
      { id: "t1", date: "2026-02-25", event: "Applied" },
      { id: "t2", date: "2026-03-10", event: "Recruiter Response" },
      { id: "t3", date: "2026-03-18", event: "Phone Screen" }
    ]
  },
  {
    id: "6",
    company: "Vercel",
    role: "Frontend Engineer",
    location: "Remote",
    status: "applied",
    appliedDate: "2026-03-12",
    salaryRange: "$140k - $180k",
    tags: ["frontend", "nextjs", "react"],
    timeline: [
      { id: "t1", date: "2026-03-12", event: "Applied" }
    ]
  },
  {
    id: "7",
    company: "Figma",
    role: "Product Engineer",
    location: "San Francisco, CA",
    status: "interview",
    appliedDate: "2026-03-05",
    salaryRange: "$150k - $200k",
    tags: ["frontend", "typescript", "design-tools"],
    interviews: [
      {
        id: "i1",
        date: "2026-03-25",
        type: "Technical Interview",
        interviewer: "To be scheduled"
      }
    ],
    timeline: [
      { id: "t1", date: "2026-03-05", event: "Applied" },
      { id: "t2", date: "2026-03-12", event: "Recruiter Call" }
    ]
  },
  {
    id: "8",
    company: "Shopify",
    role: "Senior Developer",
    location: "Toronto, ON",
    status: "applied",
    appliedDate: "2026-03-08",
    salaryRange: "$130k - $170k",
    tags: ["fullstack", "ruby", "react"],
    timeline: [
      { id: "t1", date: "2026-03-08", event: "Applied" }
    ]
  }
];
