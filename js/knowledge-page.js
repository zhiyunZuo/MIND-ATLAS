// ============================================================
// MIND ATLAS — Knowledge Page（真实书本：左右双页跨页 + 纸角翻页）
// · 按内容“真实高度”流动排版到左右两页（跨页为一个阅读单元）
// · 翻页由页角（纸角/页边）触发，绕书脊做 3D 纸张翻转，可见纸张背面与下一页
// · 保留：结构化富渲染 + 内联图解；不改动羊皮纸书页与整体美术方向
// ============================================================

import { getTopicContent } from '../data/atlas-data.js';
import { getTopicImage } from '../data/topic-images.js';
import { getTopicBoard } from '../data/topic-boards.js';
import { buildVisualHTML, bindVisualInteractions } from './visual-explanations.js';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 递归把任意字段值转成纯文本，用于判断字段是否为空
function plainText(v) {
  if (v == null || v === '') return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(plainText).join('');
  if (typeof v === 'object') {
    if (Array.isArray(v.blocks)) return v.blocks.map(plainText).join('');
    if (v.type === 'steps' || v.type === 'process_mechanism')
      return (v.items || v.steps || []).map(it => plainText(it.title) + plainText(it.text)).join('');
    if (v.type === 'points') return (v.items || []).map(it => plainText(it.title) + plainText(it.text)).join('');
    if (v.type === 'causal') return plainText(v.cause) + plainText(v.process) + plainText(v.result);
    if (v.type === 'compare') return plainText(v.left) + plainText(v.right);
    if (v.type === 'note') return plainText(v.text);
    if (v.type === 'para') return plainText(v.text);
    if (v.steps) return plainText({ type: 'steps', items: v.steps });
    if (v.left && v.right) return plainText({ type: 'compare', left: v.left, right: v.right });
    if (v.cause) return plainText({ type: 'causal', cause: v.cause, process: v.process, result: v.result });
    if (v.items && !v.title) return plainText({ type: 'points', items: v.items });
    if (v.text != null) return plainText(v.text);
  }
  return '';
}

// —— 章节小标题（统一英文）——
const SEC = {
  CORE: 'Core Concept',
  VISUAL: 'Visual',
  WHY: 'Why It Matters',
  MECH: 'Mechanism',
  CASE: 'Case Study',
  THOUGHT: 'Thought Experiment',
  PRACTICE_USE: 'In Practice',
  PITFALLS: 'Common Pitfalls',
  LINKS: 'Connections',
  PRACTICE: 'Practice',
  SOURCES: 'Sources'
};

// ============================================================
// 长文划线：关键句 + 关键词 / 逻辑点
// 枯燥的整段文字里，把「真正需要理解的那句话」划出来，
// 并把句中的逻辑连接词、数字、术语做荧光标记，读者一眼抓住要点。
// ============================================================

// 逻辑点 / 结构性词：划线后能看出推论的走向
const LOGIC_RE = /(因此|所以|因而|故而|于是|然而|但是|不过|却|因为|由于|本质上|实质上|关键在|核心是|重点是|结论是|换句话说|也就是说|换言之|这意味着|前提是|结果是|取决于|决定了|导致了|不是[^，。；]{0,10}而是)/g;
// 数字与量：结论往往落在数上
const NUM_RE = /(\d+(?:\.\d+)?\s*(?:%|％|倍|成|个百分点|年|个月|天|小时|分钟|秒|美元|元|万|亿|人|次|项|种|倍多)?)/g;
// 书名号 / 引号里的术语（内容不含句读，避免把整段引文误当成术语）
const TERM_RE = /([「『【《“"]([^「『【《“”"」』】》”"，。；！？、；]{2,12})[」』】》”"])/g;

// 关键句的信号：带结论、带转折、带判断
const CLAIM_RE = /(因此|所以|因而|故而|可见|总之|结论|这意味着|也就是说|换句话说|换言之|关键在|核心是|本质(上|是)|重点(在|是)|其实|真正的|并不是|并非|恰恰|反而|决定了|取决于)/;

// budget / logic / seen 由调用方按“整段”共享：同一段里同一个词只划一次，总量受控
function markTerms(text, st) {
  const hits = [];
  const collect = (re, kind) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      hits.push({ start: m.index, end: m.index + m[0].length, kind });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  };
  collect(TERM_RE, 't');
  collect(NUM_RE, 'n');
  collect(LOGIC_RE, 'l');
  if (!hits.length) return esc(text);

  hits.sort((a, b) => (a.start - b.start) || (b.end - a.start) - (a.end - a.start));
  const picked = [];
  let lastEnd = -1;
  for (const h of hits) {
    if (h.start < lastEnd) continue;                       // 重叠 → 保留先出现的
    if (st.budget <= 0) break;
    const raw = text.slice(h.start, h.end);
    if (st.seen.has(raw)) continue;                        // 同一个词整段只划一次
    if (h.kind === 'l' && st.logic <= 0) continue;         // 逻辑点限量
    st.seen.add(raw); st.budget--;
    if (h.kind === 'l') st.logic--;
    picked.push(h); lastEnd = h.end;
  }
  if (!picked.length) return esc(text);

  let out = '', pos = 0;
  for (const h of picked) {
    out += esc(text.slice(pos, h.start));
    out += `<em class="kp-ul kp-ul-${h.kind}">${esc(text.slice(h.start, h.end))}</em>`;
    pos = h.end;
  }
  return out + esc(text.slice(pos));
}

function splitSents(text) {
  const out = [];
  let buf = '';
  for (const ch of (text || '')) {
    buf += ch;
    if ('。！？；!?;'.includes(ch)) { out.push(buf); buf = ''; }
  }
  if (buf.trim()) out.push(buf);
  return out.filter(s => s.trim());
}

