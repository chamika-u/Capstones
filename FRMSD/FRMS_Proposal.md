# Faculty Resource Management System (FRMS) — Project Proposal

**Faculty of Computing, University of Sri Jayewardenepura**  
**Capstone Project (IS 4110)**  
**Group: FRMS Team**

---

## Approval of Capstone Project

1. Title of the Capstone Project:  
   **Faculty Resource Management System (FRMS)** — A Timetable-Authoritative Booking and Allocation System

2. Details of Group Members:

| Index No | Name with Initials | Email | Mobile No | Signature |
|----------|-------------------|-------|-----------|-----------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

3. Name of Mentor: ___________________________________  
4. Mentor's Designation: _____________________________  
5. Mentor's Organization: _____________________________

**For office use only:**  
Approved / Not approved: ________________  
Signature of Mentor: ______________________  
Date: ______________________  
Suggestions: __________________________________________________

---

## Index

1. Introduction & Objective ............................................................ 3  
2. Analysis (Feasibility Study, ER Diagrams, DFD) .............................. 4  
3. Hardware and Software Requirements ............................................ 6  
4. Tables and Structure, Number of Modules, Details of Modules .............. 7  
5. Proposed System (Functional & Non-Functional Requirements) .............. 9  
6. Modules Split-up and Gantt Chart .............................................. 12  
7. Cost Analysis ........................................................................... 13  
8. References .............................................................................. 13  

---

## 1. Introduction & Objective

### 1.1 Introduction

The Faculty of Computing manages a limited pool of physical resources — lecture halls, computer laboratories, seminar rooms, equipment, and faculty vehicles. Currently, allocation is handled through informal, paper-based requests or ad-hoc spreadsheets. This leads to double-bookings, lecturer timetable clashes, untracked maintenance outages, and no authoritative record of who used what and when.

Group 15's prior project (UniLink/URMS) addressed resource booking as a single-layer workflow: *submit request → admin approves → notified*. It treated the timetable as just another bookable resource, modelled only rooms as constrained entities, and did not define differentiated approval workflows, equipment issue/return lifecycles, maintenance blackout windows, or audit logs for overrides.

This project builds a **Faculty Resource Management System (FRMS)** that introduces a **two-layer model**:

1. **Timetable Layer** — The admin builds and locks the semester timetable (course, lecturer, resource, day, time range). The timetable is the *authoritative source of truth*.
2. **Booking Layer** — All ad-hoc bookings are validated against the locked timetable before approval.

The novelty is not "online booking instead of paper" — that exists already. The novelty is **timetable authority**: a booking can never override a scheduled lecture, a lecturer cannot be double-assigned, and maintenance windows block bookings by design.

### 1.2 Objectives

1. To design and implement a web-based system for managing faculty resources with role-based access control.
2. To implement a timetable-authority engine that validates all ad-hoc bookings against the locked semester timetable.
3. To detect and prevent resource conflicts (room clashes, lecturer double-assignment, maintenance blackouts) at the point of booking.
4. To implement a differentiated approval matrix per resource type (rooms, labs, equipment, vehicles).
5. To manage equipment issue/return lifecycle with condition tracking.
6. To maintain an audit log of approvals, overrides, maintenance blocks, and timetable changes.
7. To produce usage reports and analytics for faculty resource planning.

### 1.3 Scope

**In scope:**
- Faculty of Computing resources only (lecture halls, labs, seminar rooms, equipment, vehicles).
- Timetable creation, editing (pre-lock), locking, and viewing.
- Ad-hoc booking requests with conflict validation.
- Role-based dashboards (Admin, Lecturer, Technician, Student).
- Equipment issue/return with condition recording.
- Maintenance ticketing with blackout windows.
- Audit log and reporting.

**Out of scope:**
- University-wide rollout (Phase 2-style expansion). Scope is deliberately limited to one faculty for feasibility within 15 weeks.
- Real-time WebSocket notifications; email/SMS integration may be added as future work.
- Seat-level or desk-level granularity; bookings are per-resource per-time-slot.
- AI-driven scheduling or optimization.

