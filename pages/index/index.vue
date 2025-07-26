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
						@click="drawFood" 
						:disabled="isDrawing">
					<text v-if="!isDrawing">{{ drawButtonText }}</text>
					<text v-else>抽签中...</text>
				</button>
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
						<text class="filter-label">菜品标签：</text>
						<view class="tag-selector">
							<text class="filter-tag small" 
								  :class="{ 'active': selectedTags.includes(tag) }" 
								  v-for="tag in foodTags" 
								  :key="tag"
								  @click="toggleFoodTag(tag)">
								{{ tag }}
							</text>
						</view>
					</view>
					
					<!-- 附近美食搜索 -->
					<view class="filter-item">
						<text class="filter-label">附近美食：</text>
						<view class="location-search">
							<button class="location-btn" @click="showLocationModal = true">
								根据位置搜索附近美食
							</button>
							<view class="nearby-results" v-if="nearbyFoods.length > 0">
								<text class="nearby-item" 
									  v-for="food in nearbyFoods" 
									  :key="food.name"
									  @click="selectNearbyFood(food)">
									{{ food.name }} - {{ food.distance }}
								</text>
							</view>
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
	</view>
</template>

<script>
import { getAllRecipes } from '@/utils/recipes.js'

export default {
	data() {
		return {
			title: 'UG吃啥',
			currentFood: null,
			isDrawing: false,
			isAnimating: false,
			statusBarHeight: 0,
			
			// 弹窗控制
			showConfirmModal: false,
			showDeliveryModal: false,
			showLocationModal: false,
			showManualLocationModal: false,
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
			foodTags: ['辛辣', '清淡', '甜品', '海鲜', '烧烤', '快餐', '西式', '营养', '奶茶', '饮品', '面食', '异国', '日料', '酸甜'],
			
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
				const menu = await uni.getStorage({
					key: 'ugeat_menu'
				})
				this.menuList = menu.data || []
				
				// 如果没有菜单数据，使用默认菜单而不是UG秘制菜谱
				if (this.menuList.length === 0) {
					// 使用storage.js中的默认菜单
					const storage = await import('@/utils/storage.js')
					this.menuList = storage.default.getDefaultMenu()
					await this.saveMenu()
				}
			} catch (e) {
				console.log('未找到菜单数据，使用默认菜单')
				// 使用storage.js中的默认菜单
				const storage = await import('@/utils/storage.js')
				this.menuList = storage.default.getDefaultMenu()
				await this.saveMenu()
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
			
			// 用餐时段筛选
			if (this.selectedMealTime) {
								console.log(`筛选用餐时段: ${this.selectedMealTime}`,filtered);
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
			this.isAnimating = true
			this.showDeliveryButtons = false
			
			// 模拟抽签动画
			await new Promise(resolve => {
				let count = 0
				const interval = setInterval(() => {
					const randomIndex = Math.floor(Math.random() * filteredMenu.length)
					this.currentFood = filteredMenu[randomIndex]
					count++
					
					if (count >= 10) {
						clearInterval(interval)
						resolve()
					}
				}, 100)
			})
			
			this.isDrawing = false
			this.isAnimating = false
			
			// 显示确认弹窗
			this.showConfirmModal = true
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
				// 模拟根据地址搜索附近美食
				await this.searchNearbyFoodByAddress(this.manualLocation)
			} catch (e) {
				console.error('搜索失败', e)
				uni.showToast({
					title: '搜索失败，请重试',
					icon: 'none'
				})
			} finally {
				this.isSearchingLocation = false
			}
		},
		
		async searchNearbyFoodByAddress(address) {
			// 模拟根据地址搜索附近美食的延迟
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// 根据不同位置返回不同的模拟数据
			let mockNearbyFoods = []
			
			if (address.includes('学校') || address.includes('大学')) {
				mockNearbyFoods = [
					{ name: '学生食堂', distance: '100m', price: 12, type: '日常', tags: ['午餐', '便宜'] },
					{ name: '麦当劳', distance: '200m', price: 25, type: '日常', tags: ['快餐'] },
					{ name: '黄焖鸡米饭', distance: '150m', price: 18, type: '日常', tags: ['午餐'] },
					{ name: '兰州拉面', distance: '300m', price: 16, type: '日常', tags: ['面食'] }
				]
			} else if (address.includes('公司') || address.includes('办公')) {
				mockNearbyFoods = [
					{ name: '商务套餐', distance: '50m', price: 35, type: '日常', tags: ['午餐', '商务'] },
					{ name: '日式料理', distance: '200m', price: 68, type: '大餐', tags: ['日料'] },
					{ name: '咖啡厅', distance: '100m', price: 28, type: '日常', tags: ['饮品', '轻食'] },
					{ name: '川菜馆', distance: '400m', price: 45, type: '日常', tags: ['川菜'] }
				]
			} else if (address.includes('商场') || address.includes('购物')) {
				mockNearbyFoods = [
					{ name: '海底捞', distance: '200m', price: 120, type: '大餐', tags: ['火锅'] },
					{ name: '肯德基', distance: '100m', price: 30, type: '日常', tags: ['快餐'] },
					{ name: '星巴克', distance: '150m', price: 35, type: '日常', tags: ['饮品'] },
					{ name: '西贝莜面村', distance: '300m', price: 80, type: '大餐', tags: ['西北菜'] }
				]
			} else {
				// 默认美食
				mockNearbyFoods = [
					{ name: '兰州拉面', distance: '200m', price: 18, type: '日常', tags: ['午餐', '面食'] },
					{ name: '沙县小吃', distance: '350m', price: 15, type: '日常', tags: ['午餐'] },
					{ name: '黄焖鸡米饭', distance: '400m', price: 20, type: '日常', tags: ['午餐'] },
					{ name: '麦当劳', distance: '500m', price: 35, type: '日常', tags: ['快餐'] }
				]
			}
			
			this.nearbyFoods = mockNearbyFoods
			
			uni.showToast({
				title: `已找到 ${address} 附近美食`,
				icon: 'success'
			})
		},
		
		async searchNearbyFoodByLocation(location) {
			// 模拟附近美食数据（实际项目中应该调用地图API）
			const mockNearbyFoods = [
				{ name: '兰州拉面', distance: '200m', price: 18, type: '日常', tags: ['午餐', '面食'] },
				{ name: '沙县小吃', distance: '350m', price: 15, type: '日常', tags: ['午餐'] },
				{ name: '麦当劳', distance: '500m', price: 35, type: '日常', tags: ['快餐'] },
				{ name: '海底捞', distance: '800m', price: 120, type: '大餐', tags: ['火锅'] },
				{ name: '星巴克', distance: '1.2km', price: 25, type: '日常', tags: ['饮品'] }
			]
			
			this.nearbyFoods = mockNearbyFoods
			
			uni.showToast({
				title: '已找到附近美食',
				icon: 'success'
			})
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
	color: #999;
	border: 1rpx solid #eee;
	font-size: 22rpx;
	font-weight: normal;
	padding: 8rpx 16rpx;
	box-shadow: none;
	opacity: 0.7;
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
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 248, 225, 0.3));
	border: 1rpx solid rgba(255, 183, 77, 0.3);
	backdrop-filter: blur(10rpx);
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 40rpx;
}

