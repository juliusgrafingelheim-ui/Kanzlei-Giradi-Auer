# 📝 Google Apps Script Setup - Storyblok

## 🎯 Verwendung

Diese Datei (`storyblok-setup.gs`) ist ein **Google Apps Script**, das automatisch alle Content Types und Seiten in Storyblok anlegt.

---

## 🚀 Setup in 5 Schritten

### 1. Google Apps Script öffnen
Gehe zu: [https://script.google.com](https://script.google.com)

### 2. Neues Projekt erstellen
- Klicke auf **Neues Projekt**
- Benenne es: "Storyblok Setup - Girardi & Auer"

### 3. Code einfügen
1. Öffne die Datei `storyblok-setup.gs` aus diesem Projekt
2. Kopiere den **kompletten Code**
3. Füge ihn in Google Apps Script ein (ersetze den vorhandenen Code)

### 4. Tokens konfigurieren

Gehe zu [app.storyblok.com](https://app.storyblok.com) und hole:

**A) Management Token:**
- Settings → Access Tokens → Personal Access Tokens
- **Generate new token**
- Name: "Setup Script"
- Scopes: **Alle auswählen**
- Token kopieren

**B) Space ID:**
- Settings → General → Space ID
- Kopiere die Nummer (z.B. "123456")

Trage beides in Google Apps Script ein:

```javascript
var STORYBLOK_MANAGEMENT_TOKEN = 'dein-management-token-hier';
var STORYBLOK_SPACE_ID = '123456'; // Deine Space ID
```

### 5. Script ausführen

1. **Speichern** (💾 Icon oder Strg+S)
2. Funktion wählen in Dropdown: **setupStoryblok**
3. **Ausführen** (▶️ Icon)

---

## 🔐 Berechtigungen (beim ersten Mal)

Wenn du das Script zum ersten Mal ausführst:

1. Dialog: "Berechtigung erforderlich"
2. Klicke auf **Berechtigungen prüfen**
3. Wähle deinen Google Account
4. **Erweitert** klicken
5. "Zu [Projektname] (unsicher) wechseln" klicken
6. **Zulassen**

> ⚠️ Das ist normal! Google zeigt diese Warnung, weil das Script externe APIs aufruft (Storyblok).

---

## 📊 Ausführung

Das Script läuft ca. **30 Sekunden** und erstellt:

- ✅ 7 Content Types (alle Seiten)
- ✅ 7 Stories (mit Beispiel-Inhalten)
- ✅ 200+ Felder (komplett flat!)

### Im Ausführungsprotokoll siehst du:

```
🚀 Starting Storyblok Setup (FLAT VERSION)...

📦 Creating Components...
✅ Created component: Homepage
✅ Created component: Über Uns Seite
✅ Created component: Rechtsgebiete Seite
✅ Created component: Kontakt Seite
✅ Created component: Impressum Seite
✅ Created component: Datenschutz Seite
✅ Created component: Globale Einstellungen

📄 Creating Stories...
✅ Created story: home
✅ Created story: ueber-uns
✅ Created story: rechtsgebiete
✅ Created story: kontakt
✅ Created story: impressum
✅ Created story: datenschutz
✅ Created story: global-settings

✅ Setup completed successfully!
```

---

## 🎨 Was wird erstellt?

### Content Types (7 Stück):

1. **page_home** - Homepage (35 Felder)
2. **page_about** - Über Uns (65+ Felder inkl. 5 Team-Members)
3. **page_practice_areas** - Rechtsgebiete (35+ Felder inkl. 9 Rechtsgebiete)
4. **page_contact** - Kontakt (22 Felder)
5. **page_impressum** - Impressum (20+ Felder)
6. **page_datenschutz** - Datenschutz (25 Felder)
7. **settings_global** - Globale Einstellungen (13 Felder)

### Stories (7 Stück):

Alle Seiten werden mit **Default-Werten** angelegt, die den aktuellen Frontend-Inhalten entsprechen.

---

## ✅ Nach dem Setup

1. Gehe zu [app.storyblok.com](https://app.storyblok.com)
2. Navigiere zu deinem Space
3. Öffne **Content** → Du siehst alle 7 Stories
4. Öffne **Components** → Du siehst alle 7 Content Types

### Jetzt kannst du:

- ✅ Bilder hochladen (Team-Fotos, Hero-Images)
- ✅ Richtext-Felder ausfüllen (Impressum, Datenschutz)
- ✅ Texte anpassen
- ✅ Publizieren!

---

## 🔧 Preview Token holen

Für das Frontend brauchst du noch den **Preview Token**:

1. In Storyblok: **Settings** → **Access Tokens**
2. Unter "Access Tokens" findest du den **Preview Token**
3. Kopiere ihn
4. Erstelle `.env` Datei im Projekt:

```env
VITE_STORYBLOK_TOKEN=dein-preview-token-hier
```

---

## 🆘 Troubleshooting

### "API Error: 401"
→ Management Token ist falsch oder abgelaufen
→ Neuen Token generieren und erneut versuchen

### "API Error: 404"
→ Space ID ist falsch
→ Prüfe die Space ID in Storyblok Settings → General

### "Component XYZ might already exist"
→ Das ist OK! Bedeutet, dass das Component schon existiert
→ Script läuft trotzdem weiter

### Script hängt / timeout
→ Internet-Verbindung prüfen
→ Später erneut versuchen

---

## 💡 Tipps

### Script erneut ausführen?
Kein Problem! Das Script prüft, ob Components/Stories schon existieren und überspringt sie.

### Content Type ändern?
Wenn du später Felder ändern möchtest, mach das direkt in Storyblok:
- Components → Content Type wählen → Edit

### Fehler beim Löschen?
Falls du von vorne anfangen willst:
1. In Storyblok: Components → Alle manuell löschen
2. Content → Alle Stories löschen
3. Script erneut ausführen

---

## 📚 Weitere Infos

- [STORYBLOK_SETUP.md](./STORYBLOK_SETUP.md) - Vollständige Setup-Anleitung
- [SEO_UND_STORYBLOK.md](./SEO_UND_STORYBLOK.md) - Übersicht aller Felder

---

🎉 **Viel Erfolg mit deinem Storyblok Setup!**
