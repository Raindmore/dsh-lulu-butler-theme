import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, DEFAULTS, STORAGE_KEY } from '../src/state.js';
import { SWATCHES, TOKENS } from '../src/palette.js';
const memory = saved => { const data = new Map(saved ? [[STORAGE_KEY, saved]] : []); return { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) }; };
test('scene, companion and motion preferences survive reopening', () => {
  const storage = memory(); createState(storage).set({ scene: false, peek: false, motion: false });
  assert.deepEqual(createState(storage).getSnapshot(), { enabled: true, scene: false, peek: false, motion: false });
});
test('corrupt, stale or unavailable storage does not break the theme', () => {
  assert.deepEqual(createState(memory('{broken')).getSnapshot(), DEFAULTS);
  assert.deepEqual(createState(memory('{"enabled":"false","scene":3}')).getSnapshot(), DEFAULTS);
  const state = createState({ getItem() { throw Error('denied'); }, setItem() { throw Error('full'); } });
  state.set({ scene: false }); assert.equal(state.getSnapshot().scene, false);
});
const luminance = hex => hex.match(/[a-f\d]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => { const v = [luminance(a), luminance(b)].sort((a, b) => b - a); return (v[0] + .05) / (v[1] + .05); };
test('both palettes keep body text and primary actions at AA contrast', () => {
  for (const [mode, palette] of Object.entries(SWATCHES)) {
    for (const text of ['ink', 'secondary', 'muted']) for (const surface of ['bg', 'surface', 'sidebar']) assert.ok(contrast(palette[text], palette[surface]) >= 4.5, `${mode}: ${text}/${surface}`);
    assert.ok(contrast(palette.onAccent, palette.accent) >= 4.5, `${mode}: primary action`);
  }
  for (const [name, pair] of Object.entries(TOKENS)) assert.ok(typeof pair.light === 'string' && typeof pair.dark === 'string', name);
});
