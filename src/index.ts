import { sources } from "./sources"; // 内嵌配置 JSON

export default {
	// Cron 触发
	async scheduled(_controller, env, _ctx) {
		// @ts-ignore
		const HOME_PAGE = env.API_URL;

		for (const id of Object.keys(sources)) {
			try {
				const resp = await fetch(`${HOME_PAGE}/api/s?id=${id}`);
				// 主动释放 body，避免 deadlock
				resp.body?.cancel();
			} catch (err) {
				console.error(`[Worker Cron] failed for ${id}:`, err);
			}
		}
		console.log("[Worker Cron] Finished processing sources");
	},
} satisfies ExportedHandler<Env>;
