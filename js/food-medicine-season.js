// 药食同源 - 四季食疗方案（结合体质与病症）
const FM_SEASONAL_DATA = {
  spring: {
    name:'春季',icon:'🌸',color:'#e8f5e9',
    principle:'春主生发，肝气旺盛。宜疏肝理气、养血柔肝，少酸增甘，助阳气升发。',
    climate:'多风，乍暖还寒，肝气当令',
    commonIssues:['春困乏力','肝火旺盛','过敏频发','情绪波动','上火口干'],
    dietTips:'多食绿色蔬菜、芽苗类；少吃酸收之品；适当食甘味养脾。',
    teas:[
      {name:'玫瑰枸杞疏肝茶',ingredients:'玫瑰花6朵、枸杞10颗、红枣2颗',
       brewing:'沸水冲泡焖8分钟',benefits:'疏肝解郁、养血明目',
       suitable:'肝郁气滞、情绪低落',contraindication:'月经量大者慎用'},
      {name:'菊花决明春清茶',ingredients:'菊花5朵、决明子10g、绿茶3g',
       brewing:'决明子先煮5分钟取汁冲泡',benefits:'清肝明目、降压通便',
       suitable:'肝火旺、目赤便秘',contraindication:'脾虚便溏不宜'},
      {name:'薄荷桑叶防风茶',ingredients:'薄荷3g、桑叶5g、防风3g',
       brewing:'沸水冲泡5分钟薄荷后下',benefits:'疏风散热、防春季感冒',
       suitable:'易感冒、鼻塞流涕',contraindication:'体虚自汗者慎'},
      {name:'陈皮山楂醒春茶',ingredients:'陈皮5g、山楂8g、薏米10g',
       brewing:'加水煮15分钟取汁',benefits:'健脾消食、化湿醒神',
       suitable:'春困乏力、食欲不振',contraindication:'胃酸过多少饮'},
      {name:'金银花抗敏茶',ingredients:'金银花8g、连翘6g、甘草3g',
       brewing:'沸水冲泡焖10分钟',benefits:'清热解毒、抗过敏',
       suitable:'春季过敏、咽痛',contraindication:'虚寒体质慎用'}
    ],
    recipes:[
      {name:'韭菜炒鸡蛋',ingredients:'韭菜200g、鸡蛋3个、枸杞',
       method:'鸡蛋炒熟加韭菜快炒撒枸杞',benefits:'温中助阳、补肝养血',
       suitable:'阳气不足、手脚冰凉',contraindication:'阴虚火旺少食'},
      {name:'香椿拌豆腐',ingredients:'香椿芽100g、北豆腐200g、香油',
       method:'香椿焯水切碎与豆腐丁拌匀',benefits:'清热利湿、健脾养肝',
       suitable:'上火、食欲差',contraindication:'过敏者先少量试'},
      {name:'枸杞菊花蒸鲈鱼',ingredients:'鲈鱼1条、枸杞15g、菊花10朵',
       method:'鱼放姜丝枸杞蒸8分钟撒菊花',benefits:'养肝明目、补脾益气',
       suitable:'视力疲劳、肝血不足',contraindication:'痛风急性期忌'},
      {name:'薏米红豆祛湿粥',ingredients:'薏米30g、红豆30g、百合15g',
       method:'泡4小时煮1小时加百合红枣',benefits:'健脾祛湿、清心安神',
       suitable:'湿重困倦、浮肿',contraindication:'孕妇慎用薏米'},
      {name:'桑葚黑米养肝粥',ingredients:'桑葚30g、枸杞15g、黑米80g',
       method:'黑米泡2小时煮粥加桑葚枸杞',benefits:'滋补肝肾、乌发养颜',
       suitable:'肝肾阴虚、早白',contraindication:'便溏者少食桑葚'}
    ]
  },
  summer: {
    name:'夏季',icon:'☀️',color:'#fff8e1',
    principle:'夏主长养，心气旺盛。宜清心降火、养阴生津，防暑祛湿，少苦增辛。',
    climate:'炎热多湿，心火当令，暑湿困脾',
    commonIssues:['中暑疲倦','心烦失眠','食欲不振','汗多伤阴','脾胃湿困'],
    dietTips:'多食苦味清心、酸甘生津；西瓜绿豆清暑；少食生冷伤脾。',
    teas:[
      {name:'酸梅汤消暑饮',ingredients:'乌梅5颗、山楂10g、桂花3g、冰糖',
       brewing:'乌梅山楂煮20分钟加冰糖桂花冷饮',benefits:'生津止渴、消暑开胃',
       suitable:'暑热口渴、食欲差',contraindication:'胃溃疡者慎'},
      {name:'莲子心清心茶',ingredients:'莲子心3g、竹叶5g、甘草2g',
       brewing:'沸水冲泡焖8分钟',benefits:'清心降火、除烦安神',
       suitable:'心烦失眠、口舌生疮',contraindication:'虚寒者不宜'},
      {name:'荷叶薏仁祛湿茶',ingredients:'荷叶5g、炒薏仁10g、陈皮3g',
       brewing:'薏仁煮15分钟取汁冲荷叶陈皮',benefits:'清暑化湿、健脾消脂',
       suitable:'暑湿困脾、身重乏力',contraindication:'孕妇慎用'},
      {name:'西洋参麦冬茶',ingredients:'西洋参5g、麦冬10g、五味子3g',
       brewing:'加水煮15分钟取汁',benefits:'益气养阴、生津止汗',
       suitable:'暑热汗多、气阴两虚',contraindication:'感冒初期不宜'},
      {name:'金银花菊花凉茶',ingredients:'金银花10g、菊花5朵、薄荷3g',
       brewing:'金银花菊花煮5分钟加薄荷焖2分钟',benefits:'清热解暑、疏散风热',
       suitable:'暑热头痛、咽痛',contraindication:'脾胃虚寒少饮'}
    ],
    recipes:[
      {name:'绿豆百合莲子羹',ingredients:'绿豆50g、百合20g、莲子20g',
       method:'绿豆煮30分钟加百合莲子再煮20分钟',benefits:'清热解暑、养心安神',
       suitable:'暑热心烦、失眠',contraindication:'脾虚便溏少食绿豆'},
      {name:'苦瓜排骨汤',ingredients:'苦瓜1根、排骨300g、黄豆30g',
       method:'排骨焯水与黄豆炖30分钟加苦瓜煮15分钟',benefits:'清热解毒、健脾消暑',
       suitable:'暑热口苦、食欲差',contraindication:'脾胃虚寒者少食'},
      {name:'冬瓜薏米鸭汤',ingredients:'冬瓜300g、薏米30g、老鸭半只',
       method:'鸭焯水与薏米炖1小时加冬瓜再煮20分钟',benefits:'消暑利湿、滋阴补虚',
       suitable:'暑湿水肿、阴虚内热',contraindication:'感冒期间不宜'},
      {name:'凉拌木耳山药',ingredients:'黑木耳50g、山药200g、红椒丝',
       method:'木耳山药焯水冰镇加调料拌匀',benefits:'清热凉血、健脾益胃',
       suitable:'血热、消化不良',contraindication:'腹泻者慎食生冷'},
      {name:'番茄丝瓜蛋花汤',ingredients:'番茄2个、丝瓜1根、鸡蛋2个',
       method:'番茄炒汁加水煮沸放丝瓜打蛋花',benefits:'清热生津、健胃消食',
       suitable:'暑热烦渴、食欲不佳',contraindication:'脾胃虚寒者热饮'}
    ]
  }
};

