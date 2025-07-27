// 地图服务工具 - 专门处理位置搜索相关功能
class MapService {
	constructor() {
		// 可以配置不同的地图API key
		this.baiduMapAK = 'your_baidu_map_ak'
		this.gaodeMapKey = 'your_gaode_map_key'
		this.tencentMapKey = 'your_tencent_map_key'
	}
	
	/**
	 * 根据位置坐标搜索附近美食
	 * @param {Object} location - 位置坐标 {latitude, longitude}
	 * @param {String} keyword - 搜索关键词
	 * @param {Number} radius - 搜索半径（米）
	 * @returns {Promise<Array>} 附近美食列表
	 */
	async searchNearbyRestaurants(location, keyword = '美食', radius = 2000) {
		try {
			// 实际项目中应该调用真实的地图API
			// 这里使用模拟数据演示
			console.log('搜索附近美食:', { location, keyword, radius })
			
			// 模拟API请求延迟
			await this.simulateAPIDelay(800, 1500)
			
			// 获取模拟数据
			const restaurants = this.generateMockRestaurants(location, radius)
			
			// 根据关键词筛选
			const filtered = this.filterByKeyword(restaurants, keyword)
			
			// 按距离排序
			return this.sortByDistance(filtered)
			
		} catch (error) {
			console.error('搜索附近美食失败:', error)
			throw new Error('搜索附近美食失败，请重试')
		}
	}
	
	/**
	 * 根据地址搜索附近美食
	 * @param {String} address - 地址字符串
	 * @param {String} keyword - 搜索关键词
	 * @param {Number} radius - 搜索半径
	 * @returns {Promise<Array>} 附近美食列表
	 */
	async searchNearbyByAddress(address, keyword = '美食', radius = 2000) {
		try {
			// 先进行地理编码，将地址转换为坐标
			const location = await this.geocodeAddress(address)
			
			// 再搜索附近美食
			return await this.searchNearbyRestaurants(location, keyword, radius)
			
		} catch (error) {
			console.error('根据地址搜索失败:', error)
			throw new Error('搜索失败，请检查地址是否正确')
		}
	}
	
	/**
	 * 地理编码 - 将地址转换为坐标
	 * @param {String} address - 地址字符串
	 * @returns {Promise<Object>} 坐标对象 {latitude, longitude}
	 */
	async geocodeAddress(address) {
		try {
			console.log('地理编码:', address)
			
			// 模拟API请求延迟
			await this.simulateAPIDelay(300, 800)
			
			// 实际项目中应该调用地图API的地理编码服务
			// 这里返回模拟坐标
			const baseCoord = this.getBaseCoordinateByAddress(address)
			
			return {
				latitude: baseCoord.latitude + (Math.random() - 0.5) * 0.01,
				longitude: baseCoord.longitude + (Math.random() - 0.5) * 0.01
			}
			
		} catch (error) {
			console.error('地理编码失败:', error)
			throw new Error('无法解析地址')
		}
	}
	
	/**
	 * 根据地址关键词获取基础坐标
	 * @param {String} address - 地址字符串
	 * @returns {Object} 基础坐标
	 */
	getBaseCoordinateByAddress(address) {
		// 预定义一些常见地点的坐标
		const locationMap = {
			'北京': { latitude: 39.9042, longitude: 116.4074 },
			'上海': { latitude: 31.2304, longitude: 121.4737 },
			'广州': { latitude: 23.1291, longitude: 113.2644 },
			'深圳': { latitude: 22.5431, longitude: 114.0579 },
			'杭州': { latitude: 30.2741, longitude: 120.1551 },
			'南京': { latitude: 32.0603, longitude: 118.7969 },
			'成都': { latitude: 30.5728, longitude: 104.0668 },
			'西安': { latitude: 34.2658, longitude: 108.9534 },
			'学校': { latitude: 39.9042, longitude: 116.4074 },
			'大学': { latitude: 39.9042, longitude: 116.4074 },
			'公司': { latitude: 39.9142, longitude: 116.4174 },
			'办公': { latitude: 39.9142, longitude: 116.4174 },
			'商场': { latitude: 39.8942, longitude: 116.3974 },
			'购物': { latitude: 39.8942, longitude: 116.3974 },
			'医院': { latitude: 39.9242, longitude: 116.4274 },
			'地铁': { latitude: 39.9342, longitude: 116.4374 }
		}
		
		// 查找匹配的关键词
		for (const [key, coord] of Object.entries(locationMap)) {
			if (address.includes(key)) {
				return coord
			}
		}
		
		// 默认返回北京坐标
		return locationMap['北京']
	}
	
