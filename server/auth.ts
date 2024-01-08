import express from "express";
import dotenv from "dotenv";

dotenv.config();
const ID = process.env.ID;
const PASSWORD = process.env.PASSWORD;

if (!ID || !PASSWORD) {
  throw new Error("ID or password is not set");
}

export const router = express.Router();

router.get("/isAuthorized", (req, res) => {
  if (!(req.session as any).user) {
    res.status(401).json({ message: "Unauthorized", isAuthorized: false });
  } else {
    res.status(200).json({ message: "Authorized", isAuthorized: true });
  }
});

router.post("/auth", (req, res) => {
  const { id, password } = req.body;
  console.log(id, password);

  if (id === ID && password === PASSWORD) {
    (req.session as any).user = id;
    res.status(200).json({ message: "API access granted" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});
