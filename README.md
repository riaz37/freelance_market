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
- **Redis** (optional) - Caching and session storage
- **Docker** (optional) - Containerization
- **Neon** - Serverless PostgreSQL

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
- **Node.js** 18+ and npm/pnpm
- **PostgreSQL** database (or Neon account)
- **Apache Kafka** (optional, for event streaming)
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd freelance_market
```

### 2. Install Dependencies
```bash
# Install all dependencies
pnpm install

# Or using npm
npm install
```

### 3. Environment Configuration

#### Backend Environment (`apps/server/.env`)
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# JWT
JWT_SECRET="your-super-secret-jwt-key-for-development"

# Server
PORT=4000
NODE_ENV=development

# Kafka (Optional)
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="freelance-market-service"
KAFKA_GROUP_ID="freelance-market-group"

# Admin User (for seeding)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

# Email Configuration (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="FreelanceMarket <noreply@freelancemarket.com>"
```

#### Frontend Environment (`apps/web/.env.local`)
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:4000/graphql
```

### 4. Database Setup
```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 5. Start the Development Servers

#### Start Backend Server
```bash
cd apps/server
npm run build
npm run start:prod

# Or for development with watch mode
npm run dev
```

#### Start Frontend Server
```bash
cd apps/web
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Backend API**: http://localhost:4000

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

### Frontend Structure (`apps/web/`)

#### Pages & Components
- **`app/`** - Next.js App Router pages
- **`components/`** - Reusable UI components
- **`lib/`** - GraphQL queries, utilities, types

#### Key Components
- **`Dashboard.tsx`** - Real-time dashboard with live stats
- **`EmailVerification.tsx`** - Email verification flow
- **`AuthProvider.tsx`** - Authentication context
- **`ApolloProvider.tsx`** - GraphQL client setup

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
pnpm dev          # Start all services
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm lint         # Lint all packages
```

#### Backend (`apps/server/`)
```bash
npm run build     # Build the application
npm run start     # Start production server
npm run dev       # Start development server
npm run test      # Run tests
npm run lint      # Run ESLint
```

#### Frontend (`apps/web/`)
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run type-check # Run TypeScript checks
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio

# Seed database
npx prisma db seed
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