	/**
	 * 生成模拟餐厅数据
	 * @param {Object} location - 中心位置
	 * @param {Number} radius - 搜索半径
	 * @returns {Array} 餐厅列表
	 */
	generateMockRestaurants(location, radius) {
		const restaurantTemplates = [
			// 快餐连锁
			{ name: '麦当劳', category: '快餐', priceRange: [25, 45], type: '日常', tags: ['快餐', '西式'], rating: 4.2 },
			{ name: '肯德基', category: '快餐', priceRange: [25, 40], type: '日常', tags: ['快餐', '西式'], rating: 4.1 },
			{ name: '德克士', category: '快餐', priceRange: [20, 35], type: '日常', tags: ['快餐', '西式'], rating: 3.9 },
			{ name: '汉堡王', category: '快餐', priceRange: [20, 35], type: '日常', tags: ['快餐', '西式'], rating: 4.0 },
			{ name: '赛百味', category: '快餐', priceRange: [15, 30], type: '日常', tags: ['快餐', '西式'], rating: 3.8 },
			
			// 中式快餐
			{ name: '兰州拉面', category: '中式面食', priceRange: [12, 25], type: '日常', tags: ['面食', '中式'], rating: 4.3 },
			{ name: '沙县小吃', category: '中式快餐', priceRange: [10, 20], type: '日常', tags: ['快餐', '中式'], rating: 4.0 },
			{ name: '黄焖鸡米饭', category: '中式快餐', priceRange: [15, 25], type: '日常', tags: ['中式', '营养'], rating: 4.1 },
			{ name: '重庆小面', category: '中式面食', priceRange: [12, 22], type: '日常', tags: ['面食', '辛辣'], rating: 4.2 },
			{ name: '煲仔饭', category: '中式快餐', priceRange: [18, 35], type: '日常', tags: ['中式', '营养'], rating: 4.0 },
			{ name: '盖浇饭', category: '中式快餐', priceRange: [12, 22], type: '日常', tags: ['中式', '快餐'], rating: 3.9 },
			
			// 火锅类
			{ name: '海底捞', category: '火锅', priceRange: [80, 150], type: '大餐', tags: ['火锅', '海鲜'], rating: 4.6 },
			{ name: '小龙坎火锅', category: '火锅', priceRange: [60, 120], type: '大餐', tags: ['火锅', '辛辣'], rating: 4.4 },
			{ name: '呷哺呷哺', category: '火锅', priceRange: [40, 80], type: '日常', tags: ['火锅', '快餐'], rating: 4.2 },
			{ name: '东来顺', category: '火锅', priceRange: [100, 200], type: '大餐', tags: ['火锅', '传统'], rating: 4.3 },
			
			// 烧烤类
			{ name: '烧烤店', category: '烧烤', priceRange: [40, 80], type: '大餐', tags: ['烧烤', '夜宵'], rating: 4.2 },
			{ name: '烤肉店', category: '烧烤', priceRange: [60, 120], type: '大餐', tags: ['烧烤', '营养'], rating: 4.1 },
			
			// 日韩料理
			{ name: '日式料理', category: '日料', priceRange: [60, 120], type: '大餐', tags: ['日料', '海鲜'], rating: 4.5 },
			{ name: '韩式烤肉', category: '韩料', priceRange: [50, 100], type: '大餐', tags: ['烧烤', '韩式'], rating: 4.3 },
			{ name: '寿司店', category: '日料', priceRange: [40, 80], type: '大餐', tags: ['日料', '海鲜'], rating: 4.4 },
			{ name: '韩式炸鸡', category: '韩料', priceRange: [30, 60], type: '日常', tags: ['韩式', '快餐'], rating: 4.2 },
			
			// 西餐
			{ name: '必胜客', category: '西餐', priceRange: [50, 100], type: '大餐', tags: ['西式', '披萨'], rating: 4.2 },
			{ name: '牛排店', category: '西餐', priceRange: [80, 200], type: '大餐', tags: ['西式', '营养'], rating: 4.4 },
			{ name: '意大利餐厅', category: '西餐', priceRange: [60, 120], type: '大餐', tags: ['西式', '面食'], rating: 4.3 },
			
			// 饮品甜品
			{ name: '星巴克', category: '咖啡', priceRange: [25, 50], type: '日常', tags: ['饮品', '西式'], rating: 4.3 },
			{ name: '喜茶', category: '茶饮', priceRange: [15, 35], type: '日常', tags: ['饮品', '甜品'], rating: 4.4 },
			{ name: '蜜雪冰城', category: '茶饮', priceRange: [5, 15], type: '日常', tags: ['饮品', '甜品'], rating: 4.1 },
			{ name: '85度C', category: '烘焙', priceRange: [20, 50], type: '日常', tags: ['甜品', '烘焙'], rating: 4.2 },
			{ name: '面包新语', category: '烘焙', priceRange: [15, 40], type: '日常', tags: ['甜品', '烘焙'], rating: 4.0 }
		]
		
		// 随机选择餐厅并生成具体信息
		const shuffled = restaurantTemplates.sort(() => Math.random() - 0.5)
		const count = Math.floor(Math.random() * 10) + 8 // 返回8-17个结果
		
		return shuffled.slice(0, count).map((template, index) => {
			const distance = Math.floor(Math.random() * radius * 0.8) + 50 // 50米到半径80%的距离
			const price = Math.floor(Math.random() * (template.priceRange[1] - template.priceRange[0]) + template.priceRange[0])
			
			return {
				id: `nearby_${Date.now()}_${index}`,
				name: template.name,
				category: template.category,
				distance: distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`,
				distanceValue: distance,
				price: price,
				type: template.type,
				tags: [...template.tags],
				rating: template.rating,
				mealTimes: this.generateMealTimes(template.category)
			}
		})
	}
	
	/**
	 * 根据餐厅类型生成适合的用餐时段
	 * @param {String} category - 餐厅类型
	 * @returns {Array} 用餐时段数组
	 */
	generateMealTimes(category) {
		const mealTimeMap = {
			'快餐': ['早餐', '午餐', '晚餐'],
			'中式面食': ['早餐', '午餐', '晚餐'],
			'中式快餐': ['午餐', '晚餐'],
			'火锅': ['午餐', '晚餐'],
			'烧烤': ['晚餐', '夜宵'],
			'日料': ['午餐', '晚餐'],
			'韩料': ['午餐', '晚餐'],
			'西餐': ['午餐', '晚餐'],
			'咖啡': ['早餐', '零食'],
			'茶饮': ['零食'],
			'烘焙': ['早餐', '零食']
		}
		
		return mealTimeMap[category] || ['午餐', '晚餐']
	}
	
	/**
	 * 根据关键词筛选餐厅
	 * @param {Array} restaurants - 餐厅列表
	 * @param {String} keyword - 关键词
	 * @returns {Array} 筛选后的餐厅列表
	 */
	filterByKeyword(restaurants, keyword) {
		if (!keyword || keyword === '美食') {
			return restaurants
		}
		
		const lowerKeyword = keyword.toLowerCase()
		return restaurants.filter(restaurant => {
			return restaurant.name.toLowerCase().includes(lowerKeyword) ||
				   restaurant.category.toLowerCase().includes(lowerKeyword) ||
				   restaurant.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
		})
	}
	
	/**
	 * 按距离排序
	 * @param {Array} restaurants - 餐厅列表
	 * @returns {Array} 排序后的餐厅列表
	 */
	sortByDistance(restaurants) {
		return restaurants.sort((a, b) => a.distanceValue - b.distanceValue)
	}
	
	/**
	 * 模拟API请求延迟
	 * @param {Number} min - 最小延迟（毫秒）
	 * @param {Number} max - 最大延迟（毫秒）
	 */
	async simulateAPIDelay(min = 500, max = 1500) {
		const delay = Math.floor(Math.random() * (max - min) + min)
		return new Promise(resolve => setTimeout(resolve, delay))
	}
	
	/**
	 * 计算两点之间的距离（公里）
	 * @param {Number} lat1 - 纬度1
	 * @param {Number} lon1 - 经度1  
	 * @param {Number} lat2 - 纬度2
	 * @param {Number} lon2 - 经度2
	 * @returns {Number} 距离（公里）
	 */
	calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371 // 地球半径（公里）
		const dLat = (lat2 - lat1) * Math.PI / 180
		const dLon = (lon2 - lon1) * Math.PI / 180
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
				  Math.sin(dLon / 2) * Math.sin(dLon / 2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return R * c
	}
}

export default new MapService()