.basic-filter {
	background: linear-gradient(145deg, #FFFFFF, #FFF8E1);
	border-radius: 20rpx;
	padding: 25rpx;
	border: 2rpx solid rgba(255, 183, 77, 0.3);
	margin-bottom: 20rpx;
}

.filter-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
	flex-wrap: nowrap;
}

.filter-item {
	flex: 1;
	min-width: 160rpx;
	margin-bottom: 0;
}

.filter-label {
	color: #5D4037;
	font-size: 24rpx;
	font-weight: 600;
	display: block;
	margin-bottom: 8rpx;
}

.filter-picker {
	width: 100%;
}

.picker-content {
	background: rgba(255, 255, 255, 0.8);
	border: 1rpx solid rgba(255, 183, 77, 0.5);
	border-radius: 15rpx;
	padding: 10rpx 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #5D4037;
	font-size: 22rpx;
}

.picker-arrow {
	color: #FF8A65;
	font-size: 18rpx;
}

.advanced-toggle {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	border: none;
	border-radius: 20rpx;
	padding: 12rpx 16rpx;
	font-size: 22rpx;
	display: flex;
	align-items: center;
	white-space: nowrap;
	flex-shrink: 0;
	gap: 8rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 138, 101, 0.3);
}

.toggle-arrow {
	transition: transform 0.3s ease;
}

.toggle-arrow.active {
	transform: rotate(180deg);
}

.advanced-filter {
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(255, 183, 77, 0.3);
}

.price-filter .price-range-container {
	background: rgba(255, 255, 255, 0.5);
	border-radius: 15rpx;
	padding: 20rpx;
	margin-top: 10rpx;
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

.modal-header {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	padding: 30rpx;
	text-align: center;
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
	padding: 20rpx;
	border-radius: 15rpx;
	font-size: 28rpx;
	border: none;
	font-weight: 600;
	transition: all 0.3s ease;
}

.cancel-btn {
	background: linear-gradient(45deg, #9E9E9E, #BDBDBD);
	color: white;
	box-shadow: 0 4rpx 12rpx rgba(158, 158, 158, 0.3);
}

.confirm-btn {
	background: linear-gradient(45deg, #FF8A65, #FF7043);
	color: white;
	box-shadow: 0 4rpx 12rpx rgba(255, 138, 101, 0.4);
}

.modal-btn:active {
	transform: scale(0.95);
}
</style>
