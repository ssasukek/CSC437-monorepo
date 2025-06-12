import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

export class Strategies extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <section>
          <h2>List of Strategies</h2>
          <p>
            Day trading strategies are short-term approaches used to profit from
            price movements within the same trading day. The right strategy
            depends on market conditions, trader experience, risk tolerance, and
            personal style.
          </p>
        </section>

        <section>
          <h2>1. Scalping</h2>
          <p>
            Scalping involves making dozens or even hundreds of trades per day
            to profit from small price changes. Traders look for high liquidity
            and low spreads.
          </p>
          <ul>
            <li>Extremely short holding periods (seconds to minutes)</li>
            <li>Requires fast execution and minimal slippage</li>
            <li>Best for markets with high volume and low volatility</li>
          </ul>
        </section>

        <section>
          <h2>2. Momentum Trading</h2>
          <p>
            Momentum traders capitalize on strong price trends backed by volume.
            The idea is to “ride the wave” of a stock moving significantly in
            one direction.
          </p>
          <ul>
            <li>Focuses on news catalysts, earnings, or technical breakouts</li>
            <li>Entries based on trend confirmation, volume spikes, or RSI</li>
            <li>Quick exits when momentum fades</li>
          </ul>
        </section>

        <section>
          <h2>3. Breakout Trading</h2>
          <p>
            Breakout strategies seek to enter trades when a stock moves outside
            of a defined resistance or support level with increased volume.
          </p>
          <ul>
            <li>Looks for consolidation ranges or triangle patterns</li>
            <li>Requires confirmation with volume and price action</li>
            <li>Stop-loss often placed just inside the range</li>
          </ul>
        </section>

        <section>
          <h2>4. Reversal or Pullback Trading</h2>
          <p>
            Reversal strategies look for turning points when a price trend loses
            strength and reverses direction. Pullback traders enter during brief
            retracements in a trend.
          </p>
          <ul>
            <li>
              Uses support/resistance, candlestick patterns, or indicators
              (ex. MACD, RSI)
            </li>
            <li>Requires strong discipline and confirmation signals</li>
            <li>Higher risk but potentially larger reward</li>
          </ul>
        </section>

        <section>
          <h2>Tips for Choosing Strategy</h2>
          <ul>
            <li>Start with 1-2 strategies and master them before expanding</li>
            <li>Backtest and paper trade to build confidence</li>
            <li>Keep a trading journal to refine your edge</li>
            <li>Adapt to changing market volatility and news events</li>
          </ul>
        </section>
      </main>
    `;
  }
}

customElements.define("strategies-view", Strategies);
