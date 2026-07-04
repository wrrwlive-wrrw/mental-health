// 风水大师·AI分析引擎（SiliconFlow API）

async function fsLabAIAnalyze(tab, userMsg, imageData) {
  const sysPr = getFsLabSystemPrompt(tab);
  // 构建历史（排除最后一条用户消息，因为会单独加）
  const allHist = (fsLabHistory[tab] || []).filter(m => m.role);
  const hist = allHist.slice(0, -1).slice(-10);
  const messages = [{role:'system', content:sysPr}];

  hist.forEach(m => {
    if (m.role === 'user') messages.push({role:'user', content: m.content || m.text || ''});
    else if (m.role === 'assistant') messages.push({role:'assistant', content: m.content.replace(/<[^>]*>/g,'').slice(0,500)});
  });

  let finalMsg = userMsg;
  if (imageData) {
    finalMsg += '\n[用户上传了一张图片，请根据图片内容进行相关分析。图片类型可能是：面相照片、手掌照片、房屋/户型图、院落照片等]';
  }
  messages.push({role:'user', content: finalMsg});

  // 加载态
  addFsLabMsg(tab, {role:'assistant', content:'<span class="fs-lab-loading">🔮 大师正在分析中...</span>'});

  // 读取API配置（与心理辅导模块共用同一套配置）
  const apiKey = localStorage.getItem('mh_ai_key') || 'sk-fefqgtifrqqmjgclpeketqhcszaylmewsxbpamxyepxhgjxa';
  const model = localStorage.getItem('mh_ai_model') || 'Qwen/Qwen3-8B';
  const storedUrl = localStorage.getItem('mh_ai_url') || '';
  // chat.js存的是完整url(含/chat/completions)，这里只要baseUrl
  const baseUrl = storedUrl ? storedUrl.replace(/\/chat\/completions\/?$/, '') : 'https://api.siliconflow.cn/v1';

  try {
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 3000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`API ${resp.status}: ${errText.slice(0,200)}`);
    }

    const data = await resp.json();
    let answer = data.choices?.[0]?.message?.content || '';

    // Qwen3 有时会返回 <think>...</think> 包裹的内容，提取实际回复
    if (answer.includes('</think>')) {
      answer = answer.split('</think>').pop().trim();
    }
    if (!answer) answer = '分析完成，但未获取到有效回复，请重试。';

    const hArr = fsLabHistory[tab];
    if (hArr && hArr.length) hArr[hArr.length - 1] = {role:'assistant', content: formatFsAnswer(answer)};
    refreshFsLab(tab);
    fsLabSpeak(answer);
  } catch(e) {
    console.error('风水AI分析错误:', e);
    const hArr = fsLabHistory[tab];
    const isKeyError = e.message && (e.message.includes('invalid') || e.message.includes('401') || e.message.includes('403'));
    const keyTip = isKeyError ? '<br><br><b>🔑 解决方法：</b>请到首页→AI智能心理辅导→API设置中填入有效的API Key。<br>免费申请：<a href="https://cloud.siliconflow.cn" target="_blank" style="color:#667eea">SiliconFlow(免费)</a> 注册后获取Key即可。' : '';
    const errMsg = `<span style="color:#c17817">⚠️ AI连接失败${isKeyError?'(API Key无效)':''}</span>${keyTip}<br><br>${getFsLabFallback(tab, userMsg)}`;
    if (hArr && hArr.length) hArr[hArr.length - 1] = {role:'assistant', content: errMsg};
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
    divine: '此卦上卦为乾（天），下卦为坤（地），为天地否卦之象。当前虽有阻滞，但否极泰来，困难是暂时的。建议静待时机，修身养性，来年运势自然通达。',
    yangsheng: '《黄帝内经》云："法于阴阳，和于术数，食饮有节，起居有常，不妄作劳。"养生之道在于中和有节。建议您：①早睡早起顺应子午流注；②饮食温补不过辛辣；③适度运动如八段锦、站桩；④保持心态平和。如需个性化调养建议，请填写个人信息后提问。',
    business: '从商道角度分析，陶朱公有训："能识人、能用人、能知机"为经商三要。结合您的情况：①选择与自身五行相生的行业更顺畅；②开业择吉日有助于气场顺遂；③商铺风水以明堂开阔、人气聚集为上。建议填写个人信息，获取更精准的财运分析。',
    official: '从仕途命理角度，《素书》云："贤人君子，非义不动，非礼不言。"为官之道首在德行。八字中正官格者适合体制内循序晋升，七杀格者适合执法、军警等需魄力之职。建议填写出生信息，为您详细分析官禄宫与当前大运走势。'
  };
  return fallbacks[tab] || '请您提供更多信息，大师将为您详细分析。※ 传统文化仅供参考，理性看待。';
}
