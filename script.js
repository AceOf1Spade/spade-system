/* SPADE SYSTEM V1 - Local-first single page app */
const STORAGE_KEY = "spadeSystemV1";
const VERSION = 1;
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const uid = (p="id") => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
const money = n => `$${Number(n||0).toFixed(2)}`;
const clamp = (n,a,b)=>Math.min(Math.max(n,a),b);
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));

const schedule = {
  1:[{name:"Live Sound",course:"MUSB 1371-001",start:"1:40 PM",end:"2:55 PM",location:"J. Longwith Radio/TV/Film 125"}],
  2:[
    {name:"Composition II",course:"ENGL 1302-047",start:"9:25 AM",end:"10:40 AM",location:"Gonzales Hall 201"},
    {name:"Introduction to Advertising",course:"COMM 2327-002",start:"12:15 PM",end:"1:30 PM",location:"J. Longwith Radio/TV/Film 202"},
    {name:"Solar System",course:"ASTR 1304-012",start:"1:40 PM",end:"2:55 PM",location:"Chemistry & Geology 004",startsOn:"2026-10-19"}
  ],
  3:[
    {name:"Live Sound",course:"MUSB 1371-001",start:"1:40 PM",end:"2:55 PM",location:"J. Longwith Radio/TV/Film 125"},
    {name:"Live Sound",course:"MUSB 1371-001",start:"3:05 PM",end:"3:55 PM",location:"J. Longwith Radio/TV/Film 125"}
  ],
  4:[
    {name:"Composition II",course:"ENGL 1302-047",start:"9:25 AM",end:"10:40 AM",location:"Gonzales Hall 201"},
    {name:"Introduction to Advertising",course:"COMM 2327-002",start:"12:15 PM",end:"1:30 PM",location:"J. Longwith Radio/TV/Film 202"},
    {name:"Solar System",course:"ASTR 1304-012",start:"1:40 PM",end:"2:55 PM",location:"Chemistry & Geology 004",startsOn:"2026-10-19"}
  ]
};

const skillDefs = {
  Strength:["Push-Ups","Pull-Ups","Dips","Core Strength","Weight Training","Explosive Power"],
  Agility:["Mobility","Flexibility","Speed","Coordination","Movement Flow"],
  Endurance:["Running","Cardio","Muscular Endurance","Recovery","Work Capacity"],
  Intellect:["Vocabulary","Grammar","Speaking","Typing","Computer Literacy","HTML","CSS","JavaScript","Web Design","Academics","Business","Finance","Music Theory"],
  Discipline:["Routines","Time Management","Focus","Consistency","Responsibility","Self-Control"],
  Creativity:["DJing","Music Production","Songwriting","Vocals","Design","Content Creation"],
  Charisma:["Conversation","Confidence","Networking","Sales","Performance","Leadership"],
  Combat:["Stance & Guard","Footwork","Jab","Cross","Hooks","Defense","Conditioning","Combinations"]
};

const questPool = {
  physical:[
    ["Hunter Training","Complete one focused strength-training session.","Normal",30,1,{strength:20,endurance:8,discipline:5}],
    ["Mobility Protocol","Complete at least 10 minutes of full-body mobility.","Easy",15,1,{agility:15,discipline:4}],
    ["Roadwork","Run or jog for at least 1 mile.","Normal",25,1,{endurance:18,agility:8}],
    ["Pulling Power","Complete 3 controlled sets of pull-ups or pull-up practice.","Normal",25,1,{strength:18,discipline:4}]
  ],
  intellect:[
    ["Scholar Session","Complete 25 minutes of focused studying or coursework.","Normal",20,1,{intellect:18,discipline:5}],
    ["Expand the Vocabulary","Learn 5 useful words and use each in a sentence.","Easy",15,1,{intellect:16}],
    ["Keyboard Training","Complete 10 minutes of focused typing practice.","Easy",15,1,{intellect:12,discipline:3}],
    ["Skill Study","Spend 20 focused minutes learning a useful concept.","Normal",20,1,{intellect:16}]
  ],
  creativity:[
    ["Creative Session","Spend 25 minutes creating music, writing, designing, or producing.","Normal",20,1,{creativity:20}],
    ["DJ Practice","Practice transitions, set building, or mixing for 20 minutes.","Normal",20,1,{creativity:18,discipline:4}],
    ["Eight Bars","Write at least 8 usable bars, lyrics, or song ideas.","Normal",20,1,{creativity:16,intellect:6}],
    ["Producer's Hour","Spend 30 focused minutes developing a song or beat.","Normal",25,1,{creativity:20,discipline:5}]
  ],
  wildcard:[
    ["Priority Target","Complete one important task you have been putting off.","Normal",20,1,{discipline:20}],
    ["Restore Order","Spend 15 focused minutes cleaning or organizing your space.","Easy",10,0,{discipline:12}],
    ["Professional Contact","Send one useful professional message, follow-up, or outreach.","Easy",15,1,{charisma:14,discipline:3}],
    ["Speak With Intent","Practice speaking clearly for 5 minutes without filler words.","Easy",15,1,{charisma:12,intellect:5}]
  ]
};

const integrityMessages = [
  "Record what happened. Earn what you claim.",
  "Progress only matters when it is real.",
  "No shortcuts today.",
  "Mastery requires proof.",
  "Consistency creates growth.",
  "Log completed work, not intended work.",
  "Your stats should reflect reality.",
  "Do the work first. Record it second."
];

const shadeMessages = [
  "Complete one priority objective before optional ones.",
  "One meaningful objective is worth more than five unfinished ones.",
  "Your strongest path is built through consistency.",
  "Choose one skill requirement and move it forward.",
  "Recovery counts when it is intentional.",
  "Handle the highest-priority deadline first."
];

const defaultData = {
  version:VERSION,
  player:{name:"SPADE",title:"The Creator",level:1,xp:0,requiredXP:100,rank:"E-Rank",coins:0},
  body:{heightFeet:5,heightInches:9,weight:148.3,goal:"Lean Athletic",history:[{date:"2026-10-05",weight:148.3}]},
  finance:{accounts:[{id:"applecash",name:"Apple Cash",type:"cash",balance:69.44}],transactions:[],goals:[],savingsFloor:0},
  companion:{name:"SHADE",stage:"Dormant",bond:0,mood:"Focused",cosmetics:["Default Mark"],equipped:["Default Mark"]},
  daily:{date:null,focus:"Balanced",quests:[],integrity:null,recommendation:null,clearAwarded:false},
  stats:{strength:{level:5,xp:0},agility:{level:5,xp:0},endurance:{level:5,xp:0},intellect:{level:5,xp:0},discipline:{level:5,xp:0},creativity:{level:5,xp:0},charisma:{level:5,xp:0}},
  skills:{},
  weekly:{weekKey:null,quests:[]},
  customQuests:[],
  questHistory:[],
  bosses:[],
  dungeons:[],
  goals:[
    {id:"artist",name:"Become a Complete Artist",type:"milestone",progress:0,status:"Primary"},
    {id:"athlete",name:"Become a Stronger Athlete",type:"milestone",progress:0,status:"Active"},
    {id:"school",name:"Finish School Strong",type:"milestone",progress:0,status:"Primary"},
    {id:"savings",name:"Build Savings",type:"numeric",current:0,target:10000,status:"Primary"}
  ],
  arcs:[
    {id:"artistArc",name:"The Artist Path",progress:0,chapters:["Foundations","Songwriter","Recording Artist","Performer"],boss:"First Original Live Performance"},
    {id:"developerArc",name:"The Developer Path",progress:0,chapters:["Foundations","Builder","Freelancer"],boss:"Professional Client Project"},
    {id:"athleteArc",name:"Athlete Ascension",progress:0,chapters:["Foundation","Capacity","Control","Performance"],boss:"Athlete Assessment"}
  ],
  lifeChapter:{name:"FALL 2026",subtitle:"The Awakening",start:"2026-10-05"},
  timeline:[{date:"2026-10-05",text:"SPADE SYSTEM initialized."}],
  achievements:[],
  titles:["The Creator"],
  equippedTitle:"The Creator",
  inventory:{consumables:{recoveryToken:0,streakShield:0,questReroll:0},keyItems:[],trophies:[]},
  rewards:{
    real:[
      {id:"movie",name:"Game / Movie Night",coins:200,cost:0},
      {id:"meal",name:"Favorite Meal",coins:300,cost:20},
      {id:"goout",name:"Go Out",coins:350,cost:30},
      {id:"drink",name:"Buy a Drink",coins:400,cost:10},
      {id:"small",name:"Small Purchase",coins:600,cost:40}
    ]
  },
  workouts:[],
  nutrition:{today:null,protein:0,water:0,meals:[],proteinTarget:120,waterTarget:96},
  calendarEvents:[],
  legacy:{quests:0,skillsMastered:0,bosses:0,dungeons:0,perfectClears:0,workouts:0,learningHours:0,performances:0,projects:0,skillIncome:0,longestStreak:0},
  settings:{integrity:true,notifications:true}
};

