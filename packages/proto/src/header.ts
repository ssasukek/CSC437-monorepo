import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Events, Auth } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  @state() loggedIn = false;
  @state() userid?: string;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(auth => {
      const u = auth.user;
      this.loggedIn = !!u?.authenticated;
      this.userid   = u?.authenticated ? u.username : undefined;
    });
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: UIEvent) =>
          Events.relay(e, "auth:message", ["auth/signout"])}
      >
        Sign Out
      </button>
    `;
  } 
  renderSignInButton() {
    return html`
      <a href="/login.html">
        Sign In…
      </a>
    `;
  }
  render() {
    return html`
      <slot name="actuator">Hello, ${this.userid||"user"}</slot>
      ${this.loggedIn ? this.renderSignOutButton() : this.renderSignInButton()}
    `;
  }
}