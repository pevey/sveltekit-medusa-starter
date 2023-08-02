<script lang="ts">
   import { X, ShoppingCart } from 'lucide-svelte'
   import { createDialog } from '@melt-ui/svelte'
   import { fade, fly } from 'svelte/transition'
   import { enhance } from '$app/forms'
   import { invalidateAll } from '$app/navigation'
   import { formatPrice } from '$lib/utils'
   export let cart: any
   export let count: number
   $: cart = cart
   $: items = cart?.items || []
   $: total = cart?.subtotal
   const { 
      elements: { trigger, portalled, overlay, content, title, close },
      states: { open, } 
   } = createDialog( { preventScroll: true } )
</script>
{#if $open}
   <button {...$close} use:close class="flex relative mx-2 p-2 items-center justify-center hover:bg-stone-200 rounded-md">
      <span class="sr-only">Close cart</span>
      <ShoppingCart class="text-gray-800 h-10 w-10" />
      {#if count > 0}
         <span class="z-50 absolute top-3 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-lime-600 rounded-full">
            {count}
         </span>
      {/if}
   </button>
{:else}
   <button {...$trigger} use:trigger class="flex p-2 relative mx-2 items-center justify-center hover:bg-stone-200 rounded-md">
      <span class="sr-only">View cart</span>
      <ShoppingCart class="text-gray-800 h-10 w-10" />
      {#if count > 0}
         <span class="z-50 absolute top-3 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-lime-600 rounded-full">
            {count}
         </span>
      {/if}
   </button>
{/if}
<div use:portalled>
   {#if $open}
      <div {...$overlay} use:overlay class="fixed inset-0 z-20 bg-black/50" transition:fade={{ duration: 150 }} />
      <div {...$content} use:content class="overflow-auto fixed right-0 top-0 z-50 w-full h-full pb-0 mb-0 sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-1/2 bg-white p-[25px] shadow-lg focus:outline-none" transition:fly={{ x: '100%', duration: 300, opacity: 1, }}>
         <button {...$close} use:close>
            <X class="text-gray-800 h-10 w-10" />
         </button>
         <div class="px-8 sm:px-12">
            <h2 {...$title} use:title class="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
               Shopping Cart
            </h2>
            <ul role="list" class="divide-y divide-gray-200 border-t border-gray-200">
               {#each items as item, i}
                  <li class="flex py-6">
                     <a data-sveltekit-reload href={`/product/${item.variant.product.handle}?variant=${item.variant_id}`} >
                        <div class="cursor-pointer flex-shrink-0">
                           <img src={item.thumbnail} alt={item.description} class="h-24 w-auto rounded-md object-cover object-center sm:h-32 sm:w-auto">
                        </div>
                     </a>
                     <div class="m-2 flex flex-1 flex-col sm:ml-6">
                        <div>
                           <div class="flex justify-between">
                              <a data-sveltekit-reload href={`/product/${item.variant.product.handle}?variant=${item.variant_id}`} class="cursor-pointer text-sm">
                                 <div class="font-medium text-gray-700 hover:text-gray-800">{item.title}</div>
                                 <p class="mt-1 text-sm text-gray-500">{item.description}</p>
                              </a>
                              <div>
                                 <p class="ml-4 text-sm font-medium text-gray-900">{formatPrice(item.unit_price)}</p>
                                 <p class="ml-4 text-sm text-gray-900 text-right">Qty: {item.quantity}</p>
                              </div>
                           </div>
                        </div>
                        <div class="mt-4 flex flex-1 items-end justify-between">
                           <form action="/cart?/update" method="post" use:enhance={() => { 
                              return async ({ result }) => { 
                                    if (result.type === 'success') invalidateAll()
                              }}}>
                              <select name="quantity" class="text-sm font-medium text-gray-900 rounded-lg focus:ring-gray-700 focus:border-none" on:change="{ async (e) => { 
                                    const form = e.target.closest('form')
                                    const formData = new FormData(form)
                                    const result = await fetch(form.action, {
                                       method: 'POST',
                                       body: formData
                                    }).then(res => res.json())
                                    if (result.type === 'success') invalidateAll()
                                    }}">
                                    {#each [1,2,3,4,5,6,7,8,9,10,11,12] as qty}
                                    <option value={qty} selected={qty === item.quantity}>{qty}</option>
                                    {/each}
                              </select>
                              <input type="hidden" name="itemId" value={item.id} />
                           </form>
                           <form action="/cart?/remove" method="post" use:enhance={() => { 
                              return async ({ result }) => { 
                                    if (result.type === 'success') invalidateAll()
                              }}}>
                              <div class="ml-4">
                                    <button type="submit" class="text-sm font-medium text-gray-500 hover:text-gray-400">
                                       <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                          <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                                       </svg>
                                    </button>                                        
                              </div>
                              <input type="hidden" name="itemId" value={item.id} />
                           </form>
                        </div>
                     </div>
                  </li>
               {:else}
                  <div class="my-6">
                     Cart is empty
                  </div>
               {/each}
            </ul>
            <section aria-labelledby="summary-heading" class="border-t border-gray-200 bg-white sticky bottom-0 py-6">
               {#if items.length > 0}
               <h2 id="summary-heading" class="sr-only">Order summary</h2>
               <div>
                     <dl class="space-y-4">
                        <div class="flex items-center justify-between">
                           <dt class="ml-2 text-base font-medium text-gray-900">Subtotal</dt>
                           <dd class="ml-4 mr-2 text-base font-medium text-gray-900">{formatPrice(total)}</dd>
                        </div>
                     </dl>
                     <p class="ml-2 mt-1 text-sm text-gray-500">Shipping and taxes will be calculated at checkout.</p>
               </div>
               <form action="/checkout">
                  <button use:close type="submit" class="my-4 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">Checkout</button>
               </form>
               {/if}
               <button {...$close} use:close class="w-full text-center font-medium text-gray-800 hover:text-gray-500">
                  &larr; Continue Shopping
               </button>
            </section>
         </div>         
      </div>
   {/if}
</div>
