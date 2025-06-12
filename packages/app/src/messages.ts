import { CardData } from "server/models";

export type Msg =
  | ["card/save", { id: string; card: CardData; 
    onSuccess?: () => void; 
    onFailure?: (err: Error) => void;}]
  | ["card/select", { id: string }]
  | ["search/set", { term: string }];