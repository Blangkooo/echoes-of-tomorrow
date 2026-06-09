import { EchoType, EchoMood } from "@/types";

const futureResponses: Record<EchoType, string[]> = {
  goal: [
    "You achieved this. It took longer than planned and looked different than expected — but the core of what you wanted, you built. The journey taught you more than the destination.",
    "This goal became the foundation for everything else. When you doubted yourself, revisiting this moment reminded you what you were capable of. You exceeded it.",
    "You didn't just reach this goal — you transformed it. Halfway through you realized the original target was too small. You dreamed bigger and delivered.",
    "This was hard. There were months you nearly gave up. But you kept showing up, and slowly, then all at once, it happened. Your future self is grateful for your persistence.",
  ],
  prediction: [
    "This prediction was more accurate than you knew at the time. The seeds you saw were growing faster than anyone realized. Your instincts were right — trust them more.",
    "Half right, half wrong — and the wrong half taught you something profound about your own assumptions. The pattern you missed became your next big insight.",
    "You saw this coming before most people. That foresight put you in the right position at exactly the right time. Intuition is intelligence that moves faster than logic.",
    "The world confirmed what you felt in your bones. Your ability to read signals before they become obvious is one of your most underrated gifts.",
  ],
  dream: [
    "This dream evolved. The mountain cabin became a village in Portugal. The quiet you wanted found you in a different shape. Dreams know where they're going even when we don't.",
    "You're living a version of this now. Not identical — reality never is. But the *feeling* you were reaching for? That's yours. You built the life around the feeling, not the picture.",
    "This dream protected you during the hardest years. When reality felt unbearable, this vision was the thread you followed back to yourself. It was never just a fantasy.",
    "Some dreams are meant to point you in a direction, not be a destination. This one showed you what you valued: freedom, beauty, depth. You built a life around those values.",
  ],
  challenge: [
    "You completed it. Week 14 was the crisis point — you almost quit. But you didn't. The completion changed something fundamental about what you believe you can do.",
    "You finished, and then immediately signed up for the next one. That's who you are. Challenges don't intimidate you anymore — they energize you. You became someone who seeks hard things.",
    "The challenge took longer than expected. You needed two attempts. The failure on the first try taught you more than easy success would have. You crossed the finish line stronger for it.",
    "Completing this opened a door to a community of people you never expected to find. The challenge was really an initiation into a tribe you didn't know you belonged to.",
  ],
  message: [
    "Reading this now brings tears I didn't expect. You wrote exactly what I needed to hear. How did you know? You knew because you were paying attention. Keep paying attention.",
    "This message found me at the exact right moment. I had almost forgotten this version of us. Thank you for writing it down. Thank you for trusting the future.",
    "Five years ago you wrote this, terrified and hopeful in equal measure. Today I'm reading it with a smile, because everything you feared, you survived — and everything you hoped, you found.",
    "I want you to know: this message arrived at the right time. When I needed to remember who we are underneath all the noise. You were wiser than you knew.",
  ],
  memory: [
    "This moment became a story you told many times. It grew richer each telling. The details you captured here are the ones that matter most — you already knew what to preserve.",
    "Looking back at this memory, I see things younger you couldn't yet see. The significance of what happened here only fully revealed itself years later. You were right to capture it.",
    "This is the memory that defined a chapter. When people ask about the turning point, this is the story you tell. You sensed it mattered before you knew why.",
    "Time is kind to this memory. Some of the pain has softened; the joy has deepened. You made the right choice to write it down before time could reshape it completely.",
  ],
  question: [
    "The answer arrived slowly, through lived experience rather than logic. And yes — it's a good answer. Better than you hoped when you wrote the question.",
    "You found the answer, then you found a better question. That's always how it goes with the real ones. The question you asked here was just the entrance to a much deeper inquiry.",
    "Your 80-year-old self would recognize the person who wrote this question. You were already becoming who you needed to be. The question was the proof.",
    "Some questions answer themselves through how you live. You wrote this wondering. Years later, your life answered it — not in words, but in choices made, and roads taken.",
  ],
};

const futureAdvice = [
  "The version of you writing these echoes is braver than they know. Fear is just excitement without permission — you have permission.",
  "Your instincts about people are usually right on the first meeting. The ones you want to keep investing in, invest more. The ones you feel unsure about, trust that feeling.",
  "The project you keep delaying because it's 'not ready' — launch it this week. Imperfect and alive beats perfect and imaginary every single time.",
  "The skill you're learning right now will matter more in five years than you can currently imagine. Don't stop. The compound interest on learning is exponential.",
  "Call the friend you've been meaning to call. Not a text — an actual call. The connection you maintain now will be the one that sustains you in the hard years ahead.",
  "The money will sort itself out if you keep building things of real value. Don't let financial anxiety override creative courage. Courage is the investment that compounds.",
  "You're not behind. I know it feels that way. But you're exactly where you need to be, building exactly what you need to build, becoming exactly who you need to become. The timing is not accidental.",
  "The creative block you're experiencing right now breaks on the other side of a long walk, a good sleep, or a real conversation. The answer is resting in you. Give it space.",
  "The relationship that's been difficult — have the honest conversation. Not to win, not to be right, but to understand. You'll be surprised what you learn about yourself.",
  "Your morning routine is more powerful than you realize. The first hour sets the frequency for everything that follows. Guard it fiercely.",
];

