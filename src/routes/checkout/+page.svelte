<script lang="ts">
   import type { PageData } from './$types'
   import { onMount } from 'svelte'
   import SEO from '$lib/components/SEO.svelte'
   import { PUBLIC_SITE_NAME } from '$env/static/public'
   import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public'
   import { PUBLIC_STRIPE_KEY } from '$env/static/public'
   import { enhance } from '$app/forms'
   import { formatPrice } from '$lib/utils'
   import { Turnstile } from 'sveltekit-turnstile'
   import { Payment, Address, stripeClient, stripeElements } from 'sveltekit-stripe'

   export let data: PageData
   let user = data.user
   let cart = data.cart
   $: items = cart?.items || []
   
   let token: string = (PUBLIC_TURNSTILE_SITE_KEY === '')? 'no-token-required' : ''
   let clientSecret: string
   let shippingOptions: any[]
   let shippingOptionId: string
   let addressContainer: any
   let order: any
   
   let orderSummaryOpen = false
   let success = false
   let processing = false
   let loading = true
   let errorMessage = ''
   
   let contacts = []
   if (user.shipping_addresses) {
      for (let address of user.shipping_addresses) {
         contacts.push({
            name: address.first_name + ' ' + address.last_name,
            address: {
               line1: address.address_1,
               line2: address.address_2,
               city: address.city,
               state: address.province,
               postal_code: address.postal_code,
               country: address.country_code.toUpperCase(),
            }
         })
      }
   }
   let addressOptions = {
      contacts: contacts
   }

   const splitName = (name = '') => {
      const [firstName, ...lastName] = name.split(' ').filter(Boolean)
      return {
         firstName: firstName,
         lastName: lastName.join(' ')
      }
   }

   const toggleOrderSummary = () => {
      let orderSummary = document.getElementById('order-summary') as HTMLElement
      if (orderSummaryOpen) {
         orderSummary.classList.add('hidden')
         orderSummaryOpen = false
      } else {
         orderSummary.classList.remove('hidden')
         orderSummaryOpen = true
      }
   }

   const saveAddress = async (value) => {
      let address = {
         first_name: value.firstName,
         last_name: value.lastName,
         address_1: value.address.line1,
         address_2: value.address.line2,
         city: value.address.city,
         province: value.address.state,
         postal_code: value.address.postal_code,
         country_code: value.address.country.toLowerCase(),
      }
      let newAddress = true
      // if no first_name, this must be coming from stripe, so address is not new.  
      // sometimes stripe sends full name despite setting cause who knows why
      if (!address.first_name) {
         newAddress = false
         let { firstName, lastName } = splitName(value.name)
         address.first_name = firstName
         address.last_name = lastName
      } else {
         for (let existing of user.shipping_addresses) {
            if (JSON.stringify(address) === JSON.stringify(existing)) {
               newAddress = false
            }
         }
      }
      address.phone = value.phone // add after to not break the comparison above
      if (newAddress) {
         let success = await fetch('/checkout/save-address', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(address)
         })
         .then(res => res.ok)
         .catch(() => false)
         if (!success) return false
      }
      return await fetch('/checkout/shipping-address', { 
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(address) })
      .then(res => res.json())
      .catch(() => false)
   }

   const saveShippingOption = async (id: string) => {
      if (!shippingOptionId) return false
      return await fetch('/checkout/shipping-option', { 
         method: 'POST', 
         body: JSON.stringify({ 'option_id': id }) 
      }).then(res => res.json()).catch(() => false)
   }

   // const savePaymentMethod = async (id) => {
   // 	let form = new FormData()
   // 	form.append('payment_method_id', id)
   // 	return await fetch('/checkout/payment-method', { method: 'POST', body: form })
   // 	.then(res => res.json())
   // 	.catch(() => false)
   // }

   const startCheckout = async (token: string) => {
      try {
         let response = await fetch('/checkout/turnstile', { 
            method: 'POST', 
            body: JSON.stringify({ token } )
         }).then(res => res.json())
         cart = response.cart
         clientSecret = response.cart.payment_session.data.client_secret
         shippingOptions = response.shippingOptions
         for (let shippingOption of shippingOptions) {
            if (shippingOption.name === 'Free Shipping') {
               shippingOptionId = shippingOption.id
               cart = await saveShippingOption(shippingOptionId)
               break
            }
         }
         if (!shippingOptionId) {
            shippingOptionId = shippingOptions[0].id
            cart = await saveShippingOption(shippingOptionId)
         }
         loading = false
      } catch (err) {
         console.log(err)
      }
   }

   onMount( async () => {
      if (token = 'no-token-required') {
         await startCheckout(token)
      }
   })
