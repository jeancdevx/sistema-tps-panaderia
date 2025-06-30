import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rutas que requieren autenticación
const isProtectedRoute = createRouteMatcher([
  "/vendedor(.*)",
  "/cajero(.*)",
  "/admin(.*)",
]);

// Rutas públicas (sign-in, sign-up, etc.)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sin-acceso",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Si es una ruta protegida y no está autenticado, redirigir al login
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Si está autenticado y trata de acceder a rutas protegidas
  if (isProtectedRoute(req) && userId) {
    const userRole = (sessionClaims as { metadata?: { role?: string } })
      ?.metadata?.role;

    // Verificar permisos según la ruta
    const pathname = req.nextUrl.pathname;

    /* if (
      pathname.startsWith("/vendedor") &&
      userRole !== "VENDEDOR" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/sin-acceso", req.url));
    }

    if (
      pathname.startsWith("/cajero") &&
      userRole !== "CAJERO" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/sin-acceso", req.url));
    }

    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/sin-acceso", req.url));
    } */
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
