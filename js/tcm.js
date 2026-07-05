// 中医智能诊疗模块 - 主入口
const TCM_MODULES = {
  consultation: { name:'智能问诊', icon:'🩺', desc:'望闻问切四诊合参，AI辨证分析' },
  prescription: { name:'处方开方', icon:'📝', desc:'辨证施治，中药方剂建议' },
  rxIdentify:   { name:'药方识别', icon:'🔍', desc:'输入药方反推可治疾病' },
  herbGuide:    { name:'中草药图鉴', icon:'🌿', desc:'中草药百科、拍照识别、产地' },
  aiAgent:      { name:'AI智能体', icon:'🤖', desc:'中医AI问诊、解读、方案' },
  patient:      { name:'健康档案', icon:'📋', desc:'病人信息管理，诊疗历史' },
  cases:        { name:'经典医案', icon:'📚', desc:'名老中医医案参考' },
  knowledge:    { name:'中医典籍', icon:'📖', desc:'黄帝内经、伤寒论要义' },
  drugguide:    { name:'用药指导', icon:'💊', desc:'性味归经、煎服法、禁忌' },
  settings:     { name:'API设置', icon:'⚙️', desc:'配置AI接口密钥' }
};

let tcmCurrentTab = 'consultation';

function renderTcm() {
  const el = document.getElementById('tcmContent');
  if (!el) return;
  el.innerHTML = renderTcmPage();
  showTcmTab(tcmCurrentTab);
}

function renderTcmPage() {
  return `
    <div class="tcm-intro">
      <p style="color:#666;font-size:13px;line-height:1.7">
        融合《黄帝内经》《伤寒杂病论》《温病条辨》《神农本草经》《难经》《医学心悟》等经典，
        结合名老中医临床经验，提供智能辨证施治参考。
        <br><span style="color:#2e7d32">※ 仅供学习参考，不替代专业医疗诊断，如有疾病请及时就医。</span>
      </p>
    </div>
    ${renderTcmPatientBar()}
    <div class="tcm-tabs" id="tcmTabs">
      ${Object.entries(TCM_MODULES).map(([k,v])=>`
        <div class="tcm-tab ${k===tcmCurrentTab?'active':''}" onclick="switchTcmTab('${k}')">
          <span class="tcm-tab-icon">${v.icon}</span>
          <span class="tcm-tab-name">${v.name}</span>
        </div>`).join('')}
    </div>
    <div class="tcm-panel" id="tcmPanel"></div>`;
}

function switchTcmTab(tab) {
  tcmCurrentTab = tab;
  document.querySelectorAll('.tcm-tab').forEach((el,i)=>{
    const key = Object.keys(TCM_MODULES)[i];
    el.classList.toggle('active', key===tab);
  });
  showTcmTab(tab);
}

function showTcmTab(tab) {
  const el = document.getElementById('tcmPanel');
  if (!el) return;
  const renderers = {
    consultation: renderTcmConsultation,
    prescription: renderTcmPrescription,
    rxIdentify: renderTcmRxIdentify,
    herbGuide: renderTcmHerbGuide,
    aiAgent: renderTcmAiAgent,
    patient: renderTcmPatientList,
    cases: renderTcmCases,
    knowledge: renderTcmKnowledge,
    drugguide: renderTcmDrugGuide,
    settings: renderTcmSettings
  };
  el.innerHTML = (renderers[tab] || (()=>'<p>敬请期待</p>'))();
}

// 当前选中病人信息栏
function renderTcmPatientBar() {
  const p = getTcmCurrentPatient();
  if (!p) return `<div class="tcm-patient-bar">
    <span>未选择病人</span>
    <button class="btn-sm" onclick="switchTcmTab('patient')">选择/新建病人</button>
  </div>`;
  return `<div class="tcm-patient-bar">
    <span>当前病人：</span><span class="name">${p.name}</span>
    <span>${p.gender} ${p.age}岁</span>
    <span>${p.constitution||''}</span>
    <button class="btn-sm" onclick="switchTcmTab('patient')">切换</button>
  </div>`;
}

