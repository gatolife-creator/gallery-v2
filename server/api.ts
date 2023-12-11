import { Router } from "express";
import path from "path";
import fs from "fs";
import sizeOf from "image-size";

export const router = Router();

router.get("/api/images", (req, res) => {
  const imagesDir = path.join(__dirname, "images");

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const images = files.map((file) => {
        const src = `/images/${file}`;
        const dimensions = sizeOf(path.join(imagesDir, file));

        return {
          src,
          width: dimensions.width,
          height: dimensions.height,
        };
      });

      res.json(images);
    }
  });
});
