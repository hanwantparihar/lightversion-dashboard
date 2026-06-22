import { NextResponse, type NextRequest } from "next/server";

const TOKEN_KEY = "custom-auth-token";

const PUBLIC_PATHS = [
  // "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/two-factor",
];

// Auth pages — authenticated users should not see these
const AUTH_ONLY_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const isAuthPage = AUTH_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // Authenticated user hitting login/register → send to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Unauthenticated user hitting a protected page → send to login
  if (!token && !isPublic) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|_static|favicon\\.ico|images|api|assets|fonts|public).*)",
  ],
};