---

## 2. Analysis

### 2.1 Feasibility Study

**Technical Feasibility:** The proposed stack (Next.js, Node.js/Express, MySQL, Prisma, Firebase Auth) uses well-documented technologies with strong community support. The core conflict-detection logic is implemented as standard relational queries and Express middleware — no novel algorithms required.

**Operational Feasibility:** The system digitizes existing paper-based processes without changing faculty policy. Training requirements are minimal due to role-specific dashboards.

**Economic Feasibility:** Zero licensing cost. Deployment on free tiers (Vercel, Render, PlanetScale) is sufficient for demonstration and pilot use.

**Schedule Feasibility:** The two-layer scope is achievable by a 5-member student team within one semester (15 weeks), as validated by the Gantt chart in Section 6.

### 2.2 Comparison with Prior Work (Group 15 — UniLink/URMS)

| Dimension | Group 15 URMS | This Project (FRMS) | Novelty Assessment |
|-----------|---------------|---------------------|--------------------|
| Core model | One-layer: request → approve → booked | Two-layer: timetable (locked) → booking validated against it | **Real** |
| Timetable | Not modelled | Central module with clash detection at entry | **Real** |
| Conflict rule | "Prevent double bookings" (undefined) | Explicit: room clash, lecturer double-assignment, blackout, timetable lock | **Real** |
| Approval | Single vague admin rule | Approval matrix per resource type | **Real** |
| Equipment | Data model only | Issue/return lifecycle with condition tracking | Partial |
| Maintenance | Log & track status | Ticket + blackout window blocking bookings | Partial |
| Audit | Vague mention | Explicit audit log with reason capture | **Real** |
| Scope | Phase 1 + unrealistic Phase 2 university-wide | Faculty-only, honest MVP | **Real** (feasibility) |

**What is NOT novel (do not claim as contribution):** web-based booking, role-based access, Firebase Auth, Next.js/Express/MySQL stack, notifications, search & filter, reports dashboard. These match Group 15 and are baseline expectations.

### 2.3 Entity-Relationship (ER) Model (Summary)

Core entities and relationships:

- **User** (id, email, role, name, department) — 1:N with Booking, MaintenanceTicket, EquipmentAllocation.
- **Resource** (id, name, type, capacity, location, status) — 1:N with TimetableSlot, Booking, MaintenanceWindow, EquipmentAllocation.
- **TimetableSlot** (id, courseCode, lecturerId, resourceId, day, startTime, endTime, weekRange, isLocked) — N:1 Resource, N:1 User (lecturer).
- **Booking** (id, resourceId, requesterId, purpose, startTime, endTime, date, status, approvedBy, approvedAt, conflictCheckResult) — N:1 Resource, N:1 User.
- **MaintenanceWindow** (id, resourceId, start, end, reason, createdBy) — N:1 Resource.
- **EquipmentAllocation** (id, equipmentId, issuedTo, issuedBy, issuedAt, returnedAt, conditionOnIssue, conditionOnReturn) — N:1 Resource, N:1 User.
- **AuditLog** (id, actorId, action, targetType, targetId, oldValue, newValue, reason, timestamp).

**Key distinction from URMS:** `TimetableSlot` and `Booking` are separate entities that both reference `Resource`. `Lecturer` participates in conflict constraints (a lecturer cannot have two overlapping slots/bookings). In URMS, lecturer was not modelled as a constrained resource.

### 2.4 Data Flow Diagram (DFD) — Level 0 Summary

1. **Admin** → Timetable Management → TimetableSlot store → Lock timetable.
2. **Lecturer / Student** → Booking Request → Conflict Engine (validates against TimetableSlot + MaintenanceWindow) → Booking store (pending).
3. **Approver (per matrix)** → Approve/Reject → Booking store + Notification.
4. **Technician** → Equipment Issue/Return → EquipmentAllocation store.
5. **Admin** → Audit Log → read-only trail of all actions.

