import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "set-cookie-parser";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/login", "/register"];

// ❌ Було: export async function middleware(req: NextRequest)
// ✅ Замініть на proxy:
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let response = NextResponse.next();
  let isAuthenticated = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await fetch(new URL("/api/auth/session", req.url), {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (sessionRes.ok) {
        isAuthenticated = true;
        const setCookieHeader = sessionRes.headers.get("set-cookie");
        if (setCookieHeader) {
          const parsedCookies = parseSetCookie(setCookieHeader);
          for (const c of parsedCookies) {
            response.cookies.set(c.name, c.value, {
              maxAge: c.maxAge,
              expires: c.expires,
              path: c.path,
              domain: c.domain,
              secure: c.secure,
              httpOnly: c.httpOnly,
              sameSite: c.sameSite as "strict" | "lax" | "none",
            });
          }
        }
      } else {
        isAuthenticated = false;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPrivateRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && isAuthenticated) {
    const notesUrl = new URL("/notes", req.url);
    return NextResponse.redirect(notesUrl);
  }

  return response;
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/login", "/register"],
};
