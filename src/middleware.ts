import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/resume(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname
  console.log(`[Middleware] ${req.method} ${url}`)
  
  if (isProtectedRoute(req)) {
    console.log(`[Middleware] Protecting route: ${url}`)
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}