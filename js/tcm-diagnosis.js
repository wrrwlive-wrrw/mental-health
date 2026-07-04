// 中医智能诊疗 - 四诊采集与就诊流程
let tcmDiagStep = 0; // 0选病人 1主诉 2四诊 3辨证 4开方 5指导
let tcmDiagData = { chiefComplaint:'', wang:{}, wen:{}, wen2:{}, qie:{} };
let tcmDiagMode = 'form'; // form=表单模式, chat=AI对话模式
let tcmConsultHistory = []; // 问诊对话历史

function renderTcmConsultation() {
  const p = getTcmCurrentPatient();
  if (!p) return `<div style="text-align:center;padding:30px;color:#888">
    <p>请先选择或新建病人档案</p>
    <button class="tcm-btn tcm-btn-primary" onclick="switchTcmTab('patient')">前往选择病人</button>
  </div>`;
  return `
    <div class="tcm-steps">
      ${['选择病人','主诉','四诊采集','辨证分析','处方建议','用药指导'].map((s,i)=>
        `<span class="tcm-step ${i<tcmDiagStep?'done':''} ${i===tcmDiagStep?'active':''}">${s}</span>`
      ).join('')}
    </div>
    <div id="tcmDiagBody">${renderTcmDiagStep()}</div>`;
}

function renderTcmDiagStep() {
  switch(tcmDiagStep) {
    case 0: return renderDiagStepPatient();
    case 1: return renderDiagStepComplaint();
    case 2: return renderDiagStepFourExam();
    case 3: return renderDiagStepSyndrome();
    case 4: return renderDiagStepPrescription();
    case 5: return renderDiagStepGuidance();
    default: return '';
  }
}

function tcmNextStep() {
  tcmDiagStep++;
  const body = document.getElementById('tcmDiagBody');
  if (body) body.innerHTML = renderTcmDiagStep();
  // 更新步骤条
  document.querySelectorAll('.tcm-step').forEach((el,i)=>{
    el.className = 'tcm-step' + (i<tcmDiagStep?' done':'') + (i===tcmDiagStep?' active':'');
  });
}
function tcmPrevStep() {
  if (tcmDiagStep > 0) tcmDiagStep--;
  const body = document.getElementById('tcmDiagBody');
  if (body) body.innerHTML = renderTcmDiagStep();
  document.querySelectorAll('.tcm-step').forEach((el,i)=>{
    el.className = 'tcm-step' + (i<tcmDiagStep?' done':'') + (i===tcmDiagStep?' active':'');
  });
}

// 步骤0：确认病人
function renderDiagStepPatient() {
  const p = getTcmCurrentPatient();
  return `<div style="padding:16px;text-align:center">
    <p style="font-size:15px">当前病人：<b style="color:#2e7d32">${p.name}</b> (${p.gender} ${p.age}岁)</p>
    ${p.constitution?`<p>体质：${p.constitution}</p>`:''}
    ${p.chronicDiseases?`<p>慢性病史：${p.chronicDiseases}</p>`:''}
    <button class="tcm-btn tcm-btn-primary" onclick="tcmNextStep()" style="margin-top:12px">开始问诊</button>
  </div>`;
}

// 步骤1：主诉
function renderDiagStepComplaint() {
  return `<div>
    <div class="tcm-form-group">
      <label>主诉（主要症状及持续时间）</label>
      <textarea id="tcmComplaint" placeholder="例：头痛伴失眠3天，加重1天">${tcmDiagData.chiefComplaint}</textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="tcm-btn" style="background:#eee" onclick="tcmPrevStep()">上一步</button>
      <button class="tcm-btn tcm-btn-primary" onclick="saveTcmComplaint()">下一步：四诊采集</button>
    </div>
  </div>`;
}
function saveTcmComplaint() {
  tcmDiagData.chiefComplaint = document.getElementById('tcmComplaint')?.value.trim()||'';
  if (!tcmDiagData.chiefComplaint) { alert('请输入主诉'); return; }
  tcmNextStep();
}

