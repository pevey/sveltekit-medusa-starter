import type { PageServerLoad, Actions } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { validateToken } from 'sveltekit-turnstile'
import { SECRET_TURNSTILE_KEY } from '$env/static/private'
import { loginPostReq, registerPostReq, forgotPostReq, resetPostReq } from '$lib/validators'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async ({ locals, url }) => {
   let rurl = url.searchParams.get('rurl') || ''
   let code = url.searchParams.get('code') || ''

   if (locals.user) { throw redirect(302, `/${rurl}`) }

   const loginForm = await superValidate(loginPostReq, { id: 'login' })
   const registerForm = await superValidate(registerPostReq, { id: 'register' })
   const forgotForm = await superValidate(forgotPostReq, { id: 'forgot' })
   const resetForm = await superValidate(resetPostReq, { id: 'reset' })

   return {
      rurl,
      code,
      loginForm,
      registerForm,
      forgotForm,
      resetForm
   }
}

export const actions: Actions = {
   login: async ({ request, locals, cookies }) => {
      const form = await superValidate(request, loginPostReq, { id: 'login' })
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      // If Turnstile public key is not set in env, the token sent by form will be 'no-token-required'
      // If the token is anything else, check for validity
      if (form.data.token !== 'no-token-required') {
         if (!(await validateToken(form.data.token, SECRET_TURNSTILE_KEY))) {
            return message(form, 'Security token timed out or invalid. Please try again.', { status: 418 })
         }
      }
      if (await medusa.login(locals, cookies, form.data.email, form.data.password)) {
         throw redirect(302, `/${form.data.rurl}`)
      } else { 
         return message(form, 'Invalid email/password combination', { status: 401 })
      }
   },

   register: async ({ request, locals, cookies }) => {
      const form = await superValidate(request, registerPostReq, { id: 'register' })
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      // If Turnstile public key is not set in env, the token sent by form will be 'no-token-required'
      // If the token is anything else, check for validity
      if (form.data.token !== 'no-token-required') {
         if (!(await validateToken(form.data.token, SECRET_TURNSTILE_KEY))) {
            return message(form, 'Security token timed out or invalid. Please try again.', { status: 418 })
         }
      }
      const user = {
         first_name: form.data.firstName,
         last_name: form.data.lastName,
         email: form.data.email,
         password: form.data.password
      }
      if (await medusa.register(locals, cookies, user)) {
         throw redirect(302, `/${form.data.rurl}`)
      } else {
         return message(form, 'Unable to register a new user with that email address', { status: 400 })
      }
   },
   
   forgot: async ({ request }) => {
      const form = await superValidate(request, forgotPostReq, { id: 'forgot' })
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      // If Turnstile public key is not set in env, the token sent by form will be 'no-token-required'
      // If the token is anything else, check for validity
      if (form.data.token !== 'no-token-required') {
         if (!(await validateToken(form.data.token, SECRET_TURNSTILE_KEY))) {
            return message(form, 'Security token timed out or invalid. Please try again.', { status: 418 })
         }
      }
      if (await medusa.requestResetPassword(form.data.email)) {
         return message(form, 'If an account with that email exists, a reset code has been sent to your email address')
      } else {
         return message(form, 'Unable to send reset code', { status: 400 })
      }
   },
   
   reset: async ({ request, locals, cookies }) => {
      const form = await superValidate(request, resetPostReq, { id: 'reset' })
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      // If Turnstile public key is not set in env, the token sent by form will be 'no-token-required'
      // If the token is anything else, check for validity
      if (form.data.token !== 'no-token-required') {
         if (!(await validateToken(form.data.token, SECRET_TURNSTILE_KEY))) {
            return message(form, 'Security token timed out or invalid. Please try again.', { status: 418 })
         }
      }
      // if (await medusa.resetPassword(form.data.email, form.data.password, form.data.code)) return message(form, 'Your password has been reset', { status: 200 })
      if (await medusa.resetPassword(form.data.email, form.data.password, form.data.code)) {
         if (await medusa.login(locals, cookies, form.data.email, form.data.password)) {
            throw redirect(302, `/${form.data.rurl}`)
         }
      } else {
         return message(form, 'The link was expired or invalid.', { status: 400 })
      }
   },

   logout: async ({ locals, cookies }) => {
      if (await medusa.logout(locals, cookies)) {
         throw redirect(302, '/auth')
      }
      else throw error(500, 'server error')
   }
}

