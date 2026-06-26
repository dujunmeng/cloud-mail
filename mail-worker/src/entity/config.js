import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const config = sqliteTable('config', {
	configKey: text('config_key').primaryKey(),
	configValue: text('config_value').notNull().default(''),
});