// 步骤2：四诊（下方继续扩展）
function renderDiagStepFourExam() {
  return `<div>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="tcm-btn ${tcmDiagMode==='form'?'tcm-btn-primary':''}" onclick="tcmDiagMode='form';refreshFourExam()">📋 表单录入</button>
      <button class="tcm-btn ${tcmDiagMode==='chat'?'tcm-btn-primary':''}" onclick="tcmDiagMode='chat';refreshFourExam()">💬 AI引导问诊</button>
      <button class="tcm-btn tcm-btn-warn" onclick="openTcmCamera()">📷 望诊拍照</button>
    </div>
    <div id="tcmFourExamBody">${tcmDiagMode==='form'?renderFourExamForm():renderFourExamChat()}</div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="tcm-btn" style="background:#eee" onclick="tcmPrevStep()">上一步</button>
      <button class="tcm-btn tcm-btn-primary" onclick="saveFourExam()">下一步：AI辨证</button>
    </div>
  </div>`;
}
function refreshFourExam() {
  const el = document.getElementById('tcmFourExamBody');
  if (el) el.innerHTML = tcmDiagMode==='form'?renderFourExamForm():renderFourExamChat();
}

// 四诊表单
function renderFourExamForm() {
  const d = tcmDiagData;
  return `<div style="max-height:350px;overflow-y:auto;padding-right:6px">
    <h4 style="color:#2e7d32;margin:8px 0">👁️ 望诊</h4>
    <div class="tcm-form-group"><label>面色</label><input id="tcmWFace" value="${d.wang.complexion||''}" placeholder="如：面色萎黄/苍白/潮红"></div>
    <div class="tcm-form-group"><label>舌象</label><input id="tcmWTongue" value="${d.wang.tongue||''}" placeholder="舌质、舌苔，如：舌红苔黄腻"></div>
    <div class="tcm-form-group"><label>形体神态</label><input id="tcmWBody" value="${d.wang.bodyShape||''}" placeholder="如：形体消瘦、精神萎靡"></div>
    <h4 style="color:#2e7d32;margin:8px 0">👂 闻诊</h4>
    <div class="tcm-form-group"><label>声音气息</label><input id="tcmNVoice" value="${d.wen.voice||''}" placeholder="如：声低懒言、气短、咳嗽有痰"></div>
    <h4 style="color:#2e7d32;margin:8px 0">❓ 问诊（十问歌）</h4>
    <div class="tcm-form-group"><label>寒热</label><input id="tcmQColdHeat" value="${d.wen2.cold_heat||''}" placeholder="怕冷/发热/潮热/手脚凉"></div>
    <div class="tcm-form-group"><label>汗</label><input id="tcmQSweat" value="${d.wen2.sweat||''}" placeholder="自汗/盗汗/无汗/多汗"></div>
    <div class="tcm-form-group"><label>疼痛</label><input id="tcmQPain" value="${d.wen2.pain||''}" placeholder="部位、性质（胀痛/刺痛/隐痛）"></div>
    <div class="tcm-form-group"><label>饮食</label><input id="tcmQFood" value="${d.wen2.appetite||''}" placeholder="食欲、口味、口渴"></div>
    <div class="tcm-form-group"><label>二便</label><input id="tcmQStool" value="${d.wen2.stool||''}" placeholder="大便（稀/干/频次）小便（色/量/频次）"></div>
    <div class="tcm-form-group"><label>睡眠</label><input id="tcmQSleep" value="${d.wen2.sleep||''}" placeholder="入睡难/多梦/早醒"></div>
    <div class="tcm-form-group"><label>情志</label><input id="tcmQMood" value="${d.wen2.mood||''}" placeholder="烦躁/抑郁/易怒/焦虑"></div>
    <div class="tcm-form-group"><label>月经（女性）</label><input id="tcmQMens" value="${d.wen2.menstruation||''}" placeholder="周期、量、色、痛经"></div>
    <h4 style="color:#2e7d32;margin:8px 0">🤚 切诊</h4>
    <div class="tcm-form-group"><label>脉象</label><input id="tcmPulse" value="${d.qie.pulseType||''}" placeholder="如：脉弦细数/沉迟无力"></div>
    <div class="tcm-form-group"><label>腹诊</label><input id="tcmAbdomen" value="${d.qie.abdomen||''}" placeholder="如：腹胀、压痛部位"></div>
  </div>`;
}

