# 解宝珅 · 运营作品集

React + Vite + GSAP 单页作品集，版心最大 1700px。当前以电脑端为设计和验收范围。

## 三部分结构

1. **个人介绍**：保留英文视频封面，下接姓名、院校、专业与本科学历、两项比赛三等奖、分团委组织部副部长职务、简历与联系方式。封面不设背景介绍按钮。
2. **科技数码类账号运营 · 凰家评测**：实习分工、账号整体数据、话题传播与产品项目。两张重点项目为电视适老化与拓竹，预览300–400px高；4个原创话题与手机系统偏好投票通过次级入口展开。热搜详情首先列示科技榜第8位。
3. **个人抖音 · 爆款视频策划**：展示社会议题型内容与品牌竞争型内容两条代表视频，保留作品截图、播放量、分工描述和抖音链接，不展示个人账号名。

联系方式收在页脚，保留邮箱、电话、复制邮箱与下载简历，删除发送邮件按钮。删除左侧进度条与封面底部署名。「查看简历」在站内展开由完整PDF直接渲染的单页预览，保留原版排版和PDF下载。

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
- `src/GlassButton.jsx` 与 `src/glass-buttons.css`：按钮复用导航长条的2px背景模糊、细边缘与浅色高光，消除按钮内的位移纹理；导航选中透镜保留GlassSurface。
- `src/FluidGlass.jsx`、`src/FluidDock.jsx`、`src/FluidGlass.css`：React Bits FluidGlass 的条形导航适配。原始完整源码保存在 `references/FluidGlass.original.jsx`；三个官方模型保存在 `public/assets/3d/`，实际页面只加载 `bar.glb`。
- `src/SectionNavigation.jsx`：无可见进度条；缓存章节位置，滚动更新导航选中状态及首页长条的展开与收拢。
- `src/usePortfolioMotion.js`：完整开场、模块标题遮罩进场、卡片 stagger、图片 reveal 和局部视差；GSAP matchMedia 自动回收动画与 ScrollTrigger。
- `src/motionConfig.js` 与 `src/motion.css`：统一管理节奏、位移、错峰和遮罩结构。
- `src/GradualBlur.jsx`、`src/BorderGlow.jsx` 与各自 CSS：用户提供的 React Bits JS-CSS 完整组件，原提示词保存在 `references/`；依提示词安装 `mathjs`，组件当前使用原生 Math，没有把数学库额外导入页面。
- `src/CardEffects.jsx` 与 `src/card-effects.css`：浏览窗口底部固定渐进模糊；两张项目图和两个视频方块各自独立的指针边缘辉光。参数集中在适配层，保留浅色底、清晰前景标签与原生点击目标。
- `src/HeroVideo.jsx`：使用最早上线视频版本7e9d426的原始动画素材，桌面、轻量版和海报均逐字节恢复，保持原生循环与1倍速。离开封面、打开详情、页面隐藏或减少动态效果时暂停。
- `src/SegmentedControl.jsx`：导航与平台切换的连续移动选中块；悬停预览、按住拖动、松开选择、取消复位及键盘操作。
- `src/Dialog.jsx`：项目从点击位置展开并收回；截图可放大；Escape 关闭并返回焦点。
- `src/EvidenceStack.jsx`：四个原创话题直接并排展示，点击卡片放大原图，无展开/收起按钮。
- `public/assets/`：截图、首页视频与已有简历。已加入原始蓝底证件照及小凰鸡数码讲堂截图；两条个人抖音视频待补充。
- `public/assets/weibo.svg`：微博标识，采用 [Simple Icons 的新浪微博 SVG](https://github.com/simple-icons/simple-icons/blob/develop/icons/sinaweibo.svg)，仅添加品牌红色填充。

## 清透材质

固定浅色、清透、100% 透光参数，无外观按钮、滑块或模式切换。按钮使用细窄边缘和轻微投影，移除厚白亮边、多层内阴影、悬停鼓起与标签放大。按下仅轻微等比缩小；切换选中块持续平移，保持安静。

导航与平台切换的选中块沿用 [React Bits GlassSurface](https://reactbits.dev/components/glass-surface) 的 [JS-CSS 注册表源码](https://reactbits.dev/r/GlassSurface-JS-CSS.json)。页脚、项目加号、简历与截图弹窗按钮使用和导航外壳相同的清透材质。条形导航采用 [React Bits FluidGlass](https://reactbits.dev/components/fluid-glass)，安装 `three`、`@react-three/fiber`、`@react-three/drei`、`maath`，已更新依赖与锁文件。

Chromium/Edge 中，按钮通过 SVG 单通道背景位移与 `backdrop-filter` 处理背后内容；文字、图标和点击目标保持清晰。实际背景底色 `backgroundOpacity=0`，不增加灰黑蒙层或多层内阴影。「联系我」与导航选中块使用相同中性材质。

FluidGlass 保留原组件的 GLB、FBO、场景 portal 与 `MeshTransmissionMaterial`：直接复用正在播放的同一个 HTML 视频，按照视频和导航的实际视口坐标、object-fit 裁剪及四周渐隐创建共享背景输入；没有第二个视频解码器。该受控视频输入确实经过 WebGL 透射与折射。白色环境只负责镜面照明，不充当背景输入。

任意 HTML 文字及正文不能可靠进入这个共享场景，因此正文下的导航以 CSS 实时背景模糊和清透边缘为近似，WebGL 只提供安静的体积边缘；不声称完整DOM物理折射。按钮的 SVG 位移也是屏幕效果，不是光线追踪。Safari/Firefox 或 WebGL不可用时保留稳定CSS材质和全部HTML导航功能。

WebGL 延迟到标题开场之后加载。画布仅覆盖导航，DPR为1，背景缓冲区最多1536px宽、材质2次采样。玻璃反射按需刷新并限制到30fps，首页视频保持60fps；手机与节省流量模式保留CSS材质。原生链接、键盘、焦点和页面滚动均保留，未引入示例的独立滚动场景或无关图片。

导航与平台切换选中块使用中性位移图、更轻的位移和0.6px模糊。实测发现原三通道分色重组在共享导航背景上产生灰底；材质适配层改为输出原组件的单次背景位移结果 `dispRed`，保留原背景RGB与透明度。原始组件文件保持不变。文字仍为清晰的深色，选中态由透明透镜细边表达，不再用灰黑底。

阅读详情保留必要底色。`prefers-reduced-motion` 关闭动效与WebGL层；高对比与减少透明度设置优先保障可读性。旧 `GlassStudio.jsx` 和 `OpticalScene.jsx` 未导入运行页面。

数据采用概数，截图保留后台原值；不同平台、统计周期、账号整体、话题结果与个人分工分别说明。热搜案例中个人负责词条设计、KOL 对接与运营，未参与视频制作。

现有 Sites 身份保留在 `.openai/hosting.json`。`dist/` 为 Vite 构建输出，发布前运行构建。

## 创意作品集动效

首屏约 3 秒：视频画面从中央揭开，导航展开，两行英文标题从遮罩内向上位移、由压缩状态归位，再出现定位。没有人为等待或加载百分比；用户滚轮、键盘或锚点导航可直接结束开场。直接打开案例锚点时跳过开场。

各模块标题先完成大幅位移与遮罩进场，再显示背景信息、数据与作品。项目卡片间隔约 0.2 秒错峰归位；作品图片自上而下揭示，并从轻微放大恢复。移除两张预览图的滚动位移，悬停只由各自按钮的局部 CSS 触发，另一张保持稳定。统一自然减速，无弹跳缓动。

模块每次重新进入视口都会播放进场，包括向上回看和回到顶部后的再次下滑。整个动画组完全离开视口后才重置；停留在模块内不会反复闪动。回到封面时重播标题与背景揭示，固定导航保持可用。键盘聚焦直接完成相关揭示，减少动态效果设置恢复静态排版。React StrictMode 和媒体条件变化时回收所有动画与触发器，只在入场期间临时提升图层；不引入滚动劫持或重复视频解码。

## 方块视觉效果

GradualBlur 固定在浏览窗口底部 4.5rem 区域，用四层带渐变遮罩的真实 `backdrop-filter` 形成逐渐加深的模糊，随滚动保持位置。项目方块内没有模糊遮罩；装饰层不拦截指针，原生 dialog 在其上方显示。页脚留出底部空间，避免收尾链接处于模糊带内。浏览器不支持该滤镜、减少透明度或高对比设置时保留清晰内容。

BorderGlow 用在四个作品方块，指针接近边缘时改变方向锥形遮罩与低饱和色光。无自动扫光或常驻动画循环，原组件的深色背景和厚重阴影在适配层改为浅色、无额外投影。减少动态效果时取消过渡，键盘沿用清晰焦点与原项目展开、关闭回位交互。

## 性能优化

详见 [2026-10-08 性能审查记录](references/performance-audit.md)。原媒体保存在 `references/original-media/`，运行页面使用压缩后的 WebP、同站 WOFF2 和60fps视频。五张易加载失败的证据截图采用按需内嵌模块，首页脚本不再携带截图数据。
