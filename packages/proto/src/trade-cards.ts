// defines the wrapper component

import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import './trade-card.js';

interface CardData {
  id?: string;
  title: string;
  href: string;
  linkText: string;
  description: string;
}

export class TradeCards extends LitElement {
  @property() src = '';
  @state() items: CardData[] = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(src: string) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.items = await res.json() as CardData[];
    } catch (err) {
      console.error('Failed to load trade cards:', err);
    }
  }

  static styles = css`
    :host {
      display: flex;
      margin: var(--spacing-lg) 0;
      grid-column: 1 / -1;
    }
    .cards {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-lg);
      max-width: 300px;
      margin: 0 auto;
  `;

  override render() {
    return html`
      <div class="cards">
        ${this.items.map(item => html`
          <trade-card
            id=${item.id || ''}
            title=${item.title}
            href=${item.href}
            link-text=${item.linkText}
          >
            ${item.description}
          </trade-card>
        `)}
      </div>
    `;
  }
}
