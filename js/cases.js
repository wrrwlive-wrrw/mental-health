// 标准化案例库模块
const CASE_CATEGORIES = ['全部','焦虑类','抑郁类','人际关系','学业就业','家庭成长'];

const STANDARD_CASES = [
  {id:'c1',cat:'焦虑类',title:'考研倒计时焦虑',level:2,gender:'女',age:22,bg:'大三学生，跨专业考研',
   chief:'距考研还有3个月，每天焦虑到无法集中注意力，频繁失眠',core:'完美主义+灾难化思维'},
  {id:'c2',cat:'焦虑类',title:'社交恐惧与回避',level:3,gender:'男',age:20,bg:'大二理工科学生',
   chief:'害怕当众发言，逃避小组汇报，担心被嘲笑',core:'核心信念"我不够好"'},
  {id:'c3',cat:'焦虑类',title:'分离焦虑（恋爱）',level:2,gender:'女',age:21,bg:'大二学生，异地恋',
   chief:'男友不回消息就极度焦虑，反复确认关系',core:'不安全依恋模式'},
  {id:'c4',cat:'焦虑类',title:'健康焦虑与躯体化',level:2,gender:'男',age:23,bg:'研一新生',
   chief:'频繁心慌胸闷，反复就医无器质性病变',core:'对身体信号的灾难化解读'},
  {id:'c5',cat:'焦虑类',title:'毕业答辩恐惧',level:1,gender:'女',age:22,bg:'大四学生',
   chief:'一想到答辩就手抖、失眠，准备了但总觉得不够',core:'评价恐惧'},
  {id:'c6',cat:'焦虑类',title:'泛化焦虑',level:3,gender:'男',age:21,bg:'大三学生',
   chief:'对各种事情都担心，无法放松，肌肉紧张',core:'不确定性耐受度低'},
];

let currentCaseFilter = '全部';

// 抑郁类案例
const CASES_DEPRESSION = [
  {id:'c7',cat:'抑郁类',title:'持续情绪低落',level:3,gender:'女',age:21,bg:'大三文科生',
   chief:'连续一个月情绪低落，对一切失去兴趣，不想出门',core:'习得性无助+反刍思维'},
  {id:'c8',cat:'抑郁类',title:'丧失感与空虚',level:3,gender:'男',age:22,bg:'大四即将毕业',
   chief:'觉得人生没有意义，每天行尸走肉',core:'存在主义危机'},
  {id:'c9',cat:'抑郁类',title:'自我伤害倾向',level:4,gender:'女',age:20,bg:'大二学生',
   chief:'有时会划伤自己来缓解痛苦，觉得自己不配被爱',core:'情绪调节障碍+低自我价值'},
  {id:'c10',cat:'抑郁类',title:'产后抑郁（研究生）',level:3,gender:'女',age:26,bg:'研二已婚',
   chief:'生完孩子后情绪崩溃，觉得自己不是好妈妈',core:'角色冲突+完美主义'},
  {id:'c11',cat:'抑郁类',title:'季节性情绪波动',level:2,gender:'男',age:21,bg:'大三学生',
   chief:'每到冬天就特别消沉，嗜睡、暴食',core:'生物节律敏感+社交退缩'},
  {id:'c12',cat:'抑郁类',title:'丧亲之痛',level:4,gender:'女',age:22,bg:'大三学生',
   chief:'半年前父亲去世，至今无法接受，成绩下滑严重',core:'复杂性哀伤'},
];

// 人际关系案例
const CASES_INTERPERSONAL = [
  {id:'c13',cat:'人际关系',title:'室友冲突与孤立',level:2,gender:'女',age:19,bg:'大一新生',
   chief:'被室友排斥，感觉被孤立，不想回宿舍',core:'归属需要未满足'},
  {id:'c14',cat:'人际关系',title:'讨好型人格',level:2,gender:'女',age:21,bg:'大三学生',
   chief:'不敢拒绝别人，总是委曲求全，内心很累',core:'边界缺失+低自尊'},
  {id:'c15',cat:'人际关系',title:'师生关系困扰',level:2,gender:'男',age:24,bg:'研一学生',
   chief:'导师要求苛刻、经常批评，想换导师又不敢',core:'权威恐惧+习得性无助'},
  {id:'c16',cat:'人际关系',title:'社交退缩',level:3,gender:'男',age:20,bg:'大二学生',
   chief:'觉得自己和别人格格不入，越来越封闭',core:'回避型依恋+社交技能不足'},
  {id:'c17',cat:'人际关系',title:'网络社交依赖',level:2,gender:'女',age:19,bg:'大一学生',
   chief:'现实中社恐但网上很活跃，线下无法交友',core:'虚拟自我与现实自我割裂'},
  {id:'c18',cat:'人际关系',title:'友情背叛创伤',level:2,gender:'女',age:21,bg:'大三学生',
   chief:'被最好的朋友背后议论，从此不再信任任何人',core:'信任修复困难'},
];

