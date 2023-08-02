import type { RequestHandler } from './$types'
import medusa from '$lib/server/medusa'
import { error, json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
   const address = await request.json()
   if (!locals.cartid || !address) { throw error(400, 'bad format') }
   const cart = await medusa.updateCartShippingAddress(locals, address)
   if (cart) return json(cart)
   else throw error(500, 'server error')
}