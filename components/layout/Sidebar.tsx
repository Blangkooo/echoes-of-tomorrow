"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Clock,
  Sparkles,
  Lock,
  GitBranch,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Infinity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: Infinity, exact: true },
  { href: "/dashboard/echoes", label: "Echoes", icon: MessageSquare },
  { href: "/dashboard/future-self", label: "Future Self", icon: Sparkles },
  { href: "/dashboard/capsules", label: "Time Capsules", icon: Lock },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/universes", label: "Parallel Paths", icon: GitBranch },
  { href: "/dashboard/analytics", label: "Insights", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex-shrink-0 h-full flex flex-col bg-[#0D0D0D] border-r border-white/6 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-white/6 flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FACC15] flex items-center justify-center flex-shrink-0">
            <Infinity className="w-4 h-4 text-black" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-semibold text-[#FAFAFA] whitespace-nowrap overflow-hidden"
              >
                Echoes
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-150 relative group",
                  isActive
                    ? "bg-[#FACC15]/10 text-[#FACC15]"
                    : "text-[#A3A3A3] hover:text-[#FAFAFA]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#FACC15] rounded-full"
                  />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#262626] border border-white/8 rounded-md text-xs text-[#FAFAFA] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-lg text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-white/4 transition-colors duration-150"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
