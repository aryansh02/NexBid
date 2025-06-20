# NexBid - Freelance Marketplace Platform

A modern, full-stack freelance marketplace built with Next.js, Express, and PostgreSQL. NexBid connects buyers and sellers in a seamless platform for project bidding, collaboration, and completion tracking.

## 🌟 Features

### Core Functionality

- **Project Management**: Buyers post projects with detailed requirements and budget ranges
- **Bidding System**: Sellers place competitive bids with custom proposals and timelines
- **Status Tracking**: Real-time project status progression (Pending → In Progress → Completed)
- **File Upload**: Secure deliverable upload system with drag-and-drop interface
- **Review System**: 5-star rating system with detailed feedback
- **Email Notifications**: Automated notifications for key project milestones

### Modern UI/UX

- **Neumorphic Design**: Soft, modern design with subtle shadows and depth
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Accessible**: WCAG AA compliant with proper focus management and contrast ratios

### Technical Excellence

- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Form Validation**: Zod-based validation with real-time error feedback
- **Database**: Prisma ORM with PostgreSQL for robust data management
- **API Design**: RESTful API with comprehensive error handling
- **Testing**: Jest and Supertest for reliable testing coverage

## 🚀 Tech Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Headless UI** for accessible components
- **Heroicons** for consistent iconography

### Backend

- **Node.js** with Express
- **TypeScript** for server-side type safety
- **Prisma ORM** for database management
- **PostgreSQL** for data persistence
- **Nodemailer** for email services
- **Multer** for file upload handling

### Development Tools

- **npm Workspaces** for monorepo management
- **ESLint** and **Prettier** for code quality
- **Jest** and **Supertest** for testing
- **Zod** for runtime validation

## 📁 Project Structure

```
NexBid/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages and layouts
│   │   │   │   ├── app/         # App Router pages and layouts
│   │   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── lib/         # Utility functions and API client
│   │   │   │   └── types/       # TypeScript type definitions
│   │   │   └── ...
│   └── api/                 # Express backend application
│       ├── src/
│       │   ├── controllers/ # Route handlers
│       │   ├── routes/      # API route definitions
│       │   ├── lib/         # Utilities and validation
│       │   └── middleware/  # Express middleware
│       └── ...
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.ts             # Database seeding script
└── ...
```

## 🎨 Design System

### Color Palette

- **Background**: `#F5F7FA` (very light gray)
- **Cards**: `#FFFFFF` (pure white)
- **Primary**: `#0E7490` (teal)
- **Accent**: `#F97316` (orange)
- **Text**: Neutral grays (`#94A3B8`, `#475569`)

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 600 (semibold)
- **Headings**: Tight letter spacing for modern look

### Components

- **Neumorphic Cards**: Soft shadows with subtle depth
- **Interactive Elements**: Hover effects with scale transforms
- **Form Inputs**: Inset shadows for tactile feel
- **Status Badges**: Color-coded project status indicators

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)
- npm

### Local Setup (One-liner)

```bash
cp .env.example .env  # Copy environment template first
npm run setup:dev && npm run dev:all   # spins Docker DB, migrates, starts API+Web
```

This command will:

1. Spin up PostgreSQL via Docker Compose
2. Wait for database to be ready
3. Run Prisma migrations and seed data (including QA test users)
4. Start both API (port 8080) and Web (port 3000) concurrently

**QA Test Users:**

- Buyer: `demo-buyer@nexbid.com` / `password`
- Seller: `demo-seller@nexbid.com` / `password`

## 🔐 Authentication

NexBid features a complete JWT-based authentication system with role-based access control.

### Authentication Flow

1. **Sign Up**: `/auth/signup` - Create new buyer or seller account
2. **Sign In**: `/auth/login` - Authenticate with email/password
3. **Protected Routes**: Dashboard, project creation, bidding require authentication
4. **Role-Based Access**:
   - Buyers can post projects and accept bids
   - Sellers can browse projects and submit bids
   - Automatic redirects based on user role

### Security Features

- JWT tokens with 7-day expiry
- HttpOnly, SameSite cookies
- Bcrypt password hashing (10 rounds)
- Role-based route protection
- Secure API endpoint authorization

