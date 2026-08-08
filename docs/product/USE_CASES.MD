# KP Enterprise Software — Use Cases & Authorization Rules

## Purpose

This document defines the official use cases, permissions, restrictions, and responsibilities for every user role within KP Enterprise Software.

This document serves as the source of truth for:

* System design
* Database design
* API development
* Access control
* Testing
* Security reviews

---

# User Roles

The platform supports five primary roles:

1. Visitor
2. Customer
3. Worker
4. Operations Admin
5. Super Admin

---

# Role Definitions

## Visitor

A public user who has not authenticated.

Visitors can:

* View services
* View portfolio articles
* View approved reviews
* Submit enquiries
* Register a customer account
* Contact the business

Visitors cannot:

* View projects
* View customer data
* View worker data
* Leave reviews
* Access any portal

---

## Customer

A paying customer with an authenticated account.

Customers can:

* View their own projects
* View project timelines
* View project milestones
* View customer-visible progress updates
* View customer-visible media
* Message the operations team on their projects
* Submit reviews
* Comment on their own reviews
* Update personal profile details

Customers cannot:

* View other customers' projects
* Assign workers
* Create projects
* Edit project status
* Access internal notes or worker submissions
* Message workers directly
* Access operational dashboards

---

## Worker

A welder, builder, technician, or contractor.

Workers can:

* View assigned projects
* View assigned tasks
* Update task status
* Upload internal progress photos (operations review)
* Submit internal work notes (operations review)
* Mark tasks complete
* View project instructions

Workers cannot:

* View unassigned projects
* Create projects
* Delete projects
* Access financial information
* Communicate with customers
* Access project messaging
* Publish customer-visible updates
* Approve reviews
* Manage users

---

## Operations Admin

Responsible for day-to-day business operations.

Operations Admins can:

* View enquiries
* Create projects
* Convert enquiries into projects
* Create customer records
* Assign workers
* Create tasks
* Manage project progress (including internal worker submissions)
* Upload customer-visible updates and media
* Moderate reviews
* Manage customer communication (messaging)

Operations Admins cannot:

* Modify Super Admin accounts
* Change system-wide permissions
* Delete audit records
* Access platform configuration settings

---

## Super Admin

System owner and highest authority.

Super Admins can:

* Perform all Operations Admin actions
* Create users
* Suspend users
* Change roles
* Configure system settings
* View all projects
* View business metrics
* Approve portfolio publications
* Manage platform-wide permissions

Super Admin restrictions:

* No restrictions except technical safeguards.

---

# Business Use Cases

---

# UC-001 Submit Enquiry

## Actor

Visitor

## Description

A visitor submits a request for a quote or service.

## Preconditions

* Visitor is on public website.

## Main Flow

1. Visitor completes enquiry form.
2. System validates submission.
3. System stores enquiry.
4. System assigns status = New.
5. System prompts visitor to create a customer account (optional).
6. Admin receives notification (future enhancement).

## Postconditions

* Enquiry exists in database.
* Visitor may register for portal access.

---

# UC-002 Convert Enquiry To Project

## Actor

Operations Admin

## Description

An enquiry becomes a real project.

## Preconditions

* Enquiry exists.
* Enquiry status = New or Qualified.

## Main Flow

1. Admin opens enquiry.
2. Admin reviews information.
3. Admin creates project.
4. System links customer.
5. Enquiry status becomes Converted.

## Postconditions

* Project exists.
* Customer account exists.

---

# UC-003 Assign Worker

## Actor

Operations Admin

## Description

Assign workers to a project.

## Preconditions

* Project exists.
* Worker account exists.

## Main Flow

1. Admin opens project.
2. Admin selects worker.
3. Admin assigns worker.
4. System records assignment.

## Postconditions

* Worker receives assignment.

---

# UC-004 Update Project Progress

## Actor

Worker

## Description

Worker submits internal progress information for operations review.

## Preconditions

* Worker assigned to project.

## Main Flow

