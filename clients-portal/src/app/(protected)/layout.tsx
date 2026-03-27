import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Navigation } from "@/components/layout/Navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isMockData = process.env.NEXT_PUBLIC_SUPABASE_URL === "https://dummy.supabase.co";

  if (!user && !isMockData) {
    redirect("/login");
  }

  // By default, everyone is a client. The Admin is specified in .env
  const isAdmin = user ? (process.env.ADMIN_UUID === user.id) : false;
  const userRole = isAdmin ? "super_admin" : "client";

  return (
    <>
      <Navigation userRole={userRole} isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col relative">{children}</div>
    </>
  );
}
