import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import dotenv from "dotenv";

import { router } from "./api";
import { router as authRouter } from "./auth";

dotenv.config();

const app = express();
const sessionOptions: session.SessionOptions = {
  secret: process.env.SESSION_SECRET_KEY as string,
  cookie: {
    maxAge: 30 * 60 * 1000,
  },
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static("public"));
app.use(session(sessionOptions));
app.use("/api", router);
app.use(authRouter);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/thumbnails", express.static(path.join(__dirname, "thumbnails")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
