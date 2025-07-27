<template>
	<view class="container">
		<!-- 主要内容区域 -->
		<view class="content" :style="{ paddingTop: statusBarHeight + 20 + 'px' }">
			<!-- Logo和标题 -->
			<view class="header">
				<!-- <image class="logo" src="/static/function.ico"></image> -->
				<text class="title">{{ title }}</text>
				<text class="subtitle">让UG来帮你决定今天吃什么吧！</text>
			</view>
			
			<!-- 默认显示的菜单卡片 -->
			<view class="result-area">
				<view class="food-card" :class="{ 'animate': isAnimating }">
					<view v-if="currentFood">
						<text class="food-name">{{ currentFood.name }}</text>
						<view class="food-info">
							<view class="meal-times">
								<text class="meal-time" v-for="time in currentFood.mealTimes" :key="time">{{ time }}</text>
							</view>
							<view class="tags" v-if="currentFood.tags && currentFood.tags.length > 0">
								<text class="tag" v-for="tag in currentFood.tags" :key="tag">{{ tag }}</text>
							</view>
							<text class="price">¥{{ currentFood.price }}</text>
							<text class="meal-type">{{ currentFood.type }}</text>
						</view>
						
						<!-- 点外卖按钮 -->
						<button class="order-delivery-btn subtle" @click="showDeliveryModal = true">
							外卖
						</button>
					</view>
					<view v-else class="welcome-content">
						<text class="welcome-icon">🍽️</text>
						<text class="welcome-title">UG吃啥</text>
						<text class="welcome-subtitle">让我们帮你决定今天吃什么</text>
						<text class="welcome-tip">点击下方按钮开始抽签吧！</text>
					</view>
				</view>
			</view>
			
			<!-- 抽签按钮 -->
			<view class="button-area">
				<button class="draw-btn" 
						:class="{ 'loading': isDrawing, 'regret': isRegretMode }" 
						@click="isDrawingActive ? stopDrawing() : drawFood()" 
						:disabled="isDrawing && !isDrawingActive">
					<text v-if="!isDrawing">{{ drawButtonText }}</text>
					<text v-else-if="isDrawingActive">停止</text>
					<text v-else>抽签中...</text>
				</button>
			</view>
			
			<!-- 随机菜品浮现效果 -->
			<view class="floating-foods" v-if="isDrawingActive">
				<view class="floating-food" 
					  v-for="(food, index) in floatingFoods" 
					  :key="index"
					  :style="food.style"
					  :class="food.class">
					{{ food.name }}
				</view>
			</view>
			
			<!-- 筛选区域 -->
			<view class="filter-section">
				<!-- 基础筛选 -->
				<view class="basic-filter">
					<view class="filter-row">
						<view class="filter-item">
							<text class="filter-label">用餐时段：</text>
							<picker class="filter-picker" mode="selector" :range="mealTimeOptions" :value="selectedMealTimeIndex" @change="onMealTimeChange">
								<view class="picker-content">
									{{ selectedMealTime || '不限' }}
									<text class="picker-arrow">▼</text>
								</view>
							</picker>
						</view>
						
						<view class="filter-item">
							<text class="filter-label">餐食类型：</text>
							<picker class="filter-picker" mode="selector" :range="mealTypeOptions" :value="selectedMealTypeIndex" @change="onMealTypeChange">
								<view class="picker-content">
									{{ selectedMealType || '不限' }}
									<text class="picker-arrow">▼</text>
								</view>
							</picker>
						</view>
						
						<button class="advanced-toggle" @click="showAdvancedFilter = !showAdvancedFilter">
							{{ showAdvancedFilter ? '收起' : '高级' }}
							<text class="toggle-arrow" :class="{ 'active': showAdvancedFilter }">▼</text>
						</button>
					</view>
				</view>
				
				<!-- 高级筛选 -->
				<view class="advanced-filter" v-if="showAdvancedFilter">
					<!-- 价格区间筛选 -->
					<view class="filter-item price-filter">
						<text class="filter-label">价格区间：¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}</text>
						<view class="price-range-container">
							<view class="price-range-slider">
								<view class="slider-track">
									<view class="slider-progress" :style="progressStyle"></view>
									<view class="slider-thumb slider-thumb-min" :style="minThumbStyle" @touchstart="startDrag('min', $event)" @touchmove="onDrag" @touchend="endDrag"></view>
									<view class="slider-thumb slider-thumb-max" :style="maxThumbStyle" @touchstart="startDrag('max', $event)" @touchmove="onDrag" @touchend="endDrag"></view>
								</view>
							</view>
							<view class="price-range-labels">
								<text class="range-min">¥0</text>
								<text class="range-max">¥200</text>
							</view>
						</view>
					</view>
					
					<!-- 菜品标签筛选 -->
					<view class="filter-item">
						<text class="filter-label">🏷️ 菜品标签：</text>
						<view class="tag-selector-improved" @click="showTagSelectorModal = true">
							<view class="selected-tags-container" v-if="selectedTags.length > 0">
								<view class="selected-tag-wrapper" v-for="tag in selectedTags" :key="tag">
									<text class="selected-tag-improved">{{ tag }}</text>
									<text class="tag-remove" @click.stop="toggleFoodTag(tag)">×</text>
								</view>
								<view class="tag-count-badge" v-if="selectedTags.length > 3">
									+{{ selectedTags.length - 3 }}
								</view>
							</view>
							<view class="placeholder-container" v-else>
								<text class="placeholder-improved">点击选择标签</text>
								<text class="placeholder-hint">可多选</text>
							</view>
							<view class="arrow-container">
								<text class="arrow-improved">⚙️</text>
							</view>
						</view>
					</view>
					
					<!-- 附近美食搜索 -->
					<view class="filter-item">
						<text class="filter-label">附近美食：</text>
						<view class="location-search">
							<!-- <button class="location-btn" @click="showLocationModal = true"> -->
							<button class="location-btn" @click="notOpen">
								根据位置搜索附近美食
							</button>
							<!-- <view class="nearby-results" v-if="nearbyFoods.length > 0">
								<text class="nearby-item" 
									  v-for="food in nearbyFoods" 
									  :key="food.name"
									  @click="selectNearbyFood(food)">
									{{ food.name }} - {{ food.distance }}
								</text>
							</view> -->
						</view>
					</view>
				</view>
				
				<!-- 筛选结果预览 -->
				<view class="filter-preview">
					<text class="preview-text">当前可选菜品：{{ filteredMenuCount }} 个</text>
					<view class="filter-actions">
						<button class="clear-filter-btn" @click="clearAllFilters" v-if="hasActiveFilters">清除筛选</button>
					</view>
				</view>
			</view>
			
			<!-- 功能按钮区域 -->
			<view class="function-buttons">
				<button class="func-btn" @click="goToMenu">
					<text class="func-icon">🍽️</text>
					<text class="func-text">粮库管理</text>
				</button>
				<button class="func-btn" @click="goToStatistics">
					<text class="func-icon">📊</text>
					<text class="func-text">数据统计</text>
				</button>
			</view>
			
			<!-- 统计信息 -->
			<view class="stats-preview" v-if="todayCount > 0">
				<text class="stats-text">今天已经吃了 {{ todayCount }} 次了</text>
			</view>
		</view>
		
		<!-- 确认弹窗 -->
		<view class="confirm-modal" v-if="showConfirmModal" @click="hideConfirmModal">
			<view class="modal-content confirm-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">🍽️ 确认选择</text>
				</view>
				<view class="modal-body confirm-body">
					<view class="food-display">
						<text class="food-name">{{ currentFood?.name }}</text>
						<view class="food-details">
							<view class="food-price">💰 ¥{{ currentFood?.price }}</view>
							<view class="food-type">🏷️ {{ currentFood?.type }}</view>
							<view class="food-tags" v-if="currentFood?.tags?.length">
								<text class="tag" v-for="tag in currentFood?.tags" :key="tag"># {{ tag }}</text>
							</view>
						</view>
					</view>
					<text class="confirm-question">今天就吃这个吗？</text>
					<view class="rejection-hint" v-if="rejectionCount >= 2">
						<text class="hint-text">已连续拒绝 {{ rejectionCount }} 次</text>
						<text class="hint-emoji" v-if="rejectionCount >= 3">😤</text>
					</view>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel-btn enhanced-cancel" @click="rejectFood">
						<text class="btn-icon">❌</text>
						<text class="btn-text">不吃</text>
					</button>
					<button class="modal-btn confirm-btn enhanced-confirm" @click="confirmFood">
						<text class="btn-icon">✨</text>
						<text class="btn-text">就吃这个！</text>
					</button>
				</view>
			</view>
		</view>
		
		<!-- 外卖弹窗 -->
		<view class="delivery-modal" v-if="showDeliveryModal" @click="showDeliveryModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择外卖平台</text>
				</view>
				<view class="modal-body">
					<text class="modal-subtitle">为您推荐 "{{ currentFood?.name }}"</text>
					<view class="delivery-options">
						<button class="delivery-option meituan" @click="openDelivery('meituan')">
							<text class="delivery-icon">🍔</text>
							<text class="delivery-name">美团外卖</text>
						</button>
						<button class="delivery-option ele" @click="openDelivery('ele')">
							<text class="delivery-icon">🍕</text>
							<text class="delivery-name">饿了么</text>
						</button>
						<button class="delivery-option douyin" @click="openDelivery('douyin')">
							<text class="delivery-icon">🍜</text>
							<text class="delivery-name">抖音外卖</text>
						</button>
					</view>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel-btn" @click="showDeliveryModal = false">取消</button>
				</view>
			</view>
		</view>
		
		<!-- 位置选择弹窗 -->
		<view class="location-modal" v-if="showLocationModal" @click="showLocationModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择位置</text>
				</view>
				<view class="modal-body">
					<view class="location-options">
						<button class="location-option" @click="getCurrentLocation">
							<text class="location-icon">📍</text>
							<text class="location-text">使用当前位置</text>
						</button>
						<button class="location-option" @click="openMapSelection">
							<text class="location-icon">🗺️</text>
							<text class="location-text">在地图上选择位置</text>
						</button>
						<button class="location-option" @click="showManualLocationInput">
							<text class="location-icon">✏️</text>
							<text class="location-text">手动输入位置</text>
						</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 手动选择位置弹窗 -->
		<view class="manual-location-modal" v-if="showManualLocationModal" @click="showManualLocationModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">输入位置</text>
				</view>
				<view class="modal-body">
					<view class="manual-location-form">
						<view class="input-group">
							<text class="input-label">地址：</text>
							<input class="location-input" v-model="manualLocation" placeholder="请输入具体地址或地标" />
						</view>
						<view class="common-locations">
							<text class="common-title">常用位置：</text>
							<view class="location-tags">
								<button class="location-tag" 
									v-for="location in commonLocations" 
									:key="location"
									@click="selectCommonLocation(location)">
									{{ location }}
								</button>
							</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel-btn" @click="showManualLocationModal = false">取消</button>
					<button class="modal-btn confirm-btn" @click="confirmManualLocation">确认</button>
				</view>
			</view>
		</view>
		
		<!-- 标签选择弹窗 -->
		<view class="confirm-modal" v-if="showTagSelectorModal" @click="showTagSelectorModal = false">
			<view class="modal-content large tag-selector-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">🏷️ 选择菜品标签</text>
					<text class="close-btn" @click="showTagSelectorModal = false">×</text>
				</view>
				<view class="modal-body tag-selector-body">
					<view class="selected-tags-preview" v-if="selectedTags.length > 0">
						<text class="preview-label">已选择标签：</text>
						<view class="selected-tags-list">
							<view class="selected-tag-item" v-for="tag in selectedTags" :key="tag">
								{{ tag }}
								<text class="remove-tag" @click="toggleFoodTag(tag)">×</text>
							</view>
						</view>
					</view>
					<view class="available-tags-section">
						<text class="section-label">可选标签：</text>
						<view class="tag-grid-improved">
							<view class="tag-option-improved" 
								  v-for="tag in availableFoodTags" 
								  :key="tag"
								  :class="{ 'selected': selectedTags.includes(tag) }"
								  @click="toggleFoodTag(tag)">
								<text class="tag-text">{{ tag }}</text>
								<view class="tag-check" v-if="selectedTags.includes(tag)">✓</view>
							</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<button class="modal-btn cancel-btn" @click="clearSelectedTags">
						<text class="btn-icon">🗑️</text>
						<text>清空</text>
					</button>
					<button class="modal-btn confirm-btn" @click="showTagSelectorModal = false">
						<text class="btn-icon">✅</text>
						<text>确定</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import MapService from '@/utils/map-service.js'
