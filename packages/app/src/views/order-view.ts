import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

export class Order extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <section>
          <h2>Understanding Orders</h2>
          <p>
            In day trading, orders are the set of instructions you send to your
            broker to execute trades under specific conditions. They not only
            dictate how and when your trades are executed, but they also help
            you manage risk and seize short-term opportunities.
          </p>
          <p>
            Different order types provide you with varying levels of control
            over execution speed, price certainty, and overall trade management.
          </p>
        </section>

        <section>
          <h2>Types of Orders</h2>
          <p>
            <strong>Market Order:</strong> Executes immediately at the best
            available price. Fast but offers no price control.
          </p>
          <p>
            <strong>Limit Order:</strong> Executes only at a specified price or
            better. Great for controlling entry/exit prices, but may not fill.
          </p>
          <p>
            <strong>Stop Order:</strong> Becomes a market order once a trigger
            price is hit. Useful for stopping losses or entering breakouts.
          </p>
          <p>
            <strong>Stop-Limit Order:</strong> Similar to a stop order, but
            executes as a limit order after triggering. Gives control but may
            not fill in volatile markets.
          </p>
          <p>
            <strong>Trailing Stop:</strong> Automatically adjusts the stop price
            as the market moves in your favor. Locks in gains while limiting
            downside.
          </p>
        </section>

        <section>
          <h2>Order Execution & Management</h2>
          <p>
            Timing and liquidity impact whether your order fills. Limit orders
            may stay open or get partially filled depending on volume.
          </p>
          <p>
            Traders often combine orders (ex. bracket orders or
            OCO—one-cancels-other) to automate exit strategies for profit-taking
            and loss prevention.
          </p>
          <p>
            Platforms may also support conditional orders (ex. trigger only
            during market hours, or if another position changes).
          </p>
        </section>

        <section>
          <h2>Tips for Effective Order Use</h2>
          <ul>
            <li>
              Use limit orders when precision is more important than speed.
            </li>
            <li>
              Place stop-losses immediately after opening a trade to protect
              capital.
            </li>
            <li>
              Review order types supported by your broker—especially for
              after-hours or pre-market trading.
            </li>
            <li>
              Simulate your strategy before going live to test how different
              orders behave in volatile conditions.
            </li>
            <li>
              Use trailing stops in trending markets to protect gains without
              exiting too early.
            </li>
          </ul>
        </section>
      </main>
    `;
  }
}

customElements.define("order-view", Order);