// 长段落：挑出“关键句”整句划线，其余句子里的关键词做点状标记
function markParagraph(text) {
  if (!text) return '';
  const pure = text.replace(/\s/g, '');
  // 短段落不划线：本身已经凝练，再划会显得噪音
  if (pure.length < 42) return markTerms(text, freshState(pure.length));

  const sents = splitSents(text);
  if (sents.length < 2) return markTerms(text, freshState(pure.length));

  let bi = -1, bs = 0;
  sents.forEach((s, i) => {
    let sc = 0;
    if (CLAIM_RE.test(s)) sc += 3;
    if (NUM_RE.test(s)) { NUM_RE.lastIndex = 0; sc += 1.5; }
    if (i === sents.length - 1) sc += 1;      // 段尾常是落点
    if (i === 0) sc += 0.5;
    if (s.length < 14) sc -= 1;               // 太短不像关键句
    if (s.length > 90) sc -= 0.5;
    if (sc > bs) { bs = sc; bi = i; }
  });
  const st = freshState(pure.length);
  let out = '';
  sents.forEach((s, i) => {
    const html = markTerms(s, st);
    out += (i === bi && bs >= 2) ? `<span class="kp-key-sent">${html}</span>` : html;
  });
  return out;
}

// 一整段的划线额度：段越长给得越多，但每段上限 4 处、逻辑点上限 2 处
function freshState(len) {
  const budget = len >= 150 ? 4 : (len >= 90 ? 3 : 2);
  return { budget, logic: len >= 120 ? 2 : 1, seen: new Set() };
}

// ============================================================
// 智能分段：只有「同一体系 + 顺序递增」的编号才拆成步骤
// 旧版把所有数字+标点都当编号，导致「第三变量」「第一性原理」「2.5倍」
// 被拦腰切断，且第一个编号之前的整段内容被丢弃 —— 已全部重写。
// ============================================================
const CIRCLED = { '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5, '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9 };
const CN_DIGIT = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const WORD_SEQ = ['首先', '其次', '再次', '接着', '然后', '最后'];
const QI_SEQ = ['其一', '其二', '其三', '其四', '其五'];
const YI_SEQ = ['一是', '二是', '三是', '四是', '五是'];
// 步骤项最短字符数：低于此值判定为误切，整段退回普通段落
const MIN_ITEM = 12, MIN_ITEM_WORD = 18;

function cnVal(s) {
  if (s === '十') return 10;
  if (s[0] === '十') return 10 + (CN_DIGIT[s[1]] || 0);
  if (s[1] === '十') return (CN_DIGIT[s[0]] || 0) * 10 + (CN_DIGIT[s[2]] || 0);
  return CN_DIGIT[s] || 0;
}

// 找出所有“候选编号”，各自标注体系族与序号
function findMarkers(s) {
  const out = [];
  const scan = (src, fn) => { const r = new RegExp(src, 'g'); let m; while ((m = r.exec(s))) fn(m); };

  scan('[①-⑨]', m => out.push({ idx: m.index, len: 1, fam: 'circle', val: CIRCLED[m[0]] }));
  scan('[(（]\\s?([1-9]|1[0-2])\\s?[)）]', m => out.push({ idx: m.index, len: m[0].length, fam: 'paren', val: +m[1] }));
  // 1） / 2、 / 3. —— 前面必须是句首或标点（不含括号，括号形式交给上一条），
  // 后面不能紧跟数字（排除 2.5、0.3 这类小数）
  scan('(?:^|[。：:；;，、\\s])([1-9]|1[0-2])[)）、．.](?![0-9])', m => {
    const len = m[1].length + 1;
    out.push({ idx: m.index + m[0].length - len, len, fam: 'num', val: +m[1] });
  });
  // 第一、/ 第二步 —— 必须后接标点或“点/步”，避免切到「第一性原理」「第三变量」
  scan('第[一二三四五六七八九十]+(?=[、，,：:点步])', m =>
    out.push({ idx: m.index, len: m[0].length, fam: 'cn', val: cnVal(m[0].slice(1)) }));

  WORD_SEQ.forEach((w, i) => scan(w, m => out.push({ idx: m.index, len: w.length, fam: 'word', val: i })));
  QI_SEQ.forEach((w, i) => scan(w, m => out.push({ idx: m.index, len: w.length, fam: 'qi', val: i })));
  YI_SEQ.forEach((w, i) => scan(w, m => out.push({ idx: m.index, len: w.length, fam: 'yi', val: i })));
  return out;
}

function splitTitleText(chunk) {
  const m = chunk.match(/^(.{2,18}?)[。；;](.*)$/s);
  if (m && m[2].trim()) return { title: m[1].trim(), text: m[2].trim() };
  const d = chunk.match(/^(.{2,20}?)——\s*(.+)$/s);   // 「术语——解释」结构：前半作小标题
  if (d && d[2].trim()) return { title: d[1].trim(), text: d[2].trim() };
  return { title: '', text: chunk };
}

