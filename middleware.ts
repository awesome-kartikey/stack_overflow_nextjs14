import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: [
    '/',
    '/question/:id',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs'
  ],
  ignoredRoutes: [
    '/app/api/webhook',
        '/api/webhook', '/api/chatgpt'
  ]
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
 