function mergeDeep(target,source){
  if(!source) return target;
  for(const k of Object.keys(source)){
    if(source[k] && typeof source[k]==="object" && !Array.isArray(source[k])){
      target[k]=mergeDeep(target[k]||{},source[k]);
    } else target[k]=source[k];
  }
  return target;
}
function load(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(!raw) return structuredClone(defaultData);
  try{return mergeDeep(structuredClone(defaultData),JSON.parse(raw));}
  catch{return structuredClone(defaultData);}
}
let data = load();
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}

function seedFromText(text){
  let s=0;
  for(let i=0;i<text.length;i++) s=(s*31+text.charCodeAt(i))>>>0;
  return s;
}
function rng(seed){
  let x=seed%2147483647;if(x<=0)x+=2147483646;
  return ()=>((x=x*16807%2147483647)-1)/2147483646;
}
function pick(arr,random){return structuredClone(arr[Math.floor(random()*arr.length)]);}
function todayClasses(){
  const d=new Date(), key=todayKey();
  return (schedule[d.getDay()]||[]).filter(x=>!x.startsOn||key>=x.startsOn);
}
function requiredXP(level){return 100+(level-1)*25+Math.floor(Math.pow(level-1,1.22)*12);}
function statRequired(level){return 100+(level-1)*50;}
function rankFor(level){if(level>=75)return"S-Rank";if(level>=50)return"A-Rank";if(level>=35)return"B-Rank";if(level>=20)return"C-Rank";if(level>=10)return"D-Rank";return"E-Rank";}
function setText(id,val){const e=document.getElementById(id);if(e)e.textContent=val;}
function toast(msg){
  const e=document.getElementById("systemToast");e.textContent=msg;e.style.display="block";
  clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display="none",2600);
}
function addXP(n){
  if(!(n>0))return;
  data.player.xp+=n;
  while(data.player.xp>=data.player.requiredXP){
    data.player.xp-=data.player.requiredXP;data.player.level++;
    data.player.requiredXP=requiredXP(data.player.level);data.player.rank=rankFor(data.player.level);
    data.timeline.unshift({date:todayKey(),text:`Reached Level ${data.player.level}.`});
    toast(`LEVEL UP · LEVEL ${data.player.level}`);
  }
}
function addCoins(n){if(n>0)data.player.coins+=n;}
function addStat(stat,n){
  if(!data.stats[stat]||!(n>0))return;
  const s=data.stats[stat];s.xp+=n;
  while(s.xp>=statRequired(s.level)){s.xp-=statRequired(s.level);s.level++;toast(`${stat.toUpperCase()} · LEVEL ${s.level}`);}
}
function companionBond(n){data.companion.bond=Math.max(0,data.companion.bond+n);checkCompanionStage();}
function checkCompanionStage(){
  const l=data.player.level,b=data.companion.bond,m=Object.values(data.skills).filter(s=>s.state==="Mastered").length;
  let stage="Dormant";
  if(l>=75&&b>=20&&m>=20)stage="Mythic";
  else if(l>=50&&b>=15&&m>=15)stage="Elite";
  else if(l>=30&&b>=10&&m>=10)stage="Ascended";
  else if(l>=15&&b>=5&&m>=5)stage="Developed";
  else if(l>=5&&b>=2&&m>=1)stage="Awakened";
  data.companion.stage=stage;
}

function getShadeProfile(stage){
  const map={
    "Dormant":{
      className:"stage-dormant",
      formName:"Dormant Familiar",
      role:"Observer",
      description:"A quiet system familiar, half-asleep and watching your first steps. It has not chosen its full shape yet.",
      traits:["Silent","Watchful","Adaptive"],
      resonance:"Potential is present, but still sleeping.",
      abilities:["Observe progress","Store intent","React to bond growth"]
    },
    "Awakened":{
      className:"stage-awakened",
      formName:"Awakened Wisp",
      role:"Guide",
      description:"Shade begins to take form as a floating spirit-beast, guiding momentum and rewarding consistency.",
      traits:["Curious","Reactive","Loyal"],
      resonance:"Responds to your first real milestones.",
      abilities:["Boost morale","Mark objectives","Strengthen focus"]
    },
    "Developed":{
      className:"stage-developed",
      formName:"Developed Sentinel",
      role:"Scout",
      description:"Shade has stabilized into a sharper and more alert entity. It begins to feel like a real presence rather than a symbol.",
      traits:["Focused","Protective","Intuitive"],
      resonance:"Feeds on discipline and mastered basics.",
      abilities:["Track streaks","Highlight opportunities","Protect progress"]
    },
    "Ascended":{
      className:"stage-ascended",
      formName:"Ascended Revenant",
      role:"Guardian",
      description:"A powerful guardian form with a stronger aura and a clearer will. Shade now mirrors your ambition.",
      traits:["Resolute","Commanding","Swift"],
      resonance:"Awakened through significant growth and trust.",
      abilities:["Guard momentum","Empower challenges","Fortify resolve"]
    },
    "Elite":{
      className:"stage-elite",
      formName:"Elite Sovereign",
      role:"Commander",
      description:"Shade becomes a regal shadow-beast, controlling its energy with precision and helping direct your higher-level path.",
      traits:["Strategic","Dominant","Unshaken"],
      resonance:"Built through major mastery and a deep bond.",
      abilities:["Direct campaigns","Enhance trials","Pressure bosses"]
    },
    "Mythic":{
      className:"stage-mythic",
      formName:"Mythic Eclipse Beast",
      role:"Mythic Companion",
      description:"The final mythic form. Shade is no longer just a companion — it is a living reflection of your complete path.",
      traits:["Transcendent","Ancient","Devoted"],
      resonance:"A once-hidden beast fully manifested.",
      abilities:["Empower legacy","Crown milestones","Open mythic trials"]
    }
  };
  return map[stage] || map["Dormant"];
}

function shadeEntityMarkup(){
  return `
    <div class="shade-aura-ring ring-1"></div>
    <div class="shade-aura-ring ring-2"></div>
    <div class="shade-aura-ring ring-3"></div>
    <div class="shade-ear ear-left"></div>
    <div class="shade-ear ear-right"></div>
    <div class="shade-side-wisp wisp-left"></div>
    <div class="shade-side-wisp wisp-right"></div>
    <div class="shade-tail"></div>
    <div class="shade-body"></div>
    <div class="shade-cloak"></div>
    <div class="shade-core"></div>
    <div class="shade-crown">♠</div>
    <div class="shade-eye eye-left"></div>
    <div class="shade-eye eye-right"></div>
  `;
}

function renderShadeHero(){
  const profile=getShadeProfile(data.companion.stage);
  const entity=document.getElementById("shadeEntity");
  if(entity){
    entity.className=`shade-entity ${profile.className}`;
    entity.innerHTML=shadeEntityMarkup();
  }
  setText("shadeFormName",profile.formName);
  setText("shadeFlavor",profile.description);
  const traitWrap=document.getElementById("shadeTraits");
  if(traitWrap){
    traitWrap.innerHTML=profile.traits.map(t=>`<span class="shade-pill">${esc(t)}</span>`).join("");
  }
}

