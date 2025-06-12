import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

export class Margins extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <section>
          <h2>What is Margin?</h2>
          <p>
            In day trading, margin is borrowed money provided by your broker
            that allows you to buy more shares than you could with just your own
            capital.
          </p>
          <p>
            A margin account lets traders access leverage, which can amplify
            both gains and losses. You're required to deposit a minimum margin
            (initial margin) and maintain a certain equity (maintenance margin)
            in your account.
          </p>
        </section>

        <section>
          <h2>Leverage in Day Trading</h2>
          <p>
            Leverage is the use of borrowed funds to increase your position
            size. For example, with 4:1 leverage, a trader with $5,000 can trade
            up to $20,000 worth of stock during the day.
          </p>
          <p>
            While leverage boosts your buying power, it also increases exposure
            to risk. Even a small price movement in the wrong direction can lead
            to significant losses.
          </p>
        </section>

        <section>
          <h2>Risks of Margin Trading</h2>
          <ul>
            <li>
              <strong>Margin Calls:</strong> If your account value falls below
              the maintenance requirement, your broker may issue a margin call
              and force you to deposit more funds or sell positions.
            </li>
            <li>
              <strong>Amplified Losses:</strong> Losses are magnified because
              you're trading with borrowed funds. A 10% drop on a leveraged
              position could mean a 40% loss on your own capital.
            </li>
            <li>
              <strong>Liquidation Risk:</strong> Brokers can liquidate your
              assets without notice to cover margin deficiencies.
            </li>
          </ul>
        </section>

        <section>
          <h2>Tips for Using Margin Wisely</h2>
          <ul>
            <li>
              Use leverage only if you fully understand the risks involved.
            </li>
            <li>
              Set strict stop-losses to protect your account from margin calls.
            </li>
            <li>Monitor your buying power and account equity regularly.</li>
            <li>Notes: Don't use full leverage — leave a buffer in your account.</li>
            <li>
              Trade with a plan, not emotion — leverage can tempt overtrading.
            </li>
          </ul>
        </section>
      </main>
    `;
  }
}

customElements.define("margins-view", Margins);