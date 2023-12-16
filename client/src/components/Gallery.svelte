<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import ConfirmationDialog from "./ConfirmationDialog.svelte";
  import ImBin from "svelte-icons-pack/im/ImBin";
  import Icon from "svelte-icons-pack/Icon.svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import "photoswipe/style.css";
  import "./Gallery.css";

  import type { Image } from "../types";
  import { handleFileUpload, getImages, deleteImage } from "../utils/image";

  const { addNotification } = getNotificationsContext();
  let images: Image[] = [];
  let uploaded = false;

  const FLIP_ANIMATION_DURATION = 500;

  onMount(async () => {
    images = await getImages();
  });

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
    await deleteImage(
      imageToDelete,
      async (_) => {
        images = await getImages();
      },
      (message) => {
        addNotification({
          text: message,
          position: "top-right",
          type: "error",
        });
      },
    );
    closeDialog();
  }

  let dragging = false;

  function handleDragStart(event: DragEvent) {
    event.preventDefault();
  }

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
    handleFileUpload(
      files,
      async (_) => {
        images = await getImages();
      },
      (message) => {
        addNotification({
          text: message,
          position: "top-right",
          type: "error",
        });
      },
    );
  }

  function handleDropOutside(event: DragEvent) {
    event.preventDefault();
    dragging = false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      dragging = false;
    }
  }
</script>

<svelte:window
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:keydown={handleKeyDown}
  on:drop={handleDropOutside}
/>

{#if dragging}
  <div class="overlay">
    <div class="dropzone-dialog">
      <Dropzone
        containerClasses="w-full h-full"
        accept="image/*"
        inputElement={null}
        on:drop={(e) => {
          console.log(e);
          handleDrop(e.detail, e.detail.acceptedFiles);
        }}
      >
        <slot />
      </Dropzone>
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
    <div
      class="image-container"
      animate:flip={{ duration: FLIP_ANIMATION_DURATION }}
    >
      <a
        href={image.src}
        data-pswp-width={image.width}
        data-pswp-height={image.height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={image.src} alt="" on:dragstart={handleDragStart} />
        <button
          class="btn btn-error opacity-80 delete-button"
          on:click|preventDefault={(event) => openDialog(event, image.src)}
        >
          <Icon src={ImBin} size="18px" />
        </button>
      </a>
    </div>
  {/each}
</div>
