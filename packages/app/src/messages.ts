import { CardData } from "server/models";

export type Msg =
  | ["profile/save", { userid: string; profile: CardData }]
  | ["profile/select", { userid: string }]