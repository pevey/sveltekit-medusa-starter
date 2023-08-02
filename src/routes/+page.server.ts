import type { PageServerLoad } from './$types'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async function () {
   
   let products = await medusa.getProducts()

   return { 
      products
   }
}