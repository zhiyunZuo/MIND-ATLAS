// ============================================================
// MIND ATLAS — Visual Explanations
// 程序化知识图解库（替代"万能圆圈节点箭头"模板）
// 每个知识点用 visualExplanation 描述真正要画的内容，
// 图与正文一一对应，精确结构内容用 SVG/HTML 程序化绘制，
// 行为/实验场景才用线条插画。支持简单交互沙盒。
// visualType:
//  concept_model / causal_model / decision_tree / game_matrix /
//  comparison / process_mechanism / feedback_loop / network_system /
//  experiment_scene / behavior_scene / tradeoff_model /
//  probability_model / argument_structure / before_after /
//  case_simulation / interactive_sandbox
// ============================================================

const C = {
  line: '#9a8a5a',
  lineSoft: '#bca878',
  root: '#9a8a5a',
  fill: '#fbf7ec',
  fillRoot: '#f3ead2',
  text: '#4a4334',
  textStrong: '#3a3424',
  pos: '#6f8f5a',   // 正向 / 收益
  neg: '#b06a5a',   // 负向 / 损失
  accent: '#c9a84c',
  dim: '#8a7a5a'
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function defs(id) {
  return `<defs>
    <marker id="ar-${id}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L8,4.5 L0,9 Z" fill="${C.line}"/>
    </marker>
    <marker id="ar-pos-${id}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L8,4.5 L0,9 Z" fill="${C.pos}"/>
    </marker>
    <marker id="ar-neg-${id}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M0,0 L8,4.5 L0,9 Z" fill="${C.neg}"/>
    </marker>
  </defs>`;
}
function box(x, y, w, h, root = false) {
  return `<rect class="${root ? 'vz-box-root' : 'vz-box'}" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>`;
}
function label(cx, cy, t, root = false, fs = 12) {
  return `<text class="${root ? 'vz-text-root' : 'vz-text'}" x="${cx}" y="${cy}" font-size="${fs}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>`;
}
function edge(x1, y1, x2, y2, kind = '') {
  const m = kind === 'pos' ? `url(#ar-pos-main)` : kind === 'neg' ? `url(#ar-neg-main)` : `url(#ar-main)`;
  const cls = kind === 'pos' ? 'vz-edge-pos' : kind === 'neg' ? 'vz-edge-neg' : 'vz-edge';
  return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2 - 6}" y2="${y2}" marker-end="${m}"/>`;
}

// ---------- 各 visualType 的 SVG / HTML 构造 ----------

function svgWrap(vbW, vbH, inner) {
  return `<svg class="vz-svg" viewBox="0 0 ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${defs('main')}${inner}</svg>`;
}

function vConceptModel(s) {
  const ents = s.entities || [];
  const rels = s.relationships || [];
  const W = 480, H = 60 + Math.max(2, ents.length) * 0 + 150;
  const n = ents.length;
  const r = 44;
  const cx = W / 2, cy = H / 2;
  const pts = ents.map((e, i) => {
    const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
    return { x: cx + Math.cos(ang) * 150, y: cy + Math.sin(ang) * 120, e };
  });
  let g = '';
  rels.forEach(rl => {
    const a = pts.find(p => p.e.id === rl.from), b = pts.find(p => p.e.id === rl.to);
    if (a && b) g += edge(a.x, a.y, b.x, b.y);
  });
  pts.forEach(p => {
    g += `<circle class="vz-node" cx="${p.x}" cy="${p.y}" r="${r}"/>`;
    g += `<text class="vz-text" x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central">${esc(p.e.label)}</text>`;
  });
  return svgWrap(W, H, g);
}

