// app/src/main.ts
import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";

import { ProfileViewElement } from "./views/profile-view";
import { CardEditView } from "./views/card-view";
import { IndexView } from "./views/index-view.ts";
import { HeaderElement } from "./components/header.ts";
import { TradeCard } from "./components/trade-card";
import { TradeCards } from "./components/trade-cards.ts";
import { LoginFormElement } from "./components/auth/login-form.ts";
import { LoginView } from "./views/login-view.ts";
import { RegisterFormElement } from "./components/auth/register-form.ts";
import { RegisterView } from "./views/register-view.ts";

const routes = [
  {
    path: "/app/profile/:id",
    view: (params: Switch.Params) =>  html`
      <mu-auth provides="blazing:auth" redirect="/app/login">
        <profile-view user-id=${params.id}></profile-view>
      </mu-auth>`
    },
  {
    path: "/app/edit/:id",
    view: (params: Switch.Params) =>
      html`<card-edit-view user-id=${params.id}></card-edit-view>`,
  },
  {
    path: "/",
    redirect: "/app",
  },
  // {
  //   path: "/app/card/:id/edit",
  //   view: (params: Switch.Params) =>
  //     html`<card-edit-view card-id=${params.id}></card-edit-view>`,
  // },
  {
    path: "/app/daytrades",
    view: () => html`<daytrades-view></daytrades-view>`,
  },
  { path: "/app/orders", view: () => html`<orders-view></orders-view>` },
  {
    path: "/app/assetTypes",
    view: () => html`<assetTypes-view></asseTypes-view>`,
  },
  {
    path: "/app/strategies",
    view: () => html`<strategies-view></strategies-view>`,
  },
  {
    path: "/app/brokerage",
    view: () => html`<brokerageAcc-view></brokerageAcc-view>`,
  },
  { path: "/app/margins", view: () => html`<margins-view></margins-view>` },
  {
    path: "/app",
    view: () => html`<index-view></index-view>`,
  },
  {
    path: "/app/login",
    view: () => html`<login-view></login-view>` ,
  },
  {
    path: "/app/register",
    view: () => html`<register-view></register-view>`,
  },
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "t-header": HeaderElement,
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
  "index-view": IndexView,
  "trade-cards": TradeCards,
  "trade-card": TradeCard,
  "login-form": LoginFormElement,
  "login-view": LoginView,
  "register-view": RegisterView,
  "register-form": RegisterFormElement,
});
