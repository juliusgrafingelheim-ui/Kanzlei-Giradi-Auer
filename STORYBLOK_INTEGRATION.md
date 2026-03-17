# Storyblok CMS Integration - Vorbereitung

Diese Website ist für die Integration mit Storyblok CMS vorbereitet.

## Aktuelle Struktur

Die Website verwendet derzeit statische Inhalte, die in den Komponenten definiert sind:

### Seiten
- `HomePage.tsx` - Startseite mit Hero, Features, Über uns Preview
- `AboutPage.tsx` - Über uns Seite
- `TeamPage.tsx` - Team-Mitglieder
- `PracticeAreasPage.tsx` - Rechtsgebiete
- `ContactPage.tsx` - Kontaktseite
- `ImprintPage.tsx` - Impressum
- `PrivacyPage.tsx` - Datenschutz

### Komponenten
- `Header.tsx` - Navigation
- `Footer.tsx` - Footer mit Kontaktdaten

## Für Storyblok-Integration vorzubereiten

### 1. Content Types in Storyblok erstellen

Folgende Content Types sollten in Storyblok angelegt werden:

#### **page_home**
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `hero_quote` (Textarea)
- `hero_image` (Asset)
- `feature1_title` (Text)
- `feature1_description` (Textarea)
- `feature2_title` (Text)
- `feature2_description` (Textarea)
- `feature3_title` (Text)
- `feature3_description` (Textarea)
- `about_preview_text1` (Textarea)
- `about_preview_text2` (Textarea)
- `about_preview_text3` (Textarea)
- `about_preview_image` (Asset)
- `cta_title` (Text)
- `cta_text` (Textarea)

#### **page_about**
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `history_text1` (Textarea)
- `history_text2` (Textarea)
- `history_text3` (Textarea)
- `history_text4` (Textarea)
- `expertise_title` (Text)
- `expertise_text1` (Textarea)
- `expertise_text2` (Textarea)
- `values_title` (Text)
- `values_text1` (Textarea)
- `values_text2` (Textarea)

#### **page_team**
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `team_members` (Block Array) mit:
  - `name` (Text)
  - `title` (Text)
  - `description` (Textarea)
  - `specializations` (Multiselect oder Text Array)
  - `image` (Asset)

#### **page_practice_areas**
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `practice_areas` (Block Array) mit:
  - `title` (Text)
  - `description` (Textarea)
  - `icon_name` (Text)

#### **page_contact**
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `address` (Textarea)
- `phone` (Text)
- `fax` (Text)
- `email` (Text)
- `office_hours` (Textarea)
- `map_embed` (Textarea)

#### **global_settings**
- `site_name` (Text)
- `attorney_names` (Text Array)
- `slogan` (Text)
- `logo` (Asset)
- `footer_address` (Textarea)
- `footer_phone` (Text)
- `footer_email` (Text)
- `footer_hours` (Textarea)
- `social_links` (Block Array)

### 2. Custom Hook erstellen

Ein `usePageContent` Hook sollte erstellt werden:

```typescript
// hooks/usePageContent.ts
import { useStoryblok } from '@storyblok/react';

export function usePageContent(slug: string) {
  const story = useStoryblok(slug, { version: 'draft' });
  
  const getText = (field: string) => {
    return story?.content?.[field] || '';
  };
  
  const getAsset = (field: string) => {
    return story?.content?.[field]?.filename || '';
  };
  
  const getArray = (field: string) => {
    return story?.content?.[field] || [];
  };
  
  return {
    content: story?.content,
    getText,
    getAsset,
    getArray,
    isLoading: !story,
  };
}
```

### 3. Beispiel-Integration

Beispiel, wie eine Seite nach der Integration aussehen würde:

```typescript
// pages/HomePage.tsx
import { usePageContent } from '../hooks/usePageContent';

export function HomePage() {
  const { getText, getAsset, getArray } = usePageContent('home');
  
  return (
    <section>
      <h1>{getText('hero_title')}</h1>
      <p>{getText('hero_subtitle')}</p>
      <img src={getAsset('hero_image')} alt="Hero" />
      {/* ... */}
    </section>
  );
}
```

### 4. Storyblok SDK Installation

Nach dem Deployment auf Vercel:

```bash
npm install @storyblok/react
```

### 5. Umgebungsvariablen

In Vercel folgende Environment Variables setzen:

```
VITE_STORYBLOK_ACCESS_TOKEN=your_access_token
```

### 6. Storyblok Provider

In `App.tsx` den Storyblok Provider einbinden:

```typescript
import { storyblokInit, apiPlugin } from '@storyblok/react';

storyblokInit({
  accessToken: import.meta.env.VITE_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
});
```

## Migration Plan

1. ✅ Statische Website erstellen (ERLEDIGT)
2. ⏳ Deployment auf Vercel & GitHub
3. ⏳ Storyblok Space einrichten
4. ⏳ Content Types in Storyblok anlegen
5. ⏳ Storyblok SDK installieren und konfigurieren
6. ⏳ `usePageContent` Hook implementieren
7. ⏳ Seiten schrittweise migrieren
8. ⏳ Bilder in Storyblok Asset Manager hochladen
9. ⏳ Content in Storyblok befüllen
10. ⏳ Testing und Finalisierung

## Vorteile nach Integration

- ✨ Alle Texte und Bilder über Storyblok CMS editierbar
- ✨ Kein Code-Deployment für Content-Änderungen nötig
- ✨ Preview-Modus für Entwürfe
- ✨ Mehrsprachigkeit einfach erweiterbar
- ✨ Strukturierte Content-Verwaltung