### Manual Setup (if needed)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd NexBid
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Update SMTP settings in .env for email functionality
   ```

4. **Database and services**

   ```bash
   # Start PostgreSQL
   docker compose up -d db

   # Run migrations and seed
   npm run db:migrate
   npm run db:seed

   # Start development servers
   npm run dev:all
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432 (nexbid/nexbid)

## 📊 Database Schema

### Core Models

**User**

- Supports both BUYER and SELLER roles
- Email-based identification
- Timestamps for audit trails

**Project**

- Comprehensive project details with budget ranges
- Status progression tracking
- Foreign key relationships to buyers and sellers

**Bid**

- Competitive bidding with custom proposals
- ETA tracking for project timelines
- Acceptance status for workflow management

**Review**

- 5-star rating system
- Detailed feedback comments
- Linked to completed projects

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user (buyer/seller)
- `POST /api/auth/login` - Authenticate user and set JWT cookie
- `GET /api/auth/me` - Get current user info (protected)
- `POST /api/auth/logout` - Clear authentication cookie

### Projects

- `GET /api/projects` - List projects with filtering (public)
- `POST /api/projects` - Create new project (BUYER only)
- `GET /api/projects/:id` - Get project details (public)
- `PATCH /api/projects/:id/status` - Update project status (authenticated)

### Bidding

- `POST /api/projects/:id/bids` - Place bid on project (SELLER only)
- `GET /api/projects/:id/bids` - Get project bids (public)
- `POST /api/projects/:id/accept` - Accept bid (BUYER only)

### File Management

- `POST /api/projects/:id/upload` - Upload deliverables (SELLER only)

### Reviews

- `POST /api/projects/:id/review` - Submit project review (BUYER only)

## 🎯 User Journey

### For Buyers

1. **Post Project**: Create detailed project requirements with budget and deadline
2. **Review Bids**: Evaluate proposals from sellers with ratings and portfolios
3. **Accept Bid**: Choose the best proposal and start project collaboration
4. **Track Progress**: Monitor project status and communicate with seller
5. **Receive Deliverables**: Download completed work and provide feedback
6. **Leave Review**: Rate seller performance and build community trust

### For Sellers

1. **Browse Projects**: Discover opportunities matching skills and interests
2. **Place Bids**: Submit competitive proposals with custom timelines
3. **Project Execution**: Collaborate with buyer and manage deliverables
4. **Upload Work**: Submit completed deliverables through secure upload
5. **Build Reputation**: Accumulate positive reviews and ratings

## 🔧 Development

### Code Quality

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Database Management

```bash
# Reset database
npm run db:reset

# View database
npm run db:studio

# Generate new migration
npm run db:migrate

# Seed QA test data
npm run seed:qa
```

### Screenshots

```bash
# Take screenshots (requires running servers)
npm run screenshots
```

Screenshots are automatically saved to `docs/` directory.

## 📸 Screenshots

### Dashboard View

_Modern dashboard with neumorphic design showcasing project management interface_

![Dashboard Screenshot](docs/dashboard.png)

### Project Detail Page

_Comprehensive project view with tabbed interface for bids, deliverables, and reviews_

![Project Detail Screenshot](docs/project.png)

## 🚀 Deployment

### Quick Deploy

**Render + Vercel**

1. **Deploy to Render** (API + Database)

   - Click "Deploy to Render"
   - Choose `render.yaml` configuration
   - Set environment variables (SMTP credentials)

2. **Deploy to Vercel** (Frontend)

   - Click "Import Project" on Vercel
   - Set `NEXT_PUBLIC_API_URL` to your Render API URL
   - Deploy automatically

3. **Done!** 🎉

### Manual Deployment

#### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Use Docker environment with `apps/api/Dockerfile`
4. Add PostgreSQL database addon
5. Set environment variables:
   - `DATABASE_URL` (from database addon)
   - `FRONTEND_URL` (your Vercel URL)
   - `SMTP_*` credentials

#### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your Render API URL)
4. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the incredible React framework
- **Prisma Team** for the excellent ORM and developer experience
- **Tailwind CSS** for the utility-first CSS framework
- **Headless UI** for accessible component primitives
- **Framer Motion** for smooth animations

## 📞 Support

For support, email support@nexbid.com or join our community Discord.

---

**Built with ❤️ by the NexBid Team**
