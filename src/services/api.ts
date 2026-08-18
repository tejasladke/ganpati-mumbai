import {
  AdminStats,
  AiItinerary,
  AuthResponse,
  Challenge,
  Favorite,
  Pandal,
  PlannerItem,
  Submission,
  User,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mumbai_ganpati_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || 'An error occurred with the request');
  }
  return res.json();
}

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  register: async (name: string, email: string, password: string, avatar?: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, avatar }),
    });
    return handleResponse<AuthResponse>(res);
  },

  getProfile: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<User>(res);
  },

  updateProfile: async (name?: string, avatar?: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ name, avatar }),
    });
    return handleResponse<User>(res);
  },

  // Pandals
  getPandals: async (params?: { area?: string; search?: string; crowdLevel?: string; sort?: string }): Promise<Pandal[]> => {
    const query = new URLSearchParams();
    if (params?.area) query.append('area', params.area);
    if (params?.search) query.append('search', params.search);
    if (params?.crowdLevel) query.append('crowdLevel', params.crowdLevel);
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/pandals?${query.toString()}`);
    return handleResponse<Pandal[]>(res);
  },

  getPandalById: async (id: string): Promise<Pandal> => {
    const res = await fetch(`${API_BASE}/pandals/${id}`);
    return handleResponse<Pandal>(res);
  },

  createPandal: async (data: Partial<Pandal>): Promise<Pandal> => {
    const res = await fetch(`${API_BASE}/pandals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Pandal>(res);
  },

  updatePandal: async (id: string, data: Partial<Pandal>): Promise<Pandal> => {
    const res = await fetch(`${API_BASE}/pandals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Pandal>(res);
  },

  deletePandal: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/pandals/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // Challenges
  getChallenges: async (): Promise<Challenge[]> => {
    const res = await fetch(`${API_BASE}/challenges`);
    return handleResponse<Challenge[]>(res);
  },

  getChallengeById: async (id: string): Promise<Challenge> => {
    const res = await fetch(`${API_BASE}/challenges/${id}`);
    return handleResponse<Challenge>(res);
  },

  createChallenge: async (data: Partial<Challenge>): Promise<Challenge> => {
    const res = await fetch(`${API_BASE}/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Challenge>(res);
  },

  updateChallenge: async (id: string, data: Partial<Challenge>): Promise<Challenge> => {
    const res = await fetch(`${API_BASE}/challenges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Challenge>(res);
  },

  deleteChallenge: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/challenges/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // Submissions
  submitChallenge: async (challengeId: string, image: string, latitude?: number, longitude?: number, notes?: string): Promise<Submission> => {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ challengeId, image, latitude, longitude, notes }),
    });
    return handleResponse<Submission>(res);
  },

  getMySubmissions: async (): Promise<Submission[]> => {
    const token = localStorage.getItem('mumbai_ganpati_token');
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/submissions/my`, {
        headers: { ...getAuthHeader() },
      });
      if (res.status === 401) {
        return [];
      }
      return handleResponse<Submission[]>(res);
    } catch {
      return [];
    }
  },

  getAllSubmissions: async (): Promise<Submission[]> => {
    const res = await fetch(`${API_BASE}/submissions`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Submission[]>(res);
  },

  getSubmissions: async (): Promise<Submission[]> => {
    return api.getAllSubmissions();
  },

  approveSubmission: async (id: string): Promise<{ message: string; submission: Submission; awardedPoints: number }> => {
    const res = await fetch(`${API_BASE}/submissions/${id}/approve`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string; submission: Submission; awardedPoints: number }>(res);
  },

  rejectSubmission: async (id: string, rejectionReason?: string): Promise<{ message: string; submission: Submission }> => {
    const res = await fetch(`${API_BASE}/submissions/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ rejectionReason }),
    });
    return handleResponse<{ message: string; submission: Submission }>(res);
  },

  reviewSubmission: async (id: string, status: 'Approved' | 'Rejected', reason?: string): Promise<any> => {
    if (status === 'Approved') {
      return api.approveSubmission(id);
    } else {
      return api.rejectSubmission(id, reason);
    }
  },

  // Favorites aliases
  getFavorites: async (): Promise<Pandal[]> => {
    const token = localStorage.getItem('mumbai_ganpati_token');
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/favorites`, {
        headers: { ...getAuthHeader() },
      });
      if (res.status === 401) {
        return [];
      }
      return handleResponse<Pandal[]>(res);
    } catch {
      return [];
    }
  },

  toggleFavorite: async (pandalId: string): Promise<string[]> => {
    const current = await api.getFavorites();
    const isFav = current.some((p) => p.id === pandalId);
    if (isFav) {
      await api.removeFavorite(pandalId);
    } else {
      await api.addFavorite(pandalId);
    }
    const updated = await api.getFavorites();
    return updated.map((p) => p.id);
  },

  addFavorite: async (pandalId: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/favorites/${pandalId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  removeFavorite: async (pandalId: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/favorites/${pandalId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // Planner
  getPlanner: async (): Promise<PlannerItem[]> => {
    const token = localStorage.getItem('mumbai_ganpati_token');
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/planner`, {
        headers: { ...getAuthHeader() },
      });
      if (res.status === 401) {
        return [];
      }
      return handleResponse<PlannerItem[]>(res);
    } catch {
      return [];
    }
  },

  getPlannerItems: async (): Promise<string[]> => {
    const items = await api.getPlanner();
    return items.map((i) => i.pandalId);
  },

  addToPlanner: async (pandalId: string): Promise<string[]> => {
    await api.addPlannerItem(pandalId);
    return api.getPlannerItems();
  },

  removeFromPlanner: async (pandalId: string): Promise<string[]> => {
    const items = await api.getPlanner();
    const match = items.find((i) => i.pandalId === pandalId);
    if (match) {
      await api.deletePlannerItem(match.id);
    }
    return api.getPlannerItems();
  },

  addPlannerItem: async (pandalId: string, visitDate?: string, visitTime?: string): Promise<PlannerItem> => {
    const res = await fetch(`${API_BASE}/planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ pandalId, visitDate, visitTime }),
    });
    return handleResponse<PlannerItem>(res);
  },

  updatePlannerItem: async (id: string, data: { visitDate?: string; visitTime?: string; order?: number }): Promise<PlannerItem> => {
    const res = await fetch(`${API_BASE}/planner/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<PlannerItem>(res);
  },

  deletePlannerItem: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/planner/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // Leaderboard
  getLeaderboard: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return handleResponse<User[]>(res);
  },

  // Admin
  verifyAdminPassword: async (password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    const res = await fetch(`${API_BASE}/admin/verify-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ password }),
    });
    return handleResponse<{ success: boolean; message: string; user?: User }>(res);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AdminStats>(res);
  },

  getAdminUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<User[]>(res);
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<{ message: string; user: User }> => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role }),
    });
    return handleResponse<{ message: string; user: User }>(res);
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ message: string }>(res);
  },

  // Upload
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    const data = await handleResponse<{ url: string }>(res);
    return data.url;
  },

  // AI Route Planning
  planAiItinerary: async (params: {
    startLocation: { name: string; latitude: number; longitude: number };
    pandalIds?: string[];
    startTime?: string;
    tourDate?: string;
    travelMode?: 'walking' | 'transit' | 'driving';
    pace?: 'relaxed' | 'balanced' | 'fast';
  }): Promise<{ success: boolean; itinerary: AiItinerary; source: string }> => {
    const res = await fetch(`${API_BASE}/ai/plan-itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(params),
    });
    return handleResponse<{ success: boolean; itinerary: AiItinerary; source: string }>(res);
  },

  // Pandal Partner + Community
  getMyVisitPlan: async (): Promise<import('../types').VisitPlan | null> => {
    const res = await fetch(`${API_BASE}/community/plans/me`, { headers: getAuthHeader() });
    return handleResponse<import('../types').VisitPlan | null>(res);
  },

  saveVisitPlan: async (data: Partial<import('../types').VisitPlan>): Promise<import('../types').VisitPlan> => {
    const res = await fetch(`${API_BASE}/community/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<import('../types').VisitPlan>(res);
  },

  deleteVisitPlan: async (): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/community/plans/me`, { method: 'DELETE', headers: getAuthHeader() });
    return handleResponse<{ message: string }>(res);
  },

  getPartnerMatches: async (filters?: Record<string, string>): Promise<any[]> => {
    const q = new URLSearchParams(filters || {});
    const res = await fetch(`${API_BASE}/community/matches?${q}`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  getConnections: async (): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/community/connections`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  sendConnection: async (userId: string) => {
    const res = await fetch(`${API_BASE}/community/connections/${userId}`, { method: 'POST', headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  updateConnection: async (id: string, action: 'accept' | 'decline' | 'cancel') => {
    const res = await fetch(`${API_BASE}/community/connections/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ action }),
    });
    return handleResponse<any>(res);
  },

  removeConnection: async (id: string) => {
    const res = await fetch(`${API_BASE}/community/connections/${id}`, { method: 'DELETE', headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  getConversations: async (): Promise<import('../types').ChatConversation[]> => {
    const res = await fetch(`${API_BASE}/community/conversations`, { headers: getAuthHeader() });
    return handleResponse<import('../types').ChatConversation[]>(res);
  },

  getMessages: async (conversationId: string): Promise<import('../types').ChatMessage[]> => {
    const res = await fetch(`${API_BASE}/community/conversations/${conversationId}/messages`, { headers: getAuthHeader() });
    return handleResponse<import('../types').ChatMessage[]>(res);
  },

  sendMessage: async (conversationId: string, text: string): Promise<import('../types').ChatMessage> => {
    const res = await fetch(`${API_BASE}/community/conversations/${conversationId}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ text }),
    });
    return handleResponse<import('../types').ChatMessage>(res);
  },

  markConversationRead: async (conversationId: string) => {
    const res = await fetch(`${API_BASE}/community/conversations/${conversationId}/read`, { method: 'PUT', headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  deleteConversation: async (conversationId: string) => {
    const res = await fetch(`${API_BASE}/community/conversations/${conversationId}`, { method: 'DELETE', headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  getNotifications: async (): Promise<import('../types').CommunityNotification[]> => {
    const res = await fetch(`${API_BASE}/community/notifications`, { headers: getAuthHeader() });
    return handleResponse<import('../types').CommunityNotification[]>(res);
  },

  markNotificationsRead: async () => {
    const res = await fetch(`${API_BASE}/community/notifications/read-all`, { method: 'PUT', headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  createSharedVisitPlan: async (data: Partial<import('../types').SharedVisitPlan>) => {
    const res = await fetch(`${API_BASE}/community/shared-plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data),
    });
    return handleResponse<import('../types').SharedVisitPlan>(res);
  },

  getSharedVisitPlans: async (conversationId: string): Promise<import('../types').SharedVisitPlan[]> => {
    const res = await fetch(`${API_BASE}/community/shared-plans/${conversationId}`, { headers: getAuthHeader() });
    return handleResponse<import('../types').SharedVisitPlan[]>(res);
  },

  updateSharedVisitPlan: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/community/shared-plans/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data),
    });
    return handleResponse<import('../types').SharedVisitPlan>(res);
  },

  blockUser: async (userId: string) => {
    const res = await fetch(`${API_BASE}/community/block/${userId}`, { method: 'POST', headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  reportUser: async (userId: string, reason: string) => {
    const res = await fetch(`${API_BASE}/community/report/${userId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ reason }),
    });
    return handleResponse<any>(res);
  },

};