---

## 3. Hardware and Software Requirements

### 3.1 Hardware Requirements

| Component | Minimum Specification |
|-----------|----------------------|
| Development workstations | 4 GB RAM, dual-core CPU, 100 GB disk |
| Server (deployment) | Cloud free tier: 512 MB–1 GB RAM, 1 vCPU |
| Client devices | Any modern browser (Chrome, Firefox, Edge) |

### 3.2 Software Requirements

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js (React), Tailwind CSS | Role-based dashboards, booking forms, calendar views |
| Backend | Node.js, Express.js | REST API, conflict-detection engine, approval middleware |
| Database | MySQL | Relational integrity for timetable, resources, bookings |
| ORM | Prisma | Type-safe MySQL access, migrations |
| Authentication | Firebase Authentication | Secure login, custom claims for RBAC |
| Hosting | Vercel (frontend), Render (backend), PlanetScale (MySQL) | Zero-cost production-grade deployment |
| Version Control | Git + GitHub | Source control, CI via GitHub Actions |

---

## 4. Tables and Structure, Number of Modules, Details of Modules

### 4.1 Number of Modules

**10 modules**, each tied to a specific business rule (not generic names):

| # | Module | Business Rule It Implements |
|---|--------|---------------------------|
| 1 | User Management & RBAC | BR-01: Role-based access (Admin, Lecturer, Technician, Student) |
| 2 | Timetable Authority | BR-02: Admin builds/locks semester timetable; locked slots are immutable |
| 3 | Resource Catalogue | BR-03: Resources classified by type (room, lab, equipment, vehicle) |
| 4 | Booking & Conflict Validation | BR-04: Every booking validated against timetable + blackout before approval |
| 5 | Approval Matrix | BR-05: Differentiated approvers per resource type |
| 6 | Equipment Issue/Return | BR-06: Equipment lifecycle with condition on issue and return |
| 7 | Maintenance Management | BR-07: Maintenance window blocks overlapping bookings |
| 8 | Audit & Compliance | BR-08: Immutable audit log for approvals, overrides, blocks |
| 9 | Reporting & Analytics | BR-09: Usage reports per resource, per lecturer, per period |
| 10 | Notification Service | BR-10: Status change notifications (approve/reject/blackout) |

### 4.2 Key Business Rules

| ID | Rule |
|----|------|
| BR-01 | A user may only access features permitted by their Firebase custom-claim role. |
| BR-02 | Once a timetable is locked, no TimetableSlot may be edited or deleted without an audit-recorded override. |
| BR-03 | No two TimetableSlots may overlap for the same Resource. |
| BR-04 | No two TimetableSlots or Bookings may overlap for the same Lecturer. |
| BR-05 | No Booking may overlap a MaintenanceWindow for the same Resource. |
| BR-06 | Room bookings require Admin approval; Lab bookings require Technician clearance then Admin; Equipment/Vehicle require clearance then Admin. |
| BR-07 | Equipment cannot be issued if already allocated or under maintenance. |
| BR-08 | Every approval, rejection, override, and maintenance block must create an AuditLog entry with reason. |
| BR-09 | Timetable authority takes precedence over ad-hoc booking at all times. |

---

## 5. Proposed System

### 5.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| F-01 | User registration/login with Firebase Auth; role assignment via custom claims. | High |
| F-02 | Admin can create, edit, and lock semester timetable slots. | High |
| F-03 | System prevents overlapping timetable slots for same resource/lecturer. | High |
| F-04 | Lecturer/Student submits booking request with resource, date, time, purpose. | High |
| F-05 | System auto-validates booking against timetable, lecturer schedule, and maintenance blackout. | High |
| F-06 | Routing of approval requests per resource-type approval matrix. | High |
| F-07 | Approver can approve/reject with reason; decision recorded in audit log. | High |
| F-08 | Technician records equipment issue and return with condition notes. | Medium |
| F-09 | Admin creates maintenance windows; overlapping bookings are blocked. | Medium |
| F-10 | Admin views audit log of all approvals, overrides, and maintenance actions. | Medium |
| F-11 | Reports: resource utilization, lecturer load, booking success/failure rates. | Medium |
| F-12 | Users receive notification on booking status change. | Low |

