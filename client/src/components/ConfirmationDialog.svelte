<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let message = "";

  function confirm() {
    dispatch("confirm");
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<div class="confirmation-dialog">
  <p>{message}</p>
  <button class="btn btn-error" on:click={confirm}>Confirm</button>
  <button class="btn btn-outline btn-secondary" on:click={cancel}>Cancel</button
  >
</div>