function autoStructure(s) {
  s = (s || '').trim();
  if (!s) return null;
  const marks = findMarkers(s);
  if (marks.length < 2) return null;

  const fams = {};
  for (const m of marks) (fams[m.fam] = fams[m.fam] || []).push(m);

  let best = null;
  for (const fam of Object.keys(fams)) {
    const L = fams[fam].slice().sort((a, b) => a.idx - b.idx);
    if (L.length < 2) continue;
    let ok = true;
    for (let i = 1; i < L.length; i++) {
      if (L[i].val <= L[i - 1].val || L[i].idx < L[i - 1].idx + L[i - 1].len) { ok = false; break; }
    }
    if (!ok) continue;
    // 数字编号必须从 1 起，避免从半路开始的错误切分
    if (!['word', 'qi', 'yi'].includes(fam) && L[0].val !== 1) continue;

    const items = [];
    for (let i = 0; i < L.length; i++) {
      const start = L[i].idx + L[i].len;
      const end = (i + 1 < L.length) ? L[i + 1].idx : s.length;
      const chunk = s.slice(start, end).trim().replace(/^[，。、；：\s]+/, '');
      if (!chunk) { ok = false; break; }
      items.push(splitTitleText(chunk));
    }
    if (!ok || items.length < 2) continue;

    // 任何一项过短 → 判定为误切，整段退回普通段落（宁可不编号，也不能出现残缺项）
    const min = (['word', 'qi', 'yi'].includes(fam) ? MIN_ITEM_WORD : MIN_ITEM);
    const lens = items.map(it => ((it.title || '') + (it.text || '')).replace(/\s/g, '').length);
    if (Math.min(...lens) < min) continue;

    const intro = s.slice(0, L[0].idx).trim().replace(/[，、；：]$/, '');   // 编号之前的内容不能丢
    if (!best || items.length > best.items.length) best = { type: 'steps', items, intro };
  }
  return best;
}

export class KnowledgePage {
  constructor() {
    this.page = document.getElementById('knowledge-page');
    this.book = document.getElementById('kp-book');
    this.leftEl = document.getElementById('kp-left');
    this.rightEl = document.getElementById('kp-right');
    this.spreadEl = document.getElementById('kp-spread');
    this.measureEl = document.getElementById('kp-measure');
    this.closeBtn = document.getElementById('kp-close');
    this.cornerNext = document.getElementById('kp-corner-next');
    this.cornerPrev = document.getElementById('kp-corner-prev');
    this.onClose = null;

    this.spreads = [];
    this.spreadIdx = 0;
    this._turning = false;
    this._measureW = 320;
    this._measureH = 480;

    this.closeBtn.addEventListener('click', () => { this.hide(); if (this.onClose) this.onClose(); });
    this.cornerNext.addEventListener('click', (e) => { e.stopPropagation(); this.turnNext(); });
    this.cornerPrev.addEventListener('click', (e) => { e.stopPropagation(); this.turnPrev(); });

    document.addEventListener('keydown', (e) => {
      if (!this.isVisible()) return;
      if (e.key === 'Escape') { this.hide(); if (this.onClose) this.onClose(); }
      else if (e.key === 'ArrowRight') this.turnNext();
      else if (e.key === 'ArrowLeft') this.turnPrev();
    });
  }

  // ----------------------------------------------------------
  // 打开某个知识点
  // ----------------------------------------------------------
  show(topic, subject) {
    const content = getTopicContent(subject.id, topic.id) || {};

    // 确保可测量（#knowledge-page 靠 .visible 切 display:none/flex）
    this.page.classList.remove('visible');
    void this.page.offsetWidth;
    this.page.classList.add('visible');
    void this.page.offsetWidth;

    this._prepareMeasure();

    const units = this._buildUnits(content, subject.id, topic.id, topic.title);
    this._measureUnits(units);

    const Hp = this._measureH;
    let cols = this._pack(units, Hp);
    // 均衡各页密度：以“总高 / 页数”作为目标列高重排，让内容均匀铺开，避免某页大面积留白
    const totalH = units.reduce((s, u) => s + u.h, 0);
    const N = cols.length;
    let dbgTarget = null, dbgC2 = null;
    if (N > 1) {
      let target = Math.min(Hp, Math.max(Hp * 0.72, totalH / N));
      dbgTarget = Math.round(target);
      const c2 = this._pack(units, target);
      dbgC2 = c2.length;
      if (c2.length <= N && c2.every(c => c.h <= Hp + 1)) cols = c2;
    }
    this._placePlate(cols, Hp);
    this._alignPlates(cols);
    this._balanceCols(cols, Hp);
    this._fixOrphanHeadings(cols);
    // 保险：任何列超页高（内容会被裁）→ 回退为按整页高的干净打包
    if (cols.some(c => c.h > Hp + 2)) {
      cols = this._pack(units, Hp);
      this._alignPlates(cols);
    }
    const spreads = this._colsToSpreads(cols);
    spreads.unshift({ cover: true, topicTitle: topic.title, subjectTitle: subject.title, lead: content.lead });

    this.spreads = spreads;
    this.spreadIdx = 0;
    this._turning = false;
    // 调试快照（不影响功能）
    this.debug = {
      Hp: this._measureH, W: this._measureW,
      units: units.map(u => ({ t: u.type, h: u.h, chrome: u.chrome })),
      totalH: Math.round(totalH), N, target: dbgTarget, c2len: dbgC2,
      cols: cols.map(c => Math.round(c.h))
    };
    this.measureEl.innerHTML = '';   // 清空测量层，避免残留内容干扰 DOM 查询
    this._renderSpread();
  }

  hide() { this.page.classList.remove('visible'); }
  isVisible() { return this.page.classList.contains('visible'); }

  // ----------------------------------------------------------
  // 测量基准：真实页内宽与页内容高
  // ----------------------------------------------------------
  _prepareMeasure() {
    const cs = getComputedStyle(this.rightEl);
    const padX = parseFloat(cs.paddingLeft) || 0;
    const padY = parseFloat(cs.paddingTop) || 0;
    this._measureW = Math.max(180, Math.round(this.rightEl.clientWidth - padX * 2));
    this._measureH = Math.max(200, Math.round(this.rightEl.clientHeight - padY * 2));
    this.measureEl.style.width = this._measureW + 'px';
  }

