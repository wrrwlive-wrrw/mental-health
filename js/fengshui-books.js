// 风水大师 - 经典书籍学习模块
function renderFsBooks() {
  return `<div>
    <h3 class="fs-h3">📚 经典书籍与学习</h3>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      <button class="tcm-btn tcm-btn-primary" onclick="showFsBookPanel('yijing')">易经</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('sanming')">三命通会</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('yuanhai')">渊海子平</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('ditian')">滴天髓</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('ziwei')">紫微斗数</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('mayi')">麻衣神相</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('yuhe')">玉匣记</button>
      <button class="tcm-btn" style="background:#f5f5f5" onclick="showFsBookPanel('zangshu')">葬书</button>
    </div>
    <div id="fsBookPanel">${getFsBookContent('yijing')}</div>
  </div>`;
}

function showFsBookPanel(book) {
  const el = document.getElementById('fsBookPanel');
  if (el) el.innerHTML = getFsBookContent(book);
}

function getFsBookContent(book) {
  const books = {
    yijing: {
      name:'《易经》（周易）', era:'西周', author:'文王演卦，孔子作传',
      intro:'中华文化之源，群经之首。以阴阳二爻组成八卦、六十四卦，揭示宇宙万物变化规律。',
      chapters:['上经三十卦：乾坤屯蒙需讼师…','下经三十四卦：咸恒遁大壮晋明夷…','系辞传：阐述易学哲理','说卦传：解释八卦取象','序卦传：六十四卦排列逻辑'],
      keyPoints:'核心思想：一阴一阳之谓道；天行健君子以自强不息；地势坤君子以厚德载物。',
      study:'学习建议：先通读白话译文，理解六十四卦基本卦义；再学习爻辞变化之理；最终融会贯通于人生决策中。'
    },
    sanming: {
      name:'《三命通会》', era:'明·万民英', author:'万民英（育吾山人）',
      intro:'命理学集大成之作，12卷，系统整合前人论命精华。以天干地支为基础，详论格局、用神、喜忌。',
      chapters:['卷一：论天干地支总论','卷二：论五行生克制化','卷三：论十干坐支及喜忌','卷四至六：论格局成败','卷七至十二：论神煞纳音'],
      keyPoints:'核心理论：五行生克为体，十神格局为用。强调天干透出与地支藏干的配合关系。',
      study:'学习建议：需有天干地支基础后再读，重点理解格局用神理论。与《子平真诠》对比学习效果更佳。'
    },
    yuanhai: {
      name:'《渊海子平》', era:'宋·徐子升编', author:'据传徐子平原著，后人整理',
      intro:'子平术（八字命理）开山之作，确立以日主为中心、月令为提纲的论命体系。',
      chapters:['论天干地支','论五行正论','论格局取用','论六亲','论女命','论小儿','论大运流年'],
      keyPoints:'核心：日主为"我"，月令定格。首创以年月日时四柱八字推命法。',
      study:'学习建议：入门必读经典。先熟记天干地支五行关系，再理解用神取法。文言较古，建议配合注解版。'
    },
    ditian: {
      name:'《滴天髓》', era:'传为京图撰，清·任铁樵注', author:'任铁樵注解最为精要',
      intro:'命理学最高深经典，言简意赅，字字珠玑。以原文+注解形式阐述命理至理。',
      chapters:['通神论：论命之总纲','天干论：十干性情','地支论：十二支特性','形象论：格局形象','方局论：五行方局','体用论：日主用神'],
      keyPoints:'核心："旺衰"论命，强调日主强弱与用神配合。"能知衰旺之真机，其于三命之奥思过半矣"。',
      study:'学习建议：高阶经典，需有《渊海子平》基础后再读。逐章精读，配合实际命例印证。'
    },
    ziwei: {
      name:'《紫微斗数全书》', era:'宋·陈希夷传', author:'传为陈抟老祖',
      intro:'紫微斗数权威典籍，以紫微星为首的十四主星布列十二宫，推论人生吉凶祸福。',
      chapters:['太微赋：总论星曜性情','骨髓赋：深论星曜组合','斗数发微论：论命宫身宫','女命骨髓赋：专论女命','十二宫详论'],
      keyPoints:'核心：以命宫主星定命格，三方四正看格局。紫微系、天府系两大星系对应不同人生特质。',
      study:'学习建议：先熟记十四主星性格特征和十二宫位含义，再学习四化飞星变化。需大量排盘练习。'
    },
    mayi: {
      name:'《麻衣神相》', era:'传为宋·麻衣道者', author:'麻衣道者传陈抟',
      intro:'面相学权威之作，系统论述面部五官、十二宫、气色与命运的关系。',
      chapters:['十二宫总论','五官总论（耳眉眼鼻口）','面相五行','气色吉凶','痣相论','手相论'],
      keyPoints:'核心：相由心生，面部各部位对应人生不同方面。三停均匀为吉，五官端正有神为贵。',
      study:'学习建议：结合实际观察，注意"神"的判断最为重要——有神则吉，无神则凶。切忌机械套用。'
    },
    yuhe: {
      name:'《玉匣记》', era:'传为东晋·许逊', author:'许真君著，历代增补',
      intro:'民间最常用的择日通书，详列每日宜忌、吉凶方位、神煞值日等，是择吉实用手册。',
      chapters:['年家吉神方位','月家吉神方位','日家吉神方位','时家吉神方位','各类择日法','修造动土择日','嫁娶择日'],
      keyPoints:'核心：天时地利人和。择日需参照年月日时四层神煞，避凶趋吉。',
      study:'学习建议：实用性强，可直接查阅使用。深入学习需结合天星择日法和正五行择日法。'
    },
    zangshu: {
      name:'《葬书》（葬经）', era:'东晋·郭璞', author:'郭璞',
      intro:'风水学奠基之作，首次系统论述"气"的概念和葬法原则，是阴宅风水理论根基。',
      chapters:['内篇：论气之本体','外篇：论气之应用','杂篇：论形势吉凶'],
      keyPoints:'核心名句："气乘风则散，界水则止。古人聚之使不散，行之使有止，故谓之风水。" 是"风水"一词的来源。',
      study:'学习建议：篇幅短小精悍，建议全文熟读。理解"生气"理论是学习所有风水术的基础。'
    }
  };
  const b = books[book];
  if (!b) return '';
  return `<div style="border:1px solid #d4a847;border-radius:8px;padding:14px;background:#fffdf5">
    <h4 style="color:#8b6914;margin:0 0 8px">${b.name}</h4>
    <p style="font-size:12px;color:#888;margin:0 0 10px">${b.era} | ${b.author}</p>
    <p style="font-size:13px;color:#555;line-height:1.7;margin-bottom:12px">${b.intro}</p>
    <div style="background:#f9f5e8;padding:10px;border-radius:6px;margin-bottom:10px">
      <p style="font-size:12px;font-weight:bold;color:#8b6914;margin:0 0 6px">主要章节：</p>
      ${b.chapters.map(c=>`<p style="font-size:12px;color:#555;margin:2px 0;padding-left:8px;border-left:2px solid #d4a847">${c}</p>`).join('')}
    </div>
    <p style="font-size:13px;color:#333;line-height:1.7"><b>核心要义：</b>${b.keyPoints}</p>
    <p style="font-size:13px;color:#2e7d32;line-height:1.7;margin-top:8px"><b>📖 ${b.study}</b></p>
  </div>`;
}
