// ============================================================
// MIND ATLAS — Knowledge Page
// 双页书卷式知识点阅读页：左页概要，右页 11 字段内容
// 内容来自 data/knowledge，支持 related 跨领域链接导航
// ============================================================

import { getKnowledge } from '../data/knowledge/index.js';

// 右页字段渲染顺序与中文标题（summary 单独放左页）
const FIELDS = [
  { key: 'core',          label: '它是什么' },
  { key: 'mechanism',     label: '它如何运作' },
  { key: 'why',           label: '为什么重要' },
  { key: 'example',       label: '经典案例' },
  { key: 'application',   label: '如何应用' },
  { key: 'counter',       label: '边界与失效' },
  { key: 'misconception', label: '常见误区' },
  { key: 'practice',      label: '思维实验' },
  { key: 'advanced',      label: '进阶' }
];

export class KnowledgePage {
  constructor() {
    this.page = document.getElementById('knowledge-page');
    this.title = document.getElementById('kp-title');
    this.subtitle = document.getElementById('kp-subtitle');
    this.summaryEl = document.getElementById('kp-summary');
    this.sectionsEl = document.getElementById('kp-sections');
    this.relatedEl = document.getElementById('kp-related');
    this.closeBtn = document.getElementById('kp-close');
    this.onClose = null;
    this.onRelatedClick = null;

    this.closeBtn.addEventListener('click', () => {
      this.hide();
      if (this.onClose) this.onClose();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
        if (this.onClose) this.onClose();
      }
    });
  }

  show(topic, subject) {
    this.title.textContent = topic.title;
    this.subtitle.textContent = subject.title;

    const data = getKnowledge(topic.id);

    if (!data) {
      this.summaryEl.textContent = '（该知识点内容尚未录入）';
      this.sectionsEl.innerHTML = '';
      this.relatedEl.innerHTML = '';
    } else {
      // 左页概要
      this.summaryEl.textContent = data.summary || '';

      // 右页字段
      this.sectionsEl.innerHTML = '';
      FIELDS.forEach((f) => {
        const text = data[f.key];
        if (!text) return;

        const section = document.createElement('div');
        section.className = 'kp-section';

        const title = document.createElement('div');
        title.className = 'kp-section-title';
        title.textContent = f.label;
        section.appendChild(title);

        const body = document.createElement('div');
        body.className = 'kp-section-body';
        body.textContent = text;
        section.appendChild(body);

        this.sectionsEl.appendChild(section);
      });

      // 跨领域连接
      this.relatedEl.innerHTML = '';
      const related = data.related || [];
      if (related.length > 0) {
        const cap = document.createElement('div');
        cap.className = 'kp-section-title';
        cap.textContent = '跨学科连接';
        this.relatedEl.appendChild(cap);

        const list = document.createElement('div');
        list.className = 'kp-related-list';

        related.forEach((r) => {
          const chip = document.createElement('button');
          chip.className = 'kp-related-chip';
          chip.type = 'button';
          chip.textContent = r.label;
          chip.addEventListener('click', () => {
            if (this.onRelatedClick) this.onRelatedClick(r.t, r.label);
          });
          list.appendChild(chip);
        });

        this.relatedEl.appendChild(list);
      }
    }

    this.page.classList.remove('visible');
    void this.page.offsetWidth;
    this.page.classList.add('visible');
  }

  hide() {
    this.page.classList.remove('visible');
  }

  isVisible() {
    return this.page.classList.contains('visible');
  }
}
