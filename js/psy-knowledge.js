// 心理知识库模块（扩展版）
function renderPsyKnowledge() {
  const el = document.getElementById('psyKnowledgeContent');
  el.innerHTML = `
    <div class="pk-tabs">
      <button class="pk-tab active" onclick="switchPKTab('common',this)">🧠 常见心理问题</button>
      <button class="pk-tab" onclick="switchPKTab('self',this)">💪 自助方法</button>
      <button class="pk-tab" onclick="switchPKTab('myth',this)">❌ 心理误区</button>
      <button class="pk-tab" onclick="switchPKTab('signs',this)">⚠️ 预警信号</button>
      <button class="pk-tab" onclick="switchPKTab('campus',this)">🎓 校园心理</button>
    </div>
    <div id="pkContent"></div>
  `;
  switchPKTab('common', el.querySelector('.pk-tab'));
}

function switchPKTab(tab, btn) {
  document.querySelectorAll('.pk-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const c = document.getElementById('pkContent');
  const r = { common: pkCommon, self: pkSelf, myth: pkMyth, signs: pkSigns, campus: pkCampus };
  if (r[tab]) c.innerHTML = r[tab]();
}
function pkCommon() {
  return `<div class="pk-section">
    <h3>🧠 大学生常见心理问题</h3>
    <div class="pk-grid">
      <div class="pk-card">
        <h4>😰 焦虑症</h4>
        <p><b>表现：</b>持续担忧、坐立不安、心跳加速、难以集中注意力、睡眠困难</p>
        <p><b>常见诱因：</b>考试压力、就业焦虑、社交恐惧、未来不确定性</p>
        <p><b>关键知识：</b>适度焦虑是正常的适应性反应，有助于提高表现。但当焦虑持续超过6个月且严重影响日常生活时，需要寻求专业帮助。</p>
      </div>
      <div class="pk-card">
        <h4>😔 抑郁症</h4>
        <p><b>表现：</b>持续心境低落、兴趣丧失、疲惫无力、自我否定、食欲/体重变化</p>
        <p><b>误区：</b>"想开点就好了" —— 抑郁是生理性疾病，大脑神经递质失衡，不是意志力问题</p>
        <p><b>关键知识：</b>中国大学生抑郁症检出率约30%。早期干预治愈率高。药物+心理治疗联合效果最好。</p>
      </div>
      <div class="pk-card">
        <h4>😖 适应障碍</h4>
        <p><b>表现：</b>面对生活变化（入学/转专业/实习）出现过度焦虑、退缩、情绪不稳</p>
        <p><b>特点：</b>通常在应激事件后3个月内出现，持续不超过6个月</p>
        <p><b>应对：</b>主动建立社交支持、保持规律作息、给自己适应的时间</p>
      </div>
      <div class="pk-card">
        <h4>😴 睡眠障碍</h4>
        <p><b>表现：</b>入睡困难、早醒、多梦、日间嗜睡、睡眠节律紊乱</p>
        <p><b>大学生高发原因：</b>手机成瘾、作息不规律、宿舍环境、考试焦虑</p>
        <p><b>建议：</b>固定就寝时间、睡前1小时远离屏幕、卧室只用于睡眠</p>
      </div>
      <div class="pk-card">
        <h4>🤝 人际关系困扰</h4>
        <p><b>表现：</b>社交回避、宿舍矛盾、难以建立亲密关系、讨好型人格</p>
        <p><b>核心原因：</b>依恋模式（安全/焦虑/回避型）、自我价值感低</p>
        <p><b>关键知识：</b>健康的人际关系=尊重边界+真诚表达+允许冲突</p>
      </div>
      <div class="pk-card">
        <h4>📱 网络/游戏成瘾</h4>
        <p><b>表现：</b>无法控制上网时间、现实生活功能受损、戒断烦躁</p>
        <p><b>心理机制：</b>逃避现实压力→即时满足→多巴胺耐受→加大剂量的恶性循环</p>
        <p><b>应对：</b>识别触发情境、培养线下替代活动、设定使用时间限制</p>
      </div>
    </div>
  </div>`;
}
function pkSelf() {
  return `<div class="pk-section">
    <h3>💪 科学自助方法</h3>
    <div class="pk-grid">
      <div class="pk-card">
        <h4>📓 情绪日记</h4>
        <p><b>方法：</b>每天记录3件事：1)今天的情绪(1-10分) 2)引发情绪的事件 3)当时的想法</p>
        <p><b>原理：</b>CBT认知行为疗法核心技术，通过记录觉察自动化思维</p>
        <p><b>坚持2周后：</b>你会发现重复出现的思维模式和情绪触发点</p>
      </div>
      <div class="pk-card">
        <h4>🏃 运动处方</h4>
        <p><b>研究证据：</b>每周150分钟中等强度运动，效果相当于抗抑郁药物（BMJ 2023）</p>
        <p><b>推荐方案：</b></p>
        <ul><li>轻度：散步30分钟/天</li><li>中度：慢跑/游泳3次/周</li><li>高强度：HIIT 20分钟/次</li></ul>
        <p>关键在于<b>规律性</b>，不在于强度。</p>
      </div>
      <div class="pk-card">
        <h4>😊 感恩三件事</h4>
        <p><b>方法：</b>每晚睡前写下今天值得感恩的3件事</p>
        <p><b>原理：</b>积极心理学干预，重塑大脑关注积极事物的神经回路</p>
        <p><b>研究：</b>持续8周后，幸福感提升25%（Emmons & McCullough 2003）</p>
      </div>
      <div class="pk-card">
        <h4>🗣️ 积极自我对话</h4>
        <p><b>方法：</b>把内心批评的声音替换为朋友般的鼓励</p>
        <p><b>示例：</b></p>
        <ul><li>"我真没用" → "我正在学习中，犯错是正常的"</li>
        <li>"大家都比我好" → "每个人都有自己的节奏"</li>
        <li>"我肯定做不到" → "我可以先试试看"</li></ul>
      </div>
      <div class="pk-card">
        <h4>👫 社交处方</h4>
        <p><b>方法：</b>每周至少1次有深度的社交互动（不是聊天群的浅交流）</p>
        <p><b>形式：</b>面对面聊天>视频通话>语音>文字</p>
        <p><b>研究：</b>社交孤立对健康的危害等同于每天抽15根烟（Holt-Lunstad 2015）</p>
      </div>
      <div class="pk-card">
        <h4>🎯 小目标法</h4>
        <p><b>方法：</b>将大任务拆解为5分钟内能完成的小步骤</p>
        <p><b>原理：</b>"Just Five Minutes"法则 —— 只承诺做5分钟，利用启动效应</p>
        <p><b>适合：</b>拖延症、缺乏动力、被论文/考试压垮时</p>
      </div>
    </div>
  </div>`;
}
function pkMyth() {
  return `<div class="pk-section">
    <h3>❌ 心理健康常见误区</h3>
    <div class="pk-grid">
      <div class="pk-card pk-myth">
        <h4>❌ "心理有问题 = 精神病"</h4>
        <p class="pk-truth">✅ 真相：心理困扰是从正常到异常的连续谱。每个人都会遇到心理问题，就像每个人都会感冒。感冒≠肺炎，心理困扰≠精神病。</p>
      </div>
      <div class="pk-card pk-myth">
        <h4>❌ "抑郁就是想不开/矫情"</h4>
        <p class="pk-truth">✅ 真相：抑郁症是大脑5-HT、多巴胺等神经递质失衡的生理疾病，和糖尿病一样是需要治疗的医学问题。你不会对糖尿病人说"想开点血糖就正常了"。</p>
      </div>
      <div class="pk-card pk-myth">
        <h4>❌ "看心理咨询/吃药丢人"</h4>
        <p class="pk-truth">✅ 真相：求助是勇气和智慧的表现。发达国家60%以上人群一生中会接受心理咨询。这不是弱者的选择，而是对自己负责。</p>
      </div>
      <div class="pk-card pk-myth">
        <h4>❌ "只要努力就能克服一切"</h4>
        <p class="pk-truth">✅ 真相：有些心理问题（如创伤后应激、重度抑郁）超出个人意志力能处理的范围，正如骨折不能靠"坚强"来愈合。专业帮助能让康复更快更安全。</p>
      </div>
      <div class="pk-card pk-myth">
        <h4>❌ "心理咨询就是聊天"</h4>
        <p class="pk-truth">✅ 真相：心理咨询是经过严格训练的专业技术，咨询师运用CBT、精神动力、人本主义等系统方法。和朋友聊天的本质区别在于专业性和目标导向性。</p>
      </div>
      <div class="pk-card pk-myth">
        <h4>❌ "性格内向就是有问题"</h4>
        <p class="pk-truth">✅ 真相：内向是正常的人格特质，不是心理障碍。荣格说"每个人都有内向和外向两面"。内向者的能量来源于独处，这是优势不是缺陷。</p>
      </div>
    </div>
  </div>`;
}
function pkSigns() {
  return `<div class="pk-section">
    <h3>⚠️ 需要求助的预警信号</h3>
    <p class="pk-intro">如果你或身边的人出现以下信号，请立即寻求专业帮助：</p>
    <div class="pk-grid">
      <div class="pk-card pk-danger">
        <h4>🚨 高危信号（立即求助）</h4>
        <ul>
          <li>有自杀/自伤的想法或计划</li>
          <li>写遗书或分发个人物品</li>
          <li>谈论"活着没意思""如果我消失了"</li>
          <li>突然从极度抑郁变得"平静"（可能已做决定）</li>
          <li>近期有重大丧失事件后表现异常平静</li>
        </ul>
        <p class="pk-action">→ 请拨打 400-161-9995 或 120</p>
      </div>
      <div class="pk-card pk-warning">
        <h4>⚠️ 中度信号（尽快咨询）</h4>
        <ul>
          <li>连续两周以上情绪低落或过度焦虑</li>
          <li>严重失眠或嗜睡</li>
          <li>食欲/体重明显变化</li>
          <li>完全退出社交活动</li>
          <li>无法完成日常学习/工作</li>
          <li>频繁哭泣或情绪爆发</li>
          <li>酗酒或使用物质来应对情绪</li>
        </ul>
        <p class="pk-action">→ 预约学校心理咨询中心</p>
      </div>
      <div class="pk-card pk-notice">
        <h4>💡 早期信号（主动关注）</h4>
        <ul>
          <li>学习效率明显下降</li>
          <li>对以前喜欢的事物失去兴趣</li>
          <li>容易疲劳、精力不足</li>
          <li>人际关系变差、容易发火</li>
          <li>身体不适找不到病因(头痛/胃痛)</li>
          <li>开始回避某些场景或活动</li>
        </ul>
        <p class="pk-action">→ 使用本系统自评 + 尝试自助方法</p>
      </div>
    </div>
    <div class="pk-bystander">
      <h4>🤝 发现身边的人有以上信号？</h4>
      <ol>
        <li><b>直接问：</b>"你最近还好吗？我有些担心你。"</li>
        <li><b>倾听：</b>不评判、不说教、不急于给建议</li>
        <li><b>陪伴：</b>"我在这里，你不是一个人"</li>
        <li><b>引导求助：</b>"要不要我陪你去咨询中心？"</li>
        <li><b>告知：</b>如果他/她有自伤风险，必须告知辅导员或家长</li>
      </ol>
    </div>
  </div>`;
}
function pkCampus() {
  return `<div class="pk-section">
    <h3>🎓 校园常见心理议题</h3>
    <div class="pk-grid">
      <div class="pk-card">
        <h4>📝 考试焦虑</h4>
        <p><b>表现：</b>考前失眠、大脑空白、手心出汗、拖延复习</p>
        <p><b>应对策略：</b></p>
        <ul><li>考前用方块呼吸法降低唤醒度</li>
        <li>将"我会挂科"改为"我已经准备了能做的"</li>
        <li>番茄工作法（25分钟专注+5分钟休息）</li>
        <li>考前一天不再学新内容，做轻松复习</li></ul>
      </div>
      <div class="pk-card">
        <h4>💼 就业/考研焦虑</h4>
        <p><b>表现：</b>对未来感到恐慌、频繁和别人比较、决策困难</p>
        <p><b>应对策略：</b></p>
        <ul><li>明确价值排序：什么对你最重要？</li>
        <li>信息收集→选项排列→小步尝试→及时调整</li>
        <li>"他人的路径≠你的路径"</li>
        <li>允许不确定性存在，这是成长的一部分</li></ul>
      </div>
      <div class="pk-card">
        <h4>💔 失恋/感情问题</h4>
        <p><b>正常的悲伤过程：</b>否认→愤怒→讨价还价→抑郁→接受</p>
        <p><b>自我照顾：</b></p>
        <ul><li>允许自己难过，这是正常的</li>
        <li>减少接触对方的社交动态</li>
        <li>不要急着"快速恢复"，给自己时间</li>
        <li>超过1个月仍严重影响生活则需咨询</li></ul>
      </div>
      <div class="pk-card">
        <h4>🏠 宿舍/人际矛盾</h4>
        <p><b>常见原因：</b>作息不同、卫生习惯差异、价值观冲突</p>
        <p><b>应对策略：</b></p>
        <ul><li>非暴力沟通四步法：观察→感受→需求→请求</li>
        <li>"我感到(感受)，因为(需求)没被满足"</li>
        <li>设立合理边界 ≠ 自私</li>
        <li>无法调解时寻求辅导员帮助</li></ul>
      </div>
      <div class="pk-card">
        <h4>🎭 冒充者综合征</h4>
        <p><b>表现：</b>觉得自己配不上取得的成绩，害怕被"揭穿"</p>
        <p><b>事实：</b>70%的人会在人生某阶段体验到这种感受</p>
        <p><b>应对：</b></p>
        <ul><li>记录自己的真实成就和收到的正面反馈</li>
        <li>完美主义是冒充感的燃料——允许"足够好"</li>
        <li>和信任的人分享这种感受</li></ul>
      </div>
      <div class="pk-card">
        <h4>📵 手机依赖/拖延</h4>
        <p><b>心理机制：</b>即时满足 vs 延迟满足的神经博弈</p>
        <p><b>应对策略：</b></p>
        <ul><li>物理隔离：学习时手机放另一个房间</li>
        <li>用Forest/番茄钟等工具设定专注时段</li>
        <li>5分钟法则：只承诺做5分钟</li>
        <li>奖励自己：完成目标后安心刷手机</li></ul>
      </div>
    </div>
  </div>`;
}
