// 24小时心理求助热线模块
function renderHotline() {
  const el = document.getElementById('hotlineContent');
  el.innerHTML = `
    <div class="hotline-emergency">
      <div class="emergency-title">🚨 紧急情况请立即拨打</div>
      <div class="emergency-desc">如果你或身边的人正处于危及生命的紧急状态，请拨打</div>
      <a href="tel:120" class="emergency-btn">120 急救</a>
      <a href="tel:110" class="emergency-btn">110 报警</a>
    </div>
    <div class="hotline-tabs">
      <button class="hl-tab active" onclick="switchHLTab('national',this)">🇨🇳 全国24H热线</button>
      <button class="hl-tab" onclick="switchHLTab('local',this)">📍 各地热线</button>
      <button class="hl-tab" onclick="switchHLTab('special',this)">👥 专项人群</button>
      <button class="hl-tab" onclick="switchHLTab('online',this)">💬 网络援助</button>
      <button class="hl-tab" onclick="switchHLTab('guide',this)">📖 拨打指南</button>
    </div>
    <div id="hlContent"></div>
  `;
  switchHLTab('national', el.querySelector('.hl-tab'));
}
function switchHLTab(tab, btn) {
  document.querySelectorAll('.hl-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const c = document.getElementById('hlContent');
  const renders = { national: hlNational, local: hlLocal, special: hlSpecial, online: hlOnline, guide: hlGuide };
  if (renders[tab]) c.innerHTML = renders[tab]();
}

function hlNational() {
  const lines = [
    { name:'全国心理援助热线', tel:'400-161-9995', org:'中国心理学会', time:'24小时', desc:'专业心理咨询师接听，免费保密' },
    { name:'生命热线', tel:'400-821-1215', org:'上海精神卫生中心', time:'24小时', desc:'危机干预与自杀预防' },
    { name:'希望24热线', tel:'400-161-9995', org:'北京心理危机研究与干预中心', time:'24小时', desc:'全国覆盖，免费保密' },
    { name:'北京心理危机研究与干预中心', tel:'010-82951332', org:'北京回龙观医院', time:'24小时', desc:'中国首条心理危机干预热线' },
    { name:'全国心理健康热线', tel:'12320-5', org:'国家卫健委', time:'工作日8:00-17:00', desc:'权威官方心理咨询' },
    { name:'青少年心理援助热线', tel:'12355', org:'共青团中央', time:'周一至周五 8:30-20:30', desc:'12岁-25岁青少年专线' }
  ];
  return `<div class="hl-section">
    <h3>🇨🇳 全国24小时心理援助热线</h3>
    <p class="hl-intro">所有热线均<b>免费</b>且<b>严格保密</b>，拨打不会留下不良记录。</p>
    <div class="hl-list">${lines.map(l => renderHotlineCard(l)).join('')}</div>
  </div>`;
}

function renderHotlineCard(l) {
  return `<div class="hl-card">
    <div class="hl-card-header">
      <h4>${l.name}</h4>
      <span class="hl-time">${l.time}</span>
    </div>
    <div class="hl-card-body">
      <a href="tel:${l.tel.replace(/-/g,'')}" class="hl-tel">${l.tel}</a>
      <span class="hl-org">${l.org}</span>
    </div>
    <p class="hl-desc">${l.desc}</p>
  </div>`;
}

function hlLocal() {
  const cities = [
    { city:'北京', tel:'010-82951332', org:'回龙观医院心理危机干预热线' },
    { city:'上海', tel:'021-12320-5', org:'上海市精神卫生中心' },
    { city:'广州', tel:'020-81899120', org:'广州市心理援助热线' },
    { city:'深圳', tel:'0755-25629459', org:'深圳市康宁医院' },
    { city:'成都', tel:'028-87577510', org:'成都市第四人民医院' },
    { city:'武汉', tel:'027-85844666', org:'武汉市精神卫生中心' },
    { city:'南京', tel:'025-83712977', org:'南京脑科医院' },
    { city:'杭州', tel:'0571-85029595', org:'杭州市第七人民医院' },
    { city:'重庆', tel:'023-67530101', org:'重庆市精神卫生中心' },
    { city:'西安', tel:'029-87801825', org:'西安市精神卫生中心' },
    { city:'天津', tel:'022-88188858', org:'天津市安定医院' },
    { city:'长沙', tel:'0731-85501010', org:'长沙市心理援助热线' }
  ];
  return `<div class="hl-section">
    <h3>📍 各地心理援助热线</h3>
    <div class="hl-city-grid">${cities.map(c => `
      <div class="hl-city-card">
        <h4>${c.city}</h4>
        <a href="tel:${c.tel.replace(/-/g,'')}" class="hl-tel">${c.tel}</a>
        <p class="hl-org">${c.org}</p>
      </div>`).join('')}
    </div>
  </div>`;
}
function hlSpecial() {
  return `<div class="hl-section">
    <h3>👥 专项人群心理援助</h3>
    <div class="hl-list">
      ${renderHotlineCard({name:'青少年心理援助热线',tel:'12355',org:'共青团中央',time:'周一至五 8:30-20:30',desc:'12-25岁青少年学业、情感、人际困扰'})}
      ${renderHotlineCard({name:'妇女维权热线',tel:'12338',org:'全国妇联',time:'工作日',desc:'家暴、性别歧视、婚姻家庭问题'})}
      ${renderHotlineCard({name:'农民工法律援助',tel:'12348',org:'司法部',time:'工作日',desc:'劳动纠纷、工伤、法律咨询'})}
      ${renderHotlineCard({name:'退役军人心理服务',tel:'010-68580599',org:'退役军人事务部',time:'工作日',desc:'退役军人及军属心理支持'})}
      ${renderHotlineCard({name:'残疾人心理援助',tel:'12385',org:'中国残联',time:'工作日',desc:'残障人士心理咨询与权益维护'})}
      ${renderHotlineCard({name:'高校学生心理危机干预',tel:'010-58800525',org:'教育部',time:'24小时',desc:'大学生心理危机紧急干预'})}
    </div>
  </div>`;
}

function hlOnline() {
  return `<div class="hl-section">
    <h3>💬 网络心理援助平台</h3>
    <p class="hl-intro">如果不方便打电话，也可以通过以下在线平台获取帮助：</p>
    <div class="hl-online-grid">
      <div class="hl-online-card">
        <h4>壹心理</h4>
        <p>国内领先的心理健康平台，提供免费心理测评和付费在线咨询</p>
        <p class="hl-url">www.xinli001.com</p>
      </div>
      <div class="hl-online-card">
        <h4>简单心理</h4>
        <p>专业心理咨询预约平台，严格筛选咨询师资质</p>
        <p class="hl-url">www.jiandanxinli.com</p>
      </div>
      <div class="hl-online-card">
        <h4>暖心壹疗</h4>
        <p>公益性在线心理疏导，志愿者陪伴倾听</p>
        <p class="hl-url">微信搜索"暖心壹疗"</p>
      </div>
      <div class="hl-online-card">
        <h4>各高校心理中心</h4>
        <p>每所大学均设有心理咨询中心，免费面向在校学生</p>
        <p class="hl-url">联系方式见学校官网/辅导员通知</p>
      </div>
      <div class="hl-online-card">
        <h4>微信小程序·心灵树洞</h4>
        <p>匿名文字倾诉，AI+真人结合的倾听服务</p>
        <p class="hl-url">微信搜索"心灵树洞"</p>
      </div>
      <div class="hl-online-card">
        <h4>知乎·心理学话题</h4>
        <p>大量心理科普文章和经验分享</p>
        <p class="hl-url">www.zhihu.com/topic/心理学</p>
      </div>
    </div>
  </div>`;
}

function hlGuide() {
  return `<div class="hl-section">
    <h3>📖 拨打心理热线指南</h3>
    <div class="hl-guide-content">
      <div class="hl-guide-card">
        <h4>什么时候应该拨打？</h4>
        <ul>
          <li>持续感到绝望、无意义感超过两周</li>
          <li>有自伤或自杀的想法或冲动</li>
          <li>焦虑/恐慌到无法正常生活</li>
          <li>失眠严重，连续一周以上</li>
          <li>遭遇重大创伤事件（亲人离世、暴力等）</li>
          <li>感到极度孤独，没有人可以倾诉</li>
        </ul>
      </div>
      <div class="hl-guide-card">
        <h4>拨打前的准备</h4>
        <ul>
          <li>找一个安静、私密的空间</li>
          <li>不需要提前想好说什么，直接拨打即可</li>
          <li>可以匿名，不需要提供个人信息</li>
          <li>准备好纸笔，记录咨询师的建议</li>
        </ul>
      </div>
      <div class="hl-guide-card">
        <h4>通话中会发生什么？</h4>
        <ul>
          <li>接线员会先确认你的安全状态</li>
          <li>你可以说任何感受，不会被批评</li>
          <li>他们会耐心倾听，帮助你理清思路</li>
          <li>可能会提供应对建议或转介资源</li>
          <li>所有内容严格保密</li>
        </ul>
      </div>
      <div class="hl-guide-card">
        <h4>重要提醒</h4>
        <ul>
          <li>拨打心理热线不会留下任何记录</li>
          <li>不会影响升学、就业、征信</li>
          <li>你不需要"足够严重"才能求助</li>
          <li>任何程度的困扰都值得被倾听</li>
          <li><b>寻求帮助是勇敢的表现，不是软弱</b></li>
        </ul>
      </div>
    </div>
  </div>`;
}
