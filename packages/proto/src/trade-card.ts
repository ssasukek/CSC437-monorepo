// defines individual card componenet

import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import reset from './styles/reset.css.ts';

export class TradeCard extends LitElement {
  @property() title = "";
  @property() href = "";
  @property({ attribute: "link-text" }) linkText = "";

  static styles = [
    reset.styles,

    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--card-bg);
        border-radius: 12px;
        padding: 4.5rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        color: black;
        min-width: 580px;
        height: 220px;
        text-align: left;
        transition: transform 0.2s ease;

        width: 90vw;
        max-width: 1100px;
        height: 400px;
        flex: 0 0 80vw;
        scroll-snap-align: center;
      }
        
      h1 {
        font-size: 3rem;
        font-family: var(--font-display);
        color: var(--color-link);
        margin-bottom: var(--spacing-sm);
      }

      p {
        font-size: 1.5rem;
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
      }

      a {
        font-size: 1rem;
        color: var(--color-accent);
        text-decoration: none;
        font-weight: bold;
      }
      a:hover {
        text-decoration: underline;
      }
    `,
  ];

  override render() {
    return html`
      <h1>${this.title}</h1>
      <p><slot></slot></p>
      <a href="${this.href}">${this.linkText}</a>
    `;
  }
}
