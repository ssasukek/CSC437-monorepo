// Read-only View

import { View } from "@calpoly/mustang";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";

import page from "../styles/profile.css.ts";


export class ProfileViewElement extends View<Model, Msg> {
  static styles = [page];
  
  @property({ attribute: "user-id" })
  userid?: string;

  constructor() {
    super("blazing:model");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "user-id" &&
      oldValue !== newValue &&
      newValue && (!this.model.card || this.model.card.id !== newValue)
    ) {
      this.dispatchMessage(["card/select", { id: newValue }]);
    }
  }

  render() {
    // if (!this.model.card) {
    //   return html`<p>Loading...</p>`;
    // }
    const card = this.model.card ?? {
      id: this.userid,
      name: "",
      bio: "",
      tradingStyle: "",
    };

    // const { name, bio, tradingStyle } = this.model.card;
    return html`
      <section class="profile">
        <h2>${card.name}</h2>
        <p><strong>Bio:</strong> ${card.bio || "N/A"}</p>
        <p><strong>Trading Style:</strong> ${card.tradingStyle || "NA"}</p>
        <a class="edit-btn" href="/app/edit/${this.userid}">Edit Profile</a>
      </section>
    `;
  }
}
customElements.define("profile-view", ProfileViewElement);