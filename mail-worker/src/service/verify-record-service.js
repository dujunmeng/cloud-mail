import orm from '../entity/orm';
import verifyRecord from '../entity/verify-record';
import { eq, sql, and } from 'drizzle-orm';
import reqUtils from '../utils/req-utils';
import { verifyRecordType } from '../const/entity-const';

const verifyRecordService = {

	async selectListByIP(c) {
		const ip = reqUtils.getIp(c)
		return orm(c).select().from(verifyRecord).where(eq(verifyRecord.ip, ip)).all();
	},

	async clearRecord(c) {
		await orm(c).delete(verifyRecord).run();
	},

	async isOpenRegVerify(c, regVerifyCount) {

		const ip = reqUtils.getIp(c)

		const row = await orm(c).select().from(verifyRecord).where(and(eq(verifyRecord.ip, ip),eq(verifyRecord.type,verifyRecordType.REG))).get();

		if (row) {
			if (row.count >= regVerifyCount){
				return true
			}

		}

		return false

	},

	async isOpenAddVerify(c, addVerifyCount) {

		const ip = reqUtils.getIp(c)

		const row = await orm(c).select().from(verifyRecord).where(and(eq(verifyRecord.ip, ip),eq(verifyRecord.type,verifyRecordType.ADD))).get();

		if (row) {

			if (row.count >= addVerifyCount){
				return true
			}

		}

		return false

	},

	async increaseRegCount(c) {

		const ip = reqUtils.getIp(c)

		// 原子 upsert：利用 UNIQUE(ip,type) 约束，INSERT ON CONFLICT 触发 UPDATE
		// 解决并发场景下多个请求同时 SELECT → INSERT 产生的重复行问题
		const { results } = await c.env.db.prepare(`
			INSERT INTO verify_record (ip, count, type, update_time)
			VALUES (?, 1, ?, datetime('now'))
			ON CONFLICT(ip, type) DO UPDATE SET
				count = count + 1,
				update_time = excluded.update_time
			RETURNING count
		`).bind(ip, verifyRecordType.REG).all();

		return results[0];
	},

	async increaseAddCount(c) {

		const ip = reqUtils.getIp(c)

		const { results } = await c.env.db.prepare(`
			INSERT INTO verify_record (ip, count, type, update_time)
			VALUES (?, 1, ?, datetime('now'))
			ON CONFLICT(ip, type) DO UPDATE SET
				count = count + 1,
				update_time = excluded.update_time
			RETURNING count
		`).bind(ip, verifyRecordType.ADD).all();

		return results[0];
	}

};

export default verifyRecordService;
