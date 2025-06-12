import { html } from "lit";
import { View } from "@calpoly/mustang";
import { Model } from "../model.ts";
import { Msg } from "../messages.ts";

import page from "../styles/page.css.ts";

const data = [
  { title: "Orders" },
  { title: "Day Trades" },
  { title: "Brokerage Account" },
  { title: "Strategies" },
  { title: "Asset Type" },
  { title: "Margins" },
];

// const search = this.model.search ?? "";
// const fuse = new Fuse(data, { keys: ["title"] });
// const results = search ? fuse.search(search).map((r) => r.item) : data;

export class IndexView extends View<Model, Msg> {
  static styles = [page];
  render() {
    return html`
      <main>
        <div class="grid-cont">
          <section id="sec1" class="hero">
            <svg class="icon">
              <use href="/icons/trading-icons.svg#icon-candlestick" />
            </svg>
            <h1>Welcome to Day Trades Overview</h1>
            <p>
              The ultimate resources in futher understand, execute and mastered
              the skill of day trading
            </p>
            <a href="/app/daytrades">Read More</a>
          </section>

          <div class="cards">
            <button class="scroll-btn left" @click=${this.scrollCLeft}>
              &#8678;
            </button>

            <section class="card-scroll" id="scroll-container">
              <trade-cards src="/data/trade-cards.json"></trade-cards>
            </section>

            <button class="scroll-btn right" @click=${this.scrollCRight}>
              &#8680;
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>2025 Day Trades Index. All Rights Reserved. Most infomation were obtained from Google and ChatGpt </p>
      </footer>
    `;
  }

  scrollCRight() {
    const container = this.renderRoot?.querySelector(
      "#scroll-container"
    ) as HTMLElement;
    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10
    ) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: 350, behavior: "smooth" });
    }
  }

  scrollCLeft() {
    const container = this.renderRoot?.querySelector(
      "#scroll-container"
    ) as HTMLElement;
    if (container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -350, behavior: "smooth" });
    }
  }
}

customElements.define("index-view", IndexView);
