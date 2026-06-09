import { db } from "@/lib/db";

/**
 * Retrieves and formats the most relevant user memories to inject into the AI prompt.
 * Uses recency + type-based retrieval (no vector embeddings required for V1).
 *
 * Strategy:
 * 1. Active goals — always included (the user's declared intentions)
 * 2. Recent echoes — last 10, sorted by recency
 * 3. Recent reflections — last 5
 * 4. Unlocked capsules — themes from the past
 * 5. Unresolved predictions — what the user believes about the future
 * 6. Future self profile — core values and long-term goals
 */
export async function buildMemoryContext(userId: string): Promise<string> {
  const [
    futureSelf,
    activeGoals,
    recentEchoes,
    recentReflections,
    openPredictions,
    unlockedCapsules,
    recentMemories,
  ] = await Promise.all([
    db.futureSelfProfile.findUnique({
      where: { userId },
      select: { coreValues: true, lifeGoals: true, bio: true, futureYear: true },
    }),
    db.goal.findMany({
      where: { userId, status: "ACTIVE" },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: { title: true, description: true, progress: true, targetDate: true },
    }),
    db.echo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { type: true, title: true, content: true, mood: true, targetDate: true, createdAt: true },
    }),
    db.reflection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { content: true, mood: true, createdAt: true },
    }),
    db.prediction.findMany({
      where: { userId, isResolved: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { content: true, targetYear: true },
    }),
    db.timeCapsule.findMany({
      where: { userId, isUnlocked: true },
      orderBy: { unlockedAt: "desc" },
      take: 3,
      select: { title: true, content: true, duration: true, createdAt: true },
    }),
    db.memory.findMany({
      where: { userId },
      orderBy: [{ importance: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: { content: true, type: true, importance: true },
    }),
  ]);

  const sections: string[] = [];

  // Future Self Profile
  if (futureSelf) {
    const parts: string[] = [`Future Self Profile (Target Year: ${futureSelf.futureYear})`];
    if (futureSelf.coreValues.length > 0) {
      parts.push(`Core Values: ${futureSelf.coreValues.join(", ")}`);
    }
    if (futureSelf.lifeGoals.length > 0) {
      parts.push(`Stated Life Goals:\n${futureSelf.lifeGoals.map((g) => `  - ${g}`).join("\n")}`);
    }
    if (futureSelf.bio) {
      parts.push(`Personal Bio: ${futureSelf.bio}`);
    }
    sections.push(parts.join("\n"));
  }

  // Active Goals
  if (activeGoals.length > 0) {
    const goalLines = activeGoals.map((g) => {
      const progress = g.progress > 0 ? ` (${g.progress}% complete)` : "";
      const deadline = g.targetDate ? ` — target: ${new Date(g.targetDate).getFullYear()}` : "";
      return `  - ${g.title}${progress}${deadline}${g.description ? `: ${g.description.slice(0, 100)}` : ""}`;
    });
    sections.push(`Active Goals:\n${goalLines.join("\n")}`);
  }

  // Recent Echoes
  if (recentEchoes.length > 0) {
    const echoLines = recentEchoes.map((e) => {
      const age = Math.floor((Date.now() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      const ageStr = age === 0 ? "today" : age === 1 ? "yesterday" : `${age} days ago`;
      return `  [${e.type.toLowerCase()} — ${e.mood.toLowerCase()} — ${ageStr}] "${e.title}": ${e.content.slice(0, 150)}${e.content.length > 150 ? "..." : ""}`;
    });
    sections.push(`Recent Echoes (what the user has been recording):\n${echoLines.join("\n")}`);
  }

  // Reflections
  if (recentReflections.length > 0) {
    const reflLines = recentReflections.map((r) => {
      const age = Math.floor((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return `  [${r.mood.toLowerCase()}, ${age}d ago]: ${r.content.slice(0, 200)}`;
    });
    sections.push(`Recent Reflections:\n${reflLines.join("\n")}`);
  }

  // Predictions
  if (openPredictions.length > 0) {
    const predLines = openPredictions.map(
      (p) => `  - [Target: ${p.targetYear}] ${p.content.slice(0, 120)}`
    );
    sections.push(`Open Predictions (what the user believes about the future):\n${predLines.join("\n")}`);
  }

  // Unlocked Capsules
  if (unlockedCapsules.length > 0) {
    const capsuleLines = unlockedCapsules.map(
      (c) =>
        `  - "${c.title}" (written ${new Date(c.createdAt).getFullYear()}): ${c.content.slice(0, 120)}`
    );
    sections.push(`Opened Time Capsules (messages from the user's past):\n${capsuleLines.join("\n")}`);
  }

  // High-importance memories
  const highImportanceMemories = recentMemories.filter((m) => m.importance >= 1.5);
  if (highImportanceMemories.length > 0) {
    const memLines = highImportanceMemories.map((m) => `  - ${m.content.slice(0, 150)}`);
    sections.push(`Key Memories:\n${memLines.join("\n")}`);
  }

  if (sections.length === 0) {
    return "No personal context available yet. Respond thoughtfully based on the conversation alone.";
  }

  return `
═══════════════════════════════════
PERSONAL CONTEXT (Private Memory)
═══════════════════════════════════
${sections.join("\n\n")}
═══════════════════════════════════

Use this context naturally in your response. Do not explicitly list or recite these items — let them inform the texture and specificity of your reply.
  `.trim();
}

/**
 * Saves a new memory entry when something significant happens.
 */
export async function saveMemory(
  userId: string,
  content: string,
  type: "ECHO" | "REFLECTION" | "GOAL" | "PREDICTION" | "CAPSULE" | "MILESTONE",
  sourceId?: string,
  importance: number = 1.0
) {
  return db.memory.create({
    data: {
      userId,
      content,
      type,
      sourceId,
      importance,
    },
  });
}
