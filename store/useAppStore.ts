"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  Echo,
  TimeCapsule,
  ParallelUniverse,
  UserProfile,
  ChatMessage,
  EchoType,
  EchoMood,
  CapsuleDuration,
} from "@/types";
import {
  SAMPLE_ECHOES,
  SAMPLE_CAPSULES,
  SAMPLE_UNIVERSES,
  SAMPLE_USER,
  SAMPLE_CHAT_MESSAGES,
  SAMPLE_ACHIEVEMENTS,
} from "@/lib/sampleData";
import { generateFutureResponse, generateFutureSelfReply, generateCapsuleReflection } from "@/lib/mockAI";
import { getUnlockDate } from "@/lib/utils";

interface AppState {
  user: UserProfile;
  echoes: Echo[];
  capsules: TimeCapsule[];
  universes: ParallelUniverse[];
  chatMessages: ChatMessage[];
  isTyping: boolean;
  activeEchoFilter: EchoType | "all";
  sidebarCollapsed: boolean;

  // Echo actions
  createEcho: (data: {
    type: EchoType;
    title: string;
    content: string;
    targetDate: string;
    tags: string[];
    mood: EchoMood;
  }) => Echo;
  deleteEcho: (id: string) => void;
  pinEcho: (id: string) => void;
  generateFutureResponse: (echoId: string) => void;
  setEchoFilter: (filter: EchoType | "all") => void;

  // Capsule actions
  createCapsule: (data: {
    title: string;
    content: string;
    duration: CapsuleDuration;
    tags: string[];
    mood: EchoMood;
  }) => TimeCapsule;
  unlockCapsule: (id: string) => void;
  deleteCapsule: (id: string) => void;

  // Chat actions
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // Universe actions
  createUniverse: (data: Partial<ParallelUniverse>) => ParallelUniverse;
  toggleUniverseVisibility: (id: string) => void;
  deleteUniverse: (id: string) => void;