function initSkills(){
  if(Object.keys(data.skills).length)return;
  Object.entries(skillDefs).forEach(([branch,names])=>{
    names.forEach((name,i)=>{
      const id=`${branch.toLowerCase()}_${name.toLowerCase().replace(/[^a-z0-9]+/g,"_")}`;
      data.skills[id]={id,branch,name,rarity:i<2?"Common":i<4?"Uncommon":"Rare",state:i===0?"Discovered":"Locked",xp:0,practice:0,best:null,lastPracticed:null};
    });
  });
}
function initDaily(){
  const key=todayKey();
  if(data.daily.date===key && data.daily.quests.length)return;
  data.daily={...data.daily,date:key,quests:[],clearAwarded:false};
  const random=rng(seedFromText(key));
  const qs=[];
  const classes=todayClasses();
  if(classes.length){
    qs.push({id:`${key}_school`,title:classes.length>1?"Attend Today's Classes":"Attend Today's Class",description:classes.length>1?`Attend all ${classes.length} scheduled classes.`:`Attend ${classes[0].name}.`,difficulty:"Normal",xp:20,coins:1,stats:{intellect:12,discipline:10},completed:false});
  }
  const make=(arr,id)=>{const [title,description,difficulty,xp,coins,stats]=pick(arr,random);return{id,title,description,difficulty,xp,coins,stats,completed:false};};
  qs.push(make(questPool.physical,`${key}_physical`));
  qs.push(make(questPool.intellect,`${key}_intellect`));
  qs.push(make(questPool.creativity,`${key}_creative`));
  qs.push(make(questPool.wildcard,`${key}_wild`));
  if(qs.length<5)qs.push(make([...questPool.intellect,...questPool.wildcard],`${key}_bonus`));
  data.daily.quests=qs.slice(0,5);
  const idx=seedFromText(key)%integrityMessages.length;
  data.daily.integrity=integrityMessages[idx];
  data.daily.recommendation=shadeMessages[seedFromText(key+"shade")%shadeMessages.length];
}
function weekKey(){
  const d=new Date(),tmp=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const day=tmp.getDay()||7;tmp.setDate(tmp.getDate()+4-day);
  const yearStart=new Date(tmp.getFullYear(),0,1);
  const week=Math.ceil((((tmp-yearStart)/86400000)+1)/7);
  return `${tmp.getFullYear()}-W${String(week).padStart(2,"0")}`;
}
function initWeekly(){
  const wk=weekKey();
  if(data.weekly.weekKey===wk && data.weekly.quests.length)return;
  data.weekly={weekKey:wk,quests:[
    {id:uid("w"),title:"Consistency Protocol",description:"Complete 4 workouts or physical sessions this week.",target:4,progress:0,xp:100,coins:6,completed:false},
    {id:uid("w"),title:"Scholar's Pace",description:"Complete 3 learning or study sessions.",target:3,progress:0,xp:75,coins:5,completed:false},
    {id:uid("w"),title:"Creator Cycle",description:"Complete 3 creative sessions.",target:3,progress:0,xp:75,coins:5,completed:false}
  ]};
}
function initNutrition(){
  if(data.nutrition.today!==todayKey())data.nutrition={...data.nutrition,today:todayKey(),protein:0,water:0,meals:[]};
}
function initAchievements(){
  const add=(id,name,desc,rarity="Common")=>{
    if(!data.achievements.some(a=>a.id===id)){data.achievements.push({id,name,desc,rarity,date:todayKey()});data.timeline.unshift({date:todayKey(),text:`Achievement unlocked: ${name}`});toast(`ACHIEVEMENT · ${name}`);}
  };
  if(data.legacy.quests>=1)add("firstquest","First Clear","Complete your first quest.");
  if(data.player.level>=5)add("level5","Awakened","Reach Level 5.","Uncommon");
  if(data.player.coins>=100)add("coin100","System Reserve","Hold 100 System Coins.","Uncommon");
  if(data.legacy.workouts>=10)add("workout10","Iron Habit","Complete 10 workouts.","Rare");
  if(Object.values(data.skills).some(s=>s.state==="Mastered"))add("skillmaster","First Mastery","Master your first skill.","Rare");
}
function availableMoney(){return data.finance.accounts.reduce((a,b)=>a+Number(b.balance||0),0);}
function incomeTotal(){return data.finance.transactions.filter(t=>t.type==="income").reduce((a,b)=>a+Number(b.amount||0),0);}
function expenseTotal(){return data.finance.transactions.filter(t=>t.type==="expense").reduce((a,b)=>a+Number(b.amount||0),0);}
function skillIncomeTotal(){return data.finance.transactions.filter(t=>t.type==="income"&&t.skillIncome).reduce((a,b)=>a+Number(b.amount||0),0);}

function renderHome(){
  setText("playerTitle",data.equippedTitle||data.player.title);setText("playerLevel",data.player.level);setText("playerRank",data.player.rank);
  setText("currentXP",data.player.xp);setText("requiredXP",data.player.requiredXP);setText("systemCoins",data.player.coins);setText("financeCoinDisplay",data.player.coins);
  setText("shadeStage",data.companion.stage);setText("integrityMessage",data.daily.integrity||integrityMessages[0]);setText("shadeRecommendation",data.daily.recommendation||shadeMessages[0]);
  setText("homeHeight",`${data.body.heightFeet}'${data.body.heightInches}"`);setText("homeWeight",`${data.body.weight.toFixed(1)} lb`);setText("homeAvailable",money(availableMoney()));
  const xpPct=data.player.requiredXP?data.player.xp/data.player.requiredXP*100:0;document.getElementById("xpProgress").style.width=`${clamp(xpPct,0,100)}%`;
  const d=new Date();setText("todayDate",`${d.toLocaleDateString("en-US",{weekday:"long"})} · ${d.toLocaleDateString("en-US",{month:"long",day:"numeric"})}`);
  setText("focusButton",data.daily.focus);
  const done=data.daily.quests.filter(q=>q.completed).length;setText("dailyQuestComplete",done);setText("dailyQuestTotal",data.daily.quests.length);setText("dailyQuestHeaderCount",`${done} / ${data.daily.quests.length}`);
  document.getElementById("dailyQuestProgress").style.width=`${data.daily.quests.length?done/data.daily.quests.length*100:0}%`;
  setText("mainQuestName","Build the Foundation");const mp=Math.min(100,Math.round((data.player.level/10)*100));setText("mainQuestPercent",`${mp}%`);document.getElementById("mainQuestProgress").style.width=`${mp}%`;
  renderSchedule();renderDailyQuestList();renderUnlocks();
}
function renderSchedule(){
  const el=document.getElementById("scheduleList");const classes=todayClasses();
  const events=data.calendarEvents.filter(e=>e.date===todayKey()).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
  const all=[...classes.map(x=>({...x,type:"School"})),...events.map(e=>({name:e.name,course:e.category||"Event",start:e.time||"All Day",end:"",location:e.notes||"",type:e.category||"Event"}))];
  if(!all.length){el.innerHTML=`<div class="list-card"><p class="eyebrow">NO SCHEDULED ITEMS</p><p class="meta">Your timeline is clear.</p></div>`;return;}
  el.innerHTML=all.map(x=>`<article class="schedule-item"><div class="schedule-time">${esc(x.start)}${x.end?`<small style="display:block">${esc(x.end)}</small>`:""}</div><div class="schedule-content"><h4>${esc(x.name)}</h4><p>${esc(x.course)}</p><p>${esc(x.location)}</p></div></article>`).join("");
}
function renderDailyQuestList(){
  const el=document.getElementById("dailyQuestList");
  el.innerHTML=data.daily.quests.map(q=>{
    const tags=Object.entries(q.stats||{}).map(([s,v])=>`<span class="tag">${s.slice(0,3).toUpperCase()} +${v}</span>`).join("");
    return `<article class="quest-card ${q.completed?"done":""}">
      <button class="quest-check" data-complete-daily="${q.id}" ${q.completed?"disabled":""}>${q.completed?"✓":"○"}</button>
      <div><div class="quest-title">${esc(q.title)}</div><div class="quest-desc">${esc(q.description)}</div><div class="quest-tags"><span class="tag">${esc(q.difficulty)}</span>${tags}</div></div>
      <div class="quest-reward">+${q.xp} XP<br>${q.coins?`◈ ${q.coins}`:""}</div>
    </article>`;
  }).join("");
  const done=data.daily.quests.filter(q=>q.completed).length;
  if(done===data.daily.quests.length&&done)el.innerHTML+=`<div class="clear-banner"><strong>DAILY QUEST SET CLEARED</strong><p class="meta">All System missions completed.</p></div>`;
}
function renderUnlocks(){
  const lvl=data.player.level;
  const list=[
    ["Boss Battles",data.bosses.length>0||lvl>=3,lvl>=3?"Unlocked":"Reach Level 3"],
    ["Dungeons",lvl>=5,lvl>=5?"Unlocked":"Reach Level 5"],
    ["Rank Trial",lvl>=10,lvl>=10?"Available":"Reach Level 10"],
    ["Companion Evolution",data.companion.stage!=="Dormant",data.companion.stage!=="Dormant"?data.companion.stage:"Requirements hidden"]
  ];
  document.getElementById("unlockGrid").innerHTML=list.map(([n,u,t])=>`<div class="unlock-card ${u?"":"locked"}"><div><p class="eyebrow">SYSTEM FEATURE</p><strong>${n}</strong></div><span class="locked-badge">${u?"✓":"🔒"} ${t}</span></div>`).join("");
}