import Storage from '@/utils/storage.js'

export default {
	data() {
		return {
			title: 'UG吃啥',
			currentFood: null,
			isDrawing: false,
			isDrawingActive: false, // 新增：是否正在抽签动画中
			isAnimating: false,
			statusBarHeight: 0,
			
			// 浮现菜品效果
			floatingFoods: [],
			drawingInterval: null,
			floatingInterval: null,
			
			// 弹窗控制
			showConfirmModal: false,
			showDeliveryModal: false,
			showLocationModal: false,
			showManualLocationModal: false,
			showTagSelectorModal: false,
			showDeliveryButtons: false,
			rejectionCount: 0,
			isRegretMode: false,
			isRegretModBtn: false,
			
			// 筛选相关
			showAdvancedFilter: false,
			selectedMealTime: '',
			selectedMealType: '',
			selectedTags: [],
			priceRange: [0, 200],
			selectedMealTimeIndex: 0,
			selectedMealTypeIndex: 0,
			
			// 标签更新触发器
			tagUpdateTrigger: 0,
			
			// 双滑块拖拽状态
			isDragging: false,
			dragType: '',
			sliderWidth: 0,
			startX: 0,
			
			// 定位搜索相关
			isSearchingLocation: false,
			nearbyFoods: [],
			manualLocation: '',
			currentLocationName: '',
			commonLocations: ['学校', '公司', '家', '商场', '医院', '地铁站'],
			
			// 数据选项
			mealTimes: ['自动', '早餐', '午餐', '晚餐', '夜宵', '零食'],
			mealTypes: ['日常', '大餐'],
			
			// 菜单数据
			menuList: [],
			todayCount: 0
		}
	},
	
	computed: {
		drawButtonText() {
			if (this.isRegretMode) {
				return '我错了'
			}
			if(this.isRegretModBtn){
				if (this.rejectionCount >= 2) {
						let term = ''
						if (this.rejectionCount >= 10) {
							term = '挑食皇帝'
						} else if (this.rejectionCount >= 8) {
							term = '超级挑食王'
						} else if (this.rejectionCount >= 6) {
							term = '挑食大王'
						} else if (this.rejectionCount >= 4) {
							term = '太挑食了'
						} else {
							term = '真挑食'
						}
					return term
				}
			}
			
			return this.currentFood ? '再抽一次' : '开始抽签'
		},
		
		filteredMenuCount() {
			return this.getFilteredMenu().length
		},
		
		hasActiveFilters() {
			return this.selectedMealTime || this.selectedMealType || 
				   this.selectedTags.length > 0 || 
				   this.priceRange[0] > 0 || this.priceRange[1] < 200
		},
		
		mealTimeOptions() {
			return ['不限', ...this.mealTimes]
		},
		
		mealTypeOptions() {
			return ['不限', ...this.mealTypes]
		},
		
		// 从菜单数据中获取所有可用标签
		availableFoodTags() {
			// 添加触发器依赖确保响应式更新
			this.tagUpdateTrigger
			
			const allTags = new Set()
			
			// 从菜单数据中获取标签
			this.menuList.forEach(item => {
				if (item.tags && Array.isArray(item.tags)) {
					item.tags.forEach(tag => allTags.add(tag))
				}
			})
			
			// 从自定义标签中获取标签
			const customTags = uni.getStorageSync('customTags')
			if (customTags && Array.isArray(customTags)) {
				customTags.forEach(tag => allTags.add(tag))
			}
			
			return Array.from(allTags).sort()
		},
		
		// 双滑块样式计算属性
		progressStyle() {
			const minPercent = (this.priceRange[0] / 200) * 100
			const maxPercent = (this.priceRange[1] / 200) * 100
			return {
				left: `${minPercent}%`,
				width: `${maxPercent - minPercent}%`
			}
		},
		
		minThumbStyle() {
			const percent = (this.priceRange[0] / 200) * 100
			return {
				left: `${percent}%`
			}
		},
		
		maxThumbStyle() {
			const percent = (this.priceRange[1] / 200) * 100
			return {
				left: `${percent}%`
			}
		}
	},
	
	onLoad() {
		this.getSystemInfo()
		this.loadMenu()
		this.loadTodayCount()
		this.autoSetMealTime()
		this.setDefaultMealType()
	},
	
	onShow() {
		// 页面显示时重新加载菜单，确保启用状态是最新的
		this.loadMenu()
		// 触发标签更新
		this.tagUpdateTrigger++
		
		// 调试：检查自定义标签
		const customTags = uni.getStorageSync('customTags')
	},
	
	methods: {
		getSystemInfo() {
			const systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight || 20
		},
		
		// 根据当前时间自动设置用餐时段
		autoSetMealTime() {
			const hour = new Date().getHours()
			if (hour >= 6 && hour < 10) {
				this.selectedMealTime = '早餐'
				this.selectedMealTimeIndex = 1
			} else if (hour >= 10 && hour < 14) {
				this.selectedMealTime = '午餐'
				this.selectedMealTimeIndex = 2
			} else if (hour >= 14 && hour < 19) {
				this.selectedMealTime = '晚餐'
				this.selectedMealTimeIndex = 3
			} else {
				this.selectedMealTime = '夜宵'
				this.selectedMealTimeIndex = 4
			}
		},
		
		// 设置默认餐食类型为日常
		setDefaultMealType() {
			this.selectedMealType = '日常'
			this.selectedMealTypeIndex = 1
		},
		
		async loadMenu() {
			try {
				// 直接使用静态导入，避免动态导入在小程序中的兼容性问题
				this.menuList = Storage.getMenuList()
			} catch (e) {
				console.log('加载菜单失败', e)
				// 使用storage.js中的默认菜单
				this.menuList = Storage.getDefaultMenu()
			}
		},
		
		async saveMenu() {
			try {
				await uni.setStorage({
					key: 'ugeat_menu',
					data: this.menuList
				})
			} catch (e) {
				console.error('保存菜单失败', e)
			}
		},
		
		async loadTodayCount() {
			try {
				const history = await uni.getStorage({
					key: 'ugeat_history'
				})
				const today = new Date().toDateString()
				this.todayCount = (history.data || [])
					.filter(item => item.confirmed && new Date(item.timestamp).toDateString() === today)
					.length
			} catch (e) {
				this.todayCount = 0
			}
		},
		
		getFilteredMenu() {
			let filtered = [...this.menuList]
			
			// 只显示启用的菜品
			filtered = filtered.filter(item => item.enabled === true)
			
			// 用餐时段筛选
			if (this.selectedMealTime) {
				filtered = filtered.filter(item => 
					item.mealTimes && item.mealTimes.includes(this.selectedMealTime)
				)
			}
			
			// 餐食类型筛选
			if (this.selectedMealType) {
				filtered = filtered.filter(item => item.type === this.selectedMealType)
			}
			
			// 价格区间筛选
			filtered = filtered.filter(item => 
				item.price >= this.priceRange[0] && item.price <= this.priceRange[1]
			)
			
			// 菜品标签筛选
			if (this.selectedTags.length > 0) {
				filtered = filtered.filter(item => 
					item.tags && this.selectedTags.some(tag => item.tags.includes(tag))
				)
			}
			
			return filtered
		},
		
		async drawFood() {
			if (this.isDrawing) return
			
			// 重置挑食模式
			if (this.isRegretMode) {
				this.isRegretMode = false
				// this.rejectionCount = 0
				uni.showToast({
					title: '好的，重新开始选择！',
					icon: 'success'
				})
				return // 重置后返回，不进行抽取
			}

			if (this.isRegretModBtn) {
				this.isRegretModBtn = false
				uni.showToast({
					title: '好的，重新开始选择！',
					icon: 'success'
				})
				return
			}
			
			const filteredMenu = this.getFilteredMenu()
			if (filteredMenu.length === 0) {
				uni.showToast({
					title: '没有符合条件的菜品',
					icon: 'none'
				})
				return
			}
			
			this.isDrawing = true
			this.isDrawingActive = true
			this.isAnimating = true
			this.showDeliveryButtons = false
			
			// 开始浮现菜品效果
			this.startFloatingEffect(filteredMenu)
			
			// 开始抽签动画（不自动停止）
			this.drawingInterval = setInterval(() => {
				const randomIndex = Math.floor(Math.random() * filteredMenu.length)
				this.currentFood = filteredMenu[randomIndex]
			}, 100)
		},
		
		stopDrawing() {
			if (!this.isDrawingActive) return
			
			// 停止抽签动画
			if (this.drawingInterval) {
				clearInterval(this.drawingInterval)
				this.drawingInterval = null
			}
			
			// 停止浮现效果
			this.stopFloatingEffect()
			
			this.isDrawing = false
			this.isDrawingActive = false
			this.isAnimating = false
			
			// 显示确认弹窗
			this.showConfirmModal = true
		},
		
		startFloatingEffect(filteredMenu) {
			// 清空之前的浮现菜品
			this.floatingFoods = []
			
			// 开始生成浮现菜品
			this.floatingInterval = setInterval(() => {
				if (this.floatingFoods.length < 8) { // 最多同时显示8个浮现菜品
					const randomFood = filteredMenu[Math.floor(Math.random() * filteredMenu.length)]
					const floatingFood = {
						name: randomFood.name,
						style: this.getRandomFloatingStyle(),
						class: 'floating-in'
					}
					this.floatingFoods.push(floatingFood)
					
					// 3秒后移除
					setTimeout(() => {
						const index = this.floatingFoods.indexOf(floatingFood)
						if (index > -1) {
							this.floatingFoods[index].class = 'floating-out'
							setTimeout(() => {
								const removeIndex = this.floatingFoods.indexOf(floatingFood)
								if (removeIndex > -1) {
									this.floatingFoods.splice(removeIndex, 1)
								}
							}, 500)
						}
					}, 3000)
				}
			}, 300)
		},
		
		stopFloatingEffect() {
			if (this.floatingInterval) {
				clearInterval(this.floatingInterval)
				this.floatingInterval = null
			}
			
			// 清空浮现菜品
			setTimeout(() => {
				this.floatingFoods = []
			}, 1000)
		},
		
		getRandomFloatingStyle() {
			// 从中心点向外扩散的随机位置
			const centerX = 50; // 中心X坐标百分比
			const centerY = 50; // 中心Y坐标百分比
			
			// 随机角度和距离
			const angle = Math.random() * 360; // 0-360度
			const distance = Math.random() * 40 + 10; // 10-50的距离百分比
			
			// 计算最终位置
			const left = centerX + Math.cos(angle * Math.PI / 180) * distance;
			const top = centerY + Math.sin(angle * Math.PI / 180) * distance;
			
			const animationDuration = Math.random() * 2 + 2; // 2-4秒
			const fontSize = Math.random() * 8 + 14; // 14-22px
			
			return {
				left: `${Math.max(5, Math.min(95, left))}%`, // 限制在5%-95%范围内
				top: `${Math.max(5, Math.min(95, top))}%`, // 限制在5%-95%范围内
				fontSize: `${fontSize}px`,
				animationDuration: `${animationDuration}s`
			}
		},
		
		async confirmFood() {
			if (!this.currentFood) return
			
			this.showConfirmModal = false
			this.showDeliveryButtons = true
			this.rejectionCount = 0
			
			// 记录到历史
			await this.saveToHistory(true)
			
			uni.showToast({
				title: `决定了！今天吃${this.currentFood.name}！`,
				icon: 'success'
			})
			
			this.loadTodayCount()
		},
		
		async rejectFood() {
			if (!this.currentFood) return
			
			this.showConfirmModal = false
			this.rejectionCount++
			
			// 记录拒绝到历史
			await this.saveToHistory(false)
			
			// 根据拒绝次数显示不同提示，但不重置计数
			if (this.rejectionCount >= 10) {
				this.isRegretMode = true
				uni.showToast({
					title: '挑食皇帝登基！',
					icon: 'none'
				})
			} else if (this.rejectionCount == 8) {
				this.isRegretModBtn = true
				uni.showToast({
					title: '超级挑食王！',
					icon: 'none'
				})
			} else if (this.rejectionCount == 6) {
				this.isRegretModBtn = true
				uni.showToast({
					title: '挑食大王降临！',
					icon: 'none'
				})
			} else if (this.rejectionCount == 4) {
				this.isRegretModBtn = true
				uni.showToast({
					title: '太挑食了！',
					icon: 'none'
				})
			} else if (this.rejectionCount == 2) {
				this.isRegretModBtn = true
				uni.showToast({
					title: '真挑食哦~',
					icon: 'none'
				})
			}
		},
		
		hideConfirmModal() {
			this.showConfirmModal = false
		},
		
		async saveToHistory(confirmed) {
			try {
				const history = await uni.getStorage({
					key: 'ugeat_history'
				}).then(res => res.data).catch(() => [])
				
				const record = {
					id: Date.now(),
					name: this.currentFood.name,
					price: this.currentFood.price,
					type: this.currentFood.type,
					tags: this.currentFood.tags,
					confirmed: confirmed,
					timestamp: Date.now()
				}
				
				history.unshift(record)
				
				// 只保留最近1000条记录
				if (history.length > 1000) {
					history.splice(1000)
				}
				
				await uni.setStorage({
					key: 'ugeat_history',
					data: history
				})
			} catch (e) {
				console.error('保存历史记录失败', e)
			}
		},
		
		// 筛选方法
		onMealTimeChange(e) {
			this.selectedMealTimeIndex = e.detail.value
			if (e.detail.value === 0) {
				this.selectedMealTime = ''
			} else {
				this.selectedMealTime = this.mealTimes[e.detail.value - 1]
				
				// 当选择用餐时段时，自动根据当前时间设置相应时段
				if (this.selectedMealTime === '自动') {
					const hour = new Date().getHours()
					if (hour >= 6 && hour < 10) {
						this.selectedMealTime = '早餐'
					} else if (hour >= 10 && hour < 14) {
						this.selectedMealTime = '午餐'
					} else if (hour >= 14 && hour < 19) {
						this.selectedMealTime = '晚餐'
					} else {
						this.selectedMealTime = '夜宵'
					}
				}
			}
			
			// 设置默认餐食类型为日常
			if (!this.selectedMealType) {
				this.selectedMealType = '日常'
				this.selectedMealTypeIndex = 1 // '日常'在第二个位置
			}
		},
		
		onMealTypeChange(e) {
			this.selectedMealTypeIndex = e.detail.value
			this.selectedMealType = e.detail.value === 0 ? '' : this.mealTypes[e.detail.value - 1]
		},
		
		selectMealTime(time) {
			this.selectedMealTime = this.selectedMealTime === time ? '' : time
		},
		
		selectMealType(type) {
			this.selectedMealType = this.selectedMealType === type ? '' : type
		},
		
		toggleFoodTag(tag) {
			const index = this.selectedTags.indexOf(tag)
			if (index > -1) {
				this.selectedTags.splice(index, 1)
			} else {
				this.selectedTags.push(tag)
			}
		},
		
		// 清空选中的标签
		clearSelectedTags() {
			this.selectedTags = []
		},
		
		// 双滑块拖拽方法
		startDrag(type, e) {
			this.isDragging = true
			this.dragType = type
			this.startX = e.touches[0].clientX
			
			// 获取滑块容器宽度
			const query = uni.createSelectorQuery()
			query.select('.slider-track').boundingClientRect((data) => {
				this.sliderWidth = data.width
			}).exec()
		},
		
		onDrag(e) {
			if (!this.isDragging) return
			
			const currentX = e.touches[0].clientX
			const deltaX = currentX - this.startX
			const deltaPercent = (deltaX / this.sliderWidth) * 100
			const deltaValue = (deltaPercent / 100) * 200
			
			if (this.dragType === 'min') {
				const newMin = Math.max(0, Math.min(this.priceRange[0] + deltaValue, this.priceRange[1]))
				this.priceRange[0] = Math.round(newMin)
			} else {
				const newMax = Math.min(200, Math.max(this.priceRange[1] + deltaValue, this.priceRange[0]))
				this.priceRange[1] = Math.round(newMax)
			}
			
			this.startX = currentX
		},
		
		endDrag() {
			this.isDragging = false
			this.dragType = ''
		},
		
		clearAllFilters() {
			this.selectedMealTime = ''
			this.selectedMealType = ''
			this.selectedTags = []
			this.priceRange = [0, 200]
			this.selectedMealTimeIndex = 0
			this.selectedMealTypeIndex = 0
			this.nearbyFoods = []
		},
		
		// 位置搜索相关方法
		async getCurrentLocation() {
			this.showLocationModal = false
			this.isSearchingLocation = true
			
			try {
				const location = await uni.getLocation({
					type: 'gcj02'
				})
				await this.searchNearbyFoodByLocation(location)
			} catch (e) {
				console.error('获取位置失败', e)
				uni.showToast({
					title: '定位失败，请检查权限设置',
					icon: 'none'
				})
			} finally {
				this.isSearchingLocation = false
			}
		},
		
		selectManualLocation() {
			this.showLocationModal = false
			this.showManualLocationModal = true
		},
		
		showManualLocationInput() {
			this.showLocationModal = false
			this.showManualLocationModal = true
		},
		
		openMapSelection() {
			this.showLocationModal = false
			
			// 使用uni-app的chooseLocation API打开地图选择位置
			uni.chooseLocation({
				success: async (res) => {
					console.log('选择位置成功：', res)
					
					// 使用选择的位置搜索附近美食
					const location = {
						latitude: res.latitude,
						longitude: res.longitude
					}
					
					uni.showToast({
						title: `已选择：${res.name || res.address}`,
						icon: 'success'
					})
					
					await this.searchNearbyFoodByLocation(location)
				},
				fail: (err) => {
					console.error('选择位置失败：', err)
					if (err.errMsg.includes('cancel')) {
						// 用户取消选择
						return
					}
					uni.showToast({
						title: '位置选择失败',
						icon: 'none'
					})
				}
			})
		},
		
		selectCommonLocation(location) {
			this.manualLocation = location
		},
		
		async confirmManualLocation() {
			if (!this.manualLocation.trim()) {
				uni.showToast({
					title: '请输入位置信息',
					icon: 'none'
				})
				return
			}
			
			this.showManualLocationModal = false
			this.isSearchingLocation = true
			this.currentLocationName = this.manualLocation
			
			try {
				// 使用新的地图服务搜索附近美食
				const restaurants = await MapService.searchNearbyByAddress(this.manualLocation)
				this.nearbyFoods = restaurants
				
				uni.showToast({
					title: `已找到 ${this.manualLocation} 附近 ${restaurants.length} 家美食`,
					icon: 'success'
				})
			} catch (e) {
				console.error('搜索失败', e)
				uni.showToast({
					title: e.message || '搜索失败，请重试',
					icon: 'none'
				})
			} finally {
				this.isSearchingLocation = false
				this.manualLocation = ''
			}
		},
		
		async searchNearbyFoodByLocation(location) {
			try {
				this.isSearchingLocation = true
				
				// 使用新的地图服务搜索附近美食
				const restaurants = await MapService.searchNearbyRestaurants(location, '美食', 2000)
				this.nearbyFoods = restaurants
				
				uni.showToast({
					title: `已找到附近 ${restaurants.length} 家美食`,
					icon: 'success'
				})
			} catch (e) {
				console.error('搜索附近美食失败:', e)
				uni.showToast({
					title: e.message || '搜索失败，请重试',
					icon: 'none'
				})
			} finally {
				this.isSearchingLocation = false
			}
		},
		
		selectNearbyFood(food) {
			// 将附近美食添加到当前菜单（如果不存在）
			const exists = this.menuList.some(item => item.name === food.name)
			if (!exists) {
				const newFood = {
					...food,
					id: 'nearby_' + Date.now()
				}
				this.menuList.push(newFood)
				this.saveMenu()
			}
			
			// 设置为当前食物并显示确认弹窗
			this.currentFood = food
			this.showConfirmModal = true
		},
		
		// 外卖跳转
		openDelivery(platform) {
			this.showDeliveryModal = false
			const foodName = this.currentFood?.name || ''
			let url = ''
			
			switch (platform) {
				case 'meituan':
					// 美团外卖小程序 appid
					url = `/pages/index/index?query=${encodeURIComponent(foodName)}`
					uni.navigateToMiniProgram({
						appId: 'wxde8ac0a21135c07d', // 美团外卖小程序appid
						path: url,
						fail: () => {
							uni.showToast({ title: '请先安装美团外卖', icon: 'none' })
						}
					})
					break
					
				case 'ele':
					// 饿了么小程序 appid  
					url = `/pages/index/index?query=${encodeURIComponent(foodName)}`
					uni.navigateToMiniProgram({
						appId: 'wxe2d3dbd40a0c0fef', // 饿了么小程序appid
						path: url,
						fail: () => {
							uni.showToast({ title: '请先安装饿了么', icon: 'none' })
						}
					})
					break
					
				case 'douyin':
					// 抖音外卖小程序（假设的appid）
					url = `/pages/index/index?query=${encodeURIComponent(foodName)}`
					uni.navigateToMiniProgram({
						appId: 'ttba8aa6c6d2b93df1', // 抖音外卖小程序appid（假设）
						path: url,
						fail: () => {
							uni.showToast({ title: '请先安装抖音', icon: 'none' })
						}
					})
					break
			}
		},

		notOpen() {
			uni.showToast({
				title: '该功能暂未开放',
				icon: 'none'
			});
		},
		
		// 页面跳转
		goToMenu() {
			uni.navigateTo({
				url: '/pages/menu/menu'
			})
		},
		
		goToStatistics() {
			uni.navigateTo({
				url: '/pages/statistics/statistics'
			})
		}
	}
}
</script>

