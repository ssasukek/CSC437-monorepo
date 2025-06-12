import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model.ts";
// import { error } from "console";
import { CardData } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "card/select":
      loadCard(message[1], user).then((card) =>
        apply((model) => ({ ...model, card }))
      );
      break;

    case "card/save":
      saveCard(message[1], user)
        .then((card) => apply((model) => ({ ...model, card })))
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;

    case "search/set":
      apply(model => ({...model, search: message[1].term }));
      break;
      
    default:
      throw new Error(`Unhandled Auth message "${message[0]}"`);
  }
}

function loadCard({ id }: { id: string }, user: Auth.User) {
  return fetch(`/api/cardDatas/${id}`, {
    headers: Auth.headers(user)
  })
    .then(async(response: Response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        // Create a default card if not found
        const defaultCard: CardData = {
          id: id,
          name: "",
          bio: "",
          tradingStyle: "",
        };
        console.warn(`Card not found for ${id}, creating new one...`); 
        return saveCard({ id, card: defaultCard }, user);
      } else {
        throw new Error(`Unexpected status ${response.status}`);
      } 
    })
    .then((json: unknown) => {
      if (json) {
        console.log("cardData:", json);
        return json as Model["card"];
      }
    });
}

function saveCard(
  msg: {
    id: string;
    card: CardData;
  },
  user: Auth.User
) {
  const payload = { ...msg.card, id: msg.id };
  return fetch(`/api/cardDatas/${msg.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(payload),
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else throw new Error(`Failed to save card for ${user.username}`);
    })
    .then((json: unknown) => {
      if (json) return json as CardData;
      return undefined;
    });
}