// AI对话式问诊
function renderFourExamChat() {
  const msgs = tcmConsultHistory.map(m=>
    `<div class="tcm-chat-msg ${m.role}">${m.content}</div>`).join('');
  return `<div class="tcm-chat" id="tcmConsultChat">${msgs||'<p style="color:#999;text-align:center">AI医生将引导您完成问诊，请描述您的症状</p>'}</div>
    <div class="tcm-chat-input">
      <input id="tcmConsultInput" placeholder="描述您的症状..." onkeydown="if(event.key==='Enter')tcmConsultSend()">
      <button onclick="tcmConsultSend()">发送</button>
    </div>`;
}

// AI问诊对话发送
async function tcmConsultSend() {
  const input = document.getElementById('tcmConsultInput');
  const text = input?.value.trim();
  if (!text || tcmIsResponding) return;
  input.value = '';
  tcmConsultHistory.push({role:'user', content:text});
  addTcmChat('consultation','user',text);
  refreshConsultChat();
  // 调用AI
  const reply = await tcmCallAI('consultation', text);
  tcmConsultHistory.push({role:'ai', content:reply});
  addTcmChat('consultation','assistant',reply);
  refreshConsultChat();
}

function refreshConsultChat() {
  const el = document.getElementById('tcmConsultChat');
  if (!el) return;
  el.innerHTML = tcmConsultHistory.map(m=>
    `<div class="tcm-chat-msg ${m.role}">${formatTcmAnswer(m.content)}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

// 保存四诊数据
function saveFourExam() {
  if (tcmDiagMode === 'form') {
    tcmDiagData.wang = {
      complexion: document.getElementById('tcmWFace')?.value||'',
      tongue: document.getElementById('tcmWTongue')?.value||'',
      bodyShape: document.getElementById('tcmWBody')?.value||''
    };
    tcmDiagData.wen = { voice: document.getElementById('tcmNVoice')?.value||'' };
    tcmDiagData.wen2 = {
      cold_heat: document.getElementById('tcmQColdHeat')?.value||'',
      sweat: document.getElementById('tcmQSweat')?.value||'',
      pain: document.getElementById('tcmQPain')?.value||'',
      appetite: document.getElementById('tcmQFood')?.value||'',
      stool: document.getElementById('tcmQStool')?.value||'',
      sleep: document.getElementById('tcmQSleep')?.value||'',
      mood: document.getElementById('tcmQMood')?.value||'',
      menstruation: document.getElementById('tcmQMens')?.value||''
    };
    tcmDiagData.qie = {
      pulseType: document.getElementById('tcmPulse')?.value||'',
      abdomen: document.getElementById('tcmAbdomen')?.value||''
    };
  }
  tcmNextStep();
}

// 步骤3：辨证分析
function renderDiagStepSyndrome() {
  return `<div>
    <p style="color:#666;font-size:13px;margin-bottom:12px">AI将根据四诊信息进行辨证分析...</p>
    <div class="tcm-chat" id="tcmSyndromeResult"><p style="color:#999;text-align:center">点击下方按钮开始AI辨证</p></div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="tcm-btn" style="background:#eee" onclick="tcmPrevStep()">上一步</button>
      <button class="tcm-btn tcm-btn-primary" onclick="runTcmSyndrome()">🔍 AI辨证分析</button>
      <button class="tcm-btn tcm-btn-warn" onclick="tcmNextStep()">下一步：开方</button>
    </div>
  </div>`;
}

async function runTcmSyndrome() {
  const el = document.getElementById('tcmSyndromeResult');
  if (!el) return;
  el.innerHTML = '<p style="color:#2e7d32;text-align:center">AI正在辨证分析中...</p>';
  const diagText = formatDiagnosisText();
  const result = await tcmCallAI('syndrome', diagText);
  tcmDiagData.syndromeResult = result;
  el.innerHTML = `<div class="tcm-chat-msg ai">${formatTcmAnswer(result)}</div>`;
}

// 格式化四诊信息为文本
function formatDiagnosisText() {
  const d = tcmDiagData;
  let text = `主诉：${d.chiefComplaint}\n`;
  text += `【望诊】面色：${d.wang.complexion||'未记录'}；舌象：${d.wang.tongue||'未记录'}；形体：${d.wang.bodyShape||'未记录'}\n`;
  text += `【闻诊】${d.wen.voice||'未记录'}\n`;
  text += `【问诊】寒热：${d.wen2.cold_heat||'未记录'}；汗：${d.wen2.sweat||'未记录'}；痛：${d.wen2.pain||'未记录'}；`;
  text += `食：${d.wen2.appetite||'未记录'}；便：${d.wen2.stool||'未记录'}；睡：${d.wen2.sleep||'未记录'}；情志：${d.wen2.mood||'未记录'}\n`;
  if (d.wen2.menstruation) text += `月经：${d.wen2.menstruation}\n`;
  text += `【切诊】脉象：${d.qie.pulseType||'未记录'}；腹诊：${d.qie.abdomen||'未记录'}`;
  // 补充AI对话采集的内容
  if (tcmConsultHistory.length > 0) {
    text += '\n【AI问诊对话摘要】\n' + tcmConsultHistory.map(m=>(m.role==='user'?'患者：':'医生：')+m.content).join('\n');
  }
  return text;
}

// 步骤4：处方建议
function renderDiagStepPrescription() {
  return `<div>
    <p style="color:#666;font-size:13px;margin-bottom:12px">AI将根据辨证结果开具处方...</p>
    <div class="tcm-chat" id="tcmRxResult"><p style="color:#999;text-align:center">点击下方按钮获取处方建议</p></div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="tcm-btn" style="background:#eee" onclick="tcmPrevStep()">上一步</button>
      <button class="tcm-btn tcm-btn-primary" onclick="runTcmPrescription()">📝 AI开方</button>
      <button class="tcm-btn tcm-btn-warn" onclick="tcmNextStep()">下一步：用药指导</button>
    </div>
  </div>`;
}

async function runTcmPrescription() {
  const el = document.getElementById('tcmRxResult');
  if (!el) return;
  el.innerHTML = '<p style="color:#2e7d32;text-align:center">AI正在拟方中...</p>';
  const syndrome = tcmDiagData.syndromeResult || formatDiagnosisText();
  const result = await tcmCallAI('prescription', syndrome);
  tcmDiagData.prescriptionResult = result;
  el.innerHTML = `<div class="tcm-chat-msg ai">${formatTcmAnswer(result)}</div>`;
}

// 步骤5：用药指导 + 保存
function renderDiagStepGuidance() {
  return `<div>
    <div class="tcm-chat" id="tcmGuidanceResult">
      <div class="tcm-chat-msg ai">${formatTcmAnswer(tcmDiagData.prescriptionResult||'请先完成前面的步骤')}</div>
    </div>
    <div style="margin-top:12px;padding:12px;background:#e8f5e9;border-radius:8px">
      <p style="font-size:13px;color:#2e7d32;font-weight:bold">诊疗完成，是否保存到病人档案？</p>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="tcm-btn tcm-btn-primary" onclick="saveTcmVisitRecord()">💾 保存到档案</button>
        <button class="tcm-btn" style="background:#eee" onclick="resetTcmDiag()">新建问诊</button>
      </div>
    </div>
  </div>`;
}

// 保存诊疗记录
function saveTcmVisitRecord() {
  const p = getTcmCurrentPatient();
  if (!p) { alert('未选择病人'); return; }
  const record = {
    chiefComplaint: tcmDiagData.chiefComplaint,
    diagnosis: { wang:tcmDiagData.wang, wen:tcmDiagData.wen, wen2:tcmDiagData.wen2, qie:tcmDiagData.qie },
    syndrome: { result: tcmDiagData.syndromeResult||'' },
    prescription: { result: tcmDiagData.prescriptionResult||'' },
    aiAnalysis: (tcmDiagData.syndromeResult||'') + '\n\n' + (tcmDiagData.prescriptionResult||'')
  };
  addTcmRecord(p.id, record);
  alert('诊疗记录已保存到 ' + p.name + ' 的健康档案');
  resetTcmDiag();
}

function resetTcmDiag() {
  tcmDiagStep = 0; tcmDiagData = {chiefComplaint:'',wang:{},wen:{},wen2:{},qie:{}};
  tcmConsultHistory = [];
  showTcmTab('consultation');
}