const parallelUniverseNarratives = [
  "In this timeline, the decision you made at the crossroads sent ripples through every subsequent choice. The life is recognizably yours, but refracted through a different lens — same values, different expression.",
  "This version of you is happy in ways the current you can barely imagine. The trade-offs are real and sometimes painful. But the core of who you are found its expression here in full color.",
  "What's striking about this universe is how quickly the initial difference compounds. Small divergence, enormous consequence. This is the butterfly effect of human lives.",
  "This alternate path had shadows you didn't expect. But it also had gifts. The version of you who walked this road is not better or worse — just different. And deeply themselves.",
];

export function generateFutureResponse(
  type: EchoType,
  content: string,
  mood: EchoMood
): string {
  const pool = futureResponses[type];
  const baseResponse = pool[Math.floor(Math.random() * pool.length)];

  const moodAddons: Record<EchoMood, string> = {
    hopeful: " The hope you felt when you wrote this was a compass, not just a feeling.",
    anxious: " The anxiety you felt then — it was just uncertainty wearing fear's costume. It passed.",
    excited: " Hold onto that energy. Let it carry you through the inevitable friction ahead.",
    reflective: " The reflectiveness in this moment was your wisdom already emerging.",
    determined: " That determination moved mountains. More than you know.",
    nostalgic: " What you were mourning here was also transforming. Loss and growth are the same season.",
    inspired: " The inspiration was real. You followed it faithfully.",
  };

  return baseResponse + (moodAddons[mood] || "");
}

export function generateFutureSelfReply(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("happy") || lowerMessage.includes("happiness")) {
    return "Happiness looked different than I expected from where you're standing. It's less peak-and-valley and more of a quiet hum that runs beneath everything when you're living aligned with what matters. Yes — I'm happy. Not every day, but in the deep-structure way that counts.";
  }

  if (lowerMessage.includes("mistake") || lowerMessage.includes("regret") || lowerMessage.includes("wrong")) {
    return "The mistakes you're worried about making — some of them you'll make. They'll hurt. Then they'll become the most important chapters in your story. The real mistakes are the things you don't do out of fear. Those are the ones that echo longest.";
  }

  if (lowerMessage.includes("success") || lowerMessage.includes("successful")) {
    return "Success stopped being a destination and started being a way of moving. You define it differently now. It's not about the outcome as much as the quality of attention you brought to the work. By the measure that actually matters to you — yes, deeply successful.";
  }

  if (lowerMessage.includes("love") || lowerMessage.includes("relationship") || lowerMessage.includes("partner")) {
    return "Love found you in a way that surprised you. Not where you were looking, not in the form you expected. What you needed was different from what you thought you wanted. And it's better. The relationship you're in — or will be in — teaches you more about yourself than anything else you'll experience.";
  }

  if (lowerMessage.includes("money") || lowerMessage.includes("financial") || lowerMessage.includes("rich")) {
    return "You have enough. Not excessive, but genuinely enough — to live with freedom, to be generous, to sleep without financial anxiety. The path there wasn't linear. There were lean years. But the decisions you're making now about skills and value creation? They compound beautifully.";
  }

  if (lowerMessage.includes("afraid") || lowerMessage.includes("fear") || lowerMessage.includes("scared")) {
    return "Fear visited often. That never stopped. What changed was your relationship to it. You started treating it as information instead of instruction. Every time you chose courage over comfort, you grew. The things you fear right now — you'll do them anyway. And survive. And be glad.";
  }

  if (lowerMessage.includes("advice") || lowerMessage.includes("tell me") || lowerMessage.includes("should")) {
    return futureAdvice[Math.floor(Math.random() * futureAdvice.length)];
  }

  if (lowerMessage.includes("future") || lowerMessage.includes("what happens") || lowerMessage.includes("what will")) {
    return "The future is less fixed than it feels from your vantage point. The decisions you're making right now are writing it in real time. What I can tell you is: the things you invest your attention in compound. Choose carefully what gets your deepest focus. That's where your future actually lives.";
  }

  // Default thoughtful responses
  const defaults = [
    "There's something in your question that you already know the answer to. The fact that you're asking it means the knowing is already there, just waiting for permission to surface. Trust the version of yourself that wrote this question.",
    "Looking back from here, the threads you're holding right now are more important than they seem. Keep pulling on the ones that feel most alive. Let go of the ones that feel like obligation without meaning.",
    "I could give you facts about what happens. But what would serve you more is this: the character you're building through *how* you face things matters more than the outcomes. You're building it well.",
    "The question underneath your question — that's the one worth sitting with. You're circling something real. Keep circling it. The clarity comes when you stop running from the center of it.",
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function generateTimelineNarrative(
  decisionPoint: string,
  divergenceYear: number
): string {
  return parallelUniverseNarratives[
    Math.floor(Math.random() * parallelUniverseNarratives.length)
  ];
}

export function generateCapsuleReflection(content: string, duration: string): {
  aiReflection: string;
  growthComparison: string;
  milestoneSummary: string;
} {
  return {
    aiReflection: `Looking back at who wrote this — there's a tenderness to the sincerity. You didn't know how things would unfold, but you knew what mattered. That clarity about values was more important than any specific prediction. The person reading this now has been shaped by every choice made since the writing.`,
    growthComparison: `Confidence index: +${Math.floor(15 + Math.random() * 40)}% | Goals completed: ${Math.floor(3 + Math.random() * 12)} | New skills acquired: ${Math.floor(2 + Math.random() * 8)} | Meaningful connections: +${Math.floor(5 + Math.random() * 20)}`,
    milestoneSummary: `A chapter of becoming. The person who wrote this capsule was at the beginning of something they couldn't fully name. The unlocking of this message marks a threshold — between who you were and who you've grown into through the time elapsed.`,
  };
}