function completeDaily(id){
  const q=data.daily.quests.find(x=>x.id===id);if(!q||q.completed)return;
  q.completed=true;addXP(q.xp);addCoins(q.coins);Object.entries(q.stats||{}).forEach(([s,v])=>addStat(s,v));
  data.legacy.quests++;data.questHistory.unshift({date:todayKey(),title:q.title,type:"Daily",xp:q.xp});
  if(/training|roadwork|mobility|pulling/i.test(q.title)){progressWeekly("Consistency Protocol");}
  if(/scholar|vocabulary|keyboard|skill study/i.test(q.title)){progressWeekly("Scholar's Pace");data.legacy.learningHours+=.4;}
  if(/creative|dj|bars|producer/i.test(q.title)){progressWeekly("Creator Cycle");}
  const done=data.daily.quests.filter(x=>x.completed).length;
  if(done===data.daily.quests.length&&!data.daily.clearAwarded){data.daily.clearAwarded=true;addXP(30);addCoins(3);companionBond(2);toast("DAILY CLEAR · +30 XP · +3 COINS · +2 BOND");}
  initAchievements();save();renderAll();
}
function progressWeekly(title){
  const q=data.weekly.quests.find(x=>x.title===title);if(!q||q.completed)return;
  q.progress=Math.min(q.target,q.progress+1);
  if(q.progress>=q.target){q.completed=true;addXP(q.xp);addCoins(q.coins);data.questHistory.unshift({date:todayKey(),title:q.title,type:"Weekly",xp:q.xp});toast(`WEEKLY CLEAR · ${q.title}`);}
}

function renderQuestTab(tab="daily"){
  const el=document.getElementById("questTabContent");
  if(tab==="daily"){
    el.innerHTML=`<div class="panel"><div class="panel-heading"><div><p class="eyebrow">TODAY</p><h3>Generated Missions</h3></div></div><div class="daily-quest-list">${data.daily.quests.map(q=>`<article class="quest-card ${q.completed?"done":""}"><button class="quest-check" data-complete-daily="${q.id}" ${q.completed?"disabled":""}>${q.completed?"✓":"○"}</button><div><div class="quest-title">${esc(q.title)}</div><div class="quest-desc">${esc(q.description)}</div></div><div class="quest-reward">+${q.xp} XP</div></article>`).join("")}</div></div>`;
  } else if(tab==="weekly"){
    el.innerHTML=`<div class="list-stack">${data.weekly.quests.map(q=>`<article class="list-card"><div class="row-between"><strong>${esc(q.title)}</strong><span>${q.progress}/${q.target}</span></div><p class="meta">${esc(q.description)}</p><div class="mini-progress"><div class="mini-progress-fill" style="width:${q.progress/q.target*100}%"></div></div><p class="meta">Reward: +${q.xp} XP · ◈ ${q.coins}</p></article>`).join("")}</div>`;
  } else if(tab==="custom"){
    el.innerHTML=`<div class="list-stack">${data.customQuests.length?data.customQuests.map(q=>`<article class="list-card"><div class="row-between"><strong>${esc(q.name)}</strong><span class="tag">${esc(q.difficulty||"Normal")}</span></div><p class="meta">${esc(q.category||"Custom")} · ${esc(q.date||"No deadline")}</p><p class="meta">${esc(q.notes||"")}</p><div class="card-actions">${q.completed?"<span class='tag'>Completed</span>":`<button class="primary-btn" data-complete-custom="${q.id}">Complete</button>`}<button class="danger-btn" data-delete-custom="${q.id}">Delete</button></div></article>`).join(""):`<div class="list-card"><strong>No custom quests yet.</strong><p class="meta">Use + Custom for gigs, assignments, interviews, projects, appointments, or goals.</p></div>`}</div>`;
  } else if(tab==="bosses"){
    const unlocked=data.player.level>=3;
    el.innerHTML=!unlocked?`<div class="list-card"><strong>Boss System Locked</strong><p class="meta">Reach Level 3 to convert major real-world objectives into boss encounters.</p></div>`:
    `<div class="list-stack">${data.bosses.length?data.bosses.map(b=>`<article class="list-card"><div class="row-between"><strong>${esc(b.name)}</strong><span class="tag">${esc(b.rank||"E-Rank")}</span></div><p class="meta">${esc(b.description||"")}</p><div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${100-(b.hp/b.maxHp*100)}%"></div></div><p class="meta">HP ${b.hp}/${b.maxHp}</p><div class="card-actions"><button class="primary-btn" data-damage-boss="${b.id}">Complete Phase</button></div></article>`).join(""):`<div class="list-card"><strong>No active bosses.</strong><p class="meta">Create a custom quest and mark it as a Boss.</p></div>`}</div>`;
  } else if(tab==="dungeons"){
    const unlocked=data.player.level>=5;
    el.innerHTML=!unlocked?`<div class="list-card"><strong>Dungeons Locked</strong><p class="meta">Reach Level 5.</p></div>`:
    `<div class="list-stack">${data.dungeons.length?data.dungeons.map(d=>`<article class="list-card"><div class="row-between"><strong>${esc(d.name)}</strong><span>${d.progress}/${d.target}</span></div><p class="meta">${esc(d.description||"")}</p><div class="mini-progress"><div class="mini-progress-fill" style="width:${d.progress/d.target*100}%"></div></div><div class="card-actions"><button class="primary-btn" data-progress-dungeon="${d.id}">Clear Room</button></div></article>`).join(""):`<div class="list-card"><strong>No active dungeons.</strong><p class="meta">The first dungeon can be generated once you are Level 5.</p><button class="primary-btn" style="margin-top:10px" data-generate-dungeon>Generate Dungeon</button></div>`}</div>`;
  } else {
    el.innerHTML=`<div class="list-stack">${data.questHistory.length?data.questHistory.slice(0,50).map(q=>`<article class="list-card"><strong>${esc(q.title)}</strong><p class="meta">${esc(q.type)} · ${esc(q.date)} · +${q.xp} XP</p></article>`).join(""):`<div class="list-card">No completed quests yet.</div>`}</div>`;
  }
}
function completeCustom(id){
  const q=data.customQuests.find(x=>x.id===id);if(!q||q.completed)return;
  q.completed=true;const xp={Easy:10,Normal:20,Challenging:30,Hard:40,"Very Hard":60,Elite:75}[q.difficulty]||20;addXP(xp);addCoins(q.difficulty==="Hard"?2:1);addStat(q.stat||"discipline",Math.max(5,Math.round(xp*.6)));data.legacy.quests++;data.questHistory.unshift({date:todayKey(),title:q.name,type:"Custom",xp});if(q.type==="Boss"){createBossFromQuest(q);}save();renderAll();toast(`QUEST COMPLETE · +${xp} XP`);
}
function createBossFromQuest(q){
  if(data.bosses.some(b=>b.sourceId===q.id))return;
  data.bosses.push({id:uid("boss"),sourceId:q.id,name:q.name,description:q.notes,rank:q.difficulty==="Elite"?"A-Rank":"C-Rank",hp:300,maxHp:300,phases:3});
}
function damageBoss(id){
  const b=data.bosses.find(x=>x.id===id);if(!b)return;
  b.hp=Math.max(0,b.hp-Math.ceil(b.maxHp/b.phases));
  if(b.hp===0){data.legacy.bosses++;addXP(100);addCoins(20);companionBond(10);data.timeline.unshift({date:todayKey(),text:`Boss defeated: ${b.name}`});toast("BOSS DEFEATED · +100 XP · ◈20");}
  save();renderQuestTab("bosses");renderAll();
}
function generateDungeon(){
  data.dungeons.push({id:uid("dng"),name:"Iron Trial I",description:"A 5-room physical consistency dungeon.",progress:0,target:5,xp:150,coins:15});save();renderQuestTab("dungeons");
}
function progressDungeon(id){
  const d=data.dungeons.find(x=>x.id===id);if(!d||d.progress>=d.target)return;
  d.progress++;
  if(d.progress>=d.target){data.legacy.dungeons++;addXP(d.xp);addCoins(d.coins);companionBond(8);data.timeline.unshift({date:todayKey(),text:`Dungeon cleared: ${d.name}`});toast(`DUNGEON CLEAR · +${d.xp} XP · ◈${d.coins}`);}
  save();renderQuestTab("dungeons");renderAll();
}

