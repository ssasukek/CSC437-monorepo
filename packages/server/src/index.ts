import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import dt_traders from "./services/CardData-svc";
import cardDataRouter from "./routes/cardData";

connect("DTCluster");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use("/api/cardData", cardDataRouter);

app.get("/cardData/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  dt_traders.get(id).then((data: any) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});