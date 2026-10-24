import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, DEFAULTS, STORAGE_KEY } from '../src/state.js';
import { SWATCHES, TOKENS } from '../src/palette.js';

function store(initial = null) {
  const data = new Map(initial === null ? [] : [[STORAGE_KEY, initial]]);
  return { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
}
test('outfit and accessibility preferences survive reopening the client', () => {
  const storage = store();
  createState(storage).set({ outfit: 'sleepy', mascot: false, motion: false });
  assert.deepEqual(createState(storage).getSnapshot(), { enabled: true, outfit: 'sleepy', mascot: false, motion: false });
});
test('corrupt or stale saved settings do not break boot', () => {
  assert.deepEqual(createState(store('{broken')).getSnapshot(), DEFAULTS);
  assert.deepEqual(createState(store('{"outfit":"constructor","enabled":"false","motion":3}')).getSnapshot(), DEFAULTS);
});
test('theme remains usable when browser storage is unavailable', () => {
  const storage = { getItem() { throw Error('denied'); }, setItem() { throw Error('full'); } };
  const state = createState(storage);
  state.set({ outfit: 'detective' });
  assert.equal(state.getSnapshot().outfit, 'detective');
});
function luminance(hex) {
  return hex.match(/[a-f\d]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4)
    .reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}
test('both palettes provide WCAG AA contrast for interface text and primary buttons', () => {
  for (const [mode, p] of Object.entries(SWATCHES)) {
    for (const text of ['ink', 'secondary', 'muted']) {
      for (const surface of ['bg', 'surface', 'sidebar']) {
        const ratio = contrast(p[text], p[surface]);
        assert.ok(ratio >= 4.5, `${mode} ${text}/${surface}: ${ratio.toFixed(2)}:1`);
      }
    }
    assert.ok(contrast(p.onAccent, p.accent) >= 4.5, `${mode}: primary button`);
  }
  for (const [name, pair] of Object.entries(TOKENS)) {
    assert.equal(typeof pair.light, 'string', name);
    assert.equal(typeof pair.dark, 'string', name);
  }
});
