<script lang="ts">
   export let images: [] = []
   let selectedImage = images[0]?.url || '/img/noimg.png'
   function selectImage(index: number) {
      selectedImage = images[index].url
   }
</script>

<div class="flex flex-col-reverse">

   <!-- Image selector -->
   <div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
      <div class="grid grid-cols-4 gap-6" aria-orientation="horizontal" role="tablist">
         {#each images as image, i}
            <button on:click={() => { selectImage(i) }} class="ring-lime-600 relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4" aria-controls="tabs-1-panel-1" role="tab" type="button">
               <span class="absolute inset-0 overflow-hidden rounded-md">
                  <img src="{image.url}" alt="{image.alt}" class="h-full w-full object-cover object-center">
               </span>
            </button>
         {:else}
            <div></div>
         {/each}
      </div>
   </div>

   <!-- Image display -->
   <div class="aspect-square w-full overflow-hidden sm:rounded-lg">
      <div role="tabpanel" tabindex="0">
         <img src={selectedImage} alt="{selectedImage.alt}" class="h-full w-full object-cover object-center overflow-hidden sm:rounded-lg">
      </div>
   </div>

</div>