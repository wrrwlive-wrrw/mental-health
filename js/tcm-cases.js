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

// 肝胆病案例
const TCM_LIVER_CASES = [
  {
    id:'c011', category:'liver', title:'肝癌早期·肝郁脾虚证',
    source:'刘嘉湘经验方',
    patient:{gender:'男',age:55,season:'春'},
    complaint:'右胁隐痛3月，乏力纳差，消瘦',
    fourDiag:{wang:'面色晦暗，舌暗红苔薄白',wen:'声低气短',wen2:'右胁隐痛，腹胀纳差，乏力消瘦，大便溏，情绪低落',qie:'脉弦细'},
    syndrome:'肝郁脾虚、气滞血瘀',
    pathogenesis:'肝气郁结，横逆犯脾，气滞血瘀，久成积聚',
    principle:'疏肝健脾，化瘀软坚，扶正抗癌',
    prescription:{name:'柴芍六君子汤加减',herbs:'柴胡9g 白芍15g 党参15g 白术12g 茯苓15g 半夏9g 陈皮6g 鳖甲30g（先煎） 莪术9g 白花蛇舌草30g 半枝莲15g 炙甘草6g',method:'水煎服，日一剂，分两次温服，鳖甲先煎30分钟'},
    keyPoints:'肝癌中医辨治以"扶正祛邪"为核心。早期重疏肝健脾、化瘀软坚。白花蛇舌草、半枝莲为抗癌常用药对。鳖甲软坚散结为要药'
  },
  {
    id:'c012', category:'liver', title:'肝癌中期·湿热瘀毒证',
    source:'于尔辛经验方',
    patient:{gender:'男',age:50,season:'夏'},
    complaint:'右上腹胀痛加重1月，黄疸，发热',
    fourDiag:{wang:'面目黄染，舌红苔黄腻',wen:'口臭',wen2:'右胁刺痛拒按，身目俱黄，发热口苦，小便短赤，大便干结',qie:'脉弦数有力'},
    syndrome:'湿热瘀毒蕴结',
    pathogenesis:'湿热毒邪蕴结肝胆，气滞血瘀，积聚成块',
    principle:'清热利湿，化瘀解毒，软坚散结',
    prescription:{name:'茵陈蒿汤合膈下逐瘀汤加减',herbs:'茵陈30g 栀子9g 大黄6g（后下） 当归12g 桃仁9g 红花6g 莪术12g 三棱9g 白花蛇舌草30g 龙葵15g 郁金12g 虎杖15g',method:'水煎服，大黄后下5分钟，日一剂'},
    keyPoints:'肝癌湿热瘀毒型多见于中晚期伴黄疸者。茵陈蒿汤退黄为主，膈下逐瘀汤活血化瘀。龙葵、虎杖抗肿瘤。需注意攻补兼施'
  },
  {
    id:'c013', category:'liver', title:'肝癌晚期·肝肾阴虚证',
    source:'名老中医经验汇编',
    patient:{gender:'男',age:62,season:'秋'},
    complaint:'肝区疼痛加重，低热盗汗，极度消瘦',
    fourDiag:{wang:'形体极度消瘦，舌红少津无苔',wen:'声低微',wen2:'肝区灼痛，低热盗汗，口干不欲多饮，腹胀如鼓（腹水），下肢浮肿',qie:'脉细数无力'},
    syndrome:'肝肾阴虚、水瘀互结',
    pathogenesis:'久病耗伤肝肾之阴，阴虚内热，水瘀互结于腹',
    principle:'滋养肝肾，凉血化瘀，利水消胀',
    prescription:{name:'一贯煎合实脾饮加减',herbs:'北沙参15g 麦冬12g 生地15g 枸杞12g 当归9g 川楝子6g 鳖甲30g（先煎） 猪苓15g 泽泻12g 大腹皮15g 车前子15g（包煎） 仙鹤草30g',method:'水煎服，日一剂，少量频服'},
    keyPoints:'晚期肝癌阴虚为本，治疗以养阴为主，兼顾利水。一贯煎滋阴疏肝为主方。腹水严重可配合实脾饮。重在改善生活质量，延长生存期'
  },
  {
    id:'c014', category:'liver', title:'肝硬化代偿期·肝郁血瘀证',
    source:'关幼波经验方',
    patient:{gender:'男',age:48,season:'春'},
    complaint:'右胁胀痛反复2年，肝区刺痛',
    fourDiag:{wang:'面色晦暗，蜘蛛痣，舌紫暗有瘀点',wen:'正常',wen2:'右胁刺痛固定，腹胀，食少纳呆，面色黧黑',qie:'脉弦涩'},
    syndrome:'肝郁血瘀证',
    pathogenesis:'肝气郁结日久，气滞血瘀，络脉瘀阻',
    principle:'疏肝理气，活血化瘀，软坚散结',
    prescription:{name:'复肝丸方（关幼波方）',herbs:'柴胡9g 郁金12g 丹参30g 当归12g 赤芍15g 桃仁9g 鳖甲30g（先煎） 穿山甲6g 白术12g 茯苓15g 炙甘草6g',method:'水煎服，日一剂，长期调服3-6个月'},
    keyPoints:'肝硬化中医属"积聚""臌胀"范畴。关幼波教授强调"治肝不忘脾"，活血化瘀贯穿始终。丹参、鳖甲为核心药对'
  },
  {
    id:'c015', category:'liver', title:'脂肪肝·痰湿内阻证',
    source:'临床经验方',
    patient:{gender:'男',age:42,season:'秋'},
    complaint:'体检发现脂肪肝1年，右胁不适',
    fourDiag:{wang:'形体肥胖，舌胖大苔白腻',wen:'正常',wen2:'右胁隐痛，脘腹痞满，身重倦怠，大便黏滞不爽',qie:'脉弦滑'},
    syndrome:'痰湿内阻、气滞肝络',
    pathogenesis:'过食肥甘，痰湿内生，阻滞肝络，气机不畅',
    principle:'化痰祛湿，疏肝理气，健脾消脂',
    prescription:{name:'二陈汤合柴胡疏肝散加减',herbs:'半夏9g 陈皮9g 茯苓15g 柴胡9g 白芍12g 枳壳9g 香附9g 泽泻15g 决明子15g 荷叶10g 山楂15g 丹参15g',method:'水煎服，日一剂，疗程2-3个月'},
    keyPoints:'脂肪肝属"肝癖""痰浊"范畴。泽泻降脂，山楂消积，荷叶化浊，丹参活血。配合饮食控制和运动效果更佳'
  }
];