  // UI actions
  toggleSidebar: () => void;
  addLegacyPoints: (points: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: { ...SAMPLE_USER, achievements: SAMPLE_ACHIEVEMENTS },
      echoes: SAMPLE_ECHOES,
      capsules: SAMPLE_CAPSULES,
      universes: SAMPLE_UNIVERSES,
      chatMessages: SAMPLE_CHAT_MESSAGES,
      isTyping: false,
      activeEchoFilter: "all",
      sidebarCollapsed: false,

      createEcho: (data) => {
        const newEcho: Echo = {
          id: uuidv4(),
          ...data,
          createdAt: new Date().toISOString(),
          isLocked: false,
          isPinned: false,
          viewCount: 0,
        };
        set((state) => ({
          echoes: [newEcho, ...state.echoes],
          user: {
            ...state.user,
            totalEchoes: state.user.totalEchoes + 1,
            legacyPoints: state.user.legacyPoints + 10,
            streak: state.user.streak + 1,
          },
        }));
        return newEcho;
      },

      deleteEcho: (id) => {
        set((state) => ({
          echoes: state.echoes.filter((e) => e.id !== id),
          user: {
            ...state.user,
            totalEchoes: Math.max(0, state.user.totalEchoes - 1),
          },
        }));
      },

      pinEcho: (id) => {
        set((state) => ({
          echoes: state.echoes.map((e) =>
            e.id === id ? { ...e, isPinned: !e.isPinned } : e
          ),
        }));
      },

      generateFutureResponse: (echoId) => {
        const echo = get().echoes.find((e) => e.id === echoId);
        if (!echo) return;
        const response = generateFutureResponse(echo.type, echo.content, echo.mood);
        set((state) => ({
          echoes: state.echoes.map((e) =>
            e.id === echoId ? { ...e, futureResponse: response } : e
          ),
          user: {
            ...state.user,
            legacyPoints: state.user.legacyPoints + 5,
          },
        }));
      },

      setEchoFilter: (filter) => {
        set({ activeEchoFilter: filter });
      },

      createCapsule: (data) => {
        const newCapsule: TimeCapsule = {
          id: uuidv4(),
          ...data,
          lockedUntil: getUnlockDate(data.duration),
          createdAt: new Date().toISOString(),
          isUnlocked: false,
        };
        set((state) => ({
          capsules: [newCapsule, ...state.capsules],
          user: {
            ...state.user,
            totalCapsules: state.user.totalCapsules + 1,
            legacyPoints: state.user.legacyPoints + 25,
          },
        }));
        return newCapsule;
      },

      unlockCapsule: (id) => {
        const capsule = get().capsules.find((c) => c.id === id);
        if (!capsule) return;
        const reflection = generateCapsuleReflection(capsule.content, capsule.duration);
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id
              ? {
                  ...c,
                  isUnlocked: true,
                  aiReflection: reflection.aiReflection,
                  growthComparison: reflection.growthComparison,
                  milestoneSummary: reflection.milestoneSummary,
                }
              : c
          ),
          user: {
            ...state.user,
            legacyPoints: state.user.legacyPoints + 50,
          },
        }));
      },

      deleteCapsule: (id) => {
        set((state) => ({
          capsules: state.capsules.filter((c) => c.id !== id),
          user: {
            ...state.user,
            totalCapsules: Math.max(0, state.user.totalCapsules - 1),
          },
        }));
      },

      sendMessage: async (content) => {
        const userMessage: ChatMessage = {
          id: uuidv4(),
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, userMessage],
          isTyping: true,
        }));

        // Simulate AI thinking delay
        await new Promise((resolve) =>
          setTimeout(resolve, 1200 + Math.random() * 800)
        );

        const response = generateFutureSelfReply(content);
        const futureMessage: ChatMessage = {
          id: uuidv4(),
          role: "future-self",
          content: response,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, futureMessage],
          isTyping: false,
          user: {
            ...state.user,
            legacyPoints: state.user.legacyPoints + 3,
          },
        }));
      },

      clearChat: () => {
        set({ chatMessages: [] });
      },

      createUniverse: (data) => {
        const newUniverse: ParallelUniverse = {
          id: uuidv4(),
          title: data.title || "Untitled Universe",
          description: data.description || "",
          decisionPoint: data.decisionPoint || "",
          divergenceYear: data.divergenceYear || new Date().getFullYear(),
          timeline: data.timeline || [],
          probability: data.probability || Math.floor(Math.random() * 40 + 10),
          mood: data.mood || "Unknown",
          tags: data.tags || [],
          isPublic: data.isPublic ?? false,
          viewCount: 0,
          gradient: data.gradient || "from-purple-500 to-blue-600",
        };
        set((state) => ({
          universes: [newUniverse, ...state.universes],
          user: {
            ...state.user,
            totalUniverses: state.user.totalUniverses + 1,
            legacyPoints: state.user.legacyPoints + 20,
          },
        }));
        return newUniverse;
      },

      toggleUniverseVisibility: (id) => {
        set((state) => ({
          universes: state.universes.map((u) =>
            u.id === id ? { ...u, isPublic: !u.isPublic } : u
          ),
        }));
      },

      deleteUniverse: (id) => {
        set((state) => ({
          universes: state.universes.filter((u) => u.id !== id),
          user: {
            ...state.user,
            totalUniverses: Math.max(0, state.user.totalUniverses - 1),
          },
        }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      addLegacyPoints: (points) => {
        set((state) => ({
          user: {
            ...state.user,
            legacyPoints: state.user.legacyPoints + points,
          },
        }));
      },
    }),
    {
      name: "echoes-store",
      partialize: (state) => ({
        echoes: state.echoes,
        capsules: state.capsules,
        universes: state.universes,
        chatMessages: state.chatMessages,
        user: state.user,
      }),
    }
  )
);
