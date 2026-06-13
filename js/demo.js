// 动画演示脚本
const screen = document.getElementById('screen');
const stepInfo = document.getElementById('stepInfo');
const demoTitle = document.getElementById('demoTitle');

// 工具函数
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function setStep(text) {
  stepInfo.style.opacity = '1';
  stepInfo.textContent = text;
}

function render(html) {
  screen.innerHTML = html;
}

// 动画场景
async function runDemo() {
  await delay(500);
  demoTitle.style.opacity = '1';
  await delay(1000);

  // 场景1：首页
  await showHome();
  await delay(2500);

  // 场景2：答题过程
  await showQuestions();
  await delay(3000);

  // 场景3：答题动画
  await animateAnswering();
  await delay(2000);

  // 场景4：结果展示 - 绿色
  await showResultGreen();
  await delay(3500);

  // 场景5：结果展示 - 红色预警
  await showResultRed();
  await delay(4000);

  // 场景6：分级引导
  await showGuidance();
  await delay(3500);

  // 场景7：结束
  await showEnd();
}

// 场景1：首页
async function showHome() {
  setStep('步骤 1/6：欢迎首页');
  render(`
    <div style="padding:50px 24px;text-align:center;animation:slideUp 0.6s ease">
      <div style="font-size:48px;margin-bottom:20px">&#x1F49A;</div>
      <h2 style="font-size:20px;color:#4a4a8a;margin-bottom:8px">大学生心理健康自评</h2>
      <p style="color:#888;font-size:13px;margin-bottom:30px">关爱自己，从了解自己开始</p>
      <div style="display:flex;justify-content:center;gap:12px;margin-bottom:30px">
        <span style="display:flex;align-items:center;gap:4px;font-size:12px">
          <span style="width:10px;height:10px;border-radius:50%;background:#4caf50;display:inline-block"></span>健康</span>
        <span style="display:flex;align-items:center;gap:4px;font-size:12px">
          <span style="width:10px;height:10px;border-radius:50%;background:#ff9800;display:inline-block"></span>轻微</span>
        <span style="display:flex;align-items:center;gap:4px;font-size:12px">
          <span style="width:10px;height:10px;border-radius:50%;background:#f44336;display:inline-block"></span>中等</span>
        <span style="display:flex;align-items:center;gap:4px;font-size:12px">
          <span style="width:10px;height:10px;border-radius:50%;background:#9c27b0;display:inline-block"></span>需关注</span>
      </div>
      <p style="font-size:12px;color:#aaa;margin-bottom:30px;line-height:1.8">
        基于SCL-90量表<br>90道题 | 约10分钟 | 数据仅存本地
      </p>
      <div style="width:200px;margin:0 auto;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);
        color:#fff;border-radius:25px;font-size:16px;box-shadow:0 8px 20px rgba(102,126,234,0.3);
        animation:pulse 2s infinite">开始自评</div>
    </div>
    <style>
      @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
    </style>
  `);
}

// 场景2：题目展示
async function showQuestions() {
  setStep('步骤 2/6：答题界面');
  render(`
    <div style="padding:40px 20px;animation:slideUp 0.6s ease">
      <p style="font-size:12px;color:#888;text-align:center;margin-bottom:8px">第 1-10 题 / 共 90 题</p>
      <div style="width:100%;height:6px;background:#e0e0e0;border-radius:3px;margin-bottom:20px;overflow:hidden">
        <div style="width:11%;height:100%;background:linear-gradient(90deg,#667eea,#764ba2);border-radius:3px"></div>
      </div>
      <p style="font-size:11px;color:#aaa;text-align:center;margin-bottom:16px">请根据最近一周的感受作答</p>
      <div id="qList"></div>
    </div>
    <style>@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}</style>
  `);
  // 动态添加题目
  const questions = ['头痛', '神经过敏，心中不踏实', '头脑中有不必要的想法盘旋'];
  const qList = document.getElementById('qList');
  for (let i = 0; i < questions.length; i++) {
    await delay(400);
    const div = document.createElement('div');
    div.style.cssText = 'padding:12px;margin-bottom:10px;background:#fafafa;border-radius:8px;border-left:3px solid #667eea;opacity:0;transform:translateX(-20px);transition:all 0.4s';
    div.innerHTML = `<p style="font-size:13px;margin-bottom:8px"><span style="color:#667eea;font-weight:600">${i+1}.</span> ${questions[i]}</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <span style="padding:4px 10px;border:1.5px solid #e0e0e0;border-radius:14px;font-size:11px">没有</span>
        <span style="padding:4px 10px;border:1.5px solid #e0e0e0;border-radius:14px;font-size:11px">很轻</span>
        <span style="padding:4px 10px;border:1.5px solid #e0e0e0;border-radius:14px;font-size:11px">中等</span>
        <span style="padding:4px 10px;border:1.5px solid #e0e0e0;border-radius:14px;font-size:11px">偏重</span>
        <span style="padding:4px 10px;border:1.5px solid #e0e0e0;border-radius:14px;font-size:11px">严重</span>
      </div>`;
    qList.appendChild(div);
    await delay(50);
    div.style.opacity = '1';
    div.style.transform = 'translateX(0)';
  }
}

