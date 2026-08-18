export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  points: number;
  completedChallenges: number;
  badges: string[];
  createdAt: string;
}

export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Heavy';

export interface Pandal {
  id: string;
  _id?: string;
  name: string;
  description: string;
  history: string;
  images: string[];
  address: string;
  area: string; // e.g. "Lalbaug", "Chinchpokli", "Sion", "Khetwadi", "Andheri", "Girgaon", "Dadar", "Fort"
  latitude: number;
  longitude: number;
  darshanStart: string;
  darshanEnd: string;
  crowdLevel: CrowdLevel;
  facilities: string[];
  popularity: number; // 0 to 100
  famousFeatures: string[];
  createdAt: string;
}

export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Challenge {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category?: string;
  image: string;
  pandalId?: string;
  pandalName?: string;
  latitude: number;
  longitude: number;
  points: number;
  difficulty: ChallengeDifficulty;
  deadline: string;
  createdAt: string;
}

export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Submission {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  challengeId: string;
  challengeTitle: string;
  image: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Favorite {
  id: string;
  _id?: string;
  userId: string;
  pandalId: string;
  createdAt: string;
}

export interface PlannerItem {
  id: string;
  _id?: string;
  userId: string;
  pandalId: string;
  pandal?: Pandal;
  visitDate: string;
  visitTime: string;
  order: number;
  createdAt: string;
}


export type TravelPreference = 'Walking' | 'Bike' | 'Car' | 'Public Transport';
export type GroupPreference = 'Solo partner' | 'Small group';

export interface VisitPlan {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  preferredDate: string;
  preferredTime: string;
  area: string;
  pandalIds: string[];
  pandalNames: string[];
  numberOfPandals: number;
  travelPreference: TravelPreference;
  groupPreference: GroupPreference;
  introduction: string;
  createdAt: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  participant: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  readBy: string[];
}

export interface CommunityNotification {
  id: string;
  userId: string;
  type: 'connection_request' | 'connection_accepted' | 'message' | 'visit_plan';
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface SharedVisitPlan {
  id: string;
  conversationId: string;
  creatorId: string;
  pandalId: string;
  pandalName: string;
  date: string;
  time: string;
  meetingPoint: string;
  travelMethod: TravelPreference;
  notes: string;
  status: 'pending' | 'confirmed' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  totalPandals: number;
  totalChallenges: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  totalPointsAwarded: number;
}

export interface AiItineraryStop {
  stepNumber: number;
  pandalId: string;
  pandalName: string;
  area: string;
  latitude: number;
  longitude: number;
  estimatedArrival: string;
  estimatedDurationMin: number;
  crowdForecast: string;
  travelFromPrev: string;
  transitInstruction: string;
  tip: string;
}

export interface AiItinerary {
  itineraryTitle: string;
  summary: string;
  totalDistanceKm: number;
  estimatedTotalHours: string;
  optimalStartRecommended: string;
  stops: AiItineraryStop[];
  aiInsights: string[];
}