</script>

<SEO title="Checkout" description="Checkout page for {PUBLIC_SITE_NAME}"/>

<noscript>
   <p>Please enable javascript to complete checkout.</p>
   <p>We use a third party (<a href="https://stripe.com">Stripe</a>) to process credit card payments for enhanced security.  Making payments on this site using Stripe requires javascript.</p>
</noscript>

{#if errorMessage}
   <p>{errorMessage}</p>
{:else if success}
   <main class="lg:flex lg:min-h-full lg:flex-row-reverse lg:max-h-screen lg:overflow-hidden">
      <section class="flex-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-4 lg:pt-0">
         <div class="mx-auto max-w-lg">
            <!-- Logo on thank you screen -->
            <div class="py-10 lg:flex">
               <span class="sr-only">{PUBLIC_SITE_NAME}</span>
               <a href="/"><img src="/logo.png" alt="{PUBLIC_SITE_NAME}" class="h-14 w-auto"></a>
            </div>
            <p>Thank you for your order!</p>
            <p>Your order number is <a class="font-bold text-lime-600" href={`/account/order/${order.id}`}>{order.display_id}</a></p>
            <p class="mt-6"><a href="/">&larr; Continue Shopping</a></p>
         </div>
      </section>
   </main>
{:else if (!cart?.items)}
   <p>Your cart is empty.</p>
{:else if !token}
   <Turnstile theme="light" siteKey={PUBLIC_TURNSTILE_SITE_KEY} on:turnstile-callback={ async (e) => { 
      token = e.detail.token
      await startCheckout(token)
   }} />
{:else if !loading}
   <main class="lg:flex lg:min-h-full lg:flex-row-reverse lg:max-h-screen lg:overflow-hidden">
      <h1 class="sr-only">Checkout</h1>

      <!-- Logo on sm screen -->
      <div class="px-4 py-6 sm:px-6 lg:hidden">
         <div class="mx-auto flex max-w-lg">
            <span class="sr-only">{PUBLIC_SITE_NAME}</span>
            <a href="/"><img src="/logo.png" class="mx-auto h-14 w-auto" alt="{PUBLIC_SITE_NAME}" /></a>
         </div>
      </div>
      
      <!-- Order Summary -->
      <section class="w-full flex-col lg:max-w-md bg-gray-50 p-6 overflow-auto">
         <h2 id="summary-heading" class="sr-only">Order summary</h2>
         <div class="mx-auto max-w-lg">

            <!-- Mobile order summary toggle -->
            <div class="lg:hidden flex items-center justify-between">
               <h2 id="order-heading" class="text-lg font-medium text-gray-900">Your Order</h2>
               <button on:click={toggleOrderSummary} type="button" class="font-medium text-indigo-600 hover:text-indigo-500">
                  {#if orderSummaryOpen} Hide full summary {:else} Show full summary {/if}
               </button>
            </div>
      
            <div id="order-summary" class="hidden lg:block lg:max-h-screen">
               <ul role="list" class="flex-auto">
                  {#each items as item}
                  <li class="flex space-x-6 py-6 border-b border-gray-200">
                     <img src="{item.thumbnail}" alt="item.description" class="h-28 w-auto flex-none rounded-md bg-gray-200 object-cover object-center">
                     <div class="flex flex-col justify-between space-y-4 my-auto">
                        <div class="space-y-1 text-sm font-medium">
                           <h3 class="text-gray-900">{item.title}</h3>
                           <p class="text-gray-900">{item.description}</p>
                           <p class="text-gray-500">Price: {formatPrice(item.unit_price)}</p>
                           <p class="text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                     </div>
                  </li>
                  {/each}
               </ul>
               
               <form class="hidden mt-10">
                  <label for="discount-code-mobile" class="block text-sm font-medium text-gray-700">Discount code</label>
                  <div class="mt-1 flex space-x-4">
                     <input type="text" id="discount-code-mobile" name="discount-code-mobile" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                     <button type="submit" class="rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Apply</button>
                  </div>
               </form>
      
               <dl class="py-6 space-y-6 text-sm font-medium text-gray-500">
                  <div class="flex justify-between">
                     <dt>Subtotal</dt>
                     <dd class="text-gray-900">{formatPrice(cart?.subtotal)}</dd>
                  </div>
                  {#if cart?.discount_total}
                  <div class="flex justify-between">
                     <dt class="flex">
                        Discount
                        <span class="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">{cart.discounts[0]}</span>
                     </dt>
                     <dd class="text-gray-900">{formatPrice(cart.discount_total)}</dd>
                  </div>
                  {/if}
                  <div class="flex justify-between">
                     <dt>Taxes</dt>
                     <dd class="text-gray-900">{formatPrice(cart?.tax_total)}</dd>
                  </div>
                  <div class="flex justify-between">
                     <dt>Shipping</dt>
                     <dd class="text-gray-900">{formatPrice(cart?.shipping_methods[0]?.price)}</dd>
                  </div>
               </dl>
               
               <p class="py-6 flex items-center justify-between border-t border-gray-200 text-sm font-medium text-gray-900">
                  <span class="text-base">Total</span>
                  <span class="text-base">{formatPrice(cart?.total)}</span>
               </p>

            </div>
         </div>
      </section>
   
      <!-- Checkout form -->
      <section aria-labelledby="payment-heading" class="flex-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-4 lg:pt-0 overflow-auto">
         <div class="mx-auto max-w-lg">

            <!-- Logo on lg screen -->
            <div class="hidden py-10 lg:flex">
               <span class="sr-only">{PUBLIC_SITE_NAME}</span>
               <a href="/"><img src="/logo.png" alt="{PUBLIC_SITE_NAME}" class="h-14 w-auto"></a>
            </div>

            <form class="grid gap-y-8" method="POST" use:enhance={ async ({ cancel }) => {
               if (processing) cancel()
               processing = true
         
               // capture shipping address
               const {complete, value} = await addressContainer.getValue()
               if (complete) {
                  cart = await saveAddress(value)
                  if (!cart) {
                     errorMessage = 'Something went wrong while saving your address.'
                     console.log(errorMessage)
                     processing = false
                     cancel()
                  }
               }
      
               // capture final shipping method
               cart = await saveShippingOption(shippingOptionId)
               if (!cart) {
                  errorMessage = 'Something went wrong while selecting the shipping option.'
                  console.log(errorMessage)
                  processing = false
                  cancel()
               }
         
               // confirm payment
               const stripeResponse = await $stripeClient.confirmPayment({ elements: $stripeElements, redirect: 'if_required' })
               if (stripeResponse.error) {
                  errorMessage = stripeResponse.error.message
                  processing = false
                  cancel()
               } else {
                  return async ({ result }) => {
                     if (result.status === 200) {
                        success = true
                        order = result.data.order
                     } 
                  }
               }
            }}>

               <Address publicKey={PUBLIC_STRIPE_KEY} {addressOptions} {clientSecret} bind:addressContainer/>

               <select bind:value={shippingOptionId} on:change={async () => { cart = await saveShippingOption(shippingOptionId) } } name="shippingOptionId" required="required" class="block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-300 focus:ring-blue-300 text-gray-600 py-3">
                  {#each shippingOptions as shippingOption}
                     <option value={shippingOption.id}>{shippingOption.name} {formatPrice(shippingOption.price_incl_tax)}</option>
                  {/each}
               </select>

               <Payment publicKey={PUBLIC_STRIPE_KEY} {clientSecret} />			
         
               <button disabled={processing} type="submit" class="w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-5 py-3 text-base font-medium text-white hover:bg-lime-700">
                  {#if processing} Processing...{:else} Complete Your Order {/if}
               </button>
         
               <p class="flex justify-center text-sm font-medium text-gray-500">
                  <svg class="mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                  </svg>
                  Payments processed securely by Stripe
               </p>
            </form>

         </div>
      </section>
   </main>
{/if}