// 场景3：模拟选择动画
async function animateAnswering() {
  setStep('步骤 3/6：模拟作答过程');
  const options = document.querySelectorAll('#qList > div');
  for (let i = 0; i < options.length; i++) {
    await delay(600);
    const spans = options[i].querySelectorAll('span');
    const pick = spans[Math.floor(Math.random() * 3)]; // 随机选前3个
    pick.style.background = '#667eea';
    pick.style.color = '#fff';
    pick.style.borderColor = '#667eea';
    pick.style.transition = 'all 0.3s';
  }
  // 进度条动画
  await delay(500);
  const bar = document.querySelector('#screen div div div');
  if (bar) {
    bar.style.transition = 'width 2s ease';
    bar.style.width = '100%';
  }
}

// 场景4：绿色结果
async function showResultGreen() {
  setStep('步骤 4/6：评估结果 - 心理健康');
  render(`
    <div style="padding:40px 20px;animation:slideUp 0.6s ease">
      <h3 style="text-align:center;color:#4a4a8a;font-size:16px;margin-bottom:20px">评估结果</h3>
      <div style="text-align:center;padding:24px;background:#e8f5e9;border:2px solid #4caf50;border-radius:12px;
        animation:scaleIn 0.5s ease">
        <div style="font-size:40px;margin-bottom:8px">&#x1F7E2;</div>
        <div style="font-size:18px;font-weight:600;color:#2e7d32;margin-bottom:6px">心理状态良好</div>
        <div style="font-size:12px;color:#666">您的心理状态处于健康水平，请继续保持</div>
        <div style="margin-top:10px;font-size:11px;color:#aaa">总均分：1.23 | 阳性项目：12</div>
      </div>
      <div id="factorBars" style="margin-top:20px"></div>
    </div>
    <style>
      @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
    </style>
  `);
  // 动画柱状图
  const factors = [
    {name:'躯体化',score:1.2},{name:'强迫',score:1.4},{name:'人际关系',score:1.3},
    {name:'抑郁',score:1.1},{name:'焦虑',score:1.3}
  ];
  const container = document.getElementById('factorBars');
  for (const f of factors) {
    await delay(300);
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;margin-bottom:8px;opacity:0;transition:opacity 0.3s';
    const w = (f.score / 5) * 100;
    div.innerHTML = `<span style="width:60px;font-size:11px;text-align:right;padding-right:8px;color:#666">${f.name}</span>
      <div style="flex:1;height:14px;background:#f0f0f0;border-radius:7px;overflow:hidden">
        <div style="height:100%;width:0%;background:#4caf50;border-radius:7px;transition:width 0.8s ease"></div>
      </div>
      <span style="width:30px;font-size:11px;text-align:center;color:#888">${f.score}</span>`;
    container.appendChild(div);
    div.style.opacity = '1';
    await delay(100);
    div.querySelector('div > div').style.width = w + '%';
  }
}

