<script lang="ts">
  import { onMount } from "svelte";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import "photoswipe/style.css";

  import type { Image } from "../types";

  // ドラッグアンドドロップが終了したら自動的にアップロードを実行する
  function handleDrop(_: DragEvent, files: File[]) {
    handleFileUpload(files);
  }

  let images: Image[] = [];
  let uploaded = false;

  async function handleFileUpload(files: File[]) {
    const formData = new FormData();
    console.log(files);
    files.forEach((file: File) => {
      formData.append("image", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // レスポンスをJSON形式で取得
      const result = await response.json();

      if (response.ok) {
        console.log(result.message); // 成功メッセージを表示
      } else {
        console.error(result.message); // エラーメッセージを表示
      }
    } catch (error) {
      console.error("アップロード中にエラーが発生しました。", error);
    }

    uploaded = true;
    await getImages();
  }

  async function getImages() {
    const res = await fetch("api/images");
    images = await res.json();

    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + "test",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  }

  onMount(async () => {
    await getImages();
  });
</script>

<Dropzone
  accept="image/*"
  inputElement={null}
  on:drop={(e) => {
    console.log(e);
    handleDrop(e.detail, e.detail.acceptedFiles);
  }}
/>

<div class="pswp-gallery masonry-gallery" id="test">
  {#each images as image (image.src)}
    <a
      href={image.src}
      data-pswp-width={image.width}
      data-pswp-height={image.height}
      target="_blank"
      rel="noreferrer"
    >
      <img src={image.src} alt="" />
    </a>
  {/each}
</div>

<style>
  .masonry-gallery {
    column-count: 5;
    column-gap: 1rem;
  }

  .masonry-gallery img {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>
