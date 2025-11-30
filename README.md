# Agency Dash

A dashboard application for managing agencies and contacts. This project demonstrates user authentication, data visualization, and rate limiting using modern web technologies.

## Overview

This application allows authenticated users to view agencies and contacts in tabular format. Agencies can be viewed without limits, while contacts are rate-limited to 50 views per day. When the limit is exceeded, users are prompted to upgrade their plan.

## Features

- **User Authentication**: Secure login and signup using Clerk.
- **Agencies Table**: View all agencies with details like name, state, type, population, and contact information.
- **Contacts Table**: View employee contacts with rate limiting (50 per day).
- **Rate Limiting**: Tracks daily contact views and displays progress.
- **Upgrade Prompt**: Modal to encourage plan upgrades when limits are reached.
- **Search and Pagination**: Filter and navigate through data efficiently.
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop compatibility.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: Prisma with PostgreSQL
- **Styling**: Tailwind CSS and Shadcn Ui
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Repository**: GitHub

## System Design

The application follows a modular architecture:

- **Frontend**: Next.js pages for dashboard, agencies, and contacts.
- **Backend**: Server-side functions for data fetching and rate limiting.
- **Database**: Prisma ORM for data management.
- **Authentication**: Clerk handles user sessions and redirects.

### Diagram

```
[User] -> [Clerk Auth] -> [Dashboard]
                    |
                    v
[Agencies Page] <- [Prisma] -> [Contacts Page (Rate Limited)]
                    |
                    v
            [PostgreSQL Database]
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NotAnsar/agency-dash
   cd agency-dash
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:

   ```
   DATABASE_URL="your-postgresql-connection-string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) and sign in.

## Usage

- Navigate to `/dashboard` after authentication.
- View agencies at `/dashboard/agencies`.
- View contacts at `/dashboard/contacts` (limited to 50/day).
- Use search and pagination to filter data.

## Deployment

Deploy to Vercel:

1. Connect your GitHub repo to Vercel.
2. Add environment variables in Vercel dashboard.
3. Deploy automatically on push.
