# ✅ Storyblok Token Setup - Schritt für Schritt

## 🔑 **WICHTIG: Zwei verschiedene Tokens!**

Sie benötigen **zwei verschiedene Tokens** für unterschiedliche Zwecke:

### 1️⃣ **Management Token** (für Setup Script)
- **Name:** Persönliches Token / Management Access Token
- **Zweck:** Erstellt Content Types & Stories (hat Schreibrechte)
- **Verwendung:** Nur im Google Apps Script (`/storyblok-setup-complete.gs`)
- **Sicherheit:** ❌ NIEMALS im Frontend oder in `.env` verwenden!

### 2️⃣ **Public Token** (für Frontend/Website)
- **Name:** Public Access Token
- **Zweck:** Liest published Content (read-only)
- **Verwendung:** Im Frontend (Vercel Environment Variables & lokale `.env`)
- **Sicherheit:** ✅ Sicher für Frontend-Nutzung

---

## 🔧 Token in Storyblok finden

1. Öffnen Sie https://app.storyblok.com/
2. Wählen Sie Ihren Space aus
3. Gehen Sie zu **Settings** (⚙️ links in der Sidebar)
4. Klicken Sie auf **Access Tokens**
5. Sie sehen verschiedene Token-Typen:
   - **Preview Token** (für Visual Editor) - ❌ NICHT verwenden
   - **Public Token** (für Content Delivery API) - ✅ Dieser ist für die Website!
   - **Personal Access Token** (Management API) - ✅ Dieser ist für das Setup Script!

### Public Token verwenden (für Website):
Der Token mit **Access level: "Public"** ist der richtige für die Website.

**Beispiel aus Ihrem Screenshot:**
```
Token: jArDuLJq8Z4gXPjKCqDQ7Qtt
Access level: Public
```

✅ **Diesen Token in Vercel setzen!**

---

## 💻 Token lokal setzen (Development)

1. Erstellen Sie eine `.env` Datei im Root-Verzeichnis
2. Fügen Sie diese Zeile hinzu:
   ```
   VITE_STORYBLOK_TOKEN=IHR_PUBLIC_TOKEN_HIER
   ```
3. Ersetzen Sie `IHR_PUBLIC_TOKEN_HIER` mit Ihrem echten Token
4. Speichern Sie die Datei
5. **Starten Sie den Dev-Server neu** (`npm run dev`)

**Beispiel `.env` Datei:**
```
VITE_STORYBLOK_TOKEN=WLWKP9ZfraLjyPlsjFTkyQtt
```

---

## 🚀 Token in Vercel setzen (Production)

1. Öffnen Sie https://vercel.com/
2. Gehen Sie zu Ihrem Projekt
3. Klicken Sie auf **Settings**
4. Gehen Sie zu **Environment Variables**
5. Klicken Sie auf **Add New**
6. Tragen Sie ein:
   - **Name**: `VITE_STORYBLOK_TOKEN`
   - **Value**: Ihr Public Token (z.B. `WLWKP9ZfraLjyPlsjFTkyQtt`)
   - **Environment**: Wählen Sie alle aus (Production, Preview, Development)
7. Klicken Sie auf **Save**
8. **Deployen Sie neu** damit die Änderungen wirksam werden

---

## ✅ Testen ob es funktioniert

Nach dem Setup sollten Sie:

1. **Lokal** (nach Dev-Server Neustart):
   - Keine "access token" Fehler mehr in der Konsole sehen
   - Inhalte von Storyblok werden geladen

2. **In Storyblok**:
   - Ändern Sie etwas in einer Story (z.B. "Practice Areas")
   - Klicken Sie auf **Publish**
   - Laden Sie Ihre Website neu
   - Die Änderung sollte **sofort sichtbar** sein!

---

## 🐛 Troubleshooting

### "You need to provide an access token" Fehler:

✅ **Lösung:**
- Prüfen Sie ob die `.env` Datei im Root-Verzeichnis liegt
- Prüfen Sie ob der Token-Name korrekt ist: `VITE_STORYBLOK_TOKEN`
- Starten Sie den Dev-Server neu
- In Vercel: Prüfen Sie ob die Environment Variable gesetzt ist

### Änderungen in Storyblok werden nicht übernommen:

✅ **Lösung:**
- Stellen Sie sicher, dass Sie auf **Publish** geklickt haben (nicht nur Save)
- Hard-Reload im Browser (Strg+Shift+R oder Cmd+Shift+R)
- Cache-Buster ist bereits implementiert (`cv: Date.now()`)

### "Story not found for practice-areas" Fehler:

✅ **Lösung:**
- Führen Sie das Setup Script aus (`/storyblok-setup-complete.gs`)
- Das Script erstellt alle Stories automatisch
- Prüfen Sie in Storyblok ob die Story "Practice Areas" mit Slug "practice-areas" existiert

---

## 📝 Wichtig!

- **NIEMALS** die `.env` Datei committen (ist bereits in `.gitignore`)
- Verwenden Sie **NUR** den Public Token, nicht den Preview Token
- Der Token ist sicher für Frontend-Nutzung (liest nur published Content)

---

**Bei Fragen:** Prüfen Sie `/STORYBLOK_INTEGRATION_STATUS.md` für weitere Details!