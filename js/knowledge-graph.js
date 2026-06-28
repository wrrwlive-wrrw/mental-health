// 心理学流派知识图谱模块
const SCHOOLS_DATA = [
  {id:'psychoanalysis',name:'精神分析',founder:'弗洛伊德',color:'#9c27b0',
   concepts:['潜意识','本我/自我/超我','防御机制','移情','自由联想'],
   therapies:['经典精神分析','客体关系','自体心理学'],
   suitable:['人格障碍','早期创伤','关系模式'],x:0.2,y:0.3},
  {id:'cbt',name:'认知行为',founder:'贝克/埃利斯',color:'#2196f3',
   concepts:['自动化思维','认知歪曲','核心信念','行为实验','暴露疗法'],
   therapies:['CBT','REBT','行为激活','暴露反应预防'],
   suitable:['焦虑','抑郁','恐惧症','强迫症'],x:0.8,y:0.3},
  {id:'humanistic',name:'人本主义',founder:'罗杰斯/马斯洛',color:'#4caf50',
   concepts:['无条件积极关注','共情','真诚一致','自我实现','需求层次'],
   therapies:['来访者中心疗法','聚焦疗法','格式塔'],
   suitable:['自我探索','成长困惑','关系困扰'],x:0.2,y:0.7},
  {id:'existential',name:'存在主义',founder:'亚隆/弗兰克尔',color:'#ff9800',
   concepts:['自由与责任','存在焦虑','意义追寻','死亡觉察','孤独'],
   therapies:['存在分析','意义疗法','ACT'],
   suitable:['存在危机','丧失感','人生意义'],x:0.5,y:0.15},
  {id:'family',name:'家庭系统',founder:'鲍文/米纽钦',color:'#f44336',
   concepts:['三角关系','家庭边界','代际传递','角色分化','循环因果'],
   therapies:['结构家庭治疗','策略家庭治疗','叙事疗法'],
   suitable:['家庭冲突','亲子关系','婚姻问题'],x:0.5,y:0.85},
  {id:'mindfulness',name:'正念疗法',founder:'卡巴金/西格尔',color:'#00bcd4',
   concepts:['当下觉察','非评判','接纳','去中心化','慈悲'],
   therapies:['MBSR','MBCT','DBT','ACT'],
   suitable:['焦虑反刍','情绪失调','慢性疼痛'],x:0.8,y:0.7}
];

// 流派间关系
const SCHOOL_LINKS = [
  {from:'psychoanalysis',to:'humanistic',label:'人本革命反对'},
  {from:'psychoanalysis',to:'cbt',label:'认知革命发展'},
  {from:'humanistic',to:'existential',label:'哲学根基共享'},
  {from:'cbt',to:'mindfulness',label:'第三浪潮融合'},
  {from:'existential',to:'mindfulness',label:'觉察与接纳'},
  {from:'family',to:'humanistic',label:'系统观+人本观'},
  {from:'psychoanalysis',to:'family',label:'客体关系→家庭'}
];

let selectedSchool = null;

// 渲染知识图谱页面
function renderKnowledgeGraph() {
  const el = document.getElementById('knowledgeGraphContent');
  if (!el) return;
  el.innerHTML = `<p style="text-align:center;color:#666;margin-bottom:15px">点击流派节点查看详细信息</p>
    <div class="graph-container"><canvas id="graphCanvas" width="700" height="500"></canvas></div>
    <div id="schoolDetail" class="school-detail"></div>`;
  setTimeout(drawGraph, 100);
}

// 绘制知识图谱
function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.parentElement.offsetWidth || 700;
  const H = canvas.height = Math.min(W * 0.7, 450);

  ctx.clearRect(0, 0, W, H);

  // 绘制连接线
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3]);
  SCHOOL_LINKS.forEach(link => {
    const from = SCHOOLS_DATA.find(s => s.id === link.from);
    const to = SCHOOLS_DATA.find(s => s.id === link.to);
    if (!from || !to) return;
    const x1 = from.x * W, y1 = from.y * H;
    const x2 = to.x * W, y2 = to.y * H;
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // 连线标签
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    ctx.setLineDash([]);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    ctx.fillText(link.label, mx, my - 4);
    ctx.setLineDash([5, 3]);
  });
  ctx.setLineDash([]);

  // 绘制节点
  SCHOOLS_DATA.forEach(school => {
    const x = school.x * W, y = school.y * H;
    const r = selectedSchool === school.id ? 38 : 32;
    // 圆形节点
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = school.color + '22';
    ctx.fill();
    ctx.strokeStyle = school.color;
    ctx.lineWidth = selectedSchool === school.id ? 3 : 2;
    ctx.stroke();
    // 文字
    ctx.fillStyle = school.color;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(school.name, x, y);
  });

  // 点击事件
  canvas.onclick = function(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (W / rect.width);
    const cy = (e.clientY - rect.top) * (H / rect.height);
    let clicked = null;
    SCHOOLS_DATA.forEach(s => {
      const dx = cx - s.x * W, dy = cy - s.y * H;
      if (Math.sqrt(dx*dx + dy*dy) < 38) clicked = s;
    });
    if (clicked) {
      selectedSchool = clicked.id;
      drawGraph();
      showSchoolDetail(clicked);
    }
  };
}

// 显示流派详情
function showSchoolDetail(school) {
  const el = document.getElementById('schoolDetail');
  if (!el) return;
  el.innerHTML = `<div class="knowledge-card" style="border-left-color:${school.color}">
    <h3 style="color:${school.color};margin-bottom:8px">${school.name}</h3>
    <p style="font-size:13px;color:#888;margin-bottom:10px">创始人：${school.founder}</p>
    <div class="school-section"><strong>核心概念：</strong>${school.concepts.join('、')}</div>
    <div class="school-section"><strong>代表疗法：</strong>${school.therapies.join('、')}</div>
    <div class="school-section"><strong>适用问题：</strong>${school.suitable.join('、')}</div>
  </div>`;
  el.scrollIntoView({behavior:'smooth'});
}
