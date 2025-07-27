<template>
	<view class="about-container">
		<view class="about-header">
			<image class="about-logo" src="/static/function.ico"></image>
			<text class="about-title">UG吃啥</text>
			<text class="about-version">v1.0.0</text>
		</view>
		
		<view class="about-content">
			<view class="section">
				<text class="section-title">📱 应用简介</text>
				<text class="section-text">UG吃啥是一款专为解决"今天吃什么"困扰而设计的小程序。通过智能抽签的方式，帮助你快速决定用餐选择，让每一餐都充满惊喜！</text>
			</view>
			
			<view class="section">
				<text class="section-title">✨ 主要功能</text>
				<view class="feature-list">
					<view class="feature-item">
						<text class="feature-icon">🎲</text>
						<text class="feature-text">智能抽签决定用餐</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">🍽️</text>
						<text class="feature-text">粮库管理，自定义菜单</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">📊</text>
						<text class="feature-text">数据统计，记录用餐历史</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">🎯</text>
						<text class="feature-text">智能筛选，精准推荐</text>
					</view>
					<view class="feature-item">
						<text class="feature-icon">🚚</text>
						<text class="feature-text">一键外卖，便捷下单</text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">👨‍💻 开发者信息</text>
				<view class="developer-info">
					<text class="developer-name">开发者：UG</text>
					<text class="developer-desc">致力于为用户提供便捷的生活小工具</text>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">📞 联系我</text>
				<view class="contact-list">
					<view class="contact-item" @click="copyContact('uguang2003@gmail.com')">
						<text class="contact-icon">📧</text>
						<text class="contact-text">邮箱：uguang2003@gmail.com</text>
						<text class="contact-action">点击复制</text>
					</view>
					<view class="contact-item" @click="feedback">
						<text class="contact-icon">💬</text>
						<text class="contact-text">意见反馈</text>
						<text class="contact-action">></text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">⚖️ 使用条款</text>
				<view class="terms-list">
					<text class="terms-item" @click="showPrivacy">隐私政策</text>
					<text class="terms-item" @click="showTerms">使用条款</text>
				</view>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<view class="about-footer">
			<text class="copyright">© 2025 UG吃啥 All Rights Reserved</text>
			<text class="thanks">感谢您的使用 ❤️</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	
	methods: {
		// 复制联系方式
		copyContact(text) {
			uni.setClipboardData({
				data: text,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'success'
					})
				}
			})
		},
		
		// 意见反馈
		feedback() {
			uni.showModal({
				title: '意见反馈',
				content: '感谢您的宝贵意见！您可以通过邮箱联系我们，我们会认真对待每一条反馈。',
				showCancel: false,
				confirmText: '知道了'
			})
		},
		
		// 显示隐私政策
		showPrivacy() {
			uni.showModal({
				title: '隐私政策',
				content: '我们重视您的隐私保护。本应用仅在本地存储您的菜单和使用数据，不会上传到服务器。',
				showCancel: false,
				confirmText: '知道了'
			})
		},
		
		// 显示使用条款
		showTerms() {
			uni.showModal({
				title: '使用条款',
				content: '本应用仅供个人娱乐使用，请合理安排饮食。开发者不对因使用本应用而产生的任何后果承担责任。',
				showCancel: false,
				confirmText: '知道了'
			})
		}
	}
}
</script>

<style scoped>
.about-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
}

.about-header {
	text-align: center;
	margin-bottom: 60rpx;
}

.about-logo {
	width: 120rpx;
	height: 120rpx;
	border-radius: 24rpx;
	margin-bottom: 20rpx;
}

.about-title {
	display: block;
	font-size: 48rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 10rpx;
}

.about-version {
	display: block;
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
}

.about-content {
	background: rgba(255, 255, 255, 0.95);
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 40rpx;
}

.section {
	margin-bottom: 50rpx;
}

.section:last-child {
	margin-bottom: 0;
}

.section-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 24rpx;
}

.section-text {
	display: block;
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.feature-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.feature-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
	width: 40rpx;
}

.feature-text {
	font-size: 28rpx;
	color: #666;
}

.developer-name {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
	font-weight: bold;
}

.developer-desc {
	display: block;
	font-size: 26rpx;
	color: #999;
}

.contact-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.contact-item:last-child {
	border-bottom: none;
}

.contact-icon {
	font-size: 32rpx;
	margin-right: 20rpx;
}

.contact-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.contact-action {
	font-size: 24rpx;
	color: #999;
}

.terms-list {
	display: flex;
	gap: 40rpx;
}

.terms-item {
	font-size: 28rpx;
	color: #007AFF;
	text-decoration: underline;
}

.about-footer {
	text-align: center;
}

.copyright {
	display: block;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 10rpx;
}

.thanks {
	display: block;
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	font-weight: bold;
}
</style>
