import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Next.js 16: file must be named proxy.ts and export a function named "proxy"
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
