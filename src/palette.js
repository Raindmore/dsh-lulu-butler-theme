// Paired values go through the native ThemeRuntime; DSH keeps ownership of mode.
const light = {
  bg: '#FFFCF6', surface: '#FFFDF9', lifted: '#FFFFFF', well: '#F5EDDF',
  sidebar: '#F5EEDF', border: '#E7DDCD', ink: '#483528', secondary: '#796653',
  muted: '#7C6957', accent: '#AD4F1B', accentHover: '#913F17', accentSoft: '#FBE9CA',
  onAccent: '#FFFFFF', bubble: '#F9ECCE', code: '#F4EDDF', codeHead: '#EDE2D1',
  hover: '#EDE2CF', green: '#437150', red: '#BA3E3D', warning: '#94610A', shadow: 'rgba(91, 61, 25, .09)',
};
const dark = {
  bg: '#211C18', surface: '#2C2520', lifted: '#352C25', well: '#3A3027',
  sidebar: '#28211B', border: '#514234', ink: '#F6EAD8', secondary: '#C8B59D',
  muted: '#B09A81', accent: '#F4BA69', accentHover: '#FFD29B', accentSoft: '#503720',
  onAccent: '#342312', bubble: '#443323', code: '#2A231D', codeHead: '#352B21',
  hover: '#403328', green: '#93C29A', red: '#FFA19A', warning: '#E3BC77', shadow: 'rgba(0, 0, 0, .20)',
};

const aliases = {
  'alias-bg-base': 'bg', 'alias-bg-layer-1': 'surface', 'alias-bg-layer-2': 'lifted',
  'alias-bg-layer-3': 'well', 'alias-bg-overlay': 'well', 'alias-bg-module-platform': 'well',
  'alias-bg-multi-select': 'well', 'alias-bg-document-preview': 'code',
  'alias-border-l1': 'border', 'alias-border-l2': 'border', 'alias-border-l2-darkmode-thin': 'border',
  'alias-border-l3': 'border', 'alias-border-l4': 'muted',
  'alias-brand-primary': 'accent', 'alias-brand-primary-invert': 'ink', 'alias-brand-text': 'ink',
  'alias-brand-primary-new-colorprimary-new-color': 'accent',
  'alias-button-primary-fill': 'accent', 'alias-button-primary-hover': 'accentHover',
  'alias-button-primary-dimmed': 'accentSoft', 'alias-button-info-fill': 'accent',
  'alias-button-info-hover': 'accentHover', 'alias-button-contrast-fill': 'ink',
  'alias-button-elevated-fill': 'lifted', 'alias-button-floating-fill': 'lifted',
  'alias-button-floating-hover': 'hover', 'alias-button-ghost-active-fill': 'accentSoft',
  'alias-button-ghost-active-hover': 'hover', 'alias-button-ghost-active-border': 'border',
  'alias-label-primary': 'ink', 'alias-label-primary-bluish': 'ink',
  'alias-label-primary-dimmed': 'secondary', 'alias-label-secondary': 'secondary',
  'alias-label-tertiary': 'muted', 'alias-label-caption': 'muted',
  'alias-label-primary-foreground': 'onAccent', 'alias-label-primary-inverted': 'onAccent',
  'alias-interactive-bg-hover': 'hover', 'alias-interactive-bg-active': 'accentSoft',
  'alias-interactive-bg-hover-accent': 'accentSoft', 'alias-interactive-bg-hover-solid': 'well',
  'alias-markdown-code-block': 'code', 'alias-markdown-code-block-banner': 'codeHead',
  'alias-markdown-inline-code': 'code', 'alias-markdown-code-segment-selected': 'codeHead',
  'alias-markdown-code-segment-unselected': 'code', 'alias-markdown-citation': 'well',
  'alias-markdown-placeholder': 'well', 'alias-markdown-tag': 'accentSoft',
  'alias-state-business-primary': 'accent', 'alias-state-business-tertiary': 'accentSoft',
  'alias-state-error-primary': 'red', 'alias-state-error-secondary': 'red',
  'alias-state-success-primary': 'green', 'alias-state-success-secondary': 'green',
  'alias-state-warn-primary': 'warning', 'alias-state-warn-secondary': 'warning', 'alias-state-warn-label': 'warning',
  'alias-scrollbar-bg-l1': 'border', 'alias-scrollbar-bg-l2': 'border',
  'alias-scrollbar-hover-l1': 'muted', 'alias-scrollbar-hover-l2': 'muted',
  'alias-toast-bg': 'ink', 'alias-tooltip-bg': 'ink',
  'specific-bubble': 'bubble', 'specific-bubble-highlight': 'accentSoft',
  'specific-input-major': 'surface', 'specific-login-input': 'well', 'specific-menu': 'surface',
  'specific-selector': 'well', 'specific-sidebar-fill': 'sidebar',
  'specific-sidebar-nav-item-active': 'hover', 'specific-sidebar-nav-item-active-accent': 'accentSoft',
  'specific-sidebar-nav-item-hover': 'hover', 'specific-tip': 'well',
  'menu-surface-fill': 'surface',
};
export const TOKENS = Object.fromEntries(Object.entries(aliases).map(([name, key]) => [
  `--dsw-${name}`, { light: light[key], dark: dark[key] },
]));
for (const [key, value] of Object.entries(light)) TOKENS[`--lulu-${key}`] = { light: value, dark: dark[key] };
TOKENS['--dsw-linear-gradient-think'] = {
  light: 'linear-gradient(180deg, #FFFCF6 20%, #FFFCF600 100%)',
  dark: 'linear-gradient(180deg, #211C18 20%, #211C1800 100%)',
};
TOKENS['--dsw-linear-think-select'] = {
  light: 'linear-gradient(180deg, #F9ECCE 20%, #F9ECCE00 100%)',
  dark: 'linear-gradient(180deg, #443323 20%, #44332300 100%)',
};
export const SWATCHES = { light, dark };

export function paletteCSS() {
  const rules = mode => Object.entries(TOKENS).map(([key, pair]) => `${key}:${pair[mode]};`).join('');
  return `body[data-lulu-theme]{${rules('light')}}\nbody[data-lulu-theme][data-ds-dark-theme]{${rules('dark')}}`;
}
