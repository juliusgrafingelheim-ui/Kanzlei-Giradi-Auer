# 🚀 Quick Start Checkliste

## ✅ Sofort loslegen (5 Minuten)

### 1. Projekt Setup
```bash
npm install
npm run dev
```
→ Website läuft auf `http://localhost:5173` ✨

---

## 🎨 CMS Integration (Optional - 15 Minuten)

### 2. Storyblok Account
1. Gehe zu [app.storyblok.com](https://app.storyblok.com)
2. Erstelle Account (kostenlos)
3. Erstelle neuen Space: "Girardi & Auer"

### 3. Tokens holen
**Management Token:**
- Settings → Access Tokens → Personal Access Tokens → Generate new token
- Alle Scopes auswählen
- Token kopieren

**Preview Token:**
- Settings → Access Tokens → (schon vorhanden)
- Token kopieren

**Space ID:**
- Settings → General → Space ID (z.B. "123456")

### 4. Google Apps Script
1. Gehe zu [script.google.com](https://script.google.com)
2. Neues Projekt erstellen
3. Öffne `storyblok-setup.gs` aus diesem Projekt
4. Code kopieren und in Google Apps Script einfügen
5. Tokens eintragen:
```javascript
var STORYBLOK_MANAGEMENT_TOKEN = 'dein-token';
var STORYBLOK_SPACE_ID = '123456';
```
6. Speichern
7. Funktion wählen: **setupStoryblok**
8. Ausführen (▶️)
9. Berechtigungen bestätigen (beim ersten Mal)

---

## 📧 Kontaktformular Setup

### 7. Google Apps Script
1. Gehe zu [script.google.com](https://script.google.com)
2. Neues Projekt erstellen
3. Code einfügen:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  const recipient = "info@girardi-auer.com";
  const subject = `Neue Kontaktanfrage von ${data.name}`;
  const body = `
    Name: ${data.name}
    Email: ${data.email}
    Telefon: ${data.phone || 'Nicht angegeben'}
    
    Nachricht:
    ${data.message}
  `;
  
  MailApp.sendEmail(recipient, subject, body);
  
  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. **Bereitstellen** → Als Web-App
5. Zugriff: "Jeder"
6. URL kopieren

### 8. API konfigurieren
Öffne `/api/contact.ts`:
```typescript
const GOOGLE_SCRIPT_URL = 'deine-script-url-hier';
```

---

## 🌐 Deployment

### 9. Vercel Deploy
```bash
# Vercel CLI installieren
npm i -g vercel

# Anmelden
vercel login

# Deploy
vercel
```

### 10. Environment Variables in Vercel
**WICHTIG:** Storyblok Token setzen!

**Option 1 - Beim ersten Deploy:**
- Im Import-Dialog: Environment Variables → Add
- Key: `VITE_STORYBLOK_TOKEN`
- Value: `dein-preview-token` (aus Storyblok Settings → Access Tokens)

**Option 2 - Nachträglich:**
1. Vercel Dashboard → Dein Projekt
2. Settings → Environment Variables
3. Add New:
   - Key: `VITE_STORYBLOK_TOKEN`
   - Value: `dein-preview-token`
   - Environments: Alle 3 auswählen (Production, Preview, Development)
4. Save
5. Redeploy erforderlich (Deployments → neuestes → Redeploy)

**Preview Token holen:**
- Storyblok: Settings → Access Tokens → Preview Token (schon vorhanden)

📖 **Detaillierte Anleitung:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## ✅ Fertig!

Deine Website ist jetzt live! 🎉

### Was du jetzt hast:
- ✅ Moderne React Website
- ✅ CMS-Integration (optional)
- ✅ Funktionierendes Kontaktformular
- ✅ DSGVO-konform
- ✅ Production-ready

---

## 📚 Weiterführende Docs

- [README.md](./README.md) - Vollständige Dokumentation
- [STORYBLOK_SETUP.md](./STORYBLOK_SETUP.md) - Detaillierte CMS-Anleitung

---

## 🆘 Probleme?

### Website startet nicht?
```bash
rm -rf node_modules
npm install
npm run dev
```

### Storyblok zeigt keine Daten?
- Prüfe `.env` Datei
- Prüfe Token in Storyblok
- Server neu starten

### Kontaktformular funktioniert nicht?
- Prüfe Google Apps Script URL
- Prüfe ob Script deployed ist
- Schaue in Browser Console

---

**Viel Erfolg! 🚀**