### 5.2 Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NF-01 | Stateless backend: no server-side session storage; auth via Firebase JWT. |
| NF-02 | All data structures validated before processing (Pydantic-equivalent validation layer in Node/Prisma). |
| NF-03 | Page load time < 3 seconds for dashboard and booking forms. |
| NF-04 | Concurrent booking requests handled without race conditions (database transactions). |
| NF-05 | Audit log is append-only; entries cannot be edited or deleted. |
| NF-06 | System accessible via standard browsers; responsive on tablet/desktop. |

### 5.3 Methodology

Agile-inspired, iterative development over 15 weeks:
1. **Weeks 1–2:** Requirements finalization, ER diagram, tech stack setup, Firebase/Auth scaffolding.
2. **Weeks 3–5:** Timetable module, Resource catalogue, conflict engine core.
3. **Weeks 6–8:** Booking module, approval matrix, equipment issue/return.
4. **Weeks 9–11:** Maintenance, audit log, reporting, UI polish.
5. **Weeks 12–13:** Integration testing, UAT with faculty stakeholders.
6. **Weeks 14–15:** Documentation, final demo, report writing.

---

## 6. Modules Split-up and Gantt Chart

### 6.1 Suggested Module Split-up (5 members)

| Member | Primary Focus | Supporting |
|--------|--------------|------------|
| Member A (Backend-capable) | Express API, Prisma schema, conflict engine, MySQL | Auth integration |
| Member B (Frontend-capable) | Next.js dashboards, booking forms, calendar UI | Module C on UI components |
| Member C | Equipment module, maintenance module, reporting views | Module B on shared components |
| Member D | Auth/RBAC, audit log, notifications | Module A on API testing |
| Member E | Documentation, ER/DFD diagrams, UAT test cases, report | All modules on testing |

> **Risk note:** Backend effort is concentrated on Member A. Mitigation: fewer modules than URMS, CSV import for initial data, no WebSockets, no real-time features. This is a deliberate scope control, not a weakness.

### 6.2 Gantt Chart (Week 1–15)

```
Phase            W1 W2 W3 W4 W5 W6 W7 W8 W9 W10 W11 W12 W13 W14 W15
Requirements     ████
Setup & Auth     ████████
Timetable                 ████████
Booking                  ██████████
Equipment/Maint                  ████████
Audit & Reporting                       ████████
Testing & UAT                                   ████████
Doc & Demo                                         ████████
```

---

## 7. Cost Analysis

| Item | Cost (LKR/USD) | Notes |
|------|---------------|-------|
| Domain (optional) | ~2,000 LKR / $7 per year | Optional; can use Vercel/Render subdomains |
| Hosting (Vercel + Render + PlanetScale) | $0 | Free tiers sufficient for pilot |
| Development tools | $0 | GitHub, Firebase Spark plan |
| Total estimated | ~2,000 LKR / $7 | Minimal; student-budget friendly |

---

## 8. References

1. Group 15 (UniLink/URMS) Capstone Proposal, Faculty of Computing — prior work for comparison.  
2. Next.js Documentation — https://nextjs.org/docs  
3. Prisma ORM Documentation — https://www.prisma.io/docs  
4. Firebase Authentication Documentation — https://firebase.google.com/docs/auth  
5. Faculty of Computing — Guidelines for Capstone Project (IS 4110) & Mini Project (SE5104).

---

**Prepared by:** FRMS Team  
**Date:** 2026-10-18  
**Version:** 1.0