// 场景5：红色预警结果
async function showResultRed() {
  setStep('步骤 5/6：预警触发 - 需要关注');
  render(`
    <div style="padding:40px 20px;animation:slideUp 0.6s ease">
      <h3 style="text-align:center;color:#4a4a8a;font-size:16px;margin-bottom:20px">评估结果</h3>
      <div style="text-align:center;padding:24px;background:#fce4ec;border:2px solid #e91e63;border-radius:12px;
        animation:scaleIn 0.5s ease">
        <div style="font-size:40px;margin-bottom:8px">&#x1F534;</div>
        <div style="font-size:18px;font-weight:600;color:#c62828;margin-bottom:6px">需要专业帮助</div>
        <div style="font-size:12px;color:#666">请尽快联系辅导员或心理咨询中心</div>
      </div>
      <div id="alertBox" style="opacity:0;transition:opacity 0.8s;margin-top:16px"></div>
    </div>
    <style>
      @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes blink{0%,100%{box-shadow:0 0 0 0 rgba(244,67,54,0.4)}50%{box-shadow:0 0 0 8px rgba(244,67,54,0)}}
    </style>
  `);
  await delay(1000);
  const alertBox = document.getElementById('alertBox');
  alertBox.style.opacity = '1';
  alertBox.innerHTML = `
    <div style="background:#fff0f0;border:2px solid #f44336;border-radius:10px;padding:16px;
      animation:blink 2s infinite">
      <p style="color:#d32f2f;font-weight:600;font-size:14px;margin-bottom:10px">&#9888;&#65039; 预警提示</p>
      <p style="font-size:12px;line-height:2;color:#555">
        建议尽快联系辅导员或心理咨询中心<br>
        <b style="color:#d32f2f">心理援助热线：400-161-9995</b><br>
        <b style="color:#d32f2f">危机干预热线：010-82951332</b><br>
        <span style="color:#888">您并不孤单，专业帮助就在身边</span>
      </p>
    </div>`;
}

// 场景6：分级引导
async function showGuidance() {
  setStep('步骤 6/6：分级引导建议');
  render(`
    <div style="padding:40px 20px;animation:slideUp 0.6s ease">
      <h3 style="text-align:center;color:#4a4a8a;font-size:16px;margin-bottom:20px">四级响应机制</h3>
      <div id="levels"></div>
    </div>
    <style>@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}</style>
  `);
  const levels = [
    { color: '#4caf50', bg: '#e8f5e9', title: '绿色 - 自我保持', desc: '规律作息、正念练习' },
    { color: '#ff9800', bg: '#fff3e0', title: '黄色 - 自助调节', desc: '情绪日记、放松技巧' },
    { color: '#f44336', bg: '#fbe9e7', title: '橙色 - 建议咨询', desc: '预约心理中心面谈' },
    { color: '#9c27b0', bg: '#f3e5f5', title: '红色 - 紧急干预', desc: '立即联系辅导员/热线' }
  ];
  const container = document.getElementById('levels');
  for (const lv of levels) {
    await delay(600);
    const div = document.createElement('div');
    div.style.cssText = `display:flex;align-items:center;gap:12px;padding:14px;margin-bottom:10px;
      background:${lv.bg};border-left:4px solid ${lv.color};border-radius:8px;
      opacity:0;transform:translateX(-20px);transition:all 0.4s`;
    div.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:${lv.color};flex-shrink:0"></div>
      <div><p style="font-size:13px;font-weight:600;color:#333">${lv.title}</p>
      <p style="font-size:11px;color:#888;margin-top:2px">${lv.desc}</p></div>`;
    container.appendChild(div);
    await delay(50);
    div.style.opacity = '1';
    div.style.transform = 'translateX(0)';
  }
}

// 场景7：结束
async function showEnd() {
  setStep('演示完成');
  render(`
    <div style="padding:60px 24px;text-align:center;animation:slideUp 0.6s ease">
      <div style="font-size:60px;margin-bottom:20px">&#x2705;</div>
      <h2 style="font-size:20px;color:#4a4a8a;margin-bottom:12px">演示完成</h2>
      <p style="color:#888;font-size:13px;line-height:1.8;margin-bottom:30px">
        本系统参考国内外先进心理健康模式<br>
        采用MHC心理健康连续体四色分级<br>
        实现"评估-分级-引导-预警"一体化
      </p>
      <div style="padding:16px;background:#f8f9ff;border-radius:10px;text-align:left;font-size:12px;color:#666;line-height:2">
        <b style="color:#4a4a8a">核心特色：</b><br>
        - SCL-90 专业量表<br>
        - 四色等级直观展示<br>
        - 分级引导建议<br>
        - 自动预警机制<br>
        - 隐私数据仅存本地
      </div>
      <div onclick="runDemo()" style="margin-top:30px;padding:10px 24px;background:linear-gradient(135deg,#667eea,#764ba2);
        color:#fff;border-radius:20px;display:inline-block;font-size:14px;cursor:pointer">重新播放</div>
    </div>
    <style>@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}</style>
  `);
}

// 启动演示
runDemo();