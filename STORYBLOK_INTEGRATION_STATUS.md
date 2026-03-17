# Storyblok Integration Status

## ✅ Was wurde gemacht:

### 1. Storyblok Setup Script
- **File**: `/storyblok-setup-complete.gs`
- **Features**:
  - Kompletter Cleanup (löscht alle Stories/Components außer "page")
  - Erstellt 7 Content Types (flach, keine nested bloks):
    - `settings_global` - Globale Einstellungen
    - `page_home` - Homepage mit ALLEN Sections editierbar
    - `page_about` - Über uns Seite
    - `page_practice_areas` - Rechtsgebiete mit allen 9 Bereichen
    - `page_contact` - Kontakt Seite
    - `page_impressum` - Impressum komplett editierbar
    - `page_datenschutz` - Datenschutz komplett editierbar
  - Prefüllt ALLE Stories mit aktuellen Inhalten
  - Auto-Publishing aktiviert

### 2. Frontend - HomePage
- **File**: `/src/app/pages/HomePage.tsx`
- ✅ Komplett mit Storyblok integriert
- ✅ ALLE Sections sind editierbar:
  - Hero Section
  - Stats (3 Zahlen)
  - Expertise Section (4 Features mit Icons)
  - Team Section
  - Why Section (3 Gründe mit Icons)
  - Location CTA
- ✅ SEO Felder editierbar
- ✅ Fallback-Content wenn Storyblok nicht verfügbar
- ✅ **FIXED**: Entfernt useGlobalSettings (nicht vorhanden) - nutzt jetzt fest codierte Kontaktdaten in Location Section

### 3. useStoryblok Hook
- **File**: `/src/hooks/useStoryblok.ts`
- ✅ Vereinfacht - kein fallbackData Parameter mehr nötig
- ✅ Gibt `null` zurück wenn kein Content vorhanden


## ⚠️ Was noch zu tun ist:

### Frontend-Anpassungen für restliche Seiten:

#### 1. AboutPage (`/src/app/pages/AboutPage.tsx`)
**Zu ändern:**
- Import `useStoryblok` Hook
- History Section (3 Meilensteine) aus Storyblok laden
- Values Section (4 Werte) aus Storyblok laden
- Hero Stats aus Storyblok laden
- SEO Daten aus Storyblok laden

**Schema vorhanden:**
```javascript
{
  hero_badge, hero_title, hero_subtitle,
  hero_stat_1_number, hero_stat_1_label, // etc.
  history_1_year, history_1_title, history_1_text, // etc.
  value_1_title, value_1_desc, value_1_icon, // etc.
  team_title, team_subtitle,
  seo_title, seo_description, seo_keywords
}
```

#### 2. PracticeAreasPage (`/src/app/pages/PracticeAreasPage.tsx`)
**Zu ändern:**
- Die 9 Rechtsgebiete aus Storyblok laden (area_1_title, area_1_desc, area_1_icon, etc.)
- Why Section (3 Punkte) aus Storyblok laden
- Info Section aus Storyblok laden
- SEO Daten aus Storyblok laden

**Schema vorhanden:**
```javascript
{
  hero_title, hero_subtitle,
  info_title, info_text,
  area_1_title, area_1_desc, area_1_icon, // bis area_9
  why_title, why_subtitle,
  why_1_title, why_1_desc, // bis why_3
  cta_text, cta_link,
  seo_title, seo_description, seo_keywords
}
```

#### 3. ContactPage (`/src/app/pages/ContactPage.tsx`)
**Zu ändern:**
- Alle Text-Elemente aus Storyblok laden
- Methods Section (3 Kontaktmethoden) aus Storyblok laden
- Öffnungszeiten aus Storyblok laden
- SEO Daten aus Storyblok laden

**Schema vorhanden:**
```javascript
{
  hero_title, hero_subtitle,
  contact_title,
  hours_title, hours_text,
  methods_title,
  method_1_title, method_1_desc, // bis method_3
  map_title, map_desc,
  seo_title, seo_description, seo_keywords
}
```

