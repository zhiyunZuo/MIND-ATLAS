// ============================================================
// MIND ATLAS — Navigation Manager
// Breadcrumb + back control, museum-label style
// ============================================================

export class NavigationManager {
  constructor() {
    this.breadcrumb = document.getElementById('breadcrumb');
    this.breadcrumbText = document.getElementById('breadcrumb-text');
    this.atlasControl = document.getElementById('atlas-control');
    this.backBtn = document.getElementById('back-btn');
    this.backLabel = document.getElementById('back-label');
    this.hint = document.getElementById('interaction-hint');
    this.hintText = document.getElementById('hint-text');
    this.onBack = null;
    this._hintTimeout = null;

    this.backBtn.addEventListener('click', () => {
      if (this.onBack && this.atlasControl.classList.contains('visible')) {
        this.onBack();
      }
    });
  }

  showBreadcrumb(path) {
    this.breadcrumbText.innerHTML = path
      .map((p, i) => {
        if (i < path.length - 1) {
          return `<span>${p}</span><span class="breadcrumb-sep">/</span>`;
        }
        return `<span>${p}</span>`;
      })
      .join('');
    this.breadcrumb.classList.add('visible');
  }

  hideBreadcrumb() {
    this.breadcrumb.classList.remove('visible');
  }

  showBack(label) {
    this.backLabel.textContent = label || '图谱';
    this.atlasControl.classList.add('visible');
  }

  hideBack() {
    this.atlasControl.classList.remove('visible');
  }

  showHint(text, duration = 5000) {
    this.hintText.textContent = text;
    this.hint.classList.add('visible');
    this.hint.classList.remove('fade');

    if (this._hintTimeout) clearTimeout(this._hintTimeout);
    this._hintTimeout = setTimeout(() => {
      this.hint.classList.add('fade');
    }, duration);
  }

  hideHint() {
    this.hint.classList.remove('visible');
    this.hint.classList.add('fade');
    if (this._hintTimeout) clearTimeout(this._hintTimeout);
  }
}
