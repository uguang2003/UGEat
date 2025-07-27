// 本地存储工具类
export default {
	// 获取菜单数据
	getMenuList() {
		const menuList = uni.getStorageSync('menuList');
		if (menuList && menuList.length > 0) {
			return menuList;
		}
		// 返回默认菜单
		return this.getDefaultMenu();
	},

	// 保存菜单数据
	setMenuList(menuList) {
		uni.setStorageSync('menuList', menuList);
	},

	// 获取默认菜单
	getDefaultMenu() {
		return [
			{ id: 1, name: '小笼包', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['面食', '营养'], enabled: true },
			{ id: 2, name: '豆浆油条', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['快餐', '营养'], enabled: true },
			{ id: 3, name: '煎饼果子', mealTimes: ['早餐'], price: 10, type: '日常', tags: ['快餐', '面食'], enabled: true },
			{ id: 4, name: '蛋炒饭', mealTimes: ['午餐', '晚餐'], price: 15, type: '日常', tags: ['快餐', '营养'], enabled: true },
			{ id: 5, name: '麻婆豆腐', mealTimes: ['午餐', '晚餐'], price: 18, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 6, name: '宫保鸡丁', mealTimes: ['午餐', '晚餐'], price: 25, type: '日常', tags: ['辛辣', '营养'], enabled: true },
			{ id: 7, name: '红烧肉', mealTimes: ['午餐', '晚餐'], price: 35, type: '大餐', tags: ['营养'], enabled: true },
			{ id: 8, name: '水煮鱼', mealTimes: ['午餐', '晚餐'], price: 58, type: '大餐', tags: ['辛辣', '海鲜'], enabled: true },
			{ id: 9, name: '火锅', mealTimes: ['午餐', '晚餐'], price: 80, type: '大餐', tags: ['辛辣', '烧烤'], enabled: true },
			{ id: 10, name: '泡面', mealTimes: ['夜宵'], price: 5, type: '日常', tags: ['快餐', '面食'], enabled: true },
			{ id: 11, name: '烧烤', mealTimes: ['夜宵'], price: 40, type: '大餐', tags: ['烧烤'], enabled: true },
			{ id: 12, name: '薯片', mealTimes: ['零食'], price: 8, type: '日常', tags: ['快餐'], enabled: true },
			{ id: 13, name: '奶茶', mealTimes: ['零食'], price: 15, type: '日常', tags: ['甜品', '饮品'], enabled: true },
			{ id: 14, name: '蛋糕', mealTimes: ['零食'], price: 30, type: '大餐', tags: ['甜品'], enabled: true },
			{ id: 15, name: '海底捞', mealTimes: ['午餐', '晚餐'], price: 120, type: '大餐', tags: ['辛辣', '海鲜'], enabled: true },
			{ id: 16, name: '兰州拉面', mealTimes: ['午餐', '晚餐'], price: 20, type: '日常', tags: ['面食', '清淡'], enabled: true },
			{ id: 17, name: '沙县小吃', mealTimes: ['午餐', '晚餐'], price: 15, type: '日常', tags: ['快餐'], enabled: true },
			{ id: 18, name: '麦当劳', mealTimes: ['午餐', '晚餐'], price: 35, type: '日常', tags: ['快餐', '西式'], enabled: true },
			{ id: 19, name: '肯德基', mealTimes: ['午餐', '晚餐'], price: 40, type: '日常', tags: ['快餐', '西式'], enabled: true },
			{ id: 20, name: '日式料理', mealTimes: ['午餐', '晚餐'], price: 88, type: '大餐', tags: ['日料', '海鲜'], enabled: true }
		];
	},

	// 重置为默认菜单
	resetToDefault() {
		this.setMenuList(this.getDefaultMenu());
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
