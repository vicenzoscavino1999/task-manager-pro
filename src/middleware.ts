import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: '/login',
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api/auth (auth endpoints)
         * - login
         * - register
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - public files
         */
        '/((?!api/auth|login|register|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};