  _measureUnits(units) {
    if (!units.length) return;
    this.measureEl.innerHTML = units.map(u => `<div class="kp-mu">${u.html}</div>`).join('');
    const mus = this.measureEl.children;
    for (let i = 0; i < units.length; i++) {
      units[i].h = mus[i] ? mus[i].offsetHeight : 24;
    }
  }

  _measureHTML(html) {
    this.measureEl.innerHTML = `<div class="kp-mu">${html}</div>`;
    const el = this.measureEl.firstElementChild;
    return el ? el.offsetHeight : 24;
  }

  // ----------------------------------------------------------
  // 构建“流动单元”：段落可拆，列表/对比/因果/图解为原子块
  // ----------------------------------------------------------
  _buildUnits(content, subjectId, topicId, topicTitle) {
    const U = [];
    const head = (t) => U.push({ type: 'heading', html: `<div class="kp-section-title"><span class="kp-sec-en">${esc(t)}</span></div>` });

    // 整版插图 + 知识点板书：落在正文里，紧跟“核心概念”之后，而不是漂浮在章首
    const plate = this._plateUnit(subjectId, topicId, topicTitle);

    head(SEC.CORE);
    this._valueUnits(content.concept, U);

    if (plate) U.push(plate);

    if (content.visual) {
      head(SEC.VISUAL);
      U.push(this._visualUnit(`<div class="kp-viz-wrap">${buildVisualHTML(content.visual)}</div>`));
    }

    const rest = [
      [SEC.WHY, content.whyItMatters],
      [SEC.MECH, content.mechanism],
      [SEC.CASE, content.example],
      [SEC.THOUGHT, content.experiment],
      [SEC.PRACTICE_USE, content.application],
      [SEC.PITFALLS, content.commonMistakes],
      [SEC.LINKS, content.connection]
    ];
    for (const [t, v] of rest) {
      if (v == null || plainText(v).trim() === '') continue;
      head(t);
      this._valueUnits(v, U);
    }

    if (content.practice && plainText(content.practice).trim() !== '') {
      head(SEC.PRACTICE);
      const p = content.practice;
      if (p.question) U.push({ type: 'unit', html: `<p class="kp-para">${esc(p.question)}</p>` });
      if (p.hint) U.push({ type: 'unit', html: `<p class="kp-hint-line">${esc('Hint')} · ${esc(p.hint)}</p>` });
      if (p.answer) U.push({ type: 'unit', html: `<details class="kp-practice"><summary>${esc('Show Analysis')}</summary><div class="kp-practice-answer">${esc(p.answer)}</div></details>` });
    }

    if (content.sources && Array.isArray(content.sources) && content.sources.length) {
      head(SEC.SOURCES);
      U.push({ type: 'unit', html: `<ul class="kp-sources">${content.sources.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` });
    }

    return U;
  }

  // ----------------------------------------------------------
  // 整版插图：AI 场景作底 + 页面上叠印该知识点的讲解板书
  // （中文交给真实文本渲染，避免图像模型把字画扭曲）
  // ----------------------------------------------------------
  _plateUnit(subjectId, topicId, topicTitle) {
    const img = getTopicImage(subjectId, topicId);
    if (!img || !img.file) return null;
    const board = getTopicBoard(subjectId, topicId);
    const mode = (board && board.mode) || img.mode || 'board';
    // 板书型：画面本身就是一块留白的板，讲解全在板上，不必再写图注；
    // 场景型：图说卡讲知识点，图注讲「画面里正在发生什么」，二者互补。
    const cap = (mode === 'scene' && img.caption)
      ? `<figcaption class="kp-figure-cap">${esc(img.caption)}</figcaption>` : '';
    return {
      type: 'figure',
      plate: true,
      html: `<figure class="kp-figure kp-figure-plate kp-plate-${esc(mode)}">` +
        `<div class="kp-plate">` +
        `<img class="kp-plate-bg" src="${esc(img.file)}" alt="${esc(topicTitle || '')}" width="1280" height="853">` +
        (board ? this._boardHTML(board) : '') +
        `</div>` + cap +
        `</figure>`
    };
  }

  _boardHTML(b) {
    const a = b.area || { x: 7, y: 6, w: 86, h: 60 };
    const css = `left:${a.x}%;top:${a.y}%;width:${a.w}%;height:${a.h}%`;
    const head = `<div class="kp-board-head">` +
      `<div class="kp-board-title">${esc(b.title || '')}</div>` +
      (b.sub ? `<div class="kp-board-sub">${esc(b.sub)}</div>` : '') + `</div>`;
    const expr = b.expr ? `<div class="kp-board-expr">${esc(b.expr)}</div>` : '';
    const flow = (b.flow && b.flow.length)
      ? `<div class="kp-board-flow">` + b.flow.map((s, i) =>
        `<span class="kp-board-step">${esc(s)}</span>` +
        (i < b.flow.length - 1 ? `<span class="kp-board-arrow">→</span>` : '')).join('') + `</div>`
      : '';
    const lines = (b.lines && b.lines.length)
      ? `<div class="kp-board-lines">` + b.lines.map(l =>
        `<div class="kp-board-line"><span class="kp-board-k">${esc(l.k)}</span>` +
        `<span class="kp-board-v">${esc(l.v)}</span></div>`).join('') + `</div>`
      : '';
    const eg = b.eg ? `<div class="kp-board-eg">${esc(b.eg)}</div>` : '';
    const end = b.end ? `<div class="kp-board-end"><span class="kp-board-mark">∴</span><span>${esc(b.end)}</span></div>` : '';
    const tone = b.tone || 'chalk';
    // 场景型图说卡：改两栏排版（核心句 / 要点），高度只有板书的一半，画面露得更多
    if (tone === 'card') {
      return `<div class="kp-board" data-tone="card" style="${css}">` +
        `<div class="kp-card-l">${head}${expr}</div>` +
        `<div class="kp-card-r">${lines}${eg}</div>` +
        `</div>`;
    }
    return `<div class="kp-board" data-tone="${esc(tone)}" style="${css}">` +
      head + expr + flow + lines + eg + end + `</div>`;
  }

