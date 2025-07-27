// UG秘制菜谱数据
const recipeData = {
  // 分类名称映射
  categories: [
	{ key: 'breakfast', name: '早餐' },
	{ key: 'lunch', name: '午餐' },
	{ key: 'dinner', name: '晚餐' },
	{ key: 'latenight', name: '夜宵' },
	{ key: 'snacks', name: '零食' },
	{ key: 'answerbook', name: '答案之书' }
  ],

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
	{ name: '肉夹馍', price: 12, type: '日常', mealTimes: ['早餐'], tags: ['面食'] },
	{ name: '葱油饼', price: 7, type: '日常', mealTimes: ['早餐'], tags: ['面食'] },
	{ name: '鸡蛋三明治', price: 13, type: '日常', mealTimes: ['早餐'], tags: ['西式', '营养'] },
	{ name: '燕麦粥', price: 9, type: '日常', mealTimes: ['早餐'], tags: ['清淡', '营养'] },
	{ name: '水果沙拉', price: 10, type: '日常', mealTimes: ['早餐'], tags: ['营养', '清淡'] },
	{ name: '牛肉面', price: 16, type: '日常', mealTimes: ['早餐'], tags: ['面食', '营养'] }
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
	{ name: '蒜蓉扇贝', price: 42, type: '大餐', mealTimes: ['午餐', '晚餐'], tags: ['海鲜'] },
	{ name: '番茄牛腩', price: 32, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['营养'] },
	{ name: '干锅花菜', price: 18, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['清淡'] },
	{ name: '烤鸡腿', price: 22, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['营养'] },
	{ name: '咖喱鸡饭', price: 20, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['快餐'] },
	{ name: '牛肉炒面', price: 19, type: '日常', mealTimes: ['午餐', '晚餐'], tags: ['面食'] }
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
	{ name: '自助餐', price: 98, type: '大餐', mealTimes: ['晚餐'], tags: ['营养'] },
	{ name: '烤鱼', price: 56, type: '大餐', mealTimes: ['晚餐'], tags: ['烧烤', '海鲜'] },
	{ name: '羊肉串', price: 28, type: '日常', mealTimes: ['晚餐'], tags: ['烧烤'] },
	{ name: '番茄意面', price: 32, type: '日常', mealTimes: ['晚餐'], tags: ['西式', '面食'] },
	{ name: '蔬菜沙拉', price: 18, type: '日常', mealTimes: ['晚餐'], tags: ['清淡', '营养'] }
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
	{ name: '热干面', price: 12, type: '日常', mealTimes: ['夜宵'], tags: ['面食'] },
	{ name: '炸鸡柳', price: 14, type: '日常', mealTimes: ['夜宵'], tags: ['快餐'] },
	{ name: '烤玉米', price: 8, type: '日常', mealTimes: ['夜宵'], tags: ['烧烤'] },
	{ name: '凉皮', price: 10, type: '日常', mealTimes: ['夜宵'], tags: ['清淡'] }
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
	{ name: '芝士蛋糕', price: 42, type: '大餐', mealTimes: ['零食'], tags: ['甜品'] },
	{ name: '能量棒', price: 8, type: '日常', mealTimes: ['零食'], tags: ['营养'] },
	{ name: '山楂片', price: 5, type: '日常', mealTimes: ['零食'], tags: ['甜品'] },
	{ name: '花生米', price: 7, type: '日常', mealTimes: ['零食'], tags: ['营养'] }
  ],
	
	  // 答案之书分类
  answerbook: (() => {
	const answerStr = `别难过，你是最棒的 时间会证明一切 需要一个相当大的努力 从现在开始一年也没有关系 开始改变你的日常习惯 遇上方知有 采用一个冒险的态度 允许你先休息一下 好运将会降临 避免第一个解决方案 寻求援助会让你成功 需要耐心 实际一点吧 合作将会是关键 考虑一下这个机会 早点去做 无需多问，尽力去做 别让压力打乱你的节奏 也许会有好转 是时候做新的打算了 不用怀疑了 不要陷入你的感情 不要犹豫 别浪费时间了 先完成其他事情 专注你眼下的生活 遵循别人的引导 遵循专家的建议 按照你的意愿 坚持终有回报 做好调查研究，然后做好它！ 这不可能失败 也许是一段奇妙的旅程 这是你不会忘记的 这肯定会让事情变得有趣 这是不确定的 木已成舟 这可能很难，但你会发现它的价值 这将影响别人对你的看法 这将是一种享受 这会带来好运 前路仍不可预测 这是不明智的 它会让你付出代价 现在就是绝佳的时机 不值得反抗 是你走的时候 保持开放的心态 不要让别人知道 笑一下 请摆脱当前束缚 让它过去吧 为什么不列出原因也许 一直走下去 你不会一个人 只做一次 注重细节 为突发事件做好准备 重新考虑你的方法 得真正地努力一下 重新考虑优先级 尊重规则 寻找更多选择 很快就会解决它 整个宇宙都会过来帮你 结果可能会令人震惊 需冒险一试 花更多的时间来决定 那将是浪费钱 这会超出你的控制 解决办法可能不太明显 机会不会很快再来 情况将很快发生改变 结果会是好的 有充分的理由保持乐观 会有障碍要克服 这是制定新计划的好时机 想做出最佳决策，需要保持冷静 相信自己的直觉 别忘记你的初心 尝试一种不太可能的解决方案 不宜在这个时候 无论如何你可以提升 你能以任何方式改变现状 ，等一等 等待一个更好的机会 一个正在到来的晴天 注意你的节奏 不管你做什么，结果将会影响你 可以 不 不是的，但不要勉强 你会发现自己无法妥协 你知道现在比以前好 你可能会放弃其他东西 你现在必须行动 你会发现一切你所需要知道的 岁月静好，长乐未央 你需要适应 你不会失望的 感恩，运气会越来越好 你会庆幸你做了 学会妥协 学会保护自己 你需要主动出击 你会后悔的 糊涂一点更好 不必为你无法控制的事情而担心 会取得更好的结果 一切从头开始 看看会发生什么 你失去的某天会归还与你 你的状态很不对 你或许需要突破 你唯一能做的只有把握现在 学会珍惜 调整心情，重新出发 请坚持不懈的努力 你不是真心的在意 不合适 换一个方向 放轻松，这很简单 也许会迟到 奇迹会降临 你会因为你做了而感到快乐 你很棒，自信起来吧 你心里已有答案 你的行动会改变现状 停止emo 放手 有一个重要的东西用来过渡 难分好坏 高兴起来吧，你这么厉害 别指望所有人理解你 随波逐流未必是好事 别灰心，人生总是起起落落的 别要求太多 别辜负了自己就好 问问自己，为什么要这么干 千万不能失败 另择吉日 试着去爱 答案就在你身边 珍惜身边人 尽人事，听天命 带着你顽皮的好奇心去探索它 令人期待的事情马上就要发生 每天做一点，将会大不相同 主动一点，人生会大不相同 以后再说 眼光长远一点 研究它，然后享受它 跟随其他人的领导 值不值得争取 这是必然的，不要抗拒 不要刻意隐藏 停止伤悲 不要刻意压抑 背不动就放下 不要怕 回家吧，家是永远的避风港 不要去忘记 自信起来吧 接受那些消失的 到此为止 时间有限 慢下来 挥手道别 事情会朝目标发展 未来可期 平平安安 挥别错的 用平淡的心态去追求 一切皆有可能 控制自己的情绪 一切顺其自然 一场铺满鲜花的道路 暂且不要判断 不要一成不变 你祈求的一切顺利 享受全心全意的付出 站在了最重要的地方 你会得到大多数的支持 十分好的预感 学会改变什么 最划算的交易 学会成长 最好的事情正要发生 没有什么是对的 必须努力奔跑起来 会有人陪着你 站起来去战斗 不要看轻别人 多读一本书 出发 差不多得了 不要给人添麻烦 有人浪费了你的时间 最后什么都没改变 对，去吧 找回自己 你会得到重生 慢些，我们就会更快 需要直面残酷 你大概会受点伤 回头看看 当然 别傻了 烦恼快要消失了 结束倒计时 并不会让你高兴 没什么放不下 等待 伤口很快会愈合 如你所愿 悄悄躲开 完美的 不要做出任何决定 浪费光阴 停止向前 再也不要见 不会让你痛苦的 试着慷慨一点 这是不能犹豫的事 试着安静一会 戒掉过分的急躁 不要隐藏起来 你好像舍不得 有点儿心疼 车到山前必有路 你有必要傻一点 你会忘记它 只是一场梦 你要勇敢的离开 先主后次 尽你最大的努力 去忘记 大家好像都不认同 认真起来 值得去做的事 转个身忘记吧 这绝对是个好主意 马上停下来 你很幸运 机会就在眼前 不如忘掉这个问题 专注一点 殊途同归 背道而驰 吃点东西，冷静一下 这大概会让你哭泣 高兴起来吧，你这么厉害 既往不恋 捍卫它 不必耿耿于怀 放在心里吧，这样比较好点 不用伪装到面目全非 别压抑自己的天性 一个人安安静静呆一会儿 不要去想走多远 大哭一场会好受一点 总会慢慢淡去的 明天就会有新鲜事发生 这种事情要靠缘分 这是起跑线 没事，有我在 不要把所有表情都写在脸上 别人会你苦笑 好像会很累 你需要的只是勇气 不甘心的话，就努力争取吧 无条件的付出 试着更快一些 不能永远一层不变 会有一些困难 等待下一个故事的发生 试着面对自己的真实想法 愿意并且相信 将要奔赴一场未知的旅程 隐忍 不必要的退让 这大概会让你有点寂寞 不要轻易去相信 可能会很累 让周围的人感到温暖 大概要多想一会 值得肯定 注意一下周围 看见的都不是真的 那将是一件乐事 看向未来 未来会变得特别繁忙 这简直太有趣了 胜券在握 突如其来的幸福 特别的见解 值得喝一杯 并不确定真伪 不要迫于压力草率行事 保持你的好奇心，去挖掘真相 谁说得准呢，先观望着 天上要掉馅饼了 还有另一种情况 别让它影响到你 时机不对 照你想的那样去做 量力而行 但行好事，莫问前程 迷途慢慢，终有一归 抛弃首选方案 走容易走的路 最佳方案不一定可行 借助他人的经验 再多考虑 说出来吧 机会稍纵即逝 你就是答案 培养一项新爱好 观察形势 休息，休息一会 这是你最后的机会 并不明智 保持头脑清醒 保存你的实力 不确定的因素有点多 结果不错 等待更好的 制定计划 很麻烦 克服困难 想法太多，选择太少 一年后就不那么重要了 去行动 发挥你的想象力 寻找一个指路人 能让你快乐的那个决定 着眼未来 不要等了 不要被情绪左右 不要做得太过分 改变自己 这是一个机会 问自己什么事最重要的 不要忧虑 你必须弥补这个缺点 忽略了一件显而易见的事 别太赶了 还有别的选择 不好忽视自己的力量 尽在掌握之中 无论怎样天塌不下来 这件事会给你带来极大的乐趣 无需纠结 老天也许在给你准备惊喜 是好的 这是最佳选择之一 没有更好的选择 铸造自己的辉煌 不一定 是个很好的想法 无尽的可能性 请谨慎考虑后果 这是一个明智的投资 可以从过去的经验中学习 请利用自己的优势 证明自己的潜力和价值 这是一个有潜力的想法 可以期待的未来 转移你的注意力 下一页才是你的人生答案`;
	return answerStr.split(/\s+/).filter(Boolean).map((txt, idx) => ({
	  name: txt,
	  price: 0,
	  type: '日常',
	  mealTimes: ['零食'],
	  tags: ['答案之书'],
	  id: `answerbook_${idx}`
	}));
  })(),

}

export function getAllRecipes() {
	return recipeData
}

// 获取指定分类的菜谱
export function getRecipesByCategory(category) {
	return recipeData[category] || []
}

// 获取分类列表
export function getCategories() {
	return recipeData.categories
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
			return response.data.recipes || recipeData
		} else {
			throw new Error('接口返回数据格式错误')
		}
	} catch (error) {
		console.log('获取UG秘制菜谱失败，使用本地默认数据:', error)
		// 接口调用失败，返回本地默认菜谱
		return recipeData
	}
}


