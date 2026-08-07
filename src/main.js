const { app, BrowserWindow, Tray, Menu, Notification, ipcMain, screen } = require('electron');
const path = require('path');
const store = require('./store');
const { THEMES, FONTS } = require('./themes');

const MINI_SIZE = { width: 340, height: 150 };
const FULL_SIZE = { width: 560, height: 680 };

let tray = null;
let mainWindow = null;
let popupTimer = null;
let cycleTimer = null;
let quitting = false;

// History of phrase indices already shown, so "back" works the same in
// shuffle or sequential mode (like Spotify's prev button).
let history = [];
let historyPos = -1;
let sequentialCursor = -1;

function pickPhrase() {
  const phrases = store.get('phrases');
  if (!phrases.length) return 'Add a phrase in the library to get started!';
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function nextIndex(phrases) {
  const mode = store.get('playMode') || 'shuffle';
  if (mode === 'sequential') {
    sequentialCursor = (sequentialCursor + 1) % phrases.length;
    return sequentialCursor;
  }
  if (phrases.length === 1) return 0;
  let idx;
  const prevIdx = history[historyPos];
  do {
    idx = Math.floor(Math.random() * phrases.length);
  } while (idx === prevIdx);
  return idx;
}

function advancePhrase(direction) {
  const phrases = store.get('phrases');
  if (!phrases.length) return 'Add a phrase in the library to get started!';

  if (direction === 'prev' && historyPos > 0) {
    historyPos -= 1;
  } else if (direction === 'next' && historyPos < history.length - 1) {
    historyPos += 1;
  } else {
    const idx = nextIndex(phrases);
    history.push(idx);
    if (history.length > 50) history.shift();
    historyPos = history.length - 1;
  }

  const idx = history[historyPos];
  return phrases[idx] !== undefined ? phrases[idx] : pickPhrase();
}

function createMainWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: MINI_SIZE.width,
    height: MINI_SIZE.height,
    x: width - MINI_SIZE.width - 20,
    y: 40,
    frame: false,
    resizable: false,
    alwaysOnTop: store.get('pinned'),
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'app.html'));

  mainWindow.on('close', (e) => {
    if (!quitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  startCycle();
}

function setWindowMode(mode) {
  if (!mainWindow) return;
  const size = mode === 'full' ? FULL_SIZE : MINI_SIZE;
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  const bounds = mainWindow.getBounds();
  const newX = mode === 'full' ? Math.min(bounds.x, width - size.width - 20) : bounds.x;
  mainWindow.setResizable(true);
  mainWindow.setBounds({
    x: Math.max(0, newX),
    y: bounds.y,
    width: size.width,
    height: size.height
  });
  mainWindow.setResizable(mode === 'full');
}

function startCycle() {
  if (cycleTimer) clearInterval(cycleTimer);
  const seconds = store.get('widgetCycleSeconds');
  sendPhraseToWidget();
  cycleTimer = setInterval(sendPhraseToWidget, seconds * 1000);
}

function sendPhraseToWidget(direction = 'next') {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('phrase', advancePhrase(direction));
  }
}

function startPopupTimer() {
  if (popupTimer) clearInterval(popupTimer);
  const minutes = store.get('popupFrequencyMinutes');
  popupTimer = setInterval(() => {
    if (!store.get('popupsEnabled')) return;
    new Notification({
      title: 'Ember',
      body: pickPhrase()
    }).show();
  }, minutes * 60 * 1000);
}

function buildTrayMenu() {
  const pinned = store.get('pinned');
  const popupsEnabled = store.get('popupsEnabled');
  const freq = store.get('popupFrequencyMinutes');

  const freqOptions = [5, 15, 30, 60, 120, 240];

  return Menu.buildFromTemplate([
    { label: 'Show Widget', click: () => mainWindow.show() },
    {
      label: 'Open Settings',
      click: () => {
        mainWindow.show();
        mainWindow.webContents.send('open-settings');
      }
    },
    { type: 'separator' },
    {
      label: 'Pin Widget On Top',
      type: 'checkbox',
      checked: pinned,
      click: (item) => {
        store.set('pinned', item.checked);
        if (mainWindow) mainWindow.setAlwaysOnTop(item.checked);
      }
    },
    {
      label: 'Popup Reminders',
      type: 'checkbox',
      checked: popupsEnabled,
      click: (item) => store.set('popupsEnabled', item.checked)
    },
    {
      label: 'Play Mode',
      submenu: ['shuffle', 'sequential'].map((m) => ({
        label: m === 'shuffle' ? 'Shuffle' : 'Sequential',
        type: 'radio',
        checked: (store.get('playMode') || 'shuffle') === m,
        click: () => {
          store.set('playMode', m);
          history = [];
          historyPos = -1;
          sequentialCursor = -1;
        }
      }))
    },
    {
      label: 'Popup Frequency',
      submenu: freqOptions.map((m) => ({
        label: m < 60 ? `${m} min` : `${m / 60} hr`,
        type: 'radio',
        checked: freq === m,
        click: () => {
          store.set('popupFrequencyMinutes', m);
          startPopupTimer();
        }
      }))
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        quitting = true;
        app.quit();
      }
    }
  ]);
}

app.whenReady().then(() => {
  createMainWindow();
  startPopupTimer();

  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setToolTip('Ember');
  tray.setContextMenu(buildTrayMenu());
  tray.on('click', () => {
    if (mainWindow.isVisible()) mainWindow.hide();
    else mainWindow.show();
  });
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('before-quit', () => {
  quitting = true;
});

ipcMain.handle('get-phrases', () => store.get('phrases'));
ipcMain.handle('set-phrases', (e, phrases) => {
  store.set('phrases', phrases);
  return true;
});
ipcMain.handle('get-settings', () => ({
  popupFrequencyMinutes: store.get('popupFrequencyMinutes'),
  widgetCycleSeconds: store.get('widgetCycleSeconds'),
  popupsEnabled: store.get('popupsEnabled'),
  pinned: store.get('pinned'),
  theme: store.get('theme'),
  playMode: store.get('playMode') || 'shuffle',
  font: store.get('font') || 'poppins'
}));
ipcMain.handle('get-themes', () => THEMES);
ipcMain.handle('get-fonts', () => FONTS);
ipcMain.handle('set-settings', (e, settings) => {
  if (settings.popupFrequencyMinutes) {
    store.set('popupFrequencyMinutes', settings.popupFrequencyMinutes);
    startPopupTimer();
  }
  if (settings.widgetCycleSeconds) {
    store.set('widgetCycleSeconds', settings.widgetCycleSeconds);
    startCycle();
  }
  if (typeof settings.popupsEnabled === 'boolean') {
    store.set('popupsEnabled', settings.popupsEnabled);
  }
  if (typeof settings.pinned === 'boolean') {
    store.set('pinned', settings.pinned);
    if (mainWindow) mainWindow.setAlwaysOnTop(settings.pinned);
  }
  if (settings.theme) {
    store.set('theme', settings.theme);
  }
  if (settings.font) {
    store.set('font', settings.font);
  }
  if (settings.playMode) {
    store.set('playMode', settings.playMode);
    history = [];
    historyPos = -1;
    sequentialCursor = -1;
  }
  tray.setContextMenu(buildTrayMenu());
  return true;
});
ipcMain.on('close-widget', () => {
  if (mainWindow) mainWindow.hide();
});
ipcMain.on('next-phrase', () => sendPhraseToWidget('next'));
ipcMain.on('prev-phrase', () => sendPhraseToWidget('prev'));
ipcMain.on('set-window-mode', (e, mode) => setWindowMode(mode));
