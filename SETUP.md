# EOO Gesprekstool — Setup Handleiding

## Stap 1: Node.js installeren

Download en installeer Node.js (v20 of hoger) via:
https://nodejs.org/en/download

Na installatie, herstart je terminal en controleer:
```bash
node --version   # moet v20.x.x tonen
npm --version    # moet 10.x.x tonen
```

## Stap 2: Dependencies installeren

Open een terminal in de projectmap (`eoo-gesprekstool`) en draai:
```bash
npm install
```

## Stap 3: API keys instellen

Kopieer het voorbeeld-configuratiebestand:
```bash
cp .env.local.example .env.local
```

Vul daarna `.env.local` in:

| Variabele | Waar te vinden |
|---|---|
| `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| `RESEND_API_KEY` | https://resend.com (gratis account) |
| `RESEND_FROM_EMAIL` | Een e-mailadres dat je bij Resend hebt geverifieerd |
| `NEXTAUTH_SECRET` | Maak een willekeurige string: `openssl rand -base64 32` |

## Stap 4: Database aanmaken

```bash
npm run db:push    # database schema aanmaken
npm run db:seed    # admin gebruiker aanmaken
```

Standaard admin account:
- E-mail: `admin@easyofficeonline.nl`  
- Wachtwoord: `admin123`

**Wijzig dit wachtwoord na de eerste login!**

## Stap 5: Lokaal draaien

```bash
npm run dev
```

Open http://localhost:3000 — je wordt doorgestuurd naar de loginpagina.

---

## Productie (Vercel)

1. Maak een [Vercel account](https://vercel.com) aan
2. Importeer de projectmap
3. Voeg de environment variables toe in het Vercel dashboard
4. Voor productie, vervang SQLite door een hosted database:
   - Maak een [Supabase](https://supabase.com) project aan (gratis)
   - Kopieer de PostgreSQL connection string
   - Verander `schema.prisma`:
     ```
     provider = "postgresql"
     url = env("DATABASE_URL")
     ```
   - Pas `DATABASE_URL` aan naar de Supabase URL

---

## Gebruik

1. Log in met je teamaccount
2. Klik op **"+ Nieuw rapport"**
3. Vul de klantgegevens in en plak de transcriptie
4. Klik op **"Verwerk met AI"** — Claude genereert het rapport
5. Controleer de samenvatting en klik op **"Opslaan & e-mail versturen"**
6. De klant ontvangt een e-mail met de link en toegangscode (bijv. `EOO`)

---

## Toekomstige uitbreidingen

- Teams/Zoom integratie voor automatische transcriptie-import
- Meerdere teamleden met eigen accounts
- Logo upload per rapport
- Meerdere talen (NL/EN)
