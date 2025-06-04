// Read-only View

import { View } from "@calpoly/mustang";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";

export class ProfileViewElement extends View<Model, Msg> {
  @property({ attribute: "user-id" })
  userid?: string;

  constructor() {
    super("blazing:model");
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "user-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["card/select", { id: newValue }]);
    }
  }

  render() {
    if (!this.model.card) {
      return html`<p>Loading...</p>`;
    }

    const { title, description } = this.model.card;
    return html`
      <h1>${title}</h1>
      <p>${description}</p>
    `;
  }
}
