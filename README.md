# 解宝珅 · 运营作品集

React + Vite + GSAP 单页作品集，版心最大 1700px。当前以电脑端为设计和验收范围。

## 三部分结构

1. **个人介绍**：保留英文视频封面，下接姓名、院校、专业与本科学历、两项比赛三等奖、分团委组织部副部长职务、简历与联系方式。封面不设背景介绍按钮。
2. **科技数码类账号运营 · 凰家评测**：实习分工、账号整体数据、话题传播与互动作品。原创话题、拓竹项目和小红书复盘通过次级入口展开。
3. **个人抖音 · 爆款视频策划**：仅展示两条代表视频，不展示个人账号名。视频、截图、数据与分工尚未提供，目前两个位置明确占位，不编写成果。

联系方式收在页脚，保留邮箱、电话、复制邮箱与下载简历，删除发送邮件按钮。删除左侧进度条与封面底部署名。

## 本地运行

需要 Node.js 22.12+ 或 24+。

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4307/`。

```bash
npm run build
npm run preview
```

## 修改位置

- `src/App.jsx`：三部分内容与页脚。
- `src/data.js`：项目、截图、联系方式及统计口径。
- `src/portfolio.css`：三部分排版；`styles.css` 保留基础排版。
- `src/liquid-glass.css` 与 `src/glassConfig.js`：材质、边缘位移、光源及动画参数。
- `src/GlassSurface.jsx` 与 `src/GlassSurface.css`：React Bits JS-CSS 注册表的完整原始组件，未改写源码；注册表没有额外依赖。
- `src/GlassButton.jsx` 与 `src/glass-buttons.css`：按钮材质适配与清透样式。普通按钮使用提供的 `displace=15`、`distortionScale=-150`、RGB 偏移 `5/15/25`、`brightness=60`、`opacity=0.8`、`mixBlendMode=screen`；尺寸跟随实际按钮。导航选中块单独使用 `NAVIGATION_GLASS`。
- `src/SectionNavigation.jsx`：无可见进度条；缓存章节位置，滚动更新导航选中状态及首页长条的展开与收拢。
- `src/usePortfolioMotion.js`：完整开场、模块标题遮罩进场、卡片 stagger、图片 reveal 和局部视差；GSAP matchMedia 自动回收动画与 ScrollTrigger。
- `src/motionConfig.js` 与 `src/motion.css`：统一管理节奏、位移、错峰和遮罩结构。
- `src/HeroVideo.jsx`：单视频解码，根据刷新节奏选择离线补帧的 60/120fps 文件。循环衔接已写入素材；离开封面、打开详情、页面隐藏或减少动态效果时暂停。实际播放帧率受硬件与浏览器影响。
- `src/SegmentedControl.jsx`：导航与平台切换的连续移动选中块；悬停预览、按住拖动、松开选择、取消复位及键盘操作。
- `src/Dialog.jsx`：项目从点击位置展开并收回；截图可放大；Escape 关闭并返回焦点。
- `src/EvidenceStack.jsx`：原创话题截图堆叠、展开与收起。
- `public/assets/`：截图、首页视频与已有简历。个人照片和两条个人抖音视频待补充。
- `public/assets/weibo.svg`：微博标识，采用 [Simple Icons 的新浪微博 SVG](https://github.com/simple-icons/simple-icons/blob/develop/icons/sinaweibo.svg)，仅添加品牌红色填充。

## 清透材质

固定浅色、清透、100% 透光参数，无外观按钮、滑块或模式切换。按钮使用细窄边缘和轻微投影，移除厚白亮边、多层内阴影、悬停鼓起与标签放大。按下仅轻微等比缩小；切换选中块持续平移，保持安静。

首页、页脚、项目加号、简历和截图弹窗的液态按钮，以及导航与平台切换的选中块，使用 [React Bits GlassSurface](https://reactbits.dev/components/glass-surface)。组件来源是 [JS-CSS 官方注册表](https://reactbits.dev/r/GlassSurface-JS-CSS.json)。安装命令已尝试，shadcn 工具在当前运行环境中因自身 `ajv` 依赖错误退出，因此直接安装注册表的两份准确源码；项目依赖和锁文件无需变动。

Chromium/Edge 中通过 SVG 位移、分色重组与 `backdrop-filter` 处理真实背后内容；移动控件时不复制背景图片，保持浏览器实时背景采样。文字、图标和原生点击目标在独立清晰层，未施加模糊或扭曲。`opacity=0.8` 是位移图内部参数，不是给按钮叠加80%的白色蒙层；实际背景底色 `backgroundOpacity=0`，保留固定浅色、清透和100%透光设置。单独覆盖组件默认的多层内阴影，避免厚重质感。

Safari/Firefox 按组件能力检测使用 CSS 近似，只保留透光、柔和模糊、细边和轻微投影；不把它描述为真实折射。大面积导航外壳和阅读区域继续使用原有稳定材质。已迁移的按钮排除旧 SVG 折射，避免重复处理。此效果为屏幕背景位移，不是完整物理光线追踪。

导航与平台切换选中块使用中性位移图、更轻的位移和0.6px模糊。实测发现原三通道分色重组在共享导航背景上产生灰底；材质适配层改为输出原组件的单次背景位移结果 `dispRed`，保留原背景RGB与透明度。原始组件文件保持不变。文字仍为清晰的深色，选中态由透明透镜细边表达，不再用灰黑底。

阅读详情保留必要底色。`prefers-reduced-motion` 关闭动效；高对比与减少透明度设置优先保障可读性。旧 `GlassStudio.jsx` 和 `OpticalScene.jsx` 未导入运行页面，不产生 WebGL 开销。

数据采用概数，截图保留后台原值；不同平台、统计周期、账号整体、话题结果与个人分工分别说明。热搜案例中个人负责词条设计、KOL 对接与运营，未参与视频制作。

现有 Sites 身份保留在 `.openai/hosting.json`。`dist/` 为 Vite 构建输出，发布前运行构建。

## 创意作品集动效

首屏约 3 秒：视频画面从中央揭开，导航展开，两行英文标题从遮罩内向上位移、由压缩状态归位，再出现定位。没有人为等待或加载百分比；用户滚轮、键盘或锚点导航可直接结束开场。直接打开案例锚点时跳过开场。

各模块标题先完成大幅位移与遮罩进场，再显示背景信息、数据与作品。项目卡片间隔约 0.2 秒错峰归位；作品图片自上而下揭示，并从轻微放大恢复。两张作品图随原生滚动上下移动最多约 18px，使用缓冲 scrub 平顺跟随。统一自然减速，无弹跳缓动。

入场播放一次，读者回看不会反复遮住内容。键盘聚焦直接完成相关揭示，保持链接可用。减少动态效果设置恢复静态排版；React StrictMode 和媒体条件变化时回收所有动画与触发器。只在入场期间临时提升动画图层；不引入滚动劫持、全页实时滤镜或重复视频解码。
