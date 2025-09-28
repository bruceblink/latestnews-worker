import { sources } from "./sources"; // 内嵌配置 JSON

export default {
	// Cron 触发
	async scheduled(_controller, env, _ctx) {
		// @ts-ignore
		const HOME_PAGE = env.API_URL;

		// 批量并发调用 API
		const keys = Object.keys(sources);
		const batchSize = 10;

		for (let i = 0; i < keys.length; i += batchSize) {
			const batch = keys.slice(i, i + batchSize);
			await Promise.all(
				batch.map((id) =>
					fetch(`${HOME_PAGE}/api/s?id=${id}`, { method: "POST" })
				)
			).catch(console.error);
		}

		console.log("[Worker Cron] Finished processing sources");
	},

	// HTTP 请求触发，用于手动触发或测试
	async fetch(request, env, ctx) {
		if (request.url.includes("/run-cron")) {
			if (this.scheduled) {
				await this.scheduled({}, env, ctx);
			}
			return new Response("Cron triggered manually!");
		}
		return new Response("Hello World!");
	}
} satisfies ExportedHandler<Env>;
