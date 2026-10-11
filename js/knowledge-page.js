// ============================================================
// MIND ATLAS — Knowledge Page
// Virtual open book layout with concept structure
// Supports Chinese course content with 8 sections
// ============================================================

import { getTopicContent } from '../data/atlas-data.js';

export class KnowledgePage {
  constructor() {
    this.page = document.getElementById('knowledge-page');
    this.title = document.getElementById('kp-title');
    this.subtitle = document.getElementById('kp-subtitle');
    this.sections = {
      concept: document.getElementById('kp-concept'),
      whyItMatters: document.getElementById('kp-why'),
      mechanism: document.getElementById('kp-mechanism'),
      example: document.getElementById('kp-example'),
      experiment: document.getElementById('kp-experiment'),
      application: document.getElementById('kp-application'),
      commonMistakes: document.getElementById('kp-mistakes'),
      connection: document.getElementById('kp-connection')
    };
    this.closeBtn = document.getElementById('kp-close');
    this.onClose = null;

    this.closeBtn.addEventListener('click', () => {
      this.hide();
      if (this.onClose) this.onClose();
    });

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

    const content = getTopicContent(subject.id, topic.id);

    if (content) {
      this.sections.concept.textContent = content.concept || '';
      this.sections.whyItMatters.textContent = content.whyItMatters || '';
      this.sections.mechanism.textContent = content.mechanism || '';
      this.sections.example.textContent = content.example || '';
      this.sections.experiment.textContent = content.experiment || '';
      this.sections.application.textContent = content.application || '';
      this.sections.commonMistakes.textContent = content.commonMistakes || '';
      this.sections.connection.textContent = content.connection || '';
    } else {
      const placeholder = '内容正在建设中——知识框架已就位。';
      Object.values(this.sections).forEach(el => { el.textContent = placeholder; });
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
