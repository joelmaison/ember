const THEMES = {
  sunrise: {
    name: 'Sunrise',
    gradient: ['#ff9966', '#ff5e62', '#ff9966'],
    accent: '#ff5e62',
    text: '#ffffff',
    panelBg: '#fff4ec',
    panelText: '#4a2c1a',
    panelSubtext: '#8a6a5a',
    cardBg: '#ffffff',
    border: '#e8d3c5'
  },
  midnight: {
    name: 'Midnight',
    gradient: ['#0f2027', '#203a43', '#2c5364'],
    accent: '#2c5364',
    text: '#eaf6ff',
    panelBg: '#0f1b22',
    panelText: '#eaf6ff',
    panelSubtext: '#8fb3c2',
    cardBg: '#16262f',
    border: '#223a45'
  },
  forest: {
    name: 'Forest',
    gradient: ['#134e5e', '#71b280', '#134e5e'],
    accent: '#3a8a5c',
    text: '#ffffff',
    panelBg: '#f2f8f4',
    panelText: '#1f3a2c',
    panelSubtext: '#5f7d6c',
    cardBg: '#ffffff',
    border: '#d3e6da'
  },
  candy: {
    name: 'Candy',
    gradient: ['#a18cd1', '#fbc2eb', '#a18cd1'],
    accent: '#a18cd1',
    text: '#3a2050',
    panelBg: '#faf5ff',
    panelText: '#3a2050',
    panelSubtext: '#8a76a3',
    cardBg: '#ffffff',
    border: '#e6d9f5'
  },
  mono: {
    name: 'Mono',
    gradient: ['#3a3a3a', '#1c1c1c', '#3a3a3a'],
    accent: '#555555',
    text: '#f5f5f5',
    panelBg: '#f4f4f4',
    panelText: '#1c1c1c',
    panelSubtext: '#6b6b6b',
    cardBg: '#ffffff',
    border: '#dddddd'
  },
  ocean: {
    name: 'Ocean',
    gradient: ['#2193b0', '#6dd5ed', '#2193b0'],
    accent: '#2193b0',
    text: '#ffffff',
    panelBg: '#eef8fb',
    panelText: '#0d3a47',
    panelSubtext: '#4f7f8c',
    cardBg: '#ffffff',
    border: '#cfe9f0'
  },
  lavender: {
    name: 'Lavender',
    gradient: ['#7f7fd5', '#86a8e7', '#91eae4'],
    accent: '#7f7fd5',
    text: '#ffffff',
    panelBg: '#f5f6fd',
    panelText: '#33345c',
    panelSubtext: '#71739e',
    cardBg: '#ffffff',
    border: '#dcdef4'
  },
  autumn: {
    name: 'Autumn',
    gradient: ['#d38312', '#a83279', '#d38312'],
    accent: '#a83279',
    text: '#ffffff',
    panelBg: '#fdf3ee',
    panelText: '#4a2233',
    panelSubtext: '#8a5f70',
    cardBg: '#ffffff',
    border: '#f0d9de'
  },
  roseGold: {
    name: 'Rose Gold',
    gradient: ['#f7cac9', '#e8a87c', '#f7cac9'],
    accent: '#c97b63',
    text: '#4a2c22',
    panelBg: '#fdf5f1',
    panelText: '#4a2c22',
    panelSubtext: '#8f6f61',
    cardBg: '#ffffff',
    border: '#f0ddd0'
  },
  slate: {
    name: 'Slate',
    gradient: ['#485563', '#29323c', '#485563'],
    accent: '#4d5f70',
    text: '#f0f3f5',
    panelBg: '#f1f3f5',
    panelText: '#2a333b',
    panelSubtext: '#657280',
    cardBg: '#ffffff',
    border: '#dde2e6'
  },
  neon: {
    name: 'Neon',
    gradient: ['#0f0c29', '#302b63', '#24243e'],
    accent: '#7b2ff7',
    text: '#e6e0ff',
    panelBg: '#12102a',
    panelText: '#e6e0ff',
    panelSubtext: '#9a8fc9',
    cardBg: '#1b1840',
    border: '#332e63'
  }
};

const FONTS = {
  poppins: { name: 'Poppins', stack: "'Poppins', 'Segoe UI', system-ui, sans-serif" },
  inter: { name: 'Inter', stack: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  fredoka: { name: 'Fredoka', stack: "'Fredoka', 'Segoe UI', system-ui, sans-serif" },
  playfair: { name: 'Playfair Display', stack: "'Playfair Display', Georgia, serif" },
  spacemono: { name: 'Space Mono', stack: "'Space Mono', 'Courier New', monospace" }
};

module.exports = { THEMES, FONTS };
