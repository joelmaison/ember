# Ember

A motivational reminder desktop app, built with Electron. Keeps a small always-on-top widget cycling through your own phrases, plus scheduled popup reminders — all wrapped in a single window that grows into a full settings view instead of opening separate popups.

## Features

- **Mini widget** — small always-on-top window in the corner cycling through your phrases. Hover to reveal left/right arrows to go back/forward manually.
- **Playback mode** — Shuffle or Sequential, like Spotify. Shuffle keeps a history so "back" returns to what you actually saw, not a new random pick.
- **Popup reminders** — desktop notifications on a timer you control (5 min to 4 hr), toggle on/off.
- **In-app settings** — click the gear to grow the same window into a larger settings view: phrase library, theme picker, font picker, and reminder settings.
- **10 themes** and **5 fonts** (Poppins, Inter, Fredoka, Playfair Display, Space Mono) to personalize the look.
- Runs in the system tray — closing the window minimizes it instead of quitting.
- All data stored locally (via `electron-store`) — no account or cloud sync.

## Getting started

```bash
git clone https://github.com/joelmaison/ember.git
cd ember
npm install
npm start
```

## Building an installer

```bash
npm run dist
```

Produces an NSIS installer at `dist/Ember Setup <version>.exe` (Windows Developer Mode must be enabled to build this). Running the installer creates a desktop shortcut and Start Menu entry.

Alternatively, for a portable build with no installer:

```bash
npm run package
```

Produces a standalone app folder at `dist-packaged/Ember-win32-x64/`.

## Notes

- `node_modules/`, `dist/`, `dist-packaged/`, and `*.log` are gitignored — they're build artifacts, not source.
- The installer is unsigned, so Windows SmartScreen may show a warning on first run — click **More info → Run anyway**.
