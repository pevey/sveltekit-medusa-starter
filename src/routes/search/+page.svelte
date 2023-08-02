<script>
   import SEO from '$lib/components/SEO.svelte'
   import { queryParam } from 'sveltekit-search-params'
   import { enhance } from '$app/forms'
   
   export let data
   let hits = data?.hits || []

   const q = queryParam('q')
   let searchForm
</script>

<SEO title="Search" />

<div class="max-w-screen-2xl mx-auto my-8 px-6 md:px-8">
   <form bind:this={searchForm} action="/search?/search" method="POST" use:enhance={ async ({ cancel }) => {
      if (!$q) cancel()
      return async ({ result }) => {
         if (result.status === 200) {
            if (result.data.hits !== hits) {
               hits = result.data.hits
            }
         } 
      }}}>
      <label for="q" class="sr-only">Search</label>
      <input type="search" name="q" id="q" bind:value={$q} on:input={() => searchForm.requestSubmit()} class="w-full block py-3 px-4 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500" aria-label="Search" />
   </form>
   {#each hits as hit}
      <button on:click={async () => { $q = '';  window.location.href = `/product/${hit.handle}` }} class="overflow-hidden text-left cursor-pointer hover:bg-stone-100 p-4">
         <h3 class="font-bold">{hit.title}</h3>
         <p class="text-sm line-clamp-4">{hit.description}</p>
      </button>
   {:else}
      {#if $q}
      <p>No results found.</p>
      {:else}
      <p>Enter a search term.</p>
      {/if}
   {/each}
</div>