// 用药指导模块
function renderTcmDrugGuide() {
  return `<div>
    <div class="tcm-chat" id="tcmDrugChat">
      <div class="tcm-chat-msg ai">您好，我是中药用药指导助手。您可以咨询：<br>
      · 某味中药的性味归经和功效<br>
      · 药物配伍禁忌（十八反、十九畏）<br>
      · 煎煮方法和服药注意事项<br>
      · 中药与食物的相互作用<br>
      请输入您的问题。</div>
    </div>
    <div class="tcm-chat-input">
      <input id="tcmDrugInput" placeholder="例：黄芪的功效和用量？" onkeydown="if(event.key==='Enter')tcmDrugSend()">
      <button onclick="tcmDrugSend()">咨询</button>
    </div>
  </div>`;
}

let tcmDrugHistory = [];
async function tcmDrugSend() {
  const input = document.getElementById('tcmDrugInput');
  const text = input?.value.trim();
  if (!text || tcmIsResponding) return;
  input.value = '';
  tcmDrugHistory.push({role:'user',content:text});
  addTcmChat('drugguide','user',text);
  refreshDrugChat();
  const reply = await tcmCallAI('drugguide', text);
  tcmDrugHistory.push({role:'ai',content:reply});
  addTcmChat('drugguide','assistant',reply);
  refreshDrugChat();
}
function refreshDrugChat() {
  const el = document.getElementById('tcmDrugChat');
  if (!el) return;
  el.innerHTML = tcmDrugHistory.map(m=>
    `<div class="tcm-chat-msg ${m.role}">${formatTcmAnswer(m.content)}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

// API设置模块
function renderTcmSettings() {
  const url = localStorage.getItem('mh_ai_url') || '';
  const key = localStorage.getItem('mh_ai_key') || '';
  const model = localStorage.getItem('mh_ai_model') || '';
  const masked = key ? key.slice(0,8) + '****' + key.slice(-4) : '';
  return `<div>
    <div style="padding:12px;background:${key?'#e8f5e9':'#fff3e0'};border-radius:8px;margin-bottom:14px">
      <p style="font-size:13px;color:${key?'#2e7d32':'#e65100'};margin:0">
        <b>当前状态：</b>${key ? '已配置 ✓' : '未配置 - 请选择免费平台并填入Key'}
      </p>
      ${key ? `<p style="font-size:12px;color:#666;margin:4px 0 0">Key: ${masked} | 模型: ${model}</p>` : ''}
    </div>
    <div class="tcm-form-group">
      <label>快速选择免费平台（无需信用卡）</label>
      <select id="tcmPreset" onchange="fillTcmPreset()">
        <option value="">-- 选择平台 --</option>
        <option value="groq">Groq（推荐·免费·极速）</option>
        <option value="cerebras">Cerebras（免费·快速）</option>
        <option value="openrouter">OpenRouter（免费模型）</option>
        <option value="together">Together AI（免费额度）</option>
      </select>
    </div>
    <div id="tcmPresetGuide" style="margin-bottom:14px"></div>
    <div class="tcm-form-group">
      <label>API 地址</label>
      <input id="tcmApiUrl" value="${url}" placeholder="选择平台后自动填入">
    </div>
    <div class="tcm-form-group">
      <label>API Key</label>
      <input id="tcmApiKey" type="password" value="${key}" placeholder="注册后获取免费Key填入此处">
    </div>
    <div class="tcm-form-group">
      <label>模型名称</label>
      <input id="tcmApiModel" value="${model}" placeholder="选择平台后自动填入">
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="tcm-btn tcm-btn-primary" onclick="saveTcmApiSettings()">保存设置</button>
      <button class="tcm-btn tcm-btn-warn" onclick="testTcmApi()">测试连接</button>
    </div>
    <div id="tcmApiTestResult" style="margin-top:12px"></div>
  </div>`;
}

function fillTcmPreset() {
  const v = document.getElementById('tcmPreset')?.value;
  const presets = {
    groq: {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile',
      guide: '1. 访问 <a href="https://console.groq.com" target="_blank">console.groq.com</a><br>2. 用Google/GitHub账号注册（无需信用卡）<br>3. 进入 API Keys 页面，点击 Create API Key<br>4. 复制Key粘贴到上方输入框<br><b>免费额度：</b>每分钟30请求，每天14400请求'
    },
    cerebras: {
      url: 'https://api.cerebras.ai/v1/chat/completions',
      model: 'llama-3.3-70b',
      guide: '1. 访问 <a href="https://cloud.cerebras.ai" target="_blank">cloud.cerebras.ai</a><br>2. 注册账号（无需信用卡）<br>3. 在Dashboard获取API Key<br>4. 复制Key粘贴到上方输入框<br><b>免费额度：</b>每分钟30请求，推理速度极快'
    },
    openrouter: {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      guide: '1. 访问 <a href="https://openrouter.ai" target="_blank">openrouter.ai</a><br>2. 用Google账号注册<br>3. 进入 Keys 页面创建Key<br>4. 复制Key粘贴到上方输入框<br><b>免费模型：</b>带 :free 后缀的模型完全免费'
    },
    together: {
      url: 'https://api.together.xyz/v1/chat/completions',
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      guide: '1. 访问 <a href="https://api.together.ai" target="_blank">api.together.ai</a><br>2. 注册账号，送$5免费额度<br>3. 在Settings → API Keys获取Key<br>4. 复制Key粘贴到上方输入框<br><b>免费额度：</b>注册送$5，足够数千次对话'
    }
  };
  const el = document.getElementById('tcmPresetGuide');
  if (!presets[v]) { el.innerHTML = ''; return; }
  const p = presets[v];
  document.getElementById('tcmApiUrl').value = p.url;
  document.getElementById('tcmApiModel').value = p.model;
  document.getElementById('tcmApiKey').value = '';
  el.innerHTML = `<div style="padding:10px;background:#e3f2fd;border-radius:6px;font-size:12px;line-height:1.8;color:#333">
    <b style="color:#1565c0">获取Key步骤：</b><br>${p.guide}
  </div>`;
}

function saveTcmApiSettings() {
  const url = document.getElementById('tcmApiUrl')?.value.trim();
  const key = document.getElementById('tcmApiKey')?.value.trim();
  const model = document.getElementById('tcmApiModel')?.value.trim();
  if (!url || !key || !model) { alert('请填写完整信息'); return; }
  localStorage.setItem('mh_ai_url', url);
  localStorage.setItem('mh_ai_key', key);
  localStorage.setItem('mh_ai_model', model);
  AI_CONFIG.apiUrl = url;
  AI_CONFIG.apiKey = key;
  AI_CONFIG.model = model;
  alert('API设置已保存');
  showTcmTab('settings');
}

async function testTcmApi() {
  const url = document.getElementById('tcmApiUrl')?.value.trim();
  const key = document.getElementById('tcmApiKey')?.value.trim();
  const model = document.getElementById('tcmApiModel')?.value.trim();
  if (!url || !key || !model) { alert('请先填写完整信息'); return; }
  const el = document.getElementById('tcmApiTestResult');
  el.innerHTML = '<p style="color:#2e7d32">正在测试连接...</p>';
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+key },
      body: JSON.stringify({
        model: model,
        messages: [{ role:'user', content:'你好，请用一句话回复' }],
        max_tokens: 50
      })
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    let reply = data.choices?.[0]?.message?.content || '';
    if (reply.includes('</think>')) reply = reply.split('</think>').pop().trim();
    el.innerHTML = `<div style="padding:10px;background:#e8f5e9;border-radius:6px">
      <p style="color:#2e7d32;font-weight:bold;margin:0 0 4px">连接成功 ✓</p>
      <p style="font-size:12px;color:#555;margin:0">AI回复：${reply}</p>
    </div>`;
  } catch(e) {
    el.innerHTML = `<div style="padding:10px;background:#ffebee;border-radius:6px">
      <p style="color:#c62828;font-weight:bold;margin:0 0 4px">连接失败 ✗</p>
      <p style="font-size:12px;color:#666;margin:0">错误：${e.message}</p>
    </div>`;
  }
}