  _valueUnits(value, U) {
    if (value == null || value === '') return;
    if (typeof value === 'string') {
      const st = autoStructure(value);
      if (st) {
        // 编号之前的导语句照常成段，绝不因为拆步骤而丢内容
        if (st.intro) U.push({ type: 'para', html: this._paraHTML(st.intro), text: st.intro });
        this._pushSteps(st.items, U);
      } else U.push({ type: 'para', html: this._paraHTML(value), text: value });
      return;
    }
    if (Array.isArray(value)) { value.forEach(v => this._valueUnits(v, U)); return; }
    if (typeof value === 'object') {
      if (Array.isArray(value.blocks)) { value.blocks.forEach(b => this._blockUnits(b, U)); return; }
      this._blockUnits(value, U);
    }
  }

  _blockUnits(b, U) {
    if (!b || typeof b !== 'object') return;
    const type = b.type;
    if (type === 'steps' || type === 'process_mechanism') {
      const items = type === 'process_mechanism' ? (b.steps || []) : (b.items || []);
      this._pushSteps(items, U);
    } else if (type === 'points' || (b.items && !b.title)) {
      this._pushPoints(b.items || [], U);
    } else if (type === 'compare' || (b.left && b.right)) {
      U.push({ type: 'unit', html: this._compareHTML(b) });
    } else if (type === 'causal' || b.cause) {
      U.push({ type: 'unit', html: this._causalHTML(b) });
    } else if (type === 'note') {
      U.push({ type: 'unit', html: `<div class="kp-note">${esc(b.text || '')}</div>` });
    } else if (b.steps) {
      U.push({ type: 'unit', html: this._stepsHTML(b.steps) });
    } else if (type === 'para' || b.text != null) {
      const txt = b.text || '';
      if (txt) U.push({ type: 'para', html: this._paraHTML(txt), text: txt });
    }
    if (b.visual) U.push(this._visualUnit(`<div class="kp-viz-wrap">${buildVisualHTML({ ...b, ...b.visual })}</div>`));
  }

  // 图解单元：额外量出"非图形部分（标题/问句/注释/边距）"的高度，便于按剩余空间收缩图高
  _visualUnit(html) {
    const full = this._measureHTML(html);
    const chrome = this._measureHTML(html.replace('class="kp-viz-wrap"', 'class="kp-viz-wrap" style="--vz-max:0px"'));
    return { type: 'visual', html, h: full, chrome };
  }

  // —— 结构化 HTML 片段 ——
  _paraHTML(text) { return `<p class="kp-para">${markParagraph(text)}</p>`; }

  // 条目正文（步骤 / 要点）：够长才做点状标记，避免整页都是划线
  _itemHTML(text) {
    if (!text) return esc(text);
    const pure = text.replace(/\s/g, '');
    return pure.length >= 46 ? markTerms(text, { budget: 2, logic: 1, seen: new Set() }) : esc(text);
  }

  // 列表逐条成单元（可跨页续排，避免整块推走造成半空页）
  _pushSteps(items, U) {
    let n = 0;
    (items || []).forEach((it) => {
      const title = (it.title || '').trim();
      const text = (it.text || '').trim();
      if (!title && !text) return;                    // 空项不渲染，避免出现只有一个圆圈的残块
      n++;
      U.push({
        type: 'unit',
        html: `<div class="kp-step${n === 1 ? ' kp-step-first' : ''}"><span class="kp-step-num">${n}</span>` +
          `<div class="kp-step-body">` + (title ? `<div class="kp-step-title">${esc(title)}</div>` : '') +
          (text ? `<div class="kp-step-text">${this._itemHTML(text)}</div>` : '') + `</div></div>`
      });
    });
  }

  _pushPoints(items, U) {
    (items || []).forEach((it, i) => {
      const title = (it.title || '').trim();
      const text = (it.text || '').trim();
      if (!title && !text) return;
      U.push({
        type: 'unit',
        html: `<div class="kp-point${i === 0 ? ' kp-point-first' : ''}">` +
          (title ? `<div class="kp-point-title">${esc(title)}</div>` : '') +
          (text ? `<div class="kp-point-text">${this._itemHTML(text)}</div>` : '') + `</div>`
      });
    });
  }

  _compareHTML(b) {
    return `<div class="kp-compare">` +
      `<div class="kp-compare-col"><div class="kp-compare-h">${esc(b.left.title || '')}</div>` +
      (b.left.items || []).map(it => `<div class="kp-compare-item">${esc(it)}</div>`).join('') + `</div>` +
      `<div class="kp-compare-col"><div class="kp-compare-h">${esc(b.right.title || '')}</div>` +
      (b.right.items || []).map(it => `<div class="kp-compare-item">${esc(it)}</div>`).join('') + `</div>` +
      `</div>`;
  }

