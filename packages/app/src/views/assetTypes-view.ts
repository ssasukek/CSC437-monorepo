import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

export class Asset extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <section>
          <h2>What Are Asset Types?</h2>
          <p>
            An asset is any tradable financial instrument that has value. In day
            trading, traders focus on highly liquid assets that show volatility,
            allowing for profit within short timeframes.
          </p>
        </section>

        <section>
          <h2>Stocks (Equities)</h2>
          <p>
            Stocks represent ownership in a company. They are the most common
            asset type for day traders, especially small-cap and mid-cap stocks
            due to their volatility.
          </p>
          <ul>
            <li>High liquidity, especially in large-cap stocks</li>
            <li>Susceptible to news, earnings, and market sentiment</li>
            <li>Traded on major exchanges like NASDAQ and NYSE</li>
          </ul>
        </section>

        <section>
          <h2>ETFs (Exchange-Traded Funds)</h2>
          <p>
            ETFs are funds that track an index, sector, or commodity and trade
            like stocks. They provide diversification with the flexibility of
            intraday trading.
          </p>
          <ul>
            <li>Less volatile than individual stocks</li>
            <li>Useful for sector-based strategies or hedging</li>
            <li>Popular among swing and position traders as well</li>
          </ul>
        </section>

        <section>
          <h2>Options</h2>
          <p>
            Options give the right, but not the obligation, to buy or sell a
            stock at a specific price. They offer high leverage with limited
            upfront capital.
          </p>
          <ul>
            <li>Complex and risky — not recommended for beginners</li>
            <li>Popular among experienced traders for short-term plays</li>
            <li>Can be used for hedging or speculation</li>
          </ul>
        </section>

        <section>
          <h2>Futures</h2>
          <p>
            Futures are contracts to buy or sell an asset at a predetermined
            future date and price. They're often used to trade commodities,
            indexes, or currencies.
          </p>
          <ul>
            <li>High leverage and 24-hour trading access</li>
            <li>Popular in markets like E-mini S&P 500, crude oil, and gold</li>
            <li>Require deep knowledge and risk control</li>
          </ul>
        </section>

        <section>
          <h2>Cryptocurrencies</h2>
          <p>
            Digital assets like Bitcoin and Ethereum are known for extreme
            volatility and are traded on specialized exchanges.
          </p>
          <ul>
            <li>Trade 24/7 globally</li>
            <li>High risk and high reward potential</li>
            <li>Require different analysis tools and wallets</li>
          </ul>
        </section>
      </main>
    `;
  }
}

customElements.define("asset-view", Asset);