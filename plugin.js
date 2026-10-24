import React from 'react';
import { TOKENS, paletteCSS } from './palette.js';
import { createState, OUTFITS } from './state.js';
import { IMAGES, STYLES } from './generated.js';

export const name = 'dsh-lulu-butler-theme';
export const inject = ['theme', 'slots'];

export function apply(ctx) {
  ctx.effect(() => {
    let storage;
    try { storage = window.localStorage; } catch {}
    const controller = createState(storage);
    const h = React.createElement;
    const style = document.createElement('style');
    style.dataset.luluStyle = '';
    style.textContent = `${paletteCSS()}\n${STYLES}`;
    document.head.appendChild(style);
    const useState = () => React.useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
    let releaseTokens;
    let brandDisposers = [];
    let previousEnabled;
    let disposed = false;

    function Mark({ size = 36 }) {
      const state = useState();
      return h('img', { className: 'lulu-brand-mark', src: IMAGES[state.outfit], alt: '噜噜', width: size + 8, height: size + 8 });
    }
    function BrandName() {
      return h('span', { className: 'lulu-brand-name' }, h('strong', null, '噜噜'), h('small', null, '小管家'));
    }
    function Hero() {
      const state = useState();
      const outfit = OUTFITS[state.outfit];
      return h('span', { className: 'lulu-hero-mark' },
        state.mascot ? h('span', { className: 'lulu-hero-stage' },
          h('img', { key: state.outfit, className: 'lulu-hero-img', src: IMAGES[state.outfit], alt: `穿${outfit.name}装扮的噜噜`, draggable: false })) : null,
        h('span', { className: 'lulu-eyebrow' }, 'A LITTLE HELP. A LOT OF WARMTH.'),
        h('span', { className: 'lulu-hero-title' }, outfit.greeting),
        h('span', { className: 'lulu-hero-subtitle' }, outfit.tagline));
    }
    function Settings() {
      const state = useState();
      return h('section', { className: 'lulu-settings', 'aria-label': '噜噜主题', 'data-disabled': !state.enabled },
        h('div', { className: 'lulu-settings-head' },
          h('div', null, h('strong', null, '噜噜 · 小管家'), h('p', null, '把日常工作，过得暖一点。')),
          h('button', { type: 'button', role: 'switch', className: 'lulu-switch', 'aria-label': '启用噜噜主题', 'aria-checked': state.enabled,
            onClick: () => controller.set({ enabled: !state.enabled }) })),
        h('div', { className: 'lulu-outfits', role: 'group', 'aria-label': '选择噜噜装扮' },
          Object.entries(OUTFITS).map(([id, outfit]) => h('button', {
            key: id, type: 'button', className: 'lulu-outfit', 'aria-pressed': state.outfit === id, disabled: !state.enabled,
            onClick: () => controller.set({ outfit: id }),
          }, h('img', { src: IMAGES[id], alt: '', loading: 'lazy' }), h('span', null, outfit.name)))),
        h('div', { className: 'lulu-setting-options' },
          h('label', null, h('input', { type: 'checkbox', checked: state.mascot, disabled: !state.enabled,
            onChange: e => controller.set({ mascot: e.target.checked }) }), '欢迎页显示噜噜'),
          h('label', null, h('input', { type: 'checkbox', checked: state.motion, disabled: !state.enabled,
            onChange: e => controller.set({ motion: e.target.checked }) }), '轻柔动效')),
        h('p', { className: 'lulu-footnote' }, '浅色为奶油日间，深色为可可夜间。跟随上方「外观」设置，装扮会自动保存。'));
    }

    const register = (slot, id, Component, order = 90) => ctx.slots.inject(slot, () =>
      ctx.slots.register({ name: slot, id,
        ...(slot === 'settings.general.item' ? { order } : { priority: -100 }),
      }, Component));
    function sync() {
      const state = controller.getSnapshot();
      if (state.enabled) {
        document.body.setAttribute('data-lulu-theme', 'butler');
        document.body.setAttribute('data-lulu-motion', String(state.motion));
      } else {
        document.body.removeAttribute('data-lulu-theme');
        document.body.removeAttribute('data-lulu-motion');
      }
      if (state.enabled === previousEnabled) return;
      previousEnabled = state.enabled;
      if (state.enabled) {
        // Native override layers restore the covered tokens when disposed.
        releaseTokens = ctx.theme.overrideTokens(name, TOKENS);
        brandDisposers = [
          register('sidebar.brand.mark', 'lulu-mark', Mark),
          register('sidebar.brand.name', 'lulu-name', BrandName),
          register('conversation.hero.brand.mark', 'lulu-hero', Hero),
        ];
      } else {
        for (const dispose of brandDisposers.splice(0)) if (typeof dispose === 'function') dispose();
        releaseTokens?.();
        releaseTokens = undefined;
      }
    }
    const unsubscribe = controller.subscribe(sync);
    const disposeSettings = register('settings.general.item', 'lulu-butler', Settings, 12);
    sync();
    return () => {
      if (disposed) return;
      disposed = true;
      unsubscribe();
      for (const dispose of brandDisposers.splice(0)) if (typeof dispose === 'function') dispose();
      if (typeof disposeSettings === 'function') disposeSettings();
      releaseTokens?.();
      document.body.removeAttribute('data-lulu-theme');
      document.body.removeAttribute('data-lulu-motion');
      style.remove();
      controller.clear();
    };
  }, 'lulu-butler-theme: styles, tokens and preferences');
}
