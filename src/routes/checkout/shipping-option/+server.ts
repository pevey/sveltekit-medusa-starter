import type { RequestHandler } from './$types'
import medusa from '$lib/server/medusa'
import { error, json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
   const data = await request.formData()
   let shippingOptionId = data.get('option_id') as string
   if (!locals.cartid || !shippingOptionId) { throw error(500, 'bad format') }
   let cart = await medusa.selectShippingOption(locals, shippingOptionId)
   if (cart.total) {
      return json(cart)
   } else { 
      throw error(404, 'not found') 
   }
}