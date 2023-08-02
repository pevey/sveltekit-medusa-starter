import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async function ({ url, locals }) {
   if (!locals.user) throw redirect(307, '/auth')
   return {
      currentPage: parseInt(url.searchParams?.get('page') as string) || 1
   }
}

export const actions: Actions = {

   editInfo: async ({ request, locals }) => {
      const data = await request.formData()
      const first_name = data.get('firstName') as string
      const last_name = data.get('lastName') as string
      const email = data.get('email') as string
      const phone = data.get('phone') as string
      if (!first_name || !last_name || !email) {
         return fail(400, { first_name, missing: true })
      }
      const success = await medusa.editCustomer(locals, { first_name, last_name, email, phone })
      return { success }
   },

   addAddress: async ({ request, locals }) => {
      const data = await request.formData()
      const first_name = data.get('firstName') as string
      const last_name = data.get('lastName') as string
      const address_1 = data.get('address1') as string
      const address_2 = data.get('address2') as string
      const city = data.get('city') as string
      const country_code = 'us'
      const province = data.get('state') as string
      const postal_code = data.get('zip') as string
      const phone = data.get('phone') as string
      if (!first_name || !last_name || !address_1 || !city || !province || !postal_code) {
         console.log(first_name, last_name, address_1, city, province, postal_code)
         return fail(400, { first_name, missing: true })
      }
      const success = await medusa.addShippingAddress(locals, { first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone })
      return { success  }
   },

   editAddress: async ({ request, locals }) => {
   },

   deleteAddress: async ({ request, locals }) => {
      const data = await request.formData()
      const addressId = data.get('addressId') as string
      if (!addressId) {
         return fail(400, { addressId, missing: true })
      }
      const success = await medusa.deleteAddress(locals, addressId)
      return { success }
   },

   changePassword: async ({ request, locals }) => {
      const data = await request.formData()
      const currentPassword = data.get('currentPassword') as string
      const newPassword = data.get('newPassword') as string
      const confirmPassword = data.get('confirmPassword')
      if (!currentPassword || !newPassword || !confirmPassword) {
         return fail(400, { currentPassword, newPassword, confirmPassword, missing: true })
      }
      if (newPassword !== confirmPassword) {
         return fail(400, { currentPassword, newPassword, confirmPassword, mismatch: true })
      }
      const success = await medusa.editCustomer(locals, { password: newPassword })
      return { success }
   }
}