function vCausalModel(s) {
  const vars = s.variables || [];
  const edges = s.edges || [];
  const third = s.thirdVariable;
  const W = 470, H = 220;
  const topText = s.topLabel ||
    (vars.length >= 2 ? `看似 ${vars[0].label} 导致 ${vars[1].label}？` : '因果链');
  let g = `<text class="vz-text-dim" x="${W / 2}" y="24" text-anchor="middle" font-size="11">${esc(topText)}</text>`;

  if (vars.length >= 2 && edges.length) {
    // 图模式：按知识点声明的变量与边绘制，箭头颜色随 sign 正负
    const n = Math.min(vars.length, 4);
    const y = 85;
    const xs = i => 85 + i * ((W - 170) / (n - 1));
    const pos = {};
    vars.slice(0, n).forEach((v, i) => { pos[v.id] = { x: xs(i), y, label: v.label }; });
    edges.forEach(e => {
      const a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      const sgn = Math.sign(b.x - a.x) || 1;
      g += edge(a.x + sgn * 50, a.y, b.x - sgn * 50, b.y, e.sign === '-' ? 'neg' : 'pos');
    });
    Object.values(pos).forEach(p => {
      g += box(p.x - 47, p.y - 20, 94, 40);
      g += label(p.x, p.y, p.label);
    });
    if (third && third.label) {
      const ty = 165;
      g += `<circle class="vz-node" cx="${W / 2}" cy="${ty}" r="20"/>`;
      g += `<text class="vz-text" x="${W / 2}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="10.5">${esc(third.label)}</text>`;
      g += `<text class="vz-text-dim" x="${W / 2}" y="${ty + 34}" text-anchor="middle" font-size="10">隐藏变量同时影响两端</text>`;
    }
    if (s.conclusion) {
      g += `<text class="vz-text-dim" x="${W / 2}" y="${H - 12}" text-anchor="middle" font-size="11">${esc(s.conclusion)}</text>`;
    }
    return svgWrap(W, H, g);
  }

  // 旧模板：A→B 看似因果 + 第三变量（相关 ≠ 因果）
  let g2 = '';
  const ax = 70, bx = 230, y = 60;
  g2 += box(ax - 50, y - 18, 100, 36, true);
  g2 += label(ax, y, vars[0] ? vars[0].label : 'A');
  g2 += box(bx - 50, y - 18, 100, 36);
  g2 += label(bx, y, vars[1] ? vars[1].label : 'B');
  g2 += edge(ax + 50, y, bx - 50, y, 'pos');
  if (third) {
    const ty = 160;
    g2 += `<circle class="vz-node" cx="150" cy="${ty}" r="22"/>`;
    g2 += `<text class="vz-text" x="150" y="${ty}" text-anchor="middle" dominant-baseline="central">${esc(third.label || 'C')}</text>`;
    g2 += edge(150, ty - 22, ax - 35, y + 18, 'neg');
    g2 += edge(150, ty - 22, bx - 35, y + 18, 'neg');
    g2 += `<text class="vz-text-dim" x="150" y="${ty + 38}" text-anchor="middle">第三变量 ${esc(third.label || 'C')} 同时影响两者</text>`;
    g2 += `<text class="vz-text-dim" x="370" y="${ty}" text-anchor="middle" font-size="11">${esc(s.conclusion || '→ 实为相关，非因果')}</text>`;
  }
  return svgWrap(W, H, topText ? g + g2 : g2);
}

function vDecisionTree(s) {
  // 递归分支，可点击展开
  const node = (n, x, y, d) => {
    let g = '';
    const w = 92, h = 30;
    const isLeaf = !n.branches || !n.branches.length;
    g += `<g class="vz-dt-node" data-cond="${esc(n.condition || '')}" data-outcome="${esc(n.outcome || '')}" style="cursor:pointer">` +
      box(x - w / 2, y - h / 2, w, h, isLeaf) + label(x, y, n.condition || n.outcome || '', isLeaf, 11) + `</g>`;
    if (!isLeaf) {
      const span = Math.pow(2, d - 1) * 70;
      const step = 70;
      n.branches.forEach((b, i) => {
        const ny = y + 64;
        const nx = x - span / 2 + i * (span / (n.branches.length - 1 || 1));
        const realx = n.branches.length === 1 ? x : nx;
        g += `<text class="vz-text-dim" x="${(x + realx) / 2}" y="${(y + ny) / 2 - 4}" text-anchor="middle" font-size="10">${esc(b.label || '')}</text>`;
        g += edge(x, y + h / 2, realx, ny - h / 2);
        g += node(b, realx, ny, d - 1);
      });
    }
    return g;
  };
  const W = 470, H = 60 + (s.depth || 3) * 70;
  return svgWrap(W, H, node(s, W / 2, 40, s.depth || 3));
}

