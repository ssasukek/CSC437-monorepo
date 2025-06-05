import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/login.css.ts";

export class RegisterView extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main class="login-cont">
        <section class="login-card">
          <h2>Create Account</h2>
          <register-form api="/auth/register" label="Register">
            <label>
              <span>Email</span>
              <input type="user" name="username" autocomplete="off" required />
            </label>
            <label>
              <span>Password</span>
              <input type="password" name="password" required />
            </label>
          </register-form>
        </section>
      </main>
    `;
  }
}

customElements.define("register-view", RegisterView);