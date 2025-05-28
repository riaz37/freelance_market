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
- **Automatic role-based redirects** after login
- **Protected routes** with authentication guards

### 💼 Core Marketplace Features
- **Complete project management** with CRUD operations
- **Advanced order system** with full lifecycle management
- **Project browsing** with search, filtering, and sorting
- **Order workflow** (Pending → Accepted → In Progress → Completed)
- **Tag-based project categorization**
- **User profiles** with skills and portfolio management

### 🎯 Role-Based Dashboards
- **Admin Dashboard** - System management, user oversight, analytics
- **Client Dashboard** - Project browsing, order management, notifications
- **Freelancer Dashboard** - Project creation, order fulfillment, portfolio

### 📊 Real-time Features
- **Live notifications** system with type-based categorization
- **Real-time order status** updates
- **WebSocket subscriptions** for instant updates
- **Activity feed** with live updates
- **System health monitoring**

### 🔍 Advanced Search & Discovery
- **Multi-criteria project search** (text, tags, price range)
- **Advanced filtering** by skills and categories
- **Sorting options** (newest, price low-to-high, high-to-low)
- **Freelancer profile** integration in project listings

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

### 🎯 Quick Start (5 minutes)

The fastest way to get the complete freelance marketplace running:

```bash
# 1. Clone the repository
git clone <repository-url>
cd freelance_market

# 2. Start everything with Docker
pnpm run docker:deploy

# 3. Wait for services to start (2-3 minutes)
# Then visit: http://localhost:3000
```

**That's it!** The application will be running with:
- ✅ Frontend at http://localhost:3000
- ✅ Backend API at http://localhost:4000
- ✅ Database with sample data
- ✅ All services configured and ready

**Test the application:**
1. Visit http://localhost:3000
2. Click "Get started" to register
3. Create accounts for different roles (Admin, Client, Freelancer)
4. Explore the role-based dashboards

### Quick Start with Docker (Recommended)

