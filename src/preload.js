const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onPhrase: (callback) => ipcRenderer.on('phrase', (e, phrase) => callback(phrase)),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', () => callback()),
  closeWidget: () => ipcRenderer.send('close-widget'),
  nextPhrase: () => ipcRenderer.send('next-phrase'),
  prevPhrase: () => ipcRenderer.send('prev-phrase'),
  getPhrases: () => ipcRenderer.invoke('get-phrases'),
  setPhrases: (phrases) => ipcRenderer.invoke('set-phrases', phrases),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (settings) => ipcRenderer.invoke('set-settings', settings),
  getThemes: () => ipcRenderer.invoke('get-themes'),
  getFonts: () => ipcRenderer.invoke('get-fonts'),
  setWindowMode: (mode) => ipcRenderer.send('set-window-mode', mode)
});
