<script lang="ts">
   import ProductCard from './ProductCard.svelte'
   export let products: any
</script>

<div class="bg-white">
   <div class="mx-auto max-w-2xl py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 id="products-heading" class="sr-only">Products</h2>
      <div class="grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
         {#each products as product}
         <ProductCard {product} />
         {/each}
      </div>
   </div>
</div>