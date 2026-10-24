# 噜噜 · 暖橙书房 1.0 安装说明

## 用 GitHub 地址安装（也适合同事）

1. 打开 DeepSeek Harness 桌面版，点击左侧「插件」。
2. 点击「添加插件」右侧下拉箭头，选择「安装第三方插件」。
3. 在「包名或地址」填写下面整行，点击「安装」。

```text
github:Raindmore/dsh-lulu-butler-theme#warm-study-v1
```

4. 在「已安装插件」中启用 `dsh-lulu-warm-study-theme`。如果之前安装过 `dsh-lulu-butler-theme`，先停用旧主题。
5. 若外观没有立即改变，重启一次 DSH。

这是独立的暖橙书房 1.0 主题，和旧主题包名不同。把此地址发给同事即可；每个人在自己的客户端安装。

## 使用 ZIP 安装

1. 解压 `lulu-warm-study-install-v1.0.0.zip`，把里面的 `dsh-lulu-warm-study-theme` 文件夹放在固定位置。
2. 复制该文件夹的完整路径。这个文件夹必须直接包含 `package.json`、`cordis.patch.yml` 和 `lib`。
   - Mac：访达中选中文件夹，按 Option + Command + C 复制路径。
   - Windows：进入文件夹，点击资源管理器地址栏并复制完整路径。
3. 在同一「安装第三方插件」窗口中，把这个完整路径填入「包名或地址」，点击安装，随后启用。

请填写你自己电脑上的解压路径，不要填 ZIP 文件或 `lib/client.js` 的路径。发给同事时，直接分享 ZIP；对方解压后使用对方电脑上的路径。无需安装 Node.js 或运行构建命令。

## 外观设置

打开左下角「更多 → 设置 → 通用设置」，找到「噜噜 · 暖橙书房 1.0」。

- 「欢迎页显示暖光书房」：开关主场景。
- 「侧栏显示噜噜陪伴」：开关左下角探头。
- 「轻柔动效」：开关欢迎文案的轻微入场效果。
- 「启用暖橙书房主题」：临时恢复 / 开启主题。
- DSH 的「外观 → 深色」：切换为暖灯夜间书房。

## 更新、关闭和卸载

在「插件」页停用或卸载 `dsh-lulu-warm-study-theme` 即可恢复原生外观。更新时可先卸载旧的暖橙书房主题，再用上述 GitHub 地址安装。旧的小管家主题不会被此包覆盖。

已验证 DSH `0.2.1-rc.2` 的官方客户端接口。版本差异导致入口名称不同时，以当前 DSH 的第三方插件安装入口为准。

官方说明：[第三方插件管理](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/client/ui-plugin-manager)。
