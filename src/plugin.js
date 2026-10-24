import React from 'react';
import { Lightbulb, NotePencil, FolderSimple } from '@phosphor-icons/react';
import { TOKENS, paletteCSS } from './palette.js';
import { createState } from './state.js';
import { IMAGES, STYLES } from './generated.js';

export const name = 'dsh-lulu-warm-study-theme';
export const inject = ['theme', 'slots'];
const IDEAS = [
  { label: '整理灵感', text: '帮我把一个新想法整理成清晰、可执行的计划。', icon: Lightbulb },
  { label: '写点什么', text: '我们一起写点什么，请先帮我梳理主题和表达思路。', icon: NotePencil },
  { label: '开始一个项目', text: '我想开始一个小项目，请帮我明确目标，再一步步实现。', icon: FolderSimple },
];
export function apply(ctx) {
  ctx.effect(() => {
    let storage;
    try { storage = window.localStorage; } catch {}
    const controller = createState(storage);
    const h = React.createElement;
    const style = document.createElement('style');
    style.dataset.lwsStyle = '';
    style.textContent = `${paletteCSS()}\n${STYLES}`;
    document.head.appendChild(style);
    const usePreferences = () => React.useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
    let releaseTokens;
    let registrations = [];
    let lastEnabled;
    function Mark({ size = 32 }) {
      return h('img', { className: 'lws-brand-mark', src: IMAGES.face, alt: '噜噜', width: size + 18, height: size + 18, draggable: false });
    }
    function BrandName() {
      return h('span', { className: 'lws-brand-name' }, h('strong', null, '噜噜'), h('small', null, 'DeepSeek Harness'));
    }
    function Hero() {
      const preferences = usePreferences();
      return h('span', { className: 'lws-hero', 'data-scene': preferences.scene },
        preferences.scene ? h(React.Fragment, null,
          h('img', { className: 'lws-scene lws-scene-day', src: IMAGES.scene, alt: '暖光书房里，管家噜噜端着热茶向你招手。', draggable: false }),
          h('img', { className: 'lws-scene lws-scene-night', src: IMAGES.night, alt: '可可夜色里，噜噜和一盏暖灯陪你工作。', draggable: false })) : null,
        h('span', { className: 'lws-hero-copy' },
          h('span', { className: 'lws-eyebrow' }, 'LULU AT YOUR SERVICE'),
          h('span', { className: 'lws-title' }, h('span', null, '慢慢来，'), h('span', null, '好想法值得被照顾。')),
          h('span', { className: 'lws-subtitle' }, '一杯热茶，一起把灵感变成现实。')));
    }
    function Footer({ wide = true }) {
      const preferences = usePreferences();
      if (!wide || !preferences.peek) return null;
      return h('div', { className: 'lws-sidebar-footer', 'aria-label': '噜噜随时为你效劳' },
        h('img', { src: IMAGES.face, alt: '', draggable: false }), h('span', null, '随时为你效劳'));
    }
    function Ideas(props) {
      const draft = props.useInput ? props.useInput(snapshot => snapshot.draft) : '';
      function choose(text) {
        if (!props.inputActions) return;
        props.inputActions.setDraft(draft?.trim() ? `${draft}\n${text}` : text);
        props.inputActions.persistDraft?.();
        document.querySelector('[data-phase="hero"] [contenteditable="true"]')?.focus();
      }
      return h('div', { className: 'lws-ideas' },
        h('div', { className: 'lws-idea-buttons' }, IDEAS.map(idea => h('button', {
          type: 'button', className: 'lws-idea', key: idea.label,
          onClick: () => choose(idea.text), disabled: !props.inputActions,
        }, h(idea.icon, { size: 22, weight: 'light', 'aria-hidden': true }), idea.label))),
        h('p', { className: 'lws-caption' }, '小小的陪伴，装满大大的快乐。'));
    }
    function Settings() {
      const preferences = usePreferences();
      const checkbox = (key, text) => h('label', { key }, h('input', {
        type: 'checkbox', checked: preferences[key], disabled: !preferences.enabled,
        onChange: event => controller.set({ [key]: event.target.checked }),
      }), text);
      return h('section', { className: 'lws-settings', 'aria-label': '暖橙书房主题设置' },
        h('div', { className: 'lws-settings-heading' },
          h('img', { src: IMAGES.face, alt: '', width: 44, height: 44 }),
          h('div', null, h('strong', null, '噜噜 · 暖橙书房 1.0'), h('p', null, '慢慢来，好想法值得被照顾。')),
          h('button', { className: 'lws-switch', role: 'switch', type: 'button',
            'aria-label': '启用暖橙书房主题', 'aria-checked': preferences.enabled,
            onClick: () => controller.set({ enabled: !preferences.enabled }) })),
        h('img', { className: 'lws-settings-scene', src: IMAGES.scene, alt: '暖橙书房场景预览', loading: 'lazy' }),
        h('div', { className: 'lws-options' }, [checkbox('scene', '欢迎页显示暖光书房'), checkbox('peek', '侧栏显示噜噜陪伴'), checkbox('motion', '轻柔动效')]),
        h('p', { className: 'lws-settings-note' }, '外观跟随 DSH 的浅色 / 深色设置。所有开关会自动保存。'));
    }
    const register = (slot, id, Component, list = false) => ctx.slots.inject(slot, () => ctx.slots.register({
      name: slot, id, ...(list ? { order: slot === 'settings.general.item' ? 12 : 90 } : { priority: -110 }),
    }, Component));
    function sync() {
      const preferences = controller.getSnapshot();
      document.body.toggleAttribute('data-lws-theme', preferences.enabled);
      if (preferences.enabled) document.body.setAttribute('data-lws-motion', String(preferences.motion));
      else document.body.removeAttribute('data-lws-motion');
      if (preferences.enabled === lastEnabled) return;
      lastEnabled = preferences.enabled;
      if (preferences.enabled) {
        releaseTokens = ctx.theme.overrideTokens(name, TOKENS);
        registrations = [
          register('sidebar.brand.mark', 'lws-mark', Mark), register('sidebar.brand.name', 'lws-name', BrandName),
          register('conversation.hero.brand.mark', 'lws-hero', Hero),
          register('sidebar.footer.action', 'lws-companion', Footer, true),
          register('conversation.input.dock', 'lws-ideas', Ideas, true),
        ];
      } else {
        for (const dispose of registrations.splice(0)) if (typeof dispose === 'function') dispose();
        releaseTokens?.(); releaseTokens = undefined;
      }
    }
    const unsubscribe = controller.subscribe(sync);
    const releaseSettings = register('settings.general.item', 'lws-settings', Settings, true);
    sync();
    return () => {
      unsubscribe();
      for (const dispose of registrations.splice(0)) if (typeof dispose === 'function') dispose();
      if (typeof releaseSettings === 'function') releaseSettings();
      releaseTokens?.();
      document.body.removeAttribute('data-lws-theme'); document.body.removeAttribute('data-lws-motion');
      style.remove(); controller.clear();
    };
  }, 'lulu-warm-study: native appearance, slots and cleanup');
}