<style>
/* 美食主题色调 */
.container {
	min-height: 100vh;
	background: linear-gradient(135deg, #FF8A65 0%, #FFB74D 50%, #FFA726 100%);
	position: relative;
}

.container::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
	pointer-events: none;
}

.content {
	padding: 20rpx 40rpx 40rpx;
	position: relative;
	z-index: 1;
}

.header {
	text-align: center;
	margin-bottom: 40rpx;
	padding-top: 20rpx;
}

.title {
	display: block;
	font-size: 48rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 10rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
}

.subtitle {
	display: block;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	text-shadow: 0 1rpx 4rpx rgba(0,0,0,0.2);
}

/* 菜品卡片样式 */
.result-area {
	margin-bottom: 40rpx;
	min-height: 200rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.food-card {
	background: linear-gradient(145deg, #FFFFFF 0%, #FFF8E1 100%);
	border-radius: 24rpx;
	padding: 40rpx;
	box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15), 0 4rpx 12rpx rgba(255, 138, 101, 0.2);
	text-align: center;
	transition: all 0.3s ease;
	width: 100%;
	border: 2rpx solid rgba(255, 183, 77, 0.3);
}

.food-card.animate {
	transform: scale(1.05) rotate(1deg);
	box-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.2), 0 6rpx 16rpx rgba(255, 138, 101, 0.3);
}

