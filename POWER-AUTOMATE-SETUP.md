# 🔄 Power Automate Setup für Nadja's Party

Diese Anleitung erklärt, wie du deinen Power Automate Flow konfigurierst, um die RSVP-Daten zu empfangen.

## 📋 Schritt-für-Schritt Anleitung

### 1. Flow erstellen
1. Gehe zu [Power Automate](https://make.powerautomate.com)
2. Klicke auf "Neuer Flow" → "Automatisierter Cloud-Flow"
3. Wähle als Trigger: **"Wenn eine HTTP-Anforderung empfangen wird"**

### 2. HTTP-Trigger konfigurieren
1. Klicke auf den HTTP-Trigger
2. Kopiere das **JSON Schema** aus der Datei `power-automate-schema.json`
3. Füge es in das Feld "JSON-Schema für Anforderungstext" ein

### 3. Beispiel-Aktionen hinzufügen

#### Option A: E-Mail senden
1. Füge Aktion hinzu: **"E-Mail senden (V2)"**
2. Konfiguration:
   - **An**: Deine E-Mail-Adresse
   - **Betreff**: `Neue RSVP für Nadjas Party: [Name]`
   - **Text**: 
   ```
   🎉 Neue Antwort für Nadjas Überraschungsparty!
   
   👤 Name: [Name]
   ✅ Antwort: [response]
   💬 Nachricht: [message]
   📅 Zeitpunkt: [date] um [time]
   
   Aktuelle Gästeliste in Power Automate prüfen!
   ```

#### Option B: In Excel/SharePoint speichern
1. Füge Aktion hinzu: **"Zeile zu Tabelle hinzufügen"**
2. Wähle deine Excel-Datei oder SharePoint-Liste
3. Mappe die Felder:
   - Name → `name`
   - Antwort → `response`
   - Nachricht → `message`
   - Datum → `date`
   - Uhrzeit → `time`

#### Option C: Teams-Nachricht senden
1. Füge Aktion hinzu: **"Nachricht in einem Kanal posten"**
2. Konfiguration:
   - **Team**: Dein Team
   - **Kanal**: Gewünschter Kanal
   - **Nachricht**:
   ```
   🎉 **Neue RSVP für Nadjas Party!**
   
   **Name:** [Name]
   **Antwort:** [response]
   **Nachricht:** [message]
   **Zeitpunkt:** [date] um [time]
   ```

### 4. Flow testen
1. Speichere den Flow
2. Kopiere die **HTTP POST URL** aus dem Trigger
3. Ersetze die URL in `script.js` (Zeile 67) mit deiner neuen URL
4. Teste die Einladung mit einem Dummy-Eintrag

## 📊 Beispiel-Daten

Das JavaScript sendet folgende Daten an deinen Flow:

```json
{
  "name": "Max Mustermann",
  "response": "yes",
  "message": "Freue mich riesig auf die Party!",
  "timestamp": "2025-08-01T15:30:45.123Z",
  "date": "01.08.2025",
  "time": "15:30:45"
}
```

## 🔧 Erweiterte Konfigurationen

### Bedingte Aktionen
Du kannst verschiedene Aktionen basierend auf der Antwort ausführen:

1. Füge eine **Bedingung** hinzu
2. Prüfe: `response` ist gleich `yes`
3. **Wenn ja**: Sende Bestätigungs-E-Mail, füge zu Gästeliste hinzu
4. **Wenn nein**: Sende Absage-Bestätigung

### Automatische Antworten
Du kannst automatisch E-Mails an die Gäste senden:

1. Füge **"E-Mail senden (V2)"** hinzu
2. **An**: Du müsstest das E-Mail-Feld wieder in die Einladung einbauen
3. **Betreff**: `Bestätigung: Nadjas Überraschungsparty`
4. **Text**: Personalisierte Bestätigung basierend auf der Antwort

### Gästelisten-Verwaltung
Erstelle eine Excel-Tabelle mit folgenden Spalten:
- Name
- Antwort
- Nachricht
- Datum
- Uhrzeit
- Status (Zusage/Absage)

## 🚨 Wichtige Hinweise

1. **URL geheim halten**: Die Power Automate URL sollte nicht öffentlich geteilt werden
2. **CORS**: Power Automate erlaubt standardmäßig Cross-Origin-Requests
3. **Fehlerbehandlung**: Das JavaScript zeigt auch bei Fehlern eine Erfolgsmeldung (bessere UX)
4. **Backup**: RSVPs werden zusätzlich lokal im Browser gespeichert

## 📱 Mobile Optimierung

Der Flow funktioniert auch, wenn Gäste von Mobilgeräten antworten. Alle Daten werden korrekt übertragen.

## 🎯 Nächste Schritte

1. Flow nach dieser Anleitung erstellen
2. URL in `script.js` aktualisieren
3. Einladung testen
4. Auf GitHub Pages deployen
5. Link an Gäste verschicken
6. RSVPs in Power Automate verfolgen

---

**Viel Erfolg mit der automatisierten Gästeverwaltung! 🎉**
