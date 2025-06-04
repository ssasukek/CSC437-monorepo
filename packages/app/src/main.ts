// app/src/main.ts
import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/blz-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import update from "./update.ts";
import { ProfileViewElement } from "./views/profile-view.ts";
import { CardEditView } from "./views/card-view.ts";


define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "blz-header": HeaderElement,
  "home-view": HomeViewElement,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "blazing:history", "blazing:auth");
    }
  },
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "blazing:auth");
    }
  },
  "profile-view": ProfileViewElement,
  "card-edit-view": CardEditView,
});

const routes = [
  {
    path: "/app/profile/:id",
    view: (params: Switch.Params) => html`
      <profile-view user-id=${params.id}></profile-view>
    `,
  },
  {
    path: "/app",
    view: () => html` <home-view></home-view> `,
  },
  {
    path: "/",
    redirect: "/app",
  },
  {
    path: "/app/card/:id/edit",
    view: (params: Switch.Params) =>
      html`<card-edit-view card-id=${params.id}></card-edit-view>`,
  },
];
