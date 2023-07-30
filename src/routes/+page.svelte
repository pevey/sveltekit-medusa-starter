<script lang="ts">
   import type { PageData } from './$types'
   export let data: PageData
   console.log(data.products)
</script>

{#each data.products as product}
   <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
   </div>
{:else}
   No products found.
{/each}
