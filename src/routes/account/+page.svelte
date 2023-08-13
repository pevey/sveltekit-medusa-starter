<script lang="ts">
   import type { PageData } from './$types'
   import { PUBLIC_SITE_NAME } from '$env/static/public'
   import Meta from '$lib/components/SEO.svelte'
   import { enhance } from '$app/forms'
   import { invalidateAll } from '$app/navigation'
   import Pagination from '$lib/components/Pagination.svelte'

   export let data: PageData
//console.log(data.user)
   $: ({ id, email, first_name, last_name, phone, billing_address_id, shipping_addresses, orders } = data.user)
   $: orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
   $: currentPage = data?.currentPage || 1
   let opp = 10 // orders per page
   let processing = false
   let editInfo = false
   let editAddress = false
   let changePassword = false
</script>

<Meta title="Account" description="Manage your account at {PUBLIC_SITE_NAME}"/>

<div class="max-w-screen-2xl mx-auto py-6 px-6 md:px-8 sm:px-6">
   <h1 class="text-2xl font-semibold mb-8 sm:mb-12 text-center">Your Account</h1>
   <div class="max-w-screen-lg mx-auto">
   
      <!-- Contact Information -->
      <div class="flex items-center border-b border-gray-500 pb-3">
         <h2 class="text-xl font-semibold text-gray-900">Contact Information</h2>
         <button type="button" on:click={() => editInfo = !editInfo} class="ml-6 font-medium text-lime-600 hover:text-lime-500">
            {#if editInfo}
               Cancel
            {:else}
               Edit
            {/if}
         </button>
      </div>
      {#if editInfo}
         <form action="?/editInfo" method="POST" use:enhance={ async ({ cancel }) => {
            if (processing) cancel()
            processing = true
            return async ({ form, result }) => {
               if (result.status === 200) {
                  await invalidateAll()
                  form.reset()
                  editInfo = false
               } else {
                  console.log('failed')
               }
               processing = false 
            }
         }}>
            <div class="mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
               <div class="sm:col-span-6">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" value={first_name} name="firstName" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" value={last_name} name="lastName" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-7">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="text" value={email} name="email" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-5">
                  <label for="last_name" class="block text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input type="text" value={phone} name="phone" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
                  <button disabled={processing} type="submit" class="mt-6 w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white bg-lime-600 hover:bg-lime-700">
                     {#if processing}
                        Processing...
                     {:else}
                        Save
                     {/if}
                  </button>
               </div>
               <div class="sm:col-span-6">
                  <button hidden={processing} on:click|preventDefault={() => { editInfo = false }} type="button" class="mt-6 w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-600">
                     Cancel
                  </button>
               </div>
            </div>
         </form>
      {:else if (changePassword)}
         <form action="?/changePassword" method="POST" use:enhance={ async ({ cancel }) => {
            if (processing) cancel()
            processing = true
            return async ({ form, result }) => {
               if (result.status === 200) {
                  await invalidateAll()
                  form.reset()
                  changePassword = false
               } else {
                  console.log('failed')
               }
               processing = false 
            }
         }}>
            <div class="mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
               <div class="sm:col-span-6">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                  <input name="currentPassword" type="password" autocomplete="current-password" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
               </div>
               <div class="sm:col-span-6">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                  <input name="newPassword" type="password" autocomplete="new-password" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input name="confirmPassword" type="password" autocomplete="new-password" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
                  <button disabled={processing} type="submit" class="mt-6 w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white bg-lime-600 hover:bg-lime-700">
                     {#if processing}
                        Processing...
                     {:else}
                        Save
                     {/if}
                  </button>
               </div>
               <div class="sm:col-span-6">
                  <button hidden={processing} on:click|preventDefault={() => { changePassword = false }} type="button" class="mt-6 w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-600">
                     Cancel
                  </button>
               </div>
            </div>
         </form>
      {:else}
         <p class="mt-3">{first_name} {last_name}</p>
         <p>{email}</p>
         {#if phone}
         <p>{phone}</p>
         {/if}
         <button on:click={() => { changePassword = true } } class="text-lime-600 hover:text-lime-500 mb-8 sm:mb-12 mt-3 ">Change Password</button>
      {/if}
   
      <!-- Addresses -->
      <div class="flex items-center border-b border-gray-500 pb-3">
         <h2 class="text-xl font-semibold text-gray-900">Addresses</h2>
         <button type="button" on:click={() => editAddress = !editAddress} class="ml-6 font-medium text-lime-600 hover:text-lime-500">
            {#if editAddress}
               Cancel
            {:else}
               Add
            {/if}
         </button>
      </div>
      {#if editAddress}
         <form action="?/addAddress" method="POST" use:enhance={ async ({ cancel }) => {
            if (processing) cancel()
            processing = true
            return async ({ form, result }) => {
               if (result.status === 200) {
                  form.reset()
                  await invalidateAll()
                  editAddress = false
               } else {
                  console.log('failed')
               }
               processing = false 
            }
         }}>
            <div class="mt-5 mb-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12">
               <div class="sm:col-span-6">
                  <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" name="firstName" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" name="lastName" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-12">
                  <label for="address1" class="block text-sm font-medium text-gray-700">Address Line 1</label>
                  <input type="text" name="address1" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-12">
                  <label for="address2" class="block text-sm font-medium text-gray-700">Address Line 2</label>
                  <input type="text" name="address2" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-8">
                  <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-4">
                  <label for="state" class="block text-sm font-medium text-gray-700">State</label>
                  <input type="text" name="state" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-4">
                  <label for="zip" class="block text-sm font-medium text-gray-700">Zip</label>
                  <input type="text" name="zip" required="required" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-8">
                  <label for="last_name" class="block text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input type="text" name="phone" class="block w-full rounded-md border-gray-300 px-3 py-3 placeholder-gray-500 focus:border-lime-500 focus:ring-lime-500" />
               </div>
               <div class="sm:col-span-6">
                  <button disabled={processing} type="submit" class="mt-6 w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white bg-lime-600 hover:bg-lime-700">
                     {#if processing}
                        Processing...
                     {:else}
                        Save
                     {/if}
                  </button>
               </div>
               <div class="sm:col-span-6">
                  <button hidden={processing} on:click|preventDefault={() => { editAddress = false }} type="button" class="mt-6 w-full items-center justify-center rounded-md border border-transparent px-5 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-600">
                     Cancel
                  </button>
               </div>
            </div>
         </form>
      {:else}
         <div class="flex flex-wrap mt-3 mb-8 sm:mb-12">
            {#each shipping_addresses as address}
            <div class="border rounded-md p-4 mr-3 mb-2">
               <p>{address.first_name} {address.last_name}</p>
               <p>{address.address_1}</p>
               {#if address.address_2}
                  <p>{address.address_2}</p>
               {/if}
               <p>{address.city}, {address.province}</p>
               <p>{address.postal_code}</p>
               {#if address.phone}
                  <p>{address.phone}</p>
               {/if}
               <div class="mt-3">
                  <button class="text-lime-600 hover:text-lime-500 pr-2">Edit</button>
                  <form class="inline" action="?/deleteAddress" method="POST"use:enhance={ async ({ cancel }) => {
                     return async ({ result }) => {
                        if (result.status === 200) {
                           await invalidateAll()                
                        } else {
                           console.log('failed')
                        }
                        processing = false 
                     }}}>
                     <button type="submit" class="text-lime-600 hover:text-lime-500 pl-2">Delete</button>
                     <input type="hidden" name="addressId" value={address.id} />
                  </form>
               </div>
            </div>
            {:else}
            No addresses saved
            {/each}
         </div>
      {/if}
      
      <!-- Orders -->
      {#if orders?.length}
         <div class="flex items-center border-b border-gray-500 pb-3">
            <h2 class="text-xl font-semibold text-gray-900">Orders</h2>
         </div>
         {#each orders as order, i}
            {#if i >= currentPage * opp - opp && i < currentPage * opp}
               <div class="sm:flex sm:flex-wrap my-3 justify-between">
                  <div class="mr-2 block sm:inline">
                     {new Date(order.created_at).toLocaleDateString('us-EN', {month: 'long', day: 'numeric', year: 'numeric'})}
                  </div>
                  <div class="mr-2 block sm:inline">
                     Order Num: {order.display_id}
                  </div>
                  <div class="mr-2 block sm:inline">
                     {order.fulfillment_status === 'fulfilled' ? 'Shipped' : 'Pending'}
                  </div>
                  <div>
                     <a href={`/account/order/${order.id}`} class="text-lime-600 hover:text-lime-500 mr-3">View / Track</a>
                  </div>
               </div>
            {/if}
         {/each}
         <Pagination bind:currentPage={currentPage} itemCount={orders.length} itemsPerPage={opp}/>
      {:else}
         <div class="my-3">
            No orders yet
         </div>
      {/if}
   </div>
</div>