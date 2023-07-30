import medusa from '$lib/server/medusa'

export const load = async function () {
   let products = await medusa.getProducts()

   return { 
      products
   }
}