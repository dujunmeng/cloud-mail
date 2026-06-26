const KvConst = {
		// 以下 key 已迁移至 D1 表，保留仅用于 kv-obj-service 对象存储降级场景
		// AUTH_INFO:       'auth-uid:'          → session 表
		// SETTING:         'setting:'           → 直接查 D1
		// SEND_DAY_COUNT:  'send_day_count:'    → daily_count 表
		ANALYSIS_ECHARTS: 'analysis_echarts:', // 缓存键前缀（KV 操作已迁移 D1，仅保留字符串值）
		// PUBLIC_KEY:      'public_key:'        → config 表
		PUBLIC_KEY: 'public_key:'
}

export default KvConst;
