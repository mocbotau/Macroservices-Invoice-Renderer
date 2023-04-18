import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log();

  switch (req.nextUrl.pathname) {
    case "/dashboard":
    case req.nextUrl.pathname.match(/^\/editor\/(.+)$/)?.input:
    case "/user/contacts":
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      break;
    case "/login":
      if (token) return NextResponse.redirect(new URL("/dashboard", req.url));
      break;
    default:
      break;
  }
  return res;
}

export const config = {
  matcher: ["/dashboard", "/login", "/editor/(.+)", "/user/contacts"],
};
