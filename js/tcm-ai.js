// 中医智能诊疗 - AI分析引擎
let tcmChatHistory = {}; // { consultation: [...], drugguide: [...] }
let tcmIsResponding = false;

// 调用AI分析
async function tcmCallAI(type, userMsg, imageData) {
  if (!AI_CONFIG.apiKey) {
    return getTcmFallback(type, userMsg);
  }
  const patient = getTcmCurrentPatient();
  const patientInfo = formatPatientForPrompt(patient);

  // 根据类型选择prompt
  let sysPrompt = '';
  switch(type) {
    case 'consultation': sysPrompt = getTcmConsultPrompt(patientInfo); break;
    case 'syndrome': sysPrompt = getTcmSyndromePrompt(patientInfo, userMsg); break;
    case 'prescription': sysPrompt = getTcmPrescriptionPrompt(patientInfo, userMsg); break;
    case 'drugguide': sysPrompt = getTcmDrugPrompt(); break;
    default: sysPrompt = getTcmBasePrompt();
  }

  // 构建消息上下文
  const history = (tcmChatHistory[type] || []).slice(-10);
  const messages = [{ role:'system', content: sysPrompt }];
  history.forEach(m => {
    messages.push({ role: m.role==='user'?'user':'assistant', content: m.content });
  });
  if (userMsg && type !== 'syndrome') {
    messages.push({ role:'user', content: userMsg });
  }

  try {
    tcmIsResponding = true;
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+AI_CONFIG.apiKey },
      body: JSON.stringify({ model: AI_CONFIG.model, messages, max_tokens: 2000, temperature: 0.7 })
    });
    if (!resp.ok) throw new Error('HTTP '+resp.status);
    const data = await resp.json();
    let answer = data.choices?.[0]?.message?.content || '';
    // 去除Qwen思考链
    if (answer.includes('</think>')) answer = answer.split('</think>').pop().trim();
    tcmIsResponding = false;
    return answer;
  } catch(e) {
    console.warn('TCM AI调用失败:', e.message);
    tcmIsResponding = false;
    return '[AI离线] ' + getTcmFallback(type, userMsg);
  }
}

// 格式化AI回复为HTML
function formatTcmAnswer(text) {
  return text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/【(.*?)】/g,'<b style="color:#2e7d32">【$1】</b>');
}

// 保存对话历史
function addTcmChat(type, role, content) {
  if (!tcmChatHistory[type]) tcmChatHistory[type] = [];
  tcmChatHistory[type].push({ role, content, time: new Date().toLocaleTimeString() });
  // 限制50条
  if (tcmChatHistory[type].length > 50) tcmChatHistory[type] = tcmChatHistory[type].slice(-50);
}

// 离线兜底回复
function getTcmFallback(type, msg) {
  const fallbacks = {
    consultation: '请配置AI API Key后使用智能问诊功能。您可以先使用结构化表单录入四诊信息。\n\n如需配置，请返回首页 → AI心理辅导 → 点击设置按钮配置API。推荐使用Groq（免费、速度快）。',
    syndrome: '辨证分析需要AI支持，请先配置API Key。\n\n基本辨证思路：\n1. 八纲辨证：分阴阳、表里、寒热、虚实\n2. 脏腑辨证：确定病变脏腑\n3. 综合分析病因病机',
    prescription: '处方建议需要AI支持，请先配置API Key。\n\n基本处方原则：\n1. 方从法出，法随证立\n2. 君臣佐使，配伍严谨\n3. 注意十八反、十九畏',
    drugguide: '用药指导需要AI支持，请先配置API Key。\n\n基本煎药法：\n1. 先浸泡30分钟\n2. 武火煮沸后文火煎煮\n3. 一般煎两次，合并服用\n4. 解表药不宜久煎，补益药宜久煎'
  };
  return fallbacks[type] || '请配置AI API Key以使用此功能。';
}
