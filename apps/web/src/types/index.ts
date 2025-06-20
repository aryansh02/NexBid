export type Role = 'BUYER' | 'SELLER';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  minBudget: number;
  maxBudget: number;
  deadline: string;
  status: Status;
  buyer: User;
  buyerId: string;
  bids: Bid[];
  reviews: Review[];
  sellerId?: string;
  deliverable?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bids: number;
  };
}

export interface Bid {
  id: string;
  amount: number;
  etaDays: number;
  message: string;
  project?: Project;
  projectId: string;
  seller: User;
  sellerId: string;
  accepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  project?: Project;
  projectId: string;
  seller: User;
  sellerId: string;
  createdAt: string;
}

// API Response types
export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface CreateProjectForm {
  title: string;
  description: string;
  minBudget: number;
  maxBudget: number;
  deadline: string;
  buyerId: string; // TODO: Remove when JWT auth is implemented
}

export interface CreateBidForm {
  amount: number;
  etaDays: number;
  message: string;
  sellerId: string; // TODO: Remove when JWT auth is implemented
}

export interface CreateReviewForm {
  rating: number;
  comment: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  name: string;
  email: string;
  password: string;
  role: Role;
} 