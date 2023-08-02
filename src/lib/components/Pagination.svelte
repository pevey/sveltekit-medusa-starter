<script lang="ts">
   import { goto } from '$app/navigation'
   import { page } from '$app/stores'

   export let currentPage = 1
   export let itemCount = 0
   export let itemsPerPage = 10

   $:numPages = Math.ceil(itemCount / itemsPerPage)

   $:{currentPage = parseInt(currentPage) || 1
      if ((currentPage > numPages) || (currentPage < 1)) {
         currentPage = numPages
      }}

   $:nextPage = (parseInt(currentPage) === parseInt(numPages))? null : parseInt(currentPage) + 1
   $:prevPage = (currentPage == 1)? null : currentPage - 1

   //create dummy array for our each loop
   let pages = []
   $:{pages = []
      for (let i = 1; i <= Math.min(numPages, 10); i++) {
         pages.push(i)
      }}
</script>

{#if numPages > 1}
<div class="flex w-full ml-auto items-center mt-6 sm:mt-8">
   <nav class="mx-auto isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      <button disabled={!prevPage} type="button" on:click={ async () => {
            currentPage = prevPage
            await goto(`${$page.url.pathname}?page=${currentPage}`)
         }} class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
         <!-- Heroicon name: mini/chevron-left -->
         <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
         </svg>    
      </button>

      {#each pages as i, j}
      {#if i === currentPage}
      <!-- Active -->
      <span class="relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20">{i}</span>
      {:else if j > 4}
      <!-- Disappearing on mobile -->
      <a href="#" class="relative hidden items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 md:inline-flex">{i}</a>
      {:else}
      <button type="button" on:click={ async () => {
         currentPage = i
         await goto(`${$page.url.pathname}?page=${currentPage}`)
      }} class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">{i}</button>
      {/if}
      {/each}

      <button disabled={!nextPage} type="button" on:click={ async () => {
            currentPage = nextPage
            await goto(`${$page.url.pathname}?page=${currentPage}`)
         }} class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
         <!-- Heroicon name: mini/chevron-left -->
         <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
         </svg>
      </button>
   </nav>
</div>
{/if}