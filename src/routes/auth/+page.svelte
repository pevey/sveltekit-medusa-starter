<script lang="ts">
   import type { PageData } from './$types'
   import { Turnstile } from 'sveltekit-turnstile'
   import { superForm } from 'sveltekit-superforms/client'
   import { page } from '$app/stores'
   import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public'
   import { loginPostReq, registerPostReq, forgotPostReq, resetPostReq } from '$lib/validators'
   import AuthContainer from '$lib/components/AuthContainer.svelte'
   import SocialProviders from '$lib/components/SocialProviders.svelte'

   export let data: PageData

   type state = 'signin' | 'signup' | 'forgot' | 'reset'
   let state = data.code ? 'reset' : 'signin'
   let token: string = (PUBLIC_TURNSTILE_SITE_KEY === '')? 'no-token-required' : ''

   const { 
      form: loginForm, 
      errors: loginErrors, 
      message: loginMessage, 
      enhance: loginEnhance 
   } = superForm(data.loginForm, { 
      validators: loginPostReq,
      invalidateAll: true,
      onUpdate: () => { token = (token === 'no-token-required')? 'no-token-required' : '' },
      taintedMessage: null
   })

   const { 
      form: registerForm, 
      errors: registerErrors, 
      message: registerMessage, 
      enhance: registerEnhance 
   } = superForm(data.registerForm, {
      validators: registerPostReq,
      invalidateAll: true,
      onUpdate: () => { token = (token === 'no-token-required')? 'no-token-required' : '' },
      taintedMessage: null
   })

   const { 
      form: forgotForm, 
      errors: forgotErrors, 
      message: forgotMessage, 
      enhance: forgotEnhance 
   } = superForm(data.forgotForm, {
      validators: forgotPostReq,
      invalidateAll: true,
      onUpdate: () => { token = (token === 'no-token-required')? 'no-token-required' : '' },
      taintedMessage: null
   })

   const { 
      form: resetForm, 
      errors: resetErrors, 
      message: resetMessage, 
      enhance: resetEnhance 
   } = superForm(data.resetForm, {
      validators: resetPostReq,
      invalidateAll: true,
      onUpdate: () => { token = (token === 'no-token-required')? 'no-token-required' : '' },
      taintedMessage: null
   })
      
   $resetForm.code = data.code

   $loginForm.rurl = data.rurl || ''
   $registerForm.rurl = data.rurl || ''
   $forgotForm.rurl = data.rurl || ''
   $resetForm.rurl = data.rurl ||  ''

   $: $loginForm.token = token
   $: $registerForm.token = token
   $: $forgotForm.token = token
   $: $resetForm.token = token

