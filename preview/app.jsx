import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { apply } from '../src/plugin.js';
import { IMAGES } from '../src/generated.js';

// This local shell is an offline visual preview. Its slot / theme adapters run
// the exact production plugin, including enable, persistence and disposal.
const entries = new Map();
const listeners = new Set();
let revision = 0;
const publish = () => { revision++; for (const fn of listeners) fn(); };
const themeListeners = new Set();
const disposers = [];
const tokenLayers = new Map();
let preference = localStorage.getItem('lulu-preview:appearance') || 'light';
const media = matchMedia('(prefers-color-scheme: dark)');

function applyAppearance() {
  const dark = preference === 'system' ? media.matches : preference === 'dark';
  document.body.toggleAttribute('data-ds-dark-theme', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  for (const key of [...document.body.style]) if (key.startsWith('--dsw-') || key.startsWith('--lulu-')) document.body.style.removeProperty(key);
  for (const layer of tokenLayers.values()) for (const [key, pair] of Object.entries(layer)) document.body.style.setProperty(key, pair[dark ? 'dark' : 'light']);
  for (const fn of themeListeners) fn();
}
const ctx = {
  theme: {
    overrideTokens(source, tokens) {
      tokenLayers.set(source, tokens); applyAppearance();
      return () => { tokenLayers.delete(source); applyAppearance(); };
    },
  },
  slots: {
    inject(_name, callback) { return callback(); },
    register({ name, id }, Component) {
      const key = `${name}/${id}`;
      entries.set(key, { name, Component }); publish();
      return () => { entries.delete(key); publish(); };
    },
  },
  effect(fn) {
    const dispose = fn();
    if (typeof dispose === 'function') disposers.push(dispose);
    return dispose;
  },
};
apply(ctx);
applyAppearance();
media.addEventListener('change', applyAppearance);
function Slot({ name, fallback, ...props }) {
  useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn); }, () => revision);
  const found = [...entries.values()].filter(entry => entry.name === name);
  return found.length ? found.map(({ Component }, index) => <Component key={index} {...props} />) : fallback || null;
}
function Icon({ name, size = 18 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    folder: <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10H3Z" />,
    grid: <><rect x="3.5" y="3.5" width="6" height="6" rx="1.5"/><rect x="14.5" y="3.5" width="6" height="6" rx="1.5"/><rect x="3.5" y="14.5" width="6" height="6" rx="1.5"/><rect x="14.5" y="14.5" width="6" height="6" rx="1.5"/></>,
    chat: <path d="M20 11.5a8 8 0 0 1-8 8H4l1.5-4A8 8 0 1 1 20 11.5Z" />,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/></>,
    moon: <path d="M20 13.3A8.5 8.5 0 0 1 10.7 4 8.5 8.5 0 1 0 20 13.3Z" />,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
    arrow: <path d="M12 19V5m-5 5 5-5 5 5" />,
    paperclip: <path d="m9 13 6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l8-8" />,
    sparkle: <><path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z"/></>,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/></>,
    file: <><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h4M9 12h6m-6 4h4"/></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    check: <path d="m5 12 4 4L19 6" />,
    panel: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.sparkle}</svg>;
}
function App() {
  const [mode, setMode] = useState(preference);
  const [wardrobe, setWardrobe] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const recent = ['一个关于秋天的小想法', '把灵感整理成一份计划', '我的个人主页'];
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer);
  }, [toast]);
  function changeMode(value) {
    preference = value; localStorage.setItem('lulu-preview:appearance', value);
    applyAppearance(); setMode(value);
  }
  function reset() { setMessage(''); setDraft(''); setSidebar(false); }
  function submit(event) {
    event.preventDefault(); if (!draft.trim()) return;
    setMessage(draft.trim()); setDraft('');
  }
  return <div className="desktop-shell">
    <aside className={`sidebar ${sidebar ? 'is-open' : ''}`}>
      <div className="window-dots" aria-hidden="true"><i/><i/><i/></div>
      <div className="sidebar-brand"><Slot name="sidebar.brand.mark" size={38} fallback={<Icon name="sparkle" size={32}/>} /><Slot name="sidebar.brand.name" fallback={<strong>DeepSeek Harness</strong>}/></div>
      <button className="new-session" onClick={reset}><Icon name="plus" size={17}/>新的会话<span>⌘ N</span></button>
      <nav className="main-nav" aria-label="主导航">
        <button onClick={() => setSearch(!search)}><Icon name="search"/>搜索会话<span>⌘ K</span></button>
        <button onClick={() => setToast('主题预览：真实工作区在 DeepSeek Harness 中管理。')}><Icon name="folder"/>工作空间</button>
        <button onClick={() => setWardrobe(true)}><Icon name="grid"/>主题装扮<span className="small-pill">3</span></button>
      </nav>
      <div className="session-heading">最近会话<button title="新建会话" aria-label="新建会话" onClick={reset}><Icon name="plus" size={14}/></button></div>
      <div className="session-tabs"><button className={tab === 'all' ? 'selected' : ''} onClick={() => setTab('all')}>全部</button><button className={tab === 'star' ? 'selected' : ''} onClick={() => setTab('star')}>收藏</button></div>
      {search ? <input className="session-search" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索最近会话…" aria-label="搜索最近会话"/> : null}
      <div className="session-list">{recent.filter((name, i) => (tab === 'all' || i === 0) && name.includes(query)).map((name, index) => <button key={name} onClick={() => { setMessage(name); setSidebar(false); }}><span className={`session-dot dot-${index}`}/><span>{name}</span></button>)}</div>
      <div className="sidebar-bottom">
        <div className="lulu-note"><span className="note-star">✦</span><p>小小的陪伴，<br/>装满大大的快乐。</p><span className="note-stroke"/></div>
        <button className="sidebar-account" onClick={() => setWardrobe(!wardrobe)}><span className="profile-dot">Q</span><span><strong>我的工作台</strong><small>今天也要开心呀</small></span><Icon name="settings" size={17}/></button>
      </div>
    </aside>
    {sidebar ? <button className="sidebar-backdrop" aria-label="关闭侧边栏" onClick={() => setSidebar(false)}/> : null}
    <main className="main-panel">
      <header className="topbar"><div><button className="icon-button mobile-menu" aria-label="打开侧边栏" onClick={() => setSidebar(!sidebar)}><Icon name="panel"/></button><span className="workspace-name"><Icon name="folder" size={15}/>我的工作空间<span>/</span><b>{message ? '会话预览' : '新的会话'}</b></span></div>
        <div className="topbar-actions"><span className="preview-badge">主题预览</span><button className="icon-button" aria-label={mode === 'dark' ? '切换奶油日间' : '切换可可夜间'} onClick={() => changeMode(mode === 'dark' ? 'light' : 'dark')}><Icon name={mode === 'dark' ? 'sun' : 'moon'}/></button><button className={`icon-button ${wardrobe ? 'is-selected' : ''}`} aria-label="切换装扮间" onClick={() => setWardrobe(!wardrobe)}><Icon name="panel"/></button></div>
      </header>
      <div className={`conversation-area ${message ? 'has-message' : ''}`}>
        {!message ? <div className="welcome">
          <div className="preview-hero-headline"><span><Slot name="conversation.hero.brand.mark" size={34} fallback={<span className="fallback-title">DeepSeek Harness</span>}/></span><span className="native-title">DeepSeek Harness</span></div>
          <div className="suggestions"><button onClick={() => setDraft('帮我把一个小想法，变成清晰的行动计划。')}><Icon name="sparkle" size={16}/>整理一个灵感</button><button onClick={() => setDraft('帮我写一份简洁、温暖的项目介绍。')}><Icon name="file" size={16}/>一起写点什么</button><button onClick={() => setDraft('帮我构思并实现一个有趣的小应用。')}><Icon name="code" size={16}/>做个小项目</button></div>
        </div> : <div className="message-preview"><div className="user-message">{message}</div><div className="assistant-preview"><img src={IMAGES.butler} alt="噜噜"/><div><strong>噜噜 · 小管家</strong><p>你的想法已经放在这里啦。</p><p>这是主题的本地交互预览。安装到 DeepSeek Harness 后，这里会显示你配置的模型的真实回复。</p><button onClick={reset}>回到欢迎页 <Icon name="chevron" size={13}/></button></div></div></div>}
        <div className="composer-wrap"><form className="composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="draft">发送消息</label><textarea id="draft" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(e); } }} placeholder="有什么想法？交给噜噜一起完成…" rows={2}/>
          <div className="composer-toolbar"><div><button type="button" className="icon-button" aria-label="附件功能说明" onClick={() => setToast('安装到 DSH 后，可使用原生附件功能。')}><Icon name="paperclip" size={18}/></button><button type="button" className="model-select" onClick={() => setToast('此处为主题预览。真实模型请在 DSH 设置中配置。')}><span className="model-dot"/>DeepSeek <span>⌄</span></button><span className="composer-divider"/><span className="composer-mode">默认模式</span></div><button className="send-button" aria-label="发送预览消息" disabled={!draft.trim()}><Icon name="arrow" size={19}/></button></div>
        </form><div className="composer-caption"><span className="caption-dot"/>噜噜陪你，慢慢把想法变成现实。<span className="keyboard-hint">Enter 发送 · Shift + Enter 换行</span></div></div>
      </div>
      <footer className="main-footer"><span>LULU AT YOUR SERVICE</span><span>为每个小小的灵感，留一盏暖灯。<i>✦</i></span></footer>
    </main>
    {wardrobe ? <aside className="wardrobe" aria-label="主题装扮间"><div className="wardrobe-heading"><span className="wardrobe-overline">MAKE YOURSELF AT HOME</span><h2>噜噜的装扮间 <span>✦</span></h2><p>今天，想和哪个噜噜一起工作？</p></div>
      <div className="appearance-label">外观 <span>跟随你的心情</span></div><div className="appearance-control" role="group" aria-label="外观模式"><button aria-pressed={mode === 'light'} onClick={() => changeMode('light')}><Icon name="sun" size={14}/>日间</button><button aria-pressed={mode === 'dark'} onClick={() => changeMode('dark')}><Icon name="moon" size={14}/>夜间</button><button aria-pressed={mode === 'system'} onClick={() => changeMode('system')}>自动</button></div>
      <Slot name="settings.general.item"/>
      <div className="palette-card"><span className="palette-title">一份温暖的配色</span><div className="swatches"><i style={{background:'#FFFCF6'}}/><i style={{background:'#F5EEDF'}}/><i style={{background:'#F4BA69'}}/><i style={{background:'#AD4F1B'}}/><i style={{background:'#483528'}}/></div><p>奶油底色 · 焦糖点缀 · 可可文字</p></div>
      <div className="wardrobe-bottom"><span>小小的身子，<br/><em>装满大大的快乐。</em></span><span>♡</span></div>
    </aside> : null}
    {toast ? <div className="toast" role="status">{toast}</div> : null}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
window.addEventListener('pagehide', () => { for (const dispose of disposers) dispose(); }, { once: true });
