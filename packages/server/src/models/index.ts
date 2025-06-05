import express, { Request, Response } from "express";
import { connect } from "../services/mongo";
import cardDataRouter from "../routes/cardDatas";
import auth , { authenticateUser } from "../routes/auth";
import fs from "node:fs/promises";
import path from "path";
export { CardData } from "./cardData";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/cardDatas", cardDataRouter);
app.use("/auth", auth );
app.use("/api/cardData", authenticateUser, cardDataRouter);

app.use("/app/", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});

app.use("/", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" })
    .then((html) => res.send(html))
    .catch(() => res.status(500).send("Could not load index.html"));
});

connect("DTCluster");

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

