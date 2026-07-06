// 云游四海 - AI配置（精简版，从chat.js提取）
const AI_CONFIG = {
  apiUrl: localStorage.getItem('mh_ai_url') || 'https://api.siliconflow.cn/v1/chat/completions',
  apiKey: localStorage.getItem('mh_ai_key') || '',
  model: localStorage.getItem('mh_ai_model') || 'Qwen/Qwen2.5-7B-Instruct'
};

// AI设置面板
function showAISettings() {
  const html = `<div style="text-align:left;font-size:13px;line-height:2;padding:20px">
    <h3 style="margin:0 0 10px;color:#333">⚙️ AI接口配置</h3>
    <p>支持任何兼容OpenAI格式的API</p>
    <p><label>快速选择（免费平台）：</label><br>
      <select id="aiPreset" onchange="fillAIPreset()" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px">
        <option value="">-- 手动填写 --</option>
        <option value="groq">Groq（推荐·Llama 70B·1000次/天）</option>
        <option value="openrouter">OpenRouter（20+免费模型）</option>
        <option value="siliconflow">SiliconFlow（国内·中文优化）</option>
        <option value="cerebras">Cerebras（Llama 70B·超快）</option>
        <option value="mistral">Mistral（法国·免费额度大）</option>
      </select></p>
    <p style="margin-top:10px"><label>API地址：</label><br>
      <input id="aiUrl" value="${AI_CONFIG.apiUrl}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px"></p>
    <p><label>API Key：</label><br>
      <input id="aiKey" value="${AI_CONFIG.apiKey}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px" placeholder="填入API Key"></p>
    <p><label>模型名称：</label><br>
      <input id="aiModel" value="${AI_CONFIG.model}" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px"></p>
    <p style="color:#888;font-size:11px;margin-top:8px">
      注册链接：
      <a href="https://console.groq.com" target="_blank">Groq</a> |
      <a href="https://openrouter.ai" target="_blank">OpenRouter</a> |
      <a href="https://cloud.siliconflow.cn" target="_blank">SiliconFlow</a>
    </p>
    <button onclick="saveAIConfig()" style="width:100%;padding:10px;background:#1565c0;color:#fff;border:none;border-radius:6px;margin-top:10px;cursor:pointer;font-size:14px">保存配置</button>
  </div>`;
  // 弹窗显示
  const overlay = document.createElement('div');
  overlay.id = 'aiSettingsOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML = `<div style="background:#fff;border-radius:12px;max-width:420px;width:90%;max-height:80vh;overflow-y:auto;position:relative">
    <span onclick="document.getElementById('aiSettingsOverlay').remove()" style="position:absolute;top:10px;right:14px;font-size:20px;cursor:pointer;color:#999">×</span>
    ${html}</div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if(e.target===overlay) overlay.remove(); });
}

function saveAIConfig() {
  const url = document.getElementById('aiUrl')?.value.trim();
  const key = document.getElementById('aiKey')?.value.trim();
  const model = document.getElementById('aiModel')?.value.trim();
  if (url) { AI_CONFIG.apiUrl = url; localStorage.setItem('mh_ai_url', url); }
  if (key) { AI_CONFIG.apiKey = key; localStorage.setItem('mh_ai_key', key); }
  if (model) { AI_CONFIG.model = model; localStorage.setItem('mh_ai_model', model); }
  alert('AI配置已保存！');
  const overlay = document.getElementById('aiSettingsOverlay');
  if (overlay) overlay.remove();
}

function fillAIPreset() {
  const v = document.getElementById('aiPreset')?.value;
  const presets = {
    groq: {url:'https://api.groq.com/openai/v1/chat/completions',model:'llama-3.3-70b-versatile'},
    openrouter: {url:'https://openrouter.ai/api/v1/chat/completions',model:'meta-llama/llama-3.3-70b-instruct:free'},
    siliconflow: {url:'https://api.siliconflow.cn/v1/chat/completions',model:'Qwen/Qwen2.5-7B-Instruct'},
    cerebras: {url:'https://api.cerebras.ai/v1/chat/completions',model:'llama-3.3-70b'},
    mistral: {url:'https://api.mistral.ai/v1/chat/completions',model:'mistral-small-latest'}
  };
  if (presets[v]) {
    document.getElementById('aiUrl').value = presets[v].url;
    document.getElementById('aiModel').value = presets[v].model;
    document.getElementById('aiKey').value = '';
    document.getElementById('aiKey').placeholder = `填入${v}的API Key`;
  }
}