function vGameMatrix(s) {
  const rows = s.rowStrategies || ['策略一', '策略二'];
  const cols = s.colStrategies || ['策略一', '策略二'];
  const pay = s.payoffs || [];
  const nash = s.nash || [];
  const W = 150 + cols.length * 110, H = 70 + rows.length * 64;
  let g = '';
  // 列标题
  cols.forEach((c, j) => {
    g += `<text class="vz-text-root" x="${40 + 110 * (j + 1) - 55}" y="34" text-anchor="middle">${esc(c)}</text>`;
  });
  rows.forEach((r, i) => {
    g += `<text class="vz-text-root" x="30" y="${60 + 64 * i + 32}" text-anchor="middle" dominant-baseline="central">${esc(r)}</text>`;
  });
  rows.forEach((r, i) => {
    cols.forEach((c, j) => {
      const x = 40 + 110 * (j + 1), y = 60 + 64 * i;
      const isNash = nash.some(p => p[0] === i && p[1] === j);
      g += `<g class="vz-cell" data-i="${i}" data-j="${j}" style="cursor:pointer">`;
      g += `<rect class="vz-cell-rect${isNash ? ' vz-nash' : ''}" x="${x}" y="${y}" width="100" height="56" rx="6"/>`;
      const p = pay[i] && pay[i][j];
      const a = p ? p[0] : 0, b = p ? p[1] : 0;
      g += `<text class="vz-payoff-a" x="${x + 50}" y="${y + 22}" text-anchor="middle">${esc(a)}</text>`;
      g += `<text class="vz-payoff-b" x="${x + 50}" y="${y + 40}" text-anchor="middle">${esc(b)}</text>`;
      g += `</g>`;
    });
  });
  return `<div class="vz-game" data-rows='${esc(JSON.stringify(rows))}' data-cols='${esc(JSON.stringify(cols))}' data-pay='${esc(JSON.stringify(pay))}' data-nash='${esc(JSON.stringify(nash))}'>${svgWrap(W, H, g)}<div class="vz-game-readout"></div></div>`;
}

function vComparison(s) {
  const L = s.left || {}, R = s.right || {};
  const li = L.items || [], ri = R.items || [];
  const rows = Math.max(li.length, ri.length);
  const W = 470, colW = 195, H = 60 + rows * 34;
  const leftX = 15, rightX = W - 15 - colW;
  let g = '';
  g += `<line class="vz-divider" x1="235" y1="20" x2="235" y2="${H - 16}"/>`;
  g += `<text class="vz-text-root" x="${leftX + colW / 2}" y="40" text-anchor="middle">${esc(L.title || '')}</text>`;
  li.forEach((it, i) => {
    const y = 64 + i * 34;
    g += `<circle class="vz-dot" cx="${leftX + 12}" cy="${y}" r="3"/>`;
    g += `<text class="vz-text" x="${leftX + 24}" y="${y}" dominant-baseline="central" font-size="11.5">${esc(it)}</text>`;
  });
  g += `<text class="vz-text-root" x="${rightX + colW / 2}" y="40" text-anchor="middle">${esc(R.title || '')}</text>`;
  ri.forEach((it, i) => {
    const y = 64 + i * 34;
    g += `<circle class="vz-dot" cx="${rightX + 12}" cy="${y}" r="3"/>`;
    g += `<text class="vz-text" x="${rightX + 24}" y="${y}" dominant-baseline="central" font-size="11.5">${esc(it)}</text>`;
  });
  return svgWrap(W, H, g);
}

function vProcess(s) {
  const steps = s.steps || s.items || [];
  const W = 460, H = 50 + steps.length * 56;
  let g = '';
  steps.forEach((st, i) => {
    const y = 30 + i * 56;
    g += `<circle class="vz-stepnum" cx="34" cy="${y}" r="15">${i + 1}</circle>`;
    g += `<text class="vz-text-root" x="34" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12">${i + 1}</text>`;
    g += box(60, y - 20, 360, 40);
    g += `<text class="vz-text" x="76" y="${y - 4}" font-size="11.5" text-anchor="start">${esc(st.title || '')}</text>`;
    if (st.text) g += `<text class="vz-text-dim" x="76" y="${y + 12}" font-size="10" text-anchor="start">${esc(st.text)}</text>`;
    if (i < steps.length - 1) g += `<line class="vz-edge" x1="34" y1="${y + 15}" x2="34" y2="${y + 41}" marker-end="url(#ar-main)"/>`;
  });
  return svgWrap(W, H, g);
}

