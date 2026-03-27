import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isMockData = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co";

  if (!user && !isMockData) {
    redirect("/login");
  }

  const adminId = process.env.ADMIN_UUID;
  
  if (user && adminId && user.id !== adminId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 min-w-0 py-8 px-6 md:px-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
