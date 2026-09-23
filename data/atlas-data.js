// ============================================================
// MIND ATLAS — 中文知识树
// 领域 → 模块 → 知识点；扁平 topics 供 3D 书籍世界使用
// 本文件由 build_atlas_data.py 生成
// ============================================================

// --- 3D 位置生成器（带深度变化的斐波那契球） ---
function _pos(angle, dist, height, zOffset = 0) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * dist,
    y: height,
    z: Math.sin(rad) * dist + zOffset
  };
}

export const SUBJECTS = [
  {
    id: 'logic',
    title: '逻辑与批判性思维',
    shortTitle: '逻辑',
    tagline: '有效推理的建筑学',
    description: '支撑所有论证的骨架——结论是如何从前提里生长出来的。',
    intro: '这门课训练的是"判断一个说法是否站得住"的能力。你学会把一段话拆成前提与结论，看清推理用的是演绎、归纳还是溯因；分辨必要条件与充分条件；知道因果不能靠巧合推断；能用反例击穿一个声称，也能对一个声称提出可证伪的检验。最终你获得的不是抬杠技巧，而是一套能保护自己、也能诚实修正自己的思维纪律。',
    visualTheme: 'geometry',
    bookStyle: { cover: 0x6b6b70, spine: 0x4a4a50, page: 0xe8e3d8, accent: 0xb8a888, sheen: 0.3 },
    position: _pos(18, 30, 6, 5),
    float: { amp: 0.35, speed: 0.4, phase: 0.0, rotAmp: 0.02, rotSpeed: 0.15 },
    micro: 'geometric',
    moduleCount: 4,
    modules: [
      { id: 'logic-m1', title: '推理的基本形式', summary: '五种推理方式决定了五种不同的可信度边界', topics: [
        { id: 'logic-basics', title: '逻辑', level: 1, type: 'concept' },
        { id: 'deductive', title: '演绎推理', level: 1, type: 'concept' },
        { id: 'inductive', title: '归纳推理', level: 1, type: 'concept' },
        { id: 'abductive', title: '溯因推理', level: 2, type: 'concept' },
        { id: 'analogical', title: '类比推理', level: 2, type: 'concept' }
      ] },
      { id: 'logic-m2', title: '论证的结构', summary: '一句话背后有一整套承重结构', topics: [
        { id: 'argument', title: '论证', level: 1, type: 'concept' },
        { id: 'premise-conclusion', title: '前提与结论', level: 1, type: 'concept' },
        { id: 'necessary-sufficient', title: '必要条件与充分条件', level: 2, type: 'concept' },
        { id: 'hidden-assumption', title: '隐藏假设', level: 2, type: 'concept' }
      ] },
      { id: 'logic-m3', title: '因果与证据', summary: '从"看起来相关"到"确实是它"之间的巨大鸿沟', topics: [
        { id: 'causal-reasoning', title: '因果推理', level: 2, type: 'concept' },
        { id: 'correlation-causation', title: '相关与因果', level: 2, type: 'concept' },
        { id: 'evidence', title: '证据', level: 2, type: 'concept' },
        { id: 'counterexample', title: '反例', level: 2, type: 'method' },
        { id: 'falsification', title: '证伪', level: 3, type: 'method' }
      ] },
      { id: 'logic-m4', title: '谬误与思维纪律', summary: '知道自己会怎么错，比知道自己会对更重要', topics: [
        { id: 'fallacies', title: '逻辑谬误', level: 2, type: 'case' },
        { id: 'critical-thinking', title: '批判性思维', level: 2, type: 'method' },
        { id: 'epistemic-humility', title: '认识论谦逊', level: 3, type: 'concept' }
      ] }
    ],
    connections: ['philosophy', 'rhetoric', 'problem-solving', 'information']
  },
  {
    id: 'philosophy',
    title: '哲学与第一性原理',
    shortTitle: '哲学',
    tagline: '向假设之下再挖一层',
    description: '最深的那些问题——什么是真实，什么算知道，什么是好。',
    intro: '哲学在这里不是知识史，而是一种把概念用到精确的工具。你会练习概念分析、使用思想实验、把争论还原成分歧的真正位置；也会接触第一性原理这种"拆到不能再拆"的思考方式，以及三种伦理框架如何给出互相冲突却不互相抵消的答案。目标不是选边站队，而是学会在无法达成共识的地方仍然清晰地思考。',
    visualTheme: 'manuscript',
    bookStyle: { cover: 0x5a2a2a, spine: 0x3d1a1a, page: 0xe8dcc8, accent: 0xc9a84c, sheen: 0.4 },
    position: _pos(90, 38, 10, -8),
    float: { amp: 0.45, speed: 0.25, phase: 1.2, rotAmp: 0.015, rotSpeed: 0.1 },
    micro: 'manuscript',
    moduleCount: 4,
    modules: [
      { id: 'philosophy-m1', title: '回到根本', summary: '在答案之前，先把问题问清楚', topics: [
        { id: 'first-principles', title: '第一性原理', level: 1, type: 'method' },
        { id: 'socratic-questioning', title: '苏格拉底式提问', level: 1, type: 'method' },
        { id: 'conceptual-analysis', title: '概念分析', level: 2, type: 'method' },
        { id: 'thought-experiments', title: '思想实验', level: 2, type: 'method' }
      ] },
      { id: 'philosophy-m2', title: '知识与真理', summary: '什么算知道，什么算正确', topics: [
        { id: 'epistemology', title: '认识论', level: 2, type: 'concept' },
        { id: 'knowledge', title: '知识', level: 2, type: 'concept' },
        { id: 'truth', title: '真理', level: 2, type: 'concept' },
        { id: 'meaning', title: '意义', level: 3, type: 'concept' }
      ] },
      { id: 'philosophy-m3', title: '实在与人', summary: '世界是什么，我们是谁', topics: [
        { id: 'metaphysics', title: '形而上学', level: 2, type: 'concept' },
        { id: 'free-will', title: '自由意志', level: 3, type: 'concept' },
        { id: 'personal-identity', title: '个人同一性', level: 3, type: 'concept' }
      ] },
      { id: 'philosophy-m4', title: '价值与伦理', summary: '当"应该"出现时，我们在说什么', topics: [
        { id: 'ethics', title: '伦理学', level: 2, type: 'concept' },
        { id: 'moral-philosophy', title: '道德哲学', level: 2, type: 'concept' },
        { id: 'utilitarianism', title: '功利主义', level: 2, type: 'concept' },
        { id: 'deontology', title: '义务论', level: 2, type: 'concept' },
        { id: 'virtue-ethics', title: '德性伦理', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['logic', 'great-minds', 'cognitive-science', 'rhetoric']
  },
  {
    id: 'cognitive-science',
    title: '认知科学',
    shortTitle: '认知科学',
    tagline: '心智如何处理现实',
    description: '关于心智、智能与信息处理的跨学科研究。',
    intro: '这门课回答"你的大脑是怎么把混沌的信息变成判断的"。你会发现注意力是一条窄门、工作记忆只有几个槽位、而非语言所描述的"一个容器"；你会理解预测编码如何让你看到的大部分是"大脑猜的"，以及专家和新手真正的差别在心理表征而不在记忆力。理解机器，先理解这台机器是被怎样设计出来的。',
    visualTheme: 'neural',
    bookStyle: { cover: 0x2a4a5a, spine: 0x1a3a4a, page: 0xe0e8e5, accent: 0x7ab8b0, sheen: 0.35 },
    position: _pos(160, 32, -4, 12),
    float: { amp: 0.3, speed: 0.35, phase: 2.5, rotAmp: 0.025, rotSpeed: 0.18 },
    micro: 'neural',
    moduleCount: 4,
    modules: [
      { id: 'cognitive-science-m1', title: '信息如何进入心智', summary: '注意力和记忆是稀缺资源，不是能力问题', topics: [
        { id: 'attention', title: '注意力', level: 1, type: 'concept' },
        { id: 'working-memory', title: '工作记忆', level: 1, type: 'concept' },
        { id: 'cognitive-load', title: '认知负荷', level: 2, type: 'concept' },
        { id: 'long-term-memory', title: '长期记忆', level: 2, type: 'concept' }
      ] },
      { id: 'cognitive-science-m2', title: '心智如何组织世界', summary: '我们看到的从来不是原始数据', topics: [
        { id: 'mental-representation', title: '心理表征', level: 2, type: 'concept' },
        { id: 'pattern-recognition-cs', title: '模式识别', level: 2, type: 'concept' },
        { id: 'mental-models', title: '心智模型', level: 2, type: 'concept' },
        { id: 'language-thought', title: '语言与思维', level: 3, type: 'concept' }
      ] },
      { id: 'cognitive-science-m3', title: '心智如何行动', summary: '判断是如何被生产出来的', topics: [
        { id: 'prediction', title: '预测', level: 2, type: 'concept' },
        { id: 'decision-making', title: '决策', level: 2, type: 'concept' },
        { id: 'problem-solving-cs', title: '问题解决', level: 2, type: 'concept' },
        { id: 'cognitive-control', title: '认知控制', level: 3, type: 'concept' }
      ] },
      { id: 'cognitive-science-m4', title: '边界与扩展', summary: '知道极限在哪，才知道该怎么用', topics: [
        { id: 'consciousness', title: '意识', level: 3, type: 'concept' },
        { id: 'human-ai-cognition', title: '人机认知', level: 3, type: 'concept' },
        { id: 'learning-cs', title: '学习', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['cognitive-biases', 'learning', 'philosophy', 'human-behavior']
  },
  {
    id: 'cognitive-biases',
    title: '认知偏差与决策',
    shortTitle: '认知偏差',
    tagline: '人类判断中可预测的错误',
    description: '心智的捷径如何导致对理性的系统性偏离。',
    intro: '偏差不是"别人的毛病"，而是认知系统在有限算力下的默认配置。这门课逐一拆解最常被现实利用的那些偏差：锚定、可得性、代表性、确认偏误、损失厌恶、沉没成本……每个都配一个你可以立刻做的实验，让你亲眼看到自己如何在知道规则的前提下依然掉进同一个坑。知道名字没用，能识别出触发条件才有。',
    visualTheme: 'pathways',
    bookStyle: { cover: 0x7a5a2a, spine: 0x5a3a1a, page: 0xe8ddc8, accent: 0xc9a04c, sheen: 0.3 },
    position: _pos(220, 28, 8, -5),
    float: { amp: 0.4, speed: 0.45, phase: 3.8, rotAmp: 0.02, rotSpeed: 0.12 },
    micro: 'pathways',
    moduleCount: 5,
    modules: [
      { id: 'cognitive-biases-m1', title: '启发式捷径', summary: '大脑用"够用就行"换速度', topics: [
        { id: 'anchoring', title: '锚定效应', level: 1, type: 'concept' },
        { id: 'availability', title: '可得性启发', level: 1, type: 'concept' },
        { id: 'representativeness', title: '代表性启发', level: 2, type: 'concept' },
        { id: 'recency-bias', title: '近因偏差', level: 2, type: 'concept' },
        { id: 'status-quo-bias', title: '现状偏见', level: 2, type: 'concept' }
      ] },
      { id: 'cognitive-biases-m2', title: '信念如何自我加固', summary: '我们不是在寻找真相，而是在维护一致性', topics: [
        { id: 'confirmation-bias', title: '确认偏误', level: 1, type: 'concept' },
        { id: 'hindsight-bias', title: '事后偏见', level: 2, type: 'concept' },
        { id: 'outcome-bias', title: '结果偏见', level: 2, type: 'concept' },
        { id: 'overconfidence', title: '过度自信', level: 2, type: 'concept' },
        { id: 'dunning-kruger', title: '达克效应', level: 2, type: 'concept' }
      ] },
      { id: 'cognitive-biases-m3', title: '价值与损失', summary: '同一件事，换个说法就不是一个决定', topics: [
        { id: 'loss-aversion', title: '损失厌恶', level: 1, type: 'concept' },
        { id: 'sunk-cost', title: '沉没成本', level: 1, type: 'concept' },
        { id: 'framing-effect', title: '框架效应', level: 2, type: 'concept' },
        { id: 'choice-overload', title: '选择过载', level: 2, type: 'concept' }
      ] },
      { id: 'cognitive-biases-m4', title: '概率直觉的失败', summary: '幸运感、规律感，都是错觉的重灾区', topics: [
        { id: 'gamblers-fallacy', title: '赌徒谬误', level: 2, type: 'concept' },
        { id: 'base-rate-neglect', title: '基础概率忽视', level: 3, type: 'concept' },
        { id: 'planning-fallacy', title: '计划谬误', level: 2, type: 'concept' }
      ] },
      { id: 'cognitive-biases-m5', title: '整合', summary: '把所有偏差放回一个真实决策里看', topics: [
        { id: 'decision-under-uncertainty', title: '不确定性下的决策', level: 3, type: 'method' }
      ] }
    ],
    connections: ['behavioral-economics', 'game-theory', 'cognitive-science', 'probability']
  },
  {
    id: 'social-psychology',
    title: '社会心理学',
    shortTitle: '社会心理',
    tagline: '他人如何塑造我们',
    description: '个体在社会情境中如何思考、感受与行动。',
    intro: '这门课研究的是"情境的力量"。你会看到普通人如何在特定结构下做出残忍或高尚的行为——阿希的从众、米尔格拉姆的服从、旁观者效应、斯坦福监狱式的角色内化。重点不在于人性本恶，而在于：行为是人与情境的函数，改变结构往往比劝说个人更有效。理解这一点，你才会真正重视制度设计。',
    visualTheme: 'network',
    bookStyle: { cover: 0x4a5a3a, spine: 0x3a4a2a, page: 0xe8e8d8, accent: 0x8ab070, sheen: 0.3 },
    position: _pos(300, 35, -6, 8),
    float: { amp: 0.38, speed: 0.3, phase: 5.0, rotAmp: 0.018, rotSpeed: 0.14 },
    micro: 'network',
    moduleCount: 5,
    modules: [
      { id: 'social-psychology-m1', title: '社会影响的基础', summary: '没有人是一座孤岛，尤其在他人的注视下', topics: [
        { id: 'social-influence', title: '社会影响', level: 1, type: 'concept' },
        { id: 'conformity', title: '从众', level: 1, type: 'concept' },
        { id: 'authority', title: '权威', level: 2, type: 'concept' },
        { id: 'social-norms', title: '社会规范', level: 2, type: 'concept' }
      ] },
      { id: 'social-psychology-m2', title: '自我与他人', summary: '自我概念是在社会镜子里长出来的', topics: [
        { id: 'self-concept', title: '自我概念', level: 2, type: 'concept' },
        { id: 'social-comparison', title: '社会比较', level: 2, type: 'concept' },
        { id: 'impression-management', title: '印象管理', level: 2, type: 'concept' },
        { id: 'identity-sp', title: '身份', level: 2, type: 'concept' },
        { id: 'status', title: '地位', level: 2, type: 'concept' }
      ] },
      { id: 'social-psychology-m3', title: '群体如何运作', summary: '群体不是个体的总和', topics: [
        { id: 'group-dynamics', title: '群体动力', level: 2, type: 'concept' },
        { id: 'groupthink', title: '群体思维', level: 2, type: 'concept' },
        { id: 'group-polarization', title: '群体极化', level: 2, type: 'concept' },
        { id: 'in-out-group', title: '内群体与外群体', level: 3, type: 'concept' }
      ] },
      { id: 'social-psychology-m4', title: '人与人之间', summary: '吸引、归因、信任与冲突的机制', topics: [
        { id: 'interpersonal-attraction', title: '人际吸引', level: 2, type: 'concept' },
        { id: 'attribution', title: '归因', level: 2, type: 'concept' },
        { id: 'trust-sp', title: '信任', level: 2, type: 'concept' },
        { id: 'cooperation-sp', title: '合作', level: 2, type: 'concept' },
        { id: 'conflict-sp', title: '冲突', level: 2, type: 'concept' }
      ] },
      { id: 'social-psychology-m5', title: '情境的力量', summary: '好人为什么会袖手旁观', topics: [
        { id: 'bystander-effect', title: '旁观者效应', level: 2, type: 'case' }
      ] }
    ],
    connections: ['human-behavior', 'negotiation', 'politics', 'cognitive-biases']
  },
  {
    id: 'human-behavior',
    title: '人类行为',
    shortTitle: '人类行为',
    tagline: '人为什么会这样做',
    description: '需求、激励、情绪、身份、信任与权力作为行为驱动器。',
    intro: '这句"大家都想要什么"背后的答案并不统一。这门课把人类行为的驱动源拆成可辨识的清单：需求层次、激励结构、恐惧、归属感、安全感、自主性、控制感、自尊、互惠、稀缺、社会认可、地位与权力。你会学会在看到一个反常行为时，先问"它满足了什么需求、满足了谁的激励"，而不是先给道德评价。这是理解他人最实用的一层。',
    visualTheme: 'silhouette',
    bookStyle: { cover: 0x6a5a4a, spine: 0x4a3a2a, page: 0xe8e0d0, accent: 0xb89870, sheen: 0.35 },
    position: _pos(340, 26, 4, -10),
    float: { amp: 0.32, speed: 0.38, phase: 6.5, rotAmp: 0.022, rotSpeed: 0.16 },
    micro: 'silhouette',
    moduleCount: 4,
    modules: [
      { id: 'human-behavior-m1', title: '行为的驱动力', summary: '看见行为，先找它的动力源', topics: [
        { id: 'motivation', title: '动机', level: 1, type: 'concept' },
        { id: 'needs', title: '需求', level: 1, type: 'concept' },
        { id: 'incentives-hb', title: '激励', level: 1, type: 'concept' },
        { id: 'scarcity', title: '稀缺', level: 2, type: 'concept' }
      ] },
      { id: 'human-behavior-m2', title: '自我与社会需求', summary: '那些看不见的东西，往往最强烈地驱动行为', topics: [
        { id: 'belonging', title: '归属', level: 1, type: 'concept' },
        { id: 'security', title: '安全感', level: 2, type: 'concept' },
        { id: 'autonomy', title: '自主性', level: 2, type: 'concept' },
        { id: 'sense-of-control', title: '控制感', level: 2, type: 'concept' },
        { id: 'self-esteem', title: '自尊', level: 2, type: 'concept' },
        { id: 'social-approval', title: '社会认可', level: 2, type: 'concept' },
        { id: 'identity-hb', title: '身份', level: 2, type: 'concept' }
      ] },
      { id: 'human-behavior-m3', title: '人际动力学', summary: '交换、比较与排序', topics: [
        { id: 'reciprocity', title: '互惠', level: 1, type: 'concept' },
        { id: 'trust-hb', title: '信任', level: 2, type: 'concept' },
        { id: 'competition', title: '竞争', level: 2, type: 'concept' },
        { id: 'cooperation-hb', title: '合作', level: 2, type: 'concept' },
        { id: 'power-hb', title: '权力', level: 2, type: 'concept' },
        { id: 'status-hb', title: '地位', level: 2, type: 'concept' }
      ] },
      { id: 'human-behavior-m4', title: '情绪与模式', summary: '情绪是行为的调度员，不是噪音', topics: [
        { id: 'fear', title: '恐惧', level: 2, type: 'concept' },
        { id: 'emotion-behavior', title: '情绪与行为', level: 2, type: 'concept' },
        { id: 'behavior-patterns', title: '行为模式', level: 3, type: 'concept' }
      ] }
    ],
    connections: ['social-psychology', 'behavioral-economics', 'negotiation', 'cognitive-science']
  },
  {
    id: 'behavioral-economics',
    title: '行为经济学',
    shortTitle: '行为经济',
    tagline: '当经济学遇上真实的人类',
    description: '真实的人如何偏离"理性经济人"这个模型。',
    intro: '传统经济学假设人是会算账的；行为经济学则把人放回血肉里研究。你会学到前景理论如何用一条S形曲线解释为什么人们在赢的时候保守、输的时候冒险；参考点如何决定"这是赚还是赔"；心理账户如何让同样一百元的价值不同；以及默认选项这种几乎不被人察觉的设计如何大规模改变结果（器官捐献率的国别差异是最有名的一例）。这门课是"选择如何被设计"的说明书。',
    visualTheme: 'exchange',
    bookStyle: { cover: 0x7a4a2a, spine: 0x5a2a1a, page: 0xe8d8c0, accent: 0xc9904c, sheen: 0.4 },
    position: _pos(20, 40, -8, 15),
    float: { amp: 0.42, speed: 0.32, phase: 7.8, rotAmp: 0.016, rotSpeed: 0.11 },
    micro: 'exchange',
    moduleCount: 4,
    modules: [
      { id: 'behavioral-economics-m1', title: '从理性到有限理性', summary: '人不是不会算，是用另一种方式在算', topics: [
        { id: 'bounded-rationality', title: '有限理性', level: 2, type: 'concept' },
        { id: 'prospect-theory', title: '前景理论', level: 2, type: 'concept' },
        { id: 'reference-point', title: '参考点', level: 2, type: 'concept' },
        { id: 'loss-aversion-be', title: '损失厌恶', level: 2, type: 'concept' }
      ] },
      { id: 'behavioral-economics-m2', title: '心理记账', summary: '钱包在脑子里，被分成了好几个格子', topics: [
        { id: 'mental-accounting', title: '心理账户', level: 2, type: 'concept' },
        { id: 'endowment-effect', title: '禀赋效应', level: 2, type: 'concept' },
        { id: 'time-preference', title: '时间偏好', level: 2, type: 'concept' },
        { id: 'present-bias', title: '当下偏好', level: 2, type: 'concept' }
      ] },
      { id: 'behavioral-economics-m3', title: '环境如何左右选择', summary: '不提供选项的人，往往决定了答案', topics: [
        { id: 'default-effect', title: '默认选项', level: 2, type: 'concept' },
        { id: 'choice-architecture', title: '选择架构', level: 2, type: 'method' },
        { id: 'nudge', title: '助推', level: 2, type: 'method' },
        { id: 'incentives-be', title: '激励', level: 1, type: 'concept' }
      ] },
      { id: 'behavioral-economics-m4', title: '社会偏好与市场', summary: '人不只为自己打算，也不只利他', topics: [
        { id: 'fairness', title: '公平', level: 2, type: 'concept' },
        { id: 'reciprocity-be', title: '互惠', level: 2, type: 'concept' },
        { id: 'risk-preference', title: '风险偏好', level: 3, type: 'concept' },
        { id: 'behavioral-market', title: '行为市场', level: 3, type: 'concept' }
      ] }
    ],
    connections: ['economics', 'cognitive-biases', 'game-theory', 'human-behavior']
  },
  {
    id: 'game-theory',
    title: '博弈论',
    shortTitle: '博弈论',
    tagline: '策略世界中的决策',
    description: '策略互动的数学——你的最优选择取决于别人的选择。',
    intro: '这门课是本星图里最"硬"的一门工具课。你会从收益矩阵开始，理解什么叫占优策略、什么叫纳什均衡；亲手推演囚徒困境为什么让理性人一起变糟，以及重复博弈如何把合作从不可能变成可能；理解信号与承诺为什么必须"花真钱"才可信。最关键的一课是：均衡不等于满意，稳定不等于最优——这条区分会改变你看待几乎所有竞争局面的方式。',
    visualTheme: 'strategy',
    bookStyle: { cover: 0x2a4a2a, spine: 0x1a3a1a, page: 0xe0e8d8, accent: 0x8ac070, sheen: 0.25 },
    position: _pos(55, 42, 2, -15),
    float: { amp: 0.36, speed: 0.28, phase: 9.0, rotAmp: 0.02, rotSpeed: 0.13 },
    micro: 'strategy',
    moduleCount: 5,
    modules: [
      { id: 'game-theory-m1', title: '博弈的构件', summary: '先把局面写成一张表', topics: [
        { id: 'players', title: '参与者', level: 1, type: 'concept' },
        { id: 'strategies', title: '策略', level: 1, type: 'concept' },
        { id: 'payoffs', title: '收益', level: 1, type: 'concept' },
        { id: 'information-gt', title: '信息', level: 2, type: 'concept' },
        { id: 'zero-sum', title: '零和博弈', level: 2, type: 'concept' },
        { id: 'non-zero-sum', title: '非零和博弈', level: 2, type: 'concept' }
      ] },
      { id: 'game-theory-m2', title: '求解博弈', summary: '稳定在哪里，答案就在哪里', topics: [
        { id: 'dominant-strategy', title: '占优策略', level: 2, type: 'concept' },
        { id: 'mixed-strategy', title: '混合策略', level: 3, type: 'concept' },
        { id: 'nash-equilibrium', title: '纳什均衡', level: 2, type: 'concept' }
      ] },
      { id: 'game-theory-m3', title: '经典模型', summary: '四个模型解释了大部分现实冲突', topics: [
        { id: 'prisoners-dilemma', title: '囚徒困境', level: 1, type: 'case' },
        { id: 'repeated-games', title: '重复博弈', level: 2, type: 'case' },
        { id: 'coordination-games', title: '协调博弈', level: 2, type: 'case' },
        { id: 'public-goods-game', title: '公共品博弈', level: 3, type: 'case' },
        { id: 'tragedy-of-commons', title: '公地悲剧', level: 2, type: 'case' }
      ] },
      { id: 'game-theory-m4', title: '信息与承诺', summary: '说狠话没用，要让人相信', topics: [
        { id: 'signaling', title: '信号', level: 2, type: 'concept' },
        { id: 'information-asymmetry', title: '信息不对称', level: 2, type: 'concept' },
        { id: 'commitment', title: '承诺', level: 2, type: 'concept' },
        { id: 'credible-threat', title: '可信威胁', level: 3, type: 'concept' }
      ] },
      { id: 'game-theory-m5', title: '结果', summary: '竞争、合作与分账', topics: [
        { id: 'cooperation-gt', title: '合作', level: 2, type: 'concept' },
        { id: 'competition-gt', title: '竞争', level: 2, type: 'concept' },
        { id: 'bargaining-game', title: '讨价还价博弈', level: 3, type: 'case' }
      ] }
    ],
    connections: ['economics', 'strategic-thinking', 'negotiation', 'politics', 'behavioral-economics']
  },
  {
    id: 'negotiation',
    title: '谈判与沟通',
    shortTitle: '谈判',
    tagline: '在冲突中找到共识',
    description: '达成交易的艺术与科学——利益、立场，以及两者之间的空间。',
    intro: '谈判不是"说服术"，而是关于结构的一门课。你会掌握四个核心坐标：利益与立场的区别、BATNA（最佳替代方案）、保留价值、ZOPA（协议可能区间）——离开这四个词，任何谈判讨论都是空谈。然后才是信息策略、提问、倾听、让步节奏与多方联盟。这门课的立场很明确：好的谈判是让双方各自拿到更少冲突的更好结果，而不是让对方吃亏。',
    visualTheme: 'dialogue',
    bookStyle: { cover: 0x3a4a6a, spine: 0x2a3a5a, page: 0xe0e8f0, accent: 0x7a98c0, sheen: 0.3 },
    position: _pos(110, 24, 12, -20),
    float: { amp: 0.34, speed: 0.42, phase: 10.5, rotAmp: 0.024, rotSpeed: 0.17 },
    micro: 'dialogue',
    moduleCount: 4,
    modules: [
      { id: 'negotiation-m1', title: '谈判的结构', summary: '不上桌就先算清楚：我谈什么、底线在哪', topics: [
        { id: 'interests-vs-positions', title: '利益与立场', level: 1, type: 'concept' },
        { id: 'batna', title: '最佳替代方案', level: 1, type: 'method' },
        { id: 'reservation-value', title: '保留价值', level: 2, type: 'concept' },
        { id: 'zopa', title: '协议可能区间', level: 2, type: 'concept' }
      ] },
      { id: 'negotiation-m2', title: '信息与力量', summary: '信息不对称是谈判的主要战场', topics: [
        { id: 'information-advantage', title: '信息优势', level: 2, type: 'concept' },
        { id: 'anchoring-neg', title: '锚定', level: 1, type: 'method' },
        { id: 'questioning', title: '提问', level: 2, type: 'method' },
        { id: 'active-listening', title: '积极倾听', level: 2, type: 'method' }
      ] },
      { id: 'negotiation-m3', title: '过程技术', summary: '让步本身就是一种语言', topics: [
        { id: 'framing-neg', title: '框架', level: 2, type: 'method' },
        { id: 'concessions', title: '让步', level: 2, type: 'method' },
        { id: 'tradeoffs', title: '权衡', level: 2, type: 'method' },
        { id: 'commitment-neg', title: '承诺', level: 2, type: 'concept' }
      ] },
      { id: 'negotiation-m4', title: '复杂情境', summary: '当桌上不止两个人', topics: [
        { id: 'persuasion', title: '说服', level: 2, type: 'method' },
        { id: 'conflict-resolution', title: '冲突解决', level: 2, type: 'method' },
        { id: 'multiparty-negotiation', title: '多方谈判', level: 3, type: 'case' },
        { id: 'strategic-communication', title: '战略沟通', level: 3, type: 'method' }
      ] }
    ],
    connections: ['game-theory', 'rhetoric', 'social-psychology', 'human-behavior']
  },
  {
    id: 'economics',
    title: '经济学',
    shortTitle: '经济学',
    tagline: '稀缺资源如何被分配',
    description: '生产、分配与消费——市场、价格与贸易。',
    intro: '经济学入门真正重要的只有几件事：稀缺、机会成本、边际思维、激励。这门课用这四个地基，重建你对价格、竞争、垄断、外部性、公共品、分工与贸易的理解。你会明白价格不是"老板定的"而是信息的聚合，懂得为什么"做这件事的成本"永远是"没做另一件事"，也能看清哪些政策在解决问题、哪些只是在转移它。',
    visualTheme: 'market',
    bookStyle: { cover: 0x5a4a1a, spine: 0x3a2a0a, page: 0xe8e0c8, accent: 0xc9b04c, sheen: 0.45 },
    position: _pos(155, 44, -10, -5),
    float: { amp: 0.4, speed: 0.22, phase: 12.0, rotAmp: 0.014, rotSpeed: 0.09 },
    micro: 'market',
    moduleCount: 4,
    modules: [
      { id: 'economics-m1', title: '经济学的地基', summary: '四个概念撑起整个学科', topics: [
        { id: 'scarcity-econ', title: '稀缺', level: 1, type: 'concept' },
        { id: 'opportunity-cost-econ', title: '机会成本', level: 1, type: 'concept' },
        { id: 'marginal-thinking', title: '边际思维', level: 2, type: 'concept' },
        { id: 'incentives-econ', title: '激励', level: 1, type: 'concept' }
      ] },
      { id: 'economics-m2', title: '市场如何运转', summary: '价格是一台巨大的信息机器', topics: [
        { id: 'market', title: '市场', level: 1, type: 'concept' },
        { id: 'supply-demand', title: '供给与需求', level: 1, type: 'concept' },
        { id: 'price', title: '价格', level: 1, type: 'concept' },
        { id: 'competition-econ', title: '竞争', level: 2, type: 'concept' },
        { id: 'monopoly', title: '垄断', level: 2, type: 'concept' }
      ] },
      { id: 'economics-m3', title: '市场失灵', summary: '当价格不再说真话', topics: [
        { id: 'externality', title: '外部性', level: 2, type: 'concept' },
        { id: 'public-goods', title: '公共品', level: 2, type: 'concept' },
        { id: 'information-econ', title: '信息', level: 2, type: 'concept' }
      ] },
      { id: 'economics-m4', title: '增长与秩序', summary: '财富从哪里来，如何被分配', topics: [
        { id: 'division-of-labor', title: '分工', level: 2, type: 'concept' },
        { id: 'trade', title: '贸易', level: 2, type: 'concept' },
        { id: 'productivity', title: '生产率', level: 2, type: 'concept' },
        { id: 'wealth-creation', title: '财富创造', level: 3, type: 'concept' },
        { id: 'inequality', title: '不平等', level: 3, type: 'concept' },
        { id: 'institutions-econ', title: '制度', level: 3, type: 'concept' }
      ] }
    ],
    connections: ['game-theory', 'behavioral-economics', 'politics', 'probability']
  },
  {
    id: 'politics',
    title: '政治、权力与社会',
    shortTitle: '政治权力',
    tagline: '权力如何被结构化与行使',
    description: '制度、权威、集体行动与公共利益。',
    intro: '这门课把政治从立场之争里拉出来，当作一门关于"权力如何组织"的技术来读。你会分析权力的三种来源、合法性的作用、制度如何塑造激励、为什么集体行动总是困难（搭便车与集体困境）、利益集团为何能以小博大。读完之后，你看待任何组织规章的方式都会改变：它首先是一套激励装置。',
    visualTheme: 'institution',
    bookStyle: { cover: 0x4a2a2a, spine: 0x2a1a1a, page: 0xe8d8d0, accent: 0xb08868, sheen: 0.35 },
    position: _pos(195, 36, 7, 18),
    float: { amp: 0.38, speed: 0.26, phase: 13.5, rotAmp: 0.016, rotSpeed: 0.1 },
    micro: 'institution',
    moduleCount: 4,
    modules: [
      { id: 'politics-m1', title: '权力的形态', summary: '权力不等于暴力，也不等于职位', topics: [
        { id: 'power-pl', title: '权力', level: 1, type: 'concept' },
        { id: 'authority-pl', title: '权威', level: 2, type: 'concept' },
        { id: 'legitimacy', title: '合法性', level: 2, type: 'concept' },
        { id: 'organizational-power', title: '组织权力', level: 2, type: 'concept' }
      ] },
      { id: 'politics-m2', title: '制度与规则', summary: '制度是凝固的激励', topics: [
        { id: 'institutions-pl', title: '制度', level: 2, type: 'concept' },
        { id: 'social-contract', title: '社会契约', level: 2, type: 'concept' },
        { id: 'political-systems', title: '政治制度', level: 3, type: 'concept' },
        { id: 'bureaucracy', title: '官僚制', level: 3, type: 'concept' }
      ] },
      { id: 'politics-m3', title: '集体如何行动', summary: '为什么"大家都想要"的事反而没人做', topics: [
        { id: 'collective-action', title: '集体行动', level: 2, type: 'concept' },
        { id: 'public-choice', title: '公共选择', level: 3, type: 'concept' },
        { id: 'interest-groups', title: '利益集团', level: 2, type: 'concept' },
        { id: 'collective-dilemma', title: '集体困境', level: 2, type: 'concept' },
        { id: 'public-goods-pl', title: '公共品', level: 2, type: 'concept' }
      ] },
      { id: 'politics-m4', title: '社会结构', summary: '位置决定了你看见什么', topics: [
        { id: 'social-structure', title: '社会结构', level: 3, type: 'concept' },
        { id: 'information-and-power', title: '信息与权力', level: 3, type: 'concept' },
        { id: 'incentives-pl', title: '激励', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['game-theory', 'economics', 'social-psychology', 'strategic-thinking']
  },
  {
    id: 'strategic-thinking',
    title: '战略思维',
    shortTitle: '战略思维',
    tagline: '提前几步思考',
    description: '决策树、机会成本、瓶颈、杠杆与二阶效应。',
    intro: '战术是"怎么把这步走好"，战略是"这是不是该走的一步"。这门课训练的资源配置、机会成本、二阶效应、瓶颈识别、杠杆点、情景规划，是一套在系统里做决策的方法。核心习惯只有一句：任何一个选择，都要问"然后呢？然后呢？"——多数灾难都发生在第三层，多数优势也都藏在第三层。',
    visualTheme: 'cartography',
    bookStyle: { cover: 0x6a5a3a, spine: 0x4a3a1a, page: 0xe8e0cc, accent: 0xb8a068, sheen: 0.4 },
    position: _pos(250, 38, -2, -12),
    float: { amp: 0.36, speed: 0.24, phase: 15.0, rotAmp: 0.018, rotSpeed: 0.11 },
    micro: 'cartography',
    moduleCount: 4,
    modules: [
      { id: 'strategic-thinking-m1', title: '什么是战略', summary: '先定义清楚你在解决的是哪一层问题', topics: [
        { id: 'strategy-vs-tactics', title: '战略与战术', level: 1, type: 'concept' },
        { id: 'long-term-thinking', title: '长期思维', level: 2, type: 'concept' },
        { id: 'short-vs-long', title: '短期与长期', level: 2, type: 'concept' },
        { id: 'adversarial-thinking', title: '对抗性思维', level: 3, type: 'method' }
      ] },
      { id: 'strategic-thinking-m2', title: '资源与取舍', summary: '选择A的成本，永远是那个没被选中的B', topics: [
        { id: 'resource-allocation', title: '资源配置', level: 2, type: 'concept' },
        { id: 'opportunity-cost-st', title: '机会成本', level: 1, type: 'concept' },
        { id: 'prioritization', title: '优先级', level: 2, type: 'method' },
        { id: 'strategic-tradeoff', title: '战略权衡', level: 3, type: 'concept' }
      ] },
      { id: 'strategic-thinking-m3', title: '看到第二层', summary: '然后呢？然后呢？', topics: [
        { id: 'second-order-effects', title: '二阶效应', level: 2, type: 'concept' },
        { id: 'feedback-st', title: '反馈', level: 2, type: 'concept' },
        { id: 'path-dependence-st', title: '路径依赖', level: 3, type: 'concept' },
        { id: 'scenario-planning', title: '情景规划', level: 3, type: 'method' }
      ] },
      { id: 'strategic-thinking-m4', title: '决策与优势', summary: '在不确定性里找可靠的着力点', topics: [
        { id: 'decision-trees', title: '决策树', level: 2, type: 'method' },
        { id: 'risk-st', title: '风险', level: 2, type: 'concept' },
        { id: 'uncertainty-st', title: '不确定性', level: 2, type: 'concept' },
        { id: 'competitive-advantage', title: '竞争优势', level: 2, type: 'concept' },
        { id: 'bottleneck', title: '瓶颈', level: 2, type: 'concept' },
        { id: 'leverage-st', title: '杠杆', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['game-theory', 'systems-thinking', 'problem-solving', 'politics']
  },
  {
    id: 'systems-thinking',
    title: '系统思维',
    shortTitle: '系统思维',
    tagline: '看见整体，而不只是零件',
    description: '反馈回路、延迟、涌现，以及系统结构如何制造行为。',
    intro: '系统思维的核心命题是：结构决定行为。同一群人换一套规则，产出完全不同。这门课给你一套分析工具——节点、关系、反馈回路、延迟、非线性、涌现、临界点、库存与流量——让你在看到"某个现象反复出现"时，不再归咎于某个人，而是去找制造这个现象的那个结构。也会学会谨慎：系统里的介入常常帮你解决一个症状，然后在别处制造一个更麻烦的。',
    visualTheme: 'ecosystem',
    bookStyle: { cover: 0x2a3a6a, spine: 0x1a2a5a, page: 0xe0e0f0, accent: 0x6878c0, sheen: 0.3 },
    position: _pos(290, 30, 9, 20),
    float: { amp: 0.44, speed: 0.2, phase: 16.5, rotAmp: 0.012, rotSpeed: 0.08 },
    micro: 'ecosystem',
    moduleCount: 4,
    modules: [
      { id: 'systems-thinking-m1', title: '系统的构件', summary: '系统不是一堆东西，是一堆关系', topics: [
        { id: 'system', title: '系统', level: 1, type: 'concept' },
        { id: 'node', title: '节点', level: 1, type: 'concept' },
        { id: 'relationship', title: '关系', level: 1, type: 'concept' },
        { id: 'network-st', title: '网络', level: 2, type: 'concept' }
      ] },
      { id: 'systems-thinking-m2', title: '动力学', summary: '时间维度上的因果', topics: [
        { id: 'feedback-loop', title: '反馈回路', level: 1, type: 'concept' },
        { id: 'reinforcing-loop', title: '正反馈', level: 2, type: 'concept' },
        { id: 'balancing-loop', title: '负反馈', level: 2, type: 'concept' },
        { id: 'delay', title: '延迟', level: 2, type: 'concept' },
        { id: 'nonlinearity', title: '非线性', level: 3, type: 'concept' },
        { id: 'system-dynamics', title: '系统动力学', level: 3, type: 'method' }
      ] },
      { id: 'systems-thinking-m3', title: '整体行为', summary: '整体会做零件做不到的事', topics: [
        { id: 'emergence', title: '涌现', level: 2, type: 'concept' },
        { id: 'tipping-point', title: '临界点', level: 2, type: 'concept' },
        { id: 'network-effects-st', title: '网络效应', level: 2, type: 'concept' },
        { id: 'complex-systems', title: '复杂系统', level: 3, type: 'concept' },
        { id: 'path-dependence-sys', title: '路径依赖', level: 3, type: 'concept' }
      ] },
      { id: 'systems-thinking-m4', title: '介入的后果', summary: '好心办坏事的系统性原因', topics: [
        { id: 'unintended-consequences', title: '意外后果', level: 2, type: 'concept' },
        { id: 'local-vs-global-optimum', title: '局部优化与整体优化', level: 3, type: 'concept' }
      ] }
    ],
    connections: ['strategic-thinking', 'problem-solving', 'economics', 'cognitive-science']
  },
  {
    id: 'problem-solving',
    title: '问题解决',
    shortTitle: '问题解决',
    tagline: '从混乱到模型再到解法',
    description: '框定、拆解、假设、验证、迭代与收敛。',
    intro: '高手和新手解决问题最大的差别在"开始之前"：新手急着给方案，高手先花时间定义问题的边界和约束。这门课按真实流程组织——问题定义 → 拆解 → 根因定位 → 假设生成 → 实验检验 → 迭代收敛，并配逆向思考、反事实思考这些能打破思路惯性的工具。附带一整套关于"调试"的心法：卡住时不要更用力，要换一层去问。',
    visualTheme: 'framework',
    bookStyle: { cover: 0x4a4a5a, spine: 0x2a2a3a, page: 0xe8e8f0, accent: 0x9090b8, sheen: 0.25 },
    position: _pos(330, 33, -5, -25),
    float: { amp: 0.34, speed: 0.36, phase: 18.0, rotAmp: 0.02, rotSpeed: 0.15 },
    micro: 'framework',
    moduleCount: 4,
    modules: [
      { id: 'problem-solving-m1', title: '定义问题', summary: '问题描述错了，答案一定错', topics: [
        { id: 'problem-framing', title: '问题定义', level: 1, type: 'method' },
        { id: 'constraints', title: '约束', level: 2, type: 'concept' },
        { id: 'abstraction', title: '抽象', level: 2, type: 'method' },
        { id: 'first-principles-ps', title: '第一性原理', level: 2, type: 'method' }
      ] },
      { id: 'problem-solving-m2', title: '拆解与定位', summary: '缩小到能动手的那一块', topics: [
        { id: 'decomposition', title: '问题拆解', level: 1, type: 'method' },
        { id: 'root-cause-analysis', title: '根因分析', level: 2, type: 'method' },
        { id: 'debugging', title: '调试', level: 2, type: 'method' },
        { id: 'counterfactual-thinking', title: '反事实思考', level: 3, type: 'method' }
      ] },
      { id: 'problem-solving-m3', title: '生成与检验', summary: '假设要能被推翻，才算假设', topics: [
        { id: 'hypothesis-testing', title: '假设检验', level: 2, type: 'method' },
        { id: 'experimentation-ps', title: '实验', level: 2, type: 'method' },
        { id: 'decision-tree-ps', title: '决策树', level: 2, type: 'method' },
        { id: 'tradeoff-ps', title: '权衡', level: 2, type: 'method' }
      ] },
      { id: 'problem-solving-m4', title: '收敛', summary: '结束也是一种能力', topics: [
        { id: 'optimization', title: '优化', level: 3, type: 'method' },
        { id: 'iteration', title: '迭代', level: 2, type: 'method' },
        { id: 'inversion', title: '逆向思考', level: 2, type: 'method' }
      ] }
    ],
    connections: ['logic', 'systems-thinking', 'creativity', 'strategic-thinking']
  },
  {
    id: 'creativity',
    title: '创造力与创新',
    shortTitle: '创造力',
    tagline: '用已知的，造出新的',
    description: '组合、类比、重构与约束——新想法如何产生。',
    intro: '创造力被误解最多的一点是"凭空诞生"。实际观察创新史会发现，绝大多数突破是远距离连接、约束下的重构与大量原型实验的产物。这门课提供具体可练的技巧：强制类比、随机刺激、概念融合、重新定义问题、约束型创造，以及最重要的——先把发散和收敛分开，别在想点子的时候同时评判点子。',
    visualTheme: 'fragment',
    bookStyle: { cover: 0x8a7a5a, spine: 0x6a5a3a, page: 0xf0e8d8, accent: 0xd4b878, sheen: 0.4 },
    position: _pos(10, 22, 14, 0),
    float: { amp: 0.48, speed: 0.5, phase: 19.5, rotAmp: 0.03, rotSpeed: 0.22 },
    micro: 'fragment',
    moduleCount: 4,
    modules: [
      { id: 'creativity-m1', title: '生成', summary: '先要有量，才谈得上质', topics: [
        { id: 'divergent-thinking', title: '发散思维', level: 1, type: 'method' },
        { id: 'association', title: '联想', level: 2, type: 'method' },
        { id: 'remote-association', title: '远距离连接', level: 3, type: 'concept' },
        { id: 'random-stimulation', title: '随机刺激', level: 2, type: 'method' }
      ] },
      { id: 'creativity-m2', title: '连接与重组', summary: '创新是把旧东西连成新的样子', topics: [
        { id: 'analogy-cr', title: '类比', level: 1, type: 'method' },
        { id: 'conceptual-blending', title: '概念融合', level: 3, type: 'concept' },
        { id: 'cross-domain-transfer', title: '跨领域迁移', level: 3, type: 'method' },
        { id: 'reframing', title: '重新定义', level: 2, type: 'method' }
      ] },
      { id: 'creativity-m3', title: '约束下的创造', summary: '限制不是创造力的敌人', topics: [
        { id: 'constraint-driven-creativity', title: '约束型创造', level: 2, type: 'method' },
        { id: 'inversion-cr', title: '逆向思考', level: 2, type: 'method' },
        { id: 'rapid-prototyping', title: '快速原型', level: 2, type: 'method' },
        { id: 'experimentation-cr', title: '实验', level: 2, type: 'method' }
      ] },
      { id: 'creativity-m4', title: '收敛与落地', summary: '把想法变成别人能用', topics: [
        { id: 'convergent-thinking', title: '收敛思维', level: 1, type: 'method' },
        { id: 'creative-problem-solving', title: '创造性问题解决', level: 2, type: 'method' },
        { id: 'innovation', title: '创新', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['problem-solving', 'rhetoric', 'learning', 'information']
  },
  {
    id: 'rhetoric',
    title: '修辞与论证',
    shortTitle: '修辞',
    tagline: '语言如何推动心智',
    description: '可信、情感与逻辑——说服性话语的结构与技艺。',
    intro: '修辞不是"花言巧语"，它是研究语言如何影响判断的古老学科，也是最实用的一门。你会拆解亚里士多德的三个支点（可信、情感、逻辑），学会受众分析、框架设定、叙事结构，也要学会对付反向：识别诡辩、构造真正的反方论证（而不是稻草人）。这门课的伦理底线是——做出更好的论证，而不是更有效的操纵。',
    visualTheme: 'oration',
    bookStyle: { cover: 0x5a4a3a, spine: 0x3a2a1a, page: 0xf0e8d8, accent: 0xc9b068, sheen: 0.45 },
    position: _pos(45, 25, -10, 10),
    float: { amp: 0.36, speed: 0.34, phase: 21.0, rotAmp: 0.018, rotSpeed: 0.13 },
    micro: 'oration',
    moduleCount: 4,
    modules: [
      { id: 'rhetoric-m1', title: '说服三要素', summary: '可信、情感、逻辑，缺了哪个都不稳', topics: [
        { id: 'argument-structure', title: '论证结构', level: 1, type: 'concept' },
        { id: 'credibility', title: '可信度', level: 1, type: 'concept' },
        { id: 'emotional-appeal', title: '情感诉求', level: 2, type: 'concept' },
        { id: 'logical-appeal', title: '逻辑诉求', level: 2, type: 'concept' }
      ] },
      { id: 'rhetoric-m2', title: '内容与包装', summary: '同样的事实，不同的容器', topics: [
        { id: 'framing-rh', title: '框架', level: 1, type: 'method' },
        { id: 'narrative', title: '叙事', level: 2, type: 'method' },
        { id: 'audience-analysis', title: '受众分析', level: 2, type: 'method' },
        { id: 'evidence-rh', title: '证据', level: 2, type: 'concept' }
      ] },
      { id: 'rhetoric-m3', title: '交锋', summary: '检验论证最好的方式是让它挨打', topics: [
        { id: 'counterargument', title: '反方论证', level: 2, type: 'method' },
        { id: 'debate', title: '辩论', level: 2, type: 'method' },
        { id: 'rational-dialogue', title: '理性对话', level: 3, type: 'concept' },
        { id: 'questioning-rh', title: '提问', level: 2, type: 'method' }
      ] },
      { id: 'rhetoric-m4', title: '表达品质', summary: '清晰和精确本身就是说服力', topics: [
        { id: 'clarity', title: '清晰', level: 1, type: 'method' },
        { id: 'precision', title: '精确', level: 2, type: 'method' },
        { id: 'explanation', title: '解释', level: 2, type: 'method' },
        { id: 'persuasion-rh', title: '说服', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['logic', 'negotiation', 'creativity', 'social-psychology']
  },
  {
    id: 'information',
    title: '信息与知识',
    shortTitle: '信息与知识',
    tagline: '信号、噪声，以及我们能知道什么',
    description: '知识如何被获取、验证、压缩与传播。',
    intro: '在信息过剩的时代，稀缺的不是信息而是判断力。这门课训练的是"这条信息值不值得信"的完整流程：来源评估、证据链追溯、交叉验证、信噪比判断；也训练更高一层的操作——从大量材料中压缩出结构、提取模式、建立自己的知识网络。附带一个不可或缺的认知：隐性知识无法被完全写下，所以有些东西必须靠实践传递。',
    visualTheme: 'archive',
    bookStyle: { cover: 0x3a5a5a, spine: 0x2a4a4a, page: 0xe0e8e8, accent: 0x68a8a0, sheen: 0.3 },
    position: _pos(125, 28, 3, 22),
    float: { amp: 0.32, speed: 0.3, phase: 22.5, rotAmp: 0.016, rotSpeed: 0.12 },
    micro: 'archive',
    moduleCount: 3,
    modules: [
      { id: 'information-m1', title: '判断信息', summary: '先评估来源，再评估内容', topics: [
        { id: 'information-quality', title: '信息质量', level: 1, type: 'concept' },
        { id: 'source-evaluation', title: '信息源评估', level: 1, type: 'method' },
        { id: 'signal-vs-noise', title: '信号与噪声', level: 2, type: 'concept' },
        { id: 'information-verification', title: '信息验证', level: 2, type: 'method' },
        { id: 'misinformation', title: '错误信息', level: 2, type: 'case' }
      ] },
      { id: 'information-m2', title: '信息的结构', summary: '压缩与模式提取，是把信息变成知识的关键步骤', topics: [
        { id: 'information-compression', title: '信息压缩', level: 3, type: 'concept' },
        { id: 'pattern-extraction', title: '模式提取', level: 3, type: 'method' },
        { id: 'knowledge-structure', title: '知识结构', level: 2, type: 'concept' },
        { id: 'knowledge-network', title: '知识网络', level: 3, type: 'concept' }
      ] },
      { id: 'information-m3', title: '知道与不知道', summary: '边界感是高级判断力的标志', topics: [
        { id: 'expertise-info', title: '专业知识', level: 2, type: 'concept' },
        { id: 'tacit-knowledge', title: '隐性知识', level: 3, type: 'concept' },
        { id: 'epistemic-uncertainty', title: '认识论不确定性', level: 3, type: 'concept' },
        { id: 'information-asymmetry-info', title: '信息不对称', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['logic', 'probability', 'systems-thinking', 'learning']
  },
  {
    id: 'probability',
    title: '概率与不确定性',
    shortTitle: '概率',
    tagline: '在未知中进行推理',
    description: '分布、贝叶斯思维，以及与不确定性共处。',
    intro: '这门课的目标是让你在"不知道"的时候依然能做出好决策。核心工具是期望值、基础概率、贝叶斯更新与校准过的预测。你会理解为什么小样本会让你看到不存在的规律（均值回归），为什么相关性几乎不等于因果，以及如何用具身的方式建立概率直觉——比如用频率而不是百分比思考。最终目标非常具体：让你在一年后的复盘里，发现自己的预测其实兑现得像自己说的那样准（或不那么准）。',
    visualTheme: 'cloud',
    bookStyle: { cover: 0x4a4a6a, spine: 0x2a2a4a, page: 0xe0e0f0, accent: 0x8888b8, sheen: 0.25 },
    position: _pos(175, 20, 0, -18),
    float: { amp: 0.4, speed: 0.28, phase: 24.0, rotAmp: 0.022, rotSpeed: 0.14 },
    micro: 'cloud',
    moduleCount: 4,
    modules: [
      { id: 'probability-m1', title: '概率的语言', summary: '把"可能"翻译成数字', topics: [
        { id: 'probability-basics', title: '概率', level: 1, type: 'concept' },
        { id: 'conditional-probability', title: '条件概率', level: 2, type: 'concept' },
        { id: 'base-rate', title: '基础概率', level: 2, type: 'concept' },
        { id: 'randomness', title: '随机性', level: 2, type: 'concept' }
      ] },
      { id: 'probability-m2', title: '更新信念', summary: '新证据来了，我该改变多少？', topics: [
        { id: 'bayesian-thinking', title: '贝叶斯思维', level: 2, type: 'method' },
        { id: 'correlation-pb', title: '相关', level: 2, type: 'concept' },
        { id: 'causal-inference', title: '因果推断', level: 3, type: 'method' },
        { id: 'regression-to-mean', title: '均值回归', level: 3, type: 'concept' }
      ] },
      { id: 'probability-m3', title: '决策工具', summary: '把不确定性算进选择里', topics: [
        { id: 'expected-value', title: '期望值', level: 2, type: 'concept' },
        { id: 'risk-pb', title: '风险', level: 2, type: 'concept' },
        { id: 'uncertainty-pb', title: '不确定性', level: 2, type: 'concept' },
        { id: 'decision-under-uncertainty-pb', title: '不确定性下的决策', level: 3, type: 'method' }
      ] },
      { id: 'probability-m4', title: '预测实践', summary: '校准，比准确更难也更值钱', topics: [
        { id: 'forecasting', title: '预测', level: 2, type: 'method' },
        { id: 'calibration', title: '校准', level: 3, type: 'method' },
        { id: 'statistical-thinking', title: '统计思维', level: 2, type: 'concept' }
      ] }
    ],
    connections: ['cognitive-biases', 'game-theory', 'information', 'economics']
  },
  {
    id: 'learning',
    title: '学习与专业能力',
    shortTitle: '学习',
    tagline: '能力是如何随时间长出来的',
    description: '反馈、提取、迁移、模式识别与刻意练习。',
    intro: '这门课把"学习"当作一门可设计的工程，而不是靠意志力的事。你会学到为什么重复阅读几乎无效而提取练习有效，为什么交错练习让你当下感觉更差却记得更牢，为什么专家的记忆优势只出现在自己的领域里，以及如何设计反馈回路让练习不至于变成机械重复。附带一个重要的实用结论：迁移很难，所以要主动为迁移而练，而不能指望它自动发生。',
    visualTheme: 'growth',
    bookStyle: { cover: 0x5a4a3a, spine: 0x3a2a1a, page: 0xf0e8d0, accent: 0xc0a878, sheen: 0.4 },
    position: _pos(235, 18, 6, 5),
    float: { amp: 0.38, speed: 0.33, phase: 25.5, rotAmp: 0.02, rotSpeed: 0.16 },
    micro: 'growth',
    moduleCount: 4,
    modules: [
      { id: 'learning-m1', title: '练习的科学', summary: '努力的类型比努力的量更重要', topics: [
        { id: 'deliberate-practice', title: '刻意练习', level: 1, type: 'method' },
        { id: 'skill-acquisition', title: '技能习得', level: 1, type: 'concept' },
        { id: 'retrieval-practice', title: '提取练习', level: 2, type: 'method' },
        { id: 'interleaving', title: '交错学习', level: 2, type: 'method' }
      ] },
      { id: 'learning-m2', title: '反馈与修正', summary: '错误是最便宜的老师，前提是你没把它跳过', topics: [
        { id: 'feedback-ln', title: '反馈', level: 1, type: 'concept' },
        { id: 'error-analysis', title: '错误分析', level: 2, type: 'method' },
        { id: 'self-explanation', title: '自我解释', level: 2, type: 'method' },
        { id: 'metacognition', title: '元认知', level: 2, type: 'concept' }
      ] },
      { id: 'learning-m3', title: '专家的心智', summary: '专家看到的不是更多的信息，是更好的结构', topics: [
        { id: 'mental-models-ln', title: '心智模型', level: 2, type: 'concept' },
        { id: 'pattern-recognition-ln', title: '模式识别', level: 2, type: 'concept' },
        { id: 'expert-performance', title: '专家表现', level: 3, type: 'concept' },
        { id: 'knowledge-organization', title: '知识组织', level: 3, type: 'method' }
      ] },
      { id: 'learning-m4', title: '迁移与应用', summary: '学会能不能用出来，取决于练的时候', topics: [
        { id: 'transfer', title: '迁移', level: 3, type: 'concept' }
      ] }
    ],
    connections: ['cognitive-science', 'creativity', 'information', 'great-minds']
  },
  {
    id: 'great-minds',
    title: '伟大思想家与思想史',
    shortTitle: '思想人物',
    tagline: '人类思想的轨迹',
    description: '改变了我们看待世界方式的人——他们的问题、方法与局限。',
    intro: '这一部分不是名人名言合集。每个人都按同一套框架呈现：他面对的时代问题是什么 → 他试图解决的是什么 → 他的核心思想与方法 → 他的贡献、错误与局限 → 他影响了谁 → 今天可以学什么、又不该模仿什么。你会看到这些思想家彼此构成一张网络：亚里士多德的形式逻辑通向图灵的可计算，休谟的归纳问题通向卡尼曼的偏差研究，冯·诺伊曼的博弈论通向纳什的均衡。他们的伟大之处不在于聪明，而在于选择了正确的问题。',
    visualTheme: 'starmap',
    bookStyle: { cover: 0x1a1a3a, spine: 0x0a0a2a, page: 0xe8e8f8, accent: 0xc9c94c, sheen: 0.5 },
    position: _pos(275, 46, 12, -8),
    float: { amp: 0.3, speed: 0.15, phase: 27.0, rotAmp: 0.008, rotSpeed: 0.05 },
    micro: 'starmap',
    moduleCount: 5,
    modules: [
      { id: 'great-minds-m1', title: '古代与近代的奠基', summary: '当思考本身刚刚成为一件被允许的事', topics: [
        { id: 'socrates', title: '苏格拉底', level: 1, type: 'person' },
        { id: 'aristotle', title: '亚里士多德', level: 1, type: 'person' },
        { id: 'galileo', title: '伽利略', level: 2, type: 'person' },
        { id: 'descartes', title: '笛卡尔', level: 2, type: 'person' }
      ] },
      { id: 'great-minds-m2', title: '理性、经验与市场', summary: '现代人看待世界的方式被这几位定型', topics: [
        { id: 'hume', title: '大卫·休谟', level: 2, type: 'person' },
        { id: 'adam-smith', title: '亚当·斯密', level: 2, type: 'person' },
        { id: 'darwin', title: '达尔文', level: 2, type: 'person' },
        { id: 'da-vinci', title: '达·芬奇', level: 1, type: 'person' },
        { id: 'newton', title: '牛顿', level: 2, type: 'person' }
      ] },
      { id: 'great-minds-m3', title: '现代科学的突破', summary: '当常识开始失效的地方', topics: [
        { id: 'marie-curie', title: '居里夫人', level: 1, type: 'person' },
        { id: 'einstein', title: '爱因斯坦', level: 2, type: 'person' },
        { id: 'feynman', title: '费曼', level: 2, type: 'person' }
      ] },
      { id: 'great-minds-m4', title: '计算与信息的诞生', summary: '抽象机器如何改变了世界的模样', topics: [
        { id: 'ada-lovelace', title: '阿达·洛夫莱斯', level: 2, type: 'person' },
        { id: 'turing', title: '图灵', level: 2, type: 'person' },
        { id: 'shannon', title: '香农', level: 3, type: 'person' },
        { id: 'von-neumann', title: '冯·诺伊曼', level: 3, type: 'person' }
      ] },
      { id: 'great-minds-m5', title: '理性、博弈与决策', summary: '当人类开始研究自己的判断', topics: [
        { id: 'nash', title: '纳什', level: 2, type: 'person' },
        { id: 'kahneman', title: '卡尼曼', level: 2, type: 'person' },
        { id: 'herbert-simon', title: '赫伯特·西蒙', level: 3, type: 'person' },
        { id: 'thomas-schelling', title: '托马斯·谢林', level: 3, type: 'person' }
      ] }
    ],
    connections: ['philosophy', 'logic', 'economics', 'probability', 'learning']
  }
];

// --- 展开扁平 topics：每个知识点带上所属模块，供书籍世界渲染 ---
SUBJECTS.forEach(subject => {
  subject.topics = [];
  subject.modules.forEach(m => {
    m.topics.forEach(t => {
      subject.topics.push({ ...t, moduleId: m.id, moduleTitle: m.title });
    });
  });
});

// --- 难度标签 ---
export const LEVEL_LABEL = { 1: '基础', 2: '进阶', 3: '高级' };
export const TYPE_LABEL = { concept: '概念', method: '方法', case: '案例', person: '人物' };

// --- Helper: get subject by id ---
export function getSubject(id) {
  return SUBJECTS.find(s => s.id === id);
}

// --- Helper: get topic by subject + topic id ---
export function getTopic(subjectId, topicId) {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  return subject.topics.find(t => t.id === topicId) || null;
}

// --- Helper: locate a topic anywhere in the atlas ---
export function locateTopic(topicId) {
  for (const s of SUBJECTS) {
    const t = s.topics.find(x => x.id === topicId);
    if (t) return { subject: s, topic: t };
  }
  return null;
}

// --- 知识点的完整字段结构（内容由 data/knowledge 提供） ---
export const KNOWLEDGE_FIELDS = [
  { key: 'core',        label: '它是什么' },
  { key: 'mechanism',   label: '它如何运作' },
  { key: 'why',         label: '为什么重要' },
  { key: 'example',     label: '经典案例' },
  { key: 'application', label: '现实应用' },
  { key: 'counter',     label: '反例与边界' },
  { key: 'misconception', label: '常见误区' },
  { key: 'practice',    label: '思维实验' },
  { key: 'advanced',    label: '进阶' },
  { key: 'related',     label: '跨学科连接' }
];
