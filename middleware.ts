import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

// Paths that require authentication
const protectedPathPrefixes = ["/dashboard", "/settings"]

// Public paths that should redirect to /dashboard when already authenticated
const authOnlyPaths = ["/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes (auth handles these internally)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const isProtected = protectedPathPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  const isAuthOnly = authOnlyPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next()
  }

  try {
    const session = await auth()
    const isAuthenticated = !!session?.user

    if (isProtected && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isAuthOnly && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } catch {
    // If auth fails, allow protected routes to handle it at page level
    if (isProtected) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
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