// 秋冬季节数据追加
Object.assign(FM_SEASONAL_DATA, {
  autumn: {
    name:'秋季',icon:'🍂',color:'#fff3e0',
    principle:'秋主收敛，肺气当令。宜润肺生津、养阴防燥，少辛增酸，收敛肺气。',
    climate:'干燥凉爽，燥邪伤肺，阳气渐收',
    commonIssues:['秋燥咳嗽','皮肤干燥','咽干鼻燥','便秘','情绪悲忧'],
    dietTips:'多食白色润肺食物（梨、银耳、百合）；少吃辛辣燥热；适当酸味收敛。',
    teas:[
      {name:'雪梨罗汉果茶',ingredients:'雪梨半个、罗汉果1/4、枸杞5颗',
       brewing:'梨切块与罗汉果煮15分钟加枸杞',benefits:'润肺止咳、生津止渴',
       suitable:'秋燥咳嗽、咽干',contraindication:'脾虚便溏者少饮'},
      {name:'百合玉竹润肺茶',ingredients:'百合10g、玉竹8g、麦冬8g',
       brewing:'加水煮15分钟取汁饮用',benefits:'养阴润肺、清心安神',
       suitable:'肺燥干咳、失眠',contraindication:'痰湿重者不宜'},
      {name:'桂花乌龙暖秋茶',ingredients:'桂花3g、乌龙茶5g、蜂蜜适量',
       brewing:'90度水冲泡乌龙加桂花焖3分钟',benefits:'温肺化痰、理气和中',
       suitable:'秋凉胃寒、食欲减退',contraindication:'胃热者不加蜂蜜'},
      {name:'秋梨膏枸杞茶',ingredients:'秋梨膏1勺、枸杞10颗、温水200ml',
       brewing:'温水化开梨膏加枸杞饮用',benefits:'润肺生津、养肝明目',
       suitable:'秋燥口干、眼干涩',contraindication:'糖尿病者慎用梨膏'},
      {name:'沙参杏仁茶',ingredients:'沙参10g、南杏仁8g、冰糖少许',
       brewing:'沙参杏仁煮20分钟取汁加冰糖',benefits:'养阴清肺、润燥止咳',
       suitable:'干咳无痰、咽燥',contraindication:'风寒咳嗽不宜'}
    ],
    recipes:[
      {name:'银耳雪梨百合羹',ingredients:'银耳半朵、雪梨1个、百合20g',
       method:'银耳泡发炖40分钟加梨块百合再炖20分钟',benefits:'滋阴润肺、养颜美容',
       suitable:'秋燥皮肤干、干咳',contraindication:'脾虚泄泻者少食'},
      {name:'莲藕排骨润秋汤',ingredients:'莲藕300g、排骨400g、红枣5颗',
       method:'排骨焯水与莲藕红枣炖1.5小时',benefits:'养阴润燥、健脾益胃',
       suitable:'秋燥便秘、口干',contraindication:'湿热重者慎'},
      {name:'南瓜小米养胃粥',ingredients:'南瓜200g、小米80g、红枣3颗',
       method:'南瓜切块与小米红枣同煮至浓稠',benefits:'养胃健脾、润肺益气',
       suitable:'胃寒纳差、秋乏',contraindication:'血糖高者控制南瓜量'},
      {name:'蜂蜜蒸柚子',ingredients:'柚子1个、蜂蜜100g、冰糖30g',
       method:'柚肉加蜂蜜冰糖隔水蒸2小时',benefits:'润肺化痰、理气消食',
       suitable:'秋咳痰多、消化不良',contraindication:'糖尿病者慎'},
      {name:'山药枸杞炖老鸭',ingredients:'山药200g、枸杞15g、老鸭半只',
       method:'鸭焯水炖1小时加山药枸杞再炖30分钟',benefits:'养阴润肺、补脾益肾',
       suitable:'秋燥体虚、腰膝酸软',contraindication:'感冒期间不宜'}
    ]
  }
});

