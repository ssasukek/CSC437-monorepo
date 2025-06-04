// Edit Form View

import { View, Form, History, define } from "@calpoly/mustang";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { CardData } from "server/models";

export class CardEditView extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property({ attribute: "card-id" }) userid?: string;

  @state()
  get card(): CardData | undefined {
    return this.model.card;
  }

render() {
    return html`
      <main>
        <mu-form .init=${this.card} @mu-form:submit=${this.handleSubmit}>
          <label>
            Title
            <input type="text" name="title" />
          </label>
          <label>
            Description
            <input type="text" name="description" />
          </label>
          <label>
            Link
            <input type="text" name="href" />
          </label>
          <label>
            Link Text
            <input type="text" name="linkText" />
          </label>
          <button type="submit">Save</button>
        </mu-form>
      </main>
    `;
  }

  handleSubmit(event: Form.SubmitEvent<CardData>) {
    this.dispatchMessage([
      "card/save",
      {
        id: this.id,
        card: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/traveler/${this.id}`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
  }
}