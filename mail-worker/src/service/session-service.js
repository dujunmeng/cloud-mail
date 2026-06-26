import orm from '../entity/orm';
import { session } from '../entity/session';
import { eq, sql } from 'drizzle-orm';
import dayjs from 'dayjs';
import constant from '../const/constant';

const sessionService = {

	async get(c, userId) {
		const row = await orm(c).select()
			.from(session)
			.where(
				eq(session.userId, userId)
			)
			.get();

		if (!row) {
			return null;
		}

		// 检查是否过期
		const now = dayjs();
		const expireTime = dayjs(row.expireTime);
		if (now.isAfter(expireTime)) {
			await this.remove(c, userId);
			return null;
		}

		return {
			tokens: JSON.parse(row.tokens || '[]'),
			user: JSON.parse(row.userData || '{}'),
			refreshTime: row.refreshTime,
		};
	},

	async set(c, userId, data) {
		const expireTime = dayjs().add(constant.TOKEN_EXPIRE, 'second').format('YYYY-MM-DD HH:mm:ss');

		await orm(c).insert(session)
			.values({
				userId,
				tokens: JSON.stringify(data.tokens || []),
				userData: JSON.stringify(data.user || {}),
				refreshTime: data.refreshTime || dayjs().toISOString(),
				expireTime,
			})
			.onConflictDoUpdate({
				target: session.userId,
				set: {
					tokens: JSON.stringify(data.tokens || []),
					userData: JSON.stringify(data.user || {}),
					refreshTime: data.refreshTime || dayjs().toISOString(),
					expireTime,
				},
			})
			.run();
	},

	async remove(c, userId) {
		await orm(c).delete(session).where(eq(session.userId, userId)).run();
	},

	async cleanupExpired(c) {
		await orm(c).delete(session)
			.where(sql`${session.expireTime} < datetime('now')`)
			.run();
	},

};

export default sessionService;