  _causalHTML(b) {
    return `<div class="kp-causal">` +
      `<div class="kp-causal-row"><span class="kp-causal-tag">Cause</span><div class="kp-causal-body">${esc(b.cause || '')}</div></div>` +
      `<div class="kp-causal-arrow">↓</div>` +
      `<div class="kp-causal-row"><span class="kp-causal-tag">Process</span><div class="kp-causal-body">${esc(b.process || '')}</div></div>` +
      `<div class="kp-causal-arrow">↓</div>` +
      `<div class="kp-causal-row"><span class="kp-causal-tag">Result</span><div class="kp-causal-body">${esc(b.result || '')}</div></div>` +
      `</div>`;
  }

  // ----------------------------------------------------------
  // 分页：贪心打包成“列”（左页→右页），段落按句拆分
  // ----------------------------------------------------------
  _pack(units, Hp) {
    const cols = [];
    let cur = [], curH = 0;
    const flush = () => { cols.push({ units: cur, h: curH }); cur = []; curH = 0; };
    const pend = units.slice();

    while (pend.length) {
      const u = pend[0];

      // 整版插图（带板书）：自成一个跨页，不与正文混排
      if (u.type === 'figure') {
        // 若当前列只挂着一个标题 → 先让插图占满跨页，标题留作插图之后那一列的开头
        // （否则标题会被插图挤成页尾孤行）
        const onlyHeading = cur.length === 1 && cur[0].type === 'heading';
        if (cur.length && !onlyHeading) flush();
        cols.push({ units: [u], h: u.h, plate: true, lock: true });
        pend.shift();
        continue;
      }

      const room = Hp - curH;

      // 标题必须与它的正文同页：往后累计到“一段够看的正文”为止，
      // 放不下就整块挪到下一列，绝不让标题孤零零留在页尾。
      // （若紧随的是“可收缩的图解”，则按下限高度判断，避免仅因几像素就把整块推走）
      if (u.type === 'heading' && curH > 0 && pend.length > 1) {
        const want = Hp * 0.22;
        let acc = 0;
        for (let k = 1; k < pend.length && k <= 6; k++) {
          const nx = pend[k];
          if (nx.type === 'figure' || nx.type === 'heading') break;
          let nh = nx.h;
          if (nx.type === 'visual' && nx.chrome != null) nh = Math.min(nh, nx.chrome + 84);
          acc += nh;
          if (acc >= want) break;
        }
        if (acc <= 0 || u.h + acc > room + 1) { flush(); continue; }
      }

      if (u.h <= room + 1) { cur.push(u); curH += u.h; pend.shift(); continue; }

      // 段落按句拆分填充当前列
      if (u.type === 'para' && room >= 44) {
        const fit = this._largestParaFit(u.text, room);
        if (fit) {
          cur.push({ type: 'para', html: this._paraHTML(fit.head), text: fit.head, h: fit.h });
          curH += fit.h;
          pend[0] = { type: 'para', html: this._paraHTML(fit.tail), text: fit.tail, h: this._measureHTML(this._paraHTML(fit.tail)) };
          flush();
          continue;
        }
      }

      // 图解：剩余空间还放得下说明文字时，收缩图高以填满当前列（不把整块推到下一页）
      if (u.type === 'visual' && u.chrome != null) {
        const svgFit = Math.floor(room - u.chrome - 2);
        if (svgFit >= 84) {
          const html = u.html.replace('class="kp-viz-wrap"', `class="kp-viz-wrap" style="--vz-max:${svgFit}px"`);
          const h = this._measureHTML(html);
          cur.push({ type: 'visual', html, h });
          curH += h; pend.shift();
          continue;
        }
      }

      // 空列仍放不下（原子块高于整页）→ 独占一列，避免死循环
      if (curH === 0) { cur.push(u); curH += u.h; pend.shift(); flush(); continue; }

      flush();
    }
    if (cur.length) flush();
    return cols;
  }

  _splitSentences(text) {
    const out = [];
    let buf = '';
    for (const ch of (text || '')) {
      buf += ch;
      if ('。！？；!?;'.includes(ch)) { out.push(buf); buf = ''; }
    }
    if (buf.trim()) out.push(buf);
    return out.filter(s => s.trim());
  }

  _largestParaFit(text, room) {
    const sents = this._splitSentences(text);
    if (sents.length < 2) return null;
    let acc = '', best = null;
    for (let k = 0; k < sents.length - 1; k++) {   // 至少留 1 句给下一页
      acc += sents[k];
      const h = this._measureHTML(this._paraHTML(acc));
      if (h <= room + 1) best = { n: k + 1, h }; else break;
    }
    if (!best) return null;
    const head = sents.slice(0, best.n).join('');
    const tail = sents.slice(best.n).join('');
    if (!head.trim() || !tail.trim()) return null;
    return { head, tail, h: best.h };
  }

  // 相邻列均衡：把较满一列的末尾若干单元搬到较空一列的开头（保持阅读顺序），
  // 选择使“两列较空者最大化”的搬法；整块搬不动时允许拆分末尾段落，实现更细的均衡。
  // 整版插图默认紧跟“核心概念”；若那样会让某一跨页明显空着，
  // 就把它挪到正文之前（紧接扉页），选排版更满的一种。
  _placePlate(cols, Hp) {
    const idx = cols.findIndex(c => c.plate);
    if (idx <= 0) return;
    const front = [cols[idx], ...cols.slice(0, idx), ...cols.slice(idx + 1)];
    if (this._plateScore(front, Hp) > this._plateScore(cols, Hp) + 0.02) {
      cols.length = 0;
      cols.push(...front);
    }
  }

  // 粗略评分：各正文跨页里最空的那一跨页有多满
  _plateScore(cols, Hp) {
    let min = 1, i = 0;
    while (i < cols.length) {
      if (cols[i].plate) { i++; continue; }
      const nx = cols[i + 1];
      if (nx && !nx.plate) { min = Math.min(min, (cols[i].h + nx.h) / (2 * Hp)); i += 2; }
      else { min = Math.min(min, cols[i].h / (2 * Hp)); i += 1; }
    }
    return min;
  }

