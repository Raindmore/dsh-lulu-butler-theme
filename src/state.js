export const STORAGE_KEY = 'dsh-lulu-warm-study:v1';
export const DEFAULTS = Object.freeze({ enabled: true, scene: true, peek: true, motion: true });
export function normalizeState(input) {
  const value = input && typeof input === 'object' ? input : {};
  return Object.freeze(Object.fromEntries(Object.entries(DEFAULTS).map(([key, fallback]) => [key, typeof value[key] === 'boolean' ? value[key] : fallback])));
}
export function createState(storage) {
  let saved;
  try { saved = JSON.parse(storage?.getItem(STORAGE_KEY) || 'null'); } catch {}
  let current = normalizeState(saved);
  const listeners = new Set();
  return {
    getSnapshot: () => current,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
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
