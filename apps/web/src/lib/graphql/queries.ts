import { gql } from '@apollo/client';

// Note: After running 'pnpm codegen', you can import generated types and hooks:
// import { useGetDashboardStatsQuery, useGetAdminUsersQuery } from './generated/hooks';
// import type { GetDashboardStatsQuery, GetAdminUsersQueryVariables } from './generated/types';

// Dashboard Stats Query
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    adminDashboardStats {
      totalUsers
      totalProjects
      totalOrders
      activeProjects
      activeOrders
      completedOrders
      totalRevenue
    }
  }
`;

// Users Query
export const GET_ADMIN_USERS = gql`
  query GetAdminUsers($skip: Int!, $take: Int!) {
    adminUsers(skip: $skip, take: $take) {
      users {
        id
        email
        firstName
        lastName
        role
        isVerified
        skills
        hourlyRate
        createdAt
      }
      total
    }
  }
`;

// Projects Query
export const GET_ADMIN_PROJECTS = gql`
  query GetAdminProjects($skip: Int!, $take: Int!) {
    adminActiveProjects(skip: $skip, take: $take) {
      projects {
        id
        title
        description
        price
        status
        tags
        createdAt
        freelancer {
          id
          firstName
          lastName
          email
        }
      }
      total
    }
  }
`;

// Orders Query
export const GET_ADMIN_ORDERS = gql`
  query GetAdminOrders($skip: Int!, $take: Int!) {
    adminRecentOrders(skip: $skip, take: $take) {
      orders {
        id
        status
        totalAmount
        requirements
        deliveryDate
        createdAt
        client {
          id
          firstName
          lastName
          email
        }
        project {
          id
          title
          freelancer {
            id
            firstName
            lastName
          }
        }
      }
      total
    }
  }
`;

// Health Check Query
export const HEALTH_CHECK = gql`
  query HealthCheck {
    healthCheck
  }
`;

// Login Mutation
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
        isVerified
        bio
        skills
        hourlyRate
      }
    }
  }
`;

// Register Mutation
export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        role
        isVerified
        bio
        skills
        hourlyRate
      }
    }
  }
`;

// Real-time Subscriptions
export const DASHBOARD_STATS_SUBSCRIPTION = gql`
  subscription DashboardStatsUpdated {
    dashboardStatsUpdated {
      totalUsers
      totalProjects
      totalOrders
      activeProjects
      activeOrders
      completedOrders
      totalRevenue
    }
  }
`;

export const USER_ACTIVITY_SUBSCRIPTION = gql`
  subscription UserActivity {
    userActivity
  }
`;

export const PROJECT_UPDATES_SUBSCRIPTION = gql`
  subscription ProjectUpdates {
    projectUpdates
  }
`;

export const ORDER_UPDATES_SUBSCRIPTION = gql`
  subscription OrderUpdates {
    orderUpdates
  }
`;

// Recent Activity Query
export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity {
    myNotifications {
      id
      type
      content
      isRead
      createdAt
      sender {
        firstName
        lastName
        email
      }
    }
  }
`;

// Recent Activity Subscription
export const RECENT_ACTIVITY_SUBSCRIPTION = gql`
  subscription RecentActivity {
    userActivity
  }
`;

// Email Verification Mutations
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(verifyEmailInput: $verifyEmailInput) {
      message
      user {
        id
        email
        firstName
        lastName
        isVerified
      }
    }
  }
`;

export const RESEND_VERIFICATION_MUTATION = gql`
  mutation ResendVerificationCode($resendVerificationInput: ResendVerificationInput!) {
    resendVerificationCode(resendVerificationInput: $resendVerificationInput) {
      message
    }
  }
`;

// Projects Queries and Mutations
export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      id
      title
      description
      price
      status
      tags
      createdAt
      updatedAt
      freelancer {
        id
        firstName
        lastName
        email
        bio
        skills
        hourlyRate
      }
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProject($id: String!) {
    project(id: $id) {
      id
      title
      description
      price
      status
      tags
      createdAt
      updatedAt
      freelancer {
        id
        firstName
        lastName
        email
        bio
        skills
        hourlyRate
      }
    }
  }
`;

export const GET_MY_PROJECTS = gql`
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
`;

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($createProjectInput: CreateProjectInput!) {
    createProject(createProjectInput: $createProjectInput) {
      id
      title
      description
      price
      status
      tags
      createdAt
      updatedAt
      freelancer {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($updateProjectInput: UpdateProjectInput!) {
    updateProject(updateProjectInput: $updateProjectInput) {
      id
      title
      description
      price
      status
      tags
      updatedAt
    }
  }
`;

export const PUBLISH_PROJECT_MUTATION = gql`
  mutation PublishProject($id: String!) {
    publishProject(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      id
      title
      status
    }
  }
`;

// Orders Queries and Mutations
export const GET_ORDER_BY_ID = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      projectId
      status
      totalAmount
      requirements
      deliveryDate
      createdAt
      updatedAt
      project {
        id
        title
        description
        price
        freelancer {
          id
          firstName
          lastName
          email
        }
      }
      client {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
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
        id
        title
        freelancer {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_RECEIVED_ORDERS = gql`
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
        id
        title
      }
      client {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
      projectId
      status
      totalAmount
      requirements
      deliveryDate
      createdAt
      project {
        id
        title
      }
      client {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($updateOrderInput: UpdateOrderInput!) {
    updateOrder(updateOrderInput: $updateOrderInput) {
      id
      status
      requirements
      deliveryDate
      updatedAt
    }
  }
`;

export const ACCEPT_ORDER_MUTATION = gql`
  mutation AcceptOrder($id: String!) {
    acceptOrder(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const START_ORDER_MUTATION = gql`
  mutation StartOrder($id: String!) {
    startOrder(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const COMPLETE_ORDER_MUTATION = gql`
  mutation CompleteOrder($id: String!) {
    completeOrder(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const REQUEST_REVISION_MUTATION = gql`
  mutation RequestRevision($id: String!) {
    requestRevision(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($id: String!) {
    cancelOrder(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

// Notifications Queries and Mutations
export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id
      type
      content
      isRead
      createdAt
      sender {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
      updatedAt
    }
  }
`;

// Admin Queries
export const GET_ADMIN_ACTIVE_PROJECTS = gql`
  query GetAdminActiveProjects($skip: Int!, $take: Int!) {
    adminActiveProjects(skip: $skip, take: $take) {
      projects {
        id
        title
        description
        price
        status
        tags
        createdAt
        freelancer {
          id
          firstName
          lastName
        }
      }
      total
      hasMore
    }
  }
`;

export const GET_ADMIN_RECENT_ORDERS = gql`
  query GetAdminRecentOrders($skip: Int!, $take: Int!) {
    adminRecentOrders(skip: $skip, take: $take) {
      orders {
        id
        status
        totalAmount
        createdAt
        project {
          id
          title
        }
        client {
          id
          firstName
          lastName
        }
      }
      total
      hasMore
    }
  }
`;
