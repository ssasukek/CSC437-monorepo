import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { HeaderElement } from "./components/blz-header.ts";
import { HomeViewElement } from "./views/home-view.ts";

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
