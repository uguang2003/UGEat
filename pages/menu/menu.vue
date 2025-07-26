<template>
	<view class="container">
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="toolbar-row">
				<button class="btn add-btn" @click="showAddModal = true">
					<text class="btn-icon">+</text>
					<text class="btn-text">添加菜品</text>
				</button>
				<button class="btn recipe-btn" @click="showRecipeModal = true">
					<text class="btn-icon">📖</text>
					<text class="btn-text">UG秘制菜谱</text>
				</button>
			</view>
			<view class="toolbar-row">
				<button class="btn import-btn" @click="showImportModal = true">
					<text class="btn-icon">📥</text>
					<text class="btn-text">导入</text>
				</button>
				<button class="btn export-btn" @click="showExportModal = true">
					<text class="btn-icon">📤</text>
					<text class="btn-text">导出</text>
				</button>
				<button class="btn reset-btn" @click="resetMenu">
					<text class="btn-icon">🔄</text>
					<text class="btn-text">重置</text>
				</button>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input class="search-input" 
				   placeholder="搜索菜品..." 
				   v-model="searchKeyword" 
				   @input="onSearch" />
		</view>
		
		<!-- 菜品列表 -->
		<scroll-view class="menu-list" scroll-y>
			<view v-if="filteredMenuList.length === 0" class="empty-tip">
				暂无菜品，点击添加菜品开始管理你的粮库吧！
			</view>
			<view v-else>
				<view class="menu-item" v-for="item in filteredMenuList" :key="item.id">
					<view class="item-content" @click="editMenuItem(item)">
						<view class="item-header">
							<text class="item-name">{{ item.name }}</text>
							<text class="item-price">¥{{ item.price }}</text>
						</view>
						<view class="item-details">
							<view class="item-meal-times">
								<text class="meal-time-tag" v-for="time in item.mealTimes" :key="time">
									{{ time }}
								</text>
							</view>
							<text class="item-type">{{ item.type }}</text>
						</view>
						<view class="item-tags" v-if="item.tags && item.tags.length > 0">
							<text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
						</view>
					</view>
					<view class="item-actions">
						<button class="action-btn edit-btn" @click.stop="editMenuItem(item)">
							<text class="action-icon">✏️</text>
						</button>
						<button class="action-btn delete-btn" @click.stop="deleteMenuItem(item.id)">
							<text class="action-icon">🗑️</text>
						</button>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 添加/编辑菜品弹窗 -->
		<view class="modal-overlay" v-if="showAddModal || showEditModal" @click="hideModals">
			<view class="modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ showEditModal ? '编辑菜品' : '添加菜品' }}</text>
					<text class="close-btn" @click="hideModals">×</text>
				</view>
				<view class="modal-body">
					<!-- 菜品名称 -->
					<view class="form-group">
						<text class="form-label">菜品名称</text>
						<input class="form-input" 
							   placeholder="请输入菜品名称" 
							   v-model="editingItem.name" />
					</view>
					
					<!-- 价格 -->
					<view class="form-group">
						<text class="form-label">价格</text>
						<input class="form-input" 
							   type="number" 
							   placeholder="请输入价格" 
							   v-model.number="editingItem.price" />
					</view>
					
					<!-- 用餐时段（多选） -->
					<view class="form-group">
						<text class="form-label">用餐时段</text>
						<view class="checkbox-group">
							<view class="checkbox-item" 
								  v-for="time in mealTimeOptions" 
								  :key="time"
								  :class="{ 'active': editingItem.mealTimes.includes(time) }"
								  @click="toggleMealTime(time)">
								<text class="checkbox-text">{{ time }}</text>
							</view>
						</view>
					</view>
					
					<!-- 餐食类型（单选） -->
					<view class="form-group">
						<text class="form-label">餐食类型</text>
						<view class="radio-group">
							<view class="radio-item" 
								  v-for="type in mealTypeOptions" 
								  :key="type"
								  :class="{ 'active': editingItem.type === type }"
								  @click="editingItem.type = type">
								<text class="radio-text">{{ type }}</text>
							</view>
						</view>
					</view>
					
					<!-- 菜品标签（点击弹窗多选） -->
					<view class="form-group">
						<text class="form-label">菜品标签</text>
						<view class="tag-selector" @click="showTagModal = true">
							<view class="selected-tags" v-if="editingItem.tags.length > 0">
								<text class="selected-tag" v-for="tag in editingItem.tags" :key="tag">
									{{ tag }}
								</text>
							</view>
							<text class="placeholder" v-else>点击选择标签</text>
							<text class="arrow">></text>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="hideModals">取消</button>
					<button class="btn-confirm" @click="saveMenuItem">保存</button>
				</view>
			</view>
		</view>
		
		<!-- 标签选择弹窗 -->
		<view class="modal-overlay" v-if="showTagModal" @click="showTagModal = false">
			<view class="modal small" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择标签</text>
					<text class="close-btn" @click="showTagModal = false">×</text>
				</view>
				<view class="modal-body">
					<view class="tag-grid">
						<view class="tag-option" 
							  v-for="tag in allTags" 
							  :key="tag"
							  :class="{ 'selected': editingItem.tags.includes(tag) }"
							  @click="toggleTag(tag)">
							{{ tag }}
						</view>
					</view>
					<view class="custom-tag-section">
						<text class="section-title">自定义标签</text>
						<view class="custom-tag-input">
							<input class="form-input" 
								   placeholder="输入自定义标签" 
								   v-model="customTag" 
								   @confirm="addCustomTag" />
							<button class="add-tag-btn" @click="addCustomTag">添加</button>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn-confirm" @click="showTagModal = false">确定</button>
				</view>
			</view>
		</view>
		
		<!-- UG秘制菜谱弹窗 -->
		<view class="modal-overlay" v-if="showRecipeModal" @click="showRecipeModal = false">
			<view class="modal large recipe-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">UG秘制菜谱</text>
					<text class="close-btn" @click="showRecipeModal = false">×</text>
				</view>
				<view class="recipe-tabs">
					<view class="tab-header">
						<view class="tab-item" 
							  v-for="tab in recipeTabs" 
							  :key="tab.key"
							  :class="{ 'active': activeTab === tab.key }"
							  @click="activeTab = tab.key">
							{{ tab.name }}
						</view>
					</view>
					<view class="tab-content">
						<!-- 菜谱内容 -->
						<scroll-view class="recipe-list" scroll-y v-if="activeTab !== 'history'">
							<view class="recipe-category" v-for="(recipes, category) in recipesByCategory" :key="category">
								<view class="category-header">
									<text class="category-name">{{ getCategoryName(category) }}</text>
									<text class="category-count">{{ recipes.length }}道菜</text>
								</view>
								<view class="recipe-items">
									<view class="recipe-item" v-for="recipe in recipes" :key="recipe.name">
										<view class="recipe-info">
											<text class="recipe-name">{{ recipe.name }}</text>
											<text class="recipe-price">¥{{ recipe.price }}</text>
											<text class="recipe-type">{{ recipe.type }}</text>
										</view>
										<button class="add-recipe-btn" @click="addRecipeToMenu(recipe)">
											添加
										</button>
									</view>
								</view>
							</view>
						</scroll-view>
						
						<!-- 历史菜单 -->
						<scroll-view class="history-list" scroll-y v-if="activeTab === 'history'">
							<view v-if="menuHistory.length === 0" class="empty-tip">
								暂无历史菜单
							</view>
							<view v-else>
								<view class="history-item" v-for="(history, index) in menuHistory" :key="index">
									<view class="history-header">
										<text class="history-title">历史菜单 {{ index + 1 }}</text>
										<text class="history-date">{{ history.date }}</text>
									</view>
									<view class="history-preview">
										<text class="preview-text">{{ history.menuList.length }}道菜品</text>
									</view>
									<view class="history-actions">
										<button class="restore-btn" @click="restoreHistoryMenu(history)">
											恢复
										</button>
										<button class="delete-history-btn" @click="deleteHistory(index)">
											删除
										</button>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="showRecipeModal = false">关闭</button>
					<button class="btn-confirm" v-if="activeTab !== 'history'" @click="importCurrentCategory">
						一键导入当前分类
					</button>
				</view>
			</view>
		</view>
		
		<!-- 导入导出弹窗 -->
		<view class="modal-overlay" v-if="showImportModal" @click="showImportModal = false">
			<view class="modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">导入菜单</text>
					<text class="close-btn" @click="showImportModal = false">×</text>
				</view>
				<view class="modal-body">
					<view class="import-tip">
						请输入JSON格式的菜单数据，格式示例：
					</view>
					<view class="import-example">
						[{"name":"菜品名","mealTimes":["午餐"],"price":15,"type":"日常","tags":["快餐"]}]
					</view>
					<textarea class="import-textarea" 
							  placeholder="粘贴菜单数据..." 
							  v-model="importData"></textarea>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="showImportModal = false">取消</button>
					<button class="btn-confirm" @click="importMenu">导入</button>
				</view>
			</view>
		</view>
		
		<view class="modal-overlay" v-if="showExportModal" @click="showExportModal = false">
			<view class="modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">导出菜单</text>
					<text class="close-btn" @click="showExportModal = false">×</text>
				</view>
				<view class="modal-body">
					<textarea class="export-textarea" 
							  readonly 
							  :value="exportData"></textarea>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="showExportModal = false">关闭</button>
					<button class="btn-confirm" @click="copyExportData">复制</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Storage from '@/utils/storage.js'

