<script lang="ts">
   import NavLinks from './NavLinks.svelte'
   import Cart from './Cart.svelte'
   import Account from './Account.svelte'
   import SearchBox from './SearchBox.svelte'
   import SideBar from './SideBar.svelte'
   export let user: {}
   export let cart: {}
   export let count: number
</script>
<nav class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 bg-transparent">
   <div class="flex flex-grow items-center justify-between mt-3">
      <div class="flex flex-none items-center">
         <a class="inline-block text-3xl font-bold" href="/">
            <img src="/logo.svg" alt="Logo" class="h-14 w-auto">
         </a>
         <div class="hidden lg:block mr-auto lg:ml-6">
            <NavLinks />
         </div>
      </div>
      <div class="flex flex-grow align-middle items-center justify-between ml-4">
         <SearchBox />
      </div>
      <div class="flex flex-none relative align-middle justify-end lg:ml-4">
         <div>
            <Cart bind:cart={cart} bind:count={count} />
         </div>
         <div class="hidden md:block">
            <Account {user} />
         </div>
         <div class="lg:hidden">
            <SideBar {user} />
         </div>
      </div>
   </div>
</nav>