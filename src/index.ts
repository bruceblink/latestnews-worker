/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { sources } from './sources';

export default {

	async scheduled(_controller, env, _ctx) {
		// @ts-ignore
		const HOME_PAGE = env.API_URL;

		await Promise.all(Object.keys(sources).map((id) => fetch(`${HOME_PAGE}/api/s?id=${id}`))).catch(console.error);
	},
} satisfies ExportedHandler<Env>;