#### 4. ImpressumPage (`/src/app/pages/ImpressumPage.tsx`)
**Zu ändern:**
- GESAMTE Page aus Storyblok laden - ALLE Texte sind jetzt Felder!
- Kontaktdaten
- Rechtsanwälte (3 Personen)
- Berufsrechtliche Angaben
- Haftungsausschluss Texte
- SEO Daten

**Schema vorhanden:**
```javascript
{
  hero_title, hero_subtitle,
  contact_badge, contact_address, contact_phone, contact_fax, contact_email,
  lawyers_title,
  lawyer_1_name, lawyer_1_code, lawyer_1_uid, // bis lawyer_3
  profession_title, profession_designation,
  chamber_title, chamber_name, chamber_address, chamber_website,
  regulations_title, regulations_list, regulations_note,
  disclaimer_title, disclaimer_content, disclaimer_service,
  links_title, links_text,
  copyright_title, copyright_text,
  seo_title, seo_description
}
```

#### 5. DatenschutzPage (`/src/app/pages/DatenschutzPage.tsx`)
**Zu ändern:**
- GESAMTE Page aus Storyblok laden - ALLE Texte sind jetzt Felder!
- Intro Section
- Verantwortlicher
- Erhebung und Speicherung
- Zweck der Datenverarbeitung
- Ihre Rechte
- Kontakt
- SEO Daten

**Schema vorhanden:**
```javascript
{
  hero_badge, hero_title, hero_subtitle,
  intro_title, intro_text,
  responsible_title, responsible_text,
  collection_title, collection_text,
  purpose_title, purpose_text,
  rights_title, rights_text,
  contact_title, contact_text,
  seo_title, seo_description
}
```


## 📋 Anleitung für Sie:

### Step 1: Storyblok Setup Script ausführen
1. Öffnen Sie https://script.google.com/
2. Erstellen Sie ein neues Projekt
3. Kopieren Sie den Code aus `/storyblok-setup-complete.gs`
4. Klicken Sie auf "Ausführen" > "main"
5. Autorisieren Sie beim ersten Mal
6. Warten Sie bis fertig (ca. 1-2 Minuten)

### Step 2: Storyblok konfigurieren
1. Öffnen Sie https://app.storyblok.com/
2. Gehen Sie zu Content
3. Finden Sie die Story "home" und setzen Sie sie als Startpage
4. Laden Sie Bilder in die Asset Library hoch
5. Verknüpfen Sie die Bilder in den Stories

### Step 3: Restliche Pages anpassen
Für jede Page:
1. Import hinzufügen: `import { useStoryblok } from "../../hooks/useStoryblok";`
2. Hook verwenden: `const { content, loading } = useStoryblok('slug-name');`
3. Fallback Content definieren (kopieren Sie die aktuellen Werte)
4. Alle fest codierten Texte durch `pageContent.field_name` ersetzen

### Beispiel-Pattern (siehe HomePage.tsx):
```tsx
const FALLBACK_CONTENT = {
  hero_title: "...",
  // ... alle Felder
};

export function YourPage() {
  const { content, loading } = useStoryblok('your-slug');
  const pageContent = content || FALLBACK_CONTENT;
  
  // ... rest of component
  
  return (
    <h1>{pageContent.hero_title}</h1>
  );
}
```

## 🎯 Warum diese Struktur:

1. **Komplett flach** - Keine nested bloks, wie gewünscht
2. **Alles editierbar** - Jeder Text, jede Section ist ein Feld
3. **Pre-seeded** - Alle Daten bereits drin, inkl. Impressum/Datenschutz
4. **Fallback-fähig** - App funktioniert auch ohne Storyblok
5. **Type-safe** - Icons werden per String-Name geladen (Lucide React)

## 📝 Hinweise:

- **Icons**: Icon-Namen sind als Text gespeichert (z.B. "Home", "Users")
- **Bilder**: Können über Storyblok Asset Library verknüpft werden
- **Global Settings**: Werden über useGlobalSettings() geladen
- **SEO**: Alle Pages haben seo_title, seo_description, seo_keywords Felder