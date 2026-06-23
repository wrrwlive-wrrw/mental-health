// 心理健康评估 - 核心逻辑
const PAGE_SIZE = 10;
let currentPage = 0;
let answers = {};

// 初始化
function init() {
  // 登录状态由 user.js 的 checkAuth 控制页面跳转
}

// 页面切换
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

// 开始评估
function startTest() {
  currentPage = 0;
  answers = {};
  renderQuestions();
  showPage('test');
}

// 渲染题目
function renderQuestions() {
  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, SCL90_QUESTIONS.length);
  const total = SCL90_QUESTIONS.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 进度
  const progress = Math.round((start / total) * 100);
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressText').textContent =
    `第 ${start + 1}-${end} 题 / 共 ${total} 题`;

  // 题目列表
  const container = document.getElementById('questionList');
  let html = '';
  for (let i = start; i < end; i++) {
    const selected = answers[i + 1] || 0;
    html += `<div class="question-item">
      <div class="question-text"><span class="question-num">${i + 1}.</span> ${SCL90_QUESTIONS[i]}</div>
      <div class="options">`;
    const labels = ['没有', '很轻', '中等', '偏重', '严重'];
    for (let v = 1; v <= 5; v++) {
      const sel = selected === v ? ' selected' : '';
      html += `<label class="option-label${sel}" onclick="selectOption(${i + 1},${v},this)">
        <input type="radio" name="q${i+1}" value="${v}"> ${labels[v-1]}
      </label>`;
    }
    html += '</div></div>';
  }
  container.innerHTML = html;

  // 按钮状态
  document.getElementById('btnPrev').disabled = currentPage === 0;
  const btnNext = document.getElementById('btnNext');
  if (currentPage === totalPages - 1) {
    btnNext.textContent = '提交评估';
  } else {
    btnNext.textContent = '下一页';
  }
}

// 选择选项
function selectOption(qNum, value, el) {
  answers[qNum] = value;
  const parent = el.parentElement;
  parent.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
  el.classList.add('selected');
}

// 上一页
function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderQuestions();
    window.scrollTo(0, 0);
  }
}

// 下一页/提交
function nextPage() {
  const totalPages = Math.ceil(SCL90_QUESTIONS.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, SCL90_QUESTIONS.length);
  for (let i = start; i < end; i++) {
    if (!answers[i + 1]) {
      alert(`请完成第 ${i + 1} 题后再继续`);
      return;
    }
  }
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderQuestions();
    window.scrollTo(0, 0);
  } else {
    calculateResult();
  }
}

// 计算结果
function calculateResult() {
  const total = SCL90_QUESTIONS.length;
  let totalScore = 0;
  let positiveCount = 0;

  for (let i = 1; i <= total; i++) {
    const score = answers[i] || 1;
    totalScore += score;
    if (score >= 2) positiveCount++;
  }

  const avgScore = (totalScore / total).toFixed(2);

  const factors = {};
  for (const [key, factor] of Object.entries(SCL90_FACTORS)) {
    let sum = 0;
    factor.items.forEach(item => { sum += answers[item] || 1; });
    factors[key] = {
      name: factor.name,
      score: (sum / factor.items.length).toFixed(2)
    };
  }

  const level = getLevel(parseFloat(avgScore), factors, positiveCount);
  renderResult(avgScore, positiveCount, totalScore, factors, level);
  // 保存评估结果到当前用户档案
  saveTestToUser(avgScore, positiveCount, level, factors);
  showPage('result');
}

// 四色等级判定
function getLevel(avg, factors, positiveCount) {
  const maxFactor = Math.max(...Object.values(factors).map(f => parseFloat(f.score)));
  if (avg >= 2.5 || maxFactor >= 3.0 || positiveCount >= 43) return 'red';
  if (avg >= 2.0 || maxFactor >= 2.5) return 'orange';
  if (avg >= 1.5 || maxFactor >= 2.0) return 'yellow';
  return 'green';
}

