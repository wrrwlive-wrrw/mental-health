// 风水大师·AI分析引擎（SiliconFlow API）

async function fsLabAIAnalyze(tab, userMsg, imageData) {
  const sysPr = getFsLabSystemPrompt(tab);
  const hist = (fsLabHistory[tab] || []).filter(m => m.role).slice(-10);
  const messages = [{role:'system', content:sysPr}];

  hist.forEach(m => {
    if (m.role === 'user') messages.push({role:'user', content: m.content || m.text || ''});
    else if (m.role === 'assistant') messages.push({role:'assistant', content: m.content});
  });

  // 如果有图片，描述给AI
  let finalMsg = userMsg;
  if (imageData) {
    finalMsg += '\n[用户上传了一张图片，请根据图片内容进行相关分析。图片类型可能是：面相照片、手掌照片、房屋/户型图、院落照片等]';
  }
  messages.push({role:'user', content: finalMsg});

  // 加载态
  addFsLabMsg(tab, {role:'assistant', content:'<span class="fs-lab-loading">🔮 大师正在分析中...</span>'});

  const settings = JSON.parse(localStorage.getItem('mh_ai_settings') || '{}');
  const apiKey = settings.apiKey || 'sk-fefqgtifrqqmjgclpeketqhcszaylmewsxbpamxyepxhgjxa';
  const model = settings.model || 'Qwen/Qwen3-8B';
  const baseUrl = settings.baseUrl || 'https://api.siliconflow.cn/v1';

  try {
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body: JSON.stringify({ model, messages, max_tokens: 3000, temperature: 0.7 })
    });
    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content || '抱歉，分析暂时无法完成，请稍后重试。';
    // 替换掉加载消息
    const hArr = fsLabHistory[tab];
    if (hArr && hArr.length) hArr[hArr.length - 1] = {role:'assistant', content: formatFsAnswer(answer)};
    refreshFsLab(tab);
    fsLabSpeak(answer);
  } catch(e) {
    const hArr = fsLabHistory[tab];
    if (hArr && hArr.length) hArr[hArr.length - 1] = {role:'assistant', content: getFsLabFallback(tab, userMsg)};
    refreshFsLab(tab);
  }
}

// 刷新消息列表
function refreshFsLab(tab) {
  const el = document.getElementById(`fsLabMsgs_${tab}`);
  if (!el) return;
  el.innerHTML = (fsLabHistory[tab]||[]).map(m => renderFsLabMsg(m)).join('');
  el.scrollTop = el.scrollHeight;
}

// 格式化AI回答
function formatFsAnswer(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/【(.*?)】/g, '<b style="color:#8b6914">【$1】</b>');
}

// 离线兜底回复
function getFsLabFallback(tab, msg) {
  const fallbacks = {
    fengshui: '根据您的描述，此宅坐北朝南，符合"坐实向虚"之理。大门位置需注意是否正对电梯口形成穿堂煞。建议在玄关处摆放绿植或屏风化解。如需详细分析，请上传户型图。',
    xiangshu: '从您描述的面部特征来看，天庭饱满主早年运势顺遂，鼻梁挺直主中年财运稳健。眉目清秀者多主聪慧好学。建议保持心态平和，相由心生，好心态自有好面相。',
    ziwei: '根据您的出生信息，命宫主星显示您性格中有领导力与创造力的一面。今年流年走事业宫，适合把握机遇、积极进取。感情方面宜主动沟通，忌过于矜持。',
    bazi: '从四柱排列来看，日主属性与当前大运形成良好配合。今年流年天干生扶日主，整体运势向好。财运方面宜稳不宜急，事业方面有贵人相助之象。',
    divine: '此卦上卦为乾（天），下卦为坤（地），为天地否卦之象。当前虽有阻滞，但否极泰来，困难是暂时的。建议静待时机，修身养性，来年运势自然通达。'
  };
  return fallbacks[tab] || '请您提供更多信息，大师将为您详细分析。';
}
