import { tick } from 'svelte'
import { expect, test } from 'vitest'
import { clickOutside, formatPrice, debounce, findSelectedOptions, findVariant } from './utils'

// @vitest-environment node

test('formatPrice', () => {
   expect(formatPrice(100)).toBe('$1.00')
   expect(formatPrice(1000)).toBe('$10.00')
})

// @vitest-environment happy-dom

