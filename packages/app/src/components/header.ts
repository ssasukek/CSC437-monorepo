import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer } from "@calpoly/mustang";
import type { Msg } from "../messages";

import page from "../styles/page.css.ts";
import Fuse from "fuse.js";
import { searchIndex } from "../components/search-index.ts";

const fuse = new Fuse(searchIndex, {
  keys: ["title", "path", "content"],
  threshold: 0.3,
});

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
  private results: typeof searchIndex = [];

  private auth: AuthState = {
    user: {
      authenticated: false,
      username: "",
    },
  };

  private sendSearch = (_term: string) => {};
  searchTerm = "";

  dispatchSearch(term: string) {
    this.searchTerm = term;
    this.sendSearch(term);
    this.results = term ? fuse.search(term).map((r) => r.item) : [];
    console.log("Search dispatched with:", term);    
  }

  private authObserver = new Observer<AuthState>(this, "blazing:auth");

  private storeObserver = new Observer<{ send: (msg: Msg) => void }>(
    this,
    "blazing:store"
  );

  connectedCallback() {
    super.connectedCallback();

    this.storeObserver.observe(({ send }) => {
      this.sendSearch = (term: string) => {
        send(["search/set", { term }]);
      };
    });

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
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          @input=${(e: InputEvent) =>
            this.dispatchSearch((e.target as HTMLInputElement).value)}
          }
        />
        ${this.searchTerm && this.results.length
          ? html`
              <section class="search-res">
                <h2>Search Results</h2>
                <ul>
                  ${this.results.map(
                    (item) => html`
                      <li>
                        <a href=${item.path ?? "#"}>${item.title}</a>
                        <p>${item.content}</p>
                      </li>
                    `
                  )}
                </ul>
              </section>
            `
          : null}

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
            <a href="/app/margins">Margins</a>
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
