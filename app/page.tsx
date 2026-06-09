import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ArrowRight, MessageSquare, Lock, GitBranch, Sparkles, Clock, Infinity } from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Echoes",
    desc: "Write messages, goals, dreams, and questions to your future self. Watch them evolve as time passes.",
  },
  {
    icon: Sparkles,
    title: "Future Self AI",
    desc: "Converse with an AI that knows your history, goals, and reflections. Five distinct personalities to guide you.",
  },
  {
    icon: Lock,
    title: "Time Capsules",
    desc: "Seal messages to be opened at a specific date. Your Future Self leaves a reflection when you unlock them.",
  },
  {
    icon: GitBranch,
    title: "Parallel Paths",
    desc: "Explore alternate versions of your future. Map the roads not taken alongside the one you're on.",
  },
  {
    icon: Clock,
    title: "Living Timeline",
    desc: "Every echo, capsule, and milestone forms a continuous story — your life, charted across time.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/6 bg-[#0A0A0A]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FACC15] flex items-center justify-center">
            <Infinity className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-semibold">Echoes of Tomorrow</span>
        </div>
        <Link
          href="/signin"
          className="flex items-center gap-1.5 text-sm font-medium text-[#0A0A0A] bg-[#FACC15] hover:bg-[#EAB308] px-4 py-2 rounded-xl transition-colors"
        >
          Sign in
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6 pt-20 pb-16 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FACC15]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
            <span className="text-xs font-medium text-[#FACC15]">Messages across time</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Write to the person
            <br />
            <span className="text-[#FACC15]">you&apos;re becoming</span>
          </h1>

          <p className="text-lg text-[#A3A3A3] max-w-xl mx-auto mb-10 leading-relaxed">
            Echoes of Tomorrow is a reflective space to communicate with your future self — record your journey, seal time capsules, and converse with an AI that knows your story.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 bg-[#FACC15] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#EAB308] transition-colors"
            >
              Begin your journey
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#FAFAFA] mb-3">A different kind of journal</h2>
            <p className="text-[#A3A3A3] max-w-md mx-auto">
              Not just a record of who you were — a dialogue with who you&apos;re becoming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#171717] border border-white/6 rounded-xl p-6 hover:border-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FACC15]/10 flex items-center justify-center mb-4">
                  <Icon className="w-4.5 h-4.5 text-[#FACC15]" />
                </div>
                <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">{title}</h3>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">
            Your future self is already out there
          </h2>
          <p className="text-[#A3A3A3] mb-8 leading-relaxed">
            Start the conversation today. Leave breadcrumbs. Ask the hard questions. Your future self will answer.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 bg-[#FACC15] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#EAB308] transition-colors"
          >
            Get started — it&apos;s free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md bg-[#FACC15] flex items-center justify-center">
            <Infinity className="w-3 h-3 text-black" />
          </div>
          <span className="text-xs font-medium text-[#A3A3A3]">Echoes of Tomorrow</span>
        </div>
        <p className="text-xs text-[#A3A3A3]/40">
          A reflective space for the long game.
        </p>
      </footer>
    </div>
  );
}
