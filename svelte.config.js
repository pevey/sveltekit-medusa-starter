import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { preprocessMeltUI } from '@melt-ui/pp'
import sequence from 'svelte-sequential-preprocessor'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
   preprocess: sequence([
      vitePreprocess({
         style: {
            css: {
               postcss: join(__dirname, 'postcss.config.js')
            }
         }
      }),
      preprocessMeltUI()
   ]),
   kit: {
      adapter: adapter(),
      alias: {
			'$src/*': '/src/*'
		},
      // csp: {
		// 	directives: {
		// 		'script-src': ['self', process.env.ORIGIN, 'https://challenges.cloudflare.com/', 'https://js.stripe.com/'],
		// 		'img-src': ['self', process.env.ORIGIN, 'data:', process.env.PUBLIC_IMAGE_BASE_URL, 'https://challenges.cloudflare.com/', 'https://js.stripe.com/'],
		// 	}
		// }
   },
}

export default config