import type { PageServerLoad, Actions } from './$types'
import medusa from '$lib/server/medusa'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async function ({ url }) {
   const q = url.searchParams?.get('q')
   let hits = q? await medusa.getSearchResults(q) : null
   return { 
      hits
   }
}

export const actions: Actions = {
   search: async ({ request }) => {
      const data = await request.formData()
      const q = data.get('q') as string
      if (!q) { return fail(400, { q, missing: true }) }
      const hits = await medusa.getSearchResults(q)
      return { 
         success: true, 
         hits 
      }
   }
}