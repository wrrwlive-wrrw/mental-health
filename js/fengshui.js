// 风水大师模块 —— 融合易经、三命通会、渊海子平、滴天髓、子平真诠、紫微斗数全书、
// 麻衣神相、柳庄神相、葬书、玉匣记等中华术数经典
// 仅供传统文化学习和娱乐参考，不作为决策依据

const FENGSHUI_MODULES = {
  fengshui: { name:'风水与择吉', icon:'🏠', desc:'居家风水、方位吉凶、择日择时' },
  xiangshu: { name:'相术', icon:'👁️', desc:'麻衣神相、柳庄神相，观相识人' },
  ziwei:    { name:'紫微斗数', icon:'✨', desc:'紫微斗数十四主星命盘解读' },
  bazi:     { name:'四柱八字', icon:'📜', desc:'渊海子平、滴天髓，天干地支论命' },
  divine:   { name:'占卜', icon:'🎴', desc:'易经六十四卦、玉匣记宜忌' },
  yangsheng:{ name:'房中养生', icon:'🧘', desc:'黄帝内经、道家养生、精气神调养' },
  business: { name:'经商', icon:'💰', desc:'商道智慧、财运分析、生意利弊' },
  official: { name:'做官', icon:'🏛️', desc:'仕途运势、官运分析、进退之道' }
};

let fengshuiCurrentTab = 'fengshui';

function renderFengshui() {
  const el = document.getElementById('fengshuiContent');
  if (!el) return;
  el.innerHTML = `
    <div class="fs-intro">
      <p style="color:#666;font-size:13px;line-height:1.7">
        风水大师板块融合《易经》《三命通会》《渊海子平》《滴天髓》《子平真诠》《紫微斗数全书》
        《麻衣神相》《柳庄神相》《葬书》《玉匣记》等中华术数经典，五大板块系统展示传统文化智慧。
        <br><span style="color:#c17817">※ 内容仅供传统文化学习与娱乐参考，请理性看待，不作重大决策依据。</span>
      </p>
    </div>
    ${typeof renderFsUserInfoCard==='function'?renderFsUserInfoCard():''}
    <div class="fs-tabs" id="fsTabs">
      ${Object.entries(FENGSHUI_MODULES).map(([k,v])=>`
        <div class="fs-tab ${k===fengshuiCurrentTab?'active':''}" onclick="switchFsTab('${k}')">
          <span class="fs-tab-icon">${v.icon}</span>
          <span class="fs-tab-name">${v.name}</span>
        </div>`).join('')}
    </div>
    <div class="fs-panel" id="fsPanel"></div>`;
  showFsTab(fengshuiCurrentTab);
}

function switchFsTab(tab) {
  fengshuiCurrentTab = tab;
  document.querySelectorAll('.fs-tab').forEach(el=>{
    el.classList.toggle('active', el.textContent.includes(FENGSHUI_MODULES[tab].name));
  });
  showFsTab(tab);
}

function showFsTab(tab) {
  const el = document.getElementById('fsPanel');
  if (!el) return;
  const renderers = {
    fengshui: renderFsFengshui,
    xiangshu: renderFsXiangshu,
    ziwei:    renderFsZiwei,
    bazi:     renderFsBazi,
    divine:   renderFsDivine,
    yangsheng:renderFsYangsheng,
    business: renderFsBusiness,
    official: renderFsOfficial
  };
  el.innerHTML = renderers[tab] ? renderers[tab]() : '<p>敬请期待</p>';
}

// 各二级模块渲染（知识 + 互动分析）
function renderFsFengshui() { return getFengshuiFengshui() + renderFsLab('fengshui'); }
function renderFsXiangshu() { return getFengshuiXiangshu() + renderFsLab('xiangshu'); }
function renderFsZiwei()    { return getFengshuiZiwei() + renderFsLab('ziwei'); }
function renderFsBazi()     { return getFengshuiBazi() + renderFsLab('bazi'); }
function renderFsDivine()   { return getFengshuiDivine() + renderFsLab('divine'); }
function renderFsYangsheng(){ return getFengshuiYangsheng() + renderFsLab('yangsheng'); }
function renderFsBusiness() { return getFengshuiBusiness() + renderFsLab('business'); }
function renderFsOfficial() { return getFengshuiOfficial() + renderFsLab('official'); }

