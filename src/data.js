export const contact = { name: '解宝珅', email: '2535362675@qq.com', phone: '18242345889' };

export const shots = {
  overview: { file: 'S23-overview.png', title: '凰家评测 · 微博账号后台', note: '近30日账号整体数据，完整统计起止未说明。阅读量和视频播放量分别展示，页面使用概数，原图保留后台原值。' },
  poll: { file: 'S17-poll.png', title: '手机系统偏好投票', note: '微博单条作品，发布于2026年7月。统计截止未说明，阅读、投票与点赞为不同指标。' },
  topic: { file: 'S31-topic.jpg', title: '电视适老化 · 话题数据', note: '话题页「全部」范围，截图时间未说明。这里是话题整体结果；个人职责为词条设计、KOL对接协同和话题运营。' },
  rank: { file: 'S30-rank.jpg', title: '电视适老化 · 科技榜记录', note: '科技榜最高第8位，与话题数据是不同快照。拍摄时间未说明，不把科技榜排名写成总榜排名。' },
  views: { file: 'S11-views.png', title: '小红书 · 观看数据', note: '7月20日至8月18日，年份未说明。包含付费投流；环比来自后台，前期基数未显示。' },
  interactions: { file: 'S13-interactions.png', title: '小红书 · 互动数据', note: '与观看数据为同一周期，包含付费投流。收藏环比来自后台原值，尚未拆分自然与付费流量。' },
  followers: { file: 'S14-followers.png', title: '小红书 · 关注数据', note: '同一统计周期，包含付费投流。后台净涨粉与新增减取消的差额不一致，保留原图，口径待核。' },
  column6: { file: 'S06-column.png', title: '小凰鸡聊科技', note: '话题页累计口径，统计起止和截止未说明。' },
  column5: { file: 'S05-column.png', title: '小凰鸡深夜Deep talk', note: '话题页累计口径，统计起止和截止未说明。' },
  column7: { file: 'S07-column.png', title: '小凰鸡闲聊站', note: '话题页累计口径，统计起止和截止未说明。' },
  column8: { file: 'column-digital-class.jpg', title: '小凰鸡数码讲堂', note: '话题「全部」口径：阅读77.2万、讨论181、互动593、原创73。截图未说明统计起止与拍摄时间。' },
  bambu: { file: 'bambu-weibo.png', title: '拓竹 · 3D打印耗材实测', note: '微博作品截图：173万次观看、1152次转发、93条评论、1463次点赞。' },
};

export const projects = [
  { id: 'hot', category: '议题设计 · 协同传播', title: '电视适老化话题传播', subtitle: '话题设计、KOL联动与冲榜', image: 'topic-cover.jpg', alt: '电视适老化话题的阅读、互动与发布媒体记录', tag: '话题阅读 370万+', tone: 'warm' },
  { id: 'bambu', category: '产品传播 · 实测内容', title: '拓竹 · 产品传播项目', subtitle: '从家庭使用场景切入，回应3D打印耗材安全问题', image: 'bambu-weibo.png', alt: '凰家评测6款3D打印耗材排放实测微博作品截图', tag: '视频观看 173万', tone: 'cool' },
];

export const douyinWorks = [
  { id: 'northeast', title: '振兴东北', tags: '#东北', views: '10.0万', href: 'https://v.douyin.com/bFnyyCFUVfA/', cover: 'left' },
  { id: 'cameras', title: '影石与大疆 · 运动相机', tags: '#影石 #大疆 #运动相机', views: '39.3万', href: 'https://v.douyin.com/lOTXwR0C2ew/', cover: 'right' },
];

export const strengths = [
  { index: '01', title: '内容判断', copy: '理解用户关心的问题，把选题转化为清晰、可参与的内容。', detail: 'poll', evidence: '手机系统偏好投票' },
  { index: '02', title: '平台运营', copy: '独立运营微博，参与多平台内容发布、互动与数据观察。', detail: 'platforms', evidence: '微博与小红书后台' },
  { index: '03', title: '传播协同', copy: '设计热搜词条，联系 KOL 协同传播，推进话题运营。', detail: 'hot', evidence: '电视适老化话题' },
];

export const columns = [
  { title: '小凰鸡聊科技', metric: '话题阅读 130万+', shot: 'column6' },
  { title: '小凰鸡深夜Deep talk', metric: '话题阅读 36万+', shot: 'column5' },
  { title: '小凰鸡闲聊站', metric: '话题阅读 约100万', shot: 'column7' },
  { title: '小凰鸡数码讲堂', metric: '话题阅读 77万+', shot: 'column8', imagePosition: 'center 16%' },
];
