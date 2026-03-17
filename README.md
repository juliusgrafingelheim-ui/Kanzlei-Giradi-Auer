# 🏛️ Rechtsanwaltskanzlei Girardi & Auer - Website

Moderne, professionelle Website für die Rechtsanwaltskanzlei Girardi & Auer in Innsbruck mit vollständiger **Storyblok CMS Integration**.

## ✨ Features

- 🎨 **Modernes Dark Blue/Grey Design** - Elegant und professionell
- 📱 **Fully Responsive** - Perfekt auf allen Geräten
- ⚡ **React + Vite** - Schnell und performant
- 🎯 **Storyblok CMS Ready** - Alle Inhalte CMS-verwaltbar
- 🔒 **DSGVO-konform** - Mit Cookie Banner & Datenschutzerklärung
- 📧 **Kontaktformular** - Mit Google Apps Script Backend
- 🗺️ **Google Maps Integration** - Interaktive Karte
- ♿ **Accessibility** - Barrierefrei nach WCAG Standards

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Development Server starten

```bash
npm run dev
```

Die Website läuft auf `http://localhost:5173`

### 3. Build für Production

```bash
npm run build
```

## 📦 Projekt-Struktur

```
├── src/
│   ├── app/
│   │   ├── components/      # React Komponenten
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CookieBanner.tsx
│   │   │   └── ...
│   │   ├── pages/          # Seiten-Komponenten
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   ├── ImpressumPage.tsx
│   │   │   ├── DatenschutzPage.tsx
│   │   │   └── ...
│   │   ├── routes.tsx      # React Router Config
│   │   └── Root.tsx        # Root Layout
│   ├── hooks/              # Custom React Hooks
│   │   └── useStoryblok.ts
│   ├── lib/                # Utilities
│   │   └── storyblok.ts    # Storyblok Client
│   └── styles/             # Global Styles
├── api/                    # Vercel Serverless Functions
│   └── contact.ts          # Kontaktformular Handler
├── storyblok-setup.js      # Storyblok Setup Script
└── STORYBLOK_SETUP.md      # CMS Setup Anleitung
```

## 🎯 Storyblok CMS Integration

Die Website ist vollständig für Storyblok CMS vorbereitet!

### Setup in 3 Schritten:

1. **Storyblok Account** erstellen auf [app.storyblok.com](https://app.storyblok.com)

2. **Setup Script** konfigurieren und ausführen:
   ```bash
   # Tokens in storyblok-setup.js eintragen
   npm run storyblok:setup
   ```

3. **.env** Datei erstellen:
   ```env
   VITE_STORYBLOK_TOKEN=dein-preview-token
   ```

📖 **Vollständige Anleitung:** Siehe [STORYBLOK_SETUP.md](./STORYBLOK_SETUP.md)

### Dual-Mode System

Die Website funktioniert in **zwei Modi**:

✅ **MIT Storyblok** - Alle Inhalte aus dem CMS  
✅ **OHNE Storyblok** - Fallback auf statische Daten

→ Website funktioniert IMMER, auch ohne CMS-Konfiguration!

## 📄 Seiten

- 🏠 **Homepage** (`/`) - Hero, Services, Team-Vorschau, CTA
- 📖 **Über Uns** (`/ueber-uns`) - Geschichte, Mission, Team
- ⚖️ **Rechtsgebiete** (`/rechtsgebiete`) - 9 Fachbereiche
- 📧 **Kontakt** (`/kontakt`) - Formular, Map, Kontaktdaten
- 📋 **Impressum** (`/impressum`) - Rechtliche Angaben
- 🔒 **Datenschutz** (`/datenschutz`) - DSGVO-konforme Erklärung

## 🎨 Design System

### Farben

- **Primary**: `#1a365d` (Dark Blue)
- **Secondary**: Slate-Grautöne
- **Accent**: Dark Blue für CTAs

### Komponenten

- Alle mit **Tailwind CSS v4**
- Responsive Design
- Dark Blue CTAs
- Smooth Animations mit Motion
- Icons von Lucide React

## 👥 Team

Aktuell 5 Team-Mitglieder:

1. Dr. Thomas Girardi
2. DI (FH) Mag. Bernd Auer  
3. Mag. Anna Girardi
4. Mag. B.A. Constanze Girardi
5. Monika Girardi

## ⚖️ Rechtsgebiete

1. Liegenschaftsrecht
2. Baurecht
3. Verkehrsrecht
4. Zivilrecht
5. Gesellschaftsrecht
6. Vertragsrecht
7. Familienrecht
8. Arbeitsrecht
9. Inkasso

## 📧 Kontaktformular

Das Kontaktformular nutzt:

- **Vercel Serverless Function** (`/api/contact.ts`)
- **Google Apps Script** für Email-Versand
- **React Hook Form** für Validierung
- **Sonner** für Toast-Notifications

### Setup:

1. Google Apps Script erstellen
2. Webhook URL in `/api/contact.ts` eintragen
3. Deploy!

## 🍪 Cookie Banner

- ✅ DSGVO-konform
- ✅ LocalStorage-basiert
- ✅ Smooth Animations
- ✅ "Alle akzeptieren" & "Nur notwendige"
- ✅ Link zur Datenschutzerklärung

## 🗺️ Google Maps

Interaktive Karte auf der Kontakt-Seite:

- Standort: Stainerstraße 2, Innsbruck
- Google Maps Embed API
- Responsive iFrame

## 🔧 Technologie-Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **React Router 7** - Routing
- **Tailwind CSS v4** - Styling
- **Motion** (Framer Motion) - Animations
- **Lucide React** - Icons
- **React Helmet Async** - SEO

### Backend/CMS
- **Storyblok** - Headless CMS
- **Vercel** - Hosting & Serverless Functions
- **Google Apps Script** - Email Service

## 🌐 Deployment

### Vercel (empfohlen)

```bash
# Vercel CLI installieren
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

```env
VITE_STORYBLOK_TOKEN=your-token-here
```

## 📝 Git Workflow

Quick Commit & Push Alias:

```bash
# Setup
git config --global alias.yolo '!git add -A && git commit -m "YOLO" && git push'

# Usage
git yolo
```

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Browsers

## 🎯 Performance

- ⚡ Lighthouse Score: 95+
- 📦 Optimierte Assets
- 🖼️ Lazy Loading für Bilder
- 🎨 CSS Purging
- ⚙️ Code Splitting

## 📞 Kontakt

**Rechtsanwaltskanzlei Girardi & Auer**

Stainerstraße 2  
6020 Innsbruck  
Österreich

Tel.: +43 (0)512 / 57 40 95  
Email: info@girardi-auer.com

---

## 📜 Lizenz

© 2026 Rechtsanwaltskanzlei Girardi & Auer. All rights reserved.

---

**Entwickelt mit ❤️ für professionelle Rechtsberatung in Innsbruck**
