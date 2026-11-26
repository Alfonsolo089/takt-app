# Takt – veröffentlichte App

**Hier nicht bearbeiten.** Dieses Repo enthält nur die gebaute App (`index.html`,
Manifest, Service Worker und Icons für die Installation auf dem Handy) und wird bei jeder Veröffentlichung vollständig ersetzt (zuletzt aus Stand `7955142`).

Die App: https://alfonsolo089.github.io/takt-app/

## Warum ein eigenes Repo?

Entwickelt wird im privaten Repo `Alfonsolo089/takt` (Quellcode, Datenbank-Schema,
Tests, Verlauf). GitHub Pages gibt es im kostenlosen GitHub-Tarif nur für öffentliche
Repos. Damit Code und Verlauf privat bleiben, liegt nur das fertige Ergebnis hier.

Die App enthält keine Geheimnisse: Der Supabase-Schlüssel darin ist der öffentliche
(publishable) Schlüssel; wer was sehen darf, regeln die Zugriffsregeln in der Datenbank.

## Neue Version veröffentlichen

Im Repo `takt`: `npm install` (einmalig), dann `node deploy.mjs`.