.welcome-content {
	color: #8D6E63;
}

.welcome-icon {
	font-size: 80rpx;
	display: block;
	margin-bottom: 20rpx;
}

.welcome-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #5D4037;
	display: block;
	margin-bottom: 10rpx;
}

.welcome-subtitle {
	font-size: 28rpx;
	color: #8D6E63;
	display: block;
	margin-bottom: 15rpx;
}

.welcome-tip {
	font-size: 24rpx;
	color: #A1887F;
	display: block;
}

.food-name {
	font-size: 48rpx;
	font-weight: bold;
	color: #5D4037;
	display: block;
	margin-bottom: 20rpx;
	text-shadow: 0 2rpx 4rpx rgba(93, 64, 55, 0.1);
}

.food-info {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-bottom: 30rpx;
}

.meal-times {
	display: flex;
	justify-content: center;
	gap: 10rpx;
	flex-wrap: wrap;
}

.meal-time {
	background: linear-gradient(45deg, #667eea, #764ba2);
	color: white;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 600;
	box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.3);
}

.tags {
	display: flex;
	justify-content: center;
	gap: 10rpx;
	flex-wrap: wrap;
}

.tag {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(255, 138, 101, 0.3);
}

.price {
	font-size: 36rpx;
	color: #E65100;
	font-weight: bold;
	text-shadow: 0 1rpx 2rpx rgba(230, 81, 0, 0.2);
}