// ========== 一、风水与择吉 ==========
function getFengshuiFengshui() {
  return `
    <h3 class="fs-h3">📖 典籍溯源</h3>
    <div class="fs-book">
      <b>《葬书》</b>（东晋·郭璞）：中国风水学奠基之作，提出"藏风聚气"核心理论，
      "气乘风则散，界水则止"是风水的基本原理。<br>
      <b>《玉匣记》</b>（相传许真君著）：择吉宝典，涵盖二十四节气、黄道吉日、
      安葬嫁娶、动土出行等日常宜忌。
    </div>

    <h3 class="fs-h3">🧭 阳宅风水核心概念</h3>
    <div class="fs-grid">
      <div class="fs-card">
        <h4>八卦方位</h4>
        <p>乾（西北·父）、坤（西南·母）、震（东·长男）、巽（东南·长女）、
        坎（北·中男）、离（南·中女）、艮（东北·少男）、兑（西·少女）</p>
      </div>
      <div class="fs-card">
        <h4>阳宅三要</h4>
        <p><b>门</b>：气口，家宅生气入口<br>
        <b>主</b>：主人卧室，安身之所<br>
        <b>灶</b>：厨房，主健康财禄</p>
      </div>
      <div class="fs-card">
        <h4>形势派</h4>
        <p>观地形山水走势：龙（山脉）、穴（气聚点）、砂（周围山丘）、水（河流水口）、向（朝向）。
        寻龙点穴，讲究"藏风聚气"。</p>
      </div>
      <div class="fs-card">
        <h4>理气派</h4>
        <p>用罗盘测方位，配合河图洛书、九星飞布、三元九运推算吉凶。
        代表：玄空飞星、八宅明镜、三合派。</p>
      </div>
    </div>

    <h3 class="fs-h3">🏠 居家风水常识</h3>
    <ul class="fs-list">
      <li><b>大门朝向</b>：正对楼梯/电梯（穿堂煞）、正对厕所（污秽冲门）为忌</li>
      <li><b>卧室</b>：床头忌靠窗、忌对镜、忌横梁压顶；床下宜通风忌堆杂物</li>
      <li><b>厨房</b>：炉灶忌对门、忌与水槽相冲（水火相克）</li>
      <li><b>客厅</b>：宜方正明亮，忌昏暗压抑；沙发宜靠实墙</li>
      <li><b>书房</b>：书桌宜面窗（明堂开阔），忌背窗背门</li>
      <li><b>阳台</b>：宜通透纳气，不宜堆放杂物遮光</li>
    </ul>

    <h3 class="fs-h3">📅 择吉与择日</h3>
    <div class="fs-book">
      <b>黄道十二神</b>：青龙、明堂、金匮、天德、玉堂、司命为六黄道吉神；
      天刑、朱雀、白虎、天牢、玄武、勾陈为六黑道凶神。<br>
      <b>建除十二值</b>：建、除、满、平、定、执、破、危、成、收、开、闭。
      如"成日"宜嫁娶、开业；"破日"忌一切喜事。<br>
      <b>二十八宿</b>：角亢氐房心尾箕（东苍龙）、斗牛女虚危室壁（北玄武）、
      奎娄胃昴毕觜参（西白虎）、井鬼柳星张翼轸（南朱雀），各有宜忌。
    </div>

    <h3 class="fs-h3">🌿 化煞方法</h3>
    <div class="fs-grid">
      <div class="fs-card"><h4>山海镇</h4><p>化解冲煞、路冲、墙角煞</p></div>
      <div class="fs-card"><h4>五帝钱</h4><p>顺治、康熙、雍正、乾隆、嘉庆五帝铜钱，挡煞纳福</p></div>
      <div class="fs-card"><h4>植物化煞</h4><p>富贵竹旺文昌，绿萝净化气场，仙人掌挡尖角煞</p></div>
      <div class="fs-card"><h4>水晶洞</h4><p>紫水晶助学业，黄水晶招财，白水晶净化</p></div>
    </div>

    <div class="fs-tip">
      💡 现代视角：风水本质是环境心理学与人居美学的融合。房屋通风采光好、动线合理、
      整洁有序，本身就有利于身心健康。传统智慧值得借鉴，但不必迷信。
    </div>
  `;
}
// ========== 二、相术 ==========
function getFengshuiXiangshu() {
  return `
    <h3 class="fs-h3">📖 典籍溯源</h3>
    <div class="fs-book">
      <b>《麻衣神相》</b>（宋·陈抟传）：中国相术集大成之作，系统论五官、气色、骨骼、纹路。<br>
      <b>《柳庄神相》</b>（明·袁忠彻）：详解流年运程与相理配合，"相术两大巅峰"之一。
    </div>
    <h3 class="fs-h3">👤 面相基础·三停五官</h3>
    <div class="fs-grid">
      <div class="fs-card"><h4>三停</h4>
        <p><b>上停</b>发际至眉·主早年(15-30)智慧家世<br>
        <b>中停</b>眉至鼻尖·主中年(31-50)事业<br>
        <b>下停</b>人中至下巴·主晚年(51+)子女福禄</p></div>
      <div class="fs-card"><h4>五官</h4>
        <p>眉=保寿官 眼=监察官 鼻=审辨官 耳=采听官 口=出纳官</p></div>
      <div class="fs-card"><h4>十二宫</h4>
        <p>命宫(印堂) 财帛(鼻头) 兄弟(眉) 田宅(眼上) 男女(卧蚕)
        奴仆(地阁) 妻妾(眼尾) 疾厄(山根) 迁移(额角) 官禄(额中) 福德(天仓) 父母(日月角)</p></div>
      <div class="fs-card"><h4>五行相</h4>
        <p>金形方正白净·刚毅<br>木形瘦长挺直·仁厚<br>水形圆润肉厚·智慧<br>
        火形尖削红润·急性<br>土形敦厚黄润·稳重</p></div>
    </div>
    <h3 class="fs-h3">✋ 手相</h3>
    <div class="fs-book">
      <b>三大主线</b>：生命线（体力健康）、智慧线（思维决策）、感情线（情感人际）<br>
      <b>掌丘</b>：金星丘(活力) 木星丘(企图) 土星丘(责任) 太阳丘(艺术) 水星丘(沟通) 月丘(想象)
    </div>
    <div class="fs-tip">💡 "相由心生"——面容反映长期情绪与健康，与微表情心理学相通。保持平和自然有好气色。</div>
  `;
}
// ========== 三、紫微斗数 ==========
function getFengshuiZiwei() {
  return `
    <h3 class="fs-h3">📖 典籍溯源</h3>
    <div class="fs-book">
      <b>《紫微斗数全书》</b>（宋·陈希夷传）：以紫微星为核心，结合十四主星、
      十二宫位排列命盘，被誉为"天下第一神数"。</div>
    <h3 class="fs-h3">✨ 十四主星</h3>
    <div class="fs-grid">
      <div class="fs-card"><h4>紫微</h4><p>帝星·领导力、尊贵、决断</p></div>
      <div class="fs-card"><h4>天机</h4><p>智星·聪慧、善变、心思缜密</p></div>
      <div class="fs-card"><h4>太阳</h4><p>光明·热情、付出、男性贵人</p></div>
      <div class="fs-card"><h4>武曲</h4><p>财星·刚毅、重财、实干</p></div>
      <div class="fs-card"><h4>天同</h4><p>福星·乐观、懒散、享乐</p></div>
      <div class="fs-card"><h4>廉贞</h4><p>桃花·感性、多才、是非</p></div>
      <div class="fs-card"><h4>天府</h4><p>库星·稳重、理财、保守</p></div>
      <div class="fs-card"><h4>太阴</h4><p>月亮·柔美、内敛、女性贵人</p></div>
      <div class="fs-card"><h4>贪狼</h4><p>欲望·多才艺、好学、桃花</p></div>
      <div class="fs-card"><h4>巨门</h4><p>暗星·口才好、是非、研究</p></div>
      <div class="fs-card"><h4>天相</h4><p>印星·服务、贵气、面子</p></div>
      <div class="fs-card"><h4>天梁</h4><p>荫星·正直、化解灾厄、长辈缘</p></div>
      <div class="fs-card"><h4>七杀</h4><p>将星·果断、开创、孤独</p></div>
      <div class="fs-card"><h4>破军</h4><p>变星·破旧立新、冒险、波动</p></div>
    </div>
    <h3 class="fs-h3">🏛️ 十二宫位</h3>
    <div class="fs-book">
      命宫（性格核心）、兄弟（手足朋友）、夫妻（婚姻感情）、子女（后代创造力）、
      财帛（财运模式）、疾厄（健康弱点）、迁移（外出发展）、交友（人脉社交）、
      事业（官禄成就）、田宅（不动产家庭）、福德（精神享受）、父母（长辈教育）
    </div>
    <h3 class="fs-h3">⭐ 四化飞星</h3>
    <ul class="fs-list">
      <li><b>化禄</b>：财缘、顺利、桃花、好人缘</li>
      <li><b>化权</b>：权力、企图心、竞争、能力</li>
      <li><b>化科</b>：文采、名声、贵人、考试</li>
      <li><b>化忌</b>：阻碍、执着、纠纷、缺陷</li>
    </ul>
    <div class="fs-tip">💡 紫微斗数是一套性格分类学，类似于MBTI的古代版本。了解自身特质，取长补短即可。</div>
  `;
}
// ========== 四、四柱八字 ==========
function getFengshuiBazi() {
  return `
    <h3 class="fs-h3">📖 典籍溯源</h3>
    <div class="fs-book">
      <b>《三命通会》</b>（明·万民英）：八字命理百科全书，集前人之大成。<br>
      <b>《渊海子平》</b>（宋·徐子平）：奠定以日干为核心的命学体系。<br>
      <b>《滴天髓》</b>（清·任铁樵注）：八字哲学巅峰，"一字定乾坤"。<br>
      <b>《子平真诠》</b>（清·沈孝瞻）：格局法精论，用神取用经典。
    </div>
    <h3 class="fs-h3">📜 基础概念</h3>
    <div class="fs-grid">
      <div class="fs-card"><h4>天干</h4>
        <p>甲乙(木) 丙丁(火) 戊己(土) 庚辛(金) 壬癸(水)<br>
        阳干：甲丙戊庚壬 / 阴干：乙丁己辛癸</p></div>
      <div class="fs-card"><h4>地支</h4>
        <p>子丑寅卯辰巳午未申酉戌亥<br>
        子(鼠)丑(牛)寅(虎)卯(兔)辰(龙)巳(蛇)午(马)未(羊)申(猴)酉(鸡)戌(狗)亥(猪)</p></div>
      <div class="fs-card"><h4>四柱排法</h4>
        <p><b>年柱</b>：出生年份干支<br><b>月柱</b>：出生月份干支<br>
        <b>日柱</b>：出生日干支（日干为"我"）<br><b>时柱</b>：出生时辰干支</p></div>
      <div class="fs-card"><h4>十神</h4>
        <p>正官/七杀（管束力量）<br>正印/偏印（知识贵人）<br>
        比肩/劫财（竞争兄弟）<br>食神/伤官（才华输出）<br>正财/偏财（财运来源）</p></div>
    </div>
    <h3 class="fs-h3">⚖️ 五行生克</h3>
    <div class="fs-book">
      <b>相生</b>：木生火 → 火生土 → 土生金 → 金生水 → 水生木<br>
      <b>相克</b>：木克土 → 土克水 → 水克火 → 火克金 → 金克木<br>
      八字以五行平衡为贵，偏旺则泄之克之，偏弱则生之助之。
    </div>
    <h3 class="fs-h3">🎯 格局与用神</h3>
    <ul class="fs-list">
      <li><b>正官格</b>：有约束力，适合体制内、管理岗</li>
      <li><b>七杀格</b>：魄力强，适合开创、军警、手术</li>
      <li><b>食神格</b>：才华横溢，适合艺术、餐饮、教育</li>
      <li><b>正财格</b>：稳健求财，适合会计、实业经营</li>
      <li><b>偏印格</b>：思维独特，适合研究、玄学、技术</li>
    </ul>
    <div class="fs-tip">💡 八字本质是用天干地支的排列组合描述出生时的宇宙能量分布。
    现代可将其视为一种性格与潜能的分类参考，重在自我认知，不必宿命论。</div>
  `;
}
// ========== 五、占卜 ==========
function getFengshuiDivine() {
  return `
    <h3 class="fs-h3">📖 典籍溯源</h3>
    <div class="fs-book">
      <b>《周易》</b>（周·文王演卦、孔子作传）：群经之首，六十四卦涵盖万象，
      "一阴一阳之谓道"是中华哲学之根。<br>
      <b>《玉匣记》</b>：民间占卜百科，涵盖签卦、吉凶、宜忌、方位择吉。
    </div>
    <h3 class="fs-h3">☯️ 易经八卦</h3>
    <div class="fs-grid">
      <div class="fs-card"><h4>☰ 乾</h4><p>天·刚健·创始·君父</p></div>
      <div class="fs-card"><h4>☷ 坤</h4><p>地·柔顺·承载·母亲</p></div>
      <div class="fs-card"><h4>☳ 震</h4><p>雷·动·奋发·长男</p></div>
      <div class="fs-card"><h4>☴ 巽</h4><p>风·入·渗透·长女</p></div>
      <div class="fs-card"><h4>☵ 坎</h4><p>水·险·智慧·中男</p></div>
      <div class="fs-card"><h4>☲ 离</h4><p>火·丽·光明·中女</p></div>
      <div class="fs-card"><h4>☶ 艮</h4><p>山·止·沉静·少男</p></div>
      <div class="fs-card"><h4>☱ 兑</h4><p>泽·悦·口舌·少女</p></div>
    </div>
    <h3 class="fs-h3">🎴 占卜方法</h3>
    <div class="fs-grid">
      <div class="fs-card"><h4>蓍草法</h4><p>传统正统起卦：取50根蓍草，
        经分二挂一揲四归奇四步得爻，六爻成卦。最为庄重。</p></div>
      <div class="fs-card"><h4>铜钱法（六爻）</h4><p>三枚铜钱摇六次，
        两正一反为少阳(—)，两反一正为少阴(--)，三正为老阳(动爻)，三反为老阴(动爻)。</p></div>
      <div class="fs-card"><h4>梅花易数</h4><p>宋·邵雍创。取数起卦：
        年月日时数、字数、声数、方位数均可起卦。"万物皆可占"。</p></div>
      <div class="fs-card"><h4>抽签问卦</h4><p>寺庙观音签、关帝签等，
        以虔诚心态默念所问之事，抽得签文后对照解签。</p></div>
    </div>
    <h3 class="fs-h3">📋 六十四卦速览（举要）</h3>
    <ul class="fs-list">
      <li><b>乾为天</b>：元亨利贞，大吉大利，但戒骄戒躁（亢龙有悔）</li>
      <li><b>坤为地</b>：厚德载物，柔顺包容，利于守成不利开创</li>
      <li><b>水雷屯</b>：初始艰难，如草木破土，坚持必成</li>
      <li><b>山水蒙</b>：启蒙教育，虚心求学，不耻下问</li>
      <li><b>天水讼</b>：有争端，宜和解不宜硬争，退一步海阔天空</li>
      <li><b>地水师</b>：集体行动，需纪律与领导，利合作</li>
      <li><b>风天小畜</b>：积少成多，暂时受阻，蓄势待发</li>
      <li><b>天泽履</b>：行事谨慎如履薄冰，以礼待人可化险</li>
      <li><b>地天泰</b>：通泰安康，上下交融，大吉</li>
      <li><b>天地否</b>：闭塞不通，暂时低谷，"否极泰来"</li>
    </ul>
    <div class="fs-tip">
      💡 易经本质是一部辩证哲学——"变"是永恒的，物极必反，否极泰来。
      与其用来预测未来，不如用来修炼心性：遇事不慌，顺势而为，知进退。
    </div>
  `;
}
