// ============================================================
// MIND ATLAS — 图解补全层（非侵入式）
// 为核心 5 学科（博弈论 / 概率 / 逻辑 / 认知偏差 / 谈判）的 57 个知识点
// 补充：扉页导语 lead + 程序化图解 visualExplanation。
// 不修改原散文内容，仅在 atlas-data.js 的 getTopicContent 中叠加。
// 后续为其余 15 学科补全时，只需在此继续追加条目。
// ============================================================

export const DIAGRAM_OVERLAY = {

  // ---------------- 博弈论 ----------------
  'game-theory': {
    'players': {
      lead: '博弈的起点不是棋盘，而是先看清：谁在局中、各自能做什么、图什么。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '一局博弈的四个要素',
        visualQuestion: '如果漏掉"规则"，你会误判谁的什么行为是被允许的？',
        annotations: [
          '你正在看到什么：玩家被策略、收益、规则三条线牵住',
          '关键关系：规则界定可选策略，策略决定收益',
          '改变这个变量：换一批玩家，同一规则下收益结构可能完全不同'
        ],
        entities: [
          { id: 'p', label: '玩家' },
          { id: 's', label: '策略集' },
          { id: 'u', label: '收益' },
          { id: 'r', label: '规则' }
        ],
        relationships: [
          { from: 'r', to: 's' }, { from: 's', to: 'p' },
          { from: 'p', to: 'u' }, { from: 's', to: 'u' }
        ]
      }
    },
    'strategies': {
      lead: '策略不是"一个选择"，而是面对每一种可能时你预先想好的完整应对方案。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '策略的四种形态',
        visualQuestion: '为什么"混合策略"能让对手无法预判你的下一步？',
        annotations: [
          '你正在看到什么：四类策略围绕"完整应对方案"展开',
          '关键关系：混合策略用随机化化解被预判的风险',
          '改变这个变量：若对手能看穿你的随机比例，混合策略退化为纯策略'
        ],
        entities: [
          { id: 'pure', label: '纯策略' },
          { id: 'mix', label: '混合策略' },
          { id: 'dom', label: '优势策略' },
          { id: 'cont', label: '相机策略' }
        ],
        relationships: [
          { from: 'pure', to: 'mix' }, { from: 'dom', to: 'pure' },
          { from: 'cont', to: 'pure' }
        ]
      }
    },
    'payoffs': {
      lead: '收益是博弈的记分牌——它不必是钱，而是每个玩家真正在乎的东西。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '货币收益 ≠ 效用',
        visualQuestion: '两个玩家拿到同样的钱，为什么"开心程度"可能差很远？',
        annotations: [
          '你正在看到什么：左侧是账面数字，右侧是主观价值',
          '关键关系：穷人和富人对同一笔钱的评价不同',
          '改变这个变量：把收益从"钱"换成"声誉"，均衡可能整体偏移'
        ],
        left: { title: '货币收益', items: ['可度量的数字', '对同一人恒定', '便于比较'] },
        right: { title: '效用 / 偏好', items: ['主观价值', '因人而异', '受参照点影响'] }
      }
    },
    'information-gt': {
      lead: '你能看见对手的底牌吗？信息结构往往比策略本身更决定胜负。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '完全信息 vs 不完全信息',
        visualQuestion: '当对手的类型对你隐藏，你该如何调整自己的出招？',
        annotations: [
          '你正在看到什么：左侧人人知根知底，右侧藏着私密的"类型"',
          '关键关系：信息差催生伪装与信号',
          '改变这个变量：引入一点点信息披露，均衡可能剧变'
        ],
        left: { title: '完全信息', items: ['双方收益已知', '无隐藏类型', '可直接最优反应'] },
        right: { title: '不完全信息', items: ['存在私密类型', '需推断对手', '信号与伪装登场'] }
      }
    },
    'dominant-strategies': {
      lead: '无论别人怎么做，你都该选的那一手——这就是优势策略。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '优势策略如何被识别',
        visualQuestion: '若两个玩家都有优势策略，结局会不会自动锁定？',
        annotations: [
          '你正在看到什么：优势策略贯穿"对手每种反应"仍占优',
          '关键关系：剔除劣势策略能简化整局博弈',
          '改变这个变量：对手变招后若优势消失，它就只是临时占优'
        ],
        entities: [
          { id: 'a', label: '对手出 A' },
          { id: 'b', label: '对手出 B' },
          { id: 'd', label: '我方占优手' },
          { id: 'r', label: '剔除劣势' }
        ],
        relationships: [
          { from: 'a', to: 'd' }, { from: 'b', to: 'd' },
          { from: 'd', to: 'r' }
        ]
      }
    },
    'mixed-strategies': {
      lead: '当没有稳赢的纯策略，随机出招反而成了最优解。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '何时需要混合策略',
        visualQuestion: '猜拳里若你总出石头，对手会发现并击败你——怎么破？',
        annotations: [
          '你正在看到什么：纯策略无解时，混合策略补位',
          '关键关系：让对手对你的预测无意义',
          '改变这个变量：一旦对手能读心，随机比例需立刻重算'
        ],
        entities: [
          { id: 'np', label: '无纯策略均衡' },
          { id: 'rand', label: '随机化比例' },
          { id: 'ind', label: '不可被预测' },
          { id: 'eq', label: '混合均衡' }
        ],
        relationships: [
          { from: 'np', to: 'rand' }, { from: 'rand', to: 'ind' },
          { from: 'ind', to: 'eq' }
        ]
      }
    },
    'nash-equilibrium': {
      lead: '纳什均衡是这样一个点：谁单方面改变策略，谁就会变糟。',
      visualExplanation: {
        visualType: 'game_matrix',
        visualTitle: '协调博弈的两个均衡',
        visualQuestion: '两个均衡里，你和对方怎么"撞"到同一个而不落空？',
        annotations: [
          '你正在看到什么：你与对方同选球场或同选剧场都得 2 分，错配得 0',
          '关键关系：存在两个纯策略纳什均衡',
          '改变这个变量：点不同单元格，看单方面改策略会不会更差'
        ],
        players: ['你', '对方'],
        rowStrategies: ['去球场', '去剧场'],
        colStrategies: ['去球场', '去剧场'],
        payoffs: [[[2, 2], [0, 0]], [[0, 0], [2, 2]]],
        nash: [[0, 0], [1, 1]]
      }
    },
    'prisoners-dilemma': {
      lead: '个体理性把每个人都推向集体最糟——这是博弈论最著名的寓言。',
      visualExplanation: {
        visualType: 'game_matrix',
        visualTitle: '囚徒困境',
        visualQuestion: '为何两人都"理性"地坦白，反而一起蹲更久？',
        annotations: [
          '你正在看到什么：你与同伙各选沉默或坦白，格内是(你,同伙)刑期',
          '关键关系：单方面坦白能减刑，但双方都坦白共 -2',
          '改变这个变量：点格看"我改口"后谁更亏——揭示背叛的诱惑'
        ],
        players: ['你', '同伙'],
        rowStrategies: ['沉默', '坦白'],
        colStrategies: ['沉默', '坦白'],
        payoffs: [[[-1, -1], [-3, 0]], [[0, -3], [-2, -2]]],
        nash: [[1, 1]]
      }
    },
    'repeated-games': {
      lead: '一次背叛无成本，但天天见面的世界里，声誉会替你约束对手。',
      visualExplanation: {
        visualType: 'feedback_loop',
        visualTitle: '以牙还牙如何维持合作',
        visualQuestion: '为什么"你合作→我合作"的循环能压住背叛的诱惑？',
        annotations: [
          '你正在看到什么：合作滋养信任，信任兑现长期收益，收益再反哺合作',
          '关键关系：这是增强回路（自我强化）',
          '改变这个变量：若游戏只剩最后一局，回路断裂、背叛回归'
        ],
        variables: [
          { id: 'coop', label: '合作' },
          { id: 'trust', label: '信任' },
          { id: 'gain', label: '长期收益' }
        ],
        links: [
          { from: 'coop', to: 'trust', sign: '+' },
          { from: 'trust', to: 'gain', sign: '+' },
          { from: 'gain', to: 'coop', sign: '+' }
        ],
        loopType: 'reinforcing'
      }
    },
    'signaling': {
      lead: '高质量者如何自证？靠的是"只有我真材实料才愿意付的昂贵信号"。',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '信号传递与分离均衡',
        visualQuestion: '为什么假货不肯学真品做同样昂贵的认证？',
        annotations: [
          '你正在看到什么：类型决定信号，信号影响接收方推断，推断导向分离',
          '关键关系：信号成本对劣质者过高，于是自然分离',
          '改变这个变量：若信号成本两端相同，信号就失效'
        ],
        variables: [
          { id: 'type', label: '真实类型' },
          { id: 'sig', label: '发送信号' },
          { id: 'inf', label: '接收方推断' },
          { id: 'sep', label: '分离均衡' }
        ],
        edges: [
          { from: 'type', to: 'sig' },
          { from: 'sig', to: 'inf' },
          { from: 'inf', to: 'sep' }
        ],
        topLabel: '昂贵信号让真假自然分开',
        conclusion: '低成本信号无意义，高成本信号才可信'
      }
    },
    'commitment': {
      lead: '把退路烧掉，你的威胁才有人信——这就是承诺的力量。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '无承诺 vs 有承诺',
        visualQuestion: '为什么"自断后路"反而让你在谈判中更有筹码？',
        annotations: [
          '你正在看到什么：左侧威胁不可信，右侧威胁因承诺而可信',
          '关键关系：可信度来自无法反悔',
          '改变这个变量：若承诺可撤销，优势立刻归零'
        ],
        before: { title: '无承诺', items: ['威胁只是说说', '对手不怕', '你被迫让步'] },
        after: { title: '有承诺', items: ['自断后路', '威胁可信', '对手退让'] }
      }
    },
    'bargaining-games': {
      lead: '讨价还价不是谁嗓门大，而是双方底线之间那道可成交的缝隙。',
      visualExplanation: {
        visualType: 'tradeoff_model',
        visualTitle: '议价中的可达区间',
        visualQuestion: '若你的底线高于对方的替代方案，这桩买卖还能成吗？',
        annotations: [
          '你正在看到什么：绿色是可达成区间，虚线是你的底线与替代方案',
          '关键关系：底线与 BATNA 夹出真正的谈判空间',
          '改变这个变量：拖动底线越过对方 BATNA，区间消失、谈崩'
        ],
        zone: [40, 60],
        reservation: 45,
        batna: 42
      }
    }
  },

  // ---------------- 概率 ----------------
  'probability': {
    'basics-prob': {
      lead: '概率不是玄学，而是给"不确定性"贴上可比较的大小标签。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '概率的四块积木',
        visualQuestion: '为什么所有可能结果的概率加起来必须等于 1？',
        annotations: [
          '你正在看到什么：样本空间包裹事件，事件被赋予概率值',
          '关键关系：概率永远是 0 到 1 之间的比例',
          '改变这个变量：事件定义变了，概率随之重写'
        ],
        entities: [
          { id: 'sp', label: '样本空间' },
          { id: 'ev', label: '事件' },
          { id: 'pr', label: '概率值' },
          { id: 'cert', label: '必然事件' }
        ],
        relationships: [
          { from: 'sp', to: 'ev' }, { from: 'ev', to: 'pr' },
          { from: 'sp', to: 'cert' }
        ]
      }
    },
    'bayesian-thinking': {
      lead: '新证据不会改变事实，但会更新你"相信事实"的程度。',
      visualExplanation: {
        visualType: 'probability_model',
        visualTitle: '贝叶斯：先验如何被证据刷新',
        visualQuestion: '即便试剂很准，为什么罕见病阳性也未必是病？',
        annotations: [
          '你正在看到什么：先验很低时，假阳性足以淹没真阳性',
          '关键关系：后验 = 先验 × 似然 ÷ 证据',
          '改变这个变量：点图区切换先验档位，看后验如何跳变'
        ],
        prior: 0.01,
        sensitivity: 0.9,
        falsePositive: 0.1
      }
    },
    'distributions': {
      lead: '两个分布可以有相同均值，却讲着完全不同的风险故事。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '均值（中心） vs 分布（形状）',
        visualQuestion: '只报"平均收入"会掩盖掉怎样的不平等？',
        annotations: [
          '你正在看到什么：左侧是单一数字，右侧是整条形状',
          '关键关系：形状决定极端值出现的概率',
          '改变这个变量：把均值相同但更肥尾的分布放进来对比'
        ],
        left: { title: '均值（中心）', items: ['一个数字', '忽略离散', '易被平均'] },
        right: { title: '分布（形状）', items: ['整条曲线', '显示离散', '暴露风险'] }
      }
    },
    'expected-value': {
      lead: '期望值是把"每种可能的后果"按可能性折成的一笔总账。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '期望 = 概率 × 价值 之和',
        visualQuestion: '为什么赌场久赌必赢，而你该在期望为负的游戏里离场？',
        annotations: [
          '你正在看到什么：每个分支的"概率×价值"汇成期望',
          '关键关系：正期望长期赚钱，负期望长期亏钱',
          '改变这个变量：调高某结果的概率，期望立刻倾斜'
        ],
        entities: [
          { id: 'p', label: '概率' },
          { id: 'v', label: '价值' },
          { id: 'w', label: '加权' },
          { id: 'e', label: '期望值' }
        ],
        relationships: [
          { from: 'p', to: 'w' }, { from: 'v', to: 'w' },
          { from: 'w', to: 'e' }
        ]
      }
    },
    'variance': {
      lead: '均值告诉你中心在哪，方差告诉你偏离中心会多狠。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '同均值，不同波动',
        visualQuestion: '两份"平均收益 5%"的投资，哪份更可能让你失眠？',
        annotations: [
          '你正在看到什么：两者中心相同，左侧窄、右侧宽',
          '关键关系：方差越大，极端结果越频繁',
          '改变这个变量：右侧再拉宽，破产风险肉眼可见上升'
        ],
        left: { title: 'A：波动小', items: ['均值 5', '很少偏离', '可预测'] },
        right: { title: 'B：波动大', items: ['均值 5', '常现极端', '高风险'] }
      }
    },
    'conditional-probability': {
      lead: '"已知 B 发生"会改写 A 的概率——条件概率就是这套重算。',
      visualExplanation: {
        visualType: 'probability_model',
        visualTitle: 'P(假设|证据) 怎么算',
        visualQuestion: '阳性结果出现后，你真正患病的概率到底是多少？',
        annotations: [
          '你正在看到什么：先验叠上证据似然，吐出条件概率',
          '关键关系：P(A|B) 往往远小于 P(B|A)',
          '改变这个变量：点图区切换先验，看条件概率如何被先验拉动'
        ],
        prior: 0.3,
        sensitivity: 0.8,
        falsePositive: 0.2
      }
    },
    'correlation-causation': {
      lead: '冰淇淋销量与溺水同涨，但谁也没"导致"谁——别被相关骗了。',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '相关 ≠ 因果',
        visualQuestion: '有没有一个隐藏变量，同时推高了这两件事？',
        annotations: [
          '你正在看到什么：冰淇淋与溺水看似相连，实则都被"气温"驱动',
          '关键关系：共同原因制造虚假相关',
          '改变这个变量：控制气温后，两者关联应消失'
        ],
        variables: [
          { id: 'ice', label: '冰淇淋' },
          { id: 'drown', label: '溺水' },
          { id: 'temp', label: '气温' }
        ],
        edges: [
          { from: 'temp', to: 'ice' },
          { from: 'temp', to: 'drown' }
        ],
        topLabel: '看似冰淇淋导致溺水？',
        conclusion: '实为共同原因（气温），非因果'
      }
    },
    'sampling': {
      lead: '你看到的永远只是样本，但样本能不能代表总体，决定结论真伪。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '从总体到样本',
        visualQuestion: '为什么同一个总体抽出的两批样本，结论可能相反？',
        annotations: [
          '你正在看到什么：总体被抽样成样本，样本被推断回总体',
          '关键关系：样本越小、越不随机，误差越大',
          '改变这个变量：把样本量翻倍，误差通常收窄'
        ],
        entities: [
          { id: 'pop', label: '总体' },
          { id: 'samp', label: '样本' },
          { id: 'err', label: '抽样误差' },
          { id: 'rep', label: '代表性' }
        ],
        relationships: [
          { from: 'pop', to: 'samp' }, { from: 'samp', to: 'err' },
          { from: 'samp', to: 'rep' }
        ]
      }
    },
    'regression-to-mean': {
      lead: '极端的下一次，往往没那么极端——这不是变好了，是统计在拉回。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '极端表现后的回落',
        visualQuestion: '为什么"考砸后请家教，下次进步"常被误当成家教有效？',
        annotations: [
          '你正在看到什么：左侧极端值，右侧自然向均值回归',
          '关键关系：极端本就难以维持',
          '改变这个变量：把"干预"去掉，回落照样发生'
        ],
        before: { title: '上次极好 / 极差', items: ['偏离均值', '含运气成分', '不可持续'] },
        after: { title: '下次回落', items: ['靠近均值', '看似"纠正"', '实为统计规律'] }
      }
    },
    'black-swans': {
      lead: '大多数风险睡在正态的梦里，黑天鹅却住在肥尾的阴影里。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '薄尾 vs 肥尾',
        visualQuestion: '为什么用正态分布预测股市，会系统性低估暴跌？',
        annotations: [
          '你正在看到什么：左侧尾部迅速归零，右侧尾部拖得很长',
          '关键关系：肥尾里极端事件概率被严重高估不足',
          '改变这个变量：把 2008 式冲击放进右侧尾部'
        ],
        left: { title: '正态分布（可预测）', items: ['尾部很薄', '极端罕见', '模型友好'] },
        right: { title: '肥尾分布（黑天鹅）', items: ['尾部很厚', '极端频发', '模型失灵'] }
      }
    },
    'monte-carlo': {
      lead: '算不出精确解？那就让计算机把可能性重复几万遍，看分布。',
      visualExplanation: {
        visualType: 'process_mechanism',
        visualTitle: '蒙特卡洛模拟四步',
        visualQuestion: '为什么重复抽样越多，结果反而越稳？',
        annotations: [
          '你正在看到什么：模型→随机抽样→大量重复→统计分布',
          '关键关系：大数定律让分布收敛',
          '改变这个变量：把抽样次数从千降到十，分布变毛糙'
        ],
        steps: [
          { title: '设定模型', text: '写明不确定变量与其分布。' },
          { title: '随机抽样', text: '每次按分布随机抽取一组输入。' },
          { title: '重复万次', text: '跑成千上万次，得到海量结果。' },
          { title: '看分布', text: '汇总结果，得到概率分布而非单点答案。' }
        ]
      }
    },
    'entropy': {
      lead: '熵衡量的是"意外程度"——越不确定，熵越高。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '熵与不确定性',
        visualQuestion: '为什么均匀分布的信息量最大、确定事件的信息量最小？',
        annotations: [
          '你正在看到什么：不确定性越高，熵越大',
          '关键关系：熵是平均信息量的度量',
          '改变这个变量：把概率向某一结果集中，熵下降'
        ],
        entities: [
          { id: 'u', label: '不确定性' },
          { id: 'i', label: '信息量' },
          { id: 'uni', label: '均匀分布' },
          { id: 'low', label: '低熵' }
        ],
        relationships: [
          { from: 'u', to: 'i' }, { from: 'uni', to: 'i' },
          { from: 'u', to: 'low' }
        ]
      }
    }
  },

  // ---------------- 逻辑 ----------------
  'logic': {
    'logic-fundamentals': {
      lead: '逻辑不保证你得到真相，但保证：若前提真，结论必真。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '有效推理的结构',
        visualQuestion: '前提为真、推理有效，结论就一定为真吗？',
        annotations: [
          '你正在看到什么：前提经推理规则流向结论',
          '关键关系：有效性关乎结构，不关乎内容真假',
          '改变这个变量：把前提换成假的，结构仍有效但结论失真'
        ],
        entities: [
          { id: 'pre', label: '前提' },
          { id: 'rule', label: '推理规则' },
          { id: 'con', label: '结论' },
          { id: 'val', label: '有效性' }
        ],
        relationships: [
          { from: 'pre', to: 'rule' }, { from: 'rule', to: 'con' },
          { from: 'pre', to: 'val' }
        ]
      }
    },
    'deductive': {
      lead: '演绎是从一般到个别：前提若真，结论铁定为真。',
      visualExplanation: {
        visualType: 'argument_structure',
        visualTitle: '一个演绎论证',
        visualQuestion: '前提都真时，这个结构能保证结论为真吗？',
        annotations: [
          '你正在看到什么：前提之上立着必然的结论',
          '关键关系：演绎结论是前提的逻辑后果',
          '改变这个变量：改一个前提，结论随之改写'
        ],
        premises: ['所有人都会死', '苏格拉底是人'],
        evidence: ['历史记载苏格拉底存在'],
        conclusion: '苏格拉底会死'
      }
    },
    'inductive': {
      lead: '归纳从个别推一般，结论只是"很可能"，而非"必然"。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '演绎（必然） vs 归纳（或然）',
        visualQuestion: '为什么再多的"白天鹅"也证明不了"所有天鹅皆白"？',
        annotations: [
          '你正在看到什么：左侧结论锁死，右侧结论开放',
          '关键关系：归纳可被一个反例击碎',
          '改变这个变量：出现一只黑天鹅，归纳即失效'
        ],
        left: { title: '演绎', items: ['前提真→结论真', '保真', '封闭'] },
        right: { title: '归纳', items: ['前提支持结论', '仅或然', '可被反例推翻'] }
      }
    },
    'abductive': {
      lead: '溯因是"找最佳解释"：现象摆在这，哪个原因最说得通？',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '三种推理对照',
        visualQuestion: '医生从症状反推病因，用的是哪一种推理？',
        annotations: [
          '你正在看到什么：左侧必然、中部或然、右侧选最佳解释',
          '关键关系：溯因不保证唯一，只选最省力的解释',
          '改变这个变量：加入新症状，最佳解释可能易主'
        ],
        left: { title: '演绎', items: ['一般→个别', '保真', '验证'] },
        right: { title: '溯因', items: ['现象→原因', '最佳解释', '提出假说'] }
      }
    },
    'arguments': {
      lead: '论证不是吵架，而是用前提支撑结论的可评估结构。',
      visualExplanation: {
        visualType: 'argument_structure',
        visualTitle: '论证的骨架',
        visualQuestion: '若前提成立，它真的"推"出结论了吗？',
        annotations: [
          '你正在看到什么：前提与证据撑起一个结论',
          '关键关系：好论证前提真且推理有效',
          '改变这个变量：抽掉一条关键前提，结构垮塌'
        ],
        premises: ['证据 A', '证据 B'],
        evidence: ['数据 / 案例支撑'],
        conclusion: '由此推出的主张'
      }
    },
    'premises-conclusions': {
      lead: '分不清前提和结论，就分不清"凭什么"和"说什么"。',
      visualExplanation: {
        visualType: 'argument_structure',
        visualTitle: '前提与结论的区分',
        visualQuestion: '一句话里，哪部分是支撑、哪部分是主张？',
        annotations: [
          '你正在看到什么：前提是地基，结论是楼',
          '关键关系：结论依赖前提，而非相反',
          '改变这个变量：把结论当前提，论证就倒转'
        ],
        premises: ['因为……（理由）', '鉴于……（依据）'],
        evidence: ['隐含假设也属前提'],
        conclusion: '所以……（主张）'
      }
    },
    'necessary-sufficient': {
      lead: '氧气是燃烧的必要条件，明火是充分条件——别把两者搞混。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '必要条件 vs 充分条件',
        visualQuestion: '"有它才行"和"有它就够"，差在哪？',
        annotations: [
          '你正在看到什么：左侧缺它不行，右侧有它即够',
          '关键关系：充分未必必要，必要未必充分',
          '改变这个变量：把"氧气"换成"火星"对比'
        ],
        left: { title: '必要条件（没它不行）', items: ['缺之必不成立', '可能还需别的', '如：氧气'] },
        right: { title: '充分条件（有它就行）', items: ['有之必成立', '未必唯一', '如：明火'] }
      }
    },
    'causal-reasoning': {
      lead: '说"甲导致乙"之前，先画清：是甲→乙，还是另有隐情？',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '因果链：原因→机制→结果',
        visualQuestion: '相关、时序、干预，哪一条才能真正坐实因果？',
        annotations: [
          '你正在看到什么：原因经机制抵达结果',
          '关键关系：没有机制的相关只是相关',
          '改变这个变量：切断机制，因果链断裂'
        ],
        variables: [
          { id: 'cause', label: '原因' },
          { id: 'mech', label: '机制' },
          { id: 'effect', label: '结果' }
        ],
        edges: [
          { from: 'cause', to: 'mech' },
          { from: 'mech', to: 'effect' }
        ],
        topLabel: '原因如何变成结果',
        conclusion: '机制缺失，因果难立'
      }
    },
    'evidence': {
      lead: '证据的价值不在多，而在它能否真正撑起你要的结论。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '证据的四项检验',
        visualQuestion: '一条"看起来很对"的证据，可能因哪一点失效？',
        annotations: [
          '你正在看到什么：证据被来源、相关、强度、偏差四关审视',
          '关键关系：弱证据撑不起强结论',
          '改变这个变量：来源造假，整条证据链崩塌'
        ],
        entities: [
          { id: 'src', label: '来源' },
          { id: 'rel', label: '相关性' },
          { id: 'str', label: '强度' },
          { id: 'bias', label: '偏差' }
        ],
        relationships: [
          { from: 'src', to: 'rel' }, { from: 'rel', to: 'str' },
          { from: 'str', to: 'bias' }
        ]
      }
    },
    'counterexamples': {
      lead: '一个反例，足以刺破一个号称"总是成立"的普遍命题。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '命题遇上反例',
        visualQuestion: '为什么"所有天鹅皆白"会被一只黑天鹅击碎？',
        annotations: [
          '你正在看到什么：左侧全称命题，右侧出现例外',
          '关键关系：全称命题容不下一个反例',
          '改变这个变量：限定范围（"本地天鹅"），命题或可挽救'
        ],
        before: { title: '原命题', items: ['声称总是成立', '覆盖全体', '未经检验'] },
        after: { title: '遇反例', items: ['一个例外', '命题崩塌', '须改写或限定'] }
      }
    },
    'falsification': {
      lead: '波普尔说：能被证伪，才算科学；永不错的理论，往往是空话。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '证实主义 vs 证伪主义',
        visualQuestion: '为什么"预言什么都不会发生"的理论最可疑？',
        annotations: [
          '你正在看到什么：左侧堆叠支持、右侧寻求推翻',
          '关键关系：可证伪性区分科学与伪科学',
          '改变这个变量：把"永远正确"改成"可被检验"，理论才合格'
        ],
        before: { title: '只证实', items: ['找支持的例子', '回避反例', '难以出错'] },
        after: { title: '求证伪', items: ['设计风险检验', '欢迎反例', '可被推翻'] }
      }
    },
    'logical-fallacies': {
      lead: '谬误让论证"听起来对"却站不住——识别它们是思维的疫苗。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '常见谬误家族',
        visualQuestion: '人身攻击为什么赢了嘴仗却输了论证？',
        annotations: [
          '你正在看到什么：各类谬误围绕"无效推理"聚集',
          '关键关系：攻击人不等于反驳其理由',
          '改变这个变量：把人身攻击换成针对论点的反驳'
        ],
        entities: [
          { id: 'ad', label: '人身攻击' },
          { id: 'slippery', label: '滑坡' },
          { id: 'straw', label: '稻草人' },
          { id: 'false', label: '虚假两难' }
        ],
        relationships: [
          { from: 'ad', to: 'straw' }, { from: 'slippery', to: 'false' }
        ]
      }
    },
    'assumptions': {
      lead: '每个论证都踩着隐形的前提——把它们挖出来，才能检验。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '显性与隐性前提',
        visualQuestion: '为什么两个人为同一结论吵架，可能只是假设不同？',
        annotations: [
          '你正在看到什么：结论之下藏着未言明的假设',
          '关键关系：假设一破，结论地基松动',
          '改变这个变量：把隐性假设显化，分歧常迎刃而解'
        ],
        entities: [
          { id: 'exp', label: '显性前提' },
          { id: 'imp', label: '隐性假设' },
          { id: 'con', label: '结论' },
          { id: 'chk', label: '检验' }
        ],
        relationships: [
          { from: 'imp', to: 'con' }, { from: 'exp', to: 'con' },
          { from: 'imp', to: 'chk' }
        ]
      }
    },
    'critical-thinking': {
      lead: '批判性思维不是抬杠，而是对每一个"理所当然"先问一句凭什么。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '批判性思维的环',
        visualQuestion: '为什么"暂停一下、反问自己"能躲过多数认知陷阱？',
        annotations: [
          '你正在看到什么：质疑—分析—评估—重构 的循环',
          '关键关系：慢一步判断，少一步踩坑',
          '改变这个变量：跳过任一环节，质量下降'
        ],
        entities: [
          { id: 'q', label: '质疑' },
          { id: 'a', label: '分析' },
          { id: 'e', label: '评估' },
          { id: 'r', label: '重构' }
        ],
        relationships: [
          { from: 'q', to: 'a' }, { from: 'a', to: 'e' },
          { from: 'e', to: 'r' }, { from: 'r', to: 'q' }
        ]
      }
    },
    'epistemic-humility': {
      lead: '认知谦逊是承认：我知道的，可能远少于我以为知道的。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '确定感 vs 谦逊',
        visualQuestion: '为什么"我可能错了"反而让你更接近真相？',
        annotations: [
          '你正在看到什么：左侧封闭、右侧开放',
          '关键关系：承认无知是更新信念的前提',
          '改变这个变量：把"绝对正确"换成"暂信"，更能接纳反证'
        ],
        before: { title: '过度确定', items: ['拒绝反证', '停止学习', '易陷谬误'] },
        after: { title: '认知谦逊', items: ['留修正空间', '持续更新', '更接近真'] }
      }
    }
  },

  // ---------------- 认知偏差 ----------------
  'cognitive-biases': {
    'anchoring': {
      lead: '第一个数字像钉子，后面所有判断都绕着它转——哪怕它毫无来由。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '有锚 vs 无锚',
        visualQuestion: '为什么先看到"高价"的人，对合理价的估计也偏高？',
        annotations: [
          '你正在看到什么：左侧被初始数字拉偏，右侧更准',
          '关键关系：锚点不相关，影响却真实',
          '改变这个变量：换一个更离谱的锚，偏移更夸张'
        ],
        before: { title: '被锚定', items: ['先见某数字', '判断被拉偏', '难回正轨'] },
        after: { title: '主动脱锚', items: ['先独立估', '再比锚点', '偏差减小'] }
      }
    },
    'availability-heuristic': {
      lead: '越容易想起的事，越显得常见——记忆的可及性骗了概率。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '易得性 vs 真实频率',
        visualQuestion: '为什么飞机失事比车祸更"吓人"，尽管后者更致命？',
        annotations: [
          '你正在看到什么：左侧是脑中易召回，右侧是真实发生',
          '关键关系：媒体放大让易得性失真',
          '改变这个变量：少看新闻，估计更接近事实'
        ],
        left: { title: '易得性', items: ['画面感强', '易被想起', '高估概率'] },
        right: { title: '真实频率', items: ['统计口径', '平淡无奇', '常被低估'] }
      }
    },
    'representativeness': {
      lead: '长得像某一类，就被当成那一类——典型性陷阱忽略了基础概率。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '代表性 vs 真实概率',
        visualQuestion: '一个安静爱书的人，更可能是 librarian 还是 farmer？',
        annotations: [
          '你正在看到什么：左侧凭"像不像"，右侧看基数',
          '关键关系：farmers 基数远大于 librarians',
          '改变这个变量：忽视基数，答案反转为错'
        ],
        left: { title: '代表性', items: ['像某类人', '直觉归类', '忽略基数'] },
        right: { title: '真实概率', items: ['看基础率', '看绝对数', '常被忽略'] }
      }
    },
    'confirmation-bias': {
      lead: '我们更爱寻找支持自己的证据，而不是挑战自己的证据。',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '确认偏误的回路',
        visualQuestion: '为什么越查越觉得自己对，反而可能离真相更远？',
        annotations: [
          '你正在看到什么：信念驱动只搜支持，强化自身',
          '关键关系：这是自我强化的增强回路',
          '改变这个变量：强制搜集反证，回路被打破'
        ],
        variables: [
          { id: 'bel', label: '已有信念' },
          { id: 'seek', label: '只搜支持' },
          { id: 'rein', label: '信念强化' }
        ],
        edges: [
          { from: 'bel', to: 'seek' },
          { from: 'seek', to: 'rein' },
          { from: 'rein', to: 'bel' }
        ],
        topLabel: '信念如何自我喂养',
        conclusion: '只听想听的，越听越偏'
      }
    },
    'loss-aversion': {
      lead: '亏一块钱的痛，约抵得上赚两块钱的爽——损失被放大了。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '损失痛感 vs 收益快感',
        visualQuestion: '为什么同样 100 元，丢比赚更让你睡不着？',
        annotations: [
          '你正在看到什么：左侧损失区被夸大，右侧收益区被压缩',
          '关键关系：损失厌恶约 2:1',
          '改变这个变量：把框架从"损失"改写成"少赚"，痛感变化'
        ],
        left: { title: '损失', items: ['痛感强烈', '回避优先', '约 2 倍权重'] },
        right: { title: '收益', items: ['快感较弱', '追求次之', '被损失压过'] }
      }
    },
    'sunk-cost': {
      lead: '已经花掉的钱，不该左右你下一步——但它偏偏会。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '纠结沉没 vs 只看未来',
        visualQuestion: '电影难看透顶，为什么你还硬着头皮看完？',
        annotations: [
          '你正在看到什么：左侧被已付出绑架，右侧只算未来',
          '关键关系：沉没成本不可收回',
          '改变这个变量：假装票钱已丢，决策立刻清醒'
        ],
        before: { title: '计入沉没', items: ['"钱都花了"', '硬撑到底', '越陷越深'] },
        after: { title: '忽略沉没', items: ['只看未来', '及时止损', '理性退出'] }
      }
    },
    'overconfidence': {
      lead: '我们对自己判断的准度，普遍高估了一截——尤其在不确定的事上。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '自信水平 vs 实际准确率',
        visualQuestion: '让你给答案标"90% 确定"，真正对的只有几成？',
        annotations: [
          '你正在看到什么：左侧自信高企，右侧命中偏低',
          '关键关系：难度越高，高估越狠',
          '改变这个变量：先写下"我可能错在哪"，校准改善'
        ],
        left: { title: '主观自信', items: ['感觉很稳', '常标高分', '忽略盲区'] },
        right: { title: '客观准确', items: ['实际命中', '低于自评', '常被打脸'] }
      }
    },
    'framing-effect': {
      lead: '同一件事换个说法，选择就反转——我们买的是"说法"不是事实。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '正框架 vs 负框架',
        visualQuestion: '手术"存活率 90%"和"死亡率 10%"，你会选哪个？',
        annotations: [
          '你正在看到什么：信息相同，措辞相反，决策不同',
          '关键关系：损失框架让人更冒险',
          '改变这个变量：把收益框架翻成损失框架，偏好翻转'
        ],
        before: { title: '正框架（得）', items: ['强调获益', '偏好确定', '保守选择'] },
        after: { title: '负框架（失）', items: ['强调损失', '偏好赌一把', '风险偏移'] }
      }
    },
    'choice-overload': {
      lead: '选项太多不是自由，而是瘫痪——选择过多反而降低满意度。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '少选项 vs 多选项',
        visualQuestion: '为什么超市 24 种果酱试吃，反而比 6 种卖得少？',
        annotations: [
          '你正在看到什么：左侧轻松决策，右侧陷入比较瘫痪',
          '关键关系：超过某临界点，满意度下降',
          '改变这个变量：先筛到 3–5 个再选，体验回升'
        ],
        before: { title: '少而精', items: ['易比较', '敢下单', '较满意'] },
        after: { title: '多而乱', items: ['比不过来', '拖延/放弃', '事后后悔'] }
      }
    },
    'hindsight-bias': {
      lead: '事后我们都成了预言家——"我早就知道会这样"。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '事前不确定 vs 事后"必然"',
        visualQuestion: '为什么事后的"显然"，事前你却未必押对？',
        annotations: [
          '你正在看到什么：左侧当时模糊，右侧回头清晰',
          '关键关系：结果重塑了记忆',
          '改变这个变量：记录事前判断，事后对比戳破幻觉'
        ],
        before: { title: '事前', items: ['多种可能', '并不确定', '难料结果'] },
        after: { title: '事后', items: ['"早知道"', '记忆扭曲', '高估可预测'] }
      }
    },
    'outcome-bias': {
      lead: '同样是赌，赢了叫魄力、输了叫鲁莽——我们用结果替过程打分。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '结果导向 vs 过程导向',
        visualQuestion: '一个好决策碰巧失败，该和坏决策同罪吗？',
        annotations: [
          '你正在看到什么：左侧看结局定对错，右侧看决策质量',
          '关键关系：运气让结果偏离决策',
          '改变这个变量：用"当时信息下是否合理"重评'
        ],
        left: { title: '看结果', items: ['赢即对的', '输即错', '忽略运气'] },
        right: { title: '看过程', items: ['评决策质量', '区分运气', '更公平'] }
      }
    },
    'planning-fallacy': {
      lead: '我们对"要多久"的估计，系统性地过于乐观。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '预估 vs 实际',
        visualQuestion: '为什么装修、写论文总比你说的时间晚一倍？',
        annotations: [
          '你正在看到什么：左侧乐观预估，右侧屡屡超时',
          '关键关系：忽略分布而只看最佳情形',
          '改变这个变量：改用"类似任务历史时长"做基准'
        ],
        before: { title: '乐观预估', items: ['想最好情形', '忽略意外', '偏短'] },
        after: { title: '实际耗时', items: ['常有延误', '缓冲不足', '偏长'] }
      }
    },
    'gamblers-fallacy': {
      lead: '连开十次红，下一次"该黑了"？不——骰子从不记得过去。',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '独立事件的错觉',
        visualQuestion: '为什么"该轮到黑"是错误地把独立当成了因果？',
        annotations: [
          '你正在看到什么：把无关联的两掷强行连成因果',
          '关键关系：独立事件概率互不传递',
          '改变这个变量：标出"每次独立"，错觉消失'
        ],
        variables: [
          { id: 'prev', label: '上一掷红' },
          { id: 'next', label: '下一掷' },
          { id: 'illusion', label: '错误因果' }
        ],
        edges: [
          { from: 'prev', to: 'illusion' },
          { from: 'illusion', to: 'next' }
        ],
        topLabel: '看似"该轮到"其实无关',
        conclusion: '每次独立，概率不变'
      }
    },
    'base-rate-neglect': {
      lead: '罕见病哪怕试剂很准，阳性也多半是假警——基础率被我们无视了。',
      visualExplanation: {
        visualType: 'probability_model',
        visualTitle: '忽略基础率的代价',
        visualQuestion: '先验只有 1% 时，阳性到底有多大概率是真病？',
        annotations: [
          '你正在看到什么：低先验下假阳性淹没真阳性',
          '关键关系：基础率是后验的锚',
          '改变这个变量：点图区把先验调到 30%，后验飙升'
        ],
        prior: 0.01,
        sensitivity: 0.9,
        falsePositive: 0.1
      }
    },
    'status-quo-bias': {
      lead: '维持现状几乎零成本，改变却要费力——于是我们懒得动。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '维持现状 vs 主动改变',
        visualQuestion: '为什么默认选项（不勾选）的人远超主动改的人？',
        annotations: [
          '你正在看到什么：左侧省事但可能更差，右侧需用力',
          '关键关系：现状自带"惰性权重"',
          '改变这个变量：把更优方案设为默认，选择反转'
        ],
        before: { title: '维持现状', items: ['零动作', '怕后悔', '常非最优'] },
        after: { title: '主动改变', items: ['需决策', '承担风险', '可能更优'] }
      }
    },
    'recency-bias': {
      lead: '最近发生的事最鲜活，于是我们给了它不该有的权重。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '近期权重 vs 长期权重',
        visualQuestion: '为什么昨天的新闻，比三年的趋势更能左右你的判断？',
        annotations: [
          '你正在看到什么：左侧近期被放大，右侧长期被压低',
          '关键关系：鲜活度不等于重要性',
          '改变这个变量：给长期数据同等版面，权重回正'
        ],
        left: { title: '近期', items: ['记忆鲜活', '权重过高', '易过度反应'] },
        right: { title: '长期', items: ['趋势平稳', '权重偏低', '常被忽视'] }
      }
    },
    'dunning-kruger': {
      lead: '最不懂的人最自信，最懂的人反而谦虚——能力与自信错配。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '能力—自信曲线',
        visualQuestion: '为什么新手常觉得自己"已经懂了"，专家却说"还差得远"？',
        annotations: [
          '你正在看到什么：低能力配高自信，高能力配低自信',
          '关键关系：无知让人看不见自己的无知',
          '改变这个变量：随着学习，自信先跌后升'
        ],
        entities: [
          { id: 'low', label: '低能力·高自信' },
          { id: 'mid', label: '学习中·低谷' },
          { id: 'high', label: '高能力·谦逊' }
        ],
        relationships: [
          { from: 'low', to: 'mid' }, { from: 'mid', to: 'high' }
        ]
      }
    },
    'decision-under-uncertainty': {
      lead: '没有完整信息时也要决策——好策略是"对冲"而非"等齐全"。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '不确定下的决策原则',
        visualQuestion: '为什么"可错的行动 + 快速反馈"优于"等完美信息"？',
        annotations: [
          '你正在看到什么：信息缺口被选项、概率、反馈三件补',
          '关键关系：等待的代价可能高于犯错',
          '改变这个变量：把反馈周期拉长，错误成本上升'
        ],
        entities: [
          { id: 'info', label: '信息缺口' },
          { id: 'opt', label: '多选项' },
          { id: 'prob', label: '概率思维' },
          { id: 'fb', label: '快速反馈' }
        ],
        relationships: [
          { from: 'info', to: 'prob' }, { from: 'opt', to: 'prob' },
          { from: 'prob', to: 'fb' }
        ]
      }
    }
  },

  // ---------------- 谈判 ----------------
  'negotiation': {
    'interests': {
      lead: '立场是"我要什么"，利益是"我为什么想要"——后者才是突破口。',
      visualExplanation: {
        visualType: 'comparison',
        visualTitle: '立场 vs 利益',
        visualQuestion: '两人为窗争得面红耳赤，背后利益可能完全一致？',
        annotations: [
          '你正在看到什么：左侧是僵化的要价，右侧是柔软的动机',
          '关键关系：利益可同时满足，立场常零和',
          '改变这个变量：把"要开窗"换成"要新鲜空气"，空间打开'
        ],
        left: { title: '立场（要什么）', items: ['固定要价', '易对立', '难让步'] },
        right: { title: '利益（为什么）', items: ['真实动机', '可共创', '多解法'] }
      }
    },
    'positions': {
      lead: '报价、底线、立场——谈判桌上最显眼的，往往最该被看穿。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '立场的构成',
        visualQuestion: '为什么死守立场的人，常错过背后的利益空间？',
        annotations: [
          '你正在看到什么：报价、底线、ZOPA 围着立场展开',
          '关键关系：立场只是利益的包装',
          '改变这个变量：把立场往利益里拆，方案涌现'
        ],
        entities: [
          { id: 'ask', label: '报价' },
          { id: 'floor', label: '底线' },
          { id: 'zopa', label: 'ZOPA' },
          { id: 'int', label: '利益' }
        ],
        relationships: [
          { from: 'ask', to: 'floor' }, { from: 'floor', to: 'zopa' },
          { from: 'zopa', to: 'int' }
        ]
      }
    },
    'batna': {
      lead: 'BATNA 是你"谈崩也不怕"的底牌——它决定了你敢走多远。',
      visualExplanation: {
        visualType: 'tradeoff_model',
        visualTitle: '底线与替代方案',
        visualQuestion: '若你的 BATNA 强于对方开价，你该立刻离席吗？',
        annotations: [
          '你正在看到什么：可达区间外是你的替代方案与底线',
          '关键关系：BATNA 越强，议价力越强',
          '改变这个变量：BATNA 上移越过区间，离席更优'
        ],
        zone: [40, 60],
        reservation: 58,
        batna: 55
      }
    },
    'zopa': {
      lead: 'ZOPA 是双方底线之间那道缝——没有它，再谈也是白谈。',
      visualExplanation: {
        visualType: 'tradeoff_model',
        visualTitle: '可达成区间（ZOPA）',
        visualQuestion: '若双方底线互不重叠，这笔交易还有得谈吗？',
        annotations: [
          '你正在看到什么：绿带就是双方底线夹出的成交空间',
          '关键关系：底线重叠才有 ZOPA',
          '改变这个变量：任一方底线外移，区间收窄或消失'
        ],
        zone: [45, 55],
        reservation: 45,
        batna: 55
      }
    },
    'information-neg': {
      lead: '谁更懂对方的需求与底线，谁就握着谈判里看不见的杠杆。',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '信息如何转化为优势',
        visualQuestion: '为什么摸到对方 BATNA，你就知道该不该让步？',
        annotations: [
          '你正在看到什么：信息差流向策略优势',
          '关键关系：信息越少，越易被对方锚定',
          '改变这个变量：公开更多利益，反而可能扩大 ZOPA'
        ],
        variables: [
          { id: 'info', label: '掌握信息' },
          { id: 'strat', label: '调整策略' },
          { id: 'adv', label: '议价优势' }
        ],
        edges: [
          { from: 'info', to: 'strat' },
          { from: 'strat', to: 'adv' }
        ],
        topLabel: '信息差是隐性杠杆',
        conclusion: '知彼，方能定己之位'
      }
    },
    'framing-neg': {
      lead: '同一笔交易，"共赢"还是"让步"，框架决定对方的情绪与底线。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '合作框架 vs 对立框架',
        visualQuestion: '把"分蛋糕"改成"把蛋糕做大"，对方还死磕份额吗？',
        annotations: [
          '你正在看到什么：左侧零和博弈，右侧正和创造',
          '关键关系：框架设定了对方的心理账户',
          '改变这个变量：加入"共同利益"叙事，对抗减弱'
        ],
        before: { title: '对立框架', items: ['零和思维', '寸土必争', '易谈崩'] },
        after: { title: '合作框架', items: ['正和思维', '共创价值', '更易成'] }
      }
    },
    'concessions': {
      lead: '让步不是施舍，而是有节奏的信号——太快显弱，太慢显僵。',
      visualExplanation: {
        visualType: 'process_mechanism',
        visualTitle: '让步的节奏',
        visualQuestion: '为什么"递减式让步"比"一次性到底"更显真诚？',
        annotations: [
          '你正在看到什么：试探→小让→递减→成交',
          '关键关系：让步递减传递"已近底线"',
          '改变这个变量：开头就让太多，对方会得寸进尺'
        ],
        steps: [
          { title: '试探底线', text: '先抛条件，观察对方反应。' },
          { title: '小幅让步', text: '给一点甜头，释放善意。' },
          { title: '递减幅度', text: '每次让得比上次少，暗示接近底线。' },
          { title: '锁定成交', text: '对方回报后，落槌定约。' }
        ]
      }
    },
    'anchoring-neg': {
      lead: '先开价的人设下锚——即便那数字荒唐，也会拽着最终结果走。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '被锚定 vs 反锚定',
        visualQuestion: '对方开出离谱高价，你该怎么把锚拉回合理区？',
        annotations: [
          '你正在看到什么：左侧被对方首价拉偏，右侧主动重置',
          '关键关系：先开价者占 framing 优势',
          '改变这个变量：用客观基准（行情）反击锚'
        ],
        before: { title: '被锚定', items: ['对方先开价', '判断被拉偏', '难回基准'] },
        after: { title: '反锚定', items: ['引入行情', '重置参照', '夺回主动'] }
      }
    },
    'rapport': {
      lead: '关系不是软指标——信任够了，难谈的条款也会松动。',
      visualExplanation: {
        visualType: 'causal_model',
        visualTitle: '关系如何转化为成交',
        visualQuestion: '为什么聊得来的双方，更容易各退一步？',
        annotations: [
          '你正在看到什么： rapport 催生信任，信任降低防备',
          '关键关系：信任压缩了议价摩擦',
          '改变这个变量：关系破裂，同样的条款也难签'
        ],
        variables: [
          { id: 'rap', label: ' rapport' },
          { id: 'trust', label: '信任' },
          { id: 'deal', label: '成交' }
        ],
        edges: [
          { from: 'rap', to: 'trust' },
          { from: 'trust', to: 'deal' }
        ],
        topLabel: '关系润滑交易',
        conclusion: '信得过，才好谈'
      }
    },
    'leverage': {
      lead: '杠杆不是嗓门，而是"我有的、你想要的、且别处难寻"的那部分。',
      visualExplanation: {
        visualType: 'concept_model',
        visualTitle: '谈判杠杆的来源',
        visualQuestion: '为什么稀缺且不可替代的资源，才构成真杠杆？',
        annotations: [
          '你正在看到什么：稀缺、替代性、紧迫性 撑起杠杆',
          '关键关系：可被替代的筹码不是杠杆',
          '改变这个变量：对手找到替代，你的杠杆塌缩'
        ],
        entities: [
          { id: 'scarce', label: '稀缺' },
          { id: 'uniq', label: '难替代' },
          { id: 'urg', label: '紧迫' },
          { id: 'lev', label: '杠杆' }
        ],
        relationships: [
          { from: 'scarce', to: 'lev' }, { from: 'uniq', to: 'lev' },
          { from: 'urg', to: 'lev' }
        ]
      }
    },
    'deadlines': {
      lead: '截止期限是双向的——逼对方的，也可能反过来逼你。',
      visualExplanation: {
        visualType: 'before_after',
        visualTitle: '无期限 vs 有期限',
        visualQuestion: '为什么临门一脚时，双方都更容易让步？',
        annotations: [
          '你正在看到什么：左侧无限拖延，右侧时间压出决断',
          '关键关系：期限制造紧迫与损失恐惧',
          '改变这个变量：谎报期限被识破，信任受损'
        ],
        before: { title: '无期限', items: ['可一直拖', '无紧迫', '易搁置'] },
        after: { title: '有期限', items: ['紧迫感起', '怕错失', '加速成交'] }
      }
    },
    'coalitions': {
      lead: '单挑不如结盟——多方谈判里，谁拉拢了谁，往往决定结局。',
      visualExplanation: {
        visualType: 'network_system',
        visualTitle: '谈判中的联盟网络',
        visualQuestion: '为什么两个弱方结盟，能压过一个强方？',
        annotations: [
          '你正在看到什么：节点间连成联盟，合力改变力量对比',
          '关键关系：联盟放大单个筹码',
          '改变这个变量：联盟拆散，力量回归分散'
        ],
        nodes: [
          { id: 'a', label: '你' },
          { id: 'b', label: '盟友' },
          { id: 'c', label: '对手' },
          { id: 'd', label: '观望者' }
        ],
        edges: [
          { from: 'a', to: 'b' }, { from: 'b', to: 'c' },
          { from: 'd', to: 'a' }
        ]
      }
    }
  }
};