1. Worker opens assigned project.
2. Worker uploads internal notes.
3. Worker uploads internal media.
4. Worker submits update.

## Postconditions

* Progress update stored as internal (`visibleToCustomer: false`).
* Operations admin can review and publish customer-visible updates separately.

---

# UC-005 View Project Progress

## Actor

Customer

## Description

Customer tracks work progress.

## Preconditions

* Customer owns project.

## Main Flow

1. Customer logs in.
2. Customer opens project.
3. System displays timeline.
4. System displays visible updates.

## Postconditions

* Customer informed of progress.

---

# UC-006 Submit Review

## Actor

Customer

## Description

Customer reviews completed work.

## Preconditions

* Project completed.

## Main Flow

1. Customer opens review form.
2. Customer enters rating.
3. Customer enters comments.
4. Review saved.
5. Review status = Pending Approval.

## Postconditions

* Review awaiting moderation.

---

# UC-007 Customer Self-Registration

## Actor

Visitor (becomes Customer)

## Description

A visitor creates a customer portal account to track quotes and communicate with operations.

## Preconditions

* Visitor has a valid email address not already registered.

## Main Flow

1. Visitor opens registration page (often after submitting an enquiry).
2. Visitor enters name, email, password, and optional phone.
3. System validates input and creates `customers` and `users` records.
4. System returns a login token.

## Postconditions

* Customer can access the Client Portal.
* Customer record exists and is linked to the user account.

---

# UC-008 Customer ↔ Operations Messaging

## Actor

Customer, Operations Admin

## Description

Customer and operations admin exchange project messages. Workers do not participate.

## Preconditions

* Customer owns the project.
* Operations admin has access to the project.

## Main Flow

1. Customer or operations admin sends a project message.
2. The other party replies in the project thread.
3. Each party may edit their own messages.

## Postconditions

* Messages stored with `authorRole` of `customer` or `ops_admin`.
* Workers cannot read or write messages.

---

# UC-009 Moderate Review

## Actor

Operations Admin

## Description

Admin approves or rejects review.

## Preconditions

* Review exists.

## Main Flow

1. Admin opens review.
2. Admin evaluates content.
3. Admin approves or rejects.

## Postconditions

* Review published or hidden.

---

# Data Visibility Rules

## Project Visibility

Customer:

* Own projects only

Worker:

* Assigned projects only

Operations Admin:

* All projects

Super Admin:

* All projects

---

## Task Visibility

Customer:

* None

Worker:

* Assigned tasks

Operations Admin:

* All tasks

Super Admin:

* All tasks

---

## Review Visibility

Visitor:

* Approved reviews only

Customer:

* Own reviews

Operations Admin:

* All reviews

Super Admin:

* All reviews

---

## Media Visibility

Customer:

* Customer-visible media only

Worker:

* All media on assigned projects (including internal submissions)

Operations Admin:

* All project media

Super Admin:

* All project media

---

## Message Visibility

Customer:

* Messages from customer and operations admin only (legacy worker messages hidden)

Worker:

* No access to project messages

Operations Admin:

* All project messages

Super Admin:

* All project messages

---

# Security Principles

The system must enforce:

## Least Privilege

Users receive only the permissions required to perform their duties.

## Role-Based Access Control

Every protected endpoint must verify:

* Authentication
* User role
* Resource ownership where applicable

## Ownership Validation

Customers may only access resources belonging to them.

Workers may only access resources assigned to them.

## Auditability

The system should record:

* Project creation
* Assignment changes
* Status changes
* Review moderation actions
* User role changes

---

# MVP Scope Enforcement

Included in MVP:

* Authentication
* Customer self-registration
* Enquiries
* Projects
* Worker assignments
* Internal worker progress updates
* Operations-published customer visibility
* Customer ↔ operations messaging
* Reviews

Excluded from MVP:

* Payments
* Inventory management
* Payroll
* Analytics dashboards
* Marketing automation
* AI features

These features belong to future releases.