  // 整版插图横跨两页，必须从一个跨页的左页起排；若它前面剩奇数个正文列
  // （会把右页空出来），就把它与紧随其后的那一列互换，避免半张空页面。
  _alignPlates(cols) {
    for (let i = 0; i < cols.length - 1; i++) {
      if (!cols[i].plate) continue;
      if (cols[i + 1].plate) continue;
      let before = 0;
      for (let k = 0; k < i; k++) if (!cols[k].plate) before++;
      if (before % 2 === 1) {
        const t = cols[i]; cols[i] = cols[i + 1]; cols[i + 1] = t;
      }
    }
  }

  // 兜底：任何一列的最后一个单元若仍是小标题 → 把它挪到下一列开头，保证标题与正文同页
  _fixOrphanHeadings(cols) {
    for (let i = 0; i < cols.length - 1; i++) {
      const c = cols[i], nx = cols[i + 1];
      if (!c || !nx || !c.units.length || c.lock || nx.lock || nx.plate) continue;
      const last = c.units[c.units.length - 1];
      if (last.type !== 'heading') continue;
      if (nx.h + last.h > this._measureH + 2) continue;   // 放不下就宁可不动，避免溢出
      c.units.pop(); c.h -= last.h;
      nx.units.unshift(last); nx.h += last.h;
    }
  }

  _balanceCols(cols, Hp) {
    const bestSplit = (a, b) => {
      let cum = 0, bestK = 0, bestMin = Math.min(a.h, b.h);
      for (let k = 1; k < a.units.length; k++) {
        cum += a.units[a.units.length - k].h;
        const pa = a.h - cum, la = b.h + cum;
        if (la > Hp + 1) break;
        // 只搬走标题后面几项会让标题落单 → 跳过这种切法（更大的 k 会把标题一起搬走，允许）
        const stay = a.units[a.units.length - k - 1];
        const firstMoved = a.units[a.units.length - k];
        if (stay && stay.type === 'heading' && firstMoved.type !== 'heading') continue;
        const m = Math.min(pa, la);
        if (m > bestMin + 1) { bestMin = m; bestK = k; }
      }
      return bestK;
    };
    const moveK = (a, b, k) => {
      const moved = a.units.splice(a.units.length - k, k);
      let cH = 0; for (const u of moved) cH += u.h;
      b.units.unshift(...moved);
      a.h -= cH; b.h += cH;
    };
    // 反向：当“前一页薄、后一页厚”时，把后一页开头的若干单元提到前一页末尾
    const backMove = (a, b) => {
      if (!b.units.length) return false;
      let cum = 0, bestK = 0, bestMin = Math.min(a.h, b.h);
      for (let k = 1; k < b.units.length; k++) {
        cum += b.units[k - 1].h;
        const na = a.h + cum, nb = b.h - cum;
        if (na > Hp + 1) break;
        const m = Math.min(na, nb);
        if (m > bestMin + 1) { bestMin = m; bestK = k; }
      }
      if (!bestK) return false;
      if (bestK === 1 && b.units[0].type === 'heading') return false;   // 别把标题搬到前一页页尾
      const moved = b.units.splice(0, bestK);
      let cH = 0; for (const u of moved) cH += u.h;
      a.units.push(...moved);
      a.h += cH; b.h -= cH;
      return true;
    };
    const splitBalance = (a, b) => {
      if (a.h <= b.h || a.h - b.h < Hp * 0.10) return false;
      const lastU = a.units[a.units.length - 1];
      if (!lastU || lastU.type !== 'para' || !lastU.text) return false;
      const want = (a.h - b.h) / 2;
      if (lastU.h - 44 < 40) return false;
      const fit = this._largestParaFit(lastU.text, Math.min(lastU.h - 44, want + 60));
      if (!fit) return false;
      const tailH = this._measureHTML(this._paraHTML(fit.tail));
      if (tailH > Hp - b.h - 8) return false;   // 尾段放不进目标页 → 放弃拆分（防溢出）
      a.units[a.units.length - 1] = { type: 'para', html: this._paraHTML(fit.head), text: fit.head, h: fit.h };
      a.h += fit.h - lastU.h;
      b.units.unshift({ type: 'para', html: this._paraHTML(fit.tail), text: fit.tail, h: tailH });
      b.h += tailH;
      return true;
    };
    for (let pass = 0; pass < 3; pass++) {
      let changed = false;
      for (let i = cols.length - 2; i >= 0; i--) {
        const a = cols[i], b = cols[i + 1];
        if (a.lock || b.lock) continue;   // 整版插图的跨页不参与均衡
        const k = bestSplit(a, b);
        if (k > 0) { moveK(a, b, k); changed = true; continue; }
        if (backMove(a, b)) { changed = true; continue; }
        if (splitBalance(a, b)) changed = true;
      }
      if (!changed) break;
    }
  }