#### Option 1: Development with Docker Infrastructure
```bash
# 1. Clone and install
git clone <repository-url>
cd freelance_market
pnpm install

# 2. Start infrastructure (PostgreSQL, Kafka, etc.)
pnpm run docker:dev

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
pnpm run docker:deploy
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
# Database - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_XWSql4CA5zOY@ep-frosty-boat-a53u4vht-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

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

> **Note**: If you encounter issues with the NestJS CLI (schematics binary path error), this is a known compatibility issue with pnpm. You can work around this by using npm for the server development or using Docker for development.

## 🌐 Application URLs

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

### Frontend Pages
- **Landing Page**: http://localhost:3000
- **Login/Register**: http://localhost:3000/auth/login | http://localhost:3000/auth/register
- **Email Verification**: http://localhost:3000/auth/verify-email
- **Dashboard Hub**: http://localhost:3000/dashboard (auto-redirects by role)
- **Admin Dashboard**: http://localhost:3000/admin
- **Client Dashboard**: http://localhost:3000/client
- **Freelancer Dashboard**: http://localhost:3000/freelancer

### Docker Services
- **Kafka UI**: http://localhost:8080

## 🐳 Docker Commands

### Development Commands
```bash
pnpm run docker:dev      # Start infrastructure only
pnpm run docker:down     # Stop development services
pnpm run docker:logs     # View development logs
```

### Deployment Commands
```bash
pnpm run docker:deploy   # Full Docker deployment
pnpm run docker:build    # Build Docker images
pnpm run docker:down     # Stop services
pnpm run docker:logs     # View logs
```

### Docker Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  Infrastructure │
│   (Next.js)     │    │   (NestJS)      │    │                 │
│   Port: 3000    │    │   Port: 4000    │    │  Kafka          │
│   Container     │    │   Container     │    │  Zookeeper      │
│                 │    │   + Neon DB     │    │  Kafka UI       │
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
- **`app/`** - Next.js App Router pages with role-based routing
  - `page.tsx` - Landing page with marketing content
  - `auth/login/` & `auth/register/` & `auth/verify-email/` - Authentication pages
  - `dashboard/` - Auto-redirect hub based on user role
  - `admin/` - Admin dashboard with system management
  - `client/` - Client dashboard with project browsing
  - `freelancer/` - Freelancer dashboard with project management
- **`components/`** - Comprehensive UI component library
  - `LoginForm.tsx` - Authentication forms
  - `ProjectsManagement.tsx` - Full project CRUD interface
  - `OrdersManagement.tsx` - Complete order lifecycle management
  - `ProjectBrowser.tsx` - Advanced project search and discovery
  - `NotificationsManagement.tsx` - Real-time notification system
  - `UsersManagement.tsx` - Admin user management
  - `Dashboard.tsx` - Analytics and statistics
  - `Layout.tsx` - Navigation and layout components
  - `AuthGuard.tsx` - Route protection and role-based access
- **`contexts/`** - React contexts for global state
  - `AuthContext.tsx` - Authentication and user state management
- **`lib/`** - Utilities and GraphQL integration
  - `graphql/queries.ts` - Complete GraphQL query library covering all APIs
  - `apollo-client.ts` - Apollo Client configuration with auth
  - `validation/` - Zod schemas for form validation

#### Key Features
- **Complete API Coverage** - All backend APIs have corresponding frontend interfaces
- **Role-based Navigation** - Different dashboards for Admin, Client, Freelancer
- **Custom @alias imports** - Clean import paths (`@components`, `@contexts`, `@lib`)
- **Type-safe GraphQL** - Full TypeScript integration with Apollo Client
- **Real-time Updates** - WebSocket subscriptions for live data
- **Advanced Search** - Multi-criteria filtering and sorting
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Form Validation** - Zod validation with real-time feedback
- **Error Handling** - Comprehensive error states and user feedback

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

#### Update Project
```graphql
mutation UpdateProject {
  updateProject(updateProjectInput: {
    id: "project-id"
    title: "Updated React App"
    description: "Updated requirements"
    price: 2000.0
    tags: ["React", "TypeScript", "Frontend"]
  }) {
    id
    title
    description
    price
    status
    tags
    updatedAt
  }
}
```

#### Publish Project
```graphql
mutation PublishProject {
  publishProject(id: "project-id") {
    id
    status
    updatedAt
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

#### Get My Projects (Freelancer)
```graphql
query GetMyProjects {
  myProjects {
    id
    title
    description
    price
    status
    tags
    createdAt
    updatedAt
  }
}
```

### Order Management

#### Create Order
```graphql
mutation CreateOrder {
  createOrder(createOrderInput: {
    projectId: "project-id"
    requirements: "Please include responsive design"
  }) {
    id
    projectId
    status
    totalAmount
    requirements
    deliveryDate
    createdAt
    project {
      title
    }
    client {
      firstName
      lastName
    }
  }
}
```

#### Accept Order (Freelancer)
```graphql
mutation AcceptOrder {
  acceptOrder(id: "order-id") {
    id
    status
    updatedAt
  }
}
```

#### Start Order (Freelancer)
```graphql
mutation StartOrder {
  startOrder(id: "order-id") {
    id
    status
    updatedAt
  }
}
```

#### Complete Order (Freelancer)
```graphql
mutation CompleteOrder {
  completeOrder(id: "order-id") {
    id
    status
    updatedAt
  }
}
```

#### Get My Orders (Client)
```graphql
query GetMyOrders {
  myOrders {
    id
    projectId
    status
    totalAmount
    requirements
    deliveryDate
    createdAt
    project {
      title
      freelancer {
        firstName
        lastName
      }
    }
  }
}
```

#### Get Received Orders (Freelancer)
```graphql
query GetReceivedOrders {
  receivedOrders {
    id
    projectId
    status
    totalAmount
    requirements
    deliveryDate
    createdAt
    project {
      title
    }
    client {
      firstName
      lastName
      email
    }
  }
}
```

### Notifications

#### Get My Notifications
```graphql
query GetMyNotifications {
  myNotifications {
    id
    type
    title
    message
    isRead
    createdAt
  }
}
```

#### Mark Notification as Read
```graphql
mutation MarkNotificationAsRead {
  markNotificationAsRead(id: "notification-id") {
    id
    isRead
    updatedAt
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
pnpm run docker:dev        # Start development infrastructure
pnpm run docker:deploy     # Full Docker deployment
pnpm run docker:build      # Build Docker images
pnpm run docker:down       # Stop services
pnpm run docker:logs       # View logs
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

### Troubleshooting

#### NestJS CLI Issues
If you encounter "schematics binary path could not be found" error:
```bash
# Option 1: Use npm for server development
cd apps/server
npm install
npm run dev

# Option 2: Use Docker for development
pnpm run docker:dev
# Then run applications in containers
```

#### Docker Issues
```bash
# Clean up Docker resources
docker system prune -a

# Rebuild containers
pnpm run docker:build

# Check container logs
pnpm run docker:logs
```

#### Database Issues
```bash
# Reset database
pnpm -C packages/database db:reset

# Regenerate Prisma client
pnpm -C packages/database db:generate

# Check database connection
pnpm -C packages/database db:studio
```

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

### ✅ Complete Authentication System
- JWT-based authentication with refresh tokens
- Email verification with 6-digit codes
- Password reset functionality
- Role-based access control (Admin, Client, Freelancer)
- Protected routes with AuthGuard
- Automatic role-based redirects after login

### ✅ Comprehensive Frontend Implementation
- **Complete API Coverage** - All backend APIs have frontend interfaces
- **Role-based Dashboards** - Separate interfaces for Admin, Client, Freelancer
- **Advanced Project Management** - Full CRUD with search, filtering, sorting
- **Complete Order Lifecycle** - From placement to completion with status tracking
- **Real-time Notifications** - Live updates with type-based categorization
- **Advanced Search & Discovery** - Multi-criteria project browsing
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### ✅ Project Management Features
- Create, edit, publish, delete projects
- Tag-based categorization and filtering
- Project status tracking (Draft → Published → Completed)
- Advanced search by title, description, freelancer, tags
- Price range filtering and sorting options
- Freelancer profile integration

### ✅ Order Management System
- Complete order lifecycle management
- Order placement with custom requirements
- Status progression (Pending → Accepted → In Progress → Completed)
- Revision requests and cancellation support
- Role-specific actions (Client vs Freelancer views)
- Real-time status updates

### ✅ Real-time Features
- GraphQL subscriptions for live updates
- WebSocket connections for real-time dashboard
- Live user activity tracking
- Real-time notifications with mark-as-read functionality
- Instant order status updates

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

### ✅ Modern Frontend Architecture
- Next.js 15 with App Router
- TypeScript with strict typing
- Apollo Client for GraphQL state management
- Tailwind CSS for styling
- Custom path aliases (@components, @contexts, @lib)
- Zod validation for forms
- Error handling and loading states

### ✅ User Experience Features
- Intuitive navigation with role-based menus
- Advanced filtering and search capabilities
- Form validation with real-time feedback
- Loading states and error handling
- Mobile-responsive design
- Accessibility considerations

### ✅ Docker & Deployment
- Separate Docker containers for frontend/backend
- Development and production environments
- Health checks and monitoring
- Docker Compose orchestration

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
