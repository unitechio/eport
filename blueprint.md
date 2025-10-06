
# InfraCRM Application Blueprint

## Overview

InfraCRM is a comprehensive dashboard for managing and monitoring infrastructure. It provides a centralized interface for viewing server statuses, managing configurations, and analyzing system-wide audit logs.

## Project Structure & Design

The application is built with Next.js and follows the App Router paradigm.

*   **Styling:** Styled with Tailwind CSS for a modern, utility-first approach.
*   **Components:** Utilizes Shadcn UI components, which are accessible and easily customizable.
*   **Structure:** The main application code, including all routes and components, is located within the `src/` directory.

### Key Features Implemented:

*   **Authentication:** A login page and authentication guards are in place to secure the dashboard.
*   **Dashboard Overview:** A central dashboard provides an at-a-glance view of the entire system.
*   **Server Management:** Features for listing, viewing details of, and configuring servers.
*   **Audit Logging:** A system for viewing and auditing important system events.

## Current Plan: Fix Project Structure Conflict

*   **Goal:** Resolve a `TypeError: Cannot read properties of undefined (reading 'call')` runtime error.
*   **Diagnosis:** The error is likely caused by a project structure conflict, with two `app` directories (one at the root, one in `src/`).
*   **Action:**
    1.  Delete the redundant `app` directory at the project root to consolidate all routing within `src/app`.
    2.  Run the linter to check for any remaining issues.

