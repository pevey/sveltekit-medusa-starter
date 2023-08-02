import type { Handle } from '@sveltejs/kit'
import medusa from '$lib/server/medusa'

export const handle: Handle = async ({ event, resolve }) => {

   // MEDUSA SESSION MIDDLEWARE  
   // Sets locals.user and locals.cart if they are found.
   event = await medusa.handleRequest(event)

   const response = await resolve(event)

   // CACHE CONTROL	
   // response.headers.set['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate'
   // response.headers.set['Cache-Control'] = 'public, max-age=0, s-maxage=1'
   
   // SECURITY HEADERS
   // CSP directives are set elsewhere in svelte.config.js and added automatically by SvelteKit.
   // CSRF mitigation in SvelteKit is handled by header-checking and is enabled by default. More secure token-based CSRF mitigation must be added manually.
   // Token-based CSRF mitigation for the most sensitive endpoints/form actions is handled by Cloudflare Turnstile.
   response.headers.set('X-Frame-Options', 'DENY')
   response.headers.set('X-Content-Type-Options', 'nosniff')
   response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
   response.headers.set('Permissions-Policy', 'payment=(self "https://js.stripe.com/"), accelerometer=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()')

   return response
}