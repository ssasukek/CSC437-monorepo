// defines the wrapper component

import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Observer, Auth } from "@calpoly/mustang";
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

  _token?: string;
  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      this._token = auth.token;
      if (this.src) this.hydrate(this.src);
    });
  
    if (this.src) this.hydrate(this.src);
  }

  get authorization() {
    return this._user?.authenticated
      ? { Authorization: `Bearer ${this._token}` }
      : undefined;
  }

  async hydrate(src: string) {
    try {
      const res = await fetch(src, {headers: this.authorization});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.items = await res.json() as CardData[];
    } catch (err) {
      console.error('Failed to load trade cards:', err);
    }
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;

  override render() {
    return html`
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
    `;
  }
}
