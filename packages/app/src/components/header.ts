import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer } from "@calpoly/mustang";

import page from "../styles/page.css.ts";

type AuthState = {
  user: {
    authenticated: boolean;
    username: string;
  };
  token?: string;
};

export class HeaderElement extends LitElement {
  static styles = [page];

  @state()
  private auth: AuthState = {
    user: {
      authenticated: false,
      username: ""
    }
  };

  private authObserver = new Observer<AuthState>(this, "blazing:auth");

  connectedCallback() {
    super.connectedCallback();
    this.authObserver.observe((auth) => {
      this.auth = auth;
    });

    // pre-filled
    const stored = localStorage.getItem("mode");
    if (stored === "dark") {
      requestAnimationFrame(() => {
        const checkbox = this.shadowRoot?.querySelector(
          ".dark-checkbox"
        ) as HTMLInputElement;
        if (checkbox) checkbox.checked = true;
      });
    }
  }

  render() {
    const loggedIn = this.auth.user?.authenticated;
    const username = this.auth.user?.username ?? "Guest";

    return html`
      <header>
        <input type="search" class="search-bar" placeholder="Search..." />

        <label class="dark-toggle">
          <span class="icon-sun">☀️</span>
          <input
            type="checkbox"
            class="dark-checkbox"
            @change=${(e: Event) => {
              const checked = (e.target as HTMLInputElement).checked;
              this.dispatchEvent(
                new CustomEvent("darkmode:toggle", {
                  bubbles: true,
                  composed: true,
                  detail: { checked },
                })
              );
            }}
          />
          <span class="toggle-switch"></span>
          <span class="icon-moon">🌙</span>
        </label>

        ${loggedIn
          ? html`
              <div class="user-dropdown">
                <span class="user-name">${username}</span>
                <div class="dropdown-content">
                  <a href="/app/profile/${username}" class="dropdown-item">
                  Account Info
                  </a>
                  <button class="dropdown-item" @click=${this.signOut}>
                    Sign Out
                  </button>
                </div>
              </div>
            `
          : html`<a href="/app/login" class="login-btn">Login</a>`}

        <div class="dropdown">
          <button class="dropbtn" aria-label="Menu">☰</button>
          <div class="dropdown-content">
            <a href="/app">Home</a>
            <a href="/app/daytrades">Day Trades</a>
            <a href="/app/orders">Orders</a>
            <a href="/app/brokerageAcc">Brokerage Account</a>
            <a href="/app/strategies">Strategies</a>
            <a href="/app/assetTypes">Asset Type</a>
          </div>
        </div>
      </header>
    `;
  }
  signOut() {
    this.dispatchEvent(
      new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signout"],
      })
    );
  }
}
customElements.define("t-header", HeaderElement);