// 冬季数据
Object.assign(FM_SEASONAL_DATA, {
  winter: {
    name:'冬季',icon:'❄️',color:'#e3f2fd',
    principle:'冬主封藏，肾气当令。宜温肾助阳、填精补髓，少咸增苦，闭藏精气。',
    climate:'寒冷干燥，寒邪伤肾，阳气内藏',
    commonIssues:['畏寒怕冷','腰膝酸软','免疫力低','关节疼痛','手脚冰凉'],
    dietTips:'多食温补食物（羊肉、核桃、黑豆）；适当进补但忌过腻；黑色食物补肾。',
    teas:[
      {name:'红枣桂圆暖冬茶',ingredients:'红枣5颗、桂圆肉10g、生姜3片',
       brewing:'材料加水煮15分钟趁热饮',benefits:'温中补血、驱寒暖胃',
       suitable:'畏寒怕冷、面色苍白',contraindication:'上火口干者不宜'},
      {name:'黄芪当归补气茶',ingredients:'黄芪10g、当归5g、红枣3颗',
       brewing:'加水煮20分钟取汁',benefits:'补气养血、温阳固表',
       suitable:'气血两虚、易感冒',contraindication:'阴虚火旺者慎'},
      {name:'肉桂核桃暖肾茶',ingredients:'肉桂2g、核桃仁2个（碎）、红糖',
       brewing:'沸水冲泡焖10分钟加红糖',benefits:'温肾助阳、补脑益智',
       suitable:'肾阳虚、腰冷',contraindication:'阴虚内热者忌'},
      {name:'枸杞红茶养生饮',ingredients:'枸杞15颗、红茶5g、桂圆3颗',
       brewing:'红茶冲泡加枸杞桂圆焖5分钟',benefits:'滋补肝肾、温胃暖身',
       suitable:'冬季疲乏、视力模糊',contraindication:'腹泻者少饮'},
      {name:'杜仲牛膝壮骨茶',ingredients:'杜仲10g、牛膝8g、枸杞10颗',
       brewing:'杜仲牛膝煮15分钟加枸杞焖5分钟',benefits:'补肝肾、强筋骨',
       suitable:'腰膝酸软、关节冷痛',contraindication:'阴虚火旺者慎'}
    ],
    recipes:[
      {name:'当归生姜羊肉汤',ingredients:'羊肉500g、当归15g、生姜30g',
       method:'羊肉焯水与当归姜炖2小时',benefits:'温中补虚、补气养血',
       suitable:'虚寒怕冷、产后体虚',contraindication:'热证、湿热者忌'},
      {name:'黑豆核桃芝麻粥',ingredients:'黑豆30g、核桃20g、黑芝麻15g、粳米',
       method:'黑豆泡4小时与粳米煮粥加核桃芝麻',benefits:'补肾益精、乌发健脑',
       suitable:'肾虚早衰、记忆力差',contraindication:'脾虚便溏者适量'},
      {name:'板栗炖鸡',ingredients:'板栗200g、土鸡半只、红枣5颗、枸杞',
       method:'鸡焯水与板栗红枣炖1.5小时加枸杞',benefits:'补肾强筋、健脾养胃',
       suitable:'肾虚腰酸、脾虚乏力',contraindication:'胃胀消化差者少食栗'},
      {name:'胡椒猪肚煲鸡',ingredients:'猪肚1个、鸡半只、白胡椒30粒',
       method:'猪肚包鸡加胡椒炖2.5小时',benefits:'温中暖胃、补气驱寒',
       suitable:'胃寒怕冷、慢性胃炎',contraindication:'胃热口臭者不宜'},
      {name:'枸杞山药羊骨汤',ingredients:'羊骨500g、山药200g、枸杞15g',
       method:'羊骨焯水炖1小时加山药枸杞再炖30分钟',benefits:'补肾壮骨、益精养血',
       suitable:'骨质疏松、畏寒关节痛',contraindication:'痛风者忌骨汤'}
    ]
  }
});

