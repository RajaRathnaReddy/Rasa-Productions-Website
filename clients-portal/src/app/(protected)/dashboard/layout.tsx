import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ClientLayout({
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

  if (user) {
    // Fetch role
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === "super_admin") {
      // Super admins shouldn't usually be locked here, but for now we let them in or redirect
      // redirect("/admin/projects");
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col pt-8 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
