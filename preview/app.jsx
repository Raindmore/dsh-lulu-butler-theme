import React, { useState, useSyncExternalStore, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PlusCircle, Plus, MagnifyingGlass, FolderSimple, ChatCircleDots, SlidersHorizontal, Clock, Gear, PuzzlePiece, SidebarSimple, Moon, Sun, ArrowUp, Stack, UserCircle, CaretDown, NotePencil, X } from '@phosphor-icons/react';
import { apply } from '../src/plugin.js';
import { IMAGES } from '../src/generated.js';
const entries = new Map(), listeners = new Set(), tokenLayers = new Map(), effects = [];
let revision = 0;
const notify = () => { revision++; for (const fn of listeners) fn(); };
let mode = localStorage.getItem('lws-preview:mode') || 'light';
const media = matchMedia('(prefers-color-scheme: dark)');
function updateAppearance() {
  const dark = mode === 'dark' || (mode === 'system' && media.matches);
  document.body.toggleAttribute('data-ds-dark-theme', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  for (const key of [...document.body.style]) if (key.startsWith('--dsw-') || key.startsWith('--lulu-')) document.body.style.removeProperty(key);
  for (const layer of tokenLayers.values()) for (const [name, pair] of Object.entries(layer)) document.body.style.setProperty(name, pair[dark ? 'dark' : 'light']);
}
const context = {
  effect(fn) { const dispose = fn(); if (typeof dispose === 'function') effects.push(dispose); return dispose; },
  theme: { overrideTokens(source, tokens) { tokenLayers.set(source, tokens); updateAppearance(); return () => { tokenLayers.delete(source); updateAppearance(); }; } },
  slots: {
    inject(_slot, fn) { return fn(); },
    register({ name, id }, Component) { const key = `${name}/${id}`; entries.set(key, { name, Component }); notify(); return () => { entries.delete(key); notify(); }; },
  },
};
apply(context); updateAppearance(); media.addEventListener('change', updateAppearance);
function Slot({ name, fallback, ...props }) {
  useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn); }, () => revision);
  const found = [...entries.values()].filter(entry => entry.name === name);
  return found.length ? found.map(({ Component }, index) => <Component key={index} {...props}/>) : fallback || null;
}
function Icon({ as: Component, size = 23 }) { return <Component size={size} weight="light" aria-hidden="true"/>; }
function App() {
  const [draft, setDraft] = useState(''), [message, setMessage] = useState('');
  const [settings, setSettings] = useState(false), [collapsed, setCollapsed] = useState(false);
  const [appearance, setAppearance] = useState(mode), [search, setSearch] = useState(false), [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { if (!settings) return; const handle = event => { if (event.key === 'Escape') setSettings(false); }; window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle); }, [settings]);
  function newSession() { setDraft(''); setMessage(''); }
  function changeMode(value) { mode = value; localStorage.setItem('lws-preview:mode', value); updateAppearance(); setAppearance(value); }
  function submit(event) { event?.preventDefault(); if (!draft.trim()) return; setMessage(draft.trim()); setDraft(''); }
  const recents = ['一个小小的新想法', '把灵感整理成计划', '我的个人主页'];
  return <div className={`study-app ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className="study-sidebar">
      <div className="study-brand-row"><div className="study-brand"><Slot name="sidebar.brand.mark" size={34}/><Slot name="sidebar.brand.name" fallback={<strong>DeepSeek Harness</strong>}/></div><button className="icon-btn" aria-label="收起侧边栏" onClick={() => setCollapsed(true)}><Icon as={SidebarSimple} size={22}/></button></div>
      <button className="new-chat" onClick={newSession}><Icon as={PlusCircle} size={24}/><span>新会话</span><small>⌘ N</small></button>
      <nav className="study-navigation"><button onClick={() => setSettings(true)}><Icon as={PuzzlePiece}/>插件</button><button onClick={() => setToast('这是主题预览。自动化任务由 DSH 原生功能管理。')}><Icon as={Clock}/>自动化任务</button></nav>
      <div className="workspace-heading"><span>工作区</span><div><button className="icon-btn" aria-label="搜索会话" onClick={() => setSearch(!search)}><Icon as={MagnifyingGlass} size={20}/></button><button className="icon-btn" aria-label="打开主题设置" onClick={() => setSettings(true)}><Icon as={SlidersHorizontal} size={21}/></button><button className="icon-btn" aria-label="工作区说明" onClick={() => setToast('安装到 DSH 后，可使用原生工作区选择器。')}><Icon as={FolderSimple} size={22}/></button></div></div>
      <button className="workspace-row" onClick={() => setToast('当前展示：我的工作空间。')}><Icon as={FolderSimple} size={23}/><span>我的工作空间</span><Icon as={CaretDown} size={16}/></button>
      {search ? <input className="session-filter" autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索会话…" aria-label="搜索会话"/> : null}
      <div className="study-recents">{recents.filter(text => text.includes(query)).map((text, i) => <button className={!message && i === 0 ? 'selected' : ''} key={text} onClick={() => setMessage(text)}><Icon as={ChatCircleDots} size={21}/><span>{text}</span></button>)}</div>
      <div className="study-sidebar-bottom"><button className="study-account" onClick={() => setSettings(true)}><span className="account-avatar"><Icon as={UserCircle} size={28}/></span><span>我的工作台</span><Icon as={Gear} size={24}/></button><Slot name="sidebar.footer.action" wide={!collapsed}/></div>
    </aside>
    <main className="study-main"><header className="study-topbar"><div>{collapsed ? <button className="icon-btn" aria-label="展开侧边栏" onClick={() => setCollapsed(false)}><Icon as={SidebarSimple}/></button> : null}<span>我的工作空间 <i>/</i> <strong>{message ? '会话预览' : '新会话'}</strong></span></div><div><button className="icon-btn" aria-label={appearance === 'dark' ? '切换浅色' : '切换深色'} onClick={() => changeMode(appearance === 'dark' ? 'light' : 'dark')}><Icon as={appearance === 'dark' ? Sun : Moon}/></button><button className="icon-btn" aria-label="打开设置" onClick={() => setSettings(true)}><Icon as={SidebarSimple}/></button></div></header>
      <section className={`study-content ${message ? 'conversation-active' : ''}`}>
        {!message ? <div className="study-welcome"><div className="study-hero-headline"><span><Slot name="conversation.hero.brand.mark" fallback={<h1>有什么新想法？</h1>}/></span><span className="native-heading">DeepSeek Harness</span></div></div> : <div className="study-messages"><div className="study-user-message">{message}</div><div className="study-assistant"><img src={IMAGES.face} alt="噜噜"/><div><strong>噜噜 · 暖橙书房</strong><p>这是主题的本地预览。安装到 DSH 后，这里会显示你所配置模型的真实回复。</p><button onClick={newSession}>返回欢迎页</button></div></div></div>}
        <div className="study-composer-group"><button className="workspace-chip" onClick={() => setToast('安装到 DSH 后，此处使用原生工作区选择器。')}><Icon as={FolderSimple} size={20}/>我的工作空间<Icon as={CaretDown} size={13}/></button>
          <form className="study-composer" onSubmit={submit}><textarea aria-label="发送消息" value={draft} onChange={event => setDraft(event.target.value)} placeholder="有什么想法？交给噜噜一起完成…" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} rows={2}/><div className="study-composer-toolbar"><div><button type="button" className="attach-btn" aria-label="添加附件" onClick={() => setToast('安装到 DSH 后，可使用原生附件与指令功能。')}><Icon as={Plus} size={27}/></button><span className="toolbar-divider"/><button type="button" className="mode-btn" onClick={() => setToast('标准模式：在 DSH 中使用原生 Agent 预设。')}><Icon as={Stack} size={20}/>标准模式<Icon as={CaretDown} size={13}/></button><span className="toolbar-divider"/><button type="button" className="mode-btn permissions" onClick={() => setToast('预览不会访问你的文件。安装后使用 DSH 原生权限。')}><Icon as={NotePencil} size={20}/>工作区内修改<Icon as={CaretDown} size={13}/></button></div><div><button type="button" className="model-btn" onClick={() => setToast('主题预览没有连接模型。请在 DSH 中配置模型。')}>DeepSeek<Icon as={CaretDown} size={13}/></button><button className="send-btn" aria-label="发送预览消息" disabled={!draft.trim()}><Icon as={ArrowUp} size={28}/></button></div></div></form>
          {!message ? <Slot name="conversation.input.dock" useInput={selector => selector({ draft })} inputActions={{ setDraft, persistDraft() {} }}/> : null}
        </div>
      </section>
    </main>
    {settings ? <div className="settings-backdrop" onClick={() => setSettings(false)}><section className="settings-dialog" role="dialog" aria-modal="true" aria-label="主题设置" onClick={event => event.stopPropagation()}><div className="settings-dialog-header"><h2>主题设置</h2><button className="icon-btn" aria-label="关闭设置" onClick={() => setSettings(false)}><Icon as={X}/></button></div><p className="settings-intro">噜噜 · 暖橙书房 1.0</p><div className="appearance-row"><span>外观</span><div>{[['light','浅色'],['dark','深色'],['system','跟随系统']].map(([value,label])=><button key={value} aria-pressed={appearance === value} onClick={() => changeMode(value)}>{label}</button>)}</div></div><Slot name="settings.general.item"/><p className="preview-explainer">此窗口演示原生主题设置；安装后在「更多 → 设置 → 通用设置」中使用。</p></section></div> : null}
    {toast ? <div className="study-toast" role="status">{toast}</div> : null}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
window.addEventListener('pagehide', () => { for (const dispose of effects) dispose(); }, { once: true });
