// 中医智能诊疗 - 经典案例库
const TCM_CLASSIC_CASES = [
  {
    id:'c001', category:'exogenous', title:'太阳中风证（桂枝汤）',
    source:'《伤寒论》第12条',
    patient:{gender:'男',age:35,season:'冬'},
    complaint:'发热恶风2日，汗出头痛',
    fourDiag:{wang:'面色略赤，舌淡红苔薄白',wen:'声低',wen2:'恶风发热，汗出，头痛，鼻鸣，身酸',qie:'脉浮缓'},
    syndrome:'太阳中风证',
    pathogenesis:'风邪袭表，营卫不和，卫阳不固',
    principle:'解肌祛风，调和营卫',
    prescription:{name:'桂枝汤',herbs:'桂枝9g 白芍9g 炙甘草6g 生姜9g 大枣4枚',method:'水煎服，服后啜热稀粥，温覆取微汗'},
    keyPoints:'辨证要点：发热汗出恶风+脉浮缓。桂枝汤为"群方之魁"'
  },
  {
    id:'c002', category:'exogenous', title:'太阳伤寒证（麻黄汤）',
    source:'《伤寒论》第35条',
    patient:{gender:'男',age:28,season:'冬'},
    complaint:'恶寒发热1天，全身疼痛无汗',
    fourDiag:{wang:'面色青白，舌淡苔薄白',wen:'鼻塞声重',wen2:'恶寒重发热轻，头身疼痛，无汗而喘',qie:'脉浮紧'},
    syndrome:'太阳伤寒证',
    pathogenesis:'寒邪束表，卫阳被遏，营阴郁滞',
    principle:'发汗解表，宣肺平喘',
    prescription:{name:'麻黄汤',herbs:'麻黄9g 桂枝6g 杏仁9g 炙甘草3g',method:'先煎麻黄去上沫，后下诸药'},
    keyPoints:'辨证要点：恶寒重+无汗+身痛+脉浮紧。与桂枝汤证的区别在有汗无汗'
  },
  {
    id:'c003', category:'exogenous', title:'少阳证（小柴胡汤）',
    source:'《伤寒论》第96条',
    patient:{gender:'女',age:32,season:'春'},
    complaint:'往来寒热5天，胸胁苦满',
    fourDiag:{wang:'面色偏黄，舌淡红苔薄白',wen:'善太息',wen2:'往来寒热，胸胁苦满，不欲饮食，心烦喜呕，口苦咽干',qie:'脉弦'},
    syndrome:'少阳证',
    pathogenesis:'邪入少阳，枢机不利，胆火上炎',
    principle:'和解少阳',
    prescription:{name:'小柴胡汤',herbs:'柴胡24g 黄芩9g 人参9g 半夏9g 炙甘草6g 生姜9g 大枣4枚',method:'水煎服，日一剂'},
    keyPoints:'少阳四大证：往来寒热、胸胁苦满、默默不欲饮食、心烦喜呕'
  },
  {
    id:'c004', category:'internal', title:'肝郁脾虚证（逍遥散）',
    source:'《太平惠民和剂局方》',
    patient:{gender:'女',age:28,season:'春'},
    complaint:'胁肋胀痛，情绪抑郁，食少便溏1月',
    fourDiag:{wang:'面色萎黄，舌淡红苔白',wen:'善太息',wen2:'两胁胀痛，情志抑郁，食欲不振，腹胀便溏，月经不调经前乳胀',qie:'脉弦而虚'},
    syndrome:'肝郁脾虚证',
    pathogenesis:'肝气郁结，横逆犯脾，脾失健运',
    principle:'疏肝解郁，健脾养血',
    prescription:{name:'逍遥散',herbs:'柴胡9g 当归9g 白芍12g 白术9g 茯苓12g 薄荷3g 煨姜6g 炙甘草6g',method:'水煎服，日一剂分两次温服'},
    keyPoints:'抓住"胁痛+情绪+脾虚"三联征。逍遥散为肝郁脾虚的代表方'
  },
  {
    id:'c005', category:'internal', title:'心脾两虚证（归脾汤）',
    source:'《济生方》',
    patient:{gender:'女',age:45,season:'秋'},
    complaint:'失眠多梦2月，面色萎黄，食少乏力',
    fourDiag:{wang:'面色萎黄无华，舌淡苔白',wen:'声低气短',wen2:'心悸失眠，多梦易醒，纳少便溏，体倦乏力，健忘',qie:'脉细弱'},
    syndrome:'心脾两虚证',
    pathogenesis:'思虑过度，暗耗心血，脾气亏虚，气血生化不足',
    principle:'益气补血，健脾养心',
    prescription:{name:'归脾汤',herbs:'黄芪15g 人参9g 白术9g 茯神9g 龙眼肉12g 酸枣仁12g 当归9g 远志6g 木香6g 炙甘草6g 大枣3枚 生姜6g',method:'水煎服，日一剂'},
    keyPoints:'归脾汤要点：心脾同治，气血双补。辨证抓"心悸失眠+食少乏力+脉细弱"'
  }
];

