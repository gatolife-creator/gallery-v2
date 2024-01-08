<script>
  import { createEventDispatcher } from "svelte";
  import { fade, blur } from "svelte/transition";
  import "./LoginDialog.css";

  const dispatch = createEventDispatcher();

  let id = "";
  let password = "";

  function login() {
    dispatch("login", { id, password });
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<div class="overlay" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
  <div
    class="login-dialog"
    in:blur={{ duration: 200 }}
    out:blur={{ duration: 200 }}
  >
    <h2 class="text-lg font-bold text-black">ログイン</h2>
    <div class="input-container">
      <input
        class="input"
        type="text"
        bind:value={id}
        placeholder="id"
      />
      <input
        class="input"
        type="password"
        bind:value={password}
        placeholder="パスワード"
      />
    </div>
    <div class="button-container">
      <button class="btn btn-primary" on:click={login}>ログイン</button>
      <button class="btn btn-outline btn-secondary" on:click={cancel}
        >キャンセル</button
      >
    </div>
  </div>
</div>
