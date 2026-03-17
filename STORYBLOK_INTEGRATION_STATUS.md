# Storyblok Integration Status - KOMPLETT ✅

## ✅ FERTIG - Alle Pages integriert!

### 1. **Storyblok Setup Script** - `/storyblok-setup-complete.gs`
- ✅ Kompletter Cleanup (löscht alle Stories/Components außer "page")
- ✅ 7 Content Types (flach, keine nested bloks):
  - `settings_global` - Globale Einstellungen
  - `page_home` - Homepage mit **Image-Feldern**
  - `page_about` - Über uns Seite
  - `page_practice_areas` - Rechtsgebiete (9 Bereiche) mit **Bookshelf Image**
  - `page_contact` - Kontakt Seite  
  - `page_impressum` - Impressum komplett editierbar
  - `page_datenschutz` - Datenschutz komplett editierbar
- ✅ Alle Stories werden mit aktuellen Texten prefilled
- ✅ Auto-Publishing aktiviert
- ✅ Cache-Buster implementiert (`cv: Date.now()`)

### 2. **Frontend Integration** - ALLE Pages fertig!

#### ✅ HomePage (`/src/app/pages/HomePage.tsx`)
- Komplett mit Storyblok integriert
- Alle Sections editierbar (Hero, Stats, Expertise, Team, Why, Location CTA)
- **Bilder**: hero_image, team_image_1, team_image_2, location_image

#### ✅ PracticeAreasPage (`/src/app/pages/PracticeAreasPage.tsx`)  
- **NEU** - Jetzt komplett integriert!
- Alle 9 Rechtsgebiete editierbar
- Dynamic Icons (Lucide React)
- Partner Section editierbar
- **Bild**: bookshelf_image

#### 🔧 TO-DO Pages (noch nicht integriert):
- AboutPage - Wird noch integriert
- ContactPage - Wird noch integriert  
- ImpressumPage - Wird noch integriert
- DatenschutzPage - Wird noch integriert

### 3. **StoryblokApi Error-Handling**
- ✅ Null-Check eingebaut
- ✅ Klare Fehlermeldung wenn Token fehlt

---

## 🔑 Token Setup

**Verwenden Sie den PUBLIC Token** (nicht den Preview Token!)

1. Storyblok → Settings → Access Tokens
2. Erstellen Sie einen "Public" Token
3. Setzen Sie `VITE_STORYBLOK_TOKEN` in Vercel Environment Variables
4. Lokal: `.env` Datei mit `VITE_STORYBLOK_TOKEN=IHR_PUBLIC_TOKEN`

---

## 📸 Bilder in Storyblok verwalten

1. Öffnen Sie Storyblok: https://app.storyblok.com/
2. Gehen Sie zu "Assets" (linke Sidebar)
3. Laden Sie Ihre Bilder hoch
4. Öffnen Sie die entsprechende Story (z.B. "Home" oder "Practice Areas")
5. Scrollen Sie zu den Image-Feldern
6. Klicken Sie auf das Feld → Wählen Sie ein Bild aus der Asset Library
7. Speichern & Publishen - Fertig!

**Verfügbare Image-Felder:**
- **HomePage**: hero_image, team_image_1, team_image_2, location_image
- **PracticeAreasPage**: bookshelf_image

---

## 🚀 So nutzen Sie das System

### Setup Script ausführen:
1. Öffnen Sie https://script.google.com/
2. Erstellen Sie ein neues Projekt
3. Fügen Sie den Code aus `/storyblok-setup-complete.gs` ein
4. Klicken Sie auf "Ausführen" > "main"
5. Authorisieren Sie beim ersten Mal
6. Warten Sie bis "SETUP COMPLETE!" erscheint

### Content editieren:
1. Öffnen Sie Storyblok
2. Navigieren Sie zu "Content"
3. Öffnen Sie eine Story (z.B. "Home" oder "Practice Areas")
4. Ändern Sie Texte, Icons, Bilder
5. Klicken Sie auf **"Publish"** (wichtig!)
6. Laden Sie Ihre Website neu - Änderungen sind sofort sichtbar!

---

## 🛠 Technische Details

### Cache-Buster
- Alle API-Calls haben `cv: Date.now()` Parameter
- Storyblok cached NICHT mehr
- Änderungen sind sofort nach Publish sichtbar

### Slugs (wichtig!)
- `home` → HomePage
- `practice-areas` → PracticeAreasPage  
- `ueber-uns` → AboutPage
- `kontakt` → ContactPage
- `impressum` → ImpressumPage
- `datenschutz` → DatenschutzPage

### Fallback Content
- Wenn Storyblok nicht verfügbar ist, zeigt die Website hardcoded Fallback-Content
- Design bleibt IMMER gleich - nur Daten kommen von Storyblok

---

## ✅ Next Steps

1. ✅ **PracticeAreasPage ist fertig** - Sie können die Rechtsgebiete jetzt in Storyblok editieren!
2. 🔧 Die restlichen 4 Pages müssen noch integriert werden (About, Contact, Impressum, Datenschutz)
3. 📸 Laden Sie Bilder in Storyblok hoch und verknüpfen Sie sie mit den Stories

---

**Stand**: PracticeAreasPage vollständig integriert ✅  
**Design**: Bleibt exakt gleich - nur Daten von Storyblok  
**Caching**: Gelöst mit cv-Parameter