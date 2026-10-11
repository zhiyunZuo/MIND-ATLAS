// ============================================================
// MIND ATLAS — 知识点插画索引（非侵入式，与原数据解耦）
// Key: `${subjectId}/${topicId}`
// 图片统一放在 assets/img/，命名 `${subjectId}__${topicId}.webp`
//
// ★ 呈现模式 mode（决定图上那块讲解文字长什么样）
//   'board' 学术化、需要理清逻辑的：底图留一块空黑板/白板，
//           讲解文字作为「板书」叠在板面上。
//   'scene' 有故事、有案例、有人物的：底图直接把场景画出来，
//           不要板；讲解文字作为「教材图说卡」叠在画面下方。
//   同一个知识点不要默认用板——能用画面讲清楚的，就用画面讲。
//
// ★ 画面取材原则
//   读该知识点的 concept / mechanism / example 原文，从中挑出真正的
//   机制、它自己的经典案例、甚至具体数字，再据此设计画面。
//   禁止出现「划掉 / 叉掉 / 打叉」这类否定式视觉标记。
//
// 新增流程：ImageGen 生成 → optimize_images.py 压缩 → 在此补索引。
// ============================================================

export const TOPIC_IMAGES = {

  // ---- 试点批次：场景型（直接画故事，画面里没有板）----
  'strategic-thinking/opportunity-cost': {
    mode: 'scene',
    file: 'assets/img/strategic-thinking__opportunity-cost.webp',
    caption: '走廊在这里分成两条：左边尽头是图书馆的阅览桌和暖灯，右边尽头是公司里成排的工位。他朝左边迈出一步，右边那条便整段留在阴影里——被放弃的那条路，才是这一次选择的真实代价。'
  },
  'behavioral-economics/loss-aversion-be': {
    mode: 'scene',
    file: 'assets/img/behavioral-economics__loss-aversion-be.webp',
    caption: '桌上两张账单，一涨一跌，数额完全相同。涨的那张被随手推到桌角；跌的那张被他双手压住，纸都压出了褶皱。同样是那么多钱，失去那一头压过来的分量要大得多。'
  },
  'game-theory/prisoners-dilemma': {
    mode: 'scene',
    file: 'assets/img/game-theory__prisoners-dilemma.webp',
    caption: '两间紧挨着却完全隔断的房间，两个人各坐一张金属桌前，谁也看不见谁。桌上各扣着两张牌：合作，还是背叛。每个人都只能猜对面那一位会翻哪一张。'
  },
  'cognitive-science/attention': {
    mode: 'scene',
    file: 'assets/img/cognitive-science__attention.webp',
    caption: '屏幕上的人在来回传球，正中央那只捶着胸的黑猩猩大得根本不可能看不见。可屏幕前数着传球次数的人，视线从头到尾没有离开过球——他没看见的不是画面，而是他没去注意的东西。'
  },
  'economics/information-econ': {
    mode: 'scene',
    file: 'assets/img/economics__information-econ.webp',
    caption: '黄昏的二手车市场，品相好的车正一辆辆驶出场，留下的都是外观老旧的车。买家只能弯下腰看漆面和轮胎，卖家却对每辆车的底细心中有数——买家只能按平均质量出价，好车就这样被赶了出去。'
  },

  // ---- 试点批次：板书型（抽象逻辑，需要一块板理清）----
  'rhetoric/argument-structure': {
    mode: 'board',
    file: 'assets/img/rhetoric__argument-structure.webp'
  },
  'philosophy/first-principles': {
    mode: 'board',
    file: 'assets/img/philosophy__first-principles.webp'
  },
  'systems-thinking/feedback-loops': {
    mode: 'board',
    file: 'assets/img/systems-thinking__feedback-loops.webp'
  }
};

export function getTopicImage(subjectId, topicId) {
  return TOPIC_IMAGES[`${subjectId}/${topicId}`] || null;
}
