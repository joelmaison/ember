const miniEl = document.getElementById('mini');
const fullEl = document.getElementById('full');
const phraseEl = document.getElementById('phrase');
const listEl = document.getElementById('list');
const themeGrid = document.getElementById('themeGrid');

let phrases = [];
let themes = {};
let fonts = {};
let currentTheme = 'sunrise';
let currentFont = 'poppins';

function applyTheme(key) {
  const t = themes[key];
  if (!t) return;
  currentTheme = key;

  miniEl.style.background = `linear-gradient(135deg, ${t.gradient.join(', ')})`;
  phraseEl.style.color = t.text;

  fullEl.style.background = t.panelBg;
  fullEl.style.color = t.panelText;

  document.querySelectorAll('section').forEach((s) => {
    s.style.background = t.cardBg;
  });
  document.querySelectorAll('h2').forEach((h) => {
    h.style.color = t.accent;
  });
  document.querySelectorAll('input[type=text], select').forEach((el) => {
    el.style.borderColor = t.border;
    el.style.background = t.cardBg;
    el.style.color = t.panelText;
  });
  document.querySelectorAll('.phrase-item').forEach((el) => {
    el.style.borderBottomColor = t.border;
  });
  document.querySelectorAll('button.action').forEach((el) => {
    el.style.background = t.accent;
    el.style.color = '#fff';
  });
  document.querySelectorAll('button.secondary').forEach((el) => {
    el.style.background = t.border;
    el.style.color = t.panelText;
  });
  document.querySelectorAll('label').forEach((el) => {
    el.style.color = t.panelText;
  });

  const backBtn = document.getElementById('backBtn');
  backBtn.style.background = t.accent;
  backBtn.style.color = '#fff';

  if (Object.keys(fonts).length) renderFontGrid(t);

  document.querySelectorAll('.theme-swatch').forEach((el) => {
    el.classList.toggle('selected', el.dataset.key === key);
  });
}

function renderThemeGrid() {
  themeGrid.innerHTML = '';
  Object.entries(themes).forEach(([key, t]) => {
    const div = document.createElement('div');
    div.className = 'theme-swatch';
    div.dataset.key = key;
    div.style.background = `linear-gradient(135deg, ${t.gradient.join(', ')})`;
    div.innerHTML = `<span>${t.name}</span>`;
    div.onclick = () => {
      applyTheme(key);
      window.api.setSettings({ theme: key });
    };
    themeGrid.appendChild(div);
  });
}

function applyFont(key) {
  const f = fonts[key];
  if (!f) return;
  currentFont = key;
  document.documentElement.style.setProperty('--app-font', f.stack);
  document.querySelectorAll('.font-option').forEach((el) => {
    el.classList.toggle('selected', el.dataset.key === key);
  });
}

function renderFontGrid(t) {
  const fontGrid = document.getElementById('fontGrid');
  fontGrid.innerHTML = '';
  Object.entries(fonts).forEach(([key, f]) => {
    const div = document.createElement('div');
    div.className = 'font-option';
    div.dataset.key = key;
    div.style.fontFamily = f.stack;
    div.style.background = t.cardBg;
    div.style.color = t.panelText;
    div.style.borderColor = key === currentFont ? t.accent : 'transparent';
    div.innerHTML = `<span>${f.name}</span><span class="check">&#10003;</span>`;
    div.onclick = () => {
      applyFont(key);
      window.api.setSettings({ font: key });
      renderFontGrid(t);
    };
    fontGrid.appendChild(div);
  });
}

function renderPhraseList(t) {
  listEl.innerHTML = '';
  phrases.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'phrase-item';
    div.style.borderBottomColor = t.border;
    div.innerHTML = `<span>${p}</span>`;
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.style.background = t.border;
    btn.style.color = t.panelText;
    btn.textContent = 'Remove';
    btn.onclick = () => {
      phrases.splice(i, 1);
      window.api.setPhrases(phrases);
      renderPhraseList(themes[currentTheme]);
    };
    div.appendChild(btn);
    listEl.appendChild(div);
  });
}

function showFull() {
  miniEl.style.display = 'none';
  fullEl.style.display = 'block';
  window.api.setWindowMode('full');
}

function showMini() {
  fullEl.style.display = 'none';
  miniEl.style.display = 'flex';
  window.api.setWindowMode('mini');
}

document.getElementById('settingsBtn').addEventListener('click', showFull);
document.getElementById('backBtn').addEventListener('click', showMini);
document.getElementById('closeBtn').addEventListener('click', () => window.api.closeWidget());
document.getElementById('nextBtn').addEventListener('click', () => window.api.nextPhrase());
document.getElementById('prevBtn').addEventListener('click', () => window.api.prevPhrase());

document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('newPhrase');
  const val = input.value.trim();
  if (!val) return;
  phrases.push(val);
  window.api.setPhrases(phrases);
  input.value = '';
  renderPhraseList(themes[currentTheme]);
});
document.getElementById('newPhrase').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('addBtn').click();
});

document.getElementById('playModeSelect').addEventListener('change', (e) => {
  window.api.setSettings({ playMode: e.target.value });
});
document.getElementById('freqSelect').addEventListener('change', (e) => {
  window.api.setSettings({ popupFrequencyMinutes: Number(e.target.value) });
});
document.getElementById('cycleSelect').addEventListener('change', (e) => {
  window.api.setSettings({ widgetCycleSeconds: Number(e.target.value) });
});
document.getElementById('popupsEnabled').addEventListener('change', (e) => {
  window.api.setSettings({ popupsEnabled: e.target.checked });
});
document.getElementById('pinned').addEventListener('change', (e) => {
  window.api.setSettings({ pinned: e.target.checked });
});

window.api.onPhrase((phrase) => { phraseEl.textContent = phrase; });
window.api.onOpenSettings(() => showFull());

async function init() {
  themes = await window.api.getThemes();
  fonts = await window.api.getFonts();
  phrases = await window.api.getPhrases();
  const settings = await window.api.getSettings();

  applyFont(settings.font || 'poppins');
  renderThemeGrid();
  applyTheme(settings.theme || 'sunrise');
  renderPhraseList(themes[currentTheme]);

  document.getElementById('playModeSelect').value = settings.playMode || 'shuffle';
  document.getElementById('freqSelect').value = settings.popupFrequencyMinutes;
  document.getElementById('cycleSelect').value = settings.widgetCycleSeconds;
  document.getElementById('popupsEnabled').checked = settings.popupsEnabled;
  document.getElementById('pinned').checked = settings.pinned;
}

init();
