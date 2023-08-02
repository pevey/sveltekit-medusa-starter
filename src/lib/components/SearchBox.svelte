<script lang="ts">
   import { enhance } from '$app/forms'
   import { clickOutside } from '$lib/utils'
   let q = ''
   let hits: [] = []
   let search_form: HTMLFormElement
</script>

<div class="relative hidden md:block w-full max-w-xl mx-auto">
   <form bind:this={search_form} action="/search?/search" method="POST" use:enhance={ async ({ cancel }) => {
      if (!q) cancel()
      return async ({ result }) => {
      if (result.status === 200) {
         if (result.data.hits !== hits) {
               hits = result.data.hits
         }
      } 
      }}}>
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <svg class="h-7 w-7 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
               <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
         </svg>
      </div>
      <label for="q" class="sr-only">Search</label>
      <input type="search" placeholder="Search" name="q" id="q" bind:value={q} on:input={() => search_form.requestSubmit()} class="block w-full rounded-md border border-stone-300 py-3 pl-12 pr-3 leading-5 text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500" />
   </form>
   {#if q}
   <div use:clickOutside on:clickOutside={() => q = ''} class="absolute overflow-auto max-h-[80vh] rounded-b-xl bg-white w-full z-50 border border-gray-200">
      {#each hits as hit}
      <button on:click={async () => { q = '';  window.location.href = `/product/${hit.handle}` }} class="overflow-hidden text-left cursor-pointer hover:bg-stone-100 p-4">
         <h3 class="font-bold">{hit.title}</h3>
         <p class="text-sm line-clamp-4">{hit.description}</p>
      </button>
      {:else}
      <p>No results found.</p>
      {/each}
   </div>
   {/if}
</div>
<div class="md:hidden self-end ml-auto">
   <a href="/search">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
   </a>
</div>