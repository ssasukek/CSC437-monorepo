import { CardData } from "server/models";

export interface Model {
  profile?: CardData;
  card?: CardData;
}

export const init: Model = {};
