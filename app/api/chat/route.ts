import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { buildMemoryContext } from "@/lib/memory";
import { PERSONALITIES, AIMode } from "@/lib/ai-personalities";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(4000),
    })
  ).min(1).max(50),
  mode: z.enum(["OPTIMISTIC", "REALISTIC", "MENTOR", "ENTREPRENEUR", "CREATIVE"]).default("MENTOR"),
  conversationId: z.string().cuid().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  // Rate limiting
  const { allowed, remaining } = await checkRateLimit(userId, "chat");
  if (!allowed) {
    return new Response("Rate limit exceeded. Please wait before sending another message.", {
      status: 429,
      headers: { "X-RateLimit-Remaining": "0" },
    });
  }

  // Parse and validate request
  let body: z.infer<typeof requestSchema>;
  try {
    const raw = await req.json();
    body = requestSchema.parse(raw);
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  const { messages, mode, conversationId } = body;

  // Get or create conversation
  let convId = conversationId;
  if (!convId) {
    const conv = await db.conversation.create({
      data: {
        userId,
        mode: mode as AIMode,
        title: messages[0]?.content?.slice(0, 60) ?? "New conversation",
      },
    });
    convId = conv.id;
  }

  // Retrieve memory context
  const memoryContext = await buildMemoryContext(userId);

  // Get user name for the prompt
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const userName = user?.name || "the user";

  // Get personality system prompt
  const personality = PERSONALITIES[mode];
  const systemPrompt = personality.buildSystemPrompt(userName, memoryContext);

  // Save user message to DB (last message)
  const lastUserMessage = messages[messages.length - 1];
  if (lastUserMessage?.role === "user") {
    await db.message.create({
      data: {
        conversationId: convId,
        role: "user",
        content: lastUserMessage.content,
      },
    });
  }

  // Stream response
  const result = streamText({
    model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: 0.85,
    maxTokens: 600,
    onFinish: async ({ text }) => {
      // Save assistant response to DB
      await db.message.create({
        data: {
          conversationId: convId!,
          role: "assistant",
          content: text,
        },
      });
    },
  });

  return result.toDataStreamResponse({
    headers: {
      "X-Conversation-Id": convId,
      "X-RateLimit-Remaining": remaining.toString(),
    },
  });
}
