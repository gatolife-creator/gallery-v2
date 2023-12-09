import express from "express";
import cors from "cors";
import sizeOf from 'image-size';
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static("public"));


app.get("/api/images", (req, res) => {
  const imagesDir = path.join(__dirname, "images");

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const images = files.map(file => {
        const src = `/images/${file}`;
        const dimensions = sizeOf(path.join(imagesDir, file));
        
        return {
          src, 
          width: dimensions.width,
          height: dimensions.height
        };
      });
      
      res.json(images);
    }
  });
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
