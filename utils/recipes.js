// UG秘制菜谱数据
const recipeData = {
	// 早餐菜谱
	breakfast: [
		{ name: '小笼包', price: 8, type: '日常', mealTimes: ['早餐'], tags: ['面食', '营养'] },
		{ name: '豆浆油条', price: 6, type: '日常', mealTimes: ['早餐'], tags: ['快餐', '营养'] },
		{ name: '煎饼果子', price: 10, type: '日常', mealTimes: ['早餐'], tags: ['快餐', '面食'] },
		{ name: '包子', price: 5, type: '日常', mealTimes: ['早餐'], tags: ['面食'] },
		{ name: '豆腐脑', price: 4, type: '日常', mealTimes: ['早餐'], tags: ['清淡'] },
		{ name: '胡辣汤', price: 6, type: '日常', mealTimes: ['早餐'], tags: ['辛辣'] },
		{ name: '手抓饼', price: 8, type: '日常', mealTimes: ['早餐'], tags: ['面食'] },
		{ name: '鸡蛋灌饼', price: 9, type: '日常', mealTimes: ['早餐'], tags: ['面食'] },
		{ name: '蒸蛋羹', price: 7, type: '日常', mealTimes: ['早餐'], tags: ['清淡', '营养'] },
		{ name: '稀饭配咸菜', price: 5, type: '日常', mealTimes: ['早餐'], tags: ['清淡'] },
		{ name: '牛奶麦片', price: 12, type: '日常', mealTimes: ['早餐'], tags: ['营养', '饮品'] },
		{ name: '三明治', price: 15, type: '日常', mealTimes: ['早餐'], tags: ['西式'] },
		{ name: '蛋挞', price: 8, type: '日常', mealTimes: ['早餐'], tags: ['甜品'] },
		{ name: '红豆粥', price: 6, type: '日常', mealTimes: ['早餐'], tags: ['甜品', '清淡'] },
		{ name: '肉夹馍', price: 12, type: '日常', mealTimes: ['早餐'], tags: ['面食'] }
	],
	
	// 午餐菜谱
	lunch: [
		{ name: '蛋炒饭', price: 15, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['快餐', '营养'] },
		{ name: '麻婆豆腐', price: 18, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['辛辣', '营养'] },
		{ name: '宫保鸡丁', price: 25, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['辛辣', '营养'] },
		{ name: '红烧肉', price: 35, type: '大餐', mealTimes: ['午餐', '晚餐'], tags: ['营养'] },
		{ name: '水煮鱼', price: 58, type: '大餐', mealTimes: ['午餐', '晚餐'], tags: ['辛辣', '海鲜'] },
		{ name: '糖醋里脊', price: 28, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['酸甜'] },
		{ name: '回锅肉', price: 26, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['辛辣'] },
		{ name: '青椒肉丝', price: 20, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['营养'] },
		{ name: '鱼香肉丝', price: 22, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['酸甜'] },
		{ name: '土豆丝', price: 12, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['清淡'] },
		{ name: '西红柿鸡蛋', price: 15, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['清淡', '营养'] },
		{ name: '兰州拉面', price: 20, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['面食', '清淡'] },
		{ name: '沙县小吃', price: 15, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['快餐'] },
		{ name: '黄焖鸡米饭', price: 18, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['快餐'] },
		{ name: '盖浇饭', price: 16, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['快餐'] },
		{ name: '白切鸡', price: 32, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['清淡'] },
		{ name: '口水鸡', price: 28, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['辛辣'] },
		{ name: '清蒸鲈鱼', price: 45, type: '大餐', mealTimes: ['午餐', '晚餐'], tags: ['清淡', '海鲜'] },
		{ name: '红烧排骨', price: 38, type: '大餐', mealTimes: ['午餐', '晚餐'], tags: ['营养'] },
		{ name: '蒜蓉扇贝', price: 42, type: '大餐', mealTimes: ['午餐', '晚餐'], tags: ['海鲜'] }
	],
	
	// 晚餐菜谱
	dinner: [
		{ name: '火锅', price: 80, type: '大餐', mealTimes: ['晚餐'], tags: ['辛辣', '烧烤'] },
		{ name: '海底捞', price: 120, type: '大餐', mealTimes: ['晚餐'], tags: ['辛辣', '海鲜'] },
		{ name: '麦当劳', price: 35, type: '日常', mealTimes: ['晚餐'], tags: ['快餐', '西式'] },
		{ name: '肯德基', price: 40, type: '日常', mealTimes: ['晚餐'], tags: ['快餐', '西式'] },
		{ name: '日式料理', price: 88, type: '大餐', mealTimes: ['晚餐'], tags: ['日料', '海鲜'] },
		{ name: '韩式烤肉', price: 75, type: '大餐', mealTimes: ['晚餐'], tags: ['烧烤'] },
		{ name: '披萨', price: 45, type: '日常', mealTimes: ['晚餐'], tags: ['西式'] },
		{ name: '汉堡', price: 25, type: '日常', mealTimes: ['晚餐'], tags: ['快餐', '西式'] },
		{ name: '炸鸡', price: 30, type: '日常', mealTimes: ['晚餐'], tags: ['快餐'] },
		{ name: '烤鸭', price: 68, type: '大餐', mealTimes: ['晚餐'], tags: ['营养'] },
		{ name: '涮羊肉', price: 65, type: '大餐', mealTimes: ['晚餐'], tags: ['营养'] },
		{ name: '川菜', price: 55, type: '大餐', mealTimes: ['晚餐'], tags: ['辛辣'] },
		{ name: '粤菜', price: 78, type: '大餐', mealTimes: ['晚餐'], tags: ['清淡'] },
		{ name: '湘菜', price: 48, type: '大餐', mealTimes: ['晚餐'], tags: ['辛辣'] },
		{ name: '东北菜', price: 52, type: '大餐', mealTimes: ['晚餐'], tags: ['营养'] },
		{ name: '西餐', price: 85, type: '大餐', mealTimes: ['晚餐'], tags: ['西式'] },
		{ name: '泰餐', price: 60, type: '大餐', mealTimes: ['晚餐'], tags: ['异国'] },
		{ name: '意面', price: 35, type: '日常', mealTimes: ['晚餐'], tags: ['西式', '面食'] },
		{ name: '牛排', price: 88, type: '大餐', mealTimes: ['晚餐'], tags: ['西式'] },
		{ name: '自助餐', price: 98, type: '大餐', mealTimes: ['晚餐'], tags: ['营养'] }
	],
	
	// 夜宵菜谱
	latenight: [
		{ name: '泡面', price: 5, type: '日常', mealTimes: ['夜宵'], tags: ['快餐', '面食'] },
		{ name: '烧烤', price: 40, type: '大餐', mealTimes: ['夜宵'], tags: ['烧烤'] },
		{ name: '麻辣烫', price: 20, type: '日常', mealTimes: ['夜宵'], tags: ['辛辣'] },
		{ name: '关东煮', price: 15, type: '日常', mealTimes: ['夜宵'], tags: ['快餐'] },
		{ name: '煎饺', price: 12, type: '日常', mealTimes: ['夜宵'], tags: ['面食'] },
		{ name: '小龙虾', price: 68, type: '大餐', mealTimes: ['夜宵'], tags: ['海鲜', '辛辣'] },
		{ name: '炸串', price: 25, type: '日常', mealTimes: ['夜宵'], tags: ['烧烤'] },
		{ name: '臭豆腐', price: 8, type: '日常', mealTimes: ['夜宵'], tags: ['快餐'] },
		{ name: '烤冷面', price: 10, type: '日常', mealTimes: ['夜宵'], tags: ['面食'] },
		{ name: '铁板鱿鱼', price: 15, type: '日常', mealTimes: ['夜宵'], tags: ['海鲜'] },
		{ name: '章鱼小丸子', price: 12, type: '日常', mealTimes: ['夜宵'], tags: ['快餐'] },
		{ name: '煎饼', price: 8, type: '日常', mealTimes: ['夜宵'], tags: ['面食'] },
		{ name: '烤红薯', price: 6, type: '日常', mealTimes: ['夜宵'], tags: ['甜品'] },
		{ name: '糖葫芦', price: 5, type: '日常', mealTimes: ['夜宵'], tags: ['甜品'] },
		{ name: '热干面', price: 12, type: '日常', mealTimes: ['夜宵'], tags: ['面食'] }
	],
	
	// 零食菜谱
	snacks: [
		{ name: '薯片', price: 8, type: '日常', mealTimes: ['零食'], tags: ['快餐'] },
		{ name: '奶茶', price: 15, type: '日常', mealTimes: ['零食'], tags: ['甜品', '饮品'] },
		{ name: '蛋糕', price: 30, type: '大餐', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '冰淇淋', price: 12, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '爆米花', price: 10, type: '日常', mealTimes: ['零食'], tags: ['快餐'] },
		{ name: '巧克力', price: 15, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '坚果', price: 20, type: '日常', mealTimes: ['零食'], tags: ['营养'] },
		{ name: '果汁', price: 8, type: '日常', mealTimes: ['零食'], tags: ['饮品'] },
		{ name: '咖啡', price: 25, type: '日常', mealTimes: ['零食'], tags: ['饮品'] },
		{ name: '饼干', price: 6, type: '日常', mealTimes: ['零食'], tags: ['快餐'] },
		{ name: '糖果', price: 5, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '酸奶', price: 8, type: '日常', mealTimes: ['零食'], tags: ['营养', '饮品'] },
		{ name: '水果', price: 12, type: '日常', mealTimes: ['零食'], tags: ['营养'] },
		{ name: '面包', price: 10, type: '日常', mealTimes: ['零食'], tags: ['快餐'] },
		{ name: '甜甜圈', price: 15, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '马卡龙', price: 35, type: '大餐', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '布丁', price: 12, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '果冻', price: 6, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
		{ name: '奶昔', price: 18, type: '日常', mealTimes: ['零食'], tags: ['饮品'] },
		{ name: '芝士蛋糕', price: 42, type: '大餐', mealTimes: ['零食'], tags: ['甜品'] }
	],

	// 获取指定分类的菜谱
	getRecipesByCategory(category) {
		const categoryMap = {
			'早餐': 'breakfast',
			'午餐': 'lunch', 
			'晚餐': 'dinner',
			'夜宵': 'latenight',
			'零食': 'snacks'
		}
		
		const key = categoryMap[category] || category
		return this[key] || []
	},

	// 获取所有菜谱
	getAllRecipes() {
		const allRecipes = []
		const categories = ['breakfast', 'lunch', 'dinner', 'latenight', 'snacks']
		
		categories.forEach(category => {
			this[category].forEach((recipe, index) => {
				allRecipes.push({
					...recipe,
					id: `recipe_${category}_${index}_${Date.now()}`
				})
			})
		})
		
		return allRecipes
	},

	// 导出为文本格式
	exportToText(recipes) {
		let text = '菜品名称,价格,餐食类型,用餐时段,菜品标签\n'
		recipes.forEach(item => {
			const mealTimes = item.mealTimes ? item.mealTimes.join('|') : ''
			const tags = item.tags ? item.tags.join('|') : ''
			text += `${item.name},${item.price},${item.type},${mealTimes},${tags}\n`
		})
		return text
	},

	// 从文本导入
	importFromText(text) {
		const lines = text.split('\n').filter(line => line.trim())
		const recipes = []
		
		// 跳过标题行
		for (let i = 1; i < lines.length; i++) {
			const parts = lines[i].split(',')
			if (parts.length >= 4) {
				const name = parts[0].trim()
				const price = parseFloat(parts[1]) || 0
				const type = parts[2].trim() || '日常'
				const mealTimes = parts[3] ? parts[3].split('|').map(tag => tag.trim()).filter(tag => tag) : []
				const tags = parts[4] ? parts[4].split('|').map(tag => tag.trim()).filter(tag => tag) : []
				
				if (name) {
					recipes.push({
						id: Date.now() + i,
						name,
						price,
						type,
						mealTimes: mealTimes.length > 0 ? mealTimes : ['午餐'],
						tags: tags.length > 0 ? tags : []
					})
				}
			}
		}
		
		return recipes
	}
}

// 导出函数
export function getRecipesByCategory(category) {
	return recipeData.getRecipesByCategory(category)
}

export function getAllRecipes() {
	return recipeData.getAllRecipes()
}

export function exportToText(recipes) {
	return recipeData.exportToText(recipes)
}

export function importFromText(text) {
	return recipeData.importFromText(text)
}

// 获取UG秘制菜谱 - 接口调用版本
export async function getUGSecretRecipes() {
	try {
		// 调用后端接口获取UG秘制菜谱
		const response = await uni.request({
			url: 'https://your-api-domain.com/api/recipes/secret', // 替换为你的后端接口地址
			method: 'GET',
			timeout: 5000,
			header: {
				'Content-Type': 'application/json'
			}
		})
		
		if (response.statusCode === 200 && response.data && response.data.success) {
			// 接口调用成功，返回接口数据
			return response.data.recipes || []
		} else {
			throw new Error('接口返回数据格式错误')
		}
	} catch (error) {
		console.log('获取UG秘制菜谱失败，使用本地默认数据:', error)
		// 接口调用失败，返回本地默认菜谱
		return recipeData.getAllRecipes()
	}
}

export default recipeData
