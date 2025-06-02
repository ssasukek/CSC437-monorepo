import { html, css, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <h1>Welcome to the SPA Home</h1>
      <p>This is the home view.</p>
    `;
  }
}
