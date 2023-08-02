import { MedusaClient } from 'sveltekit-medusa-client'
import { MEDUSA_BACKEND_URL, CLOUDFLARE_ACCESS_ID, CLOUDFLARE_ACCESS_SECRET } from '$env/static/private'
export default new MedusaClient(MEDUSA_BACKEND_URL, { 
   headers: {
      'CF-Access-Client-Id': CLOUDFLARE_ACCESS_ID,
      'CF-Access-Client-Secret': CLOUDFLARE_ACCESS_SECRET,
   },
   retry: 0,
   persistentCart: true
})