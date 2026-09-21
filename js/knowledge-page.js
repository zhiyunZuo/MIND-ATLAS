// ============================================================
// MIND ATLAS — Knowledge Page
// Virtual open book layout with concept structure
// ============================================================

export class KnowledgePage {
  constructor() {
    this.page = document.getElementById('knowledge-page');
    this.title = document.getElementById('kp-title');
    this.subtitle = document.getElementById('kp-subtitle');
    this.why = document.getElementById('kp-why');
    this.mechanism = document.getElementById('kp-mechanism');
    this.example = document.getElementById('kp-example');
    this.connection = document.getElementById('kp-connection');
    this.closeBtn = document.getElementById('kp-close');
    this.onClose = null;

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

    const placeholder = 'Content forthcoming — the framework is in place.';

    this.why.textContent = placeholder;
    this.mechanism.textContent = placeholder;
    this.example.textContent = placeholder;
    this.connection.textContent = placeholder;

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
