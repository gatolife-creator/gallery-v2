<script>
  import { fade } from "svelte/transition";
  import Gallery from "./components/Gallery.svelte";
</script>

<div class="container mx-auto" transition:fade={{ delay: 1000 }}>
  <Gallery />
</div>
