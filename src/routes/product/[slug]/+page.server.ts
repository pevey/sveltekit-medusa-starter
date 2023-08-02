import type { PageServerLoad } from './$types'
import medusa from '$lib/server/medusa'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async function ({ params }) {
   let product: any = await medusa.getProduct(params.slug)
   if (!product) throw error(404, 'Product not found')
   product.valid_until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit'})
   return { 
      product
   }
}