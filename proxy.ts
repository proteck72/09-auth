import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivateKeyRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicKeyRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken && isPublicKeyRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!accessToken && refreshToken && isPrivateKeyRoute) {
    try {
      const sessionResponse = await checkSession();

      if (sessionResponse.ok) {
        const res = NextResponse.next();
        const setCookieHeader = sessionResponse.headers.get("set-cookie");

        if (setCookieHeader) {
          const cookieArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieArray.forEach((cookieStr) => {
            const parsed = parseSetCookie(cookieStr);
            if (parsed && parsed.name) {
              const { name, value, ...options } = parsed;
              res.cookies.set(name, value, options);
            }
          });
        }
        return res;
      }
    } catch {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (!accessToken && !refreshToken && isPrivateKeyRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
