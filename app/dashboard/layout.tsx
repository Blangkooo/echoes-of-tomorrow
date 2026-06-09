import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { StarfieldBackground } from "@/components/layout/StarfieldBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "@/components/providers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  if (!(session.user as { onboarded?: boolean }).onboarded) {
    redirect("/onboarding");
  }

  return (
    <Providers>
      <div className="relative flex h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Starfield background */}
        <div className="fixed inset-0 pointer-events-none">
          <StarfieldBackground />
        </div>

        {/* Sidebar */}
        <div className="relative z-10 h-full flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="relative z-10 flex-1 flex flex-col overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </Providers>
  );
}