// 肺系病案例
const TCM_LUNG_CASES = [
  {
    id:'c016', category:'lung', title:'肺癌早期·气阴两虚证',
    source:'刘嘉湘经验方',
    patient:{gender:'男',age:58,season:'秋'},
    complaint:'咳嗽3月，痰中带血丝，低热',
    fourDiag:{wang:'面色少华，舌红少苔',wen:'咳声低弱',wen2:'干咳少痰偶带血丝，午后低热，口干咽燥，神疲乏力，盗汗',qie:'脉细数'},
    syndrome:'气阴两虚、痰瘀阻肺',
    pathogenesis:'正气亏虚，阴液耗伤，痰瘀毒结于肺',
    principle:'益气养阴，化痰散结，解毒抗癌',
    prescription:{name:'南沙参麦冬汤加减',herbs:'南沙参15g 麦冬12g 太子参15g 黄芪20g 百合15g 生地12g 浙贝母12g 杏仁9g 白花蛇舌草30g 仙鹤草30g 守宫6g 石见穿15g',method:'水煎服，日一剂，长期服用可配合化疗减毒'},
    keyPoints:'肺癌气阴两虚为最常见证型。刘嘉湘教授"扶正治癌"思想：黄芪益气，沙参麦冬养阴，守宫、石见穿为抗癌专药。配合西医治疗可增效减毒'
  },
  {
    id:'c017', category:'lung', title:'肺癌中期·痰热壅肺证',
    source:'名医经验汇编',
    patient:{gender:'男',age:55,season:'夏'},
    complaint:'咳嗽加重伴大量黄痰1月，胸痛',
    fourDiag:{wang:'面红，舌红苔黄厚腻',wen:'痰多气喘',wen2:'咳嗽剧烈，咯黄黏痰量多，痰中带血，胸痛气急，发热口渴',qie:'脉滑数有力'},
    syndrome:'痰热壅肺、瘀毒内结',
    pathogenesis:'痰热毒邪壅塞于肺，灼伤血络，瘀毒互结',
    principle:'清热化痰，解毒散结，凉血止血',
    prescription:{name:'千金苇茎汤合泻白散加减',herbs:'苇茎30g 薏苡仁30g 桃仁9g 冬瓜仁30g 桑白皮12g 地骨皮12g 黄芩12g 鱼腥草30g 半枝莲30g 白英15g 白茅根30g 浙贝母12g',method:'水煎服，日一剂'},
    keyPoints:'痰热壅肺型多见于中央型肺癌。千金苇茎汤排脓化痰为主方，鱼腥草清肺解毒，白英、半枝莲抗癌。白茅根凉血止血'
  },
  {
    id:'c018', category:'lung', title:'肺癌晚期·脾肺气虚证',
    source:'朴炳奎经验方',
    patient:{gender:'女',age:65,season:'冬'},
    complaint:'咳喘反复加重，极度乏力，不能平卧',
    fourDiag:{wang:'面色㿠白浮肿，舌淡胖边有齿痕苔白滑',wen:'气短不续',wen2:'咳喘气促，白色泡沫痰，面肢浮肿，纳呆便溏，动则喘甚',qie:'脉沉细无力'},
    syndrome:'脾肺气虚、痰饮停聚',
    pathogenesis:'正气大虚，脾失健运，痰饮水湿停聚于肺',
    principle:'补肺健脾，化痰利水，扶正固本',
    prescription:{name:'补肺汤合苓桂术甘汤加减',herbs:'黄芪30g 人参9g（另煎兑入） 白术15g 茯苓20g 桂枝6g 半夏9g 陈皮6g 薏苡仁30g 猪苓15g 补骨脂12g 仙鹤草30g 炙甘草9g',method:'水煎服，人参另煎兑入，日一剂，少量频服'},
    keyPoints:'晚期肺癌气虚为本。朴炳奎教授强调"带瘤生存"，以扶正为主。大剂量黄芪配人参补气，苓桂术甘汤化饮。重在改善生存质量'
  },
  {
    id:'c019', category:'lung', title:'肺纤维化·肺肾两虚证',
    source:'晁恩祥经验方',
    patient:{gender:'男',age:60,season:'冬'},
    complaint:'进行性呼吸困难2年，干咳',
    fourDiag:{wang:'口唇紫绀，舌暗红少苔',wen:'气短促',wen2:'活动后气急明显，干咳无痰，口干咽燥，腰膝酸软，动辄汗出',qie:'脉细涩'},
    syndrome:'肺肾两虚、瘀血阻络',
    pathogenesis:'久病肺肾俱虚，气不化津，瘀血阻于肺络',
    principle:'补肺益肾，活血通络，化痰散结',
    prescription:{name:'补肺汤合百合固金汤加减',herbs:'黄芪20g 太子参15g 百合15g 生地12g 麦冬12g 补骨脂12g 蛤蚧粉3g（冲服） 当归12g 丹参20g 川芎9g 地龙12g 穿山龙15g',method:'水煎服，蛤蚧粉分两次冲服，日一剂'},
    keyPoints:'肺纤维化属"肺痿""肺痹"范畴。晁恩祥教授重视"通络"，地龙、穿山龙通肺络。蛤蚧补肺肾、纳气定喘为要药'
  },
  {
    id:'c020', category:'lung', title:'慢阻肺急性发作·痰热蕴肺证',
    source:'洪广祥经验方',
    patient:{gender:'男',age:68,season:'冬'},
    complaint:'咳喘加重1周，发热黄痰',
    fourDiag:{wang:'面赤唇暗，舌红苔黄腻',wen:'痰鸣气喘，喉中有水鸡声',wen2:'咳嗽气喘，痰黄黏稠量多难咯，胸闷，发热口渴',qie:'脉滑数'},
    syndrome:'痰热蕴肺、肺失肃降',
    pathogenesis:'外感引动内饮，痰热互结，肺气上逆',
    principle:'清热化痰，宣肺平喘',
    prescription:{name:'麻杏石甘汤合清气化痰丸加减',herbs:'麻黄6g 杏仁9g 生石膏30g（先煎） 黄芩12g 瓜蒌仁15g 胆南星9g 浙贝母12g 桑白皮12g 葶苈子12g（包煎） 鱼腥草30g 炙甘草6g',method:'水煎服，石膏先煎15分钟，日一剂'},
    keyPoints:'慢阻肺急性发作痰热型最多见。麻杏石甘汤宣肺平喘为主方，葶苈子泻肺化饮为要药。缓解期转补肺健脾益肾'
  }
];

// 合并所有案例
const TCM_ALL_CASES = TCM_CLASSIC_CASES.concat(TCM_MORE_CASES, TCM_LIVER_CASES, TCM_LUNG_CASES);

// 案例分类
const TCM_CASE_CATEGORIES = {
  all:'全部', exogenous:'外感病', internal:'内伤杂病',
  spleen:'脾胃病', liver:'肝胆病', lung:'肺系病',
  gynecology:'妇科', phlegm:'痰饮水湿'
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