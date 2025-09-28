import { sources } from "./sources"; // 内嵌配置 JSON

export default {
	// Cron 触发
	async scheduled(_controller, env, _ctx) {
		// @ts-ignore
		const HOME_PAGE = env.API_URL;

		const keys = Object.keys(sources);
		const batchSize = 10; // 每批 10 个，避免超并发

		for (let i = 0; i < keys.length; i += batchSize) {
			const batch = keys.slice(i, i + batchSize);
			await Promise.all(
				batch.map(async (id) => {
					try {
						const resp = await fetch(`${HOME_PAGE}/api/s?id=${id}`);
						resp.body?.cancel();
					} catch (err) {
						console.error(`Failed to fetch ${id}:`, err);
					}
				})
			);
		}
		console.log("[Worker Cron] Finished processing sources");
	},
} satisfies ExportedHandler<Env>;
