import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/dashboard/Dashboard";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/administrator/login");
  }

  const { username } = session.user;

  const handleLogout = async () => {
    handleLogout();
  };

  return (
    <div className="min-h-full bg-zinc-900 text-zinc-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">대시보드</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="break-keep">{username}</span>
            <LogoutButton />
          </div>
        </header>

        <AdminDashboard />
      </div>
    </div>
  );
}