// ========== 体质与季节匹配建议 ==========
const FM_CONSTITUTION_SEASON = {
  '气虚质':{spring:'黄芪红枣茶+韭菜鸡蛋',summer:'西洋参麦冬+山药薏米',autumn:'党参红枣粥+山药炖鸭',winter:'黄芪当归鸡+板栗炖鸡'},
  '阳虚质':{spring:'桂圆红枣茶+韭菜炒蛋',summer:'生姜红糖+羊肉面',autumn:'肉桂核桃茶+山药羊汤',winter:'当归羊肉汤+胡椒猪肚'},
  '阴虚质':{spring:'枸杞菊花茶+桑葚粥',summer:'西洋参麦冬+银耳羹',autumn:'百合玉竹茶+雪梨银耳',winter:'枸杞红茶+黑豆核桃粥'},
  '痰湿质':{spring:'陈皮山楂茶+薏米粥',summer:'荷叶薏仁茶+冬瓜汤',autumn:'陈皮普洱+莲藕排骨',winter:'生姜红枣茶+萝卜羊肉'},
  '湿热质':{spring:'金银花茶+凉拌菜',summer:'荷叶绿豆+苦瓜汤',autumn:'菊花决明茶+莲藕汤',winter:'蒲公英茶+萝卜排骨'},
  '气郁质':{spring:'玫瑰疏肝茶+香椿豆腐',summer:'佛手陈皮茶+百合莲子',autumn:'桂花乌龙+梨汤',winter:'玫瑰桂圆茶+山楂糕'},
  '血瘀质':{spring:'丹参山楂茶+黑木耳',summer:'红花茶+番茄蛋汤',autumn:'当归红枣茶+莲藕',winter:'当归羊肉+黑豆粥'},
  '特禀质':{spring:'防风黄芪茶+清淡饮食',summer:'金银花茶+蔬果为主',autumn:'沙参杏仁茶+清蒸鱼',winter:'枸杞红枣茶+温和进补'},
  '平和质':{spring:'应季花茶+时令蔬菜',summer:'酸梅汤+清凉蔬果',autumn:'秋梨膏茶+润燥汤品',winter:'红枣桂圆茶+温补炖汤'}
};

// 获取当前季节
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month>=3 && month<=5) return 'spring';
  if (month>=6 && month<=8) return 'summer';
  if (month>=9 && month<=11) return 'autumn';
  return 'winter';
}