function renderSkills(){
  document.getElementById("coreStatGrid").innerHTML=Object.entries(data.stats).map(([k,s])=>`<div class="stat-card"><p class="eyebrow">${k}</p><strong>${s.level}</strong><div class="mini-progress"><div class="mini-progress-fill" style="width:${s.xp/statRequired(s.level)*100}%"></div></div><p class="meta">${s.xp}/${statRequired(s.level)} stat XP</p></div>`).join("");
  const byBranch={};Object.values(data.skills).forEach(s=>(byBranch[s.branch]??=[]).push(s));
  document.getElementById("skillTrees").innerHTML=Object.entries(byBranch).map(([branch,skills])=>`<details class="skill-branch"><summary>${esc(branch)} · ${skills.filter(s=>s.state==="Mastered").length}/${skills.length} mastered</summary><div class="skill-list">${skills.map(s=>`<div class="skill-row"><div class="row-between"><div><strong>${esc(s.name)}</strong><p class="meta rarity-${s.rarity.toLowerCase()}">${s.rarity}</p></div><span class="skill-state">${s.state}</span></div><div class="mini-progress"><div class="mini-progress-fill" style="width:${Math.min(100,s.xp/100*100)}%"></div></div><p class="meta">${s.xp}/100 skill XP · ${s.practice} sessions</p><div class="card-actions"><button class="secondary-btn" data-practice-skill="${s.id}" ${s.state==="Locked"?"disabled":""}>Log Practice</button></div></div>`).join("")}</div></details>`).join("");
  const specs=[
    ["Artist",avg(["creativity","intellect"])],
    ["Performer",avg(["creativity","charisma"])],
    ["Developer",avg(["intellect","discipline"])],
    ["Athlete",avg(["strength","agility","endurance"])],
    ["Entrepreneur",avg(["intellect","charisma","discipline"])],
    ["Combatant",Math.round((data.stats.strength.level+data.stats.agility.level+data.stats.endurance.level)/3)]
  ];
  document.getElementById("specializationList").innerHTML=`<div class="list-stack">${specs.map(([n,v])=>`<div class="list-card"><div class="row-between"><strong>${n}</strong><span>${v}</span></div><div class="mini-progress"><div class="mini-progress-fill" style="width:${Math.min(100,v/25*100)}%"></div></div></div>`).join("")}</div>`;
}
function avg(keys){return Math.round(keys.reduce((a,k)=>a+data.stats[k].level,0)/keys.length);}
function practiceSkill(id){
  const s=data.skills[id];if(!s||s.state==="Locked")return;
  s.practice++;s.xp+=20;s.lastPracticed=todayKey();addXP(10);addStat(statForBranch(s.branch),8);
  if(s.xp>=100){s.xp=100;s.state="Mastered";data.legacy.skillsMastered=Object.values(data.skills).filter(x=>x.state==="Mastered").length;unlockRelatedSkills(s.branch);companionBond(3);toast(`SKILL MASTERED · ${s.name}`);}
  else if(s.xp>=70)s.state="Proficient";else if(s.xp>=40)s.state="Developing";else s.state="Learning";
  save();initAchievements();renderAll();
}
function statForBranch(branch){return ({Strength:"strength",Agility:"agility",Endurance:"endurance",Intellect:"intellect",Discipline:"discipline",Creativity:"creativity",Charisma:"charisma",Combat:"agility"})[branch]||"intellect";}
function unlockRelatedSkills(branch){
  const skills=Object.values(data.skills).filter(s=>s.branch===branch);
  const firstLocked=skills.find(s=>s.state==="Locked");if(firstLocked)firstLocked.state="Discovered";
}

function renderJourneyTab(tab="goals"){
  const el=document.getElementById("journeyTabContent");
  if(tab==="goals"){
    el.innerHTML=`<div class="list-stack">${data.goals.map(g=>`<article class="list-card"><div class="row-between"><strong>${esc(g.name)}</strong><span class="tag">${esc(g.status||"Active")}</span></div>${g.type==="numeric"?`<p class="meta">${money(g.current)} / ${money(g.target)}</p><div class="mini-progress"><div class="mini-progress-fill" style="width:${Math.min(100,g.current/g.target*100)}%"></div></div>`:`<p class="meta">Milestone-based objective</p>`}</article>`).join("")}</div>`;
  } else if(tab==="arcs"){
    el.innerHTML=`<div class="list-stack">${data.arcs.map(a=>`<article class="list-card"><div class="row-between"><strong>${esc(a.name)}</strong><span>${a.progress}%</span></div><div class="mini-progress"><div class="mini-progress-fill" style="width:${a.progress}%"></div></div><p class="meta">${a.chapters.map((c,i)=>`${i+1}. ${c}`).join(" · ")}</p><p class="meta">Final Boss: ${esc(a.boss)}</p></article>`).join("")}</div>`;
  } else if(tab==="chapter"){
    const since=data.lifeChapter.start;
    el.innerHTML=`<div class="panel"><p class="eyebrow">LIFE CHAPTER</p><h2>${esc(data.lifeChapter.name)}</h2><p class="meta">"${esc(data.lifeChapter.subtitle)}" · Started ${since}</p><div class="legacy-grid" style="margin-top:16px">${metric("Level",data.player.level)}${metric("Rank",data.player.rank)}${metric("Skills Mastered",data.legacy.skillsMastered)}${metric("Bosses",data.legacy.bosses)}${metric("Dungeons",data.legacy.dungeons)}${metric("Quests",data.legacy.quests)}</div></div>`;
  } else if(tab==="timeline"){
    el.innerHTML=`<div class="panel"><div class="timeline">${data.timeline.slice(0,60).map(t=>`<div class="timeline-item"><strong>${esc(t.text)}</strong><p class="meta">${esc(t.date)}</p></div>`).join("")}</div></div>`;
  } else {
    el.innerHTML=`<div class="legacy-grid">${metric("Quests",data.legacy.quests)}${metric("Skills",data.legacy.skillsMastered)}${metric("Bosses",data.legacy.bosses)}${metric("Dungeons",data.legacy.dungeons)}${metric("Workouts",data.legacy.workouts)}${metric("Learning Hours",data.legacy.learningHours.toFixed(1))}${metric("Performances",data.legacy.performances)}${metric("Projects",data.legacy.projects)}${metric("Skill Income",money(data.legacy.skillIncome))}</div>`;
  }
}
function metric(label,val){return `<div class="metric"><p class="eyebrow">${label}</p><strong>${val}</strong></div>`;}

