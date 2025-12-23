# Task Manager Pro

A professional, production-ready task management application built with Next.js 14, TypeScript, PostgreSQL, and Prisma.

![Task Manager Pro](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue) ![Prisma](https://img.shields.io/badge/Prisma-5.0-purple)

## ✨ Features

- **🔐 Authentication**: Secure credentials-based login with NextAuth.js
- **📝 Task Management**: Full CRUD operations with priorities, due dates, and tags
- **🔍 Advanced Filtering**: Filter by status, priority, tags, and search text
- **📊 Dashboard**: Visual overview with statistics and progress tracking
- **🏷️ Tags**: Organize tasks with color-coded tags
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🌙 Dark Mode**: Automatic dark mode support
- **🔒 Multi-tenant**: Each user only sees their own data

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Styling | TailwindCSS |
| UI Components | Radix UI primitives |
| Validation | Zod |
| Testing | Jest + React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Vercel + Neon |

## 📋 Prerequisites

- Node.js 18.17+ 
- Docker (recommended) OR PostgreSQL installed locally
- Git

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/task-manager-pro.git
cd task-manager-pro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) section).

### 4. Start the database with Docker

```bash
docker-compose up -d
```

**Without Docker**: Install PostgreSQL, create a database named `taskmanager`, and update the `DATABASE_URL` in `.env`.

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Seed the database (optional)

```bash
npm run db:seed
```

This creates a demo user:
- **Email**: demo@example.com
- **Password**: demo1234

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:generate` | Generate Prisma client |

## 🗄️ Database Schema

```
User
├── id (cuid)
├── email (unique)
├── name
├── hashedPassword
└── tasks[]

Task
├── id (cuid)
├── title
├── description
├── status (TODO | DOING | DONE)
├── priority (LOW | MEDIUM | HIGH)
├── dueDate
├── tags[]
└── userId (FK)

Tag
├── id (cuid)
├── name
├── color
└── userId (FK)
```

## 🚢 Deployment

### Database (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy the connection string

### Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL`: Your Neon connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://task-manager-pro.vercel.app`)
4. Deploy!

### Post-deployment

Run migrations on production:

```bash
npx prisma migrate deploy
```

Or add this to `package.json` build script:

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

## ✅ Manual Testing Checklist

- [ ] Open app → redirects to login
- [ ] Register new account → success
- [ ] Login with credentials → redirects to tasks
- [ ] Create a new task → appears in list
- [ ] Edit task → changes saved
- [ ] Delete task → confirmation → removed
- [ ] Filter by status/priority → correct results
- [ ] Search by text → matching tasks shown
- [ ] Visit dashboard → statistics displayed
- [ ] Logout → redirects to login
- [ ] Login with demo credentials → works

## 📄 License

MIT

---

Built with ❤️ using Next.js, TypeScript, and PostgreSQL
