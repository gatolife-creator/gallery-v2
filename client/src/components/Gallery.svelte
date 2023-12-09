<script lang="ts">
  import { onMount } from "svelte";
  import PhotoSwipeLightbox from "photoswipe/lightbox";
  import "photoswipe/style.css";

  import type { Image } from "../types";

  let images: Image[] = [];

  onMount(async () => {
    const res = await fetch("api/images");
    images = await res.json();

    let lightbox = new PhotoSwipeLightbox({
      gallery: "#" + "test",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
  });
</script>

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
