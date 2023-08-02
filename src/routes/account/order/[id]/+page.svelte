<script lang="ts">
   import { PUBLIC_SITE_NAME } from '$env/static/public'
   import SEO from '$lib/components/SEO.svelte'
   import { formatPrice } from '$lib/utils'

   export let data
   const order = data.order

</script>

<SEO title="Order Details" description="Details about your order from {PUBLIC_SITE_NAME}"/>

<h1 class="text-2xl font-semibold my-5 sm:my-8 text-center">Order #{order.display_id}</h1>
<div class="grid grid-cols-1 sm:grid-cols-2 max-w-screen-lg mx-auto">
   <div class="col-span-1">
      <h2 class="mt-6 mb-2 text-xl font-semibold text-gray-900">Status</h2>
      {#if order.fulfillment_status === 'shipped'}
         <p>Shipped on {new Date(order.fulfillments[0]?.shipped_at).toLocaleDateString('us-EN', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
         {#if order.fulfillments[0].tracking_links[0]?.tracking_number}
            <p>Tracking # {order.fulfillments[0].tracking_links[0]?.tracking_number}</p>
         {/if}
      {:else if order.fulfillment_status === 'filled'}
         <p>Ready to Ship</p>
      {:else}
         <p>In Process</p>
      {/if}
   
      <h2 class="mt-6 mb-2 text-xl font-semibold text-gray-900">Shipping Address</h2>
      <p>{order.shipping_address.first_name} {order.shipping_address.last_name}<br>
         {order.shipping_address.address_1}<br>
         {#if order.shipping_address.address_2}{order.shipping_address.address_2}<br>{/if}
         {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}<br></p>

      <h2 class="mt-6 mb-2 text-xl font-semibold text-gray-900">Payment</h2>
      <p>Order Subtotal: {formatPrice(order.subtotal)}</p>
      <p>Shipping: {formatPrice(order.shipping_total)}</p>
      <p>Payment: {formatPrice(order.payments[0]?.amount)}</p>
      {#if order.payments[0]?.amount_refunded}
         <p>Refunded: {formatPrice(order.payments[0]?.amount_refunded)}</p>
      {/if}


   </div>
   <div class="col-span-1">
      <h2 class="mt-6 mb-2 text-xl font-semibold text-gray-900">Items</h2>
      <ul role="list" class="flex-auto">
         {#each order.items as item}
         <li class="flex space-x-6 py-3">
            <img src="{item.thumbnail}" alt="Product image" class="h-28 w-auto flex-none rounded-md bg-gray-200 object-cover object-center">
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
   </div>



</div>

