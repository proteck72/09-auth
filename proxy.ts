import { NextRequest, NextResponse } from "next/server";
import { parseCookie } from "cookie";

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
      const sessionResponse = await fetch(
        new URL("/api/auth/session", req.url).toString(),
        {
          headers: {
            Cookie: req.headers.get("cookie") || "",
          },
        },
      );

      if (sessionResponse.ok) {
        const res = NextResponse.next();
        const setCookieHeader = sessionResponse.headers.get("set-cookie");

        if (setCookieHeader) {
          const cookieArray = setCookieHeader.split(
            /,\s*(?=[A-Za-z0-9_%}-]+=)/,
          );
          cookieArray.forEach((cookieStr) => {
            const parsed = parseCookie(cookieStr);
            for (const [key, val] of Object.entries(parsed)) {
              if (
                ![
                  "path",
                  "httponly",
                  "samesite",
                  "max-age",
                  "expires",
                  "domain",
                ].includes(key.toLowerCase()) &&
                val !== undefined
              ) {
                res.cookies.set(key, val, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  path: "/",
                });
              }
            }
          });
        }
        return res;
      }
    } catch {}
  }

  if (!accessToken && !refreshToken && isPrivateKeyRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
