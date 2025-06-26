# 🎉 Nadja's Summer Surprise - Einladungs-App

Eine wunderschöne, interaktive Web-Einladung für Nadjas 40. Geburtstags-Überraschungsparty!

## 📁 Dateien

- **`index.html`** - Die Hauptseite der Einladung
- **`admin.html`** - Admin-Dashboard zum Verwalten der RSVPs
- **`style.css`** - Sommerliches Design mit warmen Farben
- **`script.js`** - Interaktive Funktionen und RSVP-Verarbeitung
- **`server.js`** - Optionaler Node.js Server (für erweiterte Funktionen)
- **`README.md`** - Diese Anleitung

## 🚀 Schnellstart

### Option 1: Einfach im Browser öffnen
1. Öffne die Datei `index.html` direkt in deinem Browser
2. Die Einladung funktioniert sofort!
3. RSVPs werden lokal im Browser gespeichert

### Option 2: Mit lokalem Server (empfohlen)
1. Öffne ein Terminal im `invitation` Ordner
2. Starte den Server: `node server.js`
3. Öffne im Browser: `http://localhost:3000`
4. RSVPs werden auf dem Server gespeichert

## 📋 RSVP-Verwaltung

### 🎯 Admin-Dashboard (EMPFOHLEN für GitHub Pages)
Öffne `admin.html` in deinem Browser oder besuche:
- **Lokal**: `file:///pfad/zu/invitation/admin.html`
- **GitHub Pages**: `https://dein-username.github.io/repository-name/admin.html`

**Features des Admin-Dashboards:**
- 📊 Übersichtliche Statistiken (Zusagen, Absagen, Antwortquote)
- 📋 Alle RSVPs in einer schönen Liste
- 📤 Export-Funktionen (Gästeliste kopieren, E-Mail-Text erstellen)
- 🔄 Automatische Aktualisierung alle 30 Sekunden
- 📱 Responsive Design für alle Geräte

### RSVPs anzeigen (Browser-Konsole)
Öffne die Entwicklertools (F12) und verwende:
```javascript
showAllRSVPs()    // Zeigt alle Antworten
exportRSVPs()     // Exportiert die Gästeliste
```

### RSVPs anzeigen (Server)
Besuche: `http://localhost:3000/api/rsvps`

## 🌐 Online stellen

### Kostenlose Hosting-Optionen:

1. **GitHub Pages**
   - Erstelle ein GitHub Repository
   - Lade alle Dateien hoch
   - Aktiviere GitHub Pages in den Repository-Einstellungen

2. **Netlify**
   - Gehe zu [netlify.com](https://netlify.com)
   - Ziehe den `invitation` Ordner auf die Seite
   - Erhalte sofort eine URL

3. **Vercel**
   - Gehe zu [vercel.com](https://vercel.com)
   - Verbinde dein GitHub Repository
   - Automatisches Deployment

## 📱 Features

- ✨ **Responsive Design** - Funktioniert auf allen Geräten
- 🎨 **Sommerliches Design** - Warme, fröhliche Farben
- 🎊 **Konfetti-Animation** - Bei Zusagen
- 📝 **RSVP-Formular** - Mit Validierung
- 💾 **Automatische Speicherung** - Alle Antworten werden gespeichert
- 🔒 **Geheimhaltungs-Erinnerung** - Deutliche Warnung für Gäste

## 🎯 Verwendung

1. **Link verschicken**: Teile die URL der Einladung mit deinen Gästen
2. **Antworten sammeln**: Gäste füllen das Formular aus
3. **Gästeliste verwalten**: Verwende die Console-Befehle oder Server-API
4. **Party planen**: Basierend auf den Zusagen

## 🛠 Anpassungen

### Text ändern
Bearbeite `index.html` und ändere:
- Datum und Uhrzeit
- Adresse (nach Zusage)
- Persönliche Nachrichten

### Design anpassen
Bearbeite `style.css` für:
- Farben ändern
- Schriftarten anpassen
- Layout-Änderungen

### Funktionen erweitern
Bearbeite `script.js` für:
- Zusätzliche Formularfelder
- Andere Validierungsregeln
- Neue Animationen

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfe die Browser-Konsole auf Fehlermeldungen
2. Stelle sicher, dass alle Dateien im gleichen Ordner sind
3. Bei Server-Problemen: Überprüfe, ob Node.js installiert ist

## 🎈 Tipps für die Party-Planung

### Vor dem Verschicken:
- [ ] Teste die Einladung selbst
- [ ] Überprüfe alle Daten (Datum, Uhrzeit, etc.)
- [ ] Stelle sicher, dass der Geheimhaltungs-Hinweis deutlich ist

### Nach dem Verschicken:
- [ ] Überwache die eingehenden RSVPs
- [ ] Sende Erinnerungen an Nicht-Antwortende
- [ ] Plane das Essen basierend auf der finalen Gästezahl

### Am Partytag:
- [ ] Überprüfe die finale Gästeliste
- [ ] Bereite die Überraschung vor
- [ ] Hab Spaß! 🎉

---

**Viel Erfolg bei Nadjas Überraschungsparty! 🌞🎂**
