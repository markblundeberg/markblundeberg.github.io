// shell.js — the game: screens, dialogue, puzzles, stamps, save. Words live in content.js, pictures in art.js,
// sounds in audio.js. Everything degrades gracefully if art or audio is missing.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const CT = GM_CONTENT, PUZ = CT.puzzles;
  const now = () => performance.now() / 1000;
  const MAKING_OF = '/problem-set/';
  const OPENING = 'https://www.youtube.com/watch?v=Ly3z1gI2g20';
  const CPS = 42;                       // typewriter speed, characters per second
  const TOTAL = PUZ.reduce((a, p) => a + p.sparks, 0);

  // ---- save (per-browser convenience only) --------------------------------------------------------------------------
  const KEY = 'problem-set-inf-demo-v1';
  const fresh = () => ({ v: 1, solved: {}, hints: {}, wrong: {}, coins: 5, found: {}, introSeen: false, trunkSeen: {}, ended: false, muted: false, current: null });
  let save = (() => { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return { ...fresh(), ...s }; } catch (e) { } return fresh(); })();
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { } };
  if (location.hash === '#all') PUZ.forEach(p => { if (!save.solved[p.id]) save.solved[p.id] = { sparks: p.sparks }; });

  // ---- audio (all calls optional) ---------------------------------------------------------------------------------------
  const A = {
    init() { try { return Promise.resolve(window.GMAudio && GMAudio.init()).catch(() => { }); } catch (e) { return Promise.resolve(); } },
    bgm(n) { try { window.GMAudio && GMAudio.bgm(n); } catch (e) { } },
    sfx(n, o) { try { window.GMAudio && GMAudio.sfx(n, o); } catch (e) { } },
    blip(w) { try { window.GMAudio && GMAudio.blip(w); } catch (e) { } },
    mute(m) { try { window.GMAudio && GMAudio.setMuted(m); } catch (e) { } },
  };

  // ---- small DOM helper ---------------------------------------------------------------------------------------------------
  function el(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
    return e;
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const sparksNow = ps => Math.round(ps.p.sparks * Math.max(.4, 1 - .2 * ps.wrong));
  const totalSparks = () => Object.values(save.solved).reduce((a, s) => a + (s.sparks || 0), 0);
  const isUnlocked = i => i === 0 || !!save.solved[PUZ[i - 1].id];
  const allSolved = () => PUZ.every(p => save.solved[p.id]);

  // ---- canvases ---------------------------------------------------------------------------------------------------------
  let artReady = false;
  const topC = $('top'), topG = topC.getContext('2d');
  function fit(c, lw, maxW) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), cw = c.clientWidth || lw;
    const bw = Math.max(2, Math.round(Math.min(maxW, cw * dpr))), bh = Math.round(bw * c.clientHeight / Math.max(1, cw)) || Math.round(bw * 9 / 16);
    if (c.width !== bw || c.height !== bh) { c.width = bw; c.height = bh; }
    return bw / lw;
  }

  // ---- the top screen ---------------------------------------------------------------------------------------------------
  const top = { mode: 'boot', scene: 'study', t0: now(), pressed: false, fade0: -9, hilde: { expr: 'neutral', talk: 0 }, claude: { expr: 'neutral', talk: 0 }, onShatter: null };
  function setScene(id) {
    if (top.mode === 'scene' && top.scene === id) return;
    top.scene = id; top.t0 = now(); top.fade0 = now();
    if (top.mode !== 'shatter') top.mode = 'scene';
  }
  function shatterTo(id, cb) {
    top.mode = 'shatter'; top.scene = id; top.t0 = now(); top.onShatter = cb;
    if (typeof gmDrawShatter !== 'function') { top.mode = 'scene'; cb && cb(); }
  }
  function drawTop(n) {
    const s = fit(topC, 1920, 1280), g = topG;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (!artReady || typeof gmDrawScene !== 'function') {
      g.fillStyle = '#2a2320'; g.fillRect(0, 0, topC.width, topC.height);
      g.fillStyle = '#e9dcc0'; g.font = `${Math.round(topC.width / 28)}px "DotGothic16", monospace`; g.textAlign = 'center';
      g.fillText(artReady ? 'PROBLEM SET ∞' : 'Loading…', topC.width / 2, topC.height / 2);
      return;
    }
    g.setTransform(s, 0, 0, s, 0, 0);
    const t = n - top.t0;
    g.save();
    try {
      if (top.mode === 'boot') gmDrawBoot(g, t, { pressed: top.pressed, tPressed: top.tPressed });
      else if (top.mode === 'shatter') {
        const dur = typeof GM_SHATTER_DUR === 'number' ? GM_SHATTER_DUR : 1.2;
        gmDrawShatter(g, t, top.scene, {});
        if (t >= dur) { top.mode = 'scene'; top.t0 = n; const cb = top.onShatter; top.onShatter = null; cb && cb(); }
      } else {
        gmDrawScene(g, t, top.scene, { hilde: top.hilde, claude: top.claude, coinFound: !!save.found[top.scene], flash: 0 });
      }
    } catch (e) { console.error(e); }
    g.restore();
    const fk = (n - top.fade0) / .35;
    if (fk >= 0 && fk < 1) { g.save(); g.globalAlpha = 1 - fk; g.fillStyle = '#f8efd8'; g.fillRect(0, 0, 1920, 1080); g.restore(); }
  }
  $('topScreen').addEventListener('click', ev => {
    if (top.mode === 'boot') { start(); return; }
    const r = topC.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * 1920, y = (ev.clientY - r.top) / r.height * 1080;
    const coin = top.mode === 'scene' && typeof GM_COINS === 'object' && GM_COINS[top.scene];
    const minR = 24 * 1920 / Math.max(1, r.width);   // at least 24 CSS px to tap, however small the screen
    if (coin && !save.found[top.scene] && Math.hypot(x - coin.x, y - coin.y) <= Math.max((coin.r || 60) * 1.2, minR)) {
      save.found[top.scene] = true; save.coins++; persist(); A.sfx('coin');
      const pop = $('coinPop'); pop.hidden = true; void pop.offsetWidth; pop.hidden = false;
      setTimeout(() => { pop.hidden = true; }, 1700);
      refreshStatus();
      return;
    }
    if (dlg.active) advance();
  });

  // ---- dialogue -----------------------------------------------------------------------------------------------------------
  const dlg = { active: false, lines: [], i: 0, line: null, t0: 0, shown: 0, done: true, onEnd: null };
  const NAMES = { hilde: 'Professor Hilde', claude: 'Claude' };
  function say(lines, onEnd) {
    if (!lines || !lines.length) { onEnd && onEnd(); return; }
    dlg.active = true; dlg.lines = lines; dlg.i = 0; dlg.onEnd = onEnd || null;
    showLine(); renderActions();
  }
  function showLine() {
    const L = dlg.lines[dlg.i];
    dlg.line = L; dlg.t0 = now(); dlg.shown = 0; dlg.done = false;
    const box = $('dlg'); box.hidden = false; box.dataset.who = L.who; box.classList.remove('done');
    $('dlgName').textContent = NAMES[L.who] || L.who;
    $('dlgLive').textContent = `${NAMES[L.who] || L.who}: ${L.text}`;
    if (top[L.who]) top[L.who].expr = L.expr || 'talk';
    paintLine();
  }
  function paintLine() {
    const L = dlg.line, a = L.text.slice(0, dlg.shown), b = L.text.slice(dlg.shown);
    $('dlgText').innerHTML = esc(a) + (b ? `<span class="ghost">${esc(b)}</span>` : '');
  }
  function tickDialogue(n) {
    for (const w of ['hilde', 'claude']) top[w].talk = 0;
    if (!dlg.active || !dlg.line) return;
    const L = dlg.line;
    if (!dlg.done) {
      const target = Math.min(L.text.length, Math.floor((n - dlg.t0) * CPS));
      if (target > dlg.shown) {
        for (let k = dlg.shown; k < target; k++) if (L.text[k].trim() && k % 2 === 0) { A.blip(L.who); break; }
        dlg.shown = target; paintLine();
      }
      if (dlg.shown >= L.text.length) { dlg.done = true; $('dlg').classList.add('done'); }
      else if (top[L.who]) top[L.who].talk = .45 + .55 * Math.abs(Math.sin((n - dlg.t0) * 11));
    }
  }
  function advance() {
    if (!dlg.active) return;
    if (!dlg.done) { dlg.shown = dlg.line.text.length; dlg.done = true; paintLine(); $('dlg').classList.add('done'); return; }
    dlg.i++;
    if (dlg.i >= dlg.lines.length) endDialogue(); else { A.sfx('tap'); showLine(); }
  }
  function hush() {         // a screen change: drop the current conversation without running its ending
    dlg.active = false; dlg.line = null; dlg.onEnd = null; $('dlg').hidden = true;
  }
  function endDialogue() {
    if (!dlg.active) return;
    dlg.active = false; dlg.line = null; $('dlg').hidden = true;
    const f = dlg.onEnd; dlg.onEnd = null; renderActions(); f && f();
  }
  document.addEventListener('keydown', ev => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/^(INPUT|BUTTON|A|TEXTAREA|SELECT)$/.test(tag)) return;
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pressA(); }
    else if (ev.key === 'Escape') { ev.preventDefault(); pressB(); }
  });

  // ---- bottom screen: views and actions ---------------------------------------------------------------------------------
  const view = $('view'), actions = $('actions');
  let viewActions = () => [];
  function setView(nodes, acts) { view.replaceChildren(...[].concat(nodes)); viewActions = acts || (() => []); renderActions(); }
  function renderActions() {
    const f = document.activeElement, keep = f && actions.contains(f) ? f.textContent : null;
    renderActions0();
    if (keep != null) { const b = [...actions.querySelectorAll('button')].find(x => x.textContent === keep && !x.disabled) || actions.querySelector('button:not([disabled])'); if (b) b.focus(); }
  }
  function renderActions0() {
    if (dlg.active) {
      actions.replaceChildren(
        el('button', { class: 'btn quiet', type: 'button', onclick: () => { A.sfx('tap'); endDialogue(); } }, 'Skip'),
        el('span', { class: 'spacer' }),
        el('button', { class: 'btn plum', type: 'button', onclick: advance }, 'Next ▸'));
    } else actions.replaceChildren(...viewActions());
  }
  function statusStrip() {
    return el('div', { class: 'status' },
      el('span', { class: 'chip', id: 'coinChip', title: 'Hint coins' }, el('span', { class: 'coin' }), `${save.coins} hint coin${save.coins === 1 ? '' : 's'}`),
      el('span', { class: 'chip', id: 'sparkChip', title: 'Sparks' }, el('span', { class: 'spark' }, '✷'), `${totalSparks()} / ${TOTAL} sparks`));
  }
  function refreshStatus() {
    const c = $('coinChip'); if (c) c.lastChild.textContent = `${save.coins} hint coin${save.coins === 1 ? '' : 's'}`;
    const s = $('sparkChip'); if (s) s.lastChild.textContent = `${totalSparks()} / ${TOTAL} sparks`;
    if (puzzle && puzzle.refreshHints) puzzle.refreshHints();
  }

  // start screen
  let started = false;
  function showStart() {
    const any = Object.keys(save.solved).length > 0;
    setView(el('div', { class: 'view start' },
      el('span', { class: 'kanji', lang: 'ja' }, '無限の問題集'),
      el('h1', { html: 'PROBLEM SET <b>∞</b>' }),
      el('span', { class: 'label' }, 'Demo · 7 puzzles and a trunk'),
      el('p', { class: 'small' }, 'From counting the r’s in “strawberry” to a real little proof. About five minutes. Best with sound.'),
      el('button', { class: 'btn primary big', type: 'button', id: 'startBtn', onclick: start }, any ? 'Continue' : 'Press START')),
      () => []);
    view.firstChild.style.padding = '0';
  }
  function start() {
    if (started) return; started = true;
    A.init().then(() => { A.mute(save.muted); A.sfx('start'); });
    top.pressed = true; top.tPressed = now() - top.t0;
    const b = $('startBtn'); if (b) b.disabled = true;
    setTimeout(() => {
      A.sfx('shatter');
      shatterTo('study', () => {
        A.bgm('hub');
        if (!save.introSeen) {
          setView(el('div', { class: 'view start' }, el('span', { class: 'label' }, 'Professor Hilde’s study'),
            el('p', { class: 'small' }, 'Tap the top screen, or Next, to go on.')), () => []);
          say(CT.intro, () => { save.introSeen = true; persist(); openPuzzle(0); });
          warm();
        } else {
          const i = PUZ.findIndex(p => p.id === save.current);
          if (i >= 0 && isUnlocked(i) && !save.solved[PUZ[i].id]) openPuzzle(i); else showBook();
          warm();
        }
      });
    }, 650);
  }

  // the book
  function showBook() {
    hush();
    puzzle = null; A.bgm('hub'); save.current = null; persist();
    setScene('study');
    const rows = PUZ.map((p, i) => {
      const s = save.solved[p.id], open = isUnlocked(i);
      return el('li', {}, el('button', { class: 'book-row', type: 'button', disabled: !open, onclick: () => { A.sfx('select'); openPuzzle(i); } },
        el('span', { class: 'book-no' }, `№${p.no}`),
        el('span', { class: 'book-title' }, open ? p.title : '? ? ?'),
        el('span', { class: 'book-meta' }, !open ? el('span', { class: 'lock' }, 'LOCKED')
          : s ? [`✷ ${s.sparks}`, el('span', { class: 'mini-stamp' }, 'Q.E.D.')] : `✷ ${p.sparks}`)));
    });
    const tOpen = allSolved();
    rows.push(el('li', {}, el('button', { class: 'book-row inf', type: 'button', disabled: !tOpen, onclick: () => { A.sfx('select'); openTrunk(); } },
      el('span', { class: 'book-no' }, '№∞'),
      el('span', { class: 'book-title' }, tOpen ? CT.trunk.title : '? ? ?'),
      el('span', { class: 'book-meta' }, el('span', { class: 'lock' }, tOpen ? 'NOT YET' : 'LOCKED')))));
    setView(el('div', { class: 'view book', style: 'padding:0' },
      statusStrip(),
      el('div', {}, el('span', { class: 'label' }, 'Professor Hilde’s'), el('h2', {}, 'Puzzle book')),
      el('ol', { class: 'book-list' }, rows)),
      () => save.ended ? [el('button', { class: 'btn quiet', type: 'button', onclick: showEnding }, 'The ending')] : []);
  }

  // ---- a puzzle ---------------------------------------------------------------------------------------------------------
  let puzzle = null;      // the open puzzle's state
  function openPuzzle(i) {
    hush();
    const p = PUZ[i];
    save.current = p.id; persist();
    if (window.scrollY > 0) window.scrollTo({ top: 0 });
    const ps = puzzle = { p, i, wrong: save.solved[p.id] ? 0 : (save.wrong[p.id] || 0), sel: p.kind === 'letters' ? new Set() : null, step: 1, solved: false, t0: now(), tSolved: null, stamps: [] };
    A.sfx('page'); A.bgm('puzzle'); setScene(p.scene);

    const val = el('span', { class: 'val' });
    const fb = el('p', { class: 'feedback', 'aria-live': 'polite' });
    const hints = el('div', { class: 'hints' });
    const controls = el('div', { class: 'controls' });
    const statement = el('p', { class: 'statement' }, p.statement);
    const illus = el('div', { class: 'illus' }, el('canvas', { width: 1200, height: 640, 'aria-hidden': 'true' }));
    const stampC = el('canvas', { class: 'stamp-layer', 'aria-hidden': 'true' });
    const sheet = el('div', { class: 'sheet' },
      el('div', { class: 'sheet-head' },
        el('div', { class: 'sheet-no' }, el('small', {}, 'PROBLEM'), el('b', {}, `№${p.no}`)),
        el('div', { class: 'sheet-title' }, el('h2', {}, p.title), val)),
      statement, illus, controls, fb, hints, stampC);
    Object.assign(ps, { val, fb, hints, controls, statement, illus, illusC: illus.firstChild, stampC, sheet, head: sheet.firstChild });
    ps.refreshVal = () => { val.textContent = `✷ ${sparksNow(ps)} sparks` + (ps.wrong ? ` (was ${p.sparks})` : ''); };
    ps.refreshHints = () => {
      const n = save.hints[p.id] || 0;
      hints.replaceChildren(...p.hints.slice(0, n).map((h, k) => el('div', { class: 'hint-card' }, el('b', {}, `Hint ${k + 1}`), h)));
      renderActions();
    };
    ps.refreshVal();
    buildControls(ps);
    ps.refreshHints();
    setView(el('div', { class: 'view', style: 'padding:0' }, statusStrip(), sheet), () => puzzleActions(ps));
    say(p.intro);
  }
  function choiceButtons(ps, list, big, col) {
    const wrap = el('div', { class: 'opts' + (col ? ' col' : '') });
    for (const c of list) {
      const b = el('button', { class: 'opt' + (big ? ' big' : ''), type: 'button', 'aria-pressed': 'false', onclick: () => {
        if (ps.solved) return; A.sfx('select'); ps.sel = c.key;
        wrap.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
        syncSpots(ps); renderActions();
      } }, c.label);
      b.dataset.key = c.key; wrap.append(b);
    }
    return wrap;
  }
  function syncSpots(ps) {
    ps.illus.querySelectorAll('.spot').forEach(s => s.setAttribute('aria-pressed', String(s.dataset.key === ps.sel)));
    ps.controls.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(o.dataset.key === ps.sel)));
  }
  function buildControls(ps) {
    const p = ps.p, box = ps.controls;
    box.replaceChildren();
    if (p.kind === 'letters') {
      const row = el('div', { class: 'tiles', role: 'group', 'aria-label': 'Letters of the word' });
      [...p.word].forEach((ch, k) => row.append(el('button', { class: 'tile', type: 'button', 'aria-pressed': 'false', 'aria-label': `Letter ${k + 1}: ${ch}`, onclick: ev => {
        if (ps.solved) return; A.sfx('tap');
        if (ps.sel.has(k)) ps.sel.delete(k); else ps.sel.add(k);
        ev.currentTarget.setAttribute('aria-pressed', String(ps.sel.has(k))); renderActions();
      } }, ch)));
      box.append(row);
    } else if (p.kind === 'choice' || (p.kind === 'twostep' && ps.step === 1)) {
      box.append(choiceButtons(ps, p.choices, p.big, false));
    } else if (p.kind === 'twostep' && ps.step === 2) {
      box.append(el('p', { class: 'statement' }, el('b', {}, p.step2.statement)), choiceButtons(ps, p.step2.choices, false, true));
    } else if (p.kind === 'spots') {
      const spots = (typeof GM_P005_SPOTS === 'object' && GM_P005_SPOTS) || {};
      for (const c of p.choices) {
        const sp = spots[c.key];
        if (sp) ps.illus.append(el('button', { class: 'spot', type: 'button', 'aria-pressed': 'false', 'aria-label': `${c.key}: ${c.label}`,
          style: `left:${(sp.x / 1200 * 100).toFixed(2)}%;top:${(sp.y / 640 * 100).toFixed(2)}%`,
          onclick: () => { if (ps.solved) return; A.sfx('select'); ps.sel = c.key; syncSpots(ps); renderActions(); } }, c.key));
      }
      box.append(choiceButtons(ps, p.choices.map(c => ({ key: c.key, label: el('span', {}, el('span', { class: 'key' }, c.key), c.label) })), false, true));
      ps.illus.querySelectorAll('.spot').forEach(s => { s.dataset.key = s.textContent; });
    } else if (p.kind === 'number') {
      const inp = el('input', { id: `num-${p.id}`, type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-label': 'Your answer', placeholder: '?' });
      const bump = d => { if (ps.solved) return; const v = parseInt(inp.value, 10); inp.value = String(Math.max(p.min, Math.min(p.max, (isNaN(v) ? 0 : v) + d))); A.sfx('tap'); ps.sel = inp.value; renderActions(); };
      inp.addEventListener('input', () => { inp.value = inp.value.replace(/[^0-9]/g, '').slice(0, 3); ps.sel = inp.value; renderActions(); });
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); submit(ps); } });
      box.append(el('div', { class: 'numrow' },
        el('button', { class: 'btn step', type: 'button', 'aria-label': 'One less', onclick: () => bump(-1) }, '−'), inp,
        el('button', { class: 'btn step', type: 'button', 'aria-label': 'One more', onclick: () => bump(1) }, '+'),
        el('span', {}, 'lockers open')));
    }
  }
  function puzzleActions(ps) {
    const back = el('button', { class: 'btn quiet', type: 'button', onclick: () => { A.sfx('page'); showBook(); } }, 'Book');
    if (ps.solved) {
      const nextI = ps.i + 1;
      const next = nextI < PUZ.length
        ? el('button', { class: 'btn primary', type: 'button', onclick: () => { A.sfx('select'); openPuzzle(nextI); } }, 'Next puzzle ▸')
        : el('button', { class: 'btn plum', type: 'button', onclick: () => { A.sfx('select'); openTrunk(); } }, 'Open the trunk ▸');
      return [back, el('span', { class: 'spacer' }), next];
    }
    const n = save.hints[ps.p.id] || 0;
    const hint = el('button', { class: 'btn', type: 'button', disabled: n >= 3, title: n >= 3 ? 'All three hints are open' : `Hint ${n + 1} of 3, for one hint coin`, onclick: () => buyHint(ps) },
      n >= 3 ? 'Hints 3/3' : ['Hint ', el('span', { class: 'coin', style: 'display:inline-block;vertical-align:-3px;width:14px;height:14px' })]);
    const has = ps.p.kind === 'letters' ? ps.sel.size > 0 : ps.sel != null && ps.sel !== '';
    const sub = el('button', { class: 'btn primary', type: 'button', disabled: !has, onclick: () => submit(ps) }, 'Submit');
    return [back, el('span', { class: 'spacer' }), hint, sub];
  }
  function buyHint(ps) {
    const n = save.hints[ps.p.id] || 0;
    if (n >= 3) return;
    if (save.coins <= 0) { ps.fb.className = 'feedback'; ps.fb.textContent = 'No hint coins left. Every scene up top hides one: look for a glint and tap it.'; A.sfx('wrong'); return; }
    save.coins--; save.hints[ps.p.id] = n + 1; persist(); A.sfx('hint');
    ps.fb.textContent = ''; refreshStatus();
  }

  function submit(ps) {
    if (ps.solved) return;
    if (dlg.active) endDialogue();
    const p = ps.p;
    let ok = false, key = '_';
    if (p.kind === 'letters') {
      if (!ps.sel.size) { say(p.wrong.none); return; }
      const ans = new Set(p.answer);
      ok = ps.sel.size === ans.size && [...ps.sel].every(k => ans.has(k));
      key = [...ps.sel].some(k => !ans.has(k)) ? 'notR' : ps.sel.size === 2 ? 'two' : 'few';
    } else if (p.kind === 'number') {
      const v = parseInt(ps.sel, 10);
      if (isNaN(v) || v < p.min || v > p.max) { ps.fb.className = 'feedback'; ps.fb.textContent = `Enter a whole number from ${p.min} to ${p.max}.`; return; }
      ok = v === p.answer; key = p.wrong[String(v)] ? String(v) : v < p.answer ? 'lo' : 'hi';
    } else if (p.kind === 'twostep' && ps.step === 1) {
      if (ps.sel === p.answer) {
        A.sfx('hint'); ps.step = 2; ps.sel = null;
        ps.fb.className = 'feedback good'; ps.fb.textContent = 'Right! Now prove it.';
        buildControls(ps); renderActions();
        return;
      }
      key = ps.sel;
    } else if (p.kind === 'twostep') {
      ok = ps.sel === p.step2.answer; key = ps.sel;
    } else { ok = ps.sel === p.answer; key = ps.sel; }

    if (ok) return solve(ps);
    ps.wrong++; if (!save.solved[p.id]) { save.wrong[p.id] = ps.wrong; persist(); } ps.refreshVal(); A.sfx('wrong');
    ps.fb.className = 'feedback'; ps.fb.textContent = '';
    addStamp(ps, 'oncemore', { fade: true });
    say((p.wrong && (p.wrong[key] || p.wrong._)) || [{ who: 'hilde', expr: 'neutral', text: 'Not quite. Once more!' }]);
  }
  function solve(ps) {
    const p = ps.p;
    ps.solved = true; ps.tSolved = now();
    const got = sparksNow(ps), prev = save.solved[p.id];
    save.solved[p.id] = { sparks: Math.max(got, prev ? prev.sparks : 0) }; delete save.wrong[p.id]; save.current = null; persist();
    A.sfx('qed');
    ps.fb.className = 'feedback good'; ps.fb.textContent = prev ? `Solved again: ✷ ${got}.` : `Solved! ✷ ${got} sparks.`;
    ps.sheet.querySelectorAll('.tile, .opt, .spot, input, .step').forEach(b => { b.disabled = true; });
    ps.stamps = ps.stamps.filter(s => !s.fade);
    addStamp(ps, 'qed', { anchor: 'head', fx: .8, fy: .52, scale: .8 });   // on the header, clear of the picture's explanation
    top.claude.expr = 'joy'; top.hilde.expr = 'proud';
    refreshStatus();
    say(p.solved, () => renderActions());
  }

  // stamps live on a canvas over the sheet; positions are fractions of the illustration box
  function addStamp(target, kind, o) {
    target.stamps.push({ kind, t0: now() + .05, anchor: o.anchor || 'illus', fx: o.fx ?? .5, fy: o.fy ?? .5, fade: !!o.fade, scale: o.scale ?? 1, seed: (target.p ? target.p.id : 'trunk') + kind + target.stamps.length });
  }
  function drawStamps(target, n) {
    const c = target.stampC; if (!c || !c.isConnected) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = c.clientWidth, h = c.clientHeight;
    const bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (c.width !== bw || c.height !== bh) { c.width = bw; c.height = bh; }
    const g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, bw, bh);
    if (typeof pzStamp !== 'function') return;
    const box = el => ({ ox: el.offsetLeft, oy: el.offsetTop, iw: el.offsetWidth, ih: el.offsetHeight });
    const ill = box(target.illus);
    target.stamps = target.stamps.filter(s => !(s.fade && n - s.t0 > 1.6));
    for (const s of target.stamps) {
      g.save(); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (s.fade) g.globalAlpha = 1 - Math.max(0, Math.min(1, (n - s.t0 - 1.1) / .5));
      const { ox, oy, iw, ih } = s.anchor === 'head' && target.head ? box(target.head) : ill;
      try { pzStamp(g, n, { x: ox + s.fx * iw, y: oy + s.fy * ih, t0: s.t0, kind: s.kind, scale: s.scale * ill.iw * .5 / 285, seed: s.seed }); } catch (e) { }
      g.restore();
    }
  }
  function drawIllus(target, id, n, extra) {
    const c = target.illusC; if (!c || !c.isConnected) return;
    const s = fit(c, 1200, 1200), g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
    if (!artReady || typeof gmDrawIllus !== 'function') return;
    g.setTransform(s, 0, 0, s, 0, 0); g.save();
    try { gmDrawIllus(g, n - target.t0, id, { solved: !!target.solved, tSolved: target.solved && target.tSolved ? n - target.tSolved : null, open: new Set(), cssW: c.clientWidth, ...extra }); } catch (e) { console.error(e); }
    g.restore();
  }

  // ---- the trunk ----------------------------------------------------------------------------------------------------------
  let trunk = null;
  function openTrunk() {
    hush();
    puzzle = null; A.sfx('page'); A.bgm('trunk'); setScene(CT.trunk.scene);
    const illus = el('div', { class: 'illus' }, el('canvas', { width: 1200, height: 640, 'aria-hidden': 'true' }));
    const stampC = el('canvas', { class: 'stamp-layer', 'aria-hidden': 'true' });
    const T = trunk = { t0: now(), illus, illusC: illus.firstChild, stampC, stamps: [], shake: {}, seen: new Set() };
    const cards = (typeof GM_TRUNK_CARDS === 'object' && GM_TRUNK_CARDS) || {};
    const names = { fever: 'The Fever', fire: 'The Fire', storm: 'The Storm', wire: 'The Wire' };
    const tapCard = k => {
      if (!cards[k] && !names[k]) return;
      A.sfx('locked'); T.shake[k] = now() - T.t0;
      if (!T.seen.has(k)) {
        T.seen.add(k); save.trunkSeen[k] = true; persist();
        list.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', String(T.seen.has(o.dataset.key))));
      }
      say(CT.trunk.cards[k], () => renderActions());
    };
    illus.addEventListener('click', ev => {
      const r = illus.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * 1200, y = (ev.clientY - r.top) / r.height * 640;
      for (const [k, b] of Object.entries(cards)) if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return tapCard(k);
    });
    const list = el('div', { class: 'opts' }, Object.entries(names).map(([k, n]) => el('button', { class: 'opt', type: 'button', 'data-key': k, 'aria-pressed': 'false', onclick: () => tapCard(k) }, n)));
    setView(el('div', { class: 'view trunk', style: 'padding:0' },
      el('div', {}, el('span', { class: 'label' }, 'Problem №∞'), el('h2', {}, CT.trunk.title)),
      el('div', { class: 'sheet' }, illus, stampC),
      el('p', { class: 'statement' }, 'Four questions, padlocked. Tap a card.'), list),
      () => T.seen.size ? [el('span', { class: 'spacer' }), el('button', { class: 'btn plum', type: 'button', onclick: closeTrunk }, 'Close the lid ▸')] : []);
    say(CT.trunk.intro);
  }
  function closeTrunk() {
    A.sfx('tap');
    say(CT.trunk.outro, () => { save.ended = true; persist(); showEnding(); });
  }

  // ---- the ending ---------------------------------------------------------------------------------------------------------
  function showEnding() {
    hush();
    trunk = null; puzzle = null;
    A.sfx('fanfare'); A.bgm('hub'); setScene(CT.ending.scene);
    top.hilde.expr = 'proud'; top.claude.expr = 'joy';
    const confirmBox = el('div', { class: 'confirm' });
    const askReset = () => {
      confirmBox.replaceChildren(el('span', {}, 'Erase your progress and start again?'),
        el('button', { class: 'btn', type: 'button', onclick: () => { save = fresh(); persist(); location.hash = ''; location.reload(); } }, 'Start over'),
        el('button', { class: 'btn quiet', type: 'button', onclick: () => confirmBox.replaceChildren() }, 'Keep it'));
    };
    setView(el('div', { class: 'view ending', style: 'padding:0' },
      el('span', { class: 'label' }, 'Thanks for playing'),
      el('p', { class: 'score' }, `✷ ${totalSparks()}`, el('small', {}, ` / ${TOTAL} sparks`)),
      el('p', {}, 'Seven puzzles: Q.E.D. The trunk: not yet.'),
      el('p', { class: 'credits' }, CT.ending.credits),
      el('p', { class: 'credits' }, el('a', { href: OPENING, target: '_blank', rel: 'noopener' }, 'Watch the opening'), ' \u00b7 ', el('a', { href: MAKING_OF, target: '_blank', rel: 'noopener' }, 'how it was made')),
      confirmBox),
      () => [el('button', { class: 'btn quiet', type: 'button', onclick: askReset }, 'Play again'), el('span', { class: 'spacer' }),
        el('button', { class: 'btn', type: 'button', onclick: () => { A.sfx('page'); showBook(); } }, 'Puzzle book')]);
  }

  // ---- the handheld's A and B buttons (wide screens): A is the main button of the moment, B the quiet one --------------
  function pressA() {
    if (top.mode === 'boot') return start();
    if (dlg.active) return advance();
    const b = [...actions.querySelectorAll('.btn.primary, .btn.plum')].filter(x => !x.disabled).pop()
      || [...view.querySelectorAll('.btn.primary')].filter(x => !x.disabled).pop();
    if (b) return b.click();
    if (!puzzle && !trunk) {          // the book: open the next puzzle to solve
      const i = PUZ.findIndex((p, k) => isUnlocked(k) && !save.solved[p.id]);
      if (i >= 0) { A.sfx('select'); openPuzzle(i); } else if (allSolved() && view.querySelector('.book-row.inf')) { A.sfx('select'); openTrunk(); }
    }
  }
  function pressB() { const b = actions.querySelector('.btn.quiet'); if (b) b.click(); }
  $('aBtn').addEventListener('click', pressA);
  $('bBtn').addEventListener('click', pressB);
  document.querySelector('.pills span:last-child').addEventListener('click', () => { if (top.mode === 'boot') start(); });

  // build the drawing caches at idle, so the first puzzle doesn't hitch
  function warm() {
    if (typeof gmArtWarm !== 'function') return;
    setTimeout(() => { try { Promise.resolve(gmArtWarm(['chars', ...PUZ.map(p => p.id), 'trunk'])).catch(() => { }); } catch (e) { } }, 300);
  }

  // ---- mute -----------------------------------------------------------------------------------------------------------------
  const muteBtn = $('mute');
  const paintMute = () => { muteBtn.textContent = save.muted ? 'Sound off' : 'Sound on'; muteBtn.setAttribute('aria-pressed', String(save.muted)); };
  muteBtn.addEventListener('click', () => { save.muted = !save.muted; persist(); A.mute(save.muted); paintMute(); });
  paintMute();

  // ---- the loop -----------------------------------------------------------------------------------------------------------
  let last = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const n = now();
    if (n - last < 1 / 30) return;
    last = n;
    tickDialogue(n);
    drawTop(n);
    if (puzzle) { drawIllus(puzzle, puzzle.p.id, n); drawStamps(puzzle, n); }
    if (trunk) { drawIllus(trunk, 'trunk', n, { shake: trunk.shake }); drawStamps(trunk, n); }
  }

  showStart();
  requestAnimationFrame(frame);
  (async () => {
    try { await document.fonts.ready; } catch (e) { }
    try { if (typeof gmArtInit === 'function') await gmArtInit('assets/'); } catch (e) { console.error(e); }
    artReady = true;
  })();
  window.__gm = { get save() { return save; }, say, showBook, openPuzzle, openTrunk, showEnding, start };
})();
