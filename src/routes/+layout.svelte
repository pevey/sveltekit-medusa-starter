<script lang="ts">
	import '$src/app.css'
   import type { PageData } from './$types'
   import { page } from '$app/stores'
	import clickOutside from '$lib/clickOutside'
	import Account from "$lib/components/Account.svelte"
	import Menu from '$lib/components/Menu.svelte'
	import Search from '$lib/components/Search.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import Cart from '$lib/components/Cart.svelte'

	export let data

	$: user = data?.user
	$: cart = data?.cart
	$: items = cart?.items || []

	let cartOpen = false
	let mobileMenuOpen = false

	function closeMobileMenu(event) {
		mobileMenuOpen = false
	}

</script>

<svelte:head>
  <link rel="canonical" href="{$page.url.origin + $page.url.pathname}" />
</svelte:head>

<nav>
	<div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-grow items-center justify-between mt-3">
			<div class="flex flex-none items-center">
				<a href="/">
					<img class="block h-14 w-auto md:hidden" src="/logo.png" alt="Louisiana Roasting Company">
					<img class="hidden h-auto w-auto md:block" src="/logo.png" alt="Louisiana Roasting Company">
				</a>
				<div class="hidden lg:block mr-auto lg:ml-6">
					<Menu />
				</div>
				<div class="lg:hidden justify-start mr-auto mx-3 sm:mx-4">
					<!-- Mobile menu button -->
					<button on:click={() => mobileMenuOpen=true} type="button" class="lg:hidden">
						<span class="sr-only">Open main menu</span>
						<!-- Icon when menu is closed. -->
						<svg class:block={!mobileMenuOpen} class:hidden={mobileMenuOpen} class="text-gray-800 h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
					<button on:click={() => mobileMenuOpen=false} type="button" class="lg:hidden">
						<span class="sr-only">Close main menu</span>
						<!-- Icon when menu is open. -->
						<svg class:block={mobileMenuOpen} class:hidden={!mobileMenuOpen} class="text-gray-800 h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
			<div class="flex flex-grow align-middle items-center justify-between lg:ml-4">
				<Search />
			</div>
			<div class="flex flex-none relative align-middle justify-end lg:ml-4">
				<div>
					<button type="button" on:click={() => cartOpen = true} class="z-50 relative mx-3 sm:mx-4">
						<span class="sr-only">View cart</span>
						<svg class="text-gray-800 h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 10.5V6C15.75 3.92893 14.0711 2.25 12 2.25C9.92893 2.25 8.25 3.92893 8.25 6V10.5M19.606 8.50723L20.8692 20.5072C20.9391 21.1715 20.4183 21.75 19.7504 21.75H4.24963C3.58172 21.75 3.06089 21.1715 3.13081 20.5072L4.39397 8.50723C4.45424 7.93466 4.93706 7.5 5.51279 7.5H18.4872C19.0629 7.5 19.5458 7.93466 19.606 8.50723ZM8.625 10.5C8.625 10.7071 8.4571 10.875 8.25 10.875C8.04289 10.875 7.875 10.7071 7.875 10.5C7.875 10.2929 8.04289 10.125 8.25 10.125C8.4571 10.125 8.625 10.2929 8.625 10.5ZM16.125 10.5C16.125 10.7071 15.9571 10.875 15.75 10.875C15.5429 10.875 15.375 10.7071 15.375 10.5C15.375 10.2929 15.5429 10.125 15.75 10.125C15.9571 10.125 16.125 10.2929 16.125 10.5Z" />
						</svg>
						{#if items.length > 0}
						<span class="z-50 absolute top-2 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-lime-600 rounded-full">
							{items.length}
						</span>
						{/if}
					</button>
				</div>
				<div>
					<Account {user} />
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
   {#if mobileMenuOpen}
	<div on:click={closeMobileMenu} use:clickOutside on:clickOutside={closeMobileMenu} class="lg:hidden md:mx-4 rounded-xl bg-gray-200 my-4" id="mobile-menu">
		<div class="px-2 py-2 space-y-1">
			<Menu mobileMenuOpen=true />
		</div>
	</div>
   {/if}

</nav>
<main class="max-w-screen-2xl mx-auto py-6 px-6 md:px-8">
	<slot />
</main>

<Footer />

<Cart bind:open={cartOpen} bind:cart={cart} on:clickAway={() => cartOpen = false} />