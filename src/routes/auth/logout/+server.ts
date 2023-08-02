import type { RequestHandler } from './$types'
import medusa from '$lib/server/medusa'
import { error, redirect } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals, cookies }) => {
   if (await medusa.logout(locals, cookies)) throw redirect(302, '/auth')
   else throw error(500, 'server error')
}