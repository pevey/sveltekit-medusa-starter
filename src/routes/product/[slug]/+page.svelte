<script lang="ts">
   import type { PageData } from './$types'
   import SEO from '$lib/components/SEO.svelte'
   import { JsonLd } from 'svelte-meta-tags'
   import { queryParam } from 'sveltekit-search-params'
   import { page } from '$app/stores'
   import { enhance } from '$app/forms'  
   import { invalidateAll } from '$app/navigation'
   import { formatPrice, findVariant, findSelectedOptions } from '$lib/utils'
   import FAQ from './FAQ.svelte'
   import Gallery from './Gallery.svelte'
   import Highlights from './Highlights.svelte'

   export let data: PageData
   let user = data.user as any
   let product = data.product as any
   let images = product.images as any
   let tab: string = 'faq'

   let urlVariantId
   const v = queryParam('v')
   //don't even try to use a variant id if it's too long
   if ($v) {      
      if ($v.toString().length > 40) urlVariantId = ''
      else urlVariantId = $v.toString()
   }
   
   let selectedOptions: any[] | null = null
   let selectedVariantId: string

   // if variant was passed in url, check if it's valid
   if (urlVariantId) {
      selectedVariantId = urlVariantId
      selectedOptions = findSelectedOptions(selectedVariantId, product)
   }
   // if not or if invalid, use first variant
   if (!selectedOptions) {
      selectedVariantId = product.variants[0].id
      selectedOptions = findSelectedOptions(selectedVariantId, product)
   }

   const handleSelection = (option: any, value: string) => {
      if (!selectedOptions) return false
      selectedOptions[option.id] = value
      selectedVariantId = findVariant(selectedOptions, product) || 
         product.variants[product.variants.findIndex((variant: any) => variant.options.find((option: any) => option.value === value))].id
      selectedOptions = findSelectedOptions(selectedVariantId, product)
      $v = selectedVariantId
      //todo: set certain combo values as invalid
      // let testOptions = []
      // testOptions[option.id] = value
      // for (let opt of product.options.filter(o => o.id !== option.id)) {
      //    for (let val of opt.values) {
      //       testOptions[opt.id] = val.value
      //       if (findVariant(testOptions) === false) {
      //          opt.invalid = true
      //       }
      //       testOptions[opt.id] = null         
      //    }
      // }
   }

   let price = product.variants[0].prices[0].amount / 100
</script>

<SEO title="{product.title}" images={product.images} description="{product.title}, {product.subtitle} - {product.description}"/>

<JsonLd 
   schema={{
      '@type': 'Product',
      name: `${product.title}`,
      image: [
         `${product.thumbnail}`,
         // 'https://example.com/photos/1x1/photo.jpg',
         // 'https://example.com/photos/4x3/photo.jpg',
         // 'https://example.com/photos/16x9/photo.jpg'
      ],
      description:
         //   `${product.subtitle} - ${product.description}`,
         `${product.description}`,
         //  sku: '0446310786',
         //  mpn: '925872',
      brand: {
         '@type': 'Brand',
         name: 'Company'
      },
      offers: {
         '@type': 'Offer',
         url: `${$page.url.href}`,
         priceCurrency: 'USD',
         price: `${price}`,
         priceValidUntil: `${product.valid_until}`,
         itemCondition: 'https://schema.org/NewCondition',
         availability: 'https://schema.org/InStock',
         shippingDetails: {
            '@type': 'OfferShippingDetails',
            'shippingRate': {
               '@type': 'MonetaryAmount',
               'value': '0',
               'currency': 'USD'
            },
            'shippingDestination': [{
               '@type': 'DefinedRegion',
               'addressCountry': 'US'
            }]
         }
      },
   }}
/>

<div class="max-w-screen-2xl mx-auto py-6 px-6 md:px-8 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-x-6">
   <div class="lg:max-w-lg lg:self-end">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.title}</h1>
      <h2 id="information-heading" class="sr-only">Product information</h2>
      <p class="mt-2 text-sm">{product.subtitle}</p>
      <p class="mt-6">{product.description}</p>
      {#each product.options as option}
      <div class="mt-6">
         <h3 class="text-sm font-medium">{option.title}</h3>
         <div class="mt-4">
            <div class="flex flex-wrap">
            {#each option.filteredValues as value}
            {#if value === selectedOptions[option.id]}
            <button type="button" class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium text-gray-700 border-4 border-lime-600 bg-white hover:bg-white">
               {value}
            </button>
            {:else}
            <button type="button" on:click={(e) => { handleSelection(option, value) }} class="uppercase whitespace-nowrap px-3 py-2 mr-2 mb-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-400 bg-white hover:bg-stone-200">
               {value}
            </button>
            {/if}
            {/each}
            </div>
         </div>
      </div>
      {/each}
      <div class="mt-6">
         <h3 class="text-sm font-medium">Price</h3>
         <div class="mt-1 flex items-baseline">
            <p class="text-2xl font-bold">{formatPrice(product.variants[product.variants.findIndex(v => v.id === selectedVariantId)].prices[0].amount)}</p>
            <p class="ml-1 text-sm font-medium text-gray-600">/ {product.variants[product.variants.findIndex(v => v.id === selectedVariantId)].title}</p>
         </div>
      </div>
      <form action="/cart?/add" method="post" use:enhance={() => { return async ({ result }) => { if (result.type === 'success') { await invalidateAll() }}}}>
         <input type="hidden" name="variantId" value="{product.variants[product.variants.findIndex(v => v.id === selectedVariantId)].id}" />
         <button type="submit" class="mt-6 w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">
            Add to Cart
         </button>
      </form>
   </div>
   <div class="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 items-start">
      <Gallery {images} />      
   </div>
   <div class="mb-4">
      <Highlights />
   </div>
   <!-- Tabs -->
   <div class="max-w-screen-lg lg:col-span-2">
      <div class="flex" aria-orientation="horizontal" role="tablist">
         <button type="button" on:click="{() => tab = 'faq'}" class="{tab === 'faq' ? 
            "whitespace-nowrap p-3 px-4 mr-4 border-b-2 font-medium border-lime-600 text-gray-800" : 
            "whitespace-nowrap p-3 px-4 mr-4 text-gray-500 hover:text-gray-700 border-b border-gray-300 hover:border-b-2 hover:border-gray-300"}">
            FAQ
         </button>
         <button type="button" on:click="{() => tab = 'other'}" class="{tab === 'other' ? 
            "whitespace-nowrap p-3 pr-4 mr-4 border-b-2 font-medium border-lime-600 text-gray-800" : 
            "whitespace-nowrap p-3 pr-4 mr-4 text-gray-500 hover:text-gray-700 border-b border-gray-300 hover:border-b-2 hover:border-gray-300"}">
            Other Tab
         </button>
      </div>
      {#if tab == 'faq'}
         <FAQ/>      
      {:else if tab == 'other'}
         Other tab content
      {/if}
   </div>
</div>