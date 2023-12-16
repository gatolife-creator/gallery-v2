import express from "express";
import cors from "cors";
import path from "path";

import { router } from "./api";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static("public"));
app.use(router);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/thumbnails", express.static(path.join(__dirname, "thumbnails")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