// 渲染结果
function renderResult(avgScore, positiveCount, totalScore, factors, level) {
  const levelConfig = {
    green: { icon: '&#x1F7E2;', title: '心理状态良好', cls: 'level-green',
      desc: '您的心理状态处于健康水平，请继续保持。' },
    yellow: { icon: '&#x1F7E1;', title: '轻微心理困扰', cls: 'level-yellow',
      desc: '您存在轻微心理困扰，建议关注自身情绪变化。' },
    orange: { icon: '&#x1F7E0;', title: '中等心理困扰', cls: 'level-orange',
      desc: '您的心理状态需要关注，建议寻求专业帮助。' },
    red: { icon: '&#x1F534;', title: '需要专业帮助', cls: 'level-red',
      desc: '您的心理状态需要重点关注，请尽快联系辅导员或心理咨询中心。' }
  };

  const cfg = levelConfig[level];
  const resultContainer = document.getElementById('resultContent');

  let html = `<div class="result-level ${cfg.cls}">
    <div class="level-icon">${cfg.icon}</div>
    <div class="level-title">${cfg.title}</div>
    <div class="level-desc">${cfg.desc}</div>
    <div style="margin-top:12px;font-size:13px;color:#888">
      总均分：${avgScore} | 阳性项目：${positiveCount} | 总分：${totalScore}
    </div>
  </div>`;

  // 预警框
  if (level === 'red') {
    html += `<div class="alert-box">
      <div class="alert-title">&#9888;&#65039; 预警提示</div>
      <div class="alert-content">
        建议您尽快联系辅导员或心理咨询中心<br>
        <span class="alert-phone">全国心理援助热线：400-161-9995</span><br>
        <span class="alert-phone">危机干预热线：010-82951332</span><br>
        <span class="alert-phone">生命热线：400-821-1215</span><br>
        <br>您并不孤单，专业帮助就在身边。
      </div>
    </div>`;
  }

  // 因子图表
  html += '<h3 style="margin:25px 0 15px;font-size:16px;color:#4a4a8a">各因子得分</h3>';
  html += '<div class="factor-chart">';
  const colors = ['#4caf50','#8bc34a','#cddc39','#ffeb3b','#ffc107',
                  '#ff9800','#ff5722','#f44336','#e91e63','#9c27b0'];
  let idx = 0;
  for (const [key, f] of Object.entries(factors)) {
    const width = Math.min((parseFloat(f.score) / 5) * 100, 100);
    const color = parseFloat(f.score) >= 3 ? '#f44336' :
                  parseFloat(f.score) >= 2 ? '#ff9800' : colors[idx];
    html += `<div class="factor-item">
      <span class="factor-name">${f.name}</span>
      <div class="factor-bar-bg">
        <div class="factor-bar" style="width:${width}%;background:${color}"></div>
      </div>
      <span class="factor-score">${f.score}</span>
    </div>`;
    idx++;
  }
  html += '</div>';

  // 分级建议
  html += renderSuggestions(level);

  // 重新评估按钮
  html += `<button class="btn btn-primary" onclick="startTest()" style="margin-top:30px">
    重新评估</button>`;

  resultContainer.innerHTML = html;
}

// 分级建议
function renderSuggestions(level) {
  const suggestions = {
    green: {
      title: '保持良好状态的建议',
      items: [
        '继续保持规律作息和适当运动',
        '维持良好的社交关系',
        '定期进行正念冥想或放松练习',
        '每学期可定期自评，关注心理变化'
      ]
    },
    yellow: {
      title: '自助调节建议',
      items: [
        '尝试记录情绪日记，觉察自身状态',
        '学习深呼吸、渐进式肌肉放松等技巧',
        '适当增加运动频率，每周至少3次',
        '与信任的朋友或家人聊聊近况',
        '关注学校心理健康公众号获取更多资源'
      ]
    },
    orange: {
      title: '建议寻求支持',
      items: [
        '建议预约学校心理咨询中心进行面谈',
        '可参加学校组织的团体心理辅导活动',
        '与辅导员沟通近期困扰',
        '减少独处时间，多参与集体活动',
        '如有睡眠问题，建议就医咨询'
      ]
    },
    red: {
      title: '请尽快寻求专业帮助',
      items: [
        '请立即联系辅导员或心理咨询中心',
        '如有自伤想法，请拨打心理援助热线',
        '告知信任的人您目前的状态',
        '避免独处，保持与他人联系',
        '专业帮助能有效改善当前状况，请不要独自承受'
      ]
    }
  };

  const s = suggestions[level];
  let html = `<div class="suggestion-box">
    <div class="suggestion-title">${s.title}</div>
    <ul class="suggestion-list">`;
  s.items.forEach(item => { html += `<li>${item}</li>`; });
  html += '</ul></div>';
  return html;
}

// 保存评估结果到用户档案
function saveTestToUser(avgScore, positiveCount, level, factors) {
  const uid = localStorage.getItem('mh_current');
  if (!uid) return;
  const users = JSON.parse(localStorage.getItem('mh_users') || '[]');
  const user = users.find(u => u.id === uid);
  if (!user) return;
  if (!user.testHistory) user.testHistory = [];
  user.testHistory.push({
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString(),
    avgScore, positiveCount, level,
    topFactors: Object.entries(factors)
      .sort((a, b) => parseFloat(b[1].score) - parseFloat(a[1].score))
      .slice(0, 3)
      .map(([k, v]) => v.name + ':' + v.score)
  });
  localStorage.setItem('mh_users', JSON.stringify(users));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);