// 减压工具模块：冥想、呼吸练习、正念、道教、佛教、瑜伽
function renderStressRelief() {
  const el = document.getElementById('stressReliefContent');
  el.innerHTML = `
    <div class="sr-tabs">
      <button class="sr-tab active" onclick="switchSRTab('breathing',this)">🌬️ 呼吸练习</button>
      <button class="sr-tab" onclick="switchSRTab('meditation',this)">🧘 冥想引导</button>
      <button class="sr-tab" onclick="switchSRTab('mindfulness',this)">🍃 正念练习</button>
      <button class="sr-tab" onclick="switchSRTab('taoism',this)">☯️ 道家养生</button>
      <button class="sr-tab" onclick="switchSRTab('buddhism',this)">🪷 佛学静心</button>
      <button class="sr-tab" onclick="switchSRTab('yoga',this)">🧘‍♀️ 瑜伽放松</button>
    </div>
    <div id="srContent"></div>
  `;
  switchSRTab('breathing', el.querySelector('.sr-tab'));
}

function switchSRTab(tab, btn) {
  document.querySelectorAll('.sr-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const content = document.getElementById('srContent');
  const renderers = {
    breathing: renderBreathing,
    meditation: renderMeditation,
    mindfulness: renderMindfulness,
    taoism: renderTaoism,
    buddhism: renderBuddhism,
    yoga: renderYoga
  };
  if (renderers[tab]) content.innerHTML = renderers[tab]();
}

// === 呼吸练习 ===
function renderBreathing() {
  return `
    <div class="sr-section">
      <h3>🌬️ 科学呼吸练习</h3>
      <div class="sr-exercise-grid">
        ${renderBreathCard('478呼吸法', '吸气4秒→屏气7秒→呼气8秒', '哈佛推荐的快速入睡法，激活副交感神经，60秒内降低心率', 'breath478')}
        ${renderBreathCard('方块呼吸法', '吸4秒→屏4秒→呼4秒→屏4秒', '海豹突击队使用的抗压技术，适合考试前/面试前紧张时使用', 'breathBox')}
        ${renderBreathCard('腹式呼吸', '双手放腹部，鼻吸嘴呼，腹部起伏', '最基础的放松技术，随时可用，5分钟即可降低焦虑水平', 'breathBelly')}
        ${renderBreathCard('交替鼻孔呼吸', '右手拇指堵右鼻→左吸→堵左→右呼', '瑜伽传统呼吸法(Nadi Shodhana)，平衡左右脑，安定心神', 'breathAlt')}
      </div>
      <div id="breathTimer" class="breath-timer-area"></div>
    </div>`;
}

function renderBreathCard(title, steps, desc, id) {
  return `<div class="sr-card" onclick="startBreathExercise('${id}')">
    <h4>${title}</h4>
    <p class="sr-steps">${steps}</p>
    <p class="sr-desc">${desc}</p>
    <button class="btn btn-primary btn-sm">开始练习</button>
  </div>`;
}

// === 呼吸计时器 ===
let breathTimerId = null;
const BREATH_PATTERNS = {
  breath478: { name:'478呼吸法', phases:[['吸气',4],['屏气',7],['呼气',8]], rounds:6 },
  breathBox: { name:'方块呼吸法', phases:[['吸气',4],['屏气',4],['呼气',4],['屏气',4]], rounds:8 },
  breathBelly: { name:'腹式呼吸', phases:[['缓慢吸气',5],['缓慢呼气',6]], rounds:12 },
  breathAlt: { name:'交替鼻孔呼吸', phases:[['左鼻吸气',4],['屏气',4],['右鼻呼气',6],['右鼻吸气',4],['屏气',4],['左鼻呼气',6]], rounds:6 }
};

function startBreathExercise(id) {
  if (breathTimerId) clearInterval(breathTimerId);
  const p = BREATH_PATTERNS[id];
  if (!p) return;
  const area = document.getElementById('breathTimer');
  let round = 1, phaseIdx = 0, sec = p.phases[0][1];
  area.innerHTML = `<div class="breath-runner">
    <h3>${p.name}</h3>
    <div class="breath-circle" id="breathCircle"><span id="breathPhase">${p.phases[0][0]}</span></div>
    <div class="breath-count" id="breathCount">${sec}</div>
    <div class="breath-progress" id="breathProgress">第 1/${p.rounds} 轮</div>
    <button class="btn btn-secondary btn-sm" onclick="stopBreath()">结束练习</button>
  </div>`;
  const update = () => {
    document.getElementById('breathPhase').textContent = p.phases[phaseIdx][0];
    document.getElementById('breathCount').textContent = sec;
    document.getElementById('breathProgress').textContent = `第 ${round}/${p.rounds} 轮`;
    const circle = document.getElementById('breathCircle');
    if (circle) {
      const ph = p.phases[phaseIdx][0];
      circle.className = 'breath-circle ' + (ph.includes('吸')?'inhale':ph.includes('呼')?'exhale':'hold');
    }
  };
  update();
  breathTimerId = setInterval(() => {
    sec--;
    if (sec <= 0) {
      phaseIdx++;
      if (phaseIdx >= p.phases.length) { phaseIdx = 0; round++; }
      if (round > p.rounds) {
        stopBreath();
        area.innerHTML = `<div class="breath-done">✅ 练习完成！感受身体的放松与呼吸的节奏。</div>`;
        return;
      }
      sec = p.phases[phaseIdx][1];
    }
    update();
  }, 1000);
}

function stopBreath() {
  if (breathTimerId) { clearInterval(breathTimerId); breathTimerId = null; }
}
// === 冥想引导 ===
function renderMeditation() {
  return `<div class="sr-section">
    <h3>🧘 冥想引导</h3>
    <p class="sr-intro">冥想是经科学验证的减压方式，坚持8周可显著降低焦虑和抑郁水平（JAMA 2014研究）。</p>
    <div class="sr-exercise-grid">
      <div class="sr-card">
        <h4>身体扫描冥想（15分钟）</h4>
        <p class="sr-desc">从头顶到脚趾，逐个部位觉察身体感受，释放紧绷</p>
        <div class="sr-guide">
          <p><b>步骤：</b></p>
          <ol><li>平躺或坐在椅子上，闭眼</li>
          <li>从头顶开始，觉察头皮、额头的感觉</li>
          <li>依次移到面部、颈部、肩膀、手臂...</li>
          <li>觉察每个部位的紧绷、温度、触感</li>
          <li>不做判断，只是观察，然后放下</li>
          <li>最后回到整体身体的感受</li></ol>
        </div>
      </div>
      <div class="sr-card">
        <h4>慈悲冥想（10分钟）</h4>
        <p class="sr-desc">培养对自己和他人的善意与温暖</p>
        <div class="sr-guide">
          <p><b>步骤：</b></p>
          <ol><li>舒适地坐着，感受呼吸</li>
          <li>对自己说：愿我平安，愿我快乐，愿我健康</li>
          <li>想一个你爱的人，送出同样的祝福</li>
          <li>想一个中性的人（如邻居），送出祝福</li>
          <li>想一个有矛盾的人，尝试送出祝福</li>
          <li>最后扩展到所有众生</li></ol>
        </div>
      </div>
      <div class="sr-card">
        <h4>专注力冥想（5分钟）</h4>
        <p class="sr-desc">以呼吸为锚点训练注意力，适合新手</p>
        <div class="sr-guide">
          <p><b>步骤：</b></p>
          <ol><li>挺直脊背坐好，轻闭眼</li>
          <li>将注意力放在鼻尖的呼吸上</li>
          <li>数息：吸1呼2，吸3呼4...数到10后重来</li>
          <li>走神时不责怪自己，温和地拉回注意力</li>
          <li>每次"拉回"都是一次注意力锻炼</li></ol>
        </div>
      </div>
      <div class="sr-card">
        <h4>引导想象冥想</h4>
        <p class="sr-desc">想象一个安全、宁静的场景，让身心沉浸其中</p>
        <div class="sr-guide">
          <p><b>场景选择：</b>海边、森林、山顶、花园</p>
          <p>闭上眼睛，想象自己在这个地方：看到什么颜色？听到什么声音？皮肤感受到什么温度？闻到什么气味？</p>
          <p>让自己在这个场景中停留5-10分钟。</p>
        </div>
      </div>
    </div>
  </div>`;
}
// === 正念练习 ===
function renderMindfulness() {
  return `<div class="sr-section">
    <h3>🍃 正念练习（Mindfulness）</h3>
    <p class="sr-intro">正念即"有意识地关注当下，不加评判"。麻省理工卡巴金教授创立MBSR项目，40年科研验证有效。</p>
    <div class="sr-exercise-grid">
      <div class="sr-card">
        <h4>🍇 葡萄干练习（经典入门）</h4>
        <p class="sr-desc">用5分钟吃一颗葡萄干（或任何食物），全神贯注体验</p>
        <ol class="sr-guide">
          <li><b>观察：</b>像从未见过它一样，看颜色、纹理、光泽</li>
          <li><b>触摸：</b>感受质地、温度、重量</li>
          <li><b>嗅闻：</b>凑近闻它的气味</li>
          <li><b>放入口中：</b>先不咀嚼，感受舌头上的触感</li>
          <li><b>缓慢咀嚼：</b>觉察味道的变化、口腔的动作</li>
          <li><b>吞咽：</b>觉察它通过喉咙的感觉</li>
        </ol>
      </div>
      <div class="sr-card">
        <h4>🚶 正念行走</h4>
        <p class="sr-desc">走路本身就是练习，无需额外时间</p>
        <ol class="sr-guide">
          <li>放慢速度，感受脚掌接触地面的每一刻</li>
          <li>觉察脚跟→脚掌→脚趾的重心转移</li>
          <li>注意膝盖、髋部、手臂的自然摆动</li>
          <li>感受空气拂过皮肤、阳光的温度</li>
          <li>思绪飘走时，温柔地拉回到脚步上</li>
        </ol>
      </div>
      <div class="sr-card">
        <h4>🌊 情绪冲浪（RAIN法）</h4>
        <p class="sr-desc">遇到强烈情绪时，用RAIN四步处理</p>
        <ol class="sr-guide">
          <li><b>R (Recognize)：</b>识别 - "我现在感到焦虑"</li>
          <li><b>A (Allow)：</b>允许 - 不抗拒它，让它存在</li>
          <li><b>I (Investigate)：</b>探究 - 身体哪里紧？想法是什么？</li>
          <li><b>N (Nurture)：</b>滋养 - 像对待朋友一样安慰自己</li>
        </ol>
        <p class="sr-desc" style="margin-top:8px;color:#8b949e">情绪就像海浪，让它来，让它走。</p>
      </div>
      <div class="sr-card">
        <h4>📵 数字排毒·感官锚定</h4>
        <p class="sr-desc">5-4-3-2-1 落地技术，30秒把自己拉回当下</p>
        <ol class="sr-guide">
          <li><b>5</b> 样你能看到的东西</li>
          <li><b>4</b> 样你能听到的声音</li>
          <li><b>3</b> 样你能触摸到的物品</li>
          <li><b>2</b> 样你能闻到的气味</li>
          <li><b>1</b> 样你能尝到的味道</li>
        </ol>
        <p class="sr-desc" style="margin-top:8px">恐慌发作、思绪混乱时特别有效。</p>
      </div>
    </div>
  </div>`;
}
// === 道家养生 ===
function renderTaoism() {
  return `<div class="sr-section">
    <h3>☯️ 道家养生·清静无为</h3>
    <p class="sr-intro">道教两千年养生智慧：以"道法自然"为核心，通过吐纳、守静、顺应自然节律来调养身心。</p>
    <div class="sr-exercise-grid">
      <div class="sr-card">
        <h4>🌌 坐忘守静</h4>
        <p class="sr-desc">《庄子》坐忘之法：忘却形骸，心如止水</p>
        <div class="sr-guide">
          <p><b>要诀：</b>"堕肢体，黜聪明，离形去知，同于大通"</p>
          <ol><li>正身端坐，舌抵上颚，微合双目</li>
          <li>存想丹田（脐下三指），意念若有若无</li>
          <li>逐渐忘却身体的边界和外界的声响</li>
          <li>进入"物我两忘"的虚静状态</li>
          <li>收功时缓缓活动手指脚趾</li></ol>
          <p class="sr-quote">"致虚极，守静笃。万物并作，吾以观复。" —— 《道德经》</p>
        </div>
      </div>
      <div class="sr-card">
        <h4>🌬️ 吐纳导引</h4>
        <p class="sr-desc">道家呼吸术，六字诀："嘘呵呼呬吹嘻"</p>
        <div class="sr-guide">
          <p><b>六字诀对应五脏：</b></p>
          <ul><li>嘘(xū) — 疏肝理气，春季宜练</li>
          <li>呵(hē) — 补心安神，夏季宜练</li>
          <li>呼(hū) — 健脾和胃，长夏宜练</li>
          <li>呬(sī) — 润肺养气，秋季宜练</li>
          <li>吹(chuī) — 强肾固本，冬季宜练</li>
          <li>嘻(xī) — 理三焦，调畅全身</li></ul>
          <p>每字读6-9遍，出声或默念皆可。</p>
        </div>
      </div>
      <div class="sr-card">
        <h4>🌿 顺时养生</h4>
        <p class="sr-desc">道家十二时辰养生，顺应天地阴阳</p>
        <div class="sr-guide">
          <ul><li><b>子时(23-1)：</b>胆经当令，深度睡眠排毒</li>
          <li><b>丑时(1-3)：</b>肝经造血，熟睡养肝</li>
          <li><b>卯时(5-7)：</b>大肠经，排便最佳时间</li>
          <li><b>辰时(7-9)：</b>胃经当令，宜吃早餐</li>
          <li><b>午时(11-13)：</b>心经当令，小憩养心</li>
          <li><b>酉时(17-19)：</b>肾经当令，宜适度运动</li></ul>
          <p class="sr-quote">"天人合一，道法自然。"</p>
        </div>
      </div>
      <div class="sr-card">
        <h4>💧 内观存想</h4>
        <p class="sr-desc">道家冥想法，存想体内光明，安定心神</p>
        <div class="sr-guide">
          <ol><li>闭目存想头顶有一轮明月，银白色光照全身</li>
          <li>光芒自百会穴缓缓下行，温暖经过每个部位</li>
          <li>汇聚于丹田处，化为一颗金色暖球</li>
          <li>暖球缓缓旋转，驱散体内浊气</li>
          <li>保持5-10分钟，自然收功</li></ol>
          <p class="sr-quote">"心息相依，神气合一。"</p>
        </div>
      </div>
    </div>
  </div>`;
}
// === 佛学静心 ===
function renderBuddhism() {
  return `<div class="sr-section">
    <h3>🪷 佛学静心·安住当下</h3>
    <p class="sr-intro">佛教两千五百年心性修行智慧：通过禅修、观照、慈悲的练习，从烦恼中解脱，回归内心的宁静。</p>
    <div class="sr-exercise-grid">
      <div class="sr-card">
        <h4>🧘 观呼吸禅（Anapanasati）</h4>
        <p class="sr-desc">佛陀亲传的最基础禅法，南传北传共通</p>
        <div class="sr-guide">
          <ol><li>结跏趺坐或散盘，脊背自然挺直</li>
          <li>手结定印置于腿上，双目微闭或垂视</li>
          <li>将觉知放在鼻端人中处</li>
          <li>觉知呼吸的"入、出、长、短、冷、暖"</li>
          <li>妄念生起时，不追随、不排斥，回到呼吸</li></ol>
          <p class="sr-quote">"念念分明，如实觉知。"</p>
        </div>
      </div>
      <div class="sr-card">
        <h4>💗 慈心禅（Metta Bhavana）</h4>
        <p class="sr-desc">培育无条件的慈爱，化解嗔恨与冷漠</p>
        <div class="sr-guide">
          <p><b>四个对象循序练习：</b></p>
          <ol><li>愿我自己远离痛苦，身心安乐</li>
          <li>愿我的恩人远离痛苦，身心安乐</li>
          <li>愿我的亲友远离痛苦，身心安乐</li>
          <li>愿所有众生远离痛苦，身心安乐</li></ol>
          <p class="sr-quote">"慈悲喜舍，遍及十方。"</p>
        </div>
      </div>
      <div class="sr-card">
        <h4>👁️ 观照无常</h4>
        <p class="sr-desc">洞察一切现象的生灭变化，放下执着</p>
        <div class="sr-guide">
          <p><b>三法印观修：</b></p>
          <ul><li><b>诸行无常：</b>观察情绪、想法、感受都在变化</li>
          <li><b>诸法无我：</b>没有一个固定不变的"我"</li>
          <li><b>涅槃寂静：</b>放下执着即是安宁</li></ul>
          <p>日常练习：情绪来时问自己"这个感受能持续多久？"</p>
          <p class="sr-quote">"一切有为法，如梦幻泡影。" ——《金刚经》</p>
        </div>
      </div>
      <div class="sr-card">
        <h4>🙏 感恩回向</h4>
        <p class="sr-desc">每日睡前的功课，转化心念，累积善念</p>
        <div class="sr-guide">
          <ol><li>回顾今天遇到的三件值得感恩的事</li>
          <li>感恩支持自己的人：父母、师长、朋友</li>
          <li>感恩衣食住行背后无数众生的付出</li>
          <li>将今日所有善念回向给所有人</li>
          <li>愿众生离苦得乐，愿世界和平</li></ol>
          <p class="sr-quote">"愿以此功德，普及于一切。"</p>
        </div>
      </div>
    </div>
  </div>`;
}
// === 瑜伽放松 ===
function renderYoga() {
  return `<div class="sr-section">
    <h3>🧘‍♀️ 瑜伽放松·身心合一</h3>
    <p class="sr-intro">瑜伽源自古印度五千年智慧，通过体式(Asana)、呼吸(Pranayama)、冥想(Dhyana)三位一体调节身心。</p>
    <div class="sr-exercise-grid">
      <div class="sr-card">
        <h4>🌙 摊尸式（Savasana）</h4>
        <p class="sr-desc">最简单也最深奥的放松体式，5分钟深度重启</p>
        <div class="sr-guide">
          <ol><li>平躺，双腿自然分开与髋同宽</li>
          <li>双臂放身体两侧，掌心向上</li>
          <li>闭眼，从脚趾到头顶依次放松</li>
          <li>让身体像融化在地面上一样</li>
          <li>呼吸自然，不用刻意控制</li>
          <li>10-15分钟后缓慢起身</li></ol>
        </div>
      </div>
      <div class="sr-card">
        <h4>🐱 猫牛式（Cat-Cow）</h4>
        <p class="sr-desc">解放脊柱僵硬，缓解久坐疲劳，2分钟见效</p>
        <div class="sr-guide">
          <ol><li>四足跪姿，手腕在肩下，膝盖在髋下</li>
          <li><b>吸气·牛式：</b>抬头挺胸，塌腰翘臀</li>
          <li><b>呼气·猫式：</b>低头拱背，收腹卷尾</li>
          <li>配合呼吸缓慢循环10-15次</li>
          <li>感受脊柱一节一节的活动</li></ol>
        </div>
      </div>
      <div class="sr-card">
        <h4>🌳 站立前屈式</h4>
        <p class="sr-desc">缓解头脑发热和轻度抑郁的经典体式</p>
        <div class="sr-guide">
          <ol><li>双脚与髋同宽站立</li>
          <li>吸气抬手过头，呼气从髋部折叠向下</li>
          <li>膝盖微弯，让上半身重量自然下垂</li>
          <li>双手抱住手肘，让头颈完全放松</li>
          <li>停留1-3分钟，感受血液流向头部</li>
          <li>缓慢卷起，头最后抬起</li></ol>
        </div>
      </div>
      <div class="sr-card">
        <h4>🌸 婴儿式（Balasana）</h4>
        <p class="sr-desc">回到子宫般的安全感，安抚情绪的避风港</p>
        <div class="sr-guide">
          <ol><li>跪坐在垫子上，脚背贴地</li>
          <li>大脚趾相触，膝盖分开与髋同宽</li>
          <li>呼气身体前倾，额头贴地</li>
          <li>双臂自然放在身体两侧或前伸</li>
          <li>感受背部的伸展和内心的安宁</li>
          <li>停留3-5分钟</li></ol>
          <p class="sr-desc" style="margin-top:8px;color:#8b949e">情绪崩溃时，这个体式给你最大的安全感。</p>
        </div>
      </div>
    </div>
  </div>`;
}
