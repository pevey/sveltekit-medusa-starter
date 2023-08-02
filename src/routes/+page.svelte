<script lang="ts">
   import type { PageData } from './$types'
   import Collection from '$lib/components/Collection.svelte'
   export let data: PageData
</script>

<Collection products={data.products} />

<!-- {#each data.products as product}
   <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
   </div>
{:else}
   No products found.
{/each} -->
