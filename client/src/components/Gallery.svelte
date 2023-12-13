<script lang="ts">
  import { onMount } from "svelte";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import ConfirmationDialog from "./ConfirmationDialog.svelte";
  import ImBin from "svelte-icons-pack/im/ImBin";
  import Icon from "svelte-icons-pack/Icon.svelte";
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

  async function deleteImage(imageSrc: string) {
    const filename = imageSrc.replace("/images/", ""); // "/images/"を削除

    try {
      const response = await fetch(`/api/images/${filename}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.message); // 成功メッセージを表示
        images = images.filter((image) => image.src !== imageSrc); // 画像をギャラリーから削除
      } else {
        console.error(result.message); // エラーメッセージを表示
      }
    } catch (error) {
      console.error("画像の削除中にエラーが発生しました。", error);
    }
  }

  let showDialog = false;
  let imageToDelete = "";

  function openDialog(imageSrc: string) {
    showDialog = true;
    imageToDelete = imageSrc;
  }

  function closeDialog() {
    showDialog = false;
  }

  async function handleConfirm() {
    await deleteImage(imageToDelete);
    closeDialog();
  }
</script>

<Dropzone
  accept="image/*"
  inputElement={null}
  on:drop={(e) => {
    console.log(e);
    handleDrop(e.detail, e.detail.acceptedFiles);
  }}
/>

{#if showDialog}
  <ConfirmationDialog
    message="Are you sure you want to delete this image?"
    on:confirm={handleConfirm}
    on:cancel={closeDialog}
  />
{/if}

<div class="pswp-gallery masonry-gallery" id="test">
  {#each images as image (image.src)}
    <div class="image-container">
      <a
        href={image.src}
        data-pswp-width={image.width}
        data-pswp-height={image.height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={image.src} alt="" />
        <button
          class="btn btn-error delete-button"
          on:click|preventDefault={() => openDialog(image.src)}
        >
          <Icon src={ImBin} />
        </button>
      </a>
    </div>
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

  .image-container {
    position: relative;
    display: inline-block;
  }

  .delete-button {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
