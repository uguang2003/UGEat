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
					<text class="btn-text">导入菜单</text>
				</button>
				<button class="btn export-btn" @click="exportMenu">
					<text class="btn-icon">📤</text>
					<text class="btn-text">导出菜单</text>
				</button>
				<button class="btn reset-btn" @click="resetMenu">
					<text class="btn-icon">🔄</text>
					<text class="btn-text">恢复默认</text>
				</button>
			</view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input class="search-input" 
				   placeholder="搜索菜品..." 
				   v-model="searchKeyword" 
				   @input="onSearch" />
			<button class="filter-btn" :class="{ 'active': showDisabledItems }" @click="toggleShowDisabled">
				{{ showDisabledItems ? '显示全部' : '隐藏禁用' }}
			</button>
		</view>
		
		<!-- 菜品列表 -->
		<scroll-view class="menu-list" scroll-y>
			<view v-if="filteredMenuList.length === 0" class="empty-tip">
				暂无菜品，点击添加菜品开始管理你的粮库吧！
			</view>
			<view v-else>
				<view class="menu-item" v-for="item in filteredMenuList" :key="item.id" :class="{ 'disabled': !item.enabled }">
					<view class="item-content" @click="editMenuItem(item)">
						<view class="item-header">
							<text class="item-name">{{ item.name }}</text>
							<view class="item-price-status">
								<text class="item-price">¥{{ item.price }}</text>
								<view class="status-indicator" :class="{ 'enabled': item.enabled, 'disabled': !item.enabled }">
									{{ item.enabled ? '启用' : '禁用' }}
								</view>
							</view>
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
						<button class="action-btn toggle-btn" 
								@click.stop="toggleItemStatus(item)"
								:class="{ 'enabled': item.enabled, 'disabled': !item.enabled }">
							<text class="action-icon">{{ item.enabled ? '✓' : '✗' }}</text>
						</button>
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
			<view class="modal extra-large-form" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ showEditModal ? '编辑菜品' : '添加菜品' }}</text>
					<text class="close-btn" @click="hideModals">×</text>
				</view>
				<view class="modal-body form-modal-body">
					<!-- 菜品名称 -->
					<view class="form-group">
						<text class="form-label">菜品名称</text>
						<input class="form-input" 
								placeholder="请输入菜品名称" 
								v-model="editingItem.name"
								maxlength="20"
								confirm-type="done"
								focus
								cursor-spacing="0" />
					</view>
					
					<!-- 价格 -->
					<view class="form-group">
						<text class="form-label">价格</text>
						<input class="form-input" 
							   type="digit" 
							   placeholder="请输入价格" 
							   v-model="editingItem.price"
							   maxlength="10"
							   confirm-type="done"
							   cursor-spacing="0" />
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
			<view class="modal extra-large-tag-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择标签</text>
					<text class="close-btn" @click="showTagModal = false">×</text>
				</view>
				<view class="modal-body tag-modal-body">
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
							<input class="form-input custom-tag-field" 
								   placeholder="输入自定义标签" 
								   v-model="customTag"
								   maxlength="10"
								   confirm-type="done"
								   :auto-focus="false"
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
				<view class="recipe-content">
					<!-- 左侧分类列表 -->
					<view class="category-sidebar">
						<view class="category-list">
							<view class="category-item" 
								  v-for="category in availableCategories" 
								  :key="category.key"
								  :class="{ 'active': selectedCategory === category.key }"
								  @click="selectedCategory = category.key">
								<text class="category-name">{{ category.name }}</text>
								<text class="category-count">{{ category.count }}道菜</text>
							</view>
						</view>
					</view>
					
					<!-- 右侧菜品列表 -->
					<view class="recipe-main">
						<view class="recipe-header">
							<text class="recipe-title">{{ getCurrentCategoryName() }}</text>
						</view>
						<scroll-view class="recipe-list" scroll-y>
							<view v-if="currentRecipes.length === 0" class="empty-tip">
								该分类暂无菜品
							</view>
							<view v-else class="recipe-items">
								<view class="recipe-item" v-for="recipe in currentRecipes" :key="recipe.name">
									<view class="recipe-info">
										<view class="recipe-name">{{ recipe.name }}</view>
										<view class="recipe-details">
											<text class="recipe-price">¥{{ recipe.price }}</text>
											<text class="recipe-type">{{ recipe.type }}</text>
										</view>
										<view class="recipe-tags" v-if="recipe.tags && recipe.tags.length > 0">
											<text class="recipe-tag" v-for="tag in recipe.tags" :key="tag">{{ tag }}</text>
										</view>
									</view>
									<button class="add-recipe-btn" @click="addRecipeToMenu(recipe)">
										添加
									</button>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="showRecipeModal = false">关闭</button>
					<button class="btn-confirm" @click="importCurrentCategory">
						一键导入当前分类
					</button>
				</view>
			</view>
		</view>
		
		<!-- 导入菜单弹窗 -->
		<view class="modal-overlay" v-if="showImportModal" @click="showImportModal = false">
			<view class="modal large import-export-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">导入菜单</text>
					<text class="close-btn" @click="showImportModal = false">×</text>
				</view>
				<view class="modal-body import-export-body">
					<view class="import-tip">
						<text>请按照以下格式输入菜单数据（每行一个菜品）：</text>
					</view>
					<view class="import-example">
						<text>菜品名称,价格,餐食类型,用餐时段,菜品标签\n
									小笼包,8,日常,早餐,面食|营养\n
									蛋炒饭,15,日常,午餐|晚餐,快餐|营养</text>
					</view>
					<textarea class="import-textarea large-textarea" 
							  placeholder="请输入菜单数据..."
							  v-model="importData">
					</textarea>
				</view>
				<view class="modal-footer">
					<button class="btn-cancel" @click="showImportModal = false">取消</button>
					<button class="btn-confirm" @click="importMenu">导入</button>
				</view>
			</view>
		</view>
		
		<!-- 导出菜单弹窗 -->
		<view class="modal-overlay" v-if="showExportModal" @click="showExportModal = false">
			<view class="modal large import-export-modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">导出菜单</text>
					<text class="close-btn" @click="showExportModal = false">×</text>
				</view>
				<view class="modal-body import-export-body">
					<view class="import-tip">
						<text>复制以下纯文本数据保存到文件：</text>
					</view>
					<textarea class="export-textarea large-textarea" 
							  :value="exportData"
							  readonly>
					</textarea>
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
			showDisabledItems: true, // 是否显示禁用的菜品
			
			// 弹窗状态
			showAddModal: false,
			showEditModal: false,
			showTagModal: false,
			showRecipeModal: false,
			showImportModal: false,
			showExportModal: false,
			
			// 导入导出数据
			importData: '',
			exportData: '',
			
			// 编辑状态
			editingItem: {
				id: null,
				name: '',
				mealTimes: [],
				price: 0,
				type: '日常',
				tags: [],
				enabled: true
			},
			
			// 选项数据
			mealTimeOptions: ['早餐', '午餐', '晚餐', '夜宵', '零食'],
			mealTypeOptions: ['日常', '大餐'],
			allTags: ['辛辣', '清淡', '甜品', '海鲜', '烧烤', '快餐', '西式', '营养', '饮品', '面食', '异国', '日料', '酸甜'],
			customTag: '',
			
			// 菜谱相关
			selectedCategory: 'breakfast',
			recipeData: recipeData
		}
	},
	
	computed: {
		// 获取所有可用的分类（从菜谱数据中读取）
		availableCategories() {
			const categories = []
			const categoryMap = {
				'breakfast': '早餐',
				'lunch': '午餐', 
				'dinner': '晚餐',
				'latenight': '夜宵',
				'snacks': '零食'
			}
			
			Object.keys(this.recipeData).forEach(key => {
				if (this.recipeData[key] && this.recipeData[key].length > 0) {
					categories.push({
						key: key,
						name: categoryMap[key] || key,
						count: this.recipeData[key].length
					})
				}
			})
			
			return categories
		},
		
		// 当前选中分类的菜品
		currentRecipes() {
			return this.recipeData[this.selectedCategory] || []
		}
	},
	
	onLoad() {
		this.loadMenuData()
		this.loadCustomTags()
	},
	
	methods: {
		// 加载菜单数据
		loadMenuData() {
			this.menuList = Storage.getMenuList()
			this.onSearch() // 使用过滤逻辑而不是直接复制
		},
		
		// 搜索
		onSearch() {
			let filteredList = this.menuList
			
			// 根据enabled状态过滤
			if (!this.showDisabledItems) {
				filteredList = filteredList.filter(item => item.enabled)
			}
			
			// 根据关键词过滤
			if (!this.searchKeyword.trim()) {
				this.filteredMenuList = [...filteredList]
			} else {
				const keyword = this.searchKeyword.toLowerCase()
				this.filteredMenuList = filteredList.filter(item => {
					return item.name.toLowerCase().includes(keyword) ||
						   (item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword)))
				})
			}
		},
		
		// 切换显示禁用菜品
		toggleShowDisabled() {
			this.showDisabledItems = !this.showDisabledItems
			this.onSearch() // 重新过滤
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
				tags: [...(item.tags || [])],
				enabled: item.enabled !== false
			}
			this.showEditModal = true
		},
		
		// 切换菜品启用状态
		toggleItemStatus(item) {
			item.enabled = !item.enabled
			Storage.updateMenuItem(item)
			this.loadMenuData()
			
			uni.showToast({
				title: item.enabled ? '菜品已启用' : '菜品已禁用',
				icon: 'success'
			})
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
			
			// 确保价格是数字类型
			const price = parseFloat(this.editingItem.price) || 0
			if (price <= 0) {
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
			
			// 确保价格是数字类型
			this.editingItem.price = price
			
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
				tags: [],
				enabled: true
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
		
		// 获取当前分类名称
		getCurrentCategoryName() {
			return this.getCategoryName(this.selectedCategory)
		},
		
		// 添加菜谱到菜单
		addRecipeToMenu(recipe) {
			const newItem = {
				name: recipe.name,
				mealTimes: recipe.mealTimes || [],
				price: recipe.price,
				type: recipe.type,
				tags: recipe.tags || [],
				enabled: true
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
			const recipes = this.currentRecipes || []
			
			if (recipes.length === 0) {
				uni.showToast({
					title: '该分类暂无菜品',
					icon: 'none'
				})
				return
			}
			
			uni.showModal({
				title: '确认导入',
				content: `确定要导入${recipes.length}个${this.getCurrentCategoryName()}菜品吗？`,
				success: (res) => {
					if (res.confirm) {
						// 导入当前分类的所有菜品
						recipes.forEach(recipe => {
							const newItem = {
								name: recipe.name,
								mealTimes: recipe.mealTimes || [],
								price: recipe.price,
								type: recipe.type,
								tags: recipe.tags || [],
								enabled: true
							}
							Storage.addMenuItem(newItem)
						})
						
						this.loadMenuData()
						this.showRecipeModal = false
						
						uni.showToast({
							title: `成功导入${recipes.length}个菜品`,
							icon: 'success'
						})
					}
				}
			})
		},
		
		// 重置菜单
		resetMenu() {
			uni.showModal({
				title: '确认重置',
				content: '重置后将恢复默认菜单，确定继续吗？',
				success: (res) => {
					if (res.confirm) {
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
				const lines = this.importData.split('\n').filter(line => line.trim())
				const data = []
				
				// 跳过标题行（如果有）
				const startIndex = lines[0].includes('菜品名称') ? 1 : 0
				
				for (let i = startIndex; i < lines.length; i++) {
					const parts = lines[i].split(',')
					if (parts.length >= 4) {
						const name = parts[0].trim()
						const price = parseFloat(parts[1]) || 0
						const type = parts[2].trim() || '日常'
						const mealTimes = parts[3] ? parts[3].split('|').map(tag => tag.trim()).filter(tag => tag) : []
						const tags = parts[4] ? parts[4].split('|').map(tag => tag.trim()).filter(tag => tag) : []
						
						if (name) {
							data.push({
								id: Date.now() + i,
								name,
								price,
								type,
								mealTimes: mealTimes.length > 0 ? mealTimes : ['午餐'],
								tags: tags.length > 0 ? tags : [],
								enabled: true
							})
						}
					}
				}
				
				if (data.length === 0) {
					throw new Error('没有有效的菜品数据')
				}
				
				Storage.setMenuList(data)
				this.loadMenuData()
				this.showImportModal = false
				this.importData = ''
				
				uni.showToast({
					title: `成功导入${data.length}个菜品`,
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
			let text = '菜品名称,价格,餐食类型,用餐时段,菜品标签\n'
			this.menuList.forEach(item => {
				const mealTimes = item.mealTimes ? item.mealTimes.join('|') : ''
				const tags = item.tags ? item.tags.join('|') : ''
				text += `${item.name},${item.price},${item.type},${mealTimes},${tags}\n`
			})
			this.exportData = text
			this.showExportModal = true
		},
		
		// 复制导出数据
		copyExportData() {
			uni.setClipboardData({
				data: this.exportData,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'success'
					})
					this.showExportModal = false
				}
			})
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
		}
	}
}
</script>

<style scoped>
.container {
	background: #f5f5f5;
	min-height: 100vh;
	padding: 20rpx;
}

/* 工具栏 */
.toolbar {
	background: #ffffff;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.toolbar-main {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
	justify-content: space-between;
}

.toolbar-row {
	display: flex;
	gap: 12rpx;
	margin-bottom: 12rpx;
	width: 100%;
}

.toolbar-row:last-child {
	margin-bottom: 0;
}

.btn {
	flex: 1;
	min-width: 100rpx;
	background: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 12rpx 8rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	color: #495057;
	font-size: 24rpx;
	transition: all 0.2s ease;
	white-space: nowrap;
}

.btn:active {
	transform: scale(0.96);
	background: #e9ecef;
}

.btn-icon {
	font-size: 20rpx;
	line-height: 1;
	flex-shrink: 0;
}

.btn-text {
	font-size: 20rpx;
	font-weight: 500;
}

.add-btn {
	background: #007bff;
	color: white;
	border-color: #007bff;
}

.add-btn:active {
	background: #0056b3;
}

.import-btn {
	background: #28a745;
	color: white;
	border-color: #28a745;
}

.import-btn:active {
	background: #1e7e34;
}

.export-btn {
	background: #17a2b8;
	color: white;
	border-color: #17a2b8;
}

.export-btn:active {
	background: #117a8b;
}

.recipe-btn {
	background: #ffc107;
	color: #212529;
	border-color: #ffc107;
}

.recipe-btn:active {
	background: #e0a800;
}

.reset-btn {
	background: #6c757d;
	color: white;
	border-color: #6c757d;
}

.reset-btn:active {
	background: #545b62;
}

/* 搜索栏 */
.search-bar {
	background: #ffffff;
	border-radius: 12rpx;
	padding: 8rpx 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.search-input {
	flex: 1;
	padding: 16rpx 0;
	font-size: 28rpx;
	border: none;
	background: transparent;
	color: #495057;
}

.search-input::placeholder {
	color: #adb5bd;
}

/* 过滤按钮 */
.filter-btn {
	background: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 12rpx 20rpx;
	font-size: 24rpx;
	color: #495057;
	transition: all 0.2s ease;
	white-space: nowrap;
	flex-shrink: 0;
}

.filter-btn.active {
	background: #007bff;
	color: white;
	border-color: #007bff;
}

.filter-btn:active {
	transform: scale(0.96);
}

/* 菜品列表 */
.menu-list {
	height: calc(100vh - 460rpx);
}

.empty-tip {
	text-align: center;
	padding: 100rpx 20rpx;
	color: #6c757d;
	font-size: 28rpx;
	background: #ffffff;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.menu-item {
	background: #ffffff;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	transition: all 0.2s ease;
	border: 1rpx solid #e9ecef;
}

.menu-item.disabled {
	opacity: 0.6;
	background: #f8f9fa;
}

.menu-item:active {
	transform: scale(0.98);
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

.item-price-status {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.item-price {
	font-size: 28rpx;
	font-weight: 600;
	color: #007bff;
}

.status-indicator {
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	font-weight: 600;
}

.status-indicator.enabled {
	background: #4CAF50;
	color: white;
}

.status-indicator.disabled {
	background: #FF5722;
	color: white;
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
	background: #007bff;
	color: white;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 6rpx;
}

.item-type {
	font-size: 24rpx;
	color: #28a745;
	font-weight: 500;
}

.item-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.tag {
	background: #e9ecef;
	color: #495057;
	font-size: 20rpx;
	padding: 4rpx 10rpx;
	border-radius: 6rpx;
	border: 1rpx solid #dee2e6;
}

.item-actions {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	margin-left: 20rpx;
}

.action-btn {
	width: 44rpx;
	height: 44rpx;
	border: none;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16rpx;
	transition: all 0.2s ease;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.toggle-btn.enabled {
	background: #28a745;
	color: white;
}

.toggle-btn.disabled {
	background: #dc3545;
	color: white;
}

.edit-btn {
	background: #007bff;
	color: white;
}

.delete-btn {
	background: #6c757d;
	color: white;
}

.action-btn:active {
	transform: scale(0.92);
}

.action-icon {
	font-size: 18rpx;
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
	background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
	width: 90%;
	max-width: 600rpx;
	border-radius: 20rpx;
	overflow: hidden;
	max-height: 80vh;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

.modal.large {
	max-width: 700rpx;
	height: 80vh;
}

.modal.large-form {
	max-width: 600rpx;
	max-height: 90vh;
}

.modal.small {
	max-width: 500rpx;
}

.form-modal-body {
	max-height: none;
	overflow: visible;
}

.modal-header {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
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

.modal-body {
	padding: 40rpx;
	max-height: 55vh;
	overflow-y: auto;
}

.modal-footer {
	padding: 30rpx;
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
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
	width: auto;
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #333;
	transition: all 0.3s ease;
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
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	border-color: #FF8A65;
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
	border-radius: 15rpx;
	font-size: 28rpx;
	border: none;
	font-weight: 600;
	transition: all 0.3s ease;
}

.btn-cancel {
	background: linear-gradient(135deg, #A5A5A5, #9E9E9E);
	color: white;
}

.btn-confirm {
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	color: white;
}

.btn-cancel:active, .btn-confirm:active {
	transform: scale(0.95);
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
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	border-color: #FF8A65;
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
	background: linear-gradient(135deg, #FF8A65, #FFB74D);
	color: white;
	border: none;
	border-radius: 15rpx;
	padding: 12rpx 30rpx;
	font-size: 26rpx;
	white-space: nowrap;
	transition: all 0.3s ease;
}

.add-tag-btn:active {
	transform: scale(0.95);
}

/* 菜谱弹窗 */
.recipe-modal {
	display: flex;
	flex-direction: column;
}

.recipe-content {
	flex: 1;
	display: flex;
	height: 500rpx;
	overflow: hidden;
}

/* 左侧分类栏 */
.category-sidebar {
	width: 200rpx;
	border-right: 1rpx solid #e9ecef;
	background: #f8f9fa;
}

.category-list {
	height: 100%;
	overflow-y: auto;
}

.category-item {
	padding: 20rpx 16rpx;
	border-bottom: 1rpx solid #e9ecef;
	cursor: pointer;
	transition: background 0.2s ease;
}

.category-item:active {
	background: #e9ecef;
}

.category-item.active {
	background: #007bff;
	color: white;
}

.category-name {
	font-size: 24rpx;
	font-weight: 500;
	margin-bottom: 4rpx;
}

.category-count {
	font-size: 20rpx;
	opacity: 0.7;
}

/* 右侧菜品区域 */
.recipe-main {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.recipe-header {
	padding: 20rpx;
	border-bottom: 1rpx solid #e9ecef;
	background: #ffffff;
}

.recipe-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333;
}

.recipe-list {
	flex: 1;
	padding: 20rpx;
}

.recipe-items {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.recipe-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 16rpx;
	background: #ffffff;
	border-radius: 8rpx;
	border: 1rpx solid #e9ecef;
	transition: all 0.2s ease;
	min-height: 100rpx;
	width: 90%;
	box-sizing: border-box;
}

.recipe-item:active {
	transform: scale(0.98);
	background: #f8f9fa;
}

.recipe-info {
	flex: 1;
	min-width: 0;
	margin-right: 12rpx;
	overflow: hidden;
}

.recipe-name {
	font-size: 24rpx;
	color: #333;
	margin-bottom: 6rpx;
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 1.2;
}

.recipe-details {
	display: flex;
	gap: 12rpx;
	margin-bottom: 6rpx;
}

.recipe-price {
	font-size: 24rpx;
	color: #007bff;
	font-weight: 600;
}

.recipe-type {
	font-size: 24rpx;
	color: #6c757d;
}

.recipe-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 6rpx;
}

.recipe-tag {
	background: #e9ecef;
	color: #495057;
	font-size: 20rpx;
	padding: 2rpx 8rpx;
	border-radius: 4rpx;
}

.add-recipe-btn {
	background: #28a745;
	color: white;
	border: none;
	border-radius: 4rpx;
	padding: 8rpx 12rpx;
	font-size: 20rpx;
	transition: all 0.2s ease;
	white-space: nowrap;
	flex-shrink: 0;
	height: 60rpx;
	min-width: 80rpx;
}

.add-recipe-btn:active {
	background: #1e7e34;
	transform: scale(0.95);
}

/* 导入导出 */
.import-tip {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 15rpx;
	font-weight: 600;
}

.import-example {
	background: rgba(255, 138, 101, 0.1);
	border: 1rpx solid rgba(255, 138, 101, 0.3);
	border-radius: 15rpx;
	padding: 20rpx;
	font-size: 22rpx;
	color: #333;
	margin-bottom: 20rpx;
	font-family: monospace;
	word-break: break-all;
	line-height: 1.5;
}

.import-textarea, .export-textarea {
	width: 100%;
	height: 400rpx;
	padding: 20rpx;
	border: 2rpx solid rgba(255, 138, 101, 0.3);
	border-radius: 15rpx;
	font-size: 24rpx;
	box-sizing: border-box;
	font-family: monospace;
	line-height: 1.4;
	background: rgba(255, 255, 255, 0.8);
	transition: border-color 0.3s ease;
	text-align: left;
	vertical-align: top;
}

.large-textarea {
	height: 550rpx !important;
}

.import-export-modal {
	height: 90vh;
	max-height: 90vh;
}

.import-export-body {
	display: flex;
	flex-direction: column;
	height: calc(90vh - 150rpx);
	padding: 20rpx 30rpx;
	overflow: hidden;
}

.import-export-body .import-tip {
	margin-bottom: 15rpx;
}

.import-export-body .import-example {
	margin-bottom: 20rpx;
	flex-shrink: 0;
}

.import-export-body .large-textarea {
	flex: 1;
	height: 1000px !important;
	min-height: 400rpx;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 20rpx;
	font-size: 24rpx;
	line-height: 1.5;
	resize: none;
	text-align: left;
	vertical-align: top;
}

.import-textarea:focus, .export-textarea:focus {
	border-color: #FF8A65;
	outline: none;
}

/* 新增样式 */
.modal.extra-large-form {
	max-width: 750rpx;
	width: 95%;
	max-height: 95vh;
}

.modal.extra-large-form .modal-body {
	max-height: 70vh;
	overflow-y: auto;
	padding: 30rpx;
}

.modal.large-tag-modal {
	max-width: 650rpx;
	width: 90%;
	max-height: 85vh;
}

.modal.extra-large-tag-modal {
	max-width: 750rpx;
	width: 95%;
	max-height: 90vh;
}

.tag-modal-body {
	max-height: 65vh;
	overflow-y: auto;
	padding: 30rpx;
}

.form-modal-body {
	max-height: none !important;
	overflow: visible !important;
}

.custom-tag-field {
	flex: 1;
	margin-right: 15rpx;
}

.custom-tag-input .form-input {
	margin-bottom: 0;
}
</style>
