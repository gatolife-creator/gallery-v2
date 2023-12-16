<script>
  import { createEventDispatcher } from "svelte";
  import { fade, blur } from "svelte/transition";
  const dispatch = createEventDispatcher();

  export let message = "";

  function confirm() {
    dispatch("confirm");
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<div class="overlay" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
  <div
    class="confirmation-dialog"
    in:blur={{ duration: 200 }}
    out:blur={{ duration: 200 }}
  >
    <p class="text-lg font-bold text-black">{message}</p>
    <div class="button-container">
      <button class="btn btn-error" on:click={confirm}>Confirm</button>
      <button class="btn btn-outline btn-secondary" on:click={cancel}
        >Cancel</button
      >
    </div>
  </div>
</div>
