<script lang="ts">
   import { PUBLIC_SITE_NAME, PUBLIC_SITE_DESCRIPTION, PUBLIC_SITE_URL, PUBLIC_SITE_IMAGE } from '$env/static/public'
   import { PUBLIC_TWITTER_HANDLE, PUBLIC_TWITTER_SITE, PUBLIC_TWITTER_CARD_TYPE } from '$env/static/public'
   import { MetaTags } from 'svelte-meta-tags'
   import { page } from '$app/stores'

   export let title = ''
   export let description = PUBLIC_SITE_DESCRIPTION
   export let images = []
   export let og = true
   export let twitter = true

   let titleTemplate = `%s | ${PUBLIC_SITE_NAME}`

   if (!title) {
      title = PUBLIC_SITE_NAME
      titleTemplate = '%s'
   }

   if (images.length > 0) {
      images = images.map(i => {
         if (i.url.startsWith('/')) {
            i.url = PUBLIC_SITE_URL + i.url
         }
         i.alt = i.alt || description
         return i
      })
   } else {
      images = [
         {
            url: PUBLIC_SITE_IMAGE,
            alt: PUBLIC_SITE_NAME
         }
      ]
   }

   const ogData = og? {
      url: $page.url.href,
      title: title,
      description: description,
      images: images,
      siteName: PUBLIC_SITE_NAME
   } : undefined

   const twitterData = twitter? {
      handle: PUBLIC_TWITTER_HANDLE,
      site: PUBLIC_TWITTER_SITE,
      cardType: PUBLIC_TWITTER_CARD_TYPE,
      title: title,
      description: description,
      image: images[0].url,
      imageAlt: images[0].alt
   } : undefined
</script>

<MetaTags
   title={title}
   titleTemplate={titleTemplate}
   description={description} 
   canonical={$page.url.origin + $page.url.pathname}
   openGraph={ogData}
   twitter={twitterData}
/>