.meal-type {
	font-size: 28rpx;
	color: #8D6E63;
}

.order-delivery-btn {
	background: linear-gradient(45deg, #4CAF50, #66BB6A);
	color: white;
	border: none;
	border-radius: 25rpx;
	padding: 16rpx 32rpx;
	font-size: 28rpx;
	font-weight: bold;
	box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
	transition: all 0.3s ease;
}

.order-delivery-btn.subtle {
	background: transparent;
	color: #ccc;
	border: 1rpx solid #f0f0f0;
	font-size: 20rpx;
	font-weight: normal;
	padding: 6rpx 12rpx;
	box-shadow: none;
	opacity: 0.5;
	border-radius: 12rpx;
}

.order-delivery-btn:active {
	transform: scale(0.95);
}

/* 抽签按钮 */
.button-area {
	text-align: center;
	margin-bottom: 40rpx;
}

.draw-btn {
	background: linear-gradient(45deg, #FFFFFF, #FFF8E1);
	color: #FF6F00;
	border: 3rpx solid #FFB74D;
	border-radius: 50rpx;
	padding: 24rpx 60rpx;
	font-size: 32rpx;
	font-weight: bold;
	box-shadow: 0 8rpx 24rpx rgba(255, 183, 77, 0.4), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
	transition: all 0.3s ease;
}

.draw-btn.regret {
	background: linear-gradient(45deg, #FFD54F, #FFC107);
	color: #F57F17;
	border-color: #FFA000;
}

.draw-btn:not(.loading):active {
	transform: scale(0.95);
	box-shadow: 0 4rpx 12rpx rgba(255, 183, 77, 0.3);
}

.draw-btn.loading {
	opacity: 0.7;
}

/* 筛选区域 */
.filter-section {
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 225, 0.9));
	border: 1rpx solid rgba(255, 183, 77, 0.2);
	backdrop-filter: blur(10rpx);
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(255, 138, 101, 0.1);
}

.basic-filter {
	background: transparent;
	border-radius: 0;
	padding: 0;
	border: none;
	margin-bottom: 16rpx;
}

.filter-row {
	display: flex;
	align-items: center;
	gap: 16rpx;
	flex-wrap: nowrap;
	margin-bottom: 16rpx;
}

.filter-item {
	flex: 1;
	min-width: 140rpx;
	margin-bottom: 0;
}

.filter-label {
	color: #5D4037;
	font-size: 22rpx;
	font-weight: 600;
	display: block;
	margin-bottom: 8rpx;
}

.filter-picker {
	width: 100%;
}

.picker-content {
	background: rgba(255, 255, 255, 0.9);
	border: 1rpx solid rgba(255, 183, 77, 0.3);
	border-radius: 12rpx;
	padding: 8rpx 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #5D4037;
	font-size: 22rpx;
	transition: all 0.2s ease;
}

.picker-arrow {
	color: #FF8A65;
	font-size: 16rpx;
}

.advanced-toggle {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	border: none;
	border-radius: 16rpx;
	padding: 8rpx 14rpx;
	font-size: 20rpx;
	display: flex;
	align-items: center;
	white-space: nowrap;
	flex-shrink: 0;
	gap: 6rpx;
	box-shadow: 0 2rpx 8rpx rgba(255, 138, 101, 0.2);
}

.toggle-arrow {
	transition: transform 0.3s ease;
	font-size: 16rpx;
}

.toggle-arrow.active {
	transform: rotate(180deg);
}

.advanced-filter {
	padding-top: 16rpx;
	border-top: 1rpx solid rgba(255, 183, 77, 0.2);
	margin-top: 16rpx;
}

.advanced-filter .filter-item {
	margin-bottom: 16rpx;
}

.price-filter .price-range-container {
	background: rgba(255, 255, 255, 0.7);
	border: 1rpx solid rgba(255, 183, 77, 0.2);
	border-radius: 12rpx;
	padding: 16rpx;
	margin-top: 8rpx;
}

.price-range-slider {
	width: 100%;
	height: 60rpx;
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.slider-track {
	position: relative;
	width: 100%;
	height: 8rpx;
	background: rgba(255, 183, 77, 0.3);
	border-radius: 4rpx;
}

.slider-progress {
	position: absolute;
	height: 100%;
	background: #FF8A65;
	border-radius: 4rpx;
}

.slider-thumb {
	position: absolute;
	width: 40rpx;
	height: 40rpx;
	background: #FF8A65;
	border: 4rpx solid #fff;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
	z-index: 2;
}

.slider-thumb:active {
	transform: translate(-50%, -50%) scale(1.2);
}

.price-range-labels {
	display: flex;
	justify-content: space-between;
	color: #5D4037;
	font-size: 24rpx;
}

.tag-selector {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.filter-tag {
	background: rgba(255, 255, 255, 0.6);
	color: #5D4037;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	border: 1rpx solid rgba(255, 183, 77, 0.4);
	transition: all 0.3s ease;
}

.filter-tag.small {
	font-size: 22rpx;
	padding: 6rpx 12rpx;
}

.filter-tag.active {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	border-color: #FF5722;
	box-shadow: 0 2rpx 8rpx rgba(255, 138, 101, 0.4);
}

.location-search {
	text-align: center;
}

.location-btn {
	background: linear-gradient(45deg, #2196F3, #42A5F5);
	color: white;
	border: none;
	border-radius: 20rpx;
	padding: 14rpx 28rpx;
	font-size: 26rpx;
	box-shadow: 0 4rpx 12rpx rgba(33, 150, 243, 0.3);
}

.nearby-results {
	margin-top: 15rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	justify-content: center;
}

.nearby-item {
	background: rgba(255, 255, 255, 0.8);
	color: #5D4037;
	padding: 8rpx 12rpx;
	border-radius: 15rpx;
	font-size: 22rpx;
	border: 1rpx solid rgba(255, 183, 77, 0.4);
}

.filter-preview {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(255, 183, 77, 0.3);
}

.filter-actions {
	margin-left: auto;
}

.preview-text {
	color: #5D4037;
	font-size: 26rpx;
	font-weight: 600;
}

.clear-filter-btn {
	background: linear-gradient(45deg, #F44336, #E57373);
	color: white;
	border: none;
	border-radius: 15rpx;
	padding: 8rpx 16rpx;
	font-size: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(244, 67, 54, 0.3);
}

/* 功能按钮 */
.function-buttons {
	display: flex;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.func-btn {
	flex: 1;
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 248, 225, 0.3));
	border: 1rpx solid rgba(255, 183, 77, 0.4);
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	backdrop-filter: blur(5rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.func-icon {
	font-size: 36rpx;
}

.func-text {
	color: #5D4037;
	font-size: 24rpx;
	font-weight: 600;
}

.stats-preview {
	text-align: center;
}

.stats-text {
	color: rgba(255, 255, 255, 0.9);
	font-size: 26rpx;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

/* 弹窗样式 */
.confirm-modal, .delivery-modal, .location-modal, .manual-location-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	backdrop-filter: blur(5rpx);
}

.modal-content {
	background: linear-gradient(145deg, #FFFFFF, #FFF8E1);
	width: 80%;
	max-width: 500rpx;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
	border: 2rpx solid rgba(255, 183, 77, 0.3);
}

.modal-content.large {
	width: 90%;
	max-width: 600rpx;
}

.modal-header {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	padding: 30rpx;
	text-align: center;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

.modal-body {
	padding: 40rpx;
	text-align: center;
}

.confirm-text, .modal-subtitle {
	font-size: 28rpx;
	color: #5D4037;
	margin-bottom: 20rpx;
}

.delivery-options, .location-options {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.delivery-option, .location-option {
	background: linear-gradient(145deg, #FFFFFF, #FFF8E1);
	border: 2rpx solid rgba(255, 183, 77, 0.4);
	border-radius: 16rpx;
	padding: 20rpx;
	display: flex;
	align-items: center;
	gap: 15rpx;
	transition: all 0.3s ease;
}

.delivery-option:active, .location-option:active {
	transform: scale(0.98);
	background: linear-gradient(145deg, #FFF8E1, #FFFFFF);
}

.delivery-icon, .location-icon {
	font-size: 32rpx;
}

.delivery-name, .location-text {
	font-size: 28rpx;
	color: #5D4037;
	font-weight: 600;
}

/* 手动位置选择样式 */
.manual-location-form {
	display: flex;
	flex-direction: column;
	gap: 25rpx;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.input-label {
	font-size: 26rpx;
	color: #5D4037;
	font-weight: 600;
}

.location-input {
	background: rgba(255, 255, 255, 0.8);
	border: 2rpx solid rgba(255, 183, 77, 0.4);
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 26rpx;
	color: #5D4037;
}

.location-input:focus {
	border-color: #FF8A65;
	background: rgba(255, 255, 255, 0.95);
}

.common-locations {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.common-title {
	font-size: 26rpx;
	color: #5D4037;
	font-weight: 600;
}

.location-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.location-tag {
	background: linear-gradient(145deg, #FFF8E1, #FFFFFF);
	border: 2rpx solid rgba(255, 183, 77, 0.4);
	border-radius: 20rpx;
	padding: 8rpx 16rpx;
	font-size: 24rpx;
	color: #5D4037;
	transition: all 0.3s ease;
}

.location-tag:active {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	transform: scale(0.95);
}

/* 增强确认模态框样式 */
.confirm-content {
	max-width: 600rpx;
}

.confirm-body {
	padding: 40rpx 30rpx;
	text-align: center;
}

.food-display {
	background: linear-gradient(145deg, rgba(255, 248, 225, 0.8), rgba(255, 255, 255, 0.8));
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 25rpx;
	border: 2rpx solid rgba(255, 183, 77, 0.3);
}

.food-name {
	font-size: 36rpx;
	font-weight: 700;
	color: #D84315;
	display: block;
	margin-bottom: 20rpx;
}

.food-details {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	align-items: center;
}

.food-price, .food-type {
	font-size: 26rpx;
	color: #5D4037;
	font-weight: 600;
}

.food-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
	justify-content: center;
	margin-top: 10rpx;
}

.tag {
	background: rgba(255, 138, 101, 0.2);
	color: #D84315;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	border: 1rpx solid rgba(255, 138, 101, 0.3);
}

.confirm-question {
	font-size: 32rpx;
	color: #5D4037;
	font-weight: 600;
	margin-bottom: 20rpx;
}

.rejection-hint {
	background: rgba(255, 193, 7, 0.1);
	border: 2rpx solid rgba(255, 193, 7, 0.3);
	border-radius: 15rpx;
	padding: 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
}

.hint-text {
	font-size: 24rpx;
	color: #F57C00;
	font-weight: 600;
}

.hint-emoji {
	font-size: 28rpx;
}

.enhanced-cancel, .enhanced-confirm {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 25rpx 20rpx;
}

.btn-icon {
	font-size: 24rpx;
}

.btn-text {
	font-size: 28rpx;
	font-weight: 600;
}

.modal-footer {
	padding: 30rpx;
	display: flex;
	gap: 20rpx;
}

.modal-btn {
	flex: 1;
	padding: 24rpx;
	border-radius: 15rpx;
	font-size: 28rpx;
	font-weight: 600;
	border: none;
	transition: all 0.3s ease;
}

.cancel-btn {
	background: linear-gradient(135deg, #A5A5A5, #9E9E9E);
	color: white;
}

.confirm-btn {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	color: white;
}

.modal-btn:active {
	transform: scale(0.95);
}

.close-btn {
	font-size: 40rpx;
	color: white;
	background: none;
	border: none;
	padding: 0;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: background 0.3s ease;
}

.close-btn:active {
	background: rgba(255, 255, 255, 0.2);
}

/* 标签选择弹窗样式 */
.tag-selector-modal {
	max-height: 85vh;
}

.tag-selector-body {
	max-height: 60vh;
	overflow-y: auto;
	padding: 30rpx;
}

/* 已选择标签预览区域 */
.selected-tags-preview {
	background: linear-gradient(135deg, #E8F5E8, #F0F8F0);
	border: 2rpx solid #4CAF50;
	border-radius: 15rpx;
	padding: 20rpx;
	margin-bottom: 25rpx;
}

.preview-label {
	font-size: 24rpx;
	color: #2E7D32;
	font-weight: 600;
	margin-bottom: 12rpx;
	display: block;
}

.selected-tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
}

.selected-tag-item {
	background: linear-gradient(135deg, #4CAF50, #66BB6A);
	color: white;
	padding: 8rpx 15rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.3);
}

.remove-tag {
	background: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	width: 28rpx;
	height: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18rpx;
	font-weight: bold;
	cursor: pointer;
}

.remove-tag:active {
	background: rgba(255, 255, 255, 0.5);
}

/* 可选标签区域 */
.available-tags-section {
	margin-top: 20rpx;
}

.section-label {
	font-size: 26rpx;
	color: #5D4037;
	font-weight: 600;
	margin-bottom: 15rpx;
	display: block;
}

.tag-grid-improved {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12rpx;
}

.tag-option-improved {
	background: linear-gradient(145deg, #FFFFFF, #F8F9FA);
	border: 2rpx solid #E9ECEF;
	border-radius: 15rpx;
	padding: 16rpx 12rpx;
	text-align: center;
	transition: all 0.3s ease;
	cursor: pointer;
	position: relative;
	min-height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.tag-option-improved:active {
	transform: scale(0.95);
}

.tag-option-improved.selected {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	border-color: #FF5722;
	color: white;
	box-shadow: 0 4rpx 15rpx rgba(255, 138, 101, 0.4);
}

.tag-text {
	font-size: 24rpx;
	font-weight: 500;
	color: inherit;
}

.tag-check {
	position: absolute;
	top: -5rpx;
	right: -5rpx;
	background: #4CAF50;
	color: white;
	border-radius: 50%;
	width: 28rpx;
	height: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16rpx;
	font-weight: bold;
	box-shadow: 0 2rpx 6rpx rgba(76, 175, 80, 0.4);
}

/* 按钮样式改进 */
.modal-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 20rpx 35rpx;
	border-radius: 18rpx;
	font-size: 26rpx;
	font-weight: 600;
	border: none;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.btn-icon {
	font-size: 22rpx;
}

.cancel-btn {
	background: linear-gradient(135deg, #9E9E9E, #757575);
	color: white;
}

.confirm-btn {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	color: white;
}

.modal-btn:active {
	transform: scale(0.95);
}

/* 旧样式保持兼容 */
.tag-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.tag-option {
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	color: #666;
	padding: 20rpx;
	border-radius: 12rpx;
	text-align: center;
	font-size: 26rpx;
	transition: all 0.3s ease;
	cursor: pointer;
}

.tag-option.selected {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	border-color: #FF8A65;
	color: white;
}

.tag-option:active {
	transform: scale(0.95);
}

/* 标签选择器样式 */
.tag-selector {
	background: rgba(255, 255, 255, 0.8);
	border: 2rpx solid rgba(255, 183, 77, 0.5);
	border-radius: 15rpx;
	padding: 12rpx 16rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-height: 60rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.tag-selector:active {
	border-color: #FF8A65;
	background: rgba(255, 255, 255, 0.95);
}

/* 改进的标签选择器样式 */
.tag-selector-improved {
	background: linear-gradient(145deg, #FFFFFF, #FFF8E1);
	border: 2rpx solid #FFB74D;
	border-radius: 18rpx;
	padding: 20rpx;
	display: flex;
	align-items: center;
	gap: 15rpx;
	min-height: 80rpx;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 12rpx rgba(255, 183, 77, 0.15);
}

.tag-selector-improved:active {
	border-color: #FF8A65;
	background: linear-gradient(145deg, #FFF8E1, #FFFFFF);
	transform: scale(0.98);
}

.selected-tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
	flex: 1;
	align-items: center;
	max-height: 100rpx;
	overflow: hidden;
}

.selected-tag-wrapper {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	border-radius: 15rpx;
	padding: 6rpx 12rpx;
	display: flex;
	align-items: center;
	gap: 6rpx;
	box-shadow: 0 2rpx 8rpx rgba(255, 138, 101, 0.3);
	transition: all 0.2s ease;
}

.selected-tag-wrapper:active {
	transform: scale(0.95);
}

.selected-tag-improved {
	color: white;
	font-size: 22rpx;
	font-weight: 500;
}

.tag-remove {
	background: rgba(255, 255, 255, 0.3);
	color: white;
	border-radius: 50%;
	width: 24rpx;
	height: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16rpx;
	font-weight: bold;
	transition: all 0.2s ease;
}

.tag-remove:active {
	background: rgba(255, 255, 255, 0.5);
	transform: scale(1.1);
}

.tag-count-badge {
	background: linear-gradient(135deg, #FFC107, #FF9800);
	color: white;
	font-size: 20rpx;
	font-weight: 600;
	padding: 4rpx 8rpx;
	border-radius: 12rpx;
	margin-left: 4rpx;
	box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.3);
}

.placeholder-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.placeholder-improved {
	color: #8D6E63;
	font-size: 26rpx;
	font-weight: 500;
}

.placeholder-hint {
	color: #BCAAA4;
	font-size: 20rpx;
	font-style: italic;
}

.arrow-container {
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	border-radius: 12rpx;
	width: 40rpx;
	height: 40rpx;
	box-shadow: 0 2rpx 8rpx rgba(255, 138, 101, 0.3);
}

.arrow-improved {
	color: white;
	font-size: 20rpx;
}

.selected-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
	flex: 1;
}

.selected-tag {
	background: #FF8A65;
	color: white;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 4rpx rgba(255, 138, 101, 0.3);
}

.placeholder {
	color: #999;
	font-size: 28rpx;
}

.arrow {
	color: #FF8A65;
	font-size: 18rpx;
	margin-left: 10rpx;
}

/* 浮现菜品效果 */
.floating-foods {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 100;
}

.floating-food {
	position: absolute;
	color: #FF6B6B;
	font-weight: bold;
	text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
	white-space: nowrap;
	opacity: 0.8;
	transform: translate(-50%, -50%); /* 以元素中心为基准点 */
}

.floating-food.floating-in {
	animation: floatingIn 3s ease-out forwards;
}

.floating-food.floating-out {
	animation: floatingOut 0.5s ease-in forwards;
}

@keyframes floatingIn {
	0% {
		opacity: 0;
		transform: scale(0.3) translate(-50%, -50%);
	}
	10% {
		opacity: 1;
		transform: scale(1.2) translate(-50%, -50%);
	}
	20% {
		opacity: 0.8;
		transform: scale(1) translate(-50%, -50%);
	}
	100% {
		opacity: 0;
		transform: scale(1) translate(-50%, -50%);
	}
}

@keyframes floatingOut {
	0% {
		opacity: 0.8;
		transform: scale(1) translate(-50%, -50%);
	}
	100% {
		opacity: 0;
		transform: scale(0.8) translate(-50%, -50%);
	}
}
</style>
