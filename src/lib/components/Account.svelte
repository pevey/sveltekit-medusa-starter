<script lang="ts">
   import { UserCircle2 } from 'lucide-svelte'
   import { createDropdownMenu } from '@melt-ui/svelte'
   import { goto } from '$app/navigation'
   export let user: any | null = null
   const { 
      elements: { trigger, menu, item }
   } = createDropdownMenu({ 
      positioning: { placement: 'bottom-end' },
      arrowSize: 0,
      preventScroll: false,
   })
   const logout = async () => {
      const formData = new FormData() // The POST request fails without a body
      const res = await fetch('/auth?/logout', { method: 'POST', body: formData })
      if (res.ok) goto('/auth')
   } 
</script>
{#if user}
   <button type="button" {...$trigger} use:trigger aria-label="Open account menu" class="flex p-2 ml-2 items-center justify-center hover:bg-stone-200 rounded-md">
      <span class="sr-only">View account</span>
      <UserCircle2 class="text-gray-800 h-10 w-10" />
   </button>
{:else}
   <a href="/auth">
      <button type="button" class="flex p-2 mx-2 items-center justify-center hover:bg-stone-200 rounded-md">
         <span class="sr-only">Sign In</span>
         <UserCircle2 class="text-gray-800 h-10 w-10" />
      </button>
   </a>
{/if}
<div {...$menu} use:menu class="menu">
   <div {...$item} use:item class="item">
      <a href="/account">Your Profile</a>
   </div>
   <div {...$item} use:item class="item">
      <button type="button" on:click={logout}>Sign Out</button>
   </div>
</div>
<style lang="postcss">
   .menu {
      @apply z-10 flex flex-col shadow-lg;
      @apply rounded-lg bg-white p-1 shadow-neutral-900/30;
      @apply ring-0 !important;
   }
   .item {
      @apply relative h-6 min-h-[24px] select-none rounded-md px-8 py-6;
      @apply z-20 text-gray-900 outline-none;
      @apply data-[highlighted]:bg-stone-200 data-[highlighted]:text-purple-900;
      @apply data-[disabled]:text-neutral-300;
      @apply flex items-center text-sm leading-none;
      @apply ring-0 !important;
   }
   .trigger {
      @apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
      @apply text-purple-900 transition-colors hover:bg-white/90;
      @apply data-[highlighted]:ring-purple-400 data-[highlighted]:ring-offset-2 !important;
      @apply p-0 text-sm font-medium focus:ring data-[highlighted]:outline-none;
   }
</style>
