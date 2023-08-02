<script lang="ts">
   import SocialLinks from '$lib/components/SocialLinks.svelte'
   let year = new Date().getFullYear()
</script>
<footer class="bg-white">
   <div class="mx-auto max-w-7xl overflow-hidden py-10 px-6">
      <nav class="sm:flex flex-wrap justify-center gap-x-12" aria-label="Footer">
         <div class="flex justify-center">
            <a href="/about" class="pb-2 text-gray-700 hover:text-gray-900">About</a>
         </div>   
         <div class="flex justify-center">
            <a href="/location" class="pb-2 text-gray-700 hover:text-gray-900">Location</a>
         </div>   
         <div class="flex justify-center">
            <a href="/blog" class="pb-2 text-gray-700 hover:text-gray-900">Blog</a>
         </div>   
         <div class="flex justify-center">
            <a href="/account" class="pb-2 text-gray-700 hover:text-gray-900">Account</a>
         </div>   
         <div class="flex justify-center">
            <a href="/privacy" class="pb-2 text-gray-700 hover:text-gray-900">Privacy</a>
         </div>   
         <div class="flex justify-center">
            <a href="/terms" class="pb-2 text-gray-700 hover:text-gray-900">Terms</a>
         </div>
      </nav>
      <div class="mt-8 flex justify-center space-x-10">
         <SocialLinks />
      </div>
      <p class="mt-8 text-center text-sm leading-5 text-gray-500">&copy; {year} Your Medusa Store</p>
   </div>
</footer>