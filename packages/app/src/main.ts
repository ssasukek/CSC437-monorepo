// app/src/main.ts
import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/blz-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
// import { Msg } from "./messages";
// import { Model, init } from "./model";
// import update from "./update";
// import { TourViewElement } from "./views/tour-view";
// import { BlazingHeaderElement } from "./components/blz-header.ts";


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
//   "mu-store": class AppStore
//     extends Store.Provider<Model, Msg>{
//     constructor() {
//         super(update, init, "blazing:auth");
//     }
//     },
//     "tour-view": TourViewElement
});

const routes = [
  {
    path: "/app/tour/:id",
    view: (params: Switch.Params) => html`
      <tour-view tour-id=${params.id}></tour-view>
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
];