</script>
<AuthContainer>
   {#if !token}
      <Turnstile 
         theme="light" 
         siteKey={PUBLIC_TURNSTILE_SITE_KEY} 
         on:turnstile-callback={(e) => { token = e.detail.token }}
      />
   {:else if state === 'signin'}
      <h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Sign In to Your Account</h3>
      <p class="text-lg text-gray-500 mb-10">If you have an existing account, enter your email and password below.</p>
      <form action="?/login" method="POST" use:loginEnhance>
         <input type="hidden" name="rurl" value={$loginForm.rurl} />
         <input type="hidden" name="token" bind:value={$loginForm.token} />
         <label class="label">
            <div class="label-text">Email</div>
            <input
               name="email"
               type="email" 
               autocomplete="email"
               class="input"
               aria-invalid={$loginErrors.email ? 'true' : undefined}
               bind:value={$loginForm.email}
            />
            {#if $loginErrors.email}<span class="invalid">{$loginErrors.email}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Password</div>
            <input
               name="password"
               type="password" 
               autocomplete="current-password"
               class="input"
               aria-invalid={$loginErrors.password ? 'true' : undefined} 
               bind:value={$loginForm.password}
            />
            {#if $loginErrors.password}<span class="invalid">{$loginErrors.password}</span>{/if}
         </label>
         {#if $loginMessage}<div class="mt-2 text-sm text-red-600">{$loginMessage}</div>{/if}
         <button type="submit" class="button">Login</button>
         <SocialProviders />
         <div class="pt-6 text-sm text-center font-medium">
            <span>Don't have an account?&nbsp;&nbsp;</span>
            <button type="button" on:click="{() => { state = 'signup' }}" class="text-orange-900 hover:text-orange-700">Sign Up</button>
         </div>
         <div class="text-sm text-center font-medium">
            <button type="button" on:click="{() => { state = 'forgot' }}" class="mt-4 text-gray-900 hover:text-gray-700">Forgot your password?</button>
         </div>
      </form>
   {:else if state === 'signup'}         
      <h3 class="font-heading text-3xl text-gray-900 font-semibold text-center mb-4">Create an Account</h3>
      <p class="text-lg text-gray-500 mb-10">Welcome! To create an account, please enter your email and choose a password below.</p>
      <form action="?/register" method="POST" use:registerEnhance>
         <input type="hidden" name="rurl" value={$registerForm.rurl} />
         <input type="hidden" name="token" bind:value={$registerForm.token} />
         <label class="label">
            <div class="label-text">First Name</div>
            <input
               name="firstName"
               type="text"
               autocomplete="given-name" 
               class="input"
               aria-invalid={$registerErrors.firstName ? 'true' : undefined}
               bind:value={$registerForm.firstName}
            />
            {#if $registerErrors.firstName}<span class="invalid">{$registerErrors.firstName}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Last Name</div>
            <input
               name="lastName"
               type="text"
               autocomplete="family-name" 
               class="input"
               aria-invalid={$registerErrors.lastName ? 'true' : undefined}
               bind:value={$registerForm.lastName}
            />
            {#if $registerErrors.lastName}<span class="invalid">{$registerErrors.lastName}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Email</div>
            <input
               name="email"
               type="email"
               autocomplete="email" 
               class="input"
               aria-invalid={$registerErrors.email ? 'true' : undefined}
               bind:value={$registerForm.email}
            />
            {#if $registerErrors.email}<span class="invalid">{$registerErrors.email}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Password</div>
            <input
               name="password" 
               type="password"
               autocomplete="new-password"
               class="input"
               aria-invalid={$registerErrors.password ? 'true' : undefined}
               bind:value={$registerForm.password}
            />
            {#if $registerErrors.password}<span class="invalid">{$registerErrors.password}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Confirm Password</div>
            <input
               name="passwordConfirm"
               type="password"
               autocomplete="new-password"
               class="input"
               aria-invalid={$registerErrors.passwordConfirm ? 'true' : undefined}
               bind:value={$registerForm.passwordConfirm}
            />
            {#if $registerErrors.passwordConfirm}<span class="invalid">{$registerErrors.passwordConfirm}</span>{/if}
         </label>
         {#if $registerMessage}<div class="mt-2 text-sm text-red-600">{$registerMessage}</div>{/if}
         <button type="submit" class="button">Create Account</button>
         <SocialProviders />
         <div class="pt-6 text-sm text-center font-medium">
            <span>Already have an account?&nbsp;&nbsp;</span>
            <button type="button" on:click="{() => { state = 'signin' }}" class="text-orange-900 hover:text-orange-700">Sign In</button>
         </div>
      </form>
   {:else if state === 'forgot'}
      {#if $forgotMessage}
         <div class="mt-2 text-sm" class:text-red-600={$page.status > 200}>
            {$forgotMessage}
         </div>
      {:else}
         <p class="my-4 text-center font-medium">Enter your email address</p>
         <form action="?/forgot" method="POST" use:forgotEnhance>
            <input type="hidden" name="rurl" value={$forgotForm.rurl} />
            <input type="hidden" name="token" bind:value={$forgotForm.token} />
            <label class="label">
               <div class="label-text">Email</div>
               <input
                  name="email"
                  type="email"
                  autocomplete="email" 
                  class="input"
                  aria-invalid={$forgotErrors.email ? 'true' : undefined}
                  bind:value={$forgotForm.email}
               />
               {#if $forgotErrors.email}<span class="invalid">{$forgotErrors.email}</span>{/if}
            </label>
            <button type="submit" class="button">Request Reset Code</button>
         </form>
      {/if}
   {:else if state === 'reset'}
      <p class="my-4 text-center font-medium">Choose a new password</p>
      <form action="?/reset" method="POST" use:resetEnhance>
         <input type="hidden" name="rurl" value={$resetForm.rurl} />
         <input type="hidden" name="token" bind:value={$resetForm.token} />
         <input type="hidden" name="code" bind:value={$resetForm.code} />
         <label class="label">
            <div class="label-text">Email</div>
            <input
               name="email"
               type="email"
               autocomplete="email" 
               class="input"
               aria-invalid={$resetErrors.email ? 'true' : undefined}
               bind:value={$resetForm.email}
            />
            {#if $resetErrors.email}<span class="invalid">{$resetErrors.email}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Password</div>
            <input
               name="password" 
               type="password"
               autocomplete="new-password"
               class="input"
               aria-invalid={$resetErrors.password ? 'true' : undefined}
               bind:value={$resetForm.password}
            />
            {#if $resetErrors.password}<span class="invalid">{$resetErrors.password}</span>{/if}
         </label>
         <label class="label">
            <div class="label-text">Confirm Password</div>
            <input
               name="passwordConfirm"
               type="password"
               autocomplete="new-password"
               class="input"
               aria-invalid={$resetErrors.passwordConfirm ? 'true' : undefined}
               bind:value={$resetForm.passwordConfirm}
            />
            {#if $resetErrors.passwordConfirm}<span class="invalid">{$resetErrors.passwordConfirm}</span>{/if}
         </label>
         {#if $resetMessage}<div class="mt-2 text-sm text-red-600">{$resetMessage}</div>{/if}
         <button type="submit" class="button">Save New Password</button>
      </form>
   {/if}
</AuthContainer>
<style lang="postcss">
   .label {
      @apply block mb-4 text-gray-600;
   }
   .label-text {
      @apply ml-1 mb-2 font-semibold text-sm;
   }
   .input {
      @apply w-full block py-3 px-4 text-sm border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500;
   }
   .invalid {
      @apply block my-2 text-sm text-red-600;
   }
   .button {
      @apply inline-block w-full my-4 py-3 px-5 text-sm font-semibold text-white bg-lime-600 hover:bg-lime-700 rounded-md transition duration-200
   }
</style>