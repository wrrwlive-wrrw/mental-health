// 药食同源 - AI食疗师智能体
let fmAiMessages = [];
let fmAiMode = 'food';
let fmAiLoading = false;

const FM_AI_MODES = {
  food: {name:'🍲 食疗推荐',desc:'根据症状推荐药膳食疗方案'},
  tea:  {name:'🍵 茶饮推荐',desc:'根据需求推荐养生茶饮'},
  body: {name:'🔍 体质分析',desc:'分析体质类型给出饮食建议'},
  taboo:{name:'⚠️ 饮食禁忌',desc:'查询食物搭配禁忌与注意事项'}
};

function buildFmSystemPrompt() {
  let prompt = `你是一位资深药食同源食疗师，精通中医食疗理论、药膳配方和养生茶饮。
你的职责是根据用户的身体状况和需求，提供科学、安全、个性化的食疗方案。

【工作原则】
1. 所有建议基于药食同源理论，使用卫健委公布的药食同源目录食材
2. 必须考虑用户的过敏史、慢性病、饮食禁忌
3. 方案需包含：食材配方、用量、做法、功效、适用人群、禁忌
4. 重要提醒：食疗不替代医疗，严重疾病请就医

【当前模式】${FM_AI_MODES[fmAiMode].name} - ${FM_AI_MODES[fmAiMode].desc}`;

  // 注入健康档案
  const profile = typeof getFmCurrentProfile==='function'?getFmCurrentProfile():null;
  if(profile) {
    prompt += `\n\n【用户健康档案】
姓名:${profile.name} 性别:${profile.gender} 年龄:${profile.age}岁
体质:${profile.constitution||'未评估'}
过敏食物:${profile.allergies&&profile.allergies.length?profile.allergies.join(','):'无'}
慢性疾病:${profile.chronicDiseases&&profile.chronicDiseases.length?profile.chronicDiseases.join(','):'无'}
饮食偏好:${profile.dietPreference||'无特殊'}
调理目标:${profile.goal||'未设置'}`;
  }

  // 跨模块数据
  const cross = typeof getFmCrossModuleData==='function'?getFmCrossModuleData():'';
  if(cross) prompt += '\n\n【跨模块健康数据】' + cross;

  prompt += `\n\n【输出格式要求】
- 推荐1-3个方案，每个包含名称、食材用量、做法、功效、禁忌
- 用【】标注重要信息
- 如有过敏食材必须明确警示
- 语言简洁实用，适合大学生阅读`;
  return prompt;
}

async function fmAiSend() {
  const input = document.getElementById('fmAiInput');
  const msg = input.value.trim();
  if(!msg || fmAiLoading) return;
  input.value = '';
  fmAiMessages.push({role:'user',content:msg});
  fmAiLoading = true;
  renderFmAiChat();

  try {
    const messages = [{role:'system',content:buildFmSystemPrompt()}, ...fmAiMessages.slice(-12)];
    const resp = await fetch(AI_CONFIG.apiUrl, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_CONFIG.apiKey},
      body:JSON.stringify({model:AI_CONFIG.model, messages, max_tokens:2000, temperature:0.7})
    });
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content || '抱歉，AI暂时无法响应，请稍后再试。';
    if(reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    fmAiMessages.push({role:'assistant',content:reply});
    // 保存记录
    if(typeof addFmRecord==='function') addFmRecord({type:FM_AI_MODES[fmAiMode].name,content:msg,aiReply:reply});
  } catch(e) {
    fmAiMessages.push({role:'assistant',content:'网络错误，请检查API配置后重试。'});
  }
  fmAiLoading = false;
  renderFmAiChat();
}

function formatFmReply(text) {
  return text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/【(.*?)】/g,'<b style="color:#8b4513">【$1】</b>');
}

function renderFmAiChat() {
  const el = document.getElementById('fmAiChatArea');
  if(!el) return;
  el.innerHTML = fmAiMessages.map(m => m.role==='user'
    ? `<div style="text-align:right;margin:8px 0"><span style="background:#8b4513;color:#fff;padding:6px 12px;border-radius:12px;font-size:13px;display:inline-block;max-width:80%">${m.content}</span></div>`
    : `<div style="margin:8px 0"><div style="background:#f5ebe0;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.8;max-width:90%;display:inline-block">${formatFmReply(m.content)}</div></div>`
  ).join('') + (fmAiLoading?'<div style="margin:8px 0"><span style="background:#f5ebe0;padding:8px 14px;border-radius:12px;font-size:12px;color:#888">AI食疗师正在思考...</span></div>':'');
  el.scrollTop = el.scrollHeight;
}

function renderFmAi() {
  const profile = typeof getFmCurrentProfile==='function'?getFmCurrentProfile():null;
  return `<div>
    <div style="background:#f5ebe0;padding:10px 14px;border-radius:8px;margin-bottom:12px">
      <p style="font-size:13px;color:#5d4037;margin:0"><b>🤖 AI食疗师</b> — 根据您的健康状况提供个性化食疗方案${profile?`（当前档案：${profile.name}）`:'（<span style="color:#c62828">请先在"健康档案"中创建档案</span>）'}</p>
    </div>
    <div class="fm-filter" style="margin-bottom:10px">
      ${Object.entries(FM_AI_MODES).map(([k,v])=>`<button class="fm-filter-btn ${fmAiMode===k?'active':''}" onclick="fmSwitchAiMode('${k}')">${v.name}</button>`).join('')}
    </div>
    <div id="fmAiChatArea" style="height:300px;overflow-y:auto;border:1px solid #e8d5c4;border-radius:8px;padding:10px;margin-bottom:10px;background:#fff">
      ${fmAiMessages.length===0?'<p style="text-align:center;color:#999;margin-top:80px;font-size:13px">请输入您的症状或需求，AI食疗师为您推荐方案</p>':''}
    </div>
    <div style="display:flex;gap:8px">
      <input id="fmAiInput" placeholder="描述您的症状或需求..." style="flex:1;padding:10px;border:1px solid #ddb892;border-radius:8px;font-size:13px" onkeydown="if(event.key==='Enter')fmAiSend()">
      <button class="fm-tab active" onclick="fmAiSend()" style="white-space:nowrap">发送</button>
    </div>
    <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
      <span style="font-size:11px;color:#888">快捷提问：</span>
      ${['最近总感觉疲劳乏力','经常失眠怎么食疗','胃不好吃什么养胃','秋冬润肺喝什么茶'].map(q=>`<button style="font-size:11px;padding:3px 8px;border:1px solid #ddb892;border-radius:10px;background:#fff8f0;color:#8b4513;cursor:pointer" onclick="document.getElementById('fmAiInput').value='${q}';fmAiSend()">${q}</button>`).join('')}
    </div>
  </div>`;
}

function fmSwitchAiMode(mode){fmAiMode=mode;document.querySelectorAll('.fm-filter-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');}
function fmClearAiChat(){fmAiMessages=[];renderFmAiChat();}
