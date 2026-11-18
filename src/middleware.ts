import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales } from "@/i18n/config";

/** Sends visitors without a language prefix to their saved (or browser) language. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  let locale = isLocale(saved) ? saved : undefined;
  if (!locale) {
    const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
    locale = accept.startsWith("gu") ? "gu" : accept.startsWith("hi") ? "hi" : defaultLocale;
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API, static files and SEO files.
  matcher: ["/((?!_next|api|images|brand|favicon.ico|icon|robots.txt|sitemap.xml|.*\..*).*)"],
};
