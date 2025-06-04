// app/src/main.ts
import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { HeaderElement } from "./components/blz-header";
import { HomeViewElement } from "./views/home-view";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { ProfileViewElement } from "./views/profile-view";
import { CardEditView } from "./views/card-view";

const routes = [
  {
    path: "/app/profile/:id",
    view: (params: Switch.Params) => html`
      <profile-view user-id=${params.id}></profile-view>
    `,
  },
  {
    path: "/app/edit/:id",
    view: (params: Switch.Params) =>
      html`<card-edit-view user-id=${params.id}></card-edit-view>`,
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
];

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

  "daytrades-view": DayTradesViewElement,
  "orders-view": OrdersViewElement,
  "assetTypes-view": AssetTypesViewElement,
  "strategies-view": StrategiesViewElement,
  "brokerageAcc-view": BrokerageViewElement,
  "margins-view": MarginsViewElement,
});
