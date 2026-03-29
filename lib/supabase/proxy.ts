import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const hasEnvVars = Boolean(supabaseUrl) && Boolean(supabaseKey);

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const authUser = data?.claims;
  const guestId = request.cookies.get('guest_user_id')?.value;

  // console.log('Middleware user claims:', user);

  const isAuthenticated = Boolean(authUser) || Boolean(guestId);
  const protectedRoutes = ['/session'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    const returnTo = request.nextUrl.pathname;
    url.pathname = '/auth/guest';
    url.searchParams.set('returnTo', returnTo);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
