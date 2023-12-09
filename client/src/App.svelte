<script>
  import { fade } from "svelte/transition";
  import Gallery from "./components/Gallery.svelte";
</script>

<div transition:fade={{ delay: 1000 }}></div>
<Gallery />