function vFeedbackLoop(s) {
  const vars = s.variables || [];
  const links = s.links || [];
  const n = vars.length;
  const W = 470, H = 250, cx = 235, cy = 125, R = 92;
  const pts = vars.map((v, i) => {
    const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
    return { x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R, v };
  });
  let g = '';
  links.forEach(lk => {
    const a = pts.find(p => p.v.id === lk.from), b = pts.find(p => p.v.id === lk.to);
    if (!a || !b) return;
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const ax = a.x + Math.cos(ang) * 30, ay = a.y + Math.sin(ang) * 30;
    const bx = b.x - Math.cos(ang) * 30, by = b.y - Math.sin(ang) * 30;
    g += edge(ax, ay, bx, by, lk.sign === '+' ? 'pos' : 'neg');
  });
  pts.forEach(p => {
    g += `<circle class="vz-node" cx="${p.x}" cy="${p.y}" r="26"/>`;
    g += `<text class="vz-text" x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="11">${esc(p.v.label)}</text>`;
  });
  const type = s.loopType === 'balancing' ? '调节回路（自我修正）' : '增强回路（自我强化）';
  g += `<text class="vz-text-dim" x="${cx}" y="${H - 10}" text-anchor="middle" font-size="10.5">${esc(type)}</text>`;
  return svgWrap(W, H, g);
}

function vNetwork(s) {
  const nodes = s.nodes || [];
  const edges = s.edges || [];
  const W = 470, H = 240;
  const pts = nodes.map((nd, i) => {
    const ang = -Math.PI / 2 + i * (2 * Math.PI / nodes.length);
    return { x: 235 + Math.cos(ang) * 110, y: 120 + Math.sin(ang) * 95, nd };
  });
  let g = '';
  edges.forEach(e => {
    const a = pts.find(p => p.nd.id === e.from), b = pts.find(p => p.nd.id === e.to);
    if (a && b) g += edge(a.x, a.y, b.x, b.y);
  });
  pts.forEach(p => {
    g += `<circle class="vz-node" cx="${p.x}" cy="${p.y}" r="22"/>`;
    g += `<text class="vz-text" x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="10.5">${esc(p.nd.label)}</text>`;
  });
  return svgWrap(W, H, g);
}

function vTradeoff(s) {
  // 谈判区间：利益 / 替代方案(BATNA) / 底线 / 可达成区间
  const lo = s.zone ? s.zone[0] : 0, hi = s.zone ? s.zone[1] : 100;
  const W = 470, H = 150;
  const x0 = 30, x1 = 440, span = x1 - x0;
  const px = v => x0 + (v / 100) * span;
  let g = '';
  g += `<line class="vz-axis" x1="${x0}" y1="70" x2="${x1}" y2="70"/>`;
  // 可达成区间
  g += `<rect class="vz-zone" x="${px(lo)}" y="56" width="${px(hi) - px(lo)}" height="28" rx="4"/>`;
  if (s.reservation != null) {
    g += `<line class="vz-resline" x1="${px(s.reservation)}" y1="40" x2="${px(s.reservation)}" y2="100"/>`;
    g += `<text class="vz-text-dim" x="${px(s.reservation)}" y="34" text-anchor="middle" font-size="10">底线 ${s.reservation}</text>`;
  }
  if (s.batna != null) {
    g += `<line class="vz-batnaline" x1="${px(s.batna)}" y1="40" x2="${px(s.batna)}" y2="100"/>`;
    g += `<text class="vz-text-dim" x="${px(s.batna)}" y="116" text-anchor="middle" font-size="10">替代方案 ${s.batna}</text>`;
  }
  g += `<text class="vz-text-root" x="${(px(lo) + px(hi)) / 2}" y="72" text-anchor="middle" font-size="11">可达成区间 ${lo}–${hi}</text>`;
  g += `<text class="vz-text-dim" x="${x0}" y="128" text-anchor="start" font-size="9.5">· 拖动底线/替代方案边界，看区间如何变化 ·</text>`;
  return `<div class="vz-tradeoff" data-lo="${lo}" data-hi="${hi}" data-res="${s.reservation != null ? s.reservation : ''}" data-batna="${s.batna != null ? s.batna : ''}">${svgWrap(W, H, g)}</div>`;
}