// 后续案例数据
const TCM_MORE_CASES = [
  {
    id:'c006', category:'internal', title:'肾阴虚证（六味地黄丸）',
    source:'《小儿药证直诀》',
    patient:{gender:'男',age:50,season:'夏'},
    complaint:'腰膝酸软，头晕耳鸣3月',
    fourDiag:{wang:'颧红，舌红少苔',wen:'正常',wen2:'腰膝酸软，头晕耳鸣，五心烦热，盗汗，口干',qie:'脉细数'},
    syndrome:'肾阴虚证',pathogenesis:'肾精亏虚，虚热内生',principle:'滋阴补肾',
    prescription:{name:'六味地黄丸',herbs:'熟地24g 山萸肉12g 山药12g 泽泻9g 丹皮9g 茯苓9g',method:'水煎服或丸剂'},
    keyPoints:'肾阴虚要点：腰膝酸软+五心烦热+舌红少苔+脉细数'
  },
  {
    id:'c007', category:'spleen', title:'脾胃虚寒证（理中汤）',
    source:'《伤寒论》',
    patient:{gender:'男',age:40,season:'冬'},
    complaint:'脘腹冷痛，喜温喜按，大便稀溏',
    fourDiag:{wang:'面色苍白，舌淡苔白滑',wen:'语声低微',wen2:'脘腹隐痛喜温按，食少便溏，畏寒肢冷，口淡不渴',qie:'脉沉迟无力'},
    syndrome:'脾胃虚寒证',pathogenesis:'中阳不足，寒从内生，运化失职',principle:'温中祛寒，补气健脾',
    prescription:{name:'理中汤',herbs:'人参9g 干姜9g 白术9g 炙甘草9g',method:'水煎温服'},
    keyPoints:'理中汤证抓：腹痛喜温按+便溏+畏寒+脉沉迟'
  },
  {
    id:'c008', category:'spleen', title:'寒热错杂证（半夏泻心汤）',
    source:'《伤寒论》',
    patient:{gender:'女',age:35,season:'秋'},
    complaint:'胃脘痞满，恶心欲吐，肠鸣下利1周',
    fourDiag:{wang:'舌淡红苔黄白相间',wen:'肠鸣音亢进',wen2:'心下痞满不痛，恶心欲吐，肠鸣下利，口苦',qie:'脉弦数'},
    syndrome:'寒热错杂，脾胃不和',pathogenesis:'邪热与水饮互结于中焦，升降失常',principle:'辛开苦降，和胃消痞',
    prescription:{name:'半夏泻心汤',herbs:'半夏12g 黄芩9g 干姜9g 人参9g 黄连3g 大枣4枚 炙甘草6g',method:'水煎服，日一剂'},
    keyPoints:'辛开苦降法代表方。辨证要点：心下痞满+呕+利+苔黄白相间'
  },
  {
    id:'c009', category:'gynecology', title:'血虚证（四物汤）',
    source:'《太平惠民和剂局方》',
    patient:{gender:'女',age:30,season:'冬'},
    complaint:'月经量少色淡，面色苍白',
    fourDiag:{wang:'面色苍白无华，唇甲淡白，舌淡苔白',wen:'声细无力',wen2:'头晕目眩，月经量少色淡，心悸失眠，手足麻木',qie:'脉细'},
    syndrome:'血虚证',pathogenesis:'营血亏虚，脏腑经络失养',principle:'补血养血',
    prescription:{name:'四物汤',herbs:'熟地12g 当归9g 白芍9g 川芎6g',method:'水煎服，经后服用'},
    keyPoints:'四物汤为补血基础方，"血家百病此方通"'
  },
  {
    id:'c010', category:'exogenous', title:'温病初起（银翘散）',
    source:'《温病条辨》',
    patient:{gender:'男',age:22,season:'春'},
    complaint:'发热咽痛2天，咳嗽',
    fourDiag:{wang:'面红，舌尖红苔薄白微黄',wen:'咳声不重',wen2:'发热微恶寒，无汗或少汗，咽痛口渴，咳嗽',qie:'脉浮数'},
    syndrome:'风热犯卫证',pathogenesis:'风热之邪侵袭肺卫，卫气失宣',principle:'辛凉透表，清热解毒',
    prescription:{name:'银翘散',herbs:'银花15g 连翘15g 薄荷6g 荆芥6g 豆豉9g 牛蒡子9g 桔梗6g 竹叶6g 芦根15g 甘草3g',method:'鲜芦根汤煎，香气大出即取服，不可过煎'},
    keyPoints:'银翘散为辛凉解表代表方，温病初起首选。与桑菊饮区别在咽痛程度'
  }
];

