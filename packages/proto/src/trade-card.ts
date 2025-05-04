// defines individual card componenet

import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import reset from './styles/reset.css.ts';

export class TradeCard extends LitElement {
  @property() title = '';
  @property() href = '';
  @property({ attribute: 'link-text' }) linkText = '';

  static styles = [
    reset.styles,

    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: var(--color-background-page);
        border: 1px solid var(--color-border);
        border-radius: 999px;      
        width: 440px;
        height: 160px;
        padding: var(--spacing-md);
        box-sizing: border-box;
        text-align: center;
      }

      h1 {
        font-family: var(--font-display);
        font-weight: 700;
        color: var(--color-link);
        margin-bottom: var(--spacing-sm);
      }

      p {
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
      }

      a {
        color: var(--color-accent);
        text-decoration: none;
        font-weight: bold;
      }
      a:hover {
        text-decoration: underline;
      }
    `
  ];

  override render() {
    return html`
      <h1>${this.title}</h1>
      <p><slot></slot></p>
      <a href="${this.href}">${this.linkText}</a>
    `;
  }
}
