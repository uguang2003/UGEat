<template>
	<view class="container">
		<!-- 数据概览 -->
		<view class="overview">
			<view class="overview-item">
				<text class="number">{{ totalDraws }}</text>
				<text class="label">总抽取次数</text>
			</view>
			<view class="overview-item">
				<text class="number">{{ confirmedCount }}</text>
				<text class="label">确认次数</text>
			</view>
			<view class="overview-item">
				<text class="number">{{ rejectedCount }}</text>
				<text class="label">拒绝次数</text>
			</view>
			<view class="overview-item">
				<text class="number">{{ totalCost.toFixed(2) }}</text>
				<text class="label">累计消费(元)</text>
			</view>
		</view>
		
		<!-- 挑食指数 -->
		<view class="pickiness-section">
			<view class="section-title">
				<text>挑食指数</text>
			</view>
			<view class="pickiness-card">
				<view class="pickiness-info">
					<text class="pickiness-rate">{{ pickinessRate }}%</text>
					<text class="pickiness-desc">{{ pickinessDesc }}</text>
				</view>
				<view class="pickiness-bar">
					<view class="pickiness-progress" :style="{ width: pickinessRate + '%' }"></view>
				</view>
			</view>
		</view>
		
		<!-- 最爱菜品 TOP5 -->
		<view class="favorite-section">
			<view class="section-title">
				<text>最爱菜品 TOP5</text>
			</view>
			<view class="favorite-list">
				<view class="favorite-item" v-for="(item, index) in topFavorites" :key="item.name">
					<view class="rank">{{ index + 1 }}</view>
					<view class="info">
						<text class="name">{{ item.name }}</text>
						<text class="count">{{ item.count }}次</text>
					</view>
					<view class="price">¥{{ item.price }}</view>
				</view>
				<view v-if="topFavorites.length === 0" class="empty-tip">
					<text>暂无数据</text>
				</view>
			</view>
		</view>
		
		<!-- 消费统计 -->
		<view class="cost-section">
			<view class="section-title">
				<text>消费统计</text>
			</view>
			<view class="cost-chart">
				<canvas class="chart-canvas" canvas-id="costChart" id="costChart"></canvas>
			</view>
			<view class="cost-details">
				<view class="cost-item" v-for="item in costByType" :key="item.type">
					<text class="type">{{ item.type }}</text>
					<text class="cost">¥{{ item.cost.toFixed(2) }}</text>
					<text class="percent">{{ item.percent }}%</text>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="actions">
			<button class="clear-btn" @click="clearData">清空数据</button>
			<button class="export-btn" @click="exportData">导出统计</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			historyList: [],
			totalDraws: 0,
			confirmedCount: 0,
			rejectedCount: 0,
			totalCost: 0,
			topFavorites: [],
			costByType: []
		}
	},
	computed: {
		pickinessRate() {
			if (this.totalDraws === 0) return 0
			return Math.round((this.rejectedCount / this.totalDraws) * 100)
		},
		pickinessDesc() {
			const rate = this.pickinessRate
			if (rate >= 80) return '超级挑食'
			if (rate >= 60) return '比较挑食'
			if (rate >= 40) return '有点挑食'
			if (rate >= 20) return '偶尔挑食'
			return '不挑食'
		}
	},
	onLoad() {
		this.loadStatistics()
	},
	onShow() {
		this.loadStatistics()
	},
	methods: {
		async loadStatistics() {
			try {
				// 加载历史记录
				const history = await uni.getStorage({
					key: 'ugeat_history'
				})
				this.historyList = history.data || []
				
				// 计算统计数据
				this.calculateStats()
				this.calculateTopFavorites()
				this.calculateCostByType()
				
				// 绘制图表
				this.$nextTick(() => {
					this.drawCostChart()
				})
			} catch (e) {
				console.log('未找到历史数据')
				this.historyList = []
			}
		},
		
		calculateStats() {
			this.totalDraws = this.historyList.length
			this.confirmedCount = this.historyList.filter(item => item.confirmed).length
			this.rejectedCount = this.historyList.filter(item => !item.confirmed).length
			this.totalCost = this.historyList
				.filter(item => item.confirmed)
				.reduce((sum, item) => sum + (item.price || 0), 0)
		},
		
		calculateTopFavorites() {
			const foodCount = {}
			this.historyList
				.filter(item => item.confirmed)
				.forEach(item => {
					if (foodCount[item.name]) {
						foodCount[item.name].count++
					} else {
						foodCount[item.name] = {
							name: item.name,
							count: 1,
							price: item.price || 0
						}
					}
				})
			
			this.topFavorites = Object.values(foodCount)
				.sort((a, b) => b.count - a.count)
				.slice(0, 5)
		},
		
		calculateCostByType() {
			const typeCount = {}
			let totalCost = 0
			
			this.historyList
				.filter(item => item.confirmed)
				.forEach(item => {
					const type = item.type || '其他'
					const cost = item.price || 0
					totalCost += cost
					
					if (typeCount[type]) {
						typeCount[type] += cost
					} else {
						typeCount[type] = cost
					}
				})
			
			this.costByType = Object.entries(typeCount)
				.map(([type, cost]) => ({
					type,
					cost,
					percent: totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0
				}))
				.sort((a, b) => b.cost - a.cost)
		},
		
		drawCostChart() {
			if (this.costByType.length === 0) return
			
			const ctx = uni.createCanvasContext('costChart', this)
			const canvas = {
				width: 300,
				height: 200,
				padding: 40
			}
			
			// 清空画布
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			
			// 设置字体
			ctx.setFontSize(12)
			
			const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3']
			const total = this.costByType.reduce((sum, item) => sum + item.cost, 0)
			
			if (total <= 0) return
			
			let currentAngle = 0
			const centerX = canvas.width / 2
			const centerY = canvas.height / 2
			const radius = Math.min(centerX, centerY) - canvas.padding
			
			// 绘制饼图
			this.costByType.forEach((item, index) => {
				const angle = (item.cost / total) * 2 * Math.PI
				
				ctx.setFillStyle(colors[index % colors.length])
				ctx.beginPath()
				ctx.moveTo(centerX, centerY)
				ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
				ctx.closePath()
				ctx.fill()
				
				currentAngle += angle
			})
			
			ctx.draw()
		},
		
		async clearData() {
			const res = await uni.showModal({
				title: '确认清空',
				content: '确定要清空所有统计数据吗？此操作不可恢复。'
			})
			
			if (res.confirm) {
				try {
					await uni.removeStorage({
						key: 'ugeat_history'
					})
					
					this.historyList = []
					this.loadStatistics()
					
					uni.showToast({
						title: '已清空数据',
						icon: 'success'
					})
				} catch (e) {
					console.error('清空数据失败', e)
				}
			}
		},
		
		exportData() {
			if (this.historyList.length === 0) {
				uni.showToast({
					title: '暂无数据可导出',
					icon: 'none'
				})
				return
			}
			
			// 生成导出文本
			let exportText = `UG吃啥 - 统计数据导出\n\n`
			exportText += `总抽取次数：${this.totalDraws}\n`
			exportText += `确认次数：${this.confirmedCount}\n`
			exportText += `拒绝次数：${this.rejectedCount}\n`
			exportText += `挑食指数：${this.pickinessRate}% (${this.pickinessDesc})\n`
			exportText += `累计消费：¥${this.totalCost.toFixed(2)}\n\n`
			
			if (this.topFavorites.length > 0) {
				exportText += `最爱菜品 TOP5：\n`
				this.topFavorites.forEach((item, index) => {
					exportText += `${index + 1}. ${item.name} (${item.count}次, ¥${item.price})\n`
				})
				exportText += `\n`
			}
			
			if (this.costByType.length > 0) {
				exportText += `消费分布：\n`
				this.costByType.forEach(item => {
					exportText += `${item.type}：¥${item.cost.toFixed(2)} (${item.percent}%)\n`
				})
				exportText += `\n`
			}
			
			exportText += `详细记录：\n`
			this.historyList.forEach((item, index) => {
				const status = item.confirmed ? '✓确认' : '✗拒绝'
				const time = new Date(item.timestamp).toLocaleString()
				exportText += `${index + 1}. ${item.name} - ${status} - ${time}\n`
			})
			
			// 复制到剪贴板
			uni.setClipboardData({
				data: exportText,
				success: () => {
					uni.showToast({
						title: '统计数据已复制到剪贴板',
						icon: 'success'
					})
				},
				fail: () => {
					uni.showToast({
						title: '导出失败',
						icon: 'none'
					})
				}
			})
		}
	}
}
</script>

