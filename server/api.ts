import { Router } from "express";
import path from "path";
import fs from "fs";
import sizeOf from "image-size";
import multer from "multer";
import sharp from "sharp";

const imagesDir = path.join(__dirname, "images");
const thumbnailsDir = path.join(__dirname, "thumbnails");

const storage = multer.diskStorage({
  destination: (_1, _2, cb) => {
    cb(null, "images/"); // 画像の保存先ディレクトリ
  },
  filename: (_, file, cb) => {
    const originalname = Buffer.from(file.originalname, "binary").toString();
    cb(null, originalname);
  },
});

const upload = multer({ storage: storage });

export const router = Router();

async function createThumbnail(imagePath: string, thumbnailPath: string) {
  await sharp(imagePath)
    .resize(400) // サムネイルのサイズを200pxに設定
    .toFile(thumbnailPath);
}

router.get("/api/images", (_, res) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
    ".webp",
  ];
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
    } else {
      const images = files
        .filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        })
        .map((file) => {
          const src = `/images/${file}`;
          const thumbnail = `/thumbnails/${file}`; // サムネイルのURLを追加
          const dimensions = sizeOf(path.join(imagesDir, file));

          return {
            src,
            thumbnail,
            width: dimensions.width,
            height: dimensions.height,
          };
        });

      res.json(images);
    }
  });
});

router.post("/api/upload", upload.array("image"), async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, "images");
    const thumbnailsDir = path.join(__dirname, "thumbnails");

    // アップロードされた画像のサムネイルを作成
    for (const file of req.files as Express.Multer.File[]) {
      const imagePath = path.join(imagesDir, file.originalname);
      const thumbnailPath = path.join(thumbnailsDir, file.originalname);
      await createThumbnail(imagePath, thumbnailPath);
    }

    res.send({ message: "The image has been uploaded." });
  } catch (error) {
    res.status(400).send({
      message: "An error occurred while uploading the image.",
      error: error,
    });
  }
});

router.delete("/api/images/:filename", (req, res) => {
  const targetFile = path.join(imagesDir, req.params.filename);
  const targetThumbnail = path.join(thumbnailsDir, req.params.filename);

  fs.unlink(targetFile, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: "An error occurred while deleting the image.",
        error: err,
      });
    } else {
      // サムネイルも削除
      fs.unlink(targetThumbnail, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send({
            message: "An error occurred while deleting the thumbnail.",
            error: err,
          });
        } else {
          res.send({
            message: "The image and its thumbnail have been deleted normally.",
          });
        }
      });
    }
  });
});
