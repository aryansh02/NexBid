const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || `HTTP ${response.status}`,
        errorData
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error', { originalError: error });
  }
}

// API functions
export const api = {
  // Projects
  getProjects: (params?: { status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest<any>(`/projects${query ? `?${query}` : ''}`);
  },

  createProject: (data: any) => 
    apiRequest<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProject: (id: string) => 
    apiRequest<any>(`/projects/${id}`),

  // Bids
  createBid: (projectId: string, data: any) =>
    apiRequest<any>(`/projects/${projectId}/bids`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProjectBids: (projectId: string) =>
    apiRequest<any>(`/projects/${projectId}/bids`),

  acceptBid: (projectId: string, bidId: string) =>
    apiRequest<any>(`/projects/${projectId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ bidId }),
    }),

  // Status updates
  updateProjectStatus: (projectId: string, status: string) =>
    apiRequest<any>(`/projects/${projectId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // File upload
  uploadDeliverable: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('deliverable', file);

    return apiRequest<any>(`/projects/${projectId}/upload`, {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  },

  // Reviews
  createReview: (projectId: string, data: any) =>
    apiRequest<any>(`/projects/${projectId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Auth (placeholder)
  login: (data: any) =>
    apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signup: (data: any) =>
    apiRequest<any>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { ApiError }; 