import { Router, Request, Response } from "express";
import CardDataSvc from "../services/CardData-svc";
import { CardData } from "../models/cardData";

const router = Router();

router.get("/", (_req, res: Response) => {
    CardDataSvc
        .index()
        .then((list: CardData[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
    });

router.get("/:id", (req: Request, res: Response) => {
    CardDataSvc
        .get(req.params.id)
        .then((card) => {
        if (!card) return res.status(404).end();
        res.json(card);
        })
        .catch((err) => res.status(500).send(err));
    });

router.post("/", (req: Request, res: Response) => {
    const newCard: CardData = req.body;
    CardDataSvc
        .create(newCard)
        .then((saved) => res.status(201).json(saved))
        .catch((err) => res.status(500).send(err));
    });

router.put("/:id", (req: Request, res: Response) => {
    const id = req.params.id;
    const updated: CardData = req.body;
    CardDataSvc
        .update(id, updated)
        .then((card) => res.json(card))
        .catch((err) => res.status(404).send(err));
    });

router.delete("/:id", (req: Request, res: Response) => {
    CardDataSvc
        .remove(req.params.id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
    });
    
export default router;