export const STORAGE_KEY = 'dsh-lulu-butler:v1';
export const DEFAULTS = Object.freeze({ enabled: true, outfit: 'butler', mascot: true, motion: true });
export const OUTFITS = Object.freeze({
  butler: { name: '小管家', en: 'Butler', tagline: '每一个灵感，都值得被好好照顾。', greeting: '今天，也为你准备好了。', detail: '一杯热茶，和刚刚好的陪伴。' },
  detective: { name: '小侦探', en: 'Detective', tagline: '有点好奇，就一起找找答案。', greeting: '新的发现，从这里开始。', detail: '把好奇心交给噜噜，一起探索。' },
  sleepy: { name: '晚安噜噜', en: 'Goodnight', tagline: '慢慢来，好的想法不着急。', greeting: '忙了一天，辛苦啦。', detail: '放轻松，我们把事情一件件做好。' },
});

export function normalizeState(value) {
  const input = value && typeof value === 'object' ? value : {};
  return Object.freeze({
    enabled: typeof input.enabled === 'boolean' ? input.enabled : DEFAULTS.enabled,
    outfit: Object.hasOwn(OUTFITS, input.outfit) ? input.outfit : DEFAULTS.outfit,
    mascot: typeof input.mascot === 'boolean' ? input.mascot : DEFAULTS.mascot,
    motion: typeof input.motion === 'boolean' ? input.motion : DEFAULTS.motion,
  });
}

export function createState(storage) {
  let initial;
  try { initial = JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'); } catch {}
  let current = normalizeState(initial);
  const listeners = new Set();
  return {
    getSnapshot: () => current,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
    set(patch) {
      const next = normalizeState({ ...current, ...patch });
      if (Object.keys(DEFAULTS).every(key => next[key] === current[key])) return;
      current = next;
      try { storage?.setItem(STORAGE_KEY, JSON.stringify(current)); } catch {}
      for (const listener of listeners) listener();
    },
    clear() { listeners.clear(); },
  };
}
