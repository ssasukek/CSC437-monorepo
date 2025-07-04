import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

export class DayTrades extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <section>
          <h2>What are Day Trades?</h2>
          <p>
            - Day trading is the form of buying and selling, where there are
            short selling and buying to cover within the trading day. -
            Positions are usually closed before the market cloese to avoid
            overnight risk. - The objective of day trade is to profit from short
            term price fluctuations by executing quick trades throughout the
            day. - There are many different instrument to trade on, trader can
            work with stocks, options, futures, ETFs and even currencies. -
            There are risk when involve in day trades but it required strong
            emotional discipline, technical analysis and strick risk management
            for success.
          </p>
          <h2>Trading Environment</h2>
          <p>
            - Market Dynamic involves intraday volatility, liquidity, and price
            momentum which day trader use to exploits - There are various
            platform trader uses to analyze, real time market data and
            charting/technical analysis.
          </p>
        </section>

        <section>
          <h2>How Does it Work?</h2>
          <p>
            Day trading involves several key steps and tools that work together
            in a fast-paced environment:
          </p>
          <ul>
            <li>
              <strong>Real-time Data Monitoring:</strong> Traders continuously
              monitor live market data through trading platforms that offer
              real-time quotes, charts, and news feeds.
            </li>
            <li>
              <strong>Technical Analysis & Charting:</strong> Using technical
              indicators (such as moving averages, RSI, and Bollinger Bands),
              traders analyze chart patterns to identify entry and exit signals.
            </li>
            <li>
              <strong>Strategic Order Placement:</strong> Based on analysis,
              traders execute orders using various types such as market, limit,
              or stop orders. These tools help secure optimal entry points and
              manage risk through automated triggers like stop-loss orders.
            </li>
            <li>
              <strong>Risk Management:</strong> Effective risk management is
              essential. Traders set predefined risk levels, use stop-loss
              orders, and allocate only a portion of their capital to each trade
              to limit potential losses.
            </li>
            <li>
              <strong>Trade Execution & Monitoring:</strong> Once an order is
              placed, the trading system automatically executes the trade when
              conditions are met. Traders then monitor their open positions
              throughout the day, making adjustments based on market movement
              and new data.
            </li>
            <li>
              <strong>Closing Positions:</strong> All positions are closed
              before the market ends to avoid overnight exposure, ensuring that
              every trade concludes within the same day.
            </li>
          </ul>
        </section>
      </main>
    `;
  }
}

customElements.define("daytrades-view", DayTrades);