// 学业就业案例
const CASES_CAREER = [
  {id:'c19',cat:'学业就业',title:'求职屡屡碰壁',level:2,gender:'男',age:22,bg:'大四应届生',
   chief:'投了50份简历没回音，同学都有offer了',core:'自我效能感低+社会比较'},
  {id:'c20',cat:'学业就业',title:'考研二战压力',level:3,gender:'女',age:23,bg:'毕业一年',
   chief:'一战失败，二战压力巨大，父母施压',core:'外部期待内化+害怕再次失败'},
  {id:'c21',cat:'学业就业',title:'学业拖延症',level:2,gender:'男',age:21,bg:'大三学生',
   chief:'论文一拖再拖，deadline前才熬夜赶，恶性循环',core:'完美主义拖延+即时满足'},
  {id:'c22',cat:'学业就业',title:'专业迷茫与转行',level:2,gender:'女',age:22,bg:'大三学生',
   chief:'不喜欢本专业但不知道想做什么，很迷茫',core:'职业认同未建立'},
  {id:'c23',cat:'学业就业',title:'实习中的职场霸凌',level:3,gender:'女',age:22,bg:'大四实习生',
   chief:'实习领导经常当众批评侮辱，不敢反抗也不敢辞',core:'权力不对等+习得性无助'},
  {id:'c24',cat:'学业就业',title:'挂科休学危机',level:3,gender:'男',age:20,bg:'大二学生',
   chief:'连续挂科面临退学，觉得自己是废物',core:'自我价值与学业绑定'},
];

// 家庭成长案例
const CASES_FAMILY = [
  {id:'c25',cat:'家庭成长',title:'原生家庭控制',level:3,gender:'女',age:21,bg:'大三学生',
   chief:'父母控制欲极强，大学了还管我穿什么、和谁交友',core:'个体化困难+边界建立'},
  {id:'c26',cat:'家庭成长',title:'父母离异创伤',level:3,gender:'男',age:19,bg:'大一新生',
   chief:'父母离婚后觉得被抛弃，不相信感情',core:'依恋创伤+关系回避'},
  {id:'c27',cat:'家庭成长',title:'家暴阴影',level:4,gender:'女',age:22,bg:'大三学生',
   chief:'小时候经常被父亲打，现在很容易被激怒或恐惧',core:'复杂性PTSD'},
  {id:'c28',cat:'家庭成长',title:'留守儿童成长创伤',level:3,gender:'男',age:20,bg:'大二学生',
   chief:'从小跟爷爷奶奶长大，觉得自己不值得被爱',core:'早期分离经历+核心信念'},
  {id:'c29',cat:'家庭成长',title:'经济压力与自卑',level:2,gender:'男',age:21,bg:'农村贫困家庭',
   chief:'同学消费水平差距大，感到自卑，不敢社交',core:'物质匮乏引发的自我否定'},
  {id:'c30',cat:'家庭成长',title:'性别认同困惑',level:3,gender:'非二元',age:20,bg:'大二学生',
   chief:'对自己的性别认同困惑，不敢告诉家人',core:'身份认同探索+社会压力'},
];

// 合并所有案例
const ALL_CASES = [...STANDARD_CASES, ...CASES_DEPRESSION, ...CASES_INTERPERSONAL, ...CASES_CAREER, ...CASES_FAMILY];

// 渲染案例库页面
function renderCases() {
  const el = document.getElementById('casesContent');
  if (!el) return;
  const filtered = currentCaseFilter === '全部' ? ALL_CASES : ALL_CASES.filter(c => c.cat === currentCaseFilter);
  const levelLabels = {1:'初级',2:'中级',3:'高级',4:'专家'};
  const levelColors = {1:'tag-green',2:'tag-blue',3:'tag-orange',4:'tag-purple'};

  let html = '<div class="case-filter">';
  CASE_CATEGORIES.forEach(cat => {
    const active = cat === currentCaseFilter ? ' btn-active' : '';
    html += `<button class="btn btn-sm${active}" onclick="filterCases('${cat}')">${cat}</button>`;
  });
  html += `</div><p style="text-align:center;color:#888;font-size:13px;margin:10px 0">共 ${filtered.length} 个标准化案例，点击开始练习</p>`;
  html += '<div class="cases-list">';
  filtered.forEach(c => {
    html += `<div class="case-card" onclick="startCaseChat('${c.id}')">
      <div class="case-header">
        <span class="case-title">${c.title}</span>
        <span class="tag ${levelColors[c.level]}">${levelLabels[c.level]}</span>
      </div>
      <div class="case-meta">${c.gender} | ${c.age}岁 | ${c.bg}</div>
      <div class="case-chief">主诉：${c.chief}</div>
      <div class="case-core">核心议题：${c.core}</div>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

function filterCases(cat) {
  currentCaseFilter = cat;
  renderCases();
}

// 开始案例练习 - 跳转到对话页并注入案例人设
function startCaseChat(caseId) {
  const c = ALL_CASES.find(x => x.id === caseId);
  if (!c) return;
  // 保存当前案例到全局，供chat.js使用
  window.currentTrainCase = c;
  // 切换为实训模式
  switchChatMode('train');
  // 清空当前对话开始新案例
  chatHistory = [];
  saveChatHistory();
  // 生成案例专属的来访者人设提示词
  const casePrompt = buildCasePrompt(c);
  window.currentCasePrompt = casePrompt;
  renderChat();
  showPage('chat');
  // 添加系统提示
  const intro = `【案例练习开始】\n来访者：${c.gender}，${c.age}岁，${c.bg}\n请以咨询师身份开始对话，来访者会自动回应。`;
  chatHistory.push({role:'system', text:intro, time:new Date().toLocaleTimeString()});
  renderChat();
  saveChatHistory();
}

// 构建案例专属提示词
function buildCasePrompt(c) {
  return `你正在扮演一位来心理咨询室的来访者。严格按照以下人设进行角色扮演：

【基本信息】${c.gender}，${c.age}岁，${c.bg}
【主诉】${c.chief}
【核心问题】${c.core}
【类别】${c.cat}

【扮演要求】
1. 用第一人称自然地表达情绪和困扰
2. 开始时有些防备，随着咨询师共情会逐渐敞开
3. 回复控制在50-80字，像真人倾诉
4. 会有犹豫、沉默、情绪波动等真实反应
5. 不要一次把所有信息都说出来，要让咨询师引导
6. 不用markdown格式`;
}
