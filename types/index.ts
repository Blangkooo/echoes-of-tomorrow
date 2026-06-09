export type EchoType =
  | "message"
  | "prediction"
  | "dream"
  | "challenge"
  | "goal"
  | "memory"
  | "question";

export type EchoMood =
  | "hopeful"
  | "anxious"
  | "excited"
  | "reflective"
  | "determined"
  | "nostalgic"
  | "inspired";

export type CapsuleDuration = "1month" | "1year" | "5years" | "10years";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "cosmic";

export interface Echo {
  id: string;
  type: EchoType;
  title: string;
  content: string;
  targetDate: string;
  createdAt: string;
  isLocked: boolean;
  tags: string[];
  mood: EchoMood;
  futureResponse?: string;
  isPinned: boolean;
  viewCount: number;
  universeId?: string;
}

export interface TimeCapsule {
  id: string;
  title: string;
  content: string;
  lockedUntil: string;
  createdAt: string;
  isUnlocked: boolean;
  duration: CapsuleDuration;
  aiReflection?: string;
  growthComparison?: string;
  milestoneSummary?: string;
  tags: string[];
  mood: EchoMood;
}

export interface ChatMessage {
  id: string;
  role: "user" | "future-self";
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface ParallelUniverse {
  id: string;
  title: string;
  description: string;
  decisionPoint: string;
  divergenceYear: number;
  timeline: string[];
  probability: number;
  mood: string;
  tags: string[];
  isPublic: boolean;
  viewCount: number;
  gradient: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  category: "creation" | "streak" | "growth" | "social" | "time";
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  joinedAt: string;
  futureYear: number;
  level: number;
  legacyPoints: number;
  streak: number;
  longestStreak: number;
  achievements: Achievement[];
  futureConfidenceScore: number;
  growthIndex: number;
  title: string;
  totalEchoes: number;
  totalCapsules: number;
  totalUniverses: number;
}

export interface AnalyticsDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface GrowthMetrics {
  goalCompletionTrend: AnalyticsDataPoint[];
  emotionalTrend: AnalyticsDataPoint[];
  reflectionFrequency: AnalyticsDataPoint[];
  echosByType: { type: string; count: number; color: string }[];
  weeklyActivity: { day: string; echoes: number; capsules: number }[];
  confidenceHistory: AnalyticsDataPoint[];
}

export interface FutureTimelineEntry {
  year: number;
  title: string;
  description: string;
  probability: number;
  category: "career" | "personal" | "health" | "finance" | "adventure" | "relationships";
  isAchieved?: boolean;
}
