import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { IronOptions } from "../iron_session.config";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, IronOptions);
  const { user } = session;

  switch (req.nextUrl.pathname) {
    case "/":
      return NextResponse.redirect(
        new URL(user ? "/editor" : "/login", req.url)
      );
    case "/editor":
      if (!user) return NextResponse.redirect(new URL("/login", req.url));
      break;
    case "/login":
      if (user) return NextResponse.redirect(new URL("/editor", req.url));
      break;
    default:
      break;
  }
  return res;
}

export const config = {
  matcher: ["/editor", "/", "/login"],
};
