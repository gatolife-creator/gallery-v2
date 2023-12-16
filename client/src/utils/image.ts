import PhotoSwipeLightbox from "photoswipe/lightbox";

import type { Image } from "../types/index";

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file: File) => {
    formData.append("image", file);
  });
  return formData;
}

export async function handleFileUpload(files: File[], onSuccess?: (message: string) => void, onError?: (message: string) => void) {
  const formData = await uploadFiles(files);
  console.log(files);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log(result.message);
      if (onSuccess) {
        onSuccess(result.message);
      }
    } else {
      console.error(result.message);
      if (onError) {
        onError(result.message);
      }
    }
  } catch (error) {
    console.error("アップロード中にエラーが発生しました。", error);
    if(onError) {
      onError("Failed to upload image");
    }
  }
}

export async function getImages() {
  const res = await fetch("api/images");
  const images = await res.json() as any[] as Image[];

  let lightbox = new PhotoSwipeLightbox({
    gallery: "#" + "test",
    children: "a",
    pswpModule: () => import("photoswipe"),
  });
  lightbox.init();

  return images;
}

export async function deleteImage(imageSrc: string, onSuccess?: (message: string) => void, onError?: (message: string) => void) {
  const filename = imageSrc.replace("/images/", "");

  try {
    const response = await fetch(`/api/images/${filename}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      console.log(result.message);
      if (onSuccess) {
        onSuccess(result.message);
      }
      return imageSrc;
    } else {
      console.error(result.message);
      if (onError) {
        onError(result.message);
      }
    }
  } catch (error) {
    console.error("画像の削除中にエラーが発生しました。", error);
    if (onError) {
      onError("Failed to delete image");
    }
  }
}