<style>
.container {
	background: #f5f5f5;
	min-height: 100vh;
	padding: 20rpx;
}

.overview {
	display: flex;
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.overview-item {
	flex: 1;
	text-align: center;
}

.overview-item .number {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #FF6B6B;
	margin-bottom: 10rpx;
}

.overview-item .label {
	font-size: 24rpx;
	color: #666;
}

.pickiness-section, .favorite-section, .cost-section {
	background: white;
	border-radius: 15rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 25rpx;
	padding-bottom: 15rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.pickiness-card {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.pickiness-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.pickiness-rate {
	font-size: 48rpx;
	font-weight: bold;
	color: #FF6B6B;
}

.pickiness-desc {
	font-size: 28rpx;
	color: #666;
}

.pickiness-bar {
	height: 20rpx;
	background: #f0f0f0;
	border-radius: 10rpx;
	overflow: hidden;
}

.pickiness-progress {
	height: 100%;
	background: linear-gradient(90deg, #4ECDC4 0%, #FF6B6B 100%);
	border-radius: 10rpx;
	transition: width 0.3s ease;
}

.favorite-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.favorite-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #f9f9f9;
	border-radius: 10rpx;
}

.rank {
	width: 60rpx;
	height: 60rpx;
	background: #FF6B6B;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: bold;
	margin-right: 20rpx;
}

.info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 5rpx;
}

.info .name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.info .count {
	font-size: 24rpx;
	color: #666;
}

.price {
	font-size: 28rpx;
	color: #FF6B6B;
	font-weight: bold;
}

.cost-chart {
	display: flex;
	justify-content: center;
	margin-bottom: 30rpx;
}

.chart-canvas {
	width: 300px;
	height: 200px;
}

.cost-details {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.cost-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 20rpx;
	background: #f9f9f9;
	border-radius: 10rpx;
}

.type {
	font-size: 28rpx;
	color: #333;
}

.cost {
	font-size: 28rpx;
	color: #FF6B6B;
	font-weight: bold;
}

.percent {
	font-size: 24rpx;
	color: #666;
}

.empty-tip {
	text-align: center;
	padding: 50rpx 0;
	color: #999;
	font-size: 28rpx;
}

.actions {
	display: flex;
	gap: 20rpx;
	margin-top: 30rpx;
}

.clear-btn, .export-btn {
	flex: 1;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	border: none;
}

.clear-btn {
	background: #FF6B6B;
	color: white;
}

.export-btn {
	background: #4ECDC4;
	color: white;
}
</style>