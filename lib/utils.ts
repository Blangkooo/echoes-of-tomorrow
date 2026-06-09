import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance, format, differenceInDays, addMonths, addYears } from "date-fns";
import { CapsuleDuration } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = differenceInDays(date, now);

  if (diffDays < 0) {
    return formatDistance(date, now, { addSuffix: true });
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 30) {
    return `In ${Math.floor(diffDays / 7)} weeks`;
  } else if (diffDays < 365) {
    return `In ${Math.floor(diffDays / 30)} months`;
  } else {
    return `In ${Math.floor(diffDays / 365)} years`;
  }
}

export function formatDisplayDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy");
}

export function formatYear(dateString: string): string {
  return format(new Date(dateString), "yyyy");
}

export function getUnlockDate(duration: CapsuleDuration): string {
  const now = new Date();
  switch (duration) {
    case "1month":
      return addMonths(now, 1).toISOString();
    case "1year":
      return addYears(now, 1).toISOString();
    case "5years":
      return addYears(now, 5).toISOString();
    case "10years":
      return addYears(now, 10).toISOString();
  }
}

export function getDurationLabel(duration: CapsuleDuration): string {
  switch (duration) {
    case "1month":
      return "1 Month";
    case "1year":
      return "1 Year";
    case "5years":
      return "5 Years";
    case "10years":
      return "10 Years";
  }
}

export function getTimeUntilUnlock(unlockDateString: string): string {
  const unlockDate = new Date(unlockDateString);
  const now = new Date();
  if (unlockDate <= now) return "Ready to unlock!";
  return formatDistance(unlockDate, now, { addSuffix: true });
}

export function calculateProgress(current: number, max: number): number {
  return Math.min(Math.round((current / max) * 100), 100);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export const echoTypeConfig = {
  message: {
    label: "Message",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    gradient: "from-blue-500/20 to-blue-600/10",
    icon: "MessageCircle",
  },
  prediction: {
    label: "Prediction",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    gradient: "from-purple-500/20 to-purple-600/10",
    icon: "Sparkles",
  },
  dream: {
    label: "Dream",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    gradient: "from-pink-500/20 to-pink-600/10",
    icon: "Moon",
  },
  challenge: {
    label: "Challenge",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    gradient: "from-orange-500/20 to-orange-600/10",
    icon: "Zap",
  },
  goal: {
    label: "Goal",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    gradient: "from-green-500/20 to-green-600/10",
    icon: "Target",
  },
  memory: {
    label: "Memory",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    gradient: "from-amber-500/20 to-amber-600/10",
    icon: "BookOpen",
  },
  question: {
    label: "Question",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    gradient: "from-cyan-500/20 to-cyan-600/10",
    icon: "HelpCircle",
  },
};

export const moodConfig = {
  hopeful: { emoji: "🌟", label: "Hopeful", color: "text-yellow-400" },
  anxious: { emoji: "💭", label: "Anxious", color: "text-blue-300" },
  excited: { emoji: "⚡", label: "Excited", color: "text-orange-400" },
  reflective: { emoji: "🌊", label: "Reflective", color: "text-cyan-400" },
  determined: { emoji: "🔥", label: "Determined", color: "text-red-400" },
  nostalgic: { emoji: "🍂", label: "Nostalgic", color: "text-amber-400" },
  inspired: { emoji: "✨", label: "Inspired", color: "text-purple-400" },
};
