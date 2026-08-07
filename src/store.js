const Store = require('electron-store');

const defaults = {
  phrases: [
    'Discipline is choosing between what you want now and what you want most.',
    'You don’t have to be great to start, but you have to start to be great.',
    'Small steps every day beat big leaps once in a while.',
    'Show up. Especially when you don’t feel like it.',
    'Motivation gets you going. Discipline keeps you going.'
  ],
  popupFrequencyMinutes: 60,
  widgetCycleSeconds: 20,
  pinned: true,
  popupsEnabled: true,
  theme: 'sunrise',
  playMode: 'shuffle',
  font: 'poppins'
};

const store = new Store({ defaults });

module.exports = store;
