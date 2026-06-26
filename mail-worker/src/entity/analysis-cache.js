import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const analysisCache = sqliteTable('analysis_cache', {
	cacheKey: text('cache_key').primaryKey(),
	data: text('data').notNull().default('{}'),
	updatedAt: text('updated_at').notNull().default(''),
});