// 合并所有案例
const TCM_ALL_CASES = TCM_CLASSIC_CASES.concat(TCM_MORE_CASES);

// 案例分类
const TCM_CASE_CATEGORIES = {
  all:'全部', exogenous:'外感病', internal:'内伤杂病',
  spleen:'脾胃病', gynecology:'妇科', phlegm:'痰饮水湿'
};

let tcmCaseFilter = 'all';

function renderTcmCases() {
  const filtered = tcmCaseFilter==='all' ? TCM_ALL_CASES : TCM_ALL_CASES.filter(c=>c.category===tcmCaseFilter);
  return `<div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
      ${Object.entries(TCM_CASE_CATEGORIES).map(([k,v])=>
        `<button class="tcm-btn ${tcmCaseFilter===k?'tcm-btn-primary':''}" style="${tcmCaseFilter!==k?'background:#f5f5f5':''};font-size:12px" onclick="tcmFilterCases('${k}')">${v}</button>`
      ).join('')}
    </div>
    <div class="tcm-form-group">
      <input id="tcmCaseSearch" placeholder="搜索案例（证型、症状、方名）" oninput="tcmSearchCases()">
    </div>
    <div id="tcmCaseListArea">${renderTcmCaseList(filtered)}</div>
  </div>`;
}

function tcmFilterCases(cat) {
  tcmCaseFilter = cat;
  showTcmTab('cases');
}

function tcmSearchCases() {
  const kw = document.getElementById('tcmCaseSearch')?.value.trim().toLowerCase();
  const filtered = TCM_ALL_CASES.filter(c=>{
    if (tcmCaseFilter!=='all' && c.category!==tcmCaseFilter) return false;
    if (!kw) return true;
    return (c.title+c.syndrome+c.complaint+c.prescription.name).toLowerCase().includes(kw);
  });
  document.getElementById('tcmCaseListArea').innerHTML = renderTcmCaseList(filtered);
}

function renderTcmCaseList(cases) {
  if (!cases.length) return '<p style="color:#999;text-align:center">无匹配案例</p>';
  return cases.map(c=>`<div class="tcm-case-item" onclick="showTcmCaseDetail('${c.id}')">
    <div class="title">${c.title}</div>
    <div class="meta">${c.source} | ${c.syndrome} | ${c.prescription.name}</div>
  </div>`).join('');
}

function showTcmCaseDetail(id) {
  const c = TCM_ALL_CASES.find(x=>x.id===id);
  if (!c) return;
  const el = document.getElementById('tcmCaseListArea');
  el.innerHTML = `<div class="tcm-rx-card" style="border-color:#2e7d32">
    <div class="tcm-rx-title" style="font-size:16px">${c.title}</div>
    <p style="font-size:12px;color:#888">出处：${c.source} | 患者：${c.patient.gender} ${c.patient.age}岁 ${c.patient.season}季</p>
    <hr style="border:none;border-top:1px dashed #ddd;margin:10px 0">
    <p><b>主诉：</b>${c.complaint}</p>
    <p><b>望诊：</b>${c.fourDiag.wang}</p>
    <p><b>闻诊：</b>${c.fourDiag.wen}</p>
    <p><b>问诊：</b>${c.fourDiag.wen2}</p>
    <p><b>切诊：</b>${c.fourDiag.qie}</p>
    <hr style="border:none;border-top:1px dashed #ddd;margin:10px 0">
    <p><b style="color:#c62828">证型：</b>${c.syndrome}</p>
    <p><b>病机：</b>${c.pathogenesis}</p>
    <p><b>治则：</b>${c.principle}</p>
    <hr style="border:none;border-top:1px dashed #ddd;margin:10px 0">
    <p><b style="color:#e65100">处方：${c.prescription.name}</b></p>
    <p>${c.prescription.herbs}</p>
    <p><b>煎服法：</b>${c.prescription.method}</p>
    <p style="color:#2e7d32;font-style:italic;margin-top:8px"><b>要点：</b>${c.keyPoints}</p>
  </div>
  <button class="tcm-btn" style="background:#eee;margin-top:8px" onclick="showTcmTab('cases')">← 返回列表</button>`;
}