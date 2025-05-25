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
    myNotifications(skip: 0, take: 10) {
      notifications {
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
      total
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