// 导入菜谱数据
const recipeData = {
	breakfast: [
		{ name: '小笼包', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['面食', '营养'] },
		{ name: '豆浆油条', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['快餐', '营养'] },
		{ name: '煎饼果子', mealTimes: ['早餐'], price: 10, type: '日常', tags: ['快餐', '面食'] },
		{ name: '包子', mealTimes: ['早餐'], price: 5, type: '日常', tags: ['面食'] },
		{ name: '豆腐脑', mealTimes: ['早餐'], price: 4, type: '日常', tags: ['清淡'] },
		{ name: '胡辣汤', mealTimes: ['早餐'], price: 6, type: '日常', tags: ['辛辣'] },
		{ name: '手抓饼', mealTimes: ['早餐'], price: 8, type: '日常', tags: ['快餐'] },
		{ name: '鸡蛋灌饼', mealTimes: ['早餐'], price: 9, type: '日常', tags: ['快餐'] },
		{ name: '蒸蛋羹', mealTimes: ['早餐'], price: 7, type: '日常', tags: ['清淡'] },
		{ name: '稀饭配咸菜', mealTimes: ['早餐'], price: 5, type: '日常', tags: ['清淡'] }
	],
	lunch: [
		{ name: '蛋炒饭', mealTimes: ['午餐'], price: 15, type: '日常', tags: ['快餐'] },
		{ name: '麻婆豆腐', mealTimes: ['午餐'], price: 18, type: '日常', tags: ['辛辣'] },
		{ name: '宫保鸡丁', mealTimes: ['午餐'], price: 25, type: '日常', tags: ['辛辣'] },
		{ name: '红烧肉', mealTimes: ['午餐'], price: 35, type: '大餐', tags: ['营养'] },
		{ name: '水煮鱼', mealTimes: ['午餐'], price: 58, type: '大餐', tags: ['辛辣', '海鲜'] },
		{ name: '糖醋里脊', mealTimes: ['午餐'], price: 28, type: '日常', tags: ['酸甜'] },
		{ name: '回锅肉', mealTimes: ['午餐'], price: 26, type: '日常', tags: ['辛辣'] },
		{ name: '青椒肉丝', mealTimes: ['午餐'], price: 20, type: '日常', tags: ['营养'] },
		{ name: '鱼香肉丝', mealTimes: ['午餐'], price: 22, type: '日常', tags: ['酸甜'] },
		{ name: '土豆丝', mealTimes: ['午餐'], price: 12, type: '日常', tags: ['清淡'] }
	],
	dinner: [
		{ name: '火锅', mealTimes: ['晚餐'], price: 80, type: '大餐', tags: ['辛辣'] },
		{ name: '海底捞', mealTimes: ['晚餐'], price: 120, type: '大餐', tags: ['辛辣'] },
		{ name: '麦当劳', mealTimes: ['晚餐'], price: 35, type: '日常', tags: ['快餐', '西式'] },
		{ name: '肯德基', mealTimes: ['晚餐'], price: 40, type: '日常', tags: ['快餐', '西式'] },
		{ name: '日式料理', mealTimes: ['晚餐'], price: 88, type: '大餐', tags: ['日料', '海鲜'] },
		{ name: '韩式烤肉', mealTimes: ['晚餐'], price: 75, type: '大餐', tags: ['烧烤'] },
		{ name: '披萨', mealTimes: ['晚餐'], price: 45, type: '日常', tags: ['西式'] },
		{ name: '汉堡', mealTimes: ['晚餐'], price: 25, type: '日常', tags: ['快餐'] },
		{ name: '炸鸡', mealTimes: ['晚餐'], price: 30, type: '日常', tags: ['快餐'] },
		{ name: '烤鸭', mealTimes: ['晚餐'], price: 68, type: '大餐', tags: ['营养'] }
	],
	latenight: [
		{ name: '泡面', mealTimes: ['夜宵'], price: 5, type: '日常', tags: ['快餐', '面食'] },
		{ name: '烧烤', mealTimes: ['夜宵'], price: 40, type: '大餐', tags: ['烧烤'] },
		{ name: '麻辣烫', mealTimes: ['夜宵'], price: 20, type: '日常', tags: ['辛辣'] },
		{ name: '关东煮', mealTimes: ['夜宵'], price: 15, type: '日常', tags: ['清淡'] },
		{ name: '煎饺', mealTimes: ['夜宵'], price: 12, type: '日常', tags: ['快餐'] },
		{ name: '小龙虾', mealTimes: ['夜宵'], price: 68, type: '大餐', tags: ['海鲜', '辛辣'] },
		{ name: '炸串', mealTimes: ['夜宵'], price: 25, type: '日常', tags: ['快餐'] },
		{ name: '臭豆腐', mealTimes: ['夜宵'], price: 8, type: '日常', tags: ['快餐'] },
		{ name: '烤冷面', mealTimes: ['夜宵'], price: 10, type: '日常', tags: ['面食'] },
		{ name: '铁板鱿鱼', mealTimes: ['夜宵'], price: 15, type: '日常', tags: ['海鲜'] }
	],
	snacks: [
		{ name: '薯片', mealTimes: ['零食'], price: 8, type: '日常', tags: ['快餐'] },
		{ name: '奶茶', mealTimes: ['零食'], price: 15, type: '日常', tags: ['甜品', '饮品'] },
		{ name: '蛋糕', mealTimes: ['零食'], price: 30, type: '大餐', tags: ['甜品'] },
		{ name: '冰淇淋', mealTimes: ['零食'], price: 12, type: '日常', tags: ['甜品'] },
		{ name: '爆米花', mealTimes: ['零食'], price: 10, type: '日常', tags: ['快餐'] },
		{ name: '巧克力', mealTimes: ['零食'], price: 15, type: '日常', tags: ['甜品'] },
		{ name: '坚果', mealTimes: ['零食'], price: 20, type: '日常', tags: ['营养'] },
		{ name: '果汁', mealTimes: ['零食'], price: 8, type: '日常', tags: ['饮品'] },
		{ name: '咖啡', mealTimes: ['零食'], price: 25, type: '日常', tags: ['饮品'] },
		{ name: '饼干', mealTimes: ['零食'], price: 6, type: '日常', tags: ['甜品'] }
	]
}

