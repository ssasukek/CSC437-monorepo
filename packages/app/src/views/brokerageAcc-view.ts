import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

export class BrokerageAcc extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <section>
          <h2>What is a Brokerage Account?</h2>
          <p>
            A brokerage account is a financial account that allows you to buy
            and sell securities such as stocks, ETFs, and options. It acts as a
            bridge between individual investors and the stock market.
          </p>
          <p>
            For day traders, the right brokerage account offers essential tools
            such as fast order execution, real-time data, and access to margin
            trading.
          </p>
        </section>

        <section>
          <h2>Types of Brokerage Accounts</h2>
          <p>
            <strong>Cash Account:</strong> You trade using only the funds
            deposited. No borrowing is allowed, which limits risk but also
            leverage.
          </p>
          <p>
            <strong>Margin Account:</strong> Allows you to borrow money from the
            broker to trade. This can amplify gains—but also losses. Margin
            accounts are required for short selling and pattern day trading.
          </p>
        </section>

        <section>
          <h2>Key Features for Day Traders</h2>
          <ul>
            <li>
              <strong>Low commissions and fees</strong> to reduce overhead on
              frequent trades
            </li>
            <li>
              <strong>Fast execution speeds</strong> to capitalize on short-term
              price movements
            </li>
            <li>
              <strong>Level II quotes and real-time data</strong> for better
              market insight
            </li>
            <li><strong>Advanced charting tools</strong> and hotkey support</li>
            <li>
              <strong>Mobile and desktop platforms</strong> for flexibility
            </li>
          </ul>
        </section>

        <section>
          <h2>Important Regulations</h2>
          <p>
            If you're flagged as a Pattern Day Trader (PDT), you're required to
            maintain a minimum account balance of $25,000 in a margin account.
            Brokers enforce this under FINRA rules.
          </p>
          <p>
            Violating PDT rules may result in account restrictions, including
            trade limitations or conversion to a cash account.
          </p>
        </section>

        <section>
          <h2>Tips for Choosing a Brokerage</h2>
          <ul>
            <li>Compare platforms for speed, reliability, and trading tools</li>
            <li>
              Choose brokers that support pre-market and after-hours trading
            </li>
            <li>Review margin rates and borrowing limits</li>
            <li>Start with a demo account if available to test features</li>
            <li>
              Check customer support availability, especially during market
              hours
            </li>
          </ul>
        </section>
      </main>
    `;
  }
}

customElements.define("brokerage-view", BrokerageAcc);