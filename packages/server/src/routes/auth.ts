import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import creds from "../services/credential-svc";

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "CHANGE_ME";

const router = express.Router();

// helper to issue a JWT
function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => err ? reject(err) : resolve(token!)
    );
  });
}

// POST /auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Bad request");
  }
  creds.create(username, password)
    .then(() => generateAccessToken(username))
    .then(token => res.status(201).json({ token }))
    .catch(err => res.status(409).json({ error: err.message }));
});

// POST /auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Bad request");
  creds.verify(username, password)
    .then(user => generateAccessToken(user))
    .then(token => res.json({ token }))
    .catch(() => res.status(401).send("Unauthorized"));
});

export function authenticateUser(
  req: Request, res: Response, next: NextFunction
) {
  const authHeader = (req.headers["authorization"] || "") as string;
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).end();
  jwt.verify(token, TOKEN_SECRET, err => {
    if (err) return res.status(403).end();
    next();
  });
}

export default router;