function renderShadeTab(tab="overview"){
  setText("shadeLevel",data.player.level);setText("shadeStageFull",data.companion.stage);setText("shadeBond",data.companion.bond);
  document.getElementById("bondProgress").style.width=`${Math.min(100,data.companion.bond/20*100)}%`;
  renderShadeHero();
  const el=document.getElementById("shadeTabContent");
  const profile=getShadeProfile(data.companion.stage);

  if(tab==="overview"){
    const total=Object.values(data.stats).reduce((a,s)=>a+s.level,0)||1;
    el.innerHTML=`
      <div class="panel">
        <div class="row-between">
          <div><p class="eyebrow">FORM</p><h3>${esc(profile.formName)}</h3></div>
          <div><p class="eyebrow">ROLE</p><h3>${esc(profile.role)}</h3></div>
        </div>
        <p class="meta" style="margin-top:10px">${esc(profile.resonance)}</p>
      </div>

      <div class="panel">
        <p class="eyebrow">ABILITIES</p>
        <div class="list-stack" style="margin-top:12px">
          ${profile.abilities.map(a=>`<div class="list-card"><strong>${esc(a)}</strong></div>`).join("")}
        </div>
      </div>

      <div class="panel">
        <div class="row-between">
          <div><p class="eyebrow">MOOD</p><h3>${esc(data.companion.mood)}</h3></div>
          <div><p class="eyebrow">STAGE</p><h3>${esc(data.companion.stage)}</h3></div>
        </div>
      </div>

      <div class="panel">
        <p class="eyebrow">AFFINITY</p>
        <div class="affinity-grid" style="margin-top:12px">
          ${Object.entries(data.stats).map(([k,s])=>`<div class="affinity-item"><div class="row-between"><span>${k}</span><strong>${Math.round(s.level/total*100)}%</strong></div></div>`).join("")}
        </div>
      </div>
    `;
  } else if(tab==="evolution"){
    const mastered=data.legacy.skillsMastered;
    const reqs=[
      ["Awakened","Level 5 · Bond 2 · 1 mastered skill",data.player.level>=5&&data.companion.bond>=2&&mastered>=1],
      ["Developed","Level 15 · Bond 5 · 5 mastered skills",data.player.level>=15&&data.companion.bond>=5&&mastered>=5],
      ["Ascended","Level 30 · Bond 10 · 10 mastered skills",data.player.level>=30&&data.companion.bond>=10&&mastered>=10],
      ["Elite","Level 50 · Bond 15 · 15 mastered skills",data.player.level>=50&&data.companion.bond>=15&&mastered>=15],
      ["Mythic","Level 75 · Bond 20 · 20 mastered skills",data.player.level>=75&&data.companion.bond>=20&&mastered>=20]
    ];
    el.innerHTML=`<div class="list-stack">${reqs.map(([n,r,ok])=>`<div class="list-card"><div class="row-between"><strong>${n}</strong><span>${ok?"✓":"🔒"}</span></div><p class="meta">${r}</p></div>`).join("")}</div>`;
  } else if(tab==="cosmetics"){
    el.innerHTML=`<div class="list-stack">${data.companion.cosmetics.map(c=>`<div class="list-card"><div class="row-between"><strong>${esc(c)}</strong><span>${data.companion.equipped.includes(c)?"Equipped":"Owned"}</span></div></div>`).join("")}</div>`;
  } else if(tab==="room"){
    el.innerHTML=`<div class="panel"><p class="eyebrow">SHADE'S ROOM</p><h3>Trophy Archive</h3><div class="list-stack" style="margin-top:12px">${data.inventory.trophies.length?data.inventory.trophies.map(t=>`<div class="list-card">${esc(t)}</div>`).join(""):`<div class="list-card"><p class="meta">No trophies yet. Bosses, dungeons, performances, and milestones will fill this room.</p></div>`}</div></div>`;
  } else {
    el.innerHTML=`<div class="panel"><div class="timeline">${data.timeline.filter(t=>/SHADE|Boss|Dungeon|Skill|Level|Achievement/i.test(t.text)).slice(0,40).map(t=>`<div class="timeline-item"><strong>${esc(t.text)}</strong><p class="meta">${t.date}</p></div>`).join("")}</div></div>`;
  }
}

function openModal(title,html,eyebrow="SYSTEM INPUT"){
  setText("modalTitle",title);setText("modalEyebrow",eyebrow);document.getElementById("modalBody").innerHTML=html;
  document.getElementById("modal").classList.add("open");document.body.style.overflow="hidden";
}
function closeModal(){document.getElementById("modal").classList.remove("open");document.body.style.overflow="";}
function addMenu(){
  openModal("Add Something",`<div class="add-grid">
    ${["task","event","quest","workout","meal","weight","income","expense","skill","goal"].map(x=>`<button data-add="${x}">${x.replace(/\b\w/g,m=>m.toUpperCase())}</button>`).join("")}
  </div>`);
}
function openAdd(type){
  if(type==="quest"||type==="task"){
    openModal("Create Quest",`<form id="questForm">
      <div class="field"><label>Name</label><input name="name" required></div>
      <div class="form-grid"><div class="field"><label>Category</label><select name="category"><option>Personal</option><option>School</option><option>Music</option><option>Business</option><option>Fitness</option><option>Learning</option></select></div>
      <div class="field"><label>Type</label><select name="type"><option>Custom</option><option>Boss</option><option>Event</option><option>Deadline</option></select></div></div>
      <div class="form-grid"><div class="field"><label>Difficulty</label><select name="difficulty"><option>Easy</option><option selected>Normal</option><option>Challenging</option><option>Hard</option><option>Very Hard</option><option>Elite</option></select></div>
      <div class="field"><label>Primary Stat</label><select name="stat">${Object.keys(data.stats).map(s=>`<option value="${s}">${s}</option>`).join("")}</select></div></div>
      <div class="field"><label>Date / Deadline</label><input name="date" type="date"></div><div class="field"><label>Notes</label><textarea name="notes"></textarea></div>
      <button class="primary-btn" type="submit">Create Quest</button></form>`);
  } else if(type==="event"){
    openModal("Add Event",`<form id="eventForm"><div class="field"><label>Name</label><input name="name" required></div><div class="form-grid"><div class="field"><label>Date</label><input name="date" type="date" required></div><div class="field"><label>Time</label><input name="time" type="time"></div></div><div class="field"><label>Category</label><input name="category" value="Personal"></div><div class="field"><label>Notes</label><textarea name="notes"></textarea></div><button class="primary-btn">Add Event</button></form>`);
  } else if(type==="workout"){
    openModal("Log Workout",`<form id="workoutForm"><div class="field"><label>Workout</label><input name="name" placeholder="Upper Body, Run, Mobility..." required></div><div class="form-grid"><div class="field"><label>Minutes</label><input name="minutes" type="number" min="1" value="30"></div><div class="field"><label>Difficulty</label><select name="difficulty"><option>Easy</option><option selected>Normal</option><option>Hard</option></select></div></div><div class="field"><label>Notes</label><textarea name="notes"></textarea></div><button class="primary-btn">Complete Workout</button></form>`);
  } else if(type==="meal"){
    openModal("Log Meal",`<form id="mealForm"><div class="field"><label>Meal</label><input name="name" required></div><div class="form-grid"><div class="field"><label>Protein (g)</label><input name="protein" type="number" min="0"></div><div class="field"><label>Calories (optional)</label><input name="calories" type="number" min="0"></div></div><button class="primary-btn">Log Meal</button></form>`);
  } else if(type==="weight"){
    openModal("Log Weight",`<form id="weightForm"><div class="field"><label>Weight (lb)</label><input name="weight" type="number" step=".1" value="${data.body.weight}" required></div><button class="primary-btn">Save Weight</button></form>`);
  } else if(type==="income"||type==="expense"){
    openModal(type==="income"?"Log Income":"Log Expense",`<form id="moneyForm" data-kind="${type}"><div class="field"><label>Description</label><input name="name" required></div><div class="form-grid"><div class="field"><label>Amount</label><input name="amount" type="number" step=".01" required></div><div class="field"><label>Account</label><select name="account">${data.finance.accounts.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join("")}</select></div></div>${type==="income"?`<div class="field"><label><input style="width:auto" type="checkbox" name="skillIncome"> Income from a learned skill / project</label></div>`:""}<button class="primary-btn">Save</button></form>`);
  } else if(type==="skill"){
    openModal("Log Skill Practice",`<div class="list-stack">${Object.values(data.skills).filter(s=>s.state!=="Locked").map(s=>`<button class="list-card" data-practice-skill="${s.id}"><strong>${esc(s.name)}</strong><p class="meta">${esc(s.branch)} · ${s.state}</p></button>`).join("")}</div>`);
  } else if(type==="goal"){
    openModal("Add Goal",`<form id="goalForm"><div class="field"><label>Goal</label><input name="name" required></div><div class="field"><label>Type</label><select name="type"><option value="milestone">Milestone</option><option value="numeric">Numeric</option></select></div><div class="field"><label>Target (for numeric goals)</label><input name="target" type="number"></div><button class="primary-btn">Add Goal</button></form>`);
  }
}

