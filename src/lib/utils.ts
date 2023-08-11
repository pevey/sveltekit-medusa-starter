export const clickOutside = (node: HTMLElement) => {
   const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
         node.dispatchEvent(
            new CustomEvent('clickOutside')
         )
      }
   }
   document.addEventListener('click', handleClick, true);
   return {
      destroy() {
         document.removeEventListener('click', handleClick, true);
      }
   }
}

export const formatPrice = (price: number) => {
   return new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   }).format(price / 100)
}

export function debounce<F extends Function>(func:F, wait:number):F {
   let timeoutId:number

   if (!Number.isInteger(wait)) {
      console.warn("Called debounce without a valid number")
      wait = 300
   }

   return <any>function(this:any, ...args: any[]) {
      clearTimeout(timeoutId)
      const context = this

      timeoutId = window.setTimeout(function() {
         func.apply(context, args)
      }, wait)
   }
}

export const findSelectedOptions = (variantId: string, product: any): any[] => {
   // Find the options for a given variant
   // The order of options for variants may be different from the order in the product-level options object
   // So, we search for the correct index instead of assuming same order
   let selectedOptions: any[] = []
   if (!variantId) return selectedOptions
   let variantIndex = product.variants.findIndex((v:any) => v.id === variantId)
   if (variantIndex === -1) return selectedOptions
   for (let option of product.variants[variantIndex].options) {
      let index = product.options.findIndex((o: any) => o.filteredValues.includes(option.value))
      selectedOptions[product.options[index].id] = option.value
   }
   return selectedOptions
}

export const findVariant = (selectedOptions: any[], product: any) => {
   // See if any variants match all selected options
   // Brute force, needs update
   for (let variant of product.variants) {
      let match = true
      for (let option of variant.options) {
         if (option.value != selectedOptions[option.option_id]) {
            match = false; break;
         }
      }
      if (match) return variant.id
   }
   return false
}