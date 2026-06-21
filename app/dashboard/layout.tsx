import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen" style={{ background: "#f8fafc" }}>
      <Sidebar />
      <div className="flex flex-col min-h-screen" style={{ marginLeft: "260px", flex: 1 }}>
        <Topbar username={session.user?.name || "User"} />
        <main className="flex-1 p-6" style={{ maxWidth: "1100px", width: "100%", margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
