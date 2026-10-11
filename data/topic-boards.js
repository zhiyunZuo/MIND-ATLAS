// ============================================================
// MIND ATLAS — 知识点讲解文字（叠印在插画上的真实文本）
// Key: `${subjectId}/${topicId}`
//
// 为什么不用 AI 直接画字：图像模型渲染中文必然出现扭曲、错字、
// 粘连，而这里的要求是「知识点才是重点」。所以做法是——
//   AI 生成氛围底图，页面用真实文本把骨架叠印上去。
// 文字因此 100% 准确、可选中、随图等比缩放。
//
// ★ mode（与 topic-images.js 保持一致）
//   'board' 抽象、学术化、需要理清逻辑的 → tone chalk/ink，文字作
//          「板书」压在板面上，可带 flow / end，信息可以密一些。
//   'scene' 有故事、有案例的 → tone card，文字作「教材图说卡」贴在
//          画面下方，只留 expr + 3 条要点 + eg，别抢画面的戏。
//
// 取材原则：必须来自该知识点 concept / mechanism / example / experiment
// 原文，尤其是它自己的案例与具体数字，禁止写放之四海皆准的空话。
// 视觉上禁止「划掉 / 叉掉」这类否定式标记，一律用正面的对比呈现。
// ============================================================

export const TOPIC_BOARDS = {

  // ================= 场景型：图说卡 =================

  'strategic-thinking/opportunity-cost': {
    mode: 'scene', tone: 'card',
    title: '机会成本', sub: 'OPPORTUNITY COST',
    expr: '选这一项的真实代价 = 被放弃的那些里，价值最高的那个',
    lines: [
      { k: '不是', v: '会计成本——账面上花出去的钱' },
      { k: '而是', v: '次优选项的收益——看不见的那笔' },
      { k: '前提', v: '时间、钱、精力有限，选了 A 就买不起 B' }
    ],
    eg: '读研两年：学费只是显性成本；若不读研而用这两年工作，能赚到的积蓄与经验才是机会成本。'
  },

  'behavioral-economics/loss-aversion-be': {
    mode: 'scene', tone: 'card',
    title: '损失厌恶', sub: 'LOSS AVERSION',
    expr: '失去的痛苦 ≈ 得到的快乐 × 2 ~ 2.5',
    lines: [
      { k: '折点', v: '价值函数在参考点左侧更陡：收益端平缓，损失端陡峭' },
      { k: '禀赋效应', v: '我的杯子值 10 元，同样的杯子我只愿出 5 元买' },
      { k: '处置效应', v: '死抱亏损股不肯卖——卖出就等于承认损失' }
    ],
    eg: '掷硬币：正面赢 150、反面输 100，期望 +25，大多数人仍然拒绝参加。'
  },

  'game-theory/prisoners-dilemma': {
    mode: 'scene', tone: 'card',
    title: '囚徒困境', sub: "PRISONER'S DILEMMA",
    expr: 'T > R > P > S   且   2R > T + P',
    lines: [
      { k: '占优策略', v: '无论对方怎么做，自己背叛的收益都更高' },
      { k: '纳什均衡', v: '双方都背叛——稳定，却比共同合作更差' },
      { k: '重复博弈', v: '「以牙还牙」让长期合作的累积收益压过一次背叛' }
    ],
    eg: '双方沉默各判 1 年；双方坦白各判 5 年；一方坦白则当场获释，另一方判 10 年。'
  },

  'cognitive-science/attention': {
    mode: 'scene', tone: 'card',
    title: '注意力', sub: 'ATTENTION',
    expr: '从海量感官输入中，只选出极小一部分加工',
    lines: [
      { k: '容量', v: '只能同时维持 4±1 个信息组块' },
      { k: '三个网络', v: '警觉 · 定向 · 执行' },
      { k: '两种模式', v: '自上而下 = 目标驱动；自下而上 = 刺激捕获' }
    ],
    eg: '看不见的大猩猩：数传球次数时，约一半人看不见走进画面、捶着胸的「猩猩」。'
  },

  'economics/information-econ': {
    mode: 'scene', tone: 'card',
    title: '信息经济学', sub: 'INFORMATION ECONOMICS',
    expr: '一方知道，另一方不知道 → 市场会失灵',
    lines: [
      { k: '逆向选择', v: '签约前隐藏信息——坏车把好车赶出市场' },
      { k: '道德风险', v: '签约后隐藏行为——投保之后放松警惕' },
      { k: '解法', v: '第三方检测 · 认证 · 声誉记录' }
    ],
    eg: '柠檬市场：买家只愿按平均质量出价 → 好车陆续退出 → 最后只剩「柠檬」。'
  },

  // ================= 板书型：黑板 / 白板 =================

  'rhetoric/argument-structure': {
    mode: 'board', tone: 'chalk',
    title: '论证结构', sub: 'ARGUMENT STRUCTURE',
    expr: '前提 ＋ 推理规则 → 结论',
    lines: [
      { k: '演绎', v: '前提为真则结论必真（保真性）' },
      { k: '归纳', v: '前提使结论更可能（概率提升）' },
      { k: '回溯', v: '从结果出发，找最可能的解释' },
      { k: '类比', v: '由相似关系推出结论' }
    ],
    eg: '所有人会死，苏格拉底是人，所以苏格拉底会死——前提为真，结论不可能为假。',
    end: '理由链 A←B←C：整条链的强度，取决于最弱的那一环'
  },

  'philosophy/first-principles': {
    mode: 'board', tone: 'ink',
    title: '第一性原理', sub: 'FIRST PRINCIPLES',
    expr: '拆到不可再分的基本真理，再从那里重新往上推',
    flow: ['识别假设', '剥离归约', '从基础重建', '路径设计'],
    lines: [
      { k: '绝对约束', v: '热力学定律、能量密度上限——推不翻' },
      { k: '约定约束', v: '行业惯例、历史价格——只是习惯' },
      { k: '关键一问', v: '这个前提是物理定律，还是仅仅大家都这么做？' }
    ],
    eg: '惯例价 600 美元/千瓦时 → 拆到钴、镍、铝、碳、聚合物的原料价约 80 → 特斯拉最终做到 100–150。',
    end: '类比只能把价格算回来，类比拆不掉的那部分才是真成本'
  },

  'systems-thinking/feedback-loops': {
    mode: 'board', tone: 'chalk',
    title: '反馈回路', sub: 'FEEDBACK LOOPS',
    expr: '输出回喂输入 → 闭合的环',
    lines: [
      { k: '增强回路 +', v: '自我强化：内容好 → 更多互动 → 算法多推 → 更多互动' },
      { k: '调节回路 −', v: '自我修正：体温升高 → 出汗散热 → 回到正常' },
      { k: '贫困陷阱', v: '穷 → 少投资 → 更穷，一圈比一圈紧' }
    ],
    end: '系统行为 = 若干回路角力的结果；先找最容易被切断的那一环'
  }
};

const DEFAULT_BOARD_AREA = { x: 7, y: 5, w: 86, h: 64 };   // 板面：图中上部
const DEFAULT_CARD_AREA = { x: 6, y: 66, w: 88, h: 31 };   // 图说卡：画面下方一横条

export function getTopicBoard(subjectId, topicId) {
  const b = TOPIC_BOARDS[`${subjectId}/${topicId}`];
  if (!b) return null;
  const mode = b.mode || 'board';
  return {
    mode,
    tone: b.tone || (mode === 'scene' ? 'card' : 'chalk'),
    area: b.area || (mode === 'scene' ? DEFAULT_CARD_AREA : DEFAULT_BOARD_AREA),
    ...b
  };
}
