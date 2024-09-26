import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/signin')) {

    if(request.cookies.has("next-auth.session-token")){
        
        return NextResponse.redirect(new URL('/my-files', request.url))
    }

  }

  if(request.nextUrl.pathname.startsWith('/upload') || request.nextUrl.pathname.startsWith('/my-files')){
    if(request.cookies.has("next-auth.session-token")){
        
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/signin', request.url))
  }
 
  if (request.nextUrl.pathname.startsWith('/api')) {
    if(request.cookies.has("next-auth.session-token")){
        
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
    matcher: '/:path*',
}