export default {
	data() {
		return {
			// 菜单数据
			menuList: [],
			filteredMenuList: [],
			searchKeyword: '',
			
			// 弹窗状态
			showAddModal: false,
			showEditModal: false,
			showTagModal: false,
			showRecipeModal: false,
			showImportModal: false,
			showExportModal: false,
			
			// 编辑状态
			editingItem: {
				id: null,
				name: '',
				mealTimes: [],
				price: 0,
				type: '日常',
				tags: []
			},
			
			// 选项数据
			mealTimeOptions: ['早餐', '午餐', '晚餐', '夜宵', '零食'],
			mealTypeOptions: ['日常', '大餐'],
			allTags: ['辛辣', '清淡', '甜品', '海鲜', '烧烤', '快餐', '西式', '营养', '饮品', '面食', '异国', '日料', '酸甜'],
			customTag: '',
			
			// 菜谱相关
			activeTab: 'breakfast',
			recipeTabs: [
				{ key: 'breakfast', name: '早餐' },
				{ key: 'lunch', name: '午餐' },
				{ key: 'dinner', name: '晚餐' },
				{ key: 'latenight', name: '夜宵' },
				{ key: 'snacks', name: '零食' },
				{ key: 'history', name: '历史菜单' }
			],
			recipeData: recipeData,
			menuHistory: [],
			
			// 导入导出
			importData: '',
			exportData: ''
		}
	},
	
	computed: {
		recipesByCategory() {
			if (this.activeTab === 'history') return {}
			return { [this.activeTab]: this.recipeData[this.activeTab] || [] }
		}
	},
	
	onLoad() {
		this.loadMenuData()
		this.loadCustomTags()
		this.loadMenuHistory()
	},
	
	methods: {
		// 加载菜单数据
		loadMenuData() {
			this.menuList = Storage.getMenuList()
			this.filteredMenuList = [...this.menuList]
		},
		
		// 搜索
		onSearch() {
			if (!this.searchKeyword.trim()) {
				this.filteredMenuList = [...this.menuList]
			} else {
				const keyword = this.searchKeyword.toLowerCase()
				this.filteredMenuList = this.menuList.filter(item => {
					return item.name.toLowerCase().includes(keyword) ||
						   (item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword)))
				})
			}
		},
		
		// 显示添加菜品弹窗
		showAddMenuItem() {
			this.resetEditingItem()
			this.showAddModal = true
		},
		
		// 编辑菜品
		editMenuItem(item) {
			this.editingItem = {
				id: item.id,
				name: item.name,
				mealTimes: [...(item.mealTimes || [])],
				price: item.price,
				type: item.type || '日常',
				tags: [...(item.tags || [])]
			}
			this.showEditModal = true
		},
		
		// 删除菜品
		deleteMenuItem(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这个菜品吗？',
				success: (res) => {
					if (res.confirm) {
						this.menuList = Storage.deleteMenuItem(id)
						this.filteredMenuList = [...this.menuList]
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
					}
				}
			})
		},
		
		// 保存菜品
		saveMenuItem() {
			if (!this.editingItem.name.trim()) {
				uni.showToast({
					title: '请输入菜品名称',
					icon: 'none'
				})
				return
			}
			
			if (!this.editingItem.price || this.editingItem.price <= 0) {
				uni.showToast({
					title: '请输入正确的价格',
					icon: 'none'
				})
				return
			}
			
			if (this.editingItem.mealTimes.length === 0) {
				uni.showToast({
					title: '请至少选择一个用餐时段',
					icon: 'none'
				})
				return
			}
			
			if (this.showEditModal) {
				// 编辑
				Storage.updateMenuItem(this.editingItem)
				uni.showToast({
					title: '更新成功',
					icon: 'success'
				})
			} else {
				// 添加
				Storage.addMenuItem({ ...this.editingItem })
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
			}
			
			this.loadMenuData()
			this.hideModals()
		},
		
		// 重置编辑项
		resetEditingItem() {
			this.editingItem = {
				id: null,
				name: '',
				mealTimes: [],
				price: 0,
				type: '日常',
				tags: []
			}
		},
		
		// 隐藏弹窗
		hideModals() {
			this.showAddModal = false
			this.showEditModal = false
			this.showTagModal = false
			this.resetEditingItem()
		},
		
		// 切换用餐时段
		toggleMealTime(time) {
			const index = this.editingItem.mealTimes.indexOf(time)
			if (index > -1) {
				this.editingItem.mealTimes.splice(index, 1)
			} else {
				this.editingItem.mealTimes.push(time)
			}
		},
		
		// 切换标签
		toggleTag(tag) {
			const index = this.editingItem.tags.indexOf(tag)
			if (index > -1) {
				this.editingItem.tags.splice(index, 1)
			} else {
				this.editingItem.tags.push(tag)
			}
		},
		
		// 添加自定义标签
		addCustomTag() {
			if (!this.customTag.trim()) return
			
			if (!this.allTags.includes(this.customTag)) {
				this.allTags.push(this.customTag)
				this.saveCustomTags()
			}
			
			if (!this.editingItem.tags.includes(this.customTag)) {
				this.editingItem.tags.push(this.customTag)
			}
			
			this.customTag = ''
		},
		
		// 保存自定义标签
		saveCustomTags() {
			uni.setStorageSync('customTags', this.allTags)
		},
		
		// 加载自定义标签
		loadCustomTags() {
			const customTags = uni.getStorageSync('customTags')
			if (customTags && customTags.length > 0) {
				this.allTags = [...new Set([...this.allTags, ...customTags])]
			}
		},
		
		// 获取分类名称
		getCategoryName(category) {
			const names = {
				breakfast: '早餐',
				lunch: '午餐',
				dinner: '晚餐',
				latenight: '夜宵',
				snacks: '零食'
			}
			return names[category] || category
		},
		
		// 添加菜谱到菜单
		addRecipeToMenu(recipe) {
			const newItem = {
				name: recipe.name,
				mealTimes: recipe.mealTimes || [],
				price: recipe.price,
				type: recipe.type,
				tags: recipe.tags || []
			}
			
			Storage.addMenuItem(newItem)
			this.loadMenuData()
			
			uni.showToast({
				title: '添加成功',
				icon: 'success'
			})
		},
		
		// 一键导入当前分类
		importCurrentCategory() {
			this.saveCurrentMenuToHistory()
			
			const recipes = this.recipeData[this.activeTab] || []
			
			// 清空当前菜单
			Storage.setMenuList([])
			
			// 导入当前分类的所有菜品
			recipes.forEach(recipe => {
				const newItem = {
					name: recipe.name,
					mealTimes: recipe.mealTimes || [],
					price: recipe.price,
					type: recipe.type,
					tags: recipe.tags || []
				}
				Storage.addMenuItem(newItem)
			})
			
			this.loadMenuData()
			this.showRecipeModal = false
			
			uni.showToast({
				title: `成功导入${recipes.length}道菜品`,
				icon: 'success'
			})
		},
		
		// 保存当前菜单到历史
		saveCurrentMenuToHistory() {
			if (this.menuList.length === 0) return
			
			const history = {
				date: new Date().toLocaleString(),
				menuList: [...this.menuList]
			}
			
			this.menuHistory.unshift(history)
			
			// 只保留最近10个历史
			if (this.menuHistory.length > 10) {
				this.menuHistory = this.menuHistory.slice(0, 10)
			}
			
			uni.setStorageSync('menuHistory', this.menuHistory)
		},
		
		// 加载菜单历史
		loadMenuHistory() {
			this.menuHistory = uni.getStorageSync('menuHistory') || []
		},
		
		// 恢复历史菜单
		restoreHistoryMenu(history) {
			uni.showModal({
				title: '确认恢复',
				content: '恢复历史菜单将替换当前菜单，确定继续吗？',
				success: (res) => {
					if (res.confirm) {
						this.saveCurrentMenuToHistory()
						Storage.setMenuList(history.menuList)
						this.loadMenuData()
						
						uni.showToast({
							title: '恢复成功',
							icon: 'success'
						})
					}
				}
			})
		},
		
		// 删除历史
		deleteHistory(index) {
			this.menuHistory.splice(index, 1)
			uni.setStorageSync('menuHistory', this.menuHistory)
		},
		
		// 重置菜单
		resetMenu() {
			uni.showModal({
				title: '确认重置',
				content: '重置后将恢复默认菜单，确定继续吗？',
				success: (res) => {
					if (res.confirm) {
						this.saveCurrentMenuToHistory()
						Storage.resetToDefault()
						this.loadMenuData()
						
						uni.showToast({
							title: '重置成功',
							icon: 'success'
						})
					}
				}
			})
		},
		
		// 导入菜单
		importMenu() {
			if (!this.importData.trim()) {
				uni.showToast({
					title: '请输入导入数据',
					icon: 'none'
				})
				return
			}
			
			try {
				const data = JSON.parse(this.importData)
				if (!Array.isArray(data)) {
					throw new Error('数据格式错误')
				}
				
				// 验证数据格式
				for (let item of data) {
					if (!item.name || !item.mealTimes || !item.price || !item.type) {
						throw new Error('数据字段不完整')
					}
				}
				
				this.saveCurrentMenuToHistory()
				Storage.setMenuList(data)
				this.loadMenuData()
				this.showImportModal = false
				this.importData = ''
				
				uni.showToast({
					title: '导入成功',
					icon: 'success'
				})
			} catch (error) {
				uni.showToast({
					title: '导入失败：' + error.message,
					icon: 'none'
				})
			}
		},
		
		// 导出菜单
		exportMenu() {
			this.exportData = JSON.stringify(this.menuList, null, 2)
		},
		
		// 复制导出数据
		copyExportData() {
			uni.setClipboardData({
				data: this.exportData,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					})
				}
			})
		}
	},
	
	watch: {
		showExportModal(val) {
			if (val) {
				this.exportMenu()
			}
		}
	}
}
</script>

