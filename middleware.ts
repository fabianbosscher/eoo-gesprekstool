import { NextRequest, NextResponse } from 'next/server'

// Paden die ALTIJD publiek toegankelijk moeten blijven (klantweergave + PDF-download door klant)
const PUBLIC_PATH_PREFIXES = ['/view/', '/api/view/']

function getAllowedIps(): string[] {
  const raw = process.env.ALLOWED_IPS ?? ''
  return raw
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)
}

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() ?? null
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return null
}

function renderBlockedPage(ip: string | null): NextResponse {
  const displayIp = ip ?? 'onbekend'
  const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Toegang geweigerd</title>
<style>
  html,body{margin:0;padding:0;height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#03173D;color:#fff;}
  .wrap{min-height:100%;display:flex;align-items:center;justify-content:center;padding:40px 20px;}
  .card{background:#fff;color:#03173D;border-radius:16px;padding:40px 36px;max-width:460px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,0.25);}
  h1{margin:0 0 8px;font-size:22px;color:#03173D;}
  .brand{color:#208AD0;}
  p{color:#4B5563;font-size:14px;line-height:1.6;margin:6px 0 0;}
  .ip{margin-top:20px;padding:12px 14px;background:#F3F4F6;border-radius:8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;color:#03173D;}
  .ip strong{color:#208AD0;}
  .footer{margin-top:22px;font-size:12px;color:#9CA3AF;}
  .icon{width:44px;height:44px;background:#FEE2E2;color:#DC2626;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="icon">✕</div>
    <h1>Easy <span class="brand">Office</span> Online</h1>
    <p><strong>Toegang geweigerd.</strong></p>
    <p>Deze omgeving is alleen benaderbaar vanaf geautoriseerde locaties. Je huidige verbinding staat niet op de lijst met toegestane IP-adressen.</p>
    <div class="ip">Jouw IP: <strong>${displayIp}</strong></div>
    <p class="footer">Als je toegang nodig hebt, geef dit IP-adres door aan de beheerder zodat het aan de whitelist kan worden toegevoegd.</p>
  </div>
</div>
</body>
</html>`

  return new NextResponse(html, {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Publieke routes (klantweergave) blijven open
  if (PUBLIC_PATH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const allowed = getAllowedIps()

  // Geen whitelist ingesteld = alles open (fail-open, voor dev/testing)
  if (allowed.length === 0) {
    return NextResponse.next()
  }

  const ip = getClientIp(req)
  if (ip && allowed.includes(ip)) {
    return NextResponse.next()
  }

  return renderBlockedPage(ip)
}

// Matcher: run de middleware voor bijna alles, behalve statische assets
export const config = {
  matcher: [
    /*
     * Match alle paden BEHALVE:
     * - _next/static (build assets)
     * - _next/image (image optimizer)
     * - favicon en logo bestanden
     * - alles met een bestandsextensie in /public
     */
    '/((?!_next/static|_next/image|favicon\\.ico|logo-white\\.png|logo-color\\.png|robots\\.txt|sitemap\\.xml).*)',
  ],
}
