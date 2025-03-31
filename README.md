# ABOps UI

ABOps is a modern SaaS platform designed to manage organizations, teams, and users through a unified management console. This project provides a clean, responsive UI with light/dark mode toggle and is built with modern web technologies.

## Project Overview

ABOps UI is built with:

- **Frontend**: Next.js, Tailwind CSS, and shadcn UI
- **Backend**: Supabase for database, authentication, and real-time functionalities
- **Containerization**: Docker Compose for production deployment

### Core Features

- **Centralized Management**: Manage organizations, teams, and users from one place
- **Authentication & User Management**: Login, sign-up, and role-based access control
- **Organization & Team Management**: CRUD operations for organizations and teams
- **Audit Logging**: Track all user modifications
- **API Integration**: All admin UI functions are exposed as API endpoints
- **Responsive Design**: Works across all device sizes

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Setting Up Supabase Locally

1. **Install Supabase CLI** (if not already installed):

```bash
curl -s https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash
```

2. **Start Supabase services**:

```bash
supabase start
```

This will start the following services:
- API Server: http://127.0.0.1:54321
- GraphQL API: http://127.0.0.1:54321/graphql/v1
- Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- Studio (Admin UI): http://127.0.0.1:54323
- Inbucket (Email Testing): http://127.0.0.1:54324

3. **Apply the initial database migration**:

```bash
./run-migration.sh
```

This script will:
- Check if Supabase is running
- Apply the initial migration SQL script
- Set up all required tables, RLS policies, and create a default admin user

### Running the Frontend

1. **Navigate to the frontend directory**:

```bash
cd frontend/abops-ui
```

2. **Install dependencies**:

```bash
npm install
# or
yarn install
```

3. **Create a `.env.local` file** with the following content (replace with your actual Supabase URL and anon key from the Supabase startup output):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD=Password123!
```

4. **Start the development server**:

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Reset Supabase (If Needed)

If you need to reset your Supabase instance and start fresh:

```bash
./reset-supabase.sh
```

This script will:
- Stop Supabase if it's running
- Clean up Docker volumes
- Start Supabase again
- Apply the initial migration

## Project Structure

- `/frontend/abops-ui`: Next.js frontend application
- `/supabase`: Supabase configuration
- `initial-migration.sql`: Database schema and initial data
- `fix-rls-policies.sql`: Row-Level Security policies
- `reset-supabase.sh`: Script to reset Supabase instance
- `run-migration.sh`: Script to run database migrations

## Development Tools

- **Supabase Studio**: Access at http://127.0.0.1:54323 to manage your database, authentication, and storage
- **Next.js Dev Tools**: Available in the browser during development
- **Inbucket**: Test email functionality at http://127.0.0.1:54324

## Default Admin Credentials

After running the migration script, you can log in with:
- Email: admin@example.com (or the value of NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL)
- Password: Password123! (or the value of NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD)

## License

[MIT](LICENSE)
