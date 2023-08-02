<script lang="ts">
   export let product: any
</script>

<a href="/product/{product.handle}" class="group">
<div class="overflow-hidden rounded-lg">
      <img alt={product.title} src={product.thumbnail} class="mx-auto h-80 w-auto object-center group-hover:opacity-75">
</div>
<div class="flex">
   <div class="mx-auto">
      <h3 class="mt-4 text-lg font-bold text-gray-700">{product.title}</h3>
   </div>
   <p class="mt-1 text-lg font-medium text-gray-900"></p>
</div>
</a>