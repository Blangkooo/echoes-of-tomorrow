"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Infinity, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/actions/onboarding";

const CURRENT_YEAR = new Date().getFullYear();

const VALUE_OPTIONS = [
  "Growth", "Family", "Freedom", "Creativity", "Impact",
  "Integrity", "Courage", "Health", "Wisdom", "Love",
  "Adventure", "Security", "Purpose", "Balance", "Excellence",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [futureYear, setFutureYear] = useState(String(CURRENT_YEAR + 5));
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [lifeGoals, setLifeGoals] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState("");

  const toggleValue = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : prev.length < 5 ? [...prev, value] : prev
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Split lifeGoals textarea into array, filter empties
      const lifeGoalsArray = lifeGoals
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8);

      await completeOnboarding({
        futureYear: parseInt(futureYear),
        coreValues: selectedValues,
        lifeGoals: lifeGoalsArray.length > 0 ? lifeGoalsArray : [lifeGoals.trim()],
        bio: currentChallenge || undefined,
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "When do you want to hear back?",
      subtitle: "Choose a year in the future. Your Future Self will speak from that point in time.",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-[#A3A3A3] mb-2 block">Future year</Label>
            <Input
              type="number"
              min={CURRENT_YEAR + 1}
              max={CURRENT_YEAR + 50}
              value={futureYear}
              onChange={(e) => setFutureYear(e.target.value)}
              className="text-xl text-center font-semibold"
              placeholder={String(CURRENT_YEAR + 5)}
            />
            <p className="text-xs text-[#A3A3A3] mt-2 text-center">
              That&apos;s {parseInt(futureYear || "0") - CURRENT_YEAR} years from now
            </p>
          </div>
          {/* Year presets */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[1, 3, 5, 10, 20].map((years) => (
              <button
                key={years}
                onClick={() => setFutureYear(String(CURRENT_YEAR + years))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  futureYear === String(CURRENT_YEAR + years)
                    ? "border-[#FACC15]/60 bg-[#FACC15]/10 text-[#FACC15]"
                    : "border-white/8 text-[#A3A3A3] hover:border-white/20 hover:text-[#FAFAFA]"
                }`}
              >
                +{years}y
              </button>
            ))}
          </div>
        </div>
      ),
      canAdvance: !!futureYear && parseInt(futureYear) > CURRENT_YEAR,
    },
    {
      title: "What do you value most?",
      subtitle: "Pick up to 5 values that guide your life. Your Future Self will keep these in mind.",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          {VALUE_OPTIONS.map((value) => {
            const selected = selectedValues.includes(value);
            return (
              <motion.button
                key={value}
                onClick={() => toggleValue(value)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  selected
                    ? "border-[#FACC15]/60 bg-[#FACC15]/10 text-[#FACC15]"
                    : "border-white/8 text-[#A3A3A3] hover:border-white/20 hover:text-[#FAFAFA]"
                }`}
              >
                {selected && <Check className="w-3 h-3 inline mr-1.5" />}
                {value}
              </motion.button>
            );
          })}
        </div>
      ),
      canAdvance: selectedValues.length >= 1,
    },
    {
      title: "What are you working toward?",
      subtitle: "Describe the life you're building. Be honest — your Future Self will remember this.",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-[#A3A3A3] mb-2 block">Your goals & vision</Label>
            <Textarea
              value={lifeGoals}
              onChange={(e) => setLifeGoals(e.target.value)}
              placeholder="I want to build a meaningful career, deepen my relationships, become financially independent..."
              className="min-h-[120px]"
            />
          </div>
          <div>
            <Label className="text-[#A3A3A3] mb-2 block">What&apos;s your biggest challenge right now? <span className="text-[#A3A3A3]/50">(optional)</span></Label>
            <Textarea
              value={currentChallenge}
              onChange={(e) => setCurrentChallenge(e.target.value)}
              placeholder="I'm struggling with..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      ),
      canAdvance: lifeGoals.trim().length >= 10,
    },
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#FACC15] flex items-center justify-center">
            <Infinity className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-semibold text-[#FAFAFA]">Echoes of Tomorrow</span>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 justify-center mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-[#FACC15]" : i < step ? "w-4 bg-[#FACC15]/50" : "w-4 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#171717] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-[#FAFAFA] mb-2">{currentStep.title}</h2>
              <p className="text-sm text-[#A3A3A3] mb-6 leading-relaxed">{currentStep.subtitle}</p>
              {currentStep.content}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="text-sm text-red-400 mt-4 text-center">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="text-[#A3A3A3]"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>

            {isLast ? (
              <Button
                onClick={handleSubmit}
                disabled={!currentStep.canAdvance || loading}
                className="gap-2"
              >
                {loading ? "Setting up..." : "Enter your echoes"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            ) : (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!currentStep.canAdvance}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-[#A3A3A3]/40 text-center mt-6">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
