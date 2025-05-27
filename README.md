# 🚀 FreelanceMarket - Full-Stack Marketplace Platform

A modern, scalable freelance marketplace built with Next.js, NestJS, GraphQL, and real-time features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Setup Instructions](#setup-instructions)
- [Module Overview](#module-overview)
- [Kafka Event Flow](#kafka-event-flow)
- [API Documentation](#api-documentation)
- [Development](#development)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with role-based access control
- **Email verification** with Nodemailer integration
- **Password reset** functionality
- **Multi-role support** (Admin, Client, Freelancer)

### 💼 Core Marketplace Features
- **Project management** with status tracking
- **Order system** with lifecycle management
- **Real-time messaging** between clients and freelancers
- **Review and rating system**
- **User profiles** with skills and portfolio

### 📊 Real-time Dashboard
- **Live statistics** and analytics
- **Real-time notifications** via WebSocket subscriptions
- **Activity feed** with live updates
- **System health monitoring**

### 🔄 Event-Driven Architecture
- **Kafka integration** for event streaming
- **Real-time updates** across the platform
- **Scalable microservice communication**
- **Event sourcing** for audit trails

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Apollo Client** - GraphQL client with caching
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

### Backend
- **NestJS** - Scalable Node.js framework
- **GraphQL** - API query language with subscriptions
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **KafkaJS** - Apache Kafka client
- **Nodemailer** - Email sending service

### Infrastructure
- **Apache Kafka** - Event streaming platform
- **Docker** - Containerization with separate containers
- **PostgreSQL** - Production-ready database
- **Zookeeper** - Kafka coordination service

## 🏗 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • GraphQL API   │    │ • Users         │
│ • Auth Pages    │    │ • WebSocket     │    │ • Projects      │
│ • Real-time UI  │    │ • Email Service │    │ • Orders        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Event Stream  │
                       │   (Apache Kafka)│
                       │                 │
                       │ • Order Events  │
                       │ • Notifications │
                       │ • Real-time     │
                       └─────────────────┘
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 20+ and pnpm
- **Docker & Docker Compose** (recommended)
- **Git**

### Quick Start with Docker (Recommended)

#### Option 1: Development with Docker Infrastructure
```bash
# 1. Clone and install
git clone <repository-url>
cd freelance_market
pnpm install

# 2. Start infrastructure (PostgreSQL, Kafka, etc.)
pnpm docker:dev

# 3. Set up environment
cp .env.example apps/server/.env
# Edit apps/server/.env with your configuration

# 4. Run database migrations
pnpm -C packages/database db:migrate

# 5. Start applications locally
pnpm -C apps/server dev    # Backend
pnpm -C apps/web dev       # Frontend
```

#### Option 2: Full Docker Deployment
```bash
# 1. Clone and configure
git clone <repository-url>
cd freelance_market
cp .env.example .env
# Edit .env with your configuration

# 2. Deploy everything
pnpm docker:deploy
```

#### Prerequisites for Manual Setup
- **PostgreSQL** database running locally
- **Apache Kafka** (optional, for event streaming)

#### 1. Clone and Install
```bash
git clone <repository-url>
cd freelance_market
pnpm install
```

#### 2. Environment Configuration

##### Backend Environment (`apps/server/.env`)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/freelance_market_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
NODE_ENV=development
PORT=4000

# Kafka Configuration
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=freelance-market-service
KAFKA_GROUP_ID=freelance-market-group

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=FreelanceMarket <noreply@freelancemarket.com>

# Admin User (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# GraphQL Configuration
GRAPHQL_PLAYGROUND=true
GRAPHQL_INTROSPECTION=true
```

##### Frontend Environment (`apps/web/.env.local`)
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

#### 3. Database Setup
```bash
# Generate Prisma client
pnpm -C packages/database db:generate

# Run database migrations
pnpm -C packages/database db:migrate

# Seed the database (optional)
pnpm -C apps/server seed:admin
```

#### 4. Start Development Servers
```bash
# Start backend (Terminal 1)
pnpm -C apps/server dev

# Start frontend (Terminal 2)
pnpm -C apps/web dev
```

## 🌐 Application URLs

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

### Docker Services
- **Kafka UI**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## 🐳 Docker Commands

### Development Commands
```bash
pnpm docker:dev          # Start infrastructure only
pnpm docker:down:dev     # Stop development services
pnpm docker:logs:dev     # View development logs
```

### Deployment Commands
```bash
pnpm docker:deploy       # Full Docker deployment
pnpm docker:build        # Build Docker images
pnpm docker:build:rebuild # Clean rebuild
pnpm docker:down         # Stop services
pnpm docker:logs         # View logs
```

### Docker Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  Infrastructure │
│   (Next.js)     │    │   (NestJS)      │    │                 │
│   Port: 3000    │    │   Port: 4000    │    │  PostgreSQL     │
│   Container     │    │   Container     │    │  Kafka          │
│                 │    │                 │    │  Zookeeper      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Module Overview

### Backend Modules (`apps/server/src/`)

#### Core Modules
- **`auth/`** - Authentication, JWT, email verification
- **`users/`** - User management, profiles, roles
- **`projects/`** - Project CRUD, status management
- **`orders/`** - Order lifecycle, client-freelancer matching
- **`notifications/`** - Real-time notifications, email alerts

#### Infrastructure Modules
- **`prisma/`** - Database service and connection
- **`kafka/`** - Event streaming and message handling
- **`email/`** - Email service with beautiful templates
- **`admin/`** - Admin dashboard and system management

#### Shared Resources
- **`common/`** - Guards, decorators, interfaces
- **`graphql.ts`** - Generated GraphQL types
- **`schema.gql`** - GraphQL schema definition

### Frontend Structure (`apps/web/src/`)

#### Pages & Components
- **`app/`** - Next.js App Router pages (login, register, dashboard, admin)
- **`components/`** - Reusable UI components with auth components
- **`contexts/`** - React contexts (AuthContext)
- **`lib/`** - GraphQL queries, validation schemas, utilities

#### Key Features
- **Custom @alias imports** - Clean import paths (`@components`, `@contexts`, `@validation`)
- **Zod validation** - Type-safe form validation
- **Real-time subscriptions** - Live dashboard updates
- **Authentication flow** - Login, register, email verification
- **Responsive design** - Tailwind CSS with modern UI

### Shared Packages (`packages/`)

#### Database Package (`packages/database/`)
- **`prisma/schema.prisma`** - Database schema definition
- **`src/index.ts`** - Prisma client exports
- **`migrations/`** - Database migration files

#### Shared Types (`packages/shared-types/`)
- **`src/user.ts`** - User-related types
- **`src/enums.ts`** - Shared enumerations
- **`src/index.ts`** - Type exports

## 🔄 Kafka Event Flow

### Event Types
```typescript
enum EventTypes {
  ORDER_PLACED = 'order.placed',
  ORDER_ACCEPTED = 'order.accepted',
  ORDER_COMPLETED = 'order.completed',
  ORDER_CANCELLED = 'order.cancelled',
  MESSAGE_SENT = 'message.sent',
  PAYMENT_RECEIVED = 'payment.received',
  REVIEW_SUBMITTED = 'review.submitted'
}
```

### Event Flow Architecture
```
┌─────────────────┐    Kafka Topic     ┌─────────────────┐
│   Producer      │   'order-events'   │   Consumer      │
│   (Order API)   │────────────────────►│   (Notification)│
│                 │                    │   Service       │
│ • Order Created │                    │ • Send Email    │
│ • Status Update │                    │ • Push Notif    │
│ • Payment       │                    │ • Update UI     │
└─────────────────┘                    └─────────────────┘
```

### Event Producers

#### Order Service Events
```typescript
// When order is placed
await this.kafkaService.emit('order-events', {
  type: 'ORDER_PLACED',
  orderId: order.id,
  clientId: order.clientId,
  freelancerId: order.project.freelancerId,
  timestamp: new Date(),
  data: { projectTitle: order.project.title }
});
```

#### Message Service Events
```typescript
// When message is sent
await this.kafkaService.emit('message-events', {
  type: 'MESSAGE_SENT',
  messageId: message.id,
  senderId: message.senderId,
  receiverId: message.receiverId,
  timestamp: new Date()
});
```

### Event Consumers

#### Notification Consumer
```typescript
@EventPattern('order-events')
async handleOrderEvent(data: OrderEvent) {
  switch (data.type) {
    case 'ORDER_PLACED':
      await this.sendOrderNotification(data);
      break;
    case 'ORDER_COMPLETED':
      await this.sendCompletionNotification(data);
      break;
  }
}
```

### Real-time Updates
Events trigger real-time updates via GraphQL subscriptions:

```typescript
// GraphQL Subscription
subscription UserActivity {
  userActivity
}

// WebSocket connection updates dashboard in real-time
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```graphql
mutation RegisterUser {
  register(registerInput: {
    email: "user@example.com"
    password: "securePassword123"
    firstName: "John"
    lastName: "Doe"
    role: FREELANCER
    bio: "Full-stack developer"
    skills: ["JavaScript", "React", "Node.js"]
    hourlyRate: 75.0
  }) {
    accessToken
    user {
      id
      email
      firstName
      lastName
      role
      isVerified
    }
  }
}
```

#### Login User
```graphql
mutation LoginUser {
  login(loginInput: {
    email: "user@example.com"
    password: "securePassword123"
  }) {
    accessToken
    user {
      id
      email
      firstName
      lastName
      role
      isVerified
    }
  }
}
```

#### Verify Email
```graphql
mutation VerifyEmail {
  verifyEmail(verifyEmailInput: {
    email: "user@example.com"
    verificationCode: "123456"
  }) {
    message
    user {
      id
      email
      isVerified
    }
  }
}
```

### Project Management

#### Create Project
```graphql
mutation CreateProject {
  createProject(createProjectInput: {
    title: "Build a React App"
    description: "Need a modern React application"
    price: 1500.0
    tags: ["React", "JavaScript", "Frontend"]
  }) {
    id
    title
    description
    price
    status
    tags
    freelancer {
      firstName
      lastName
    }
  }
}
```

#### Get Projects
```graphql
query GetProjects {
  projects {
    id
    title
    description
    price
    status
    tags
    createdAt
    freelancer {
      firstName
      lastName
      skills
      hourlyRate
    }
  }
}
```

### Real-time Subscriptions

#### User Activity
```graphql
subscription UserActivity {
  userActivity
}
```

#### Dashboard Stats
```graphql
query GetDashboardStats {
  dashboardStats {
    totalUsers
    totalProjects
    totalOrders
    activeProjects
    activeOrders
    completedOrders
    totalRevenue
  }
}
```

## 🔧 Development

### Available Scripts

#### Root Level
```bash
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm lint                   # Lint all packages
pnpm check-types           # TypeScript type checking
pnpm format                # Format code with Prettier

# Docker commands
pnpm docker:dev            # Start development infrastructure
pnpm docker:deploy         # Full Docker deployment
pnpm docker:build          # Build Docker images
pnpm docker:down           # Stop services
pnpm docker:logs           # View logs
```

#### Backend (`apps/server/`)
```bash
pnpm dev                   # Start development server
pnpm build                 # Build the application
pnpm start                 # Start production server
pnpm test                  # Run tests
pnpm lint                  # Run ESLint
pnpm seed:admin           # Seed admin user
```

#### Frontend (`apps/web/`)
```bash
pnpm dev                   # Start development server
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm lint                  # Run ESLint
pnpm check-types          # TypeScript type checking
```

### Database Commands
```bash
# Generate Prisma client
pnpm -C packages/database db:generate

# Create migration
pnpm -C packages/database db:migrate

# Reset database
pnpm -C packages/database db:reset

# View database
pnpm -C packages/database db:studio

# Seed database
pnpm -C apps/server seed:admin
```

### GraphQL Development
- **Playground**: http://localhost:4000/graphql
- **Schema**: Auto-generated from NestJS resolvers
- **Subscriptions**: WebSocket support for real-time features
- **Code Generation**: Automatic TypeScript types from schema

### Testing
```bash
# Run all tests
pnpm test

# Run backend tests
cd apps/server && npm test

# Run frontend tests
cd apps/web && npm test

# Run tests in watch mode
npm run test:watch
```

### Debugging
- **Backend**: Use VS Code debugger with launch.json
- **Frontend**: Next.js built-in debugging
- **Database**: Prisma Studio for data inspection
- **GraphQL**: GraphQL Playground for API testing

## 📁 Project Structure

```
freelance_market/
├── apps/
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/           # App Router pages
│   │   │   ├── components/    # React components
│   │   │   ├── contexts/      # React contexts
│   │   │   └── lib/           # Utilities & GraphQL
│   │   ├── Dockerfile         # Frontend container
│   │   └── package.json
│   └── server/                # NestJS Backend
│       ├── src/
│       │   ├── auth/          # Authentication module
│       │   ├── users/         # User management
│       │   ├── projects/      # Project management
│       │   ├── orders/        # Order system
│       │   ├── notifications/ # Real-time notifications
│       │   ├── kafka/         # Event streaming
│       │   ├── email/         # Email service
│       │   ├── admin/         # Admin functionality
│       │   └── health/        # Health checks
│       ├── Dockerfile         # Backend container
│       └── package.json
├── packages/
│   ├── database/              # Prisma database package
│   │   ├── prisma/           # Schema & migrations
│   │   └── src/              # Database utilities
│   ├── shared-types/          # Shared TypeScript types
│   ├── ui/                    # Shared UI components
│   ├── typescript-config/     # Shared TS config
│   └── eslint-config/         # Shared ESLint config
├── scripts/                   # Docker & deployment scripts
├── docker-compose.yml         # Production orchestration
├── docker-compose.dev.yml     # Development infrastructure
├── .env.example              # Environment template
├── DOCKER.md                 # Docker documentation
└── README.md                 # This file
```

## 🔧 Key Features Implemented

### ✅ Authentication System
- JWT-based authentication with refresh tokens
- Email verification with 6-digit codes
- Password reset functionality
- Role-based access control (Admin, Client, Freelancer)
- Protected routes with AuthGuard

### ✅ Real-time Features
- GraphQL subscriptions for live updates
- WebSocket connections for real-time dashboard
- Live user activity tracking
- Real-time notifications

### ✅ Database & ORM
- PostgreSQL with Prisma ORM
- Type-safe database operations
- Database migrations and seeding
- Comprehensive schema design

### ✅ Event Streaming
- Apache Kafka integration
- Event-driven architecture
- Order lifecycle events
- Scalable message processing

### ✅ Modern Frontend
- Next.js 15 with App Router
- TypeScript with strict typing
- Tailwind CSS for styling
- Custom path aliases (@components, @contexts, etc.)
- Zod validation for forms

### ✅ DevOps & Deployment
- Separate Docker containers for frontend/backend
- Development and production environments
- Health checks and monitoring
- Automated build scripts

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS** for the amazing backend framework
- **Next.js** for the powerful React framework
- **Prisma** for the excellent database toolkit
- **Apollo GraphQL** for the comprehensive GraphQL implementation
- **Kafka** for reliable event streaming

---

**Built with ❤️ using modern web technologies**

For questions or support, please open an issue or contact the development team.
