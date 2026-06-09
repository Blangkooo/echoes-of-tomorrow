"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Infinity, ArrowRight } from "lucide-react";
import { StarfieldBackground } from "@/components/layout/StarfieldBackground";

export function SignInClient() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none">
        <StarfieldBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-14 h-14 rounded-2xl bg-[#FACC15] flex items-center justify-center mb-8 shadow-lg shadow-[#FACC15]/20"
          >
            <Infinity className="w-7 h-7 text-black" />
          </motion.div>

          <h1 className="text-2xl font-bold text-[#FAFAFA] mb-2 tracking-tight">
            Echoes of Tomorrow
          </h1>
          <p className="text-sm text-[#A3A3A3] mb-10 leading-relaxed max-w-xs">
            A space to write to your future self — record where you are, where you&apos;re going, and who you&apos;re becoming.
          </p>

          {/* Sign-in card */}
          <div className="w-full bg-[#171717] border border-white/8 rounded-2xl p-6 shadow-2xl">
            <p className="text-xs text-[#A3A3A3] mb-4 text-center">
              Sign in to continue
            </p>

            <motion.button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-[#FAFAFA] hover:bg-white text-[#0A0A0A] font-medium text-sm rounded-xl px-4 py-3 transition-colors duration-150 shadow-sm"
            >
              {/* Google icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-[#0A0A0A]/50" />
            </motion.button>
          </div>

          <p className="text-xs text-[#A3A3A3]/50 mt-6 max-w-xs leading-relaxed">
            By continuing, you agree to our terms. Your reflections are private and encrypted.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
