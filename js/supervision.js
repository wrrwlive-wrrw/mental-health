// AI督导评估模块
const SUPERVISION_DIMS = [
  {key:'empathy', name:'共情能力', desc:'是否准确识别和反映来访者情感'},
  {key:'questioning', name:'提问技术', desc:'提问是否开放、有深度、有方向'},
  {key:'alliance', name:'治疗联盟', desc:'是否建立安全信任的咨询关系'},
  {key:'ethics', name:'伦理意识', desc:'是否遵守保密、边界等伦理原则'},
  {key:'conceptualization', name:'案例概念化', desc:'是否形成清晰的问题理解框架'},
  {key:'crisis', name:'危机处理', desc:'是否识别风险并适当干预'}
];

// 获取督导历史
function getSupervisionHistory() {
  return JSON.parse(localStorage.getItem('mh_supervision') || '[]');
}
function saveSupervision(report) {
  const history = getSupervisionHistory();
  history.push(report);
  if (history.length > 50) history.splice(0, history.length - 50);
  localStorage.setItem('mh_supervision', JSON.stringify(history));
}

// 对话结束后触发AI督导评估
async function runSupervision() {
  if (!AI_CONFIG.apiKey) {
    renderSupervisionReport(getLocalSupervision());
    return;
  }
  const msgs = chatHistory.filter(m => m.role !== 'system' || !m.text.includes('【案例'));
  if (msgs.length < 4) {
    updateVoiceStatus('对话太短，无法评估');
    return;
  }
  const dialog = msgs.map(m => (m.role === 'system' ? '咨询师' : '来访者') + '：' + m.text).join('\n');

  const prompt = `作为心理咨询督导，请对以下咨询对话进行专业评估。
评估6个维度（每项0-100分），并给出具体反馈。

【对话记录】
${dialog.slice(0, 2000)}

请严格按以下JSON格式返回（不要其他内容）：
{"empathy":分数,"questioning":分数,"alliance":分数,"ethics":分数,"conceptualization":分数,"crisis":分数,"feedback":"总体反馈文字","strengths":"做得好的地方","improvements":"需要改进的地方"}`;

  try {
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AI_CONFIG.apiKey
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{role:'user', content: prompt}],
        max_tokens: 500, temperature: 0.4
      })
    });
    if (!resp.ok) throw new Error('API错误');
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const report = JSON.parse(match[0]);
      report.time = new Date().toISOString();
      report.caseTitle = window.currentTrainCase?.title || '自由对话';
      saveSupervision(report);
      renderSupervisionReport(report);
    } else {
      renderSupervisionReport(getLocalSupervision());
    }
  } catch(e) {
    console.warn('督导评估失败:', e.message);
    renderSupervisionReport(getLocalSupervision());
  }
}

// 本地备用评估
function getLocalSupervision() {
  return {empathy:65,questioning:60,alliance:70,ethics:75,conceptualization:55,crisis:70,
    feedback:'对话整体表现尚可，建议增加更多开放式提问。',
    strengths:'态度温和，有基本的倾听能力。',improvements:'共情深度不够，建议多反映来访者的情感。',
    time:new Date().toISOString(), caseTitle:window.currentTrainCase?.title||'自由对话'};
}

// 渲染督导评估报告
function renderSupervisionReport(report) {
  const el = document.getElementById('supervisionContent');
  if (!el) { showPage('supervision'); setTimeout(() => renderSupervisionReport(report), 100); return; }
  const dimColors = {empathy:'#667eea',questioning:'#4caf50',alliance:'#ff9800',ethics:'#9c27b0',conceptualization:'#2196f3',crisis:'#f44336'};
  let totalScore = 0;
  let html = `<div class="supervision-report">
    <h3 style="text-align:center;margin-bottom:15px">📋 督导评估报告</h3>
    <p style="text-align:center;color:#888;font-size:13px">案例：${report.caseTitle} | ${new Date(report.time).toLocaleString()}</p>
    <div class="factor-chart" style="margin:20px 0">`;
  SUPERVISION_DIMS.forEach(dim => {
    const score = report[dim.key] || 0;
    totalScore += score;
    const width = Math.min(score, 100);
    html += `<div class="factor-item">
      <span class="factor-name">${dim.name}</span>
      <div class="factor-bar-bg"><div class="factor-bar" style="width:${width}%;background:${dimColors[dim.key]}"></div></div>
      <span class="factor-score">${score}</span>
    </div>`;
  });
  const avg = Math.round(totalScore / 6);
  html += `</div><div style="text-align:center;margin:15px 0">
    <span style="font-size:24px;font-weight:700;color:#667eea">${avg}</span><span style="color:#888"> /100 综合评分</span></div>`;
  html += `<div class="suggestion-box"><div class="suggestion-title">💪 做得好</div><p style="font-size:14px;line-height:1.8">${report.strengths||''}</p></div>`;
  html += `<div class="suggestion-box" style="margin-top:12px;border-left:3px solid #ff9800"><div class="suggestion-title">📈 待改进</div><p style="font-size:14px;line-height:1.8">${report.improvements||''}</p></div>`;
  html += `<div class="suggestion-box" style="margin-top:12px"><div class="suggestion-title">📝 总体反馈</div><p style="font-size:14px;line-height:1.8">${report.feedback||''}</p></div>`;
  html += '</div>';
  el.innerHTML = html + renderSupervisionHistory();
  showPage('supervision');
}

// 渲染督导历史
function renderSupervisionHistory() {
  const history = getSupervisionHistory();
  if (!history.length) return '';
  let html = '<h3 style="margin-top:25px;font-size:16px;color:#4a4a8a">历史评估记录</h3><div class="supervision-history">';
  history.slice(-10).reverse().forEach(r => {
    const avg = Math.round((r.empathy+r.questioning+r.alliance+r.ethics+r.conceptualization+r.crisis)/6);
    html += `<div class="case-card" style="cursor:default">
      <div class="case-header"><span class="case-title">${r.caseTitle}</span><span class="tag tag-blue">${avg}分</span></div>
      <div class="case-meta">${new Date(r.time).toLocaleString()}</div>
    </div>`;
  });
  html += '</div>';
  return html;
}

// 渲染督导主页
function renderSupervision() {
  const el = document.getElementById('supervisionContent');
  if (!el) return;
  const history = getSupervisionHistory();
  let html = '<p style="text-align:center;color:#666;margin-bottom:20px">完成案例对话练习后，AI督导将从6个维度评估你的咨询能力</p>';
  html += '<div class="supervision-dims">';
  SUPERVISION_DIMS.forEach(dim => {
    html += `<div class="knowledge-card mini"><strong>${dim.name}</strong><br><span style="font-size:12px;color:#888">${dim.desc}</span></div>`;
  });
  html += '</div>';
  if (history.length) {
    html += renderSupervisionHistory();
  } else {
    html += '<p style="text-align:center;color:#aaa;margin-top:30px">暂无评估记录，请先完成案例练习</p>';
  }
  html += `<button class="btn btn-primary" style="margin-top:20px" onclick="showPage('cases');renderCases()">去练习案例</button>`;
  el.innerHTML = html;
}