function vProbability(s) {
  // 贝叶斯：先验 / 证据似然 / 后验
  const prior = s.prior != null ? s.prior : 0.1;
  const sens = s.sensitivity != null ? s.sensitivity : 0.8; // P(证据|假设)
  const fp = s.falsePositive != null ? s.falsePositive : 0.1; // P(证据|¬假设)
  const W = 470, H = 200;
  const posterior = (prior * sens) / (prior * sens + (1 - prior) * fp);
  const x0 = 40, x1 = 430;
  const bar = (y, val, color, name, fmt) => {
    const w = val * (x1 - x0);
    return `<text class="vz-text" x="${x0 - 6}" y="${y}" text-anchor="end" dominant-baseline="central" font-size="10.5">${esc(name)}</text>` +
      `<rect class="vz-bar" x="${x0}" y="${y - 9}" width="${Math.max(2, w)}" height="18" rx="3" fill="${color}"/>` +
      `<text class="vz-text-root" x="${x0 + Math.max(2, w) + 6}" y="${y}" dominant-baseline="central" font-size="10.5">${fmt ? fmt(val) : Math.round(val * 100) + '%'}</text>`;
  };
  let g = '';
  g += bar(40, prior, C.line, '先验');
  g += bar(80, sens, C.pos, '真阳性率');
  g += bar(120, fp, C.neg, '假阳性率');
  g += bar(165, posterior, C.accent, '后验', v => Math.round(v * 100) + '%');
  return `<div class="vz-prob" data-prior="${prior}" data-sens="${sens}" data-fp="${fp}">${svgWrap(W, H, g)}<div class="vz-prob-readout">后验概率 = <b>${Math.round(posterior * 100)}%</b></div></div>`;
}

function vArgument(s) {
  const premises = s.premises || [];
  const ev = s.evidence || [];
  const conclusion = s.conclusion || '';
  const W = 470;
  const H = 40 + premises.length * 30 + ev.length * 24 + 50;
  let g = '';
  let y = 30;
  premises.forEach((p, i) => {
    g += `<rect class="vz-box" x="40" y="${y - 14}" width="390" height="26" rx="5"/>`;
    g += `<text class="vz-text" x="52" y="${y}" dominant-baseline="central" font-size="11">前提${i + 1}：${esc(p)}</text>`;
    y += 30;
  });
  ev.forEach(e => {
    g += `<text class="vz-text-dim" x="56" y="${y}" dominant-baseline="central" font-size="10">· 证据：${esc(e)}</text>`;
    y += 24;
  });
  g += `<line class="vz-divider" x1="40" y1="${y}" x2="430" y2="${y}"/>`;
  y += 26;
  g += `<rect class="vz-box-root" x="40" y="${y - 16}" width="390" height="30" rx="5"/>`;
  g += `<text class="vz-text-root" x="52" y="${y - 1}" dominant-baseline="central" font-size="11.5">结论：${esc(conclusion)}</text>`;
  return svgWrap(W, H, g);
}