function openModule(name){
  if(name==="calendar")renderCalendarModal();
  if(name==="fitness")renderFitnessModal();
  if(name==="nutrition")renderNutritionModal();
  if(name==="finance")renderFinanceModal();
  if(name==="rewards")renderRewardsModal();
  if(name==="profile")renderProfileModal();
  if(name==="settings")renderSettingsModal();
}
function renderCalendarModal(){
  const classes=Object.entries(schedule).flatMap(([day,arr])=>arr.map(x=>({...x,day:Number(day)})));
  openModal("Calendar",`<button class="small-btn" data-add="event">+ Event</button><div class="list-stack" style="margin-top:12px"><div class="list-card"><strong>Recurring Classes</strong>${classes.map(c=>`<p class="meta">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][c.day]} · ${c.start} · ${esc(c.name)}</p>`).join("")}</div>${data.calendarEvents.map(e=>`<div class="list-card"><strong>${esc(e.name)}</strong><p class="meta">${e.date} · ${e.time||"All Day"} · ${esc(e.category||"Event")}</p></div>`).join("")}</div>`,"CALENDAR");
}
function renderFitnessModal(){
  const hist=data.body.history.slice(-8).reverse();
  openModal("Fitness & Body",`<div class="quick-grid"><div class="quick-card"><span class="quick-label">HEIGHT</span><strong class="quick-value">${data.body.heightFeet}'${data.body.heightInches}"</strong></div><div class="quick-card"><span class="quick-label">WEIGHT</span><strong class="quick-value">${data.body.weight.toFixed(1)} lb</strong></div></div><div class="card-actions"><button class="primary-btn" data-add="workout">Log Workout</button><button class="secondary-btn" data-add="weight">Log Weight</button></div><div class="list-stack" style="margin-top:14px"><div class="list-card"><strong>Goal</strong><p class="meta">${esc(data.body.goal)}</p></div>${data.workouts.slice(-10).reverse().map(w=>`<div class="list-card"><strong>${esc(w.name)}</strong><p class="meta">${w.date} · ${w.minutes} min · ${w.difficulty}</p></div>`).join("")}${hist.map(h=>`<div class="list-card"><strong>${h.weight} lb</strong><p class="meta">${h.date}</p></div>`).join("")}</div>`,"FITNESS");
}
function renderNutritionModal(){
  const p=Math.min(100,data.nutrition.protein/data.nutrition.proteinTarget*100),w=Math.min(100,data.nutrition.water/data.nutrition.waterTarget*100);
  openModal("Nutrition",`<div class="list-card"><div class="row-between"><strong>Protein</strong><span>${data.nutrition.protein}/${data.nutrition.proteinTarget}g</span></div><div class="mini-progress"><div class="mini-progress-fill" style="width:${p}%"></div></div></div><div class="list-card"><div class="row-between"><strong>Water</strong><span>${data.nutrition.water}/${data.nutrition.waterTarget}oz</span></div><div class="mini-progress"><div class="mini-progress-fill" style="width:${w}%"></div></div><div class="card-actions"><button class="secondary-btn" data-add-water="16">+16oz</button><button class="secondary-btn" data-add-water="24">+24oz</button></div></div><div class="card-actions"><button class="primary-btn" data-add="meal">Log Meal</button></div><div class="list-stack" style="margin-top:14px">${data.nutrition.meals.map(m=>`<div class="list-card"><strong>${esc(m.name)}</strong><p class="meta">${m.protein||0}g protein${m.calories?` · ${m.calories} cal`:""}</p></div>`).join("")}</div><div class="list-card" style="margin-top:12px"><strong>SHADE Suggestion</strong><p class="meta">${nutritionSuggestion()}</p></div>`,"NUTRITION");
}
function nutritionSuggestion(){
  const remaining=Math.max(0,data.nutrition.proteinTarget-data.nutrition.protein);
  if(remaining>50)return`Prioritize a protein-heavy meal next. About ${remaining}g remain today.`;
  if(remaining>20)return`A balanced meal with 25–35g protein would fit well now.`;
  return`Protein target is close. Focus on hydration and a balanced final meal.`;
}
function renderFinanceModal(){
  const avail=availableMoney();
  openModal("Finances",`<div class="quick-grid"><div class="quick-card"><span class="quick-label">AVAILABLE</span><strong class="quick-value">${money(avail)}</strong></div><div class="quick-card"><span class="quick-label">NET FLOW</span><strong class="quick-value">${money(incomeTotal()-expenseTotal())}</strong></div></div><div class="card-actions"><button class="primary-btn" data-add="income">+ Income</button><button class="secondary-btn" data-add="expense">+ Expense</button></div><div class="list-stack" style="margin-top:14px">${data.finance.accounts.map(a=>`<div class="list-card"><div class="row-between"><strong>${esc(a.name)}</strong><span>${money(a.balance)}</span></div></div>`).join("")}${data.finance.transactions.slice(-15).reverse().map(t=>`<div class="list-card"><div class="row-between"><strong>${esc(t.name)}</strong><span>${t.type==="income"?"+":"-"}${money(t.amount)}</span></div><p class="meta">${t.date}${t.skillIncome?" · Skill Income":""}</p></div>`).join("")}</div>`,"FINANCES");
}
function renderRewardsModal(){
  const avail=availableMoney();
  openModal("Rewards & Inventory",`<div class="list-card"><div class="row-between"><strong>System Coins</strong><span>◈ ${data.player.coins}</span></div><p class="meta">Coins cannot buy stats, rank, or mastery.</p></div><div class="list-stack" style="margin-top:12px">${data.rewards.real.map(r=>{const okCoins=data.player.coins>=r.coins,okMoney=avail-r.cost>=data.finance.savingsFloor;return`<div class="list-card"><div class="row-between"><strong>${esc(r.name)}</strong><span>◈ ${r.coins}</span></div><p class="meta">Real cost: ${money(r.cost)} · ${okCoins&&okMoney?"Available":!okCoins?"Need more coins":"Financial condition locked"}</p><div class="card-actions"><button class="primary-btn" data-buy-reward="${r.id}" ${okCoins&&okMoney?"":"disabled"}>Redeem</button></div></div>`}).join("")}</div><div class="list-card" style="margin-top:12px"><strong>Inventory</strong><p class="meta">Recovery Tokens: ${data.inventory.consumables.recoveryToken} · Streak Shields: ${data.inventory.consumables.streakShield} · Quest Rerolls: ${data.inventory.consumables.questReroll}</p></div>`,"REWARDS");
}
function renderProfileModal(){
  openModal("Player Profile",`<div class="quick-grid"><div class="quick-card"><span class="quick-label">LEVEL</span><strong class="quick-value">${data.player.level}</strong></div><div class="quick-card"><span class="quick-label">RANK</span><strong class="quick-value">${data.player.rank}</strong></div></div><div class="list-card" style="margin-top:12px"><strong>Body</strong><p class="meta">${data.body.heightFeet}'${data.body.heightInches}" · ${data.body.weight.toFixed(1)} lb · ${data.body.goal}</p></div><div class="list-card"><strong>Title</strong><p class="meta">${esc(data.equippedTitle)}</p></div><div class="list-card"><strong>Achievements</strong><p class="meta">${data.achievements.length} unlocked</p>${data.achievements.map(a=>`<span class="tag rarity-${a.rarity.toLowerCase()}">${esc(a.name)}</span>`).join(" ")}</div>`,"PLAYER");
}
function renderSettingsModal(){
  openModal("Settings",`<div class="list-card"><div class="row-between"><strong>Integrity Protocol</strong><span>${data.settings.integrity?"Active":"Reduced"}</span></div><p class="meta">Core XP validation and anti-farming rules stay active.</p></div><div class="list-card"><strong>Data</strong><p class="meta">All V1 data is stored locally in this browser.</p><div class="card-actions"><button class="secondary-btn" id="exportDataBtn">Export Save</button><button class="danger-btn" id="resetDataBtn">Reset System</button></div></div>`,"SETTINGS");
}
function redeemReward(id){
  const r=data.rewards.real.find(x=>x.id===id);if(!r)return;
  const avail=availableMoney();if(data.player.coins<r.coins||avail-r.cost<data.finance.savingsFloor){toast("REWARD LOCKED · Financial or coin requirement not met.");return;}
  data.player.coins-=r.coins;data.timeline.unshift({date:todayKey(),text:`Reward redeemed: ${r.name}`});save();renderRewardsModal();renderAll();toast(`REWARD REDEEMED · ${r.name}`);
}

