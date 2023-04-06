import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server.js";
import { supabaseAdmin } from "./libs/adminSupabase";
/**
 *
 * @param {import('next/server.js').NextRequest} req
 */
export async function middleware(req, respond) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect `/auth/* routes for signed in users
  if (req.nextUrl.pathname.startsWith("/auth")) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect features
  const featureRoutes = [
    "/sandbox",
    "/code",
    "/quiz",
    "/practice",
    "/creator",
    "/editor",
    "/manager",
    "/challenge",
  ];
  if (featureRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Protect manager routes
  const { data } = await supabaseAdmin.from("manager").select("id");
  if (req.nextUrl.pathname.startsWith("/manager") && session) {
    const isManager = data.map((d) => d.id).includes(session.user.id);
    if (!isManager) {
      return new Response("", {
        status: 403,
      });
    }
  }
}
