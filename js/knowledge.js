// 心理学常识与经典理论模块
const KNOWLEDGE_DATA = [
  {
    title: '精神分析学派 - 弗洛伊德',
    icon: '🧠',
    content: '西格蒙德·弗洛伊德提出意识的冰山模型：意识、前意识、潜意识。人格结构由本我(快乐原则)、自我(现实原则)、超我(道德原则)组成。心理防御机制包括压抑、投射、合理化、升华等。童年经历对人格形成有深远影响。'
  },
  {
    title: '人本主义心理学 - 马斯洛需求层次',
    icon: '🏔️',
    content: '马斯洛需求层次理论将人类需求分为五层：生理需求→安全需求→社交归属→尊重需求→自我实现。只有低层需求被满足后，人才会追求更高层次的需求。自我实现是人类最高的心理追求。'
  },
  {
    title: '认知行为疗法(CBT) - 贝克',
    icon: '💭',
    content: '亚伦·贝克认为情绪障碍源于认知歪曲。核心概念：自动化思维→认知歪曲→核心信念。常见认知歪曲包括：全或无思维、灾难化、读心术、过度概括等。通过识别和修正歪曲认知来改善情绪。CBT是目前循证支持最多的心理治疗方法之一。'
  },
  {
    title: '积极心理学 - 塞利格曼',
    icon: '☀️',
    content: 'Martin Seligman提出PERMA幸福模型：P积极情绪、E投入、R关系、M意义、A成就。心理健康不仅是没有疾病，更是积极的心理功能状态。培养感恩、乐观、韧性等积极品质可以提升整体幸福感。习得性乐观可以对抗习得性无助。'
  },
  {
    title: '依恋理论 - 鲍尔比 & 安斯沃斯',
    icon: '🤝',
    content: '依恋类型分为：安全型、焦虑-矛盾型、回避型、紊乱型。早期依恋模式会影响成年后的亲密关系。安全依恋的人更容易建立健康关系；不安全依恋者可以通过自我觉察和心理治疗获得"习得性安全依恋"。'
  },
  {
    title: '正念疗法(MBSR/MBCT)',
    icon: '🧘',
    content: '乔·卡巴金创立正念减压(MBSR)，将正念引入临床。核心原则：非评判、当下觉察、接纳。正念可以降低焦虑、抑郁复发率。每天10-20分钟正念冥想练习可以改变大脑结构，增强前额叶皮质功能，减少杏仁核反应性。'
  }
];

function renderKnowledge() {
  const el = document.getElementById('knowledgeContent');
  if (!el) return;
  let html = '';
  KNOWLEDGE_DATA.forEach(item => {
    html += `<div class="knowledge-card">
      <div class="knowledge-icon">${item.icon}</div>
      <h3 class="knowledge-title">${item.title}</h3>
      <p class="knowledge-text">${item.content}</p>
    </div>`;
  });
  html += renderAdvancedTheories();
  el.innerHTML = html;
}

function renderAdvancedTheories() {
  const advanced = [
    {
      title: '接纳承诺疗法(ACT)',
      desc: '第三代行为疗法，核心六边形模型：接纳、认知解离、此时此刻、观察性自我、价值、承诺行动。不追求消除痛苦，而是带着痛苦朝价值方向行动。关键技术：解离练习("我注意到我有一个想法...")。'
    },
    {
      title: '辩证行为疗法(DBT)',
      desc: 'Linehan开发，结合认知行为与正念。四大技能模块：正念、人际效能、情绪调节、痛苦忍受。特别适用于情绪不稳定、自伤行为的来访者。核心哲学：接纳与改变的辩证统一。'
    },
    {
      title: '叙事疗法',
      desc: '将问题外化："你不是问题，问题才是问题"。通过重写生命故事，发现被忽视的"闪光时刻"，重建积极自我认同。技术包括：外化对话、解构提问、重写对话、见证仪式。'
    },
    {
      title: '情绪聚焦疗法(EFT)',
      desc: 'Greenberg开发，关注情绪在心理问题中的核心作用。区分适应性情绪和非适应性情绪。通过接触、表达核心情绪来实现转化。情绪不是要被控制的敌人，而是携带重要信息的信使。'
    },
    {
      title: '心理弹性与创伤后成长',
      desc: '逆境不一定导致创伤，许多人能在创伤后获得成长(PTG)。心理弹性的保护因素：社会支持、乐观解释风格、自我效能感、意义建构能力。VUCA时代培养弹性尤为重要。'
    },
    {
      title: '神经可塑性与心理治疗',
      desc: '大脑具有终身可塑性。心理治疗可以改变神经通路。反复练习新思维模式可以强化新的神经连接。冥想增厚前额叶皮质，CBT降低杏仁核活性。这意味着改变是可能的。'
    }
  ];

  let html = '<h3 style="margin:30px 0 15px;color:#4a4a8a;">前沿治疗方法</h3>';
  advanced.forEach(a => {
    html += `<div class="knowledge-card mini">
      <h4 class="knowledge-title">${a.title}</h4>
      <p class="knowledge-text">${a.desc}</p>
    </div>`;
  });
  return html;
}

// 页面加载时渲染
document.addEventListener('DOMContentLoaded', renderKnowledge);
