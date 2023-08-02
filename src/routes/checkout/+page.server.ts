import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async function ({ locals }) {
   if (!locals.user) throw redirect(302, '/auth?rurl=checkout')

   return {
      user: locals.user,
      cart: locals.cart
   }
}

export const actions: Actions = {
   default: async ({ locals, cookies }) => {
      //remove cookie first because customer has already paid for the cart
      const order = await medusa.completeCart(locals)
      cookies.set('cartid', '', {
         path: '/',
         maxAge: 0,
         sameSite: 'strict',
         httpOnly: true,
         secure: true
      })
      locals.cartid = ''
      if (order) {
         return { success: true, order: order }
      } else {
         return fail (400, { success: false })
      }
   }
}