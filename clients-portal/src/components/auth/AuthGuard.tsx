"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

/**
 * AuthGuard — listens for auth state changes across tabs.
 *
 * When a user signs out in one tab, the Supabase client in ALL tabs
 * fires onAuthStateChange with SIGNED_OUT. This component catches that
 * and immediately redirects to /login, solving the cross-tab sign-out issue.
 *
 * Mount this in the root layout (or protected layout) as a client component.
 */
export function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          // Only redirect if we're on a protected page (not login/auth pages)
          const isPublicPage =
            pathname === "/" ||
            pathname === "/login" ||
            pathname.startsWith("/auth/");

          if (!isPublicPage) {
            router.replace("/login");
            router.refresh(); // Force server components to re-render
          }
        }

        if (event === "TOKEN_REFRESHED") {
          // Session was refreshed — force server components to pick up the new token
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  return null; // This component renders nothing — it's purely a side-effect listener
}
