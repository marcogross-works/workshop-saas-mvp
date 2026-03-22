import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// NOTE: No Prisma / full auth import here — keeps Edge bundle well under 1 MB

const protectedPrefixes = ["/dashboard", "/settings"]
const authOnlyPaths = ["/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  const isAuthOnly = authOnlyPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )

  if (!isProtected && !isAuthOnly) return NextResponse.next()

  // Check session cookie directly — lightweight, no Prisma
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token")

  const isAuthenticated = !!sessionCookie?.value

  if (isProtected && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
