// Edit Form View
// this will be the profile form, dont want to change all the name

import { View, Form, History, define } from "@calpoly/mustang";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { CardData } from "server/models";

import page from "../styles/profile.css.ts";

export class CardEditView extends View<Model, Msg> {
  static styles = [page];
  
  static uses = define({
    "mu-form": Form.Element,
  });

  @property({ attribute: "card-id" }) userid?: string = "";

  @state()
  get card(): CardData | undefined {
    return this.model.card;
  }

render() {
    return html`
      <main>
        <mu-form
          .init=${this.card ?? { name: "", bio: "", tradingStyle: "" }}
          @mu-form:submit=${this.handleSubmit}>
          <label>
            Name
            <input type="text" name="name" />
          </label>
          <label>
            Bio
            <textarea name="bio"></textarea>
          </label>
          <label>
            Trading Style
            <input type="text" name="tradingStyle" />
          </label>
        </mu-form>
      </main>
    `;
  }

  handleSubmit(event: Form.SubmitEvent<CardData>) {
    console.log("Form submit:", event.detail);
    this.dispatchMessage([
      "card/save",
      {
        id: this.id ?? "",
        card: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/profile/${this.id}`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
  }
}
customElements.define("card-edit-view", CardEditView);