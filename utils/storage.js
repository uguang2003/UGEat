// 本地存储工具类
export default {
	// 获取菜单数据
	getMenuList() {
		const menuList = uni.getStorageSync('menuList');
		const hasInitialized = uni.getStorageSync('menuInitialized');
		
		// 如果从未初始化过，则返回默认菜单并标记为已初始化
		if (!hasInitialized) {
			const defaultMenu = this.getDefaultMenu();
			this.setMenuList(defaultMenu);
			uni.setStorageSync('menuInitialized', true);
			return defaultMenu;
		}
		
		// 如果已经初始化过，直接返回存储的菜单（可能为空数组）
		return menuList || [];
	},

	// 保存菜单数据
	setMenuList(menuList) {
		uni.setStorageSync('menuList', menuList);
	},

	// 获取默认菜单
	getDefaultMenu() {
		return [
			// 早餐类 (1-25)
			{ id: 1, name: '小笼包', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 2, name: '豆浆油条', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['快餐', '营养'], enabled: true },
			{ id: 3, name: '煎饼果子', mealTimes: ['早餐'], price: 10, type: '日常', tags: ['快餐', '面食'], enabled: true },
			{ id: 4, name: '包子', mealTimes: ['早餐'], price: 5, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 5, name: '馒头稀饭', mealTimes: ['早餐'], price: 4, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 6, name: '鸡蛋灌饼', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 7, name: '豆腐脑', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 8, name: '胡辣汤', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 9, name: '肉夹馍', mealTimes: ['早餐'], price: 12, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 10, name: '蒸蛋羹', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 11, name: '杂粮粥', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 12, name: '煮鸡蛋', mealTimes: ['早餐'], price: 3, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 13, name: '牛奶面包', mealTimes: ['早餐'], price: 10, type: '日常', tags: ['西式', '营养'], enabled: true },
			{ id: 14, name: '玉米棒', mealTimes: ['早餐'], price: 5, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 15, name: '红薯', mealTimes: ['早餐'], price: 4, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 16, name: '烧饼', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['面食'], enabled: true },
			{ id: 17, name: '韭菜盒子', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 18, name: '茶叶蛋', mealTimes: ['早餐'], price: 4, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 19, name: '八宝粥', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 20, name: '蒸饺', mealTimes: ['早餐'], price: 10, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 21, name: '麦片', mealTimes: ['早餐'], price: 12, type: '日常', tags: ['西式', '营养'], enabled: true },
			{ id: 22, name: '三明治', mealTimes: ['早餐'], price: 15, type: '日常', tags: ['西式', '营养'], enabled: true },
			{ id: 23, name: '酸奶', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['甜品', '营养'], enabled: true },
			{ id: 24, name: '豆沙包', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['面食', '甜品'], enabled: true },
			{ id: 25, name: '肉包子', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['面食', '营养'], enabled: true },

			// 午餐/晚餐类 (26-70)
			{ id: 26, name: '蛋炒饭', mealTimes: ['午餐', '晚餐'], price: 15, type: '日常', tags: ['快餐', '营养'], enabled: true },
			{ id: 27, name: '麻婆豆腐', mealTimes: ['午餐', '晚餐'], price: 18, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 28, name: '宫保鸡丁', mealTimes: ['午餐', '晚餐'], price: 25, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 29, name: '红烧肉', mealTimes: ['午餐', '晚餐'], price: 35, type: '大餐', tags: ['营养'], enabled: true },
			{ id: 30, name: '水煮鱼', mealTimes: ['午餐', '晚餐'], price: 58, type: '大餐', tags: ['辛辣', '海鲜'], enabled: true },
			{ id: 31, name: '兰州拉面', mealTimes: ['午餐', '晚餐'], price: 20, type: '日常', tags: ['面食', '清淡'], enabled: true },
			{ id: 32, name: '沙县小吃', mealTimes: ['午餐', '晚餐'], price: 15, type: '日常', tags: ['快餐'], enabled: true },
			{ id: 33, name: '麦当劳', mealTimes: ['午餐', '晚餐'], price: 35, type: '日常', tags: ['快餐', '西式'], enabled: true },
			{ id: 34, name: '肯德基', mealTimes: ['午餐', '晚餐'], price: 40, type: '日常', tags: ['快餐', '西式'], enabled: true },
			{ id: 35, name: '日式料理', mealTimes: ['午餐', '晚餐'], price: 88, type: '大餐', tags: ['日料', '海鲜'], enabled: true },
			{ id: 36, name: '酸菜鱼', mealTimes: ['午餐', '晚餐'], price: 45, type: '日常', tags: ['辛辣', '海鲜'], enabled: true },
			{ id: 37, name: '回锅肉', mealTimes: ['午餐', '晚餐'], price: 28, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 38, name: '糖醋里脊', mealTimes: ['午餐', '晚餐'], price: 32, type: '日常', tags: ['甜品', '营养'], enabled: true },
			{ id: 39, name: '白切鸡', mealTimes: ['午餐', '晚餐'], price: 40, type: '大餐', tags: ['清淡', '营养'], enabled: true },
			{ id: 40, name: '红烧排骨', mealTimes: ['午餐', '晚餐'], price: 45, type: '大餐', tags: ['营养'], enabled: true },
			{ id: 41, name: '清蒸鲈鱼', mealTimes: ['午餐', '晚餐'], price: 55, type: '大餐', tags: ['清淡', '海鲜'], enabled: true },
			{ id: 42, name: '鱼香肉丝', mealTimes: ['午餐', '晚餐'], price: 25, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 43, name: '青椒肉丝', mealTimes: ['午餐', '晚餐'], price: 22, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 44, name: '土豆丝', mealTimes: ['午餐', '晚餐'], price: 12, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 45, name: '西红柿鸡蛋', mealTimes: ['午餐', '晚餐'], price: 15, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 46, name: '蒜蓉菠菜', mealTimes: ['午餐', '晚餐'], price: 10, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 47, name: '白菜豆腐', mealTimes: ['午餐', '晚餐'], price: 12, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 48, name: '蒸蛋', mealTimes: ['午餐', '晚餐'], price: 8, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 49, name: '冬瓜汤', mealTimes: ['午餐', '晚餐'], price: 10, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 50, name: '紫菜蛋花汤', mealTimes: ['午餐', '晚餐'], price: 8, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 51, name: '韩式拌饭', mealTimes: ['午餐', '晚餐'], price: 35, type: '日常', tags: ['韩式', '营养'], enabled: true },
			{ id: 52, name: '日式咖喱', mealTimes: ['午餐', '晚餐'], price: 38, type: '日常', tags: ['日料', '营养'], enabled: true },
			{ id: 53, name: '意大利面', mealTimes: ['午餐', '晚餐'], price: 45, type: '大餐', tags: ['西式', '面食'], enabled: true },
			{ id: 54, name: '披萨', mealTimes: ['午餐', '晚餐'], price: 60, type: '大餐', tags: ['西式'], enabled: true },
			{ id: 55, name: '汉堡包', mealTimes: ['午餐', '晚餐'], price: 25, type: '日常', tags: ['快餐', '西式'], enabled: true },
			{ id: 56, name: '牛排', mealTimes: ['午餐', '晚餐'], price: 88, type: '大餐', tags: ['西式', '营养'], enabled: true },
			{ id: 57, name: '沙拉', mealTimes: ['午餐', '晚餐'], price: 25, type: '日常', tags: ['西式', '清淡'], enabled: true },
			{ id: 58, name: '寿司', mealTimes: ['午餐', '晚餐'], price: 68, type: '大餐', tags: ['日料', '海鲜'], enabled: true },
			{ id: 59, name: '拉面', mealTimes: ['午餐', '晚餐'], price: 28, type: '日常', tags: ['日料', '面食'], enabled: true },
			{ id: 60, name: '天妇罗', mealTimes: ['午餐', '晚餐'], price: 55, type: '大餐', tags: ['日料', '海鲜'], enabled: true },
			{ id: 61, name: '泰式咖喱', mealTimes: ['午餐', '晚餐'], price: 42, type: '大餐', tags: ['东南亚', '辛辣'], enabled: true },
			{ id: 62, name: '冬阴功汤', mealTimes: ['午餐', '晚餐'], price: 35, type: '日常', tags: ['东南亚', '辛辣'], enabled: true },
			{ id: 63, name: '炒河粉', mealTimes: ['午餐', '晚餐'], price: 18, type: '日常', tags: ['面食', '快餐'], enabled: true },
			{ id: 64, name: '炒面', mealTimes: ['午餐', '晚餐'], price: 16, type: '日常', tags: ['面食', '快餐'], enabled: true },
			{ id: 65, name: '螺蛳粉', mealTimes: ['午餐', '晚餐'], price: 22, type: '日常', tags: ['面食', '辛辣'], enabled: true },
			{ id: 66, name: '重庆小面', mealTimes: ['午餐', '晚餐'], price: 18, type: '日常', tags: ['面食', '辛辣'], enabled: true },
			{ id: 67, name: '刀削面', mealTimes: ['午餐', '晚餐'], price: 20, type: '日常', tags: ['面食', '清淡'], enabled: true },
			{ id: 68, name: '担担面', mealTimes: ['午餐', '晚餐'], price: 22, type: '日常', tags: ['面食', '辛辣'], enabled: true },
			{ id: 69, name: '云南过桥米线', mealTimes: ['午餐', '晚餐'], price: 35, type: '大餐', tags: ['面食', '营养'], enabled: true },
			{ id: 70, name: '海底捞', mealTimes: ['午餐', '晚餐'], price: 120, type: '大餐', tags: ['辛辣', '海鲜'], enabled: true },

			// 火锅烧烤类 (71-80)
			{ id: 71, name: '火锅', mealTimes: ['午餐', '晚餐'], price: 80, type: '大餐', tags: ['辛辣', '烧烤'], enabled: true },
			{ id: 72, name: '烧烤', mealTimes: ['夜宵'], price: 40, type: '大餐', tags: ['烧烤'], enabled: true },
			{ id: 73, name: '烤鱼', mealTimes: ['午餐', '晚餐'], price: 65, type: '大餐', tags: ['烧烤', '海鲜'], enabled: true },
			{ id: 74, name: '烤肉', mealTimes: ['午餐', '晚餐'], price: 75, type: '大餐', tags: ['烧烤', '营养'], enabled: true },
			{ id: 75, name: '麻辣烫', mealTimes: ['午餐', '晚餐'], price: 25, type: '日常', tags: ['辛辣', '快餐'], enabled: true },
			{ id: 76, name: '冒菜', mealTimes: ['午餐', '晚餐'], price: 22, type: '日常', tags: ['辛辣', '快餐'], enabled: true },
			{ id: 77, name: '串串香', mealTimes: ['午餐', '晚餐'], price: 35, type: '日常', tags: ['辛辣', '烧烤'], enabled: true },
			{ id: 78, name: '钵钵鸡', mealTimes: ['午餐', '晚餐'], price: 28, type: '日常', tags: ['辛辣', '快餐'], enabled: true },
			{ id: 79, name: '关东煮', mealTimes: ['午餐', '晚餐'], price: 20, type: '日常', tags: ['日料', '清淡'], enabled: true },
			{ id: 80, name: '铁板烧', mealTimes: ['午餐', '晚餐'], price: 85, type: '大餐', tags: ['烧烤', '营养'], enabled: true },

			// 夜宵类 (81-90)
			{ id: 81, name: '泡面', mealTimes: ['夜宵'], price: 5, type: '日常', tags: ['快餐', '面食'], enabled: true },
			{ id: 82, name: '小龙虾', mealTimes: ['夜宵'], price: 68, type: '大餐', tags: ['辛辣', '海鲜'], enabled: true },
			{ id: 83, name: '炸鸡', mealTimes: ['夜宵'], price: 35, type: '日常', tags: ['快餐', '烧烤'], enabled: true },
			{ id: 84, name: '啤酒', mealTimes: ['夜宵'], price: 8, type: '日常', tags: ['饮品'], enabled: true },
			{ id: 85, name: '烤串', mealTimes: ['夜宵'], price: 25, type: '日常', tags: ['烧烤'], enabled: true },
			{ id: 86, name: '炒粉', mealTimes: ['夜宵'], price: 15, type: '日常', tags: ['面食', '快餐'], enabled: true },
			{ id: 87, name: '煎饺', mealTimes: ['夜宵'], price: 12, type: '日常', tags: ['面食'], enabled: true },
			{ id: 88, name: '蒸饺', mealTimes: ['夜宵'], price: 10, type: '日常', tags: ['面食'], enabled: true },
			{ id: 89, name: '粥', mealTimes: ['夜宵'], price: 8, type: '日常', tags: ['清淡', '营养'], enabled: true },
			{ id: 90, name: '汤面', mealTimes: ['夜宵'], price: 12, type: '日常', tags: ['面食', '清淡'], enabled: true },

			// 零食甜品类 (91-100)
			{ id: 91, name: '薯片', mealTimes: ['零食'], price: 8, type: '日常', tags: ['快餐'], enabled: true },
			{ id: 92, name: '奶茶', mealTimes: ['零食'], price: 15, type: '日常', tags: ['甜品', '饮品'], enabled: true },
			{ id: 93, name: '蛋糕', mealTimes: ['零食'], price: 30, type: '大餐', tags: ['甜品'], enabled: true },
			{ id: 94, name: '咖啡', mealTimes: ['零食'], price: 20, type: '日常', tags: ['饮品', '西式'], enabled: true },
			{ id: 95, name: '冰淇淋', mealTimes: ['零食'], price: 12, type: '日常', tags: ['甜品'], enabled: true },
			{ id: 96, name: '巧克力', mealTimes: ['零食'], price: 15, type: '日常', tags: ['甜品'], enabled: true },
			{ id: 97, name: '饼干', mealTimes: ['零食'], price: 10, type: '日常', tags: ['甜品'], enabled: true },
			{ id: 98, name: '果汁', mealTimes: ['零食'], price: 12, type: '日常', tags: ['饮品', '营养'], enabled: true },
			{ id: 99, name: '爆米花', mealTimes: ['零食'], price: 18, type: '日常', tags: ['甜品'], enabled: true },
			{ id: 100, name: '坚果', mealTimes: ['零食'], price: 25, type: '日常', tags: ['营养'], enabled: true }
		];
	},

	// 重置为默认菜单
	resetToDefault() {
		this.setMenuList(this.getDefaultMenu());
		uni.setStorageSync('menuInitialized', true); // 确保标记为已初始化
	},

	// 清空菜单（不加载默认菜单）
	clearMenu() {
		this.setMenuList([]);
		// 保持已初始化标记，这样清空后不会自动加载默认菜单
	},

	// 添加菜品
	addMenuItem(item) {
		const menuList = this.getMenuList();
		const newId = Math.max(...menuList.map(m => m.id), 0) + 1;
		item.id = newId;
		item.enabled = item.enabled !== false; // 默认启用
		menuList.push(item);
		this.setMenuList(menuList);
		return item;
	},

	// 更新菜品
	updateMenuItem(item) {
		const menuList = this.getMenuList();
		const index = menuList.findIndex(m => m.id === item.id);
		if (index !== -1) {
			menuList[index] = item;
			this.setMenuList(menuList);
			return true;
		}
		return false;
	},

	// 删除菜品
	deleteMenuItem(id) {
		const menuList = this.getMenuList();
		const newList = menuList.filter(m => m.id !== id);
		this.setMenuList(newList);
		return newList;
	},

	// 获取吃饭历史记录
	getEatingHistory() {
		const history = uni.getStorageSync('eatingHistory');
		return history || [];
	},

	// 添加吃饭记录
	addEatingRecord(menuItem) {
		const history = this.getEatingHistory();
		const record = {
			id: Date.now(),
			menuItem: menuItem,
			date: new Date().toISOString().split('T')[0],
			time: new Date().toTimeString().split(' ')[0],
			timestamp: Date.now()
		};
		history.unshift(record);
		// 只保留最近1000条记录
		if (history.length > 1000) {
			history.splice(1000);
		}
		uni.setStorageSync('eatingHistory', history);
		return record;
	},

	// 获取筛选设置
	getFilterSettings() {
		const settings = uni.getStorageSync('filterSettings');
		return settings || {
			tags: [],
			priceRange: [0, 200],
			mealType: '' // '日常' 或 '大餐' 或 ''
		};
	},

	// 保存筛选设置
	setFilterSettings(settings) {
		uni.setStorageSync('filterSettings', settings);
	}
};
