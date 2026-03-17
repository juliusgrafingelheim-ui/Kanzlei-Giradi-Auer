# 🚀 Storyblok CMS Integration Setup

Diese Anleitung zeigt dir, wie du die Website mit Storyblok CMS verbindest, sodass alle Inhalte (Texte, Bilder, etc.) über das CMS verwaltbar sind.

## 📋 Voraussetzungen

1. **Storyblok Account** - Erstelle einen kostenlosen Account auf [https://app.storyblok.com](https://app.storyblok.com)
2. **Google Account** - Für Google Apps Script

---

## 🎯 Step-by-Step Anleitung

### 1. Storyblok Space erstellen

1. Gehe zu [https://app.storyblok.com](https://app.storyblok.com)
2. Klicke auf "Create new space"
3. Wähle einen Namen (z.B. "Girardi & Auer Website")
4. Region: **EU** wählen
5. Space erstellen

### 2. API Tokens holen

#### Management Token (für Setup):
1. In deinem Space: **Settings** → **Access Tokens**
2. Unter "Personal Access Tokens" → **Generate new token**
3. Name: "Setup Script"
4. Scopes: Alle auswählen
5. Token kopieren und sicher aufbewahren

#### Preview Token (für Website):
1. Ebenfalls unter **Settings** → **Access Tokens**
2. Unter "Access Tokens" findest du deinen **Preview Token**
3. Diesen Token kopieren

**Space ID finden:**
- In Storyblok: Settings → General → Space ID (z.B. "123456")

### 3. Google Apps Script Setup

1. Gehe zu [https://script.google.com](https://script.google.com)
2. Klicke auf **Neues Projekt**
3. Öffne die Datei `storyblok-setup.gs` aus diesem Projekt
4. Kopiere den kompletten Code
5. Füge ihn in Google Apps Script ein
6. Trage deine Tokens ein:

```javascript
var STORYBLOK_MANAGEMENT_TOKEN = 'dein-management-token-hier';
var STORYBLOK_SPACE_ID = '123456'; // Deine Space ID
```

7. Klicke auf **Speichern** (💾 Icon)
8. Benenne das Projekt: "Storyblok Setup - Girardi & Auer"

### 4. Setup Script ausführen

1. Wähle in der Dropdown-Liste die Funktion: **setupStoryblok**
2. Klicke auf **Ausführen** (▶️ Icon)
3. Beim ersten Mal: Berechtigungen bestätigen
   - "Berechtigung erforderlich" → **Berechtigungen prüfen**
   - Google Account auswählen
   - **Erweitert** → "Zu [Projektname] (unsicher) wechseln"
   - **Zulassen**
4. Script läuft durch (ca. 30 Sekunden)
5. Im **Ausführungsprotokoll** siehst du den Fortschritt

✅ Das Script erstellt automatisch alle Content Types und Seiten!

### 5. Environment Variable setzen

Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
VITE_STORYBLOK_TOKEN=dein-preview-token-hier
```

### 6. Bilder hochladen

Nachdem das Setup durchgelaufen ist:

1. Gehe zu **Content** in Storyblok
2. Öffne die jeweiligen Stories (Home, Über Uns, etc.)
3. Lade die Bilder hoch:
   - **Team-Fotos** → in der About-Seite
   - **Hero-Bilder** → für jede Seite
   - **Kanzlei-Fotos** → in verschiedenen Bereichen

### 7. Richtext-Felder ausfüllen

Die folgenden Felder sind als Richtext angelegt und sollten gefüllt werden:

**Impressum:**
- Berufsrechtliche Angaben
- Haftungsausschluss

**Datenschutz:**
- Alle Abschnitte (Cookies, Google Maps, etc.)

**About Page:**
- Geschichte
- Mission

---

## 🎨 Content Types Übersicht

### Page Content Types (Root)
- `page_home` - Homepage
- `page_about` - Über Uns
- `page_practice_areas` - Rechtsgebiete
- `page_contact` - Kontakt
- `page_impressum` - Impressum
- `page_datenschutz` - Datenschutz
- `settings_global` - Globale Einstellungen

### Nested Components
- `seo` - SEO Meta-Daten
- `team_member` - Team-Mitglied
- `practice_area` - Rechtsgebiet

---

## 🔧 Wie das Frontend funktioniert

### Dual-Mode System

Die Website funktioniert in **zwei Modi**:

1. **MIT Storyblok** - Alle Inhalte kommen aus dem CMS
2. **OHNE Storyblok** - Fallback auf hardcoded Daten (aktueller Stand)

Das bedeutet: Die Website funktioniert IMMER, auch wenn Storyblok nicht konfiguriert ist!

### Beispiel-Integration

Jede Page-Komponente nutzt den `useStoryblok` Hook:

```tsx
import { usePageContent } from "../../hooks/useStoryblok";

export function HomePage() {
  const { content, seo, loading } = usePageContent("home", {
    // Fallback-Daten (aktueller Inhalt)
    hero_title: "Ihr Recht ist unsere Berufung",
    hero_subtitle: "Professionelle Rechtsberatung...",
    // ... alle anderen Felder
  });

  return (
    <>
      <Helmet>
        <title>{seo?.title || "Rechtsanwaltskanzlei Girardi & Auer"}</title>
        {seo?.description && (
          <meta name="description" content={seo.description} />
        )}
      </Helmet>

      <section>
        <h1>{content.hero_title}</h1>
        <p>{content.hero_subtitle}</p>
      </section>
    </>
  );
}
```

---

## 📸 Asset Management

### Bilder in Storyblok

Alle Bilder werden als **Asset Type** angelegt:

```tsx
// Storyblok gibt dir die Image URL
<img src={content.hero_image?.filename} alt="Hero" />

// Mit Image Service (optimiert):
import { getImageUrl } from "../lib/storyblok";

<img 
  src={getImageUrl(content.hero_image, { 
    width: 1200, 
    quality: 80,
    format: "webp" 
  })} 
  alt="Hero" 
/>
```

### Icons

Icons werden als **Text-Feld** mit dem Icon-Namen gespeichert:

```tsx
// In Storyblok: "Scale", "Users", "Award"
import * as LucideIcons from "lucide-react";

const IconComponent = LucideIcons[content.icon];
<IconComponent className="w-6 h-6" />
```

---

## 🎯 Content Workflow

### 1. Inhalte bearbeiten
1. Gehe zu **Content** in Storyblok
2. Wähle die Seite aus (z.B. "home")
3. Bearbeite die Felder
4. **Save**

### 2. Preview
- Klicke auf **Preview** in Storyblok
- Oder öffne deine lokale Dev-Umgebung: `npm run dev`
- Änderungen sind sofort sichtbar (Draft-Modus)

### 3. Publizieren
- Klicke auf **Publish** in Storyblok
- Die Änderungen sind live

---

## 🔍 Richtext-Editor

Storyblok nutzt einen WYSIWYG Richttext-Editor für lange Texte.

### Richtext rendern:

```tsx
import { render } from "storyblok-rich-text-react-renderer";

<div className="prose">
  {render(content.legal_content)}
</div>
```

---

## 🌐 Multi-Language (Optional)

Falls du später mehrsprachig werden willst:

1. In Storyblok: **Settings** → **Languages**
2. Sprachen hinzufügen (z.B. Englisch)
3. Content übersetzen
4. Im Code: `getStory('home', { language: 'de' })`

---

## 🚀 Deployment

### Environment Variables

Auf deinem Hosting (Vercel, Netlify, etc.):

```env
VITE_STORYBLOK_TOKEN=dein-production-preview-token
```

### Build

```bash
npm run build
```

Die Website baut mit oder ohne Storyblok!

---

## 📝 Wichtige Storyblok Features

### Visual Editor
- Live-Preview deiner Änderungen
- WYSIWYG Interface
- Keine Code-Änderungen nötig

### Asset Manager
- Zentrale Bildverwaltung
- Automatische Optimierung
- CDN-Delivery

### Versioning
- Jede Änderung wird versioniert
- Rollback zu alten Versionen möglich

### Workflows
- Entwürfe speichern
- Publish-Workflow
- Scheduled Publishing (in höheren Plänen)

---

## 🆘 Troubleshooting

### "No Storyblok token configured"
- Prüfe ob `.env` Datei existiert
- Prüfe ob `VITE_STORYBLOK_TOKEN` gesetzt ist
- Server neu starten nach .env Änderungen

### "Story not found"
- Prüfe ob Setup-Script durchgelaufen ist
- Prüfe ob Stories in Storyblok existieren
- Prüfe den Slug-Namen

### Bilder werden nicht angezeigt
- Prüfe ob Bild in Storyblok hochgeladen wurde
- Prüfe die Image URL in der Browser Console
- Prüfe CORS-Einstellungen

---

## 📚 Weitere Ressourcen

- [Storyblok Dokumentation](https://www.storyblok.com/docs)
- [React SDK Docs](https://github.com/storyblok/storyblok-react)
- [Management API Docs](https://www.storyblok.com/docs/api/management)

---

## ✅ Checkliste

- [ ] Storyblok Account erstellt
- [ ] Space erstellt
- [ ] Management Token geholt
- [ ] Preview Token geholt
- [ ] Google Apps Script konfiguriert
- [ ] Setup-Script ausgeführt
- [ ] `.env` Datei mit Token erstellt
- [ ] Bilder hochgeladen
- [ ] Richttext-Felder ausgefüllt
- [ ] Preview getestet
- [ ] Published

---

🎉 **Fertig!** Deine Website ist jetzt CMS-ready und alle Inhalte können über Storyblok verwaltet werden!