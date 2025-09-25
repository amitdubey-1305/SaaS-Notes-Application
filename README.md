

https://saa-s-notes-application-96yo.vercel.app/

---

## 🔑 Demo Login

To explore the application, please use the following credentials for the "Acme" company tenant. The password for all test accounts is `password`.

-  
    -   **Email:** `admin@acme.test`
    -   **Password:** `password`
-   
    -   **Email:** `user@acme.test`
    -   **Password:** `password`

---

## About The Project

This is a complete, full-stack, multi-tenant SaaS (Software as a Service) application built to fulfill the requirements of a development challenge. The application is deployed on Vercel and allows multiple companies (tenants) to securely manage their users and notes while enforcing role-based access control and subscription limits.

### Tech Stack

-   **Frontend:** React (Vite), Axios
-   **Backend:** Node.js, Express.js
-   **Database:** Vercel Postgres (PostgreSQL)
-   **ORM:** Prisma
-   **Authentication:** JSON Web Tokens (JWT)
-   **Deployment:** Vercel

### Core Features Implemented

* **Multi-Tenancy:** Securely supports multiple tenants (e.g., Acme, Globex) with strict data isolation.
* **Authentication:** Implements a robust JWT-based login system.
* **Role-Based Access Control (RBAC):** Differentiates between 'Admin' and 'Member' roles, granting different permissions (e.g., only Admins can upgrade subscriptions).
* **CRUD API:** A full suite of API endpoints for creating, reading, updating, and deleting notes, with all operations respecting tenant isolation.
* **Subscription Gating:** Enforces a note limit for tenants on the "Free" plan and provides an admin-only endpoint to upgrade to a "Pro" plan.
* **Deployment:** The entire monorepo is configured for and successfully deployed on Vercel, with the backend running as a serverless function and the frontend served as a static site. The deployment includes automated database migrations and seeding.

### Multi-Tenancy Approach

The **Shared Schema with a Tenant ID** approach was chosen for this project.

**Reasoning:** This is a highly efficient and scalable approach for applications of this size. It simplifies database management and maintenance by having all tenants share the same tables, while still allowing for strong data isolation at the application level.

**Implementation:** Data isolation is strictly enforced by adding a `tenantId` column to all tenant-specific tables (`User` and `Note`). Every database query on the backend is filtered by the `tenantId` of the authenticated user, which is extracted from their JWT. This guarantees that a user from one company can never see, edit, or delete data belonging to another company.
