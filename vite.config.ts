import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
      // threads: false,
      // environmentMatchGlobs: [
      //    // all tests in tests/dom will run in jsdom
      //    ['tests/dom/**', 'jsdom'],
      //    // all tests in tests/ with .edge.test.ts will run in edge-runtime
      //    ['**\/*.edge.test.ts', 'edge-runtime'],
      //    // ...
      // ]
	}
})
