<script lang="ts">
   import { page } from '$app/stores'
</script>

<svelte:head>
   <title>{$page.status}</title>
</svelte:head>

<div>
   {#if $page.status === 404}
      <h1>Not found</h1>
   {:else}
      <h1>Something went wrong</h1>
   {/if}
</div>