function vBeforeAfter(s) {
  // before/after 优先；兼容挂载在 compare 型 block 上的 left/right 写法
  const b = s.before || s.left || {};
  const a = s.after || s.right || {};
  const W = 470, H = 60 + Math.max((b.items || []).length, (a.items || []).length) * 30;
  const colW = 195, leftX = 15, rightX = W - 15 - colW;
  let g = '';
  g += `<line class="vz-divider" x1="235" y1="20" x2="235" y2="${H - 16}"/>`;
  g += `<text class="vz-text-root" x="${leftX + colW / 2}" y="38" text-anchor="middle">${esc(b.title || '之前')}</text>`;
  (b.items || []).forEach((it, i) => {
    const y = 62 + i * 30;
    g += `<text class="vz-text" x="${leftX + 8}" y="${y}" dominant-baseline="central" font-size="11">✕ ${esc(it)}</text>`;
  });
  g += `<text class="vz-text-root" x="${rightX + colW / 2}" y="38" text-anchor="middle">${esc(a.title || '之后')}</text>`;
  (a.items || []).forEach((it, i) => {
    const y = 62 + i * 30;
    g += `<text class="vz-text" x="${rightX + 8}" y="${y}" dominant-baseline="central" font-size="11">✓ ${esc(it)}</text>`;
  });
  return svgWrap(W, H, g);
}

// 简约线条场景插画（行为 / 实验 / 案例），不是万能圆圈
function vScene(s) {
  const W = 470, H = 200;
  const kind = s.scene || 'generic';
  let g = '';
  // 地面
  g += `<line class="vz-edge" x1="20" y1="${H - 30}" x2="${W - 20}" y2="${H - 30}"/>`;
  if (kind === 'experiment') {
    // 实验场景：两个受试者 + 一台仪器
    g += `<circle class="vz-node" cx="120" cy="${H - 60}" r="16"/><text class="vz-text" x="120" y="${H - 56}" text-anchor="middle" font-size="10">甲</text>`;
    g += `<circle class="vz-node" cx="200" cy="${H - 60}" r="16"/><text class="vz-text" x="200" y="${H - 56}" text-anchor="middle" font-size="10">乙</text>`;
    g += `<rect class="vz-box" x="300" y="${H - 80}" width="70" height="44" rx="5"/><text class="vz-text" x="335" y="${H - 58}" text-anchor="middle" font-size="9">仪器</text>`;
    g += edge(216, H - 60, 300, H - 64);
  } else if (kind === 'behavior') {
    // 行为场景：人面对两个选项
    g += `<circle class="vz-node" cx="90" cy="${H - 60}" r="16"/><text class="vz-text" x="90" y="${H - 56}" text-anchor="middle" font-size="10">你</text>`;
    g += `<rect class="vz-box" x="250" y="${H - 76}" width="64" height="40" rx="5"/><text class="vz-text" x="282" y="${H - 56}" text-anchor="middle" font-size="9">选项A</text>`;
    g += `<rect class="vz-box" x="360" y="${H - 76}" width="64" height="40" rx="5"/><text class="vz-text" x="392" y="${H - 56}" text-anchor="middle" font-size="9">选项B</text>`;
    g += edge(106, H - 60, 250, H - 60);
    g += edge(106, H - 60, 360, H - 60);
  } else {
    g += `<circle class="vz-node" cx="${W / 2}" cy="${H - 60}" r="16"/>`;
    g += `<text class="vz-text" x="${W / 2}" y="${H - 56}" text-anchor="middle" font-size="10">${esc(s.caption || '场景')}</text>`;
  }
  if (s.caption) g += `<text class="vz-text-dim" x="20" y="24" text-anchor="start" font-size="10">${esc(s.caption)}</text>`;
  return svgWrap(W, H, g);
}

function vSandbox(s) {
  // 通用交互：用户改变量立即看结果。spec.variables + spec.outcome(fn 无法序列化，用 outcomeTable)
  const vars = s.variables || [];
  const W = 470, H = 60 + vars.length * 46 + 40;
  let g = '';
  vars.forEach((v, i) => {
    const y = 40 + i * 46;
    g += `<text class="vz-text" x="30" y="${y}" dominant-baseline="central" font-size="11">${esc(v.label)}</text>`;
    g += `<text class="vz-slider-val" x="400" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="11" data-vi="${i}">${v.value}</text>`;
  });
  g += `<text class="vz-text-dim" x="30" y="${H - 18}" font-size="10">拖动滑块改变变量，下方结果实时更新</text>`;
  return `<div class="vz-sandbox" data-vars='${esc(JSON.stringify(vars))}'>${svgWrap(W, H, g)}<div class="vz-sandbox-out"></div></div>`;
}

// ---------- 公共入口 ----------

