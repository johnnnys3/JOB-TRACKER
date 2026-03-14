You are a senior product designer and frontend engineer.

Your task is to design and implement the UI for a **Job Tracker web application** using the **attached reference image as visual inspiration**.

Do NOT copy the image exactly. Instead, analyze it and extract:

* layout structure
* spacing system
* color palette
* typography hierarchy
* component styles
* interaction patterns

Use those design cues to create a **modern productivity dashboard UI**.

---

PROJECT CONTEXT

The product is a **Job Application Tracker** that allows users to manage and monitor their job applications.

Users should be able to:

* track job applications
* update application status
* view analytics
* manage interview stages

The UI must feel similar to productivity tools like:

Linear
Notion
Vercel dashboard
Trello

Focus on **clarity, hierarchy, and efficiency**.

---

TECH STACK

Implement the UI using:

Next.js (App Router)
TypeScript
TailwindCSS
React components

Use reusable component architecture.

---

LAYOUT STRUCTURE

The application must include:

Sidebar navigation
Top navigation bar
Main content dashboard

Sidebar items:

Dashboard
Applications
Analytics
Settings

The sidebar should be collapsible.

---

DASHBOARD PAGE

The dashboard should include:

Top statistics cards:

Total Applications
Interviews
Offers
Rejections

Below the stats include:

Applications by status chart
Recent applications list
Upcoming interviews section

---

APPLICATIONS PAGE

Display job applications in a **table or card layout**.

Columns:

Company
Role
Status
Applied Date
Location
Actions

Each row should open a **detailed application page**.

Include:

filters
search
pagination

---

APPLICATION DETAIL PAGE

This page must display:

company name
role
status badge
application timeline
interview list
notes section
tags

Allow editing the status.

---

ADD APPLICATION FORM

Form fields:

Company
Role
Location
Job link
Salary range
Application date
Status
Notes
Tags

The form should appear in a modal or dedicated page.

---

DESIGN REQUIREMENTS

Follow these design principles:

minimal UI
clean spacing
consistent grid
clear visual hierarchy

Use:

rounded cards
subtle shadows
soft borders
modern typography

Spacing should follow an **8px grid system**.

---

COMPONENT SYSTEM

Create reusable components such as:

Sidebar
Topbar
StatCard
ApplicationCard
StatusBadge
ApplicationTable
SearchInput
FilterDropdown
Modal
FormInput

Each component must be modular.

---

COLOR SYSTEM

Use a neutral productivity palette:

background: light gray or dark mode capable
primary accent: blue or indigo
status colors:

applied → blue
interview → yellow
offer → green
rejected → red

---

INTERACTION REQUIREMENTS

Hover states for clickable elements
Loading skeletons for API calls
Empty states for no applications
Clear success/error messages

---

OUTPUT FORMAT

Return:

1. Page layouts
2. Component hierarchy
3. Reusable UI components
4. Tailwind styling
5. TypeScript React components

Ensure the UI is **clean, scalable, and production-ready**.

The design must adapt well to desktop screens.