function handleForms(e){
  if(e.target.id==="questForm"){e.preventDefault();const f=new FormData(e.target);data.customQuests.unshift({id:uid("q"),name:f.get("name"),category:f.get("category"),type:f.get("type"),difficulty:f.get("difficulty"),stat:f.get("stat"),date:f.get("date"),notes:f.get("notes"),completed:false});save();closeModal();renderQuestTab("custom");toast("QUEST ADDED");}
  if(e.target.id==="eventForm"){e.preventDefault();const f=new FormData(e.target);data.calendarEvents.push({id:uid("e"),name:f.get("name"),date:f.get("date"),time:f.get("time"),category:f.get("category"),notes:f.get("notes")});save();closeModal();renderAll();toast("EVENT ADDED");}
  if(e.target.id==="workoutForm"){e.preventDefault();const f=new FormData(e.target);const mins=Number(f.get("minutes")||30);data.workouts.push({id:uid("w"),name:f.get("name"),minutes:mins,difficulty:f.get("difficulty"),notes:f.get("notes"),date:todayKey()});data.legacy.workouts++;addXP(f.get("difficulty")==="Hard"?40:25);addStat("strength",15);addStat("endurance",10);addStat("discipline",5);progressWeekly("Consistency Protocol");save();closeModal();renderAll();toast("WORKOUT LOGGED");}
  if(e.target.id==="mealForm"){e.preventDefault();const f=new FormData(e.target),p=Number(f.get("protein")||0);data.nutrition.meals.push({name:f.get("name"),protein:p,calories:Number(f.get("calories")||0)});data.nutrition.protein+=p;addStat("discipline",2);save();closeModal();renderAll();toast("MEAL LOGGED");}
  if(e.target.id==="weightForm"){e.preventDefault();const f=new FormData(e.target),w=Number(f.get("weight"));data.body.weight=w;data.body.history.push({date:todayKey(),weight:w});save();closeModal();renderAll();toast("WEIGHT UPDATED");}
  if(e.target.id==="moneyForm"){e.preventDefault();const f=new FormData(e.target),kind=e.target.dataset.kind,amount=Number(f.get("amount")),acc=data.finance.accounts.find(a=>a.id===f.get("account"));if(acc)acc.balance+=kind==="income"?amount:-amount;data.finance.transactions.push({id:uid("tx"),name:f.get("name"),amount,type:kind,date:todayKey(),skillIncome:!!f.get("skillIncome")});if(kind==="income"&&f.get("skillIncome")){data.legacy.skillIncome+=amount;}save();closeModal();renderAll();toast(kind==="income"?"INCOME LOGGED":"EXPENSE LOGGED");}
  if(e.target.id==="goalForm"){e.preventDefault();const f=new FormData(e.target);data.goals.push({id:uid("g"),name:f.get("name"),type:f.get("type"),current:0,target:Number(f.get("target")||0),status:"Active"});save();closeModal();renderJourneyTab("goals");toast("GOAL ADDED");}
}
function renderAll(){
  data.player.rank=rankFor(data.player.level);checkCompanionStage();initAchievements();renderHome();renderSkills();renderJourneyTab(activeJourneyTab);renderShadeTab(activeShadeTab);if(currentPage==="quests")renderQuestTab(activeQuestTab);save();
}
let currentPage="home",activeQuestTab="daily",activeJourneyTab="goals",activeShadeTab="overview";
function updateAddButton(page){
  const btn=document.getElementById("addButton");
  if(!btn)return;
  const hide=page==="shade";
  btn.classList.toggle("is-hidden",hide);
  btn.setAttribute("aria-hidden",hide?"true":"false");
}

function go(page){
  currentPage=page;document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.dataset.page===page));document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.go===page));window.scrollTo({top:0,behavior:"smooth"});
  updateAddButton(page);
  if(page==="quests")renderQuestTab(activeQuestTab);if(page==="skills")renderSkills();if(page==="journey")renderJourneyTab(activeJourneyTab);if(page==="shade")renderShadeTab(activeShadeTab);
}
document.addEventListener("click",e=>{
  const goBtn=e.target.closest("[data-go]");if(goBtn){go(goBtn.dataset.go);return;}
  if(e.target.closest("#addButton")){addMenu();return;}
  const add=e.target.closest("[data-add]");if(add){openAdd(add.dataset.add);return;}
  if(e.target.closest("[data-close-modal]")){closeModal();return;}
  const open=e.target.closest("[data-open]");if(open){openModule(open.dataset.open);return;}
  const q=e.target.closest("[data-complete-daily]");if(q){completeDaily(q.dataset.completeDaily);return;}
  const cc=e.target.closest("[data-complete-custom]");if(cc){completeCustom(cc.dataset.completeCustom);return;}
  const del=e.target.closest("[data-delete-custom]");if(del){data.customQuests=data.customQuests.filter(x=>x.id!==del.dataset.deleteCustom);save();renderQuestTab("custom");return;}
  const db=e.target.closest("[data-damage-boss]");if(db){damageBoss(db.dataset.damageBoss);return;}
  if(e.target.closest("[data-generate-dungeon]")){generateDungeon();return;}
  const pd=e.target.closest("[data-progress-dungeon]");if(pd){progressDungeon(pd.dataset.progressDungeon);return;}
  const ps=e.target.closest("[data-practice-skill]");if(ps){practiceSkill(ps.dataset.practiceSkill);closeModal();return;}
  const aw=e.target.closest("[data-add-water]");if(aw){data.nutrition.water+=Number(aw.dataset.addWater);save();renderNutritionModal();renderAll();return;}
  const br=e.target.closest("[data-buy-reward]");if(br){redeemReward(br.dataset.buyReward);return;}
  const tab=e.target.closest(".tab");if(tab){
    tab.parentElement.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));tab.classList.add("active");
    const group=tab.parentElement.dataset.tabs,val=tab.dataset.tab;
    if(group==="questTabs"){activeQuestTab=val;renderQuestTab(val);}
    if(group==="journeyTabs"){activeJourneyTab=val;renderJourneyTab(val);}
    if(group==="shadeTabs"){activeShadeTab=val;renderShadeTab(val);}
    return;
  }
  if(e.target.id==="exportDataBtn"){
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`spade-system-save-${todayKey()}.json`;a.click();URL.revokeObjectURL(a.href);return;
  }
  if(e.target.id==="resetDataBtn"){if(confirm("Reset all SPADE SYSTEM data?")){localStorage.removeItem(STORAGE_KEY);location.reload();}}
});
document.addEventListener("submit",handleForms);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
document.getElementById("focusButton").addEventListener("click",()=>{
  const arr=["Balanced","School","Fitness","Music","Business","Skills","Personal"];data.daily.focus=arr[(arr.indexOf(data.daily.focus)+1)%arr.length];save();renderAll();
});

function initialize(){
  initSkills();initDaily();initWeekly();initNutrition();data.player.requiredXP=requiredXP(data.player.level);data.player.rank=rankFor(data.player.level);renderAll();console.log("♠ SPADE SYSTEM ONLINE",data);
}
initialize();