export function buildVisualHTML(spec) {
  const t = spec.visualType;
  let body = '';
  switch (t) {
    case 'concept_model': body = vConceptModel(spec); break;
    case 'causal_model': body = vCausalModel(spec); break;
    case 'decision_tree': body = vDecisionTree(spec); break;
    case 'game_matrix': body = vGameMatrix(spec); break;
    case 'comparison': body = vComparison(spec); break;
    case 'process_mechanism': body = vProcess(spec); break;
    case 'feedback_loop': body = vFeedbackLoop(spec); break;
    case 'network_system': body = vNetwork(spec); break;
    case 'tradeoff_model': body = vTradeoff(spec); break;
    case 'probability_model': body = vProbability(spec); break;
    case 'argument_structure': body = vArgument(spec); break;
    case 'before_after': body = vBeforeAfter(spec); break;
    case 'experiment_scene': body = vScene({ ...spec, scene: 'experiment' }); break;
    case 'behavior_scene': body = vScene({ ...spec, scene: 'behavior' }); break;
    case 'case_simulation': body = vScene({ ...spec, scene: 'generic' }); break;
    case 'interactive_sandbox': body = vSandbox(spec); break;
    default: body = `<div class="vz-empty">暂无可程序化绘制的图解</div>`;
  }
  const notes = (spec.annotations || []).map(a => `<div class="vz-note">${esc(a)}</div>`).join('');
  const q = spec.visualQuestion ? `<div class="vz-question">${esc(spec.visualQuestion)}</div>` : '';
  const title = spec.visualTitle ? `<div class="vz-title">${esc(spec.visualTitle)}</div>` : '';
  return `<div class="kp-viz">${title}${body}${q}${notes}</div>`;
}

export function renderVisualInto(container, spec) {
  container.innerHTML = buildVisualHTML(spec);
  container.classList.add('kp-viz-wrap');
  bindVisualInteractions(container);
  return container;
}

export function bindVisualInteractions(container) {
  // 博弈矩阵：点击单元格高亮该行/列，显示纳什与"单方面改变策略"后果
  const game = container.querySelector('.vz-game');
  if (game) {
    const rows = JSON.parse(game.dataset.rows), cols = JSON.parse(game.dataset.cols);
    const pay = JSON.parse(game.dataset.pay), nash = JSON.parse(game.dataset.nash);
    const readout = game.querySelector('.vz-game-readout');
    game.querySelectorAll('.vz-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        game.querySelectorAll('.vz-cell-rect').forEach(r => r.classList.remove('vz-sel'));
        cell.querySelector('.vz-cell-rect').classList.add('vz-sel');
        const i = +cell.dataset.i, j = +cell.dataset.j;
        const isNash = nash.some(p => p[0] === i && p[1] === j);
        const p = pay[i][j];
        let txt = `你选「${rows[i]}」、对方选「${cols[j]}」 → 你得 ${p[0]}，对方得 ${p[1]}。`;
        if (isNash) txt += ' 这是纳什均衡：任何一方单方面改策略都不会更好。';
        else txt += ' 非均衡：至少有一方可以通过单方面改变策略来改善自己的收益。';
        readout.textContent = txt;
      });
    });
  }
  // 概率模型：滑块（用只读展示，交互通过点击区域切换先验档位）
  const prob = container.querySelector('.vz-prob');
  if (prob) {
    const priors = [0.01, 0.05, 0.1, 0.3, 0.5];
    let idx = priors.indexOf(+prob.dataset.prior);
    if (idx < 0) idx = 2;
    const recompute = () => {
      const pr = priors[idx];
      const sens = +prob.dataset.sens, fp = +prob.dataset.fp;
      const post = (pr * sens) / (pr * sens + (1 - pr) * fp);
      prob.querySelector('.vz-prob-readout').innerHTML = `当前先验 ${Math.round(pr * 100)}% → 后验概率 = <b>${Math.round(post * 100)}%</b>（点图区切换先验）`;
    };
    prob.querySelector('.vz-svg').style.cursor = 'pointer';
    prob.querySelector('.vz-svg').addEventListener('click', () => {
      idx = (idx + 1) % priors.length; recompute();
    });
    recompute();
  }
}
