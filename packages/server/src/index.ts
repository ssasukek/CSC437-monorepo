import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import dt_traders from "./services/cardData-svc";
import cardDataRouter from "./routes/cardData";
// import authRouter, { authenticateUser } from "./routes/auth";

connect("DTCluster");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/cardData", cardDataRouter);
app.use(express.static(process.env.STATIC || "public"));


app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// app.use("/api/cardData", authenticateUser, cardDataRouter);

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});