import { CardData } from "server/models";

export interface Model {
  profile?: CardData;
  card?: CardData;
  search?: string;
}

export const init: Model = { 
  search: "",
};