<style scoped>
.container {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	min-height: 100vh;
	padding: 20rpx;
}

/* 工具栏 */
.toolbar {
	background: white;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.toolbar-row {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.toolbar-row:last-child {
	margin-bottom: 0;
}

.btn {
	flex: 1;
	background: linear-gradient(135deg, #FF6B6B, #FF8E53);
	border: none;
	border-radius: 15rpx;
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	color: white;
	font-size: 24rpx;
	box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.3);
	transition: all 0.3s ease;
}

.btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.4);
}

.btn-icon {
	font-size: 32rpx;
}

.btn-text {
	font-size: 22rpx;
	font-weight: 600;
}

.recipe-btn {
	background: linear-gradient(135deg, #4ECDC4, #44A08D);
	box-shadow: 0 4rpx 15rpx rgba(78, 205, 196, 0.3);
}

.import-btn {
	background: linear-gradient(135deg, #45B7D1, #96C93D);
	box-shadow: 0 4rpx 15rpx rgba(69, 183, 209, 0.3);
}

.export-btn {
	background: linear-gradient(135deg, #F093FB, #F5576C);
	box-shadow: 0 4rpx 15rpx rgba(240, 147, 251, 0.3);
}

.reset-btn {
	background: linear-gradient(135deg, #FD79A8, #FDCB6E);
	box-shadow: 0 4rpx 15rpx rgba(253, 121, 168, 0.3);
}

/* 搜索栏 */
.search-bar {
	background: white;
	border-radius: 20rpx;
	padding: 20rpx 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.search-input {
	width: 100%;
	padding: 20rpx 0;
	font-size: 28rpx;
	border: none;
	background: transparent;
}

/* 菜品列表 */
.menu-list {
	height: calc(100vh - 400rpx);
}

.empty-tip {
	text-align: center;
	padding: 100rpx 20rpx;
	color: white;
	font-size: 28rpx;
}

.menu-item {
	background: white;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.menu-item:active {
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

.item-content {
	flex: 1;
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.item-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #333;
}

.item-price {
	font-size: 28rpx;
	font-weight: 600;
	color: #FF6B6B;
}

.item-details {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.item-meal-times {
	display: flex;
	gap: 8rpx;
}

.meal-time-tag {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 10rpx;
}

.item-type {
	font-size: 24rpx;
	color: #4ECDC4;
	font-weight: 500;
}

.item-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.tag {
	background: rgba(255, 107, 107, 0.1);
	color: #FF6B6B;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 8rpx;
	border: 1rpx solid rgba(255, 107, 107, 0.2);
}

.item-actions {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-left: 20rpx;
}

.action-btn {
	width: 60rpx;
	height: 60rpx;
	border: none;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	transition: all 0.3s ease;
}

.edit-btn {
	background: linear-gradient(135deg, #4ECDC4, #44A08D);
	color: white;
}

.delete-btn {
	background: linear-gradient(135deg, #FF6B6B, #FF8E53);
	color: white;
}

.action-btn:active {
	transform: scale(0.9);
}

/* 弹窗样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal {
	background: white;
	width: 90%;
	max-width: 600rpx;
	border-radius: 20rpx;
	overflow: hidden;
	max-height: 80vh;
}

.modal.large {
	max-width: 700rpx;
	height: 80vh;
}

.modal.small {
	max-width: 500rpx;
}

.modal-header {
	background: linear-gradient(135deg, #667eea, #764ba2);
	color: white;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
}

.close-btn {
	font-size: 40rpx;
	cursor: pointer;
}

.modal-body {
	padding: 40rpx;
	max-height: 500rpx;
	overflow-y: auto;
}

.modal-footer {
	padding: 30rpx;
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
	background: #f8f9fa;
}

/* 表单样式 */
.form-group {
	margin-bottom: 30rpx;
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
	font-weight: 600;
}

.form-input {
	width: 100%;
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #333;
	transition: all 0.3s ease;
	box-sizing: border-box;
}

.form-input:focus {
	border-color: #667eea;
	background: #fff;
	box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
}

.checkbox-group, .radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
}

.checkbox-item, .radio-item {
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	color: #666;
	padding: 15rpx 25rpx;
	border-radius: 20rpx;
	font-size: 26rpx;
	transition: all 0.3s ease;
	cursor: pointer;
}

.checkbox-item.active, .radio-item.active {
	background: #667eea;
	border-color: #667eea;
	color: white;
}

.tag-selector {
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	border-radius: 12rpx;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: all 0.3s ease;
	cursor: pointer;
}

.tag-selector:active {
	border-color: #667eea;
	background: #fff;
}

.selected-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.selected-tag {
	background: #667eea;
	color: white;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 10rpx;
}

.placeholder {
	color: #999;
	font-size: 28rpx;
}

.arrow {
	color: #999;
	font-size: 24rpx;
}

.btn-cancel, .btn-confirm {
	padding: 24rpx 48rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
	cursor: pointer;
}

.btn-cancel {
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	color: #666;
}

.btn-confirm {
	background: #667eea;
	color: white;
}

/* 标签选择弹窗 */
.tag-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 15rpx;
	margin-bottom: 30rpx;
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
	background: #667eea;
	border-color: #667eea;
	color: white;
}

.custom-tag-section {
	border-top: 1rpx solid #e9ecef;
	padding-top: 30rpx;
}

.section-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
	font-weight: 600;
}

.custom-tag-input {
	display: flex;
	gap: 15rpx;
}

.add-tag-btn {
	background: #667eea;
	color: white;
	border: none;
	border-radius: 12rpx;
	padding: 24rpx 30rpx;
	font-size: 26rpx;
	white-space: nowrap;
}

/* 菜谱弹窗 */
.recipe-modal {
	display: flex;
	flex-direction: column;
}

.recipe-tabs {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.tab-header {
	display: flex;
	background: #f8f9fa;
	border-bottom: 1rpx solid #e9ecef;
}

.tab-item {
	flex: 1;
	padding: 20rpx;
	text-align: center;
	font-size: 26rpx;
	color: #666;
	cursor: pointer;
	transition: all 0.3s ease;
}

.tab-item.active {
	background: white;
	color: #667eea;
	border-bottom: 3rpx solid #667eea;
}

.tab-content {
	flex: 1;
	overflow: hidden;
}

.recipe-list, .history-list {
	height: 400rpx;
	padding: 20rpx;
}

.recipe-category {
	margin-bottom: 30rpx;
}

.category-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 1rpx solid #e9ecef;
	margin-bottom: 15rpx;
}

.category-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.category-count {
	font-size: 24rpx;
	color: #999;
}

.recipe-items {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.recipe-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	border: 1rpx solid #e9ecef;
}

.recipe-info {
	flex: 1;
}

.recipe-name {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.recipe-price {
	font-size: 24rpx;
	color: #FF6B6B;
	margin-right: 15rpx;
}

.recipe-type {
	font-size: 24rpx;
	color: #4ECDC4;
}

.add-recipe-btn {
	background: #667eea;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 12rpx 20rpx;
	font-size: 24rpx;
}

/* 历史菜单 */
.history-item {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 15rpx;
	border: 1rpx solid #e9ecef;
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.history-title {
	font-size: 26rpx;
	color: #333;
	font-weight: 600;
}

.history-date {
	font-size: 22rpx;
	color: #999;
}

.history-preview {
	margin-bottom: 15rpx;
}

.preview-text {
	font-size: 24rpx;
	color: #666;
}

.history-actions {
	display: flex;
	gap: 15rpx;
}

.restore-btn {
	background: #4ECDC4;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	flex: 1;
}

.delete-history-btn {
	background: #FF6B6B;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	flex: 1;
}

/* 导入导出 */
.import-tip {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 15rpx;
}

.import-example {
	background: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 15rpx;
	font-size: 22rpx;
	color: #333;
	margin-bottom: 20rpx;
	font-family: monospace;
	word-break: break-all;
}

.import-textarea, .export-textarea {
	width: 100%;
	height: 300rpx;
	padding: 20rpx;
	border: 1rpx solid #e9ecef;
	border-radius: 10rpx;
	font-size: 24rpx;
	box-sizing: border-box;
	font-family: monospace;
	resize: none;
}
</style>
