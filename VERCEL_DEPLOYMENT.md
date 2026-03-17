# 🚀 Vercel Deployment Guide

## 📋 Voraussetzungen

- ✅ GitHub Repository mit deinem Code
- ✅ Vercel Account (kostenlos): [vercel.com](https://vercel.com)
- ✅ Storyblok Preview Token (optional, aber empfohlen)

---

## 🎯 Deployment in 3 Schritten

### Schritt 1: Vercel mit GitHub verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. **Sign Up** mit GitHub Account
3. Klicke auf **New Project**
4. Wähle dein Repository: `girardi-auer-website`
5. **Import** klicken

### Schritt 2: Environment Variables setzen

**WICHTIG:** Storyblok Token eintragen!

1. Im Import-Dialog scrolle zu **Environment Variables**
2. Füge hinzu:

```
Key:   VITE_STORYBLOK_TOKEN
Value: dein-preview-token-hier
```

**Wo bekomme ich den Preview Token?**
- Gehe zu [app.storyblok.com](https://app.storyblok.com)
- Settings → Access Tokens
- Unter "Access Tokens" → **Preview Token** kopieren

> 💡 **Tipp:** Der Preview Token ist bereits vorhanden, du musst keinen neuen erstellen!

### Schritt 3: Deploy!

1. Klicke auf **Deploy**
2. Warte ca. 2-3 Minuten
3. ✅ **Fertig!** Deine Website ist live!

---

## 🔧 Environment Variables nachträglich ändern

Falls du den Token vergessen hast oder ändern möchtest:

1. Gehe zu deinem Projekt in Vercel
2. **Settings** → **Environment Variables**
3. **Add New**
4. Trage ein:
   - **Key:** `VITE_STORYBLOK_TOKEN`
   - **Value:** `dein-preview-token`
   - **Environments:** Production, Preview, Development (alle 3 auswählen!)
5. **Save**
6. **Redeploy** erforderlich:
   - Gehe zu **Deployments**
   - Klicke auf die neueste Deployment
   - **⋯** (drei Punkte) → **Redeploy**

---

## 🌐 Custom Domain einrichten

### 1. Domain hinzufügen

1. Projekt in Vercel öffnen
2. **Settings** → **Domains**
3. Domain eingeben: `www.girardi-auer.com`
4. **Add** klicken

### 2. DNS konfigurieren

Bei deinem Domain-Provider (z.B. GoDaddy, Namecheap, etc.):

**A Record:**
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   Auto
```

**CNAME Record:**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   Auto
```

### 3. Warten

- DNS-Propagierung dauert 24-48h (meist viel schneller)
- Vercel erstellt automatisch SSL-Zertifikat

---

## ✅ Checklist nach Deployment

- [ ] Website ist erreichbar
- [ ] Storyblok Inhalte werden geladen
- [ ] Bilder werden angezeigt
- [ ] Google Maps funktioniert (Cookie Banner akzeptieren)
- [ ] Kontaktformular funktioniert
- [ ] Cookie Banner erscheint
- [ ] Alle Seiten laden (Home, Über uns, Rechtsgebiete, Kontakt, Impressum, Datenschutz)
- [ ] Mobile Ansicht funktioniert

---

## 🔍 Testen ob Storyblok funktioniert

### Ohne Storyblok Token:
Die Website läuft **trotzdem**, zeigt aber die hardcodierten Default-Werte aus dem Code.

### Mit Storyblok Token:
Die Website lädt Inhalte aus Storyblok CMS.

**So testest du:**
1. Ändere einen Text in Storyblok (z.B. Homepage Titel)
2. Publiziere die Änderung
3. Öffne deine Website
4. Hard-Refresh: `Strg + Shift + R` (Windows) oder `Cmd + Shift + R` (Mac)
5. Der geänderte Text sollte erscheinen

> 💡 **Hinweis:** Storyblok cached die Daten. Änderungen können bis zu 1 Minute dauern.

---

## 🆘 Troubleshooting

### Website zeigt keine Storyblok-Inhalte?

**1. Prüfe Environment Variable:**
```bash
# In Vercel: Settings → Environment Variables
# Sollte da sein:
VITE_STORYBLOK_TOKEN = xxx...
```

**2. Prüfe Token:**
- Gehe zu Storyblok: Settings → Access Tokens
- Kopiere **Preview Token** (nicht Management Token!)
- Trage in Vercel ein
- **Redeploy**

**3. Prüfe Browser Console:**
- Öffne deine Website
- F12 → Console
- Siehst du Storyblok-Fehler?
  - 401 = Token falsch
  - 404 = Story nicht gefunden
  - Network Error = Token nicht gesetzt

### Build Errors?

**Typische Fehler:**

```
Module not found: Can't resolve 'figma:asset/...'
```
→ Normal! Figma-Assets funktionieren nur in Figma Make, nicht im eigenen Build.
→ Ersetze durch normale Imports oder entferne die Imports.

**Lösung:**
Alle `figma:asset` Imports sollten durch normale Bildpfade ersetzt werden:
```typescript
// Vorher:
import imgThomas from "figma:asset/5dde37db7aa29da9edf6f013109276f18eaba54e.png";

// Nachher:
import imgThomas from "../assets/thomas-girardi.jpg";
```

### CSS nicht geladen?

**Prüfe:**
1. `/src/styles/globals.css` existiert
2. In `/src/main.tsx` importiert: `import './styles/globals.css'`

---

## 🚀 Automatische Deployments

Jedes Mal wenn du zu GitHub pushst, deployed Vercel automatisch!

**Workflow:**
```bash
# Änderungen machen
git add .
git commit -m "Update: Neue Texte"
git push

# Vercel deployed automatisch (ca. 2-3 Min.)
# Du bekommst eine Email wenn fertig
```

**Preview Deployments:**
- Jeder Branch bekommt eine eigene Preview-URL
- Perfekt zum Testen vor dem Merge

---

## 📊 Analytics (Optional)

Vercel bietet kostenloses Analytics:

1. Projekt → **Analytics**
2. **Enable Analytics**
3. Siehe Page Views, Performance, etc.

---

## 🔒 Sicherheit

### Environment Variables sind sicher!
- Werden **nicht** im Client-Code exponiert (nur VITE_* Variablen)
- Sind **nicht** im Git Repository
- Nur in Vercel verfügbar

### HTTPS ist automatisch!
- Vercel erstellt automatisch SSL-Zertifikat
- Alle Requests werden über HTTPS geleitet

---

## 💰 Kosten

**Vercel Free Tier:**
- ✅ Unbegrenzte Deployments
- ✅ Automatische SSL-Zertifikate
- ✅ CDN weltweit
- ✅ 100 GB Bandwidth/Monat
- ✅ Perfekt für kleine bis mittlere Websites

**Storyblok Free Tier:**
- ✅ 1 Space
- ✅ Unbegrenzte Inhalte
- ✅ Bis zu 25.000 Content Deliveries/Monat
- ✅ Community Support

→ **Komplett kostenlos für deine Kanzlei-Website!** 🎉

---

## 📚 Weiterführende Links

- [Vercel Docs](https://vercel.com/docs)
- [Storyblok Docs](https://www.storyblok.com/docs)
- [Custom Domains in Vercel](https://vercel.com/docs/concepts/projects/custom-domains)

---

## ✅ Quick Reference

### Wichtige URLs:

**Vercel Dashboard:**
https://vercel.com/dashboard

**Dein Projekt:**
https://vercel.com/[dein-username]/girardi-auer-website

**Storyblok:**
https://app.storyblok.com

**Deine Website:**
https://girardi-auer-website.vercel.app (temporär)
https://www.girardi-auer.com (nach Domain-Setup)

---

🎉 **Happy Deploying!**
