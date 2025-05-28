
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum NotificationType {
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
    ORDER_ACCEPTED = "ORDER_ACCEPTED",
    ORDER_CANCELLED = "ORDER_CANCELLED",
    ORDER_COMPLETED = "ORDER_COMPLETED",
    ORDER_PLACED = "ORDER_PLACED",
    PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
    REVIEW_RECEIVED = "REVIEW_RECEIVED"
}

export enum OrderStatus {
    ACCEPTED = "ACCEPTED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    DISPUTED = "DISPUTED",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING = "PENDING",
    REVISION = "REVISION"
}

export enum ProjectStatus {
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED"
}

export enum UserRole {
    ADMIN = "ADMIN",
    CLIENT = "CLIENT",
    FREELANCER = "FREELANCER"
}

export class CreateOrderInput {
    projectId: string;
    requirements?: Nullable<string>;
}

export class CreateProjectInput {
    description: string;
    price: number;
    tags: string[];
    title: string;
}

export class LoginInput {
    email: string;
    password: string;
}

export class RegisterInput {
    bio?: Nullable<string>;
    email: string;
    firstName: string;
    hourlyRate?: Nullable<number>;
    lastName: string;
    password: string;
    profilePicture?: Nullable<string>;
    role: UserRole;
    skills: string[];
}

export class ResendVerificationInput {
    email: string;
}

export class UpdateOrderInput {
    deliveryDate?: Nullable<DateTime>;
    id: string;
    requirements?: Nullable<string>;
    status?: Nullable<OrderStatus>;
}

export class UpdateProjectInput {
    description?: Nullable<string>;
    id: string;
    price?: Nullable<number>;
    status?: Nullable<ProjectStatus>;
    tags?: Nullable<string[]>;
    title?: Nullable<string>;
}

export class VerifyEmailInput {
    email: string;
    verificationCode: string;
}

export class AuthResponse {
    accessToken: string;
    user: User;
}

export class DashboardStats {
    activeOrders: number;
    activeProjects: number;
    completedOrders: number;
    totalOrders: number;
    totalProjects: number;
    totalRevenue: number;
    totalUsers: number;
}

export abstract class IMutation {
    abstract acceptOrder(id: string): Order | Promise<Order>;

    abstract cancelOrder(id: string): Order | Promise<Order>;

    abstract completeOrder(id: string): Order | Promise<Order>;

    abstract createOrder(createOrderInput: CreateOrderInput): Order | Promise<Order>;

    abstract createProject(createProjectInput: CreateProjectInput): Project | Promise<Project>;

    abstract deleteProject(id: string): Project | Promise<Project>;

    abstract login(loginInput: LoginInput): AuthResponse | Promise<AuthResponse>;

    abstract markNotificationAsRead(id: string): Notification | Promise<Notification>;

    abstract publishProject(id: string): Project | Promise<Project>;

    abstract register(registerInput: RegisterInput): AuthResponse | Promise<AuthResponse>;

    abstract requestRevision(id: string): Order | Promise<Order>;

    abstract resendVerificationCode(resendVerificationInput: ResendVerificationInput): ResendVerificationResponse | Promise<ResendVerificationResponse>;

    abstract startOrder(id: string): Order | Promise<Order>;

    abstract updateOrder(updateOrderInput: UpdateOrderInput): Order | Promise<Order>;

    abstract updateProject(updateProjectInput: UpdateProjectInput): Project | Promise<Project>;

    abstract updateSystemStats(): boolean | Promise<boolean>;

    abstract verifyEmail(verifyEmailInput: VerifyEmailInput): VerificationResponse | Promise<VerificationResponse>;
}

export class Notification {
    content: string;
    createdAt: DateTime;
    id: string;
    isRead: boolean;
    receiver: User;
    receiverId: string;
    sender?: Nullable<User>;
    senderId?: Nullable<string>;
    type: NotificationType;
}

export class Order {
    client: User;
    clientId: string;
    createdAt: DateTime;
    deliveryDate?: Nullable<DateTime>;
    id: string;
    project: Project;
    projectId: string;
    requirements?: Nullable<string>;
    status: OrderStatus;
    totalAmount: number;
    updatedAt: DateTime;
}

export class PaginatedOrders {
    hasMore: boolean;
    orders: Order[];
    total: number;
}

export class PaginatedProjects {
    hasMore: boolean;
    projects: Project[];
    total: number;
}

export class PaginatedUsers {
    total: number;
    users: User[];
}

export class Project {
    createdAt: DateTime;
    description: string;
    freelancer: User;
    freelancerId: string;
    id: string;
    price: number;
    status: ProjectStatus;
    tags: string[];
    title: string;
    updatedAt: DateTime;
}

export abstract class IQuery {
    abstract adminActiveProjects(skip: number, take: number): PaginatedProjects | Promise<PaginatedProjects>;

    abstract adminDashboardStats(): DashboardStats | Promise<DashboardStats>;

    abstract adminRecentOrders(skip: number, take: number): PaginatedOrders | Promise<PaginatedOrders>;

    abstract adminUsers(skip: number, take: number): PaginatedUsers | Promise<PaginatedUsers>;

    abstract healthCheck(): string | Promise<string>;

    abstract myNotifications(): Notification[] | Promise<Notification[]>;

    abstract myOrders(): Order[] | Promise<Order[]>;

    abstract myProjects(): Project[] | Promise<Project[]>;

    abstract order(id: string): Order | Promise<Order>;

    abstract project(id: string): Project | Promise<Project>;

    abstract projects(): Project[] | Promise<Project[]>;

    abstract receivedOrders(): Order[] | Promise<Order[]>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): User[] | Promise<User[]>;
}

export class ResendVerificationResponse {
    message: string;
}

export abstract class ISubscription {
    abstract dashboardStatsUpdated(): DashboardStats | Promise<DashboardStats>;

    abstract orderUpdates(): string | Promise<string>;

    abstract projectUpdates(): string | Promise<string>;

    abstract userActivity(): string | Promise<string>;
}

export class User {
    bio?: Nullable<string>;
    createdAt: DateTime;
    email: string;
    firstName: string;
    hourlyRate?: Nullable<number>;
    id: string;
    isVerified: boolean;
    lastName: string;
    profilePicture?: Nullable<string>;
    role: UserRole;
    skills: string[];
    updatedAt: DateTime;
}

export class VerificationResponse {
    message: string;
    user?: Nullable<User>;
}

export type DateTime = any;
type Nullable<T> = T | null;
