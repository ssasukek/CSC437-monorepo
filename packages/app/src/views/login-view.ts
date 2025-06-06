import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/login.css.ts";

export class LoginView extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
          <main class="login-cont">
            <section class="login-card">
              <h2>User Login</h2>
              <login-form api="/auth/login" redirect="/app">
                <label>
                  <span>Username</span>
                  <input
                    type="user"
                    name="username"
                    autocomplete="off"
                    required
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input type="password" name="password" required />
                </label>
                <div class="login-options">
                  <label><input type="checkbox" /> Remember me</label>
                  <a href="#">Forgot Password?</a>
                </div>
              </login-form>
              <p class="signup-link">
                Don't have an account? <a href="/app/register">Register</a>?
              </p>
            </section>
          </main>
    `;
  }
}

customElements.define("login-view", LoginView);