  _colsToSpreads(cols) {
    const spreads = [];
    let i = 0;
    while (i < cols.length) {
      const c = cols[i];
      if (c.plate) {                       // 整版插图独占一个跨页
        spreads.push({ plate: true, left: this._unitsHTML(c.units), right: '' });
        i += 1;
        continue;
      }
      const next = cols[i + 1];
      if (next && next.plate) {            // 下一列是整版插图 → 右页留空，交给下一个跨页
        spreads.push({ left: this._unitsHTML(c.units), right: '' });
        i += 1;
        continue;
      }
      spreads.push({
        left: this._unitsHTML(c.units),
        right: this._unitsHTML(next ? next.units : [])
      });
      i += 2;
    }
    if (!spreads.length) spreads.push({ left: '', right: '' });
    // 末页若右页为空，用一枚克制的收束印记补白（书末页的正常形态）
    const lastS = spreads[spreads.length - 1];
    if (!lastS.right || !lastS.right.trim()) {
      lastS.right = `<div class="kp-colophon"><div class="kp-colophon-rule"></div><div class="kp-colophon-mark">❧</div><div class="kp-colophon-text">完</div></div>`;
    }
    return spreads;
  }

  _unitsHTML(units) { return (units || []).map(u => `<div class="kp-mu">${u.html}</div>`).join(''); }

  // ----------------------------------------------------------
  // 渲染当前跨页
  // ----------------------------------------------------------
  _renderSpread() {
    const s = this.spreads[this.spreadIdx] || { left: '', right: '' };
    const plate = !!s.plate;
    this.spreadEl.classList.toggle('kp-spread-plate', plate);
    this.book.classList.toggle('kp-plate-mode', plate);
    this.leftEl.innerHTML = this._sideHTML(s, 'left');
    this.rightEl.innerHTML = plate ? '' : this._sideHTML(s, 'right');
    this._updateCorners();
    bindVisualInteractions(this.leftEl);
    bindVisualInteractions(this.rightEl);
    if (plate) this._fitBoards();
  }

  // 板书字号随板面实际宽度等比缩放（设计基准：板面外框 882px）
  _fitBoards() {
    const nodes = document.querySelectorAll('#kp-book .kp-board');
    nodes.forEach((b) => {
      const w = b.getBoundingClientRect().width;
      if (!w) return;
      let u = Math.min(1.3, Math.max(0.5, w / 882));
      // 内容偏多时逐级缩字，直到整块板书恰好装进板面
      for (let i = 0; i < 16; i++) {
        b.style.setProperty('--u', u.toFixed(4));
        if (b.scrollHeight <= b.clientHeight + 1) break;
        u *= 0.94;
      }
    });
  }

  _sideHTML(spread, side) {
    if (!spread) return '';
    if (spread.cover) {
      if (side === 'left')
        return `<div class="kp-cover-left"><div class="kp-cover-subject">${esc(spread.subjectTitle || '')}</div><div class="kp-cover-rule"></div><div class="kp-cover-brand">MIND ATLAS</div></div>`;
      return `<div class="kp-cover-right"><div class="kp-concept-title">${esc(spread.topicTitle || '')}</div>` +
        `<div class="kp-concept-subtitle">${esc(spread.subjectTitle || '')}</div>` +
        (spread.lead ? `<div class="kp-lead">${esc(spread.lead)}</div>` : '') + `</div>`;
    }
    return side === 'left' ? (spread.left || '') : (spread.right || '');
  }

  _updateCorners() {
    const last = this.spreadIdx >= this.spreads.length - 1;
    this.cornerPrev.classList.toggle('kp-hidden', this.spreadIdx === 0);
    this.cornerNext.classList.toggle('kp-corner-done', last);
    this.cornerNext.title = last ? '读完 · 合书' : '翻页';
  }

  // ----------------------------------------------------------
  // 翻页（纸角触发）：绕书脊 3D 翻转，露出纸张背面与下一页
  // ----------------------------------------------------------
  turnNext() { this._turn(1); }
  turnPrev() { this._turn(-1); }

  _turn(dir) {
    if (this._turning || !this.isVisible()) return;
    const target = this.spreadIdx + dir;
    if (dir > 0 && target >= this.spreads.length) { this.hide(); if (this.onClose) this.onClose(); return; }
    if (dir < 0 && target < 0) return;

    const cur = this.spreads[this.spreadIdx];
    const nxt = this.spreads[target];
    this._turning = true;
    this._updateCorners();

    const sheet = document.createElement('div');
    sheet.className = 'kp-turn ' + (dir > 0 ? 'kp-turn-next' : 'kp-turn-prev');
    const frontHTML = dir > 0 ? this._sideHTML(cur, 'right') : this._sideHTML(cur, 'left');
    const backHTML = dir > 0 ? this._sideHTML(nxt, 'left') : this._sideHTML(nxt, 'right');
    sheet.innerHTML =
      `<div class="kp-turn-face kp-turn-front">${frontHTML}<div class="kp-turn-sheen"></div></div>` +
      `<div class="kp-turn-face kp-turn-back">${backHTML}</div>`;
    this.book.appendChild(sheet);

    // 下层立刻换成目标页（翻起的纸张下面即“下一页”）
    if (dir > 0) this.rightEl.innerHTML = this._sideHTML(nxt, 'right');
    else this.leftEl.innerHTML = this._sideHTML(nxt, 'left');

    void sheet.offsetWidth;
    // 双重触发：rAF 负责正常帧同步启动，timeout 兜底（极端节流下 rAF 可能延迟到收尾之后）
    let kicked = false;
    const kick = () => { if (kicked || done) return; kicked = true; sheet.classList.add('kp-turn-go'); };
    requestAnimationFrame(kick);
    setTimeout(kick, 30);

    let done = false;
    const finish = () => {
      if (done) return; done = true;
      sheet.removeEventListener('transitionend', onEnd);
      this.spreadIdx = target;
      this._renderSpread();
      if (sheet.parentNode) sheet.remove();
      this._turning = false;
    };
    const onEnd = (ev) => { if (ev.propertyName === 'transform') finish(); };
    sheet.addEventListener('transitionend', onEnd);
    setTimeout(finish, 980);
  }
}
