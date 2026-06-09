"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/6 bg-[#0A0A0A]/80 backdrop-blur-sm flex-shrink-0">
      {/* Left: page title */}
      <div>
        {title && (
          <h1 className="text-sm font-semibold text-[#FAFAFA]">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-[#A3A3A3]">{subtitle}</p>
        )}
      </div>

      {/* Right: user menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-white/4 transition-colors duration-150"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-[#A3A3A3] hidden sm:block max-w-[140px] truncate">
              {user?.name ?? user?.email ?? "User"}
            </span>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-[#171717] border border-white/8 rounded-xl shadow-2xl p-1">
          <div className="px-2 py-1.5 mb-1">
            <p className="text-xs font-medium text-[#FAFAFA] truncate">{user?.name}</p>
            <p className="text-xs text-[#A3A3A3] truncate">{user?.email}</p>
          </div>
          <DropdownMenuSeparator className="bg-white/6" />
          <DropdownMenuItem className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-white/6 rounded-lg px-2 py-1.5 text-sm cursor-pointer transition-colors">
            <User className="w-3.5 h-3.5" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-white/6 rounded-lg px-2 py-1.5 text-sm cursor-pointer transition-colors">
            <Settings className="w-3.5 h-3.5" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/6" />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/8 rounded-lg px-2 py-1.5 text-sm cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
