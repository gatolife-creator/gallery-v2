<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import ConfirmationDialog from "./ConfirmationDialog.svelte";
  import ImBin from "svelte-icons-pack/im/ImBin";
  import Icon from "svelte-icons-pack/Icon.svelte";
  import "photoswipe/style.css";
  import "./Gallery.css";

  import type { Image } from "../types";

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

  function openDialog(event: MouseEvent, imageSrc: string) {
    event.stopPropagation();
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

  let dragging = false;

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragging = true;
  }

  function handleDragLeave(event: DragEvent) {
    if (
      event.relatedTarget === null ||
      !(event.currentTarget as Element).contains(event.relatedTarget as Node)
    ) {
      dragging = false;
    }
  }

  function handleDrop(_: DragEvent, files: File[]) {
    dragging = false;
    handleFileUpload(files);
  }

  onMount(async () => {
    await getImages();
  });
</script>

<svelte:window on:dragover={handleDragOver} on:dragleave={handleDragLeave} />

{#if dragging}
  <div class="overlay">
    <div class="confirmation-dialog">
      <Dropzone
        containerClasses="w-full h-full"
        accept="image/*"
        inputElement={null}
        on:drop={(e) => {
          console.log(e);
          handleDrop(e.detail, e.detail.acceptedFiles);
        }}
      />
    </div>
  </div>
{/if}

{#if showDialog}
  <ConfirmationDialog
    message="Are you sure you want to delete this image?"
    on:confirm={handleConfirm}
    on:cancel={closeDialog}
  />
{/if}

<div class="pswp-gallery masonry-gallery" id="test">
  {#each images as image (image.src)}
    <div class="image-container" animate:flip={{ duration: 500 }}>
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
          on:click|preventDefault={(event) => openDialog(event, image.src)}
        >
          <Icon src={ImBin} />
        </button>
      </a>
    </div>
  {/each}
</div>
