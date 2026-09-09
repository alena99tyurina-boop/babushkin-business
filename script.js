let ysdk = null;
let yandexSdkReady = false;
let adIsOpen = false;
let wasPausedBeforeAd = false;
let wasMusicEnabledBeforeAd = false;
let adPauseStateSaved = false;
let gameFullyLoaded = false;
const SAVE_KEY="babushkin_business_stable_v03";
const STAGES=[
["kitchen","🏠 Кухня",0,0,"kitchen.png","8%"],
["stall","🥟 Ларёк",800,8,"stall.png","29%"],
["cafe","☕ Кафе",8000,35,"cafe.png","50%"],
["restaurant","🍽 Ресторан",75000,140,"restaurant.png","71%"],
["empire","🏰 Империя пирожков",700000,420,"empire.png","92%"]
].map(s=>({
    id:s[0],
    title:s[1],
    minMoney:s[2],
    minRep:s[3],
    background:s[4],
    roadPos:s[5]
}));
const UPGRADES=[
    {
        id:"oven",
        icon:"🔥",
        title:"Новая духовка",
        desc:"+1 ₽ к цене пирожка",
        price:50,
        grow:1.7,
        clickBonus:1,
        autoBonus:0,
        stage:"kitchen"
    },
    {
        id:"recipe",
        icon:"📖",
        title:"Секрет теста",
        desc:"+3 ₽ к цене пирожка",
        price:150,
        grow:1.7,
        clickBonus:3,
        autoBonus:0,
        stage:"kitchen"
    },
    {
        id:"butter",
        icon:"🧈",
        title:"Масло для теста",
        desc:"+2 ₽ к цене пирожка",
        price:250,
        grow:1.7,
        clickBonus:2,
        autoBonus:0,
        stage:"kitchen"
    },
    {
        id:"bowl",
        icon:"🥣",
        title:"Большая миска",
        desc:"+4 ₽ к цене пирожка",
        price:500,
        grow:1.75,
        clickBonus:4,
        autoBonus:0,
        stage:"kitchen"
    },
    {
        id:"rolling_pin",
        icon:"🪵",
        title:"Деревянная скалка",
        desc:"+6 ₽ к цене пирожка",
        price:900,
        grow:1.75,
        clickBonus:6,
        autoBonus:0,
        stage:"stall"
    },
    {
        id:"trays",
        icon:"🍳",
        title:"Новые противни",
        desc:"+8 ₽ за клик",
        price:1600,
        grow:1.8,
        clickBonus:8,
        autoBonus:0,
        stage:"stall"
    },
    {
        id:"signboard",
        icon:"🏪",
        title:"Красивая вывеска",
        desc:"+5 ₽ к цене пирожка",
        price:2500,
        grow:1.8,
        clickBonus:0,
        autoBonus:5,
        stage:"stall"
    },
    {
        id:"boxes",
        icon:"📦",
        title:"Упаковка для пирожков",
        desc:"+12 ₽ к цене пирожка",
        price:5000,
        grow:1.85,
        clickBonus:12,
        autoBonus:0,
        stage:"cafe"
    },
    {
        id:"cashbox",
        icon:"💳",
        title:"Касса",
        desc:"+15 ₽ к цене пирожка",
        price:9000,
        grow:1.85,
        clickBonus:0,
        autoBonus:15,
        stage:"cafe"
    },
    {
        id:"big_oven",
        icon:"🏭",
        title:"Производственная печь",
        desc:"+30 ₽ к цене пирожка",
        price:30000,
        grow:1.9,
        clickBonus:30,
        autoBonus:0,
        stage:"restaurant"
    },
    {
        id:"brand",
        icon:"🌟",
        title:"Бренд Бабы Гали",
        desc:"+50 ₽ к цене пирожка",
        price:75000,
        grow:1.95,
        clickBonus:0,
        autoBonus:50,
        premium:true,
        stage:"restaurant"
    },
    {
        id:"franchise",
        icon:"👑",
        title:"Франшиза Бабы Гали",
        desc:"+100 ₽ к цене пирожка",
        price:100000,
        grow:1.8,
        clickBonus:0,
        autoBonus:100,
        premium:true,
        stage:"empire"
    }
];
const RECIPES = [
    {
        id:"potato_pie",
        icon:"🥔",
        title:"С картошкой",
        desc:"Домашний простой пирожок. Хороший выбор для старта.",
        stage:"kitchen",
        baseMoneyBonus:1,
        baseRepChance:0.02,
        moneyPerLevel:1,
        repPerLevel:0.005,
        upgradePrice:120,
        grow:1.55,
        maxLevel:10,
        special:"Недорогой и стабильный"
    },
    {
        id:"jam_pie",
        icon:"🍓",
        title:"С вареньем",
        desc:"Сладкий пирожок, который особенно любят дети и соседи.",
        stage:"stall",
        baseMoneyBonus:2,
        baseRepChance:0.08,
        moneyPerLevel:1,
        repPerLevel:0.01,
        upgradePrice:400,
        grow:1.6,
        maxLevel:10,
        special:"Больше репутации"
    },
    {
        id:"meat_pie",
        icon:"🥩",
        title:"С мясом",
        desc:"Сытный пирожок для рабочих, заказов и больших продаж.",
        stage:"cafe",
        baseMoneyBonus:6,
        baseRepChance:0.04,
        moneyPerLevel:2,
        repPerLevel:0.006,
        upgradePrice:1200,
        grow:1.65,
        maxLevel:10,
        special:"Больше денег"
    },
    {
        id:"cheese_pie",
        icon:"🧀",
        title:"С сыром",
        desc:"Ароматный пирожок для постоянных клиентов.",
        stage:"restaurant",
        baseMoneyBonus:10,
        baseRepChance:0.07,
        moneyPerLevel:3,
        repPerLevel:0.008,
        upgradePrice:3500,
        grow:1.7,
        maxLevel:10,
        special:"Деньги и репутация"
    },
    {
        id:"galya_pie",
        icon:"👑",
        title:"Фирменный пирожок",
        desc:"Легендарный рецепт Бабы Гали. О нём говорит весь город.",
        stage:"empire",
        baseMoneyBonus:25,
        baseRepChance:0.12,
        moneyPerLevel:5,
        repPerLevel:0.012,
        upgradePrice:10000,
        grow:1.75,
        maxLevel:10,
        special:"Легендарный рецепт"
    }
];
const HELPERS = [
    {
        id:"grandson",
        icon:"👦",
        title:"Внук-помощник",
        role:"Печёт пирожки",
        desc:"Помогает Бабе Гале лепить пирожки на кухне.",
        effect:"production",
        effectText:"+3 к автоготовке за уровень",
        stage:"kitchen",
        price:500,
        grow:1.55,
        income:3,
        maxLevel:10
    },
    {
        id:"advertiser",
        icon:"📢",
        title:"Рекламщик",
        role:"Ускоряет продажи",
        desc:"Рассказывает всему городу о пирожках Бабы Гали.",
        effect:"sales",
        effectText:"+3% к скорости продаж за уровень",
        stage:"stall",
        price:1000,
        grow:1.6,
        income:3,
        maxLevel:10
    },
    {
        id:"assistant",
        icon:"👩‍🍳",
        title:"Помощница",
        role:"Быстро печёт пирожки",
        desc:"Помогает готовить тесто, начинку и следить за духовкой.",
        effect:"production",
        effectText:"+8 к автоготовке за уровень",
        stage:"cafe",
        price:4500,
        grow:1.65,
        income:8,
        maxLevel:3
    },
    {
        id:"courier",
        icon:"🚚",
        title:"Курьер",
        role:"Улучшает заказы",
        desc:"Быстро развозит пирожки клиентам, поэтому заказы приносят больше денег.",
        effect:"orders",
        effectText:"+5% к деньгам за заказы за уровень",
        stage:"restaurant",
        price:8000,
        grow:1.7,
        income:5,
        maxLevel:5
    },
    {
        id:"manager",
        icon:"🧑‍💼",
        title:"Управляющая",
        role:"Повышает цену пирожков",
        desc:"Следит за бизнесом, ценами, заказами и работой команды.",
        effect:"price",
        effectText:"+1 ₽ к цене пирожка за уровень",
        stage:"empire",
        price:30000,
        grow:1.8,
        income:1,
        maxLevel:5
    },
    {
        id:"cat_courier",
        icon:"🐈🚚",
        title:"Кот-доставщик",
        role:"Печёт и продаёт",
        desc:"Бывший воришка стал помощником и теперь приносит пользу бизнесу.",
        effect:"mixed",
        effectText:"+5 к автоготовке и +5% к продажам",
        stage:"kitchen",
        price:0,
        grow:1,
        income:5,
        maxLevel:1,
        catRequired:50
    }
];
const game={
    money:0,
    pies:0,
    salesBuffer:0,
    productionBuffer:0,
    reputation:0,
    clickIncome:1,
    autoIncome:0,
    stage:"kitchen",
maxStage:"kitchen",
dayTime:"morning",
dayTimeStarted:Date.now(),
    upgrades:{},
    achievements:[],
    catActive:false,
catsCaught:0,
    questRewardClaimed:false,
activeQuests:[],
currentOrder:null,
ordersCompleted:0,
orderDeadline:0,
orderTimeLimit:0,
currentRecipe:"potato_pie",
recipeLevels:{},
newspaper:[],
helpers:{},
vipActive:false,
currentVIP:null,
vipOrdersCompleted:0,
finalGoalShown:false,
tutorialStep:0,
tutorialDone:false,
musicEnabled:false,
soundEnabled:true,
musicVolume:25,
effectsVolume:60,
paused:false,
dailyTasks:[],
dailyTasksDate:"",
dailyTasksProgress:{},
dailyTasksClaimed:[],
};
const UI={};

let pendingCatReward = null;
let pendingVipAdHelp = null;
const ACH = [

    // 🟢 ПРОСТЫЕ ДОСТИЖЕНИЯ
    {
        id:"first_pie",
        icon:"🥟",
        title:"Первый пирожок",
        desc:"Испеки первый пирожок.",
        level:"🟢 Простое",
        condition:()=>game.pies >= 1
    },
    {
        id:"ten_pies",
        icon:"🥟",
        title:"Первые 10 пирожков",
        desc:"Испеки 10 пирожков.",
        level:"🟢 Простое",
        condition:()=>game.pies >= 10
    },
    {
        id:"first_money",
        icon:"💰",
        title:"Первые деньги",
        desc:"Заработай 100 ₽.",
        level:"🟢 Простое",
        condition:()=>game.money >= 100
    },
    {
        id:"first_rep",
        icon:"⭐",
        title:"Первый довольный клиент",
        desc:"Получи 1 репутацию.",
        level:"🟢 Простое",
        condition:()=>game.reputation >= 1
    },
    {
        id:"first_upgrade",
        icon:"🔥",
        title:"Первая покупка",
        desc:"Купи первое улучшение.",
        level:"🟢 Простое",
        condition:()=>getTotalUpgradeLevels() >= 1
    },

    // 🔵 СРЕДНИЕ ДОСТИЖЕНИЯ
    {
        id:"hundred_pies",
        icon:"🥟",
        title:"100 пирожков",
        desc:"Испеки 100 пирожков.",
        level:"🔵 Среднее",
        condition:()=>game.pies >= 100
    },
    {
        id:"five_hundred_pies",
        icon:"🥟",
        title:"500 пирожков",
        desc:"Испеки 500 пирожков.",
        level:"🔵 Среднее",
        condition:()=>game.pies >= 500
    },
    {
        id:"money_1000",
        icon:"💰",
        title:"Первые 1000 ₽",
        desc:"Заработай 1000 ₽.",
        level:"🔵 Среднее",
        condition:()=>game.money >= 1000
    },
    {
        id:"rep_10",
        icon:"⭐",
        title:"Любимица соседей",
        desc:"Получи 10 очков репутации.",
        level:"🔵 Среднее",
        condition:()=>game.reputation >= 10
    },
    {
        id:"first_cat",
        icon:"🐈",
        title:"Первый пойманный кот",
        desc:"Поймай кота 1 раз.",
        level:"🔵 Среднее",
        condition:()=>game.catsCaught >= 1
    },
    {
        id:"first_order",
        icon:"🧺",
        title:"Первый заказ",
        desc:"Выполни первый заказ жителя.",
        level:"🔵 Среднее",
        condition:()=>game.ordersCompleted >= 1
    },
    {
        id:"open_stall",
        icon:"🥟",
        title:"Открыт ларёк",
        desc:"Открой этап Ларёк.",
        level:"🔵 Среднее",
        condition:()=>stageIndex(game.maxStage || game.stage) >= 1
    },

    // 🟣 СЛОЖНЫЕ ДОСТИЖЕНИЯ
    {
        id:"pies_1000",
        icon:"🥟",
        title:"1000 пирожков",
        desc:"Испеки 1000 пирожков.",
        level:"🟣 Сложное",
        condition:()=>game.pies >= 1000
    },
    {
        id:"money_10000",
        icon:"💰",
        title:"Кошелёк Бабы Гали",
        desc:"Заработай 10000 ₽.",
        level:"🟣 Сложное",
        condition:()=>game.money >= 10000
    },
    {
        id:"rep_50",
        icon:"⭐",
        title:"Городская слава",
        desc:"Получи 50 очков репутации.",
        level:"🟣 Сложное",
        condition:()=>game.reputation >= 50
    },
    {
        id:"cats_10",
        icon:"🐾",
        title:"10 пойманных котов",
        desc:"Поймай кота 10 раз.",
        level:"🟣 Сложное",
        condition:()=>game.catsCaught >= 10
    },
    {
        id:"orders_10",
        icon:"🧺",
        title:"Надёжная пекарня",
        desc:"Выполни 10 заказов.",
        level:"🟣 Сложное",
        condition:()=>game.ordersCompleted >= 10
    },
    {
        id:"open_cafe",
        icon:"☕",
        title:"Открыто кафе",
        desc:"Открой этап Кафе.",
        level:"🟣 Сложное",
        condition:()=>stageIndex(game.maxStage || game.stage) >= 2
    },
    {
        id:"recipe_jam",
        icon:"🍓",
        title:"Сладкая выпечка",
        desc:"Открой рецепт с вареньем.",
        level:"🟣 Сложное",
        condition:()=>stageIndex(game.maxStage || game.stage) >= stageIndex("stall")
    },

    // 🟠 ОЧЕНЬ СЛОЖНЫЕ ДОСТИЖЕНИЯ
    {
        id:"pies_10000",
        icon:"🥟",
        title:"10 000 пирожков",
        desc:"Испеки 10 000 пирожков.",
        level:"🟠 Очень сложное",
        condition:()=>game.pies >= 10000
    },
    {
        id:"money_100000",
        icon:"💰",
        title:"Бабушкин капитал",
        desc:"Заработай 100 000 ₽.",
        level:"🟠 Очень сложное",
        condition:()=>game.money >= 100000
    },
    {
        id:"rep_150",
        icon:"⭐",
        title:"Легенда района",
        desc:"Получи 150 очков репутации.",
        level:"🟠 Очень сложное",
        condition:()=>game.reputation >= 150
    },
    {
        id:"cats_30",
        icon:"🐈",
        title:"Кот почти свой",
        desc:"Поймай кота 30 раз.",
        level:"🟠 Очень сложное",
        condition:()=>game.catsCaught >= 30
    },
    {
        id:"orders_50",
        icon:"🧺",
        title:"Главная пекарня города",
        desc:"Выполни 50 заказов.",
        level:"🟠 Очень сложное",
        condition:()=>game.ordersCompleted >= 50
    },
    {
        id:"open_restaurant",
        icon:"🍽",
        title:"Открыт ресторан",
        desc:"Открой этап Ресторан.",
        level:"🟠 Очень сложное",
        condition:()=>stageIndex(game.maxStage || game.stage) >= 3
    },
    {
        id:"all_recipes",
        icon:"📖",
        title:"Книга рецептов",
        desc:"Открой все рецепты пирожков.",
        level:"🟠 Очень сложное",
        condition:()=>stageIndex(game.maxStage || game.stage) >= stageIndex("restaurant")
    },

    // 🔴 ПОЧТИ НЕВЫПОЛНИМЫЕ ДОСТИЖЕНИЯ
    {
        id:"pies_100000",
        icon:"🥟",
        title:"100 000 пирожков",
        desc:"Испеки 100 000 пирожков.",
        level:"🔴 Почти невыполнимое",
        condition:()=>game.pies >= 100000
    },
    {
        id:"money_1000000",
        icon:"💰",
        title:"Пирожковый миллионер",
        desc:"Заработай 1 000 000 ₽.",
        level:"🔴 Почти невыполнимое",
        condition:()=>game.money >= 1000000
    },
    {
        id:"rep_500",
        icon:"⭐",
        title:"Имя на весь город",
        desc:"Получи 500 очков репутации.",
        level:"🔴 Почти невыполнимое",
        condition:()=>game.reputation >= 500
    },
    {
    id:"cats_50",
    icon:"🐈🚚",
    title:"Кот-доставщик",
    desc:"Поймай кота 50 раз, чтобы он стал доставщиком.",
    level:"🔴 Почти невыполнимое",
    condition:()=>game.catsCaught >= 50
},
    {
        id:"orders_100",
        icon:"🧺",
        title:"100 выполненных заказов",
        desc:"Выполни 100 заказов жителей.",
        level:"🔴 Почти невыполнимое",
        condition:()=>game.ordersCompleted >= 100
    },
    {
        id:"all_upgrades_50",
        icon:"🛒",
        title:"Магазин скуплен",
        desc:"Купи 50 уровней улучшений суммарно.",
        level:"🔴 Почти невыполнимое",
        condition:()=>getTotalUpgradeLevels() >= 50
    },
    {
        id:"empire",
        icon:"🏰",
        title:"Империя пирожков",
        desc:"Открой этап Империя.",
        level:"🔴 Почти невыполнимое",
        condition:()=>stageIndex(game.maxStage || game.stage) >= 4
    },
    {
        id:"true_legend",
        icon:"👵",
        title:"Легенда Бабы Гали",
        desc:"Собери 1 000 000 ₽, 500 очков репутации и испеки 100 000 пирожков.",
        level:"🔴 Почти невыполнимое",
        condition:()=>game.money >= 1000000 && game.reputation >= 500 && game.pies >= 100000
    },
{
    id:"galya_recipe",
    icon:"👑",
    title:"Фирменный рецепт",
    desc:"Открой фирменный пирожок Бабы Гали.",
    level:"🔴 Почти невыполнимое",
    condition:()=>stageIndex(game.maxStage || game.stage) >= stageIndex("empire")
}
];
const EVENTS = [

    // 🟢 ХОРОШИЕ СОБЫТИЯ
    {
        id:"neighbor_praise",
        type:"good",
        title:"👵 Соседка похвалила пирожки",
        text:"Соседка рассказала всем во дворе о пирожках Бабы Гали.",
        minStage:"kitchen",
        chance:30,
        effect:()=>{
            game.reputation += 1;
        }
    },
    {
        id:"tea_party",
        type:"good",
        title:"☕ Чаепитие во дворе",
        text:"Жители устроили чаепитие и купили пирожки.",
        minStage:"kitchen",
        chance:25,
        effect:()=>{
            game.money += 200;
        }
    },
    {
        id:"fresh_smell",
        type:"good",
        title:"🥟 Аромат свежих пирожков",
        text:"Запах выпечки привлёк новых покупателей.",
        minStage:"kitchen",
        chance:25,
        effect:()=>{
            game.pies += 10;
            game.reputation += 1;
        }
    },

    // 🔵 СОБЫТИЯ С ЛАРЬКА
    {
        id:"market_day",
        type:"good",
        title:"🎪 Рыночный день",
        text:"На рынке сегодня много покупателей.",
        minStage:"stall",
        chance:25,
        effect:()=>{
            game.money += 500;
            game.reputation += 2;
        }
    },
    {
        id:"school_children",
        type:"good",
        title:"👧 Дети после школы",
        text:"Школьники купили сладкие пирожки после уроков.",
        minStage:"stall",
        chance:22,
        effect:()=>{
            game.money += 700;
        }
    },

    // 🟣 СОБЫТИЯ С КАФЕ
    {
        id:"blogger_review",
        type:"good",
        title:"📱 Блогер снял обзор",
        text:"Блогер похвалил кафе Бабы Гали в соцсетях.",
        minStage:"cafe",
        chance:18,
        effect:()=>{
            game.reputation += 5;
            game.money += 1200;
        }
    },
    {
        id:"office_lunch",
        type:"good",
        title:"🏢 Обеденный перерыв",
        text:"Сотрудники офиса зашли за горячими пирожками.",
        minStage:"cafe",
        chance:20,
        effect:()=>{
            game.money += 1600;
        }
    },

    // 🟠 СОБЫТИЯ С РЕСТОРАНА
    {
        id:"food_festival",
        type:"rare",
        title:"🍽 Фестиваль еды",
        text:"Ресторан Бабы Гали пригласили на городской фестиваль.",
        minStage:"restaurant",
        chance:12,
        effect:()=>{
            game.money += 6000;
            game.reputation += 10;
        }
    },
    {
        id:"critic_article",
        type:"rare",
        title:"📰 Статья ресторанного критика",
        text:"Критик написал тёплую статью о пирожках Бабы Гали.",
        minStage:"restaurant",
        chance:10,
        effect:()=>{
            game.reputation += 15;
        }
    },

    // 🔴 ПЛОХИЕ СОБЫТИЯ
    {
        id:"rain",
        type:"bad",
        title:"🌧 Дождь отпугнул клиентов",
        text:"Из-за дождя сегодня меньше покупателей.",
        minStage:"kitchen",
        chance:18,
        effect:()=>{
            game.money = Math.max(0, game.money - 150);
        }
    },
    {
        id:"burnt_pies",
        type:"bad",
        title:"🔥 Подгорели пирожки",
        text:"Часть пирожков подгорела в духовке.",
        minStage:"kitchen",
        chance:16,
        effect:()=>{
            game.pies = Math.max(0, game.pies - 20);
        }
    },
    {
        id:"flour_price",
        type:"bad",
        title:"🌾 Подорожала мука",
        text:"Пришлось срочно купить муку дороже обычного.",
        minStage:"stall",
        chance:14,
        effect:()=>{
            game.money = Math.max(0, game.money - 500);
        }
    },
    {
        id:"tired_workers",
        type:"bad",
        title:"😴 Помощники устали",
        text:"Помощники сегодня работают медленнее, но Баба Галя их подбодрила.",
        minStage:"cafe",
        chance:12,
        effect:()=>{
            game.reputation = Math.max(0, game.reputation - 2);
        }
    },

    // 👑 ЛЕГЕНДАРНЫЕ СОБЫТИЯ
    {
        id:"tv_show",
        type:"legendary",
        title:"📺 Бабу Галю показали по телевизору",
        text:"После сюжета по телевизору о пирожках узнал весь город.",
        minStage:"restaurant",
        chance:6,
        effect:()=>{
            game.money += 10000;
            game.reputation += 20;
        }
    },
    {
        id:"city_loves_galya",
        type:"legendary",
        title:"🏆 Город любит Бабу Галю",
        text:"Жители признали пирожки Бабы Гали символом города.",
        minStage:"empire",
        chance:5,
        effect:()=>{
            game.money += 25000;
            game.reputation += 35;
            game.pies += 50;
        }
    },

    // 🌅 СОБЫТИЯ ПО ВРЕМЕНИ СУТОК
    {
        id:"morning_queue",
        type:"good",
        title:"🌅 Утренняя очередь",
        text:"Утром люди идут за горячими пирожками к завтраку.",
        minStage:"kitchen",
        dayTime:"morning",
        chance:22,
        effect:()=>{
            game.money += 300;
            game.reputation += 1;
        }
    },
    {
        id:"evening_orders",
        type:"good",
        title:"🌆 Вечерние заказы",
        text:"К вечеру жители заказывают пирожки домой.",
        minStage:"stall",
        dayTime:"evening",
        chance:18,
        effect:()=>{
            game.money += 900;
            game.pies += 15;
        }
    },
    {
        id:"night_silence",
        type:"bad",
        title:"🌙 Ночная тишина",
        text:"Ночью покупателей меньше, зато Баба Галя успела подготовиться к утру.",
        minStage:"kitchen",
        dayTime:"night",
        chance:14,
        effect:()=>{
            game.pies += 20;
            game.money = Math.max(0, game.money - 100);
        }
    }
];
const DAILY_TASK_POOL = [
    {
        id:"bake_50",
        icon:"🥟",
        title:"Испечь 50 пирожков",
        type:"pies",
        target:50,
        rewardMoney:200,
        rewardPies:8,
        rewardRep:1
    },
    {
        id:"bake_100",
        icon:"🥟",
        title:"Испечь 100 пирожков",
        type:"pies",
        target:100,
        rewardMoney:450,
        rewardPies:15,
        rewardRep:1
    },
    {
        id:"orders_1",
        icon:"🧺",
        title:"Выполнить 1 заказ",
        type:"orders",
        target:1,
        rewardMoney:300,
        rewardPies:8,
        rewardRep:1
    },
    {
        id:"orders_2",
        icon:"🧺",
        title:"Выполнить 2 заказа",
        type:"orders",
        target:2,
        rewardMoney:700,
        rewardPies:15,
        rewardRep:2
    },
    {
        id:"catch_cat_1",
        icon:"🐈",
        title:"Поймать кота 1 раз",
        type:"cats",
        target:1,
        rewardMoney:350,
        rewardPies:10,
        rewardRep:1
    },
    {
        id:"earn_1000",
        icon:"💰",
        title:"Заработать 1000 ₽",
        type:"money",
        target:1000,
        rewardMoney:350,
        rewardPies:10,
        rewardRep:1
    },
    {
        id:"earn_3000",
        icon:"💰",
        title:"Заработать 3000 ₽",
        type:"money",
        target:3000,
        rewardMoney:900,
        rewardPies:20,
        rewardRep:2
    }
];
const ORDER_POOL = [

    // 🏠 КУХНЯ — простые жители
    {
        id:"neighbor_10",
        stage:"kitchen",
        difficulty:"easy",
        difficultyText:"🟢 Простой",
        person:"👵 Соседка Мария",
        title:"Домашний заказ",
        text:"Внучок приезжает в гости. Нужно 10 горячих пирожков.",
        needPies:10,
        rewardMoney:150,
        rewardRep:1
    },
    {
        id:"grandpa_15",
        stage:"kitchen",
        difficulty:"easy",
        difficultyText:"🟢 Простой",
        person:"👴 Дедушка Николай",
        title:"Заказ к чаю",
        text:"Хочу угостить соседей во дворе. Испеки 15 пирожков.",
        needPies:15,
        rewardMoney:230,
        rewardRep:1
    },
    {
        id:"family_25",
        stage:"kitchen",
        difficulty:"easy",
        difficultyText:"🟢 Простой",
        person:"👨‍👩‍👧 Семья из соседнего дома",
        title:"Семейный ужин",
        text:"У нас сегодня семейный вечер. Нужно 25 пирожков.",
        needPies:25,
        rewardMoney:400,
        rewardRep:2
    },

    // 🥟 ЛАРЁК — школа, двор, ярмарка
    {
        id:"school_40",
        stage:"stall",
        difficulty:"medium",
        difficultyText:"🔵 Средний",
        person:"👩‍🏫 Учительница",
        title:"Школьное чаепитие",
        text:"В классе праздник. Детям нужно 40 пирожков.",
        needPies:40,
        rewardMoney:900,
        rewardRep:3
    },
    {
        id:"yard_55",
        stage:"stall",
        difficulty:"medium",
        difficultyText:"🔵 Средний",
        person:"🏘 Жители двора",
        title:"Праздник во дворе",
        text:"Во дворе собираются соседи. Нужно 55 пирожков.",
        needPies:55,
        rewardMoney:1300,
        rewardRep:4
    },
    {
        id:"fair_75",
        stage:"stall",
        difficulty:"medium",
        difficultyText:"🔵 Средний",
        person:"🎪 Организатор ярмарки",
        title:"Городская ярмарка",
        text:"На ярмарке нужен стол с горячими пирожками. Испеки 75 штук.",
        needPies:75,
        rewardMoney:2000,
        rewardRep:5
    },

    // ☕ КАФЕ — офисы, кафе, праздники
    {
        id:"office_100",
        stage:"cafe",
        difficulty:"hard",
        difficultyText:"🟣 Сложный",
        person:"🏢 Офисный менеджер",
        title:"Перерыв в офисе",
        text:"У нас большое совещание. Нужно 100 пирожков к кофе.",
        needPies:100,
        rewardMoney:3500,
        rewardRep:7
    },
    {
        id:"other_cafe_130",
        stage:"cafe",
        difficulty:"hard",
        difficultyText:"🟣 Сложный",
        person:"☕ Хозяин соседнего кафе",
        title:"Срочный заказ для кафе",
        text:"У нас закончилась выпечка перед мероприятием. Нужно 130 пирожков.",
        needPies:130,
        rewardMoney:5200,
        rewardRep:9
    },
    {
        id:"birthday_160",
        stage:"cafe",
        difficulty:"hard",
        difficultyText:"🟣 Сложный",
        person:"🎂 Организатор дня рождения",
        title:"Детский праздник",
        text:"На день рождения заказали сладкий стол. Нужно 160 пирожков.",
        needPies:160,
        rewardMoney:7000,
        rewardRep:11
    },

    // 🍽 РЕСТОРАН — свадьбы, банкеты, мэрия
    {
        id:"wedding_220",
        stage:"restaurant",
        difficulty:"very-hard",
        difficultyText:"🟠 Очень сложный",
        person:"👰 Организатор свадьбы",
        title:"Свадебный стол",
        text:"Нужны фирменные пирожки на свадьбу. Испеки 220 штук.",
        needPies:220,
        rewardMoney:12000,
        rewardRep:18
    },
    {
        id:"banquet_300",
        stage:"restaurant",
        difficulty:"very-hard",
        difficultyText:"🟠 Очень сложный",
        person:"🍽 Банкетный зал",
        title:"Большой банкет",
        text:"Сегодня важное мероприятие. Нужно 300 пирожков.",
        needPies:300,
        rewardMoney:18000,
        rewardRep:25
    },
    {
        id:"city_hall_400",
        stage:"restaurant",
        difficulty:"very-hard",
        difficultyText:"🟠 Очень сложный",
        person:"🏛 Мэрия",
        title:"Городской приём",
        text:"На городской приём нужны лучшие пирожки Бабы Гали. Испеки 400 штук.",
        needPies:400,
        rewardMoney:26000,
        rewardRep:35
    },

    // 🏰 ИМПЕРИЯ — огромные заказы
    {
        id:"festival_600",
        stage:"empire",
        difficulty:"legendary",
        difficultyText:"🔴 Легендарный",
        person:"🎆 Городской фестиваль",
        title:"Фестиваль пирожков",
        text:"Весь город ждёт угощение. Нужно 600 пирожков.",
        needPies:600,
        rewardMoney:50000,
        rewardRep:60
    },
    {
        id:"tv_show_900",
        stage:"empire",
        difficulty:"legendary",
        difficultyText:"🔴 Легендарный",
        person:"📺 Телешоу",
        title:"Съёмки передачи",
        text:"Бабу Галю пригласили на передачу. Нужно 900 пирожков для гостей.",
        needPies:900,
        rewardMoney:85000,
        rewardRep:90
    },
    {
        id:"royal_1500",
        stage:"empire",
        difficulty:"legendary",
        difficultyText:"🔴 Легендарный",
        person:"👑 Особая делегация",
        title:"Легендарный заказ",
        text:"В город приехали важные гости. Нужна партия из 1500 пирожков.",
        needPies:1500,
        rewardMoney:150000,
        rewardRep:150
    }
];
const VIP_GUESTS = [
    {
        id:"mayor",
        avatar:"assets/mayor.png",
        name:"Мэр города",
        text:"Баба Галя, я услышал запах пирожков даже из мэрии! Хочу сделать первый особый заказ.",
        needPies:30,
        rewardMoney:1500,
        rewardRep:5,
        stage:"kitchen",
        minRep:0
    },
    {
        id:"critic",
        avatar:"assets/critic.png",
        name:"Ресторанный критик",
        text:"Я хочу попробовать лучшие пирожки в городе. Не подведите меня.",
        needPies:70,
        rewardMoney:7000,
        rewardRep:12,
        stage:"cafe",
        minRep:25
    },
    {
        id:"bride",
        avatar:"assets/bride.png",
        name:"Организатор свадьбы",
        text:"Нужны пирожки для большого свадебного стола. Справитесь?",
        needPies:120,
        rewardMoney:12000,
        rewardRep:18,
        stage:"restaurant",
        minRep:45
    },
    {
        id:"tv_host",
        avatar:"assets/tv_host.png",
        name:"Телеведущая",
        text:"Хочу снять сюжет о Бабе Гале. Но сначала покажите ваши лучшие пирожки!",
        needPies:180,
        rewardMoney:20000,
        rewardRep:25,
        stage:"restaurant",
        minRep:70
    },
    {
        id:"investor",
        avatar:"assets/investor.png",
        name:"Инвестор",
        text:"Я думаю вложиться в ваш бизнес. Покажите, что вы умеете.",
        needPies:300,
        rewardMoney:45000,
        rewardRep:35,
        stage:"empire",
        minRep:120
    }
];
const QUEST_POOL = [
    {
        id:"pies_100",
        person:"👵 Соседка Мария",
        text:"Внучок приезжает в гости. Помоги испечь 100 пирожков.",
        type:"pies",
        target:100
    },
    {
        id:"pies_300",
        person:"👨‍🚒 Пожарный Иван",
        text:"Наша смена дежурит всю ночь. Испеки 300 пирожков.",
        type:"pies",
        target:300
    },
    {
        id:"pies_500",
        person:"🎪 Организатор ярмарки",
        text:"На городской ярмарке ждут угощение. Испеки 500 пирожков.",
        type:"pies",
        target:500
    },
    {
        id:"money_5000",
        person:"🏥 Доктор Алексей",
        text:"В больнице праздник для детей. Заработай 5000 ₽ на большой заказ.",
        type:"money",
        target:5000
    },
    {
        id:"money_10000",
        person:"👑 Мэр города",
        text:"Город готовится к празднику. Заработай 10000 ₽.",
        type:"money",
        target:10000
    },
    {
        id:"money_25000",
        person:"🏛 Мэрия",
        text:"Нужно подготовить большой городской банкет. Заработай 25000 ₽.",
        type:"money",
        target:25000
    },
    {
        id:"rep_10",
        person:"👩‍🏫 Анна Сергеевна",
        text:"В школе праздник. Подними репутацию пекарни до 10.",
        type:"reputation",
        target:10
    },
    {
        id:"rep_25",
        person:"👰 Молодожёны",
        text:"Мы ищем лучшую пекарню для свадьбы. Подними репутацию до 25.",
        type:"reputation",
        target:25
    },
    {
        id:"rep_50",
        person:"⭐ Жители города",
        text:"Пусть весь город узнает Бабу Галю. Подними репутацию до 50.",
        type:"reputation",
        target:50
    },
    {
        id:"cats_3",
        person:"🥓 Мясник Степан",
        text:"Кот снова ворует сосиски! Поймай кота 3 раза.",
        type:"cats",
        target:3
    },
    {
        id:"cats_10",
        person:"🐈 Дворник Петрович",
        text:"Этот кот слишком шустрый. Поймай кота 10 раз.",
        type:"cats",
        target:10
    },
    {
        id:"orders_3",
        person:"🏘 Жители города",
        text:"Выполни 3 заказа от жителей.",
        type:"orders",
        target:3
    },
    {
        id:"orders_10",
        person:"📖 Книга поручений",
        text:"Выполни 10 заказов от жителей.",
        type:"orders",
        target:10
    }
];
let QUESTS = [];
function $(id){return document.getElementById(id)}
const BABA_EMOTIONS = {
    normal:"assets/baba_galya.png",
    happy:"assets/baba_happy.png",
    sad:"assets/baba_sad.png",
    angry:"assets/baba_angry.png",
    surprised:"assets/baba_surprised.png"
};

function setGrandmaEmotion(emotion,duration){

    const image = BABA_EMOTIONS[emotion] || BABA_EMOTIONS.normal;

    if(!UI.grandma){
        return;
    }

    UI.grandma.onerror = () => {
        UI.grandma.onerror = null;
        UI.grandma.src = BABA_EMOTIONS.normal;
    };

    UI.grandma.src = image;

    UI.grandma.classList.remove(
        "grandma-happy",
        "grandma-sad",
        "grandma-angry",
        "grandma-surprised"
    );

    if(emotion !== "normal"){
        UI.grandma.classList.add("grandma-" + emotion);
    }

    clearTimeout(setGrandmaEmotion.timer);

    if(emotion !== "normal"){
        setGrandmaEmotion.timer = setTimeout(() => {
    setGrandmaEmotion("normal",0);
}, duration || 1800);
    }

}
function hideLoadingScreen(){

    if(!UI.loadingScreen){
        return;
    }

    setTimeout(() => {
        UI.loadingScreen.classList.add("hidden");
    },1500);

}
function startBackgroundMusic(){

    if(!game.soundEnabled){
        game.soundEnabled = true;
    }

    game.musicEnabled = true;

    if(UI.backgroundMusic){
       UI.backgroundMusic.volume = game.musicVolume / 100;

        UI.backgroundMusic.play().then(() => {
            updateSoundButton();
            saveGame();
            console.log("Фоновая музыка запущена");
        }).catch((error) => {
            console.log("Музыка не запустилась:", error);
        });
    }

}
function closeStartScreen(){

    if(UI.startScreen){
        UI.startScreen.classList.add("hidden");
    }
game.musicEnabled = game.soundEnabled;
updateMusic();
saveGame();

    if(!game.tutorialDone && game.tutorialStep === 0){
        setTimeout(() => {
            showTutorial();
        },500);
    }

}
function updateOrderTimer(){

    if(game.paused){
        return;
    }

    if(!game.currentOrder){
        return;
    }

    updateOrder();

}
function initYandexSDK(){

    if(typeof YaGames === "undefined"){
        console.log("Yandex Games SDK не найден. Игра запущена вне Яндекс Игр.");
        return;
    }

    YaGames.init().then((sdk) => {

        ysdk = sdk;
        yandexSdkReady = true;

        console.log("Yandex Games SDK подключён.");

        markYandexGameReady();

        ysdk.on("game_api_pause",() => {
            pauseGameForAd();
        });

        ysdk.on("game_api_resume",() => {
            resumeGameFromAd();
        });

    }).catch((error) => {
        console.log("Ошибка подключения Yandex Games SDK:",error);
    });

}
function markYandexGameReady(){

    if(!gameFullyLoaded){
        return;
    }

    if(!yandexSdkReady || !ysdk || !ysdk.features || !ysdk.features.LoadingAPI){
        return;
    }

    ysdk.features.LoadingAPI.ready();

    console.log("Яндекс Игры: игра готова.");

}
function initGame(){

    collectUI();

    initYandexSDK();

    hideLoadingScreen();
    bindButtons();

    setupDefaultUpgrades();

    loadGame();

normalizeGame();

game.paused = false;

game.catActive = false;

if(UI.cat){
    UI.cat.style.display = "none";
    UI.cat.style.left = (window.innerWidth + 320) + "px";
}

game.vipActive = false;
game.currentVIP = null;

    if(UI.vipPopup){
        UI.vipPopup.classList.remove("open");
        UI.vipPopup.style.display = "none";
    }

    seedNews();
    setupOrder();
    setupQuests();
    setupDailyTasks();

    renderRecipes();
    renderShop();
    renderHelpers();

    updateGame();
updateSoundSettingsUI();
updateSoundButton();
updateMusic();
    showEvent("👵 Баба Галя готова печь пирожки!");
updateMusic();
    setInterval(autoIncomeTick,1000);
    setInterval(updateDayTime,1000);
    setInterval(updateOrderTimer,1000);

    scheduleNextCat();

    setInterval(randomEvent,90000);

    setTimeout(checkVIPGuest,10000);
    setInterval(checkVIPGuest,30000);
gameFullyLoaded = true;
markYandexGameReady();
}
function collectUI(){

    Object.assign(UI,{
        money:$("money"),
        pies:$("pies"),
        rep:$("rep"),
catsCaught:$("catsCaught"),
catStatus:$("catStatus"),
dayTimeIcon:$("dayTimeIcon"),
dayTimeText:$("dayTimeText"),
       eventBar:$("eventBar"),
background:$("background"),
loadingScreen:$("loadingScreen"),
soundButton:$("soundButton"),
pauseButton:$("pauseButton"),
pauseModal:$("pauseModal"),
resumeButton:$("resumeButton"),
soundToggleButton:$("soundToggleButton"),
musicVolumeSlider:$("musicVolumeSlider"),
effectsVolumeSlider:$("effectsVolumeSlider"),
musicVolumeValue:$("musicVolumeValue"),
effectsVolumeValue:$("effectsVolumeValue"),
backgroundMusic:$("backgroundMusic"),
vipSound:$("vipSound"),
pieSound:$("pieSound"),
catSound:$("catSound"),
achievementSound:$("achievementSound"),
orderSound:$("orderSound"),
buySound:$("buySound"),
dailyRewardSound:$("dailyRewardSound"),
newsSound:$("newsSound"),
newLifeSound:$("newLifeSound"),
newLifeChoicePopup:$("newLifeChoicePopup"),
newLifeNormalButton:$("newLifeNormalButton"),
newLifeAdButton:$("newLifeAdButton"),
newLifeCancelButton:$("newLifeCancelButton"),
pieButton:$("pieButton"),
        newLifeButton:$("newLifeButton"),
grandma:$("grandma"),
startScreen:$("startScreen"),
startGameButton:$("startGameButton"),
startHowToPlayButton:$("startHowToPlayButton"),
        roadGrandma:$("roadGrandma"),

        nextStageName:$("nextStageName"),
        nextMoney:$("nextMoney"),
        nextRep:$("nextRep"),
        moneyProgress:$("moneyProgress"),
        repProgress:$("repProgress"),

        shopGrid:$("shopGrid"),
recipeList:$("recipeList"),
currentRecipeBadge:$("currentRecipeBadge"),
newsList:$("newsList"),
helperList:$("helperList"),
notEnoughMoneyPopup:$("notEnoughMoneyPopup"),
notEnoughMoneyText:$("notEnoughMoneyText"),
notEnoughMoneyClose:$("notEnoughMoneyClose"),
catRewardPopup:$("catRewardPopup"),
catRewardText:$("catRewardText"),
catRewardAdButton:$("catRewardAdButton"),
catRewardSkipButton:$("catRewardSkipButton"),
        questList:$("questList"),
        claimQuestReward:$("claimQuestReward"),
dailyTasksList:$("dailyTasksList"),
orderCard:$("orderCard"),
orderPerson:$("orderPerson"),
orderText:$("orderText"),
orderNeed:$("orderNeed"),
orderReward:$("orderReward"),
orderRep:$("orderRep"),
completeOrderButton:$("completeOrderButton"),

        achievementList:$("achievementList"),
achievementPopup:$("achievementPopup"),
achievementPopupClose:$("achievementPopupClose"),
achievementPopupIcon:$("achievementPopupIcon"),
achievementPopupTitle:$("achievementPopupTitle"),
achievementPopupText:$("achievementPopupText"),
        cat:$("cat"),
vipPopup:$("vipPopup"),
vipGuestAvatar:$("vipGuestAvatar"),
vipGuestName:$("vipGuestName"),
vipGuestText:$("vipGuestText"),
vipNeedPies:$("vipNeedPies"),
vipRewardMoney:$("vipRewardMoney"),
vipRewardRep:$("vipRewardRep"),
vipAcceptButton:$("vipAcceptButton"),
vipDeclineButton:$("vipDeclineButton"),
vipNeedPiesAdPopup:$("vipNeedPiesAdPopup"),
vipNeedPiesAdText:$("vipNeedPiesAdText"),
vipWatchAdButton:$("vipWatchAdButton"),
vipAdDeclineButton:$("vipAdDeclineButton"),
notEnoughPiesPopup:$("notEnoughPiesPopup"),
notEnoughPiesText:$("notEnoughPiesText"),
notEnoughPiesClose:$("notEnoughPiesClose"),
        finalGoalPopup:$("finalGoalPopup"),
finalGoalClose:$("finalGoalClose"),
finalPies:$("finalPies"),
finalMoney:$("finalMoney"),
finalRep:$("finalRep"),
finalCats:$("finalCats"),
finalNewLifeButton:$("finalNewLifeButton"),
tutorialPopup:$("tutorialPopup"),
tutorialIcon:$("tutorialIcon"),
tutorialTitle:$("tutorialTitle"),
tutorialText:$("tutorialText"),
tutorialStepText:$("tutorialStepText"),
tutorialButton:$("tutorialButton"),
tutorialSkipButton:$("tutorialSkipButton"),

roadStages:{
    kitchen:$("roadKitchen"),
    stall:$("roadStall"),
    cafe:$("roadCafe"),
    restaurant:$("roadRestaurant"),
    empire:$("roadEmpire")
}    });

}
function setupDefaultUpgrades(){UPGRADES.forEach(u=>{if(game.upgrades[u.id]===undefined)game.upgrades[u.id]=0})}
function normalizeGame(){game.money=Number(game.money)||0;
game.pies=Number(game.pies)||0;
game.salesBuffer = Number(game.salesBuffer) || 0;
game.productionBuffer = Number(game.productionBuffer) || 0;
game.reputation=Number(game.reputation)||0;
game.catsCaught = Number(game.catsCaught) || 0;
game.clickIncome=Number(game.clickIncome)||1;
game.autoIncome=Number(game.autoIncome)||0;
game.stage=game.stage||"kitchen";
game.maxStage = game.maxStage || game.stage || "kitchen";
game.dayTime = game.dayTime || "morning";
game.dayTimeStarted = Number(game.dayTimeStarted) || Date.now();
game.achievements=Array.isArray(game.achievements)?game.achievements:[];game.upgrades=game.upgrades||{};
UPGRADES.forEach(u=>game.upgrades[u.id]=Number(game.upgrades[u.id])||0);
game.questRewardClaimed = Boolean(game.questRewardClaimed);
game.activeQuests = Array.isArray(game.activeQuests)
    ? game.activeQuests
    : [];
game.currentOrder = game.currentOrder || null;
game.ordersCompleted = Number(game.ordersCompleted) || 0; 
 game.orderDeadline = Number(game.orderDeadline) || 0;
game.orderTimeLimit = Number(game.orderTimeLimit) || 0; 
game.musicEnabled = Boolean(game.musicEnabled);
game.currentRecipe = game.currentRecipe || "potato_pie"; 
game.recipeLevels = game.recipeLevels || {};
game.dailyTasks = Array.isArray(game.dailyTasks) ? game.dailyTasks : [];
game.dailyTasksDate = game.dailyTasksDate || "";
game.dailyTasksProgress = game.dailyTasksProgress || {};
game.dailyTasksClaimed = Array.isArray(game.dailyTasksClaimed) ? game.dailyTasksClaimed : [];
RECIPES.forEach(recipe => {
    game.recipeLevels[recipe.id] = Number(game.recipeLevels[recipe.id]) || 0;
});
game.newspaper = Array.isArray(game.newspaper) ? game.newspaper : [];
game.helpers = game.helpers || {};
game.vipActive = Boolean(game.vipActive);
game.currentVIP = game.currentVIP || null;
game.vipOrdersCompleted = Number(game.vipOrdersCompleted) || 0;
game.finalGoalShown = Boolean(game.finalGoalShown);
game.tutorialStep = Number(game.tutorialStep) || 0;
game.tutorialDone = Boolean(game.tutorialDone);
if(typeof game.soundEnabled !== "boolean"){
    game.soundEnabled = true;
}
game.paused = Boolean(game.paused);
game.musicVolume = Number(game.musicVolume);

if(!Number.isFinite(game.musicVolume)){
    game.musicVolume = 25;
}

game.musicVolume = Math.max(0, Math.min(100, game.musicVolume));

game.effectsVolume = Number(game.effectsVolume);

if(!Number.isFinite(game.effectsVolume)){
    game.effectsVolume = 60;
}

game.effectsVolume = Math.max(0, Math.min(100, game.effectsVolume));
HELPERS.forEach(helper => {
    game.helpers[helper.id] = Number(game.helpers[helper.id]) || 0;
});}
function bindButtons(){

    if(UI.pieButton){
        UI.pieButton.addEventListener("click",bakePie);
    }

    if(UI.newLifeButton){
    UI.newLifeButton.addEventListener("click",openNewLifeChoicePopup);
}

    if(UI.claimQuestReward){
        UI.claimQuestReward.addEventListener("click",claimQuestReward);
    }
if(UI.completeOrderButton){
    UI.completeOrderButton.addEventListener("click",completeOrder);
}
if(UI.vipAcceptButton){
    UI.vipAcceptButton.addEventListener("click",acceptVIPGuest);
}

if(UI.vipDeclineButton){
    UI.vipDeclineButton.addEventListener("click",declineVIPGuest);
}
if(UI.vipWatchAdButton){
    UI.vipWatchAdButton.addEventListener("click",completeVipAfterAd);
}

if(UI.vipAdDeclineButton){
    UI.vipAdDeclineButton.addEventListener("click",declineVipAdHelp);
}
if(UI.notEnoughPiesClose){
    UI.notEnoughPiesClose.addEventListener("click",closeNotEnoughPiesPopup);
}
if(UI.achievementPopupClose){
    UI.achievementPopupClose.addEventListener("click",closeAchievementPopup);
}
if(UI.notEnoughMoneyClose){
    UI.notEnoughMoneyClose.addEventListener("click",closeNotEnoughMoneyPopup);
}
if(UI.catRewardAdButton){
    UI.catRewardAdButton.addEventListener("click",claimCatAdReward);
}

if(UI.catRewardSkipButton){
    UI.catRewardSkipButton.addEventListener("click",skipCatAdReward);
}
if(UI.startGameButton){
    UI.startGameButton.addEventListener("click",(event) => {
        event.stopPropagation();
        startBackgroundMusic();
        closeStartScreen();
    });
}
if(UI.startScreen){
    UI.startScreen.addEventListener("pointerdown",() => {
        startBackgroundMusic();
    });
}
if(UI.soundButton){
    UI.soundButton.addEventListener("click",() => {
        openModal("soundSettingsModal");
    });
}
if(UI.pauseButton){
    UI.pauseButton.addEventListener("click",pauseGame);
}

if(UI.resumeButton){
    UI.resumeButton.addEventListener("click",resumeGame);
}
if(UI.soundToggleButton){
    UI.soundToggleButton.addEventListener("click",toggleSound);
}

if(UI.musicVolumeSlider){
    UI.musicVolumeSlider.addEventListener("input",() => {
        game.musicVolume = Number(UI.musicVolumeSlider.value);
        updateSoundSettingsUI();
        updateMusic();
        saveGame();
    });
}

if(UI.effectsVolumeSlider){
    UI.effectsVolumeSlider.addEventListener("input",() => {
        game.effectsVolume = Number(UI.effectsVolumeSlider.value);
        updateSoundSettingsUI();
        saveGame();
    });
}
if(UI.finalNewLifeButton){
    UI.finalNewLifeButton.addEventListener("click",openNewLifeChoicePopup);
}
if(UI.finalGoalClose){
    UI.finalGoalClose.addEventListener("click",closeFinalGoalPopup);
}
if(UI.newLifeNormalButton){
    UI.newLifeNormalButton.addEventListener("click",() => {
        closeNewLifeChoicePopup();
        newLifeGame(false);
    });
}

if(UI.newLifeAdButton){
    UI.newLifeAdButton.addEventListener("click",startNewLifeWithAdReward);
}

if(UI.newLifeCancelButton){
    UI.newLifeCancelButton.addEventListener("click",closeNewLifeChoicePopup);
}
if(UI.startHowToPlayButton){
    UI.startHowToPlayButton.addEventListener("click",() => {
        closeStartScreen();

        const modal = $("howToPlayModal");

        if(modal){
            modal.classList.add("open");
        }
    });
}
if(UI.tutorialButton){
    UI.tutorialButton.addEventListener("click",nextTutorialStep);
}

if(UI.tutorialSkipButton){
    UI.tutorialSkipButton.addEventListener("click",skipTutorial);
}
document.querySelectorAll("[data-open]").forEach(button=>{
    button.addEventListener("click",()=>{
        openModal(button.dataset.open);
    });
});

document.querySelectorAll("[data-close]").forEach(button=>{
    button.addEventListener("click",()=>{
        closeModal(button.dataset.close);
    });
});

document.querySelectorAll(".modal").forEach(modal=>{
    modal.addEventListener("click",(event)=>{
        if(event.target === modal){
            modal.classList.remove("open");
        }
    });
});
}
function playPieSound(){
if(!game.soundEnabled){
    return;
}

    if(!UI.pieSound){
        return;
    }

    UI.pieSound.currentTime = 0;
   UI.pieSound.volume = game.effectsVolume / 100;

    UI.pieSound.play().catch(() => {});

}
function bakePie(){
if(game.paused){
    showEvent("⏸ Игра на паузе.");
    return;
}
playPieSound();
    const recipe = getRecipe(game.currentRecipe) || RECIPES[0];

    const repChance = getRecipeRepChance(recipe);

    game.pies++;
addDailyTaskProgress("pies",1);

    let message = recipe.icon + " Баба Галя испекла пирожок " + recipe.title.toLowerCase() + "!";

    if(Math.random() < repChance){

        game.reputation++;

        message = "⭐ Аромат пирожков привлёк людей! +1 репутация";

    }else if(game.pies % 25 === 0){

        game.reputation++;

        message = "⭐ На витрине уже много пирожков! +1 репутация";

    }

    showEvent(message);

    if(typeof setGrandmaEmotion === "function"){
        setGrandmaEmotion("happy",1200);
    }

    floatMoney("+1 🥟");

    updateGame();

}
function getAutoPieProduction(){

    const helperProduction = getHelperPower("production");

    const rewardProduction = game.autoIncome || 0;

    const totalProductionPower = helperProduction + rewardProduction;

    if(totalProductionPower <= 0){
        return 0;
    }

    return totalProductionPower / 20;

}
function getHelperLevel(helperId){
    if(!game.helpers){
        game.helpers = {};
    }

    return Number(game.helpers[helperId]) || 0;
}

function getHelperPower(effectName){
    let power = 0;

    HELPERS.forEach(helper => {
        const level = getHelperLevel(helper.id);

        if(level <= 0) return;

        if(helper.effect === effectName){
            power += level * helper.income;
        }

        if(helper.effect === "mixed" && effectName === "production"){
            power += level * helper.income;
        }

        if(helper.effect === "mixed" && effectName === "sales"){
            power += level * helper.income;
        }
    });

    return power;
}

function getOrderMoneyBonusPercent(){
    return getHelperPower("orders");
}

function getHelperPriceBonus(){
    return getHelperPower("price");
}
function getPiePrice(){

    const recipe = getRecipe(game.currentRecipe) || RECIPES[0];

    const recipeBonus = getRecipeMoneyBonus(recipe);

    const helperPriceBonus = typeof getHelperPriceBonus === "function"
        ? getHelperPriceBonus()
        : 0;

    return Math.max(
        1,
        game.clickIncome + recipeBonus + helperPriceBonus
    );

}
function getSalesSpeed(){

    let speed = 0;

    if(game.stage === "kitchen"){ speed = 0.08; }
    if(game.stage === "stall"){ speed = 0.15; }
    if(game.stage === "cafe"){ speed = 0.3; }
    if(game.stage === "restaurant"){ speed = 0.5; }
    if(game.stage === "empire"){ speed = 0.8; }

    speed += Math.floor(game.reputation / 300);

    const salesBonusPercent = getHelperPower("sales");

    speed = speed * (1 + salesBonusPercent / 100);

    return Math.max(0.08, speed);

}

function autoIncomeTick(){
if(game.paused){
    return;
}
    if(game.productionBuffer === undefined){
        game.productionBuffer = 0;
    }

    if(game.salesBuffer === undefined){
        game.salesBuffer = 0;
    }

    const productionSpeed = getAutoPieProduction();

    game.productionBuffer += productionSpeed;

    const madePies = Math.floor(game.productionBuffer);

    if(madePies > 0){

        game.pies += madePies;

        game.productionBuffer -= madePies;

       if(madePies >= 1){

    if(!autoIncomeTick.lastHelperMessageTime || Date.now() - autoIncomeTick.lastHelperMessageTime > 15000){

        showEvent("👥 Помощники испекли +" + madePies + " 🥟");

        autoIncomeTick.lastHelperMessageTime = Date.now();

    }

}

    }

    if(game.pies <= 0){

        if(madePies > 0){
            updateGame();
        }

        return;

    }

    const saleSpeed = getSalesSpeed();

    game.salesBuffer += saleSpeed;

    const soldPies = Math.min(
        game.pies,
        Math.floor(game.salesBuffer)
    );

    if(soldPies <= 0){

        if(madePies > 0){
            updateGame();
        }

        return;

    }

    const piePrice = getPiePrice();

    const earnedMoney = soldPies * piePrice;

    game.pies -= soldPies;

    game.money += earnedMoney;
addDailyTaskProgress("money",earnedMoney);
    game.salesBuffer -= soldPies;

  if(!autoIncomeTick.lastMessageTime || Date.now() - autoIncomeTick.lastMessageTime > 12000){

    showEvent(
        "🧺 Покупатели купили " +
        soldPies +
        "пирожков. +" +
        earnedMoney +
        " ₽"
    );

    autoIncomeTick.lastMessageTime = Date.now();

}
updateGame();

}
const DAY_TIMES = [
    {
        id:"morning",
        icon:"🌅",
        title:"Утро",
        className:"time-morning",
        duration:120000
    },
    {
        id:"day",
        icon:"☀️",
        title:"День",
        className:"time-day",
        duration:120000
    },
    {
        id:"evening",
        icon:"🌆",
        title:"Вечер",
        className:"time-evening",
        duration:120000
    },
    {
        id:"night",
        icon:"🌙",
        title:"Ночь",
        className:"time-night",
        duration:120000
    }
];

function getDayTime(){
    return DAY_TIMES.find(item => item.id === game.dayTime) || DAY_TIMES[0];
}

function updateDayTime(){
if(game.paused){
        return;
    }

    const currentTime = getDayTime();

    const passedTime = Date.now() - game.dayTimeStarted;

    if(passedTime >= currentTime.duration){

        const currentIndex = DAY_TIMES.findIndex(item => item.id === currentTime.id);

        const nextTime = DAY_TIMES[(currentIndex + 1) % DAY_TIMES.length];

        game.dayTime = nextTime.id;

        game.dayTimeStarted = Date.now();

        showEvent(nextTime.icon + " Наступило время суток: " + nextTime.title);

        if(typeof addNews === "function"){
            addNews(
                nextTime.icon + " Время суток изменилось",
                "В городе наступило: " + nextTime.title + "."
            );
        }

    }

    renderDayTime();

}

function renderDayTime(){

    const currentTime = getDayTime();

    if(UI.dayTimeIcon){
        UI.dayTimeIcon.textContent = currentTime.icon;
    }

    if(UI.dayTimeText){
        UI.dayTimeText.textContent = currentTime.title;
    }

    document.body.classList.remove(
        "time-morning",
        "time-day",
        "time-evening",
        "time-night"
    );

    document.body.classList.add(currentTime.className);

}
function checkFinalGoal(){

    if(game.finalGoalShown){
        return;
    }

    const hasEmpire = stageIndex(game.maxStage || game.stage) >= stageIndex("empire");

    const hasMoney = game.money >= 1000000;

    const hasReputation = game.reputation >= 500;

    const hasPies = game.pies >= 100000;

    if(hasEmpire && hasMoney && hasReputation && hasPies){

        game.finalGoalShown = true;

        showFinalGoalPopup();

        showEvent("👑 Победа! Баба Галя построила Империю пирожков!");

        if(typeof setGrandmaEmotion === "function"){
            setGrandmaEmotion("happy",3500);
        }

        if(typeof addNews === "function"){
            addNews(
                "👑 Империя пирожков построена",
                "Баба Галя стала легендой города и построила настоящую пирожковую империю."
            );
        }

    }

}

function showFinalGoalPopup(){

    if(UI.finalPies){
        UI.finalPies.textContent = game.pies.toLocaleString("ru-RU");
    }

    if(UI.finalMoney){
        UI.finalMoney.textContent = game.money.toLocaleString("ru-RU") + " ₽";
    }

    if(UI.finalRep){
        UI.finalRep.textContent = game.reputation.toLocaleString("ru-RU");
    }

    if(UI.finalCats){
        UI.finalCats.textContent = game.catsCaught.toLocaleString("ru-RU");
    }

    if(UI.finalGoalPopup){
        UI.finalGoalPopup.classList.add("open");
    }

}

function closeFinalGoalPopup(){

    if(UI.finalGoalPopup){
        UI.finalGoalPopup.classList.remove("open");
    }

}
const TUTORIAL_STEPS = [
    {
        icon:"👵",
        title:"Как играть",
        text:"Пеки пирожки, выполняй заказы, покупай улучшения и помоги Бабе Гале построить Империю пирожков!"
    }
];

function showTutorial(){

    if(game.tutorialDone){
        return;
    }

    const step = TUTORIAL_STEPS[0];

    if(UI.tutorialIcon){
        UI.tutorialIcon.textContent = step.icon;
    }

    if(UI.tutorialTitle){
        UI.tutorialTitle.textContent = step.title;
    }

    if(UI.tutorialText){
        UI.tutorialText.textContent = step.text;
    }

    if(UI.tutorialStepText){
        UI.tutorialStepText.textContent = "Короткое обучение перед началом игры";
    }

    if(UI.tutorialButton){
        UI.tutorialButton.textContent = "Понятно, играть";
    }

    if(UI.tutorialSkipButton){
        UI.tutorialSkipButton.style.display = "none";
    }

    if(UI.tutorialPopup){
        UI.tutorialPopup.classList.add("open");
    }

}

function closeTutorial(){

    if(UI.tutorialPopup){
        UI.tutorialPopup.classList.remove("open");
    }

}

function nextTutorialStep(){

    finishTutorial();

}

function skipTutorial(){

    finishTutorial();

}

function finishTutorial(){

    game.tutorialDone = true;
    game.tutorialStep = 1;

    closeTutorial();

    saveGame();

    showEvent("👵 Обучение завершено. Можно играть!");

}

function checkTutorialProgress(){

    return;

}
function getTodayKey(){

    const date = new Date();

    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2,"0") + "-" +
        String(date.getDate()).padStart(2,"0");

}

function setupDailyTasks(){

    const today = getTodayKey();

    if(game.dailyTasksDate === today && game.dailyTasks.length > 0){
        return;
    }

    game.dailyTasksDate = today;
    game.dailyTasksProgress = {};
    game.dailyTasksClaimed = [];

    const shuffled = [...DAILY_TASK_POOL].sort(() => Math.random() - 0.5);

    game.dailyTasks = shuffled.slice(0,3).map(task => task.id);

    saveGame();

}

function getDailyTaskById(taskId){
    return DAILY_TASK_POOL.find(task => task.id === taskId);
}

function getDailyTaskProgress(task){

    if(!game.dailyTasksProgress){
        game.dailyTasksProgress = {};
    }

    return Number(game.dailyTasksProgress[task.id]) || 0;

}

function addDailyTaskProgress(type,amount){

    if(!game.dailyTasks || game.dailyTasks.length === 0){
        return;
    }

    game.dailyTasks.forEach(taskId => {

        const task = getDailyTaskById(taskId);

        if(!task) return;

        if(task.type !== type) return;

        const current = getDailyTaskProgress(task);

        game.dailyTasksProgress[task.id] = Math.min(
            task.target,
            current + amount
        );

    });

}
function playDailyRewardSound(){

    if(!game.soundEnabled){
        return;
    }

    if(!UI.dailyRewardSound){
        return;
    }

    UI.dailyRewardSound.currentTime = 0;
  UI.dailyRewardSound.volume = game.effectsVolume / 100;

    UI.dailyRewardSound.play().catch(() => {});

}
function claimDailyTask(taskId){

    const task = getDailyTaskById(taskId);

    if(!task) return;

    if(game.dailyTasksClaimed.includes(task.id)){
        showEvent("📅 Награда за это задание уже получена.");
        return;
    }

    const progress = getDailyTaskProgress(task);

    if(progress < task.target){
        showEvent("📅 Задание ещё не выполнено.");
        return;
    }
playDailyRewardSound();
    game.money += task.rewardMoney;
    game.pies += task.rewardPies;
    game.reputation += task.rewardRep;

    game.dailyTasksClaimed.push(task.id);

    showEvent(
        "📅 Задание выполнено! +" +
        task.rewardMoney +
        " ₽, +" +
        task.rewardPies +
        " 🥟, +" +
        task.rewardRep +
        " ⭐"
    );

    if(typeof setGrandmaEmotion === "function"){
        setGrandmaEmotion("happy",1800);
    }

    if(typeof addNews === "function"){
        addNews(
            "📅 Задание дня выполнено",
            "Баба Галя выполнила задание: " + task.title + "."
        );
    }

    updateGame();

}

function renderDailyTasks(){

    if(!UI.dailyTasksList) return;

    setupDailyTasks();

    UI.dailyTasksList.innerHTML = game.dailyTasks.map(taskId => {

        const task = getDailyTaskById(taskId);

        if(!task) return "";

        const progress = getDailyTaskProgress(task);
        const done = progress >= task.target;
        const claimed = game.dailyTasksClaimed.includes(task.id);

        let buttonText = "Получить награду";

        if(!done){
            buttonText = "Выполняется";
        }

        if(claimed){
            buttonText = "Получено";
        }

        return `
            <div class="daily-task-card ${done ? "done" : ""}">
                <div class="daily-task-icon">${task.icon}</div>

                <div class="daily-task-content">
                    <h3>${task.title}</h3>

                    <div class="daily-task-progress-text">
                        ${progress} / ${task.target}
                    </div>

                    <div class="daily-task-progress">
                        <div style="width:${Math.min(100,(progress / task.target) * 100)}%"></div>
                    </div>

                    <div class="daily-task-reward">
                        Награда: ${task.rewardMoney} ₽, ${task.rewardPies} 🥟, ${task.rewardRep} ⭐
                    </div>

                    <button 
                        type="button" 
                        data-daily-task="${task.id}"
                        ${!done || claimed ? "disabled" : ""}
                    >
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;

    }).join("");

    UI.dailyTasksList.querySelectorAll("[data-daily-task]").forEach(button => {
        button.addEventListener("click",() => {
            claimDailyTask(button.dataset.dailyTask);
        });
    });

}
function toggleSound(){

    game.soundEnabled = !game.soundEnabled;

    if(game.soundEnabled){
        game.musicEnabled = true;
        updateMusic();
        showEvent("🔊 Звук включён.");
    }else{
        game.musicEnabled = false;

        if(UI.backgroundMusic){
            UI.backgroundMusic.pause();
        }

        showEvent("🔇 Звук выключен.");
    }

    updateSoundButton();
    updateSoundSettingsUI();

    saveGame();

}

function updateSoundButton(){

    if(!UI.soundButton){
        return;
    }

    if(game.soundEnabled){
        UI.soundButton.innerHTML = "🔊<span>Звук</span>";
    }else{
        UI.soundButton.innerHTML = "🔇<span>Звук</span>";
    }

}
function toggleMusic(){

    if(!game.soundEnabled){
        showEvent("🔇 Сначала включи общий звук.");
        return;
    }

    game.musicEnabled = !game.musicEnabled;

    updateMusic();

    saveGame();

}
function updateSoundSettingsUI(){

    if(UI.musicVolumeSlider){
        UI.musicVolumeSlider.value = game.musicVolume;
    }

    if(UI.effectsVolumeSlider){
        UI.effectsVolumeSlider.value = game.effectsVolume;
    }

    if(UI.musicVolumeValue){
        UI.musicVolumeValue.textContent = game.musicVolume;
    }

    if(UI.effectsVolumeValue){
        UI.effectsVolumeValue.textContent = game.effectsVolume;
    }

    if(UI.soundToggleButton){
        if(game.soundEnabled){
            UI.soundToggleButton.textContent = "🔊 Звук включён";
        }else{
            UI.soundToggleButton.textContent = "🔇 Звук выключен";
        }
    }

}
function updateMusic(){

    if(!UI.backgroundMusic){
        return;
    }

    UI.backgroundMusic.volume = game.musicVolume / 100;

    if(!game.soundEnabled || !game.musicEnabled || game.musicVolume <= 0){
        UI.backgroundMusic.pause();
        return;
    }

    UI.backgroundMusic.play().catch((error) => {
        console.log("Фоновая музыка не запустилась:", error);
    });

}
function forceClosePause(){

    game.paused = false;

    if(UI.pauseModal){
        UI.pauseModal.classList.remove("open");
        UI.pauseModal.classList.remove("active");
        UI.pauseModal.style.display = "none";
    }

    const pauseModalElement = document.getElementById("pauseModal");

    if(pauseModalElement){
        pauseModalElement.classList.remove("open");
        pauseModalElement.classList.remove("active");
        pauseModalElement.style.display = "none";
    }

    if(UI.pauseButton){
        UI.pauseButton.innerHTML = "⏸<span>Пауза</span>";
    }

}
function pauseGame(){

    game.paused = true;

    clearTimeout(showEvent.timer);

    if(UI.eventBar){
        UI.eventBar.textContent = "😴 Баба Галя отдыхает...";
    }

    const pauseModalElement = document.getElementById("pauseModal");

    if(pauseModalElement){
        pauseModalElement.style.display = "";
        pauseModalElement.classList.add("open");
    }

    if(UI.pauseModal){
        UI.pauseModal.style.display = "";
        UI.pauseModal.classList.add("open");
    }

    if(UI.pauseButton){
        UI.pauseButton.innerHTML = "▶<span>Пауза</span>";
    }

    saveGame();

}

function resumeGame(){

    game.paused = false;

    const pauseModalElement = document.getElementById("pauseModal");

    if(pauseModalElement){
        pauseModalElement.classList.remove("open");
        pauseModalElement.classList.remove("active");
        pauseModalElement.style.display = "";
    }

    if(UI.pauseModal){
        UI.pauseModal.classList.remove("open");
        UI.pauseModal.classList.remove("active");
        UI.pauseModal.style.display = "";
    }

    if(UI.pauseButton){
        UI.pauseButton.innerHTML = "⏸<span>Пауза</span>";
    }

    if(UI.eventBar){
        UI.eventBar.textContent = "👵 Баба Галя снова печёт пирожки...";
    }

    updateGame();
    saveGame();

}
function pauseGameForAd(){

    if(!adPauseStateSaved){
        wasPausedBeforeAd = game.paused;
        wasMusicEnabledBeforeAd = game.musicEnabled;
        adPauseStateSaved = true;
    }

    adIsOpen = true;
    game.paused = true;

    if(UI.backgroundMusic){
        UI.backgroundMusic.pause();
    }

    if(ysdk && ysdk.features && ysdk.features.GameplayAPI){
        ysdk.features.GameplayAPI.stop();
    }

}

function resumeGameFromAd(){

    adIsOpen = false;

    if(!wasPausedBeforeAd){
        game.paused = false;

        if(ysdk && ysdk.features && ysdk.features.GameplayAPI){
            ysdk.features.GameplayAPI.start();
        }
    }

    if(wasMusicEnabledBeforeAd && game.soundEnabled && UI.backgroundMusic){
        UI.backgroundMusic.play().catch(() => {});
    }

    adPauseStateSaved = false;

}

function showRewardedAd(){

    return new Promise((resolve) => {

        if(!yandexSdkReady || !ysdk || !ysdk.adv){
            console.log("Реклама Яндекс недоступна. Тестовый режим.");
            resolve(true);
            return;
        }

        let rewardGiven = false;

        ysdk.adv.showRewardedVideo({
            callbacks:{
                onOpen:() => {
                    adIsOpen = true;
                    pauseGameForAd();
                    console.log("Реклама открыта.");
                },

                onRewarded:() => {
                    rewardGiven = true;
                    console.log("Награда за рекламу получена.");
                },

                onClose:() => {
                    adIsOpen = false;
                    resumeGameFromAd();

                    if(rewardGiven){
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                },

                onError:(error) => {
                    adIsOpen = false;
                    resumeGameFromAd();

                    console.log("Ошибка рекламы:",error);
                    resolve(false);
                }
            }
        });

    });

}
    function updateGame(){

    normalizeGame();
    updateStage();

    updateHUD();

    updateBackground();

    updateRoad();

    updateNextGoal();

    updateShop();
updateRecipes();
updateHelpers();
updateOrder();

    updateQuests();
renderDailyTasks();
    updateAchievements();
renderNews();
renderDayTime();
checkFinalGoal();
saveGame();

}
function getCatLevel(){

    if(game.catsCaught >= 50){
        return {
            title:"Доставщик",
            text:"🐈🚚 Доставщик",
            penalty:0,
            reward:500,
            reputationReward:2,
            message:"🐈🚚 Кот-доставщик привёз заказ! +500 ₽ и +2 ⭐"
        };
    }

    if(game.catsCaught >= 30){
        return {
            title:"Почти свой",
            text:"🐈 Почти свой",
            penalty:20,
            reward:150,
            reputationReward:1,
            message:"🐈 Кот смущённо принёс 150 ₽ за сосиски!"
        };
    }

    if(game.catsCaught >= 10){
        return {
            title:"Испуганный",
            text:"🐈 Испуганный",
            penalty:25,
            reward:100,
            reputationReward:1,
            message:"🐈 Кот пойман! Он уже боится Бабу Галю."
        };
    }

    return {
        title:"Воришка",
        text:"🐈 Воришка",
        penalty:50,
        reward:100,
        reputationReward:1,
        message:"🐈 Кот пойман! +100 ₽, +1 ⭐ и +1 кот"
    };

}
function updateHUD(){

    UI.money && (UI.money.textContent = Math.floor(game.money).toLocaleString("ru-RU"));

    UI.pies && (UI.pies.textContent = game.pies.toLocaleString("ru-RU"));

    UI.rep && (UI.rep.textContent = game.reputation.toLocaleString("ru-RU"));

    UI.catsCaught && (UI.catsCaught.textContent = game.catsCaught.toLocaleString("ru-RU"));

    if(UI.catStatus){

        const catLevel = getCatLevel();

        UI.catStatus.textContent = catLevel.title;

    }

}
function getCurrentStage(){

    let currentStage = STAGES[0];

    STAGES.forEach(stage => {

        if(game.money >= stage.minMoney && game.reputation >= stage.minRep){
            currentStage = stage;
        }

    });

    return currentStage;

}
function updateStage(){

    const earnedStage = getCurrentStage().id;

    if(stageIndex(earnedStage) > stageIndex(game.maxStage)){

        game.maxStage = earnedStage;

        addNews(
            "🏗 Новое открытие!",
            "Баба Галя открыла новый этап: " + getStageTitle(earnedStage) + ". Жители города обсуждают это событие."
        );

showEvent("🎉 Новый этап открыт: " + getStageTitle(earnedStage) + "! Деньги и репутация собраны.");
setGrandmaEmotion("happy",2500);
createNewOrder();
    }

    game.stage = game.maxStage;

}
function stageIndex(id){return STAGES.findIndex(s=>s.id===id)}
function isUpgradeUnlocked(upgrade){

    return stageIndex(game.maxStage) >= stageIndex(upgrade.stage);

}

function getStageTitle(stageId){
    const stage = STAGES.find(s => s.id === stageId);
    return stage ? stage.title : "Неизвестный этап";
}
function updateBackground(){const s=STAGES.find(x=>x.id===game.stage);if(UI.background&&s)UI.background.style.backgroundImage="url('assets/"+s.background+"')"}
function updateRoad(){const ci=stageIndex(game.stage);STAGES.forEach((s,i)=>{const el=UI.roadStages[s.id];if(!el)return;el.className="road-stage locked";if(i<ci)el.className="road-stage done";if(i===ci)el.className="road-stage current"});const cur=STAGES[ci];if(UI.roadGrandma&&cur)UI.roadGrandma.style.left=cur.roadPos}
function getNextStage(){

    return STAGES.find(stage => {
        return game.money < stage.minMoney || game.reputation < stage.minRep;
    });

}

function updateNextGoal(){

    const nextStage = getNextStage();

    if(!nextStage){

        if(UI.nextStageName){
            UI.nextStageName.textContent = "🏆 Все этапы открыты!";
        }

        if(UI.nextMoney){
            UI.nextMoney.textContent = "Баба Галя построила всю Империю пирожков.";
        }

        if(UI.nextRep){
            UI.nextRep.textContent = "Теперь можно выполнять финальную цель игры.";
        }

        if(UI.moneyProgress){
            UI.moneyProgress.style.width = "100%";
        }

        if(UI.repProgress){
            UI.repProgress.style.width = "100%";
        }

        return;

    }

    const currentMoney = Math.floor(game.money);
    const currentRep = Math.floor(game.reputation);

    const needMoney = nextStage.minMoney;
    const needRep = nextStage.minRep;

    const missingMoney = Math.max(0, needMoney - currentMoney);
    const missingRep = Math.max(0, needRep - currentRep);

    const moneyProgress = needMoney
        ? Math.min(100,currentMoney / needMoney * 100)
        : 100;

    const repProgress = needRep
        ? Math.min(100,currentRep / needRep * 100)
        : 100;

    if(UI.nextStageName){
        UI.nextStageName.textContent =
            "Следующий этап: " + nextStage.title;
    }

    if(UI.nextMoney){

        if(missingMoney > 0){
            UI.nextMoney.textContent =
                "💰 Деньги: " +
                currentMoney.toLocaleString("ru-RU") +
                " / " +
                needMoney.toLocaleString("ru-RU") +
                " ₽. Осталось: " +
                missingMoney.toLocaleString("ru-RU") +
                " ₽";
        }else{
            UI.nextMoney.textContent =
                "✅ Деньги собраны: " +
                currentMoney.toLocaleString("ru-RU") +
                " / " +
                needMoney.toLocaleString("ru-RU") +
                " ₽";
        }

    }

    if(UI.nextRep){

        if(missingRep > 0){
            UI.nextRep.textContent =
                "⭐ Репутация: " +
                currentRep +
                " / " +
                needRep +
                ". Осталось: " +
                missingRep +
                " ⭐";
        }else{
            UI.nextRep.textContent =
                "✅ Репутация набрана: " +
                currentRep +
                " / " +
                needRep +
                " ⭐";
        }

    }

    if(UI.moneyProgress){
        UI.moneyProgress.style.width = moneyProgress + "%";
    }

    if(UI.repProgress){
        UI.repProgress.style.width = repProgress + "%";
    }

}
function renderShop(){

    if(!UI.shopGrid) return;

    UI.shopGrid.innerHTML = UPGRADES.map(u => {

       const typeText = u.clickBonus > 0
    ? "🥟 Увеличивает цену пирожка"
    : "⏱ Ускоряет продажи";

        return `
            <div class="shop-card ${u.premium ? "premium" : ""}" data-upgrade="${u.id}">
                <div class="shop-icon">${u.icon}</div>

                <h3>${u.title}</h3>

                <p>${u.desc}</p>

                <div class="upgrade-type">${typeText}</div>

                <div class="upgrade-stage">Откроется: ${getStageTitle(u.stage)}</div>

                <div class="upgrade-level">Уровень: 0</div>

                <button type="button" data-buy="${u.id}">
                    Купить: <span data-price="${u.id}">${u.price}</span> ₽
                </button>
            </div>
        `;

    }).join("");

    UI.shopGrid.querySelectorAll("[data-buy]").forEach(button => {

        button.addEventListener("click", () => {
            buyUpgrade(button.dataset.buy);
        });

    });

}
function getUpgrade(id){return UPGRADES.find(u=>u.id===id)}
function getUpgradePrice(id){const u=getUpgrade(id);return Math.floor(u.price*Math.pow(u.grow,game.upgrades[id]||0))}
function playBuySound(){
  if(!game.soundEnabled){
        return;
    }
    if(!UI.buySound){
        return;
    }

    UI.buySound.currentTime = 0;
   UI.buySound.volume = game.effectsVolume / 100;

    UI.buySound.play().catch(() => {});

}
function buyUpgrade(id){
    const u=getUpgrade(id);

    if(!u)return;

    if(!isUpgradeUnlocked(u)){
        showEvent("🔒 Это улучшение откроется на этапе: "+getStageTitle(u.stage));
        return;
    }

    const p=getUpgradePrice(id);

    if(game.money<p){
        showEvent("💸 Не хватает денег!");
        return;
    }
playBuySound();

    game.money-=p;
    game.upgrades[id]++;
    game.clickIncome+=u.clickBonus;
    game.autoIncome+=u.autoBonus;

    showEvent("✅ Куплено: "+u.title);

    updateGame();
updateSoundButton();
updateMusic();
updateSoundButton();
}
function updateShop(){
    UPGRADES.forEach(u=>{
        const card=document.querySelector(`[data-upgrade="${u.id}"]`);
        const priceEl=document.querySelector(`[data-price="${u.id}"]`);

        if(!card||!priceEl)return;

        const unlocked=isUpgradeUnlocked(u);
        const p=getUpgradePrice(u.id);
        const lvl=game.upgrades[u.id]||0;
        const btn=card.querySelector("button");
        const lvlEl=card.querySelector(".upgrade-level");
        const stageEl=card.querySelector(".upgrade-stage");

        card.classList.toggle("locked-upgrade",!unlocked);

        priceEl.textContent=p.toLocaleString("ru-RU");

        if(lvlEl){
            lvlEl.textContent="Уровень: "+lvl;
        }

        if(stageEl){
            stageEl.textContent=unlocked
                ? "✅ Доступно"
                : "🔒 Откроется: "+getStageTitle(u.stage);
        }

        if(btn){
            btn.disabled=!unlocked||game.money<p;
            btn.classList.toggle("can-buy",unlocked&&game.money>=p);

            if(!unlocked){
                btn.textContent="Закрыто";
            }else{
                btn.innerHTML=`Купить: <span data-price="${u.id}">${p.toLocaleString("ru-RU")}</span> ₽`;
            }
        }
    });
}
function getTotalUpgradeLevels(){

    if(!game.upgrades){
        return 0;
    }

    return Object.values(game.upgrades).reduce((sum, level) => {

        return sum + (Number(level) || 0);

    }, 0);

}
function playAchievementSound(){

    if(!game.soundEnabled){
        console.log("Звук выключен в настройках");
        return;
    }

    if(!UI.achievementSound){
        console.log("achievementSound не найден в HTML");
        return;
    }

    UI.achievementSound.currentTime = 0;
    UI.achievementSound.volume = game.effectsVolume / 100;

    UI.achievementSound.play().catch((error) => {
        console.log("Ошибка звука достижения:", error);
    });

}
function showAchievementPopup(achievement,reward){
playAchievementSound();

    if(UI.achievementPopupIcon){
        UI.achievementPopupIcon.textContent = achievement.icon || "🏆";
    }

    if(UI.achievementPopupTitle){
        UI.achievementPopupTitle.textContent = achievement.title || "Достижение";
    }

    if(UI.achievementPopupText){
        UI.achievementPopupText.textContent = reward && reward.text
            ? reward.text
            : "🎁 Награда получена!";
    }

    if(UI.achievementPopup){
        UI.achievementPopup.classList.add("open");
    }

    clearTimeout(showAchievementPopup.timer);

    showAchievementPopup.timer = setTimeout(() => {
        closeAchievementPopup();
    },4500);

}

function closeAchievementPopup(){

    if(UI.achievementPopup){
        UI.achievementPopup.classList.remove("open");
    }

}

function giveAchievementReward(achievement){

    const reward = ACH_REWARDS[achievement.id];

    if(!reward) return;

    if(reward.money){
        game.money += reward.money;
    }

    if(reward.pies){
        game.pies += reward.pies;
    }

    if(reward.reputation){
        game.reputation += reward.reputation;
    }

    if(reward.clickIncome){
        game.clickIncome += reward.clickIncome;
    }

    if(reward.autoIncome){
        game.autoIncome += reward.autoIncome;
    }

    showEvent("🏆 " + achievement.title + "! " + reward.text);

    showAchievementPopup(achievement,reward);

    if(typeof addNews === "function"){
        addNews(
            "🏆 Награда за достижение",
            "Баба Галя получила достижение «" + achievement.title + "». " + reward.text
        );
    }

}
const ACH_REWARDS = {

    // 🟢 ПРОСТЫЕ ДОСТИЖЕНИЯ
    first_pie:{
        money:100,
        pies:10,
        text:"🎁 Награда: +100 ₽ и +10 пирожков"
    },

    ten_pies:{
        money:150,
        pies:10,
        text:"🎁 Награда: +150 ₽ и +10 пирожков"
    },

    first_money:{
        pies:10,
        reputation:1,
        text:"🎁 Награда: +10 пирожков и +1 ⭐"
    },

    first_rep:{
        money:200,
        pies:10,
        text:"🎁 Награда: +200 ₽ и +10 пирожков"
    },

    first_upgrade:{
        money:250,
        reputation:1,
        text:"🎁 Награда: +250 ₽ и +1 ⭐"
    },


    // 🔵 СРЕДНИЕ ДОСТИЖЕНИЯ
    hundred_pies:{
        money:300,
        pies:10,
        text:"🎁 Награда: +300 ₽ и +10 пирожков"
    },

    five_hundred_pies:{
        money:400,
        pies:15,
        text:"🎁 Награда: +400 ₽ и +15 пирожков"
    },

    money_1000:{
        pies:15,
        reputation:1,
        text:"🎁 Награда: +15 пирожков и +1⭐"
    },

    rep_10:{
        money:400,
        pies:15,
        text:"🎁 Награда: +400 ₽ и +15 пирожков"
    },

    first_cat:{
        money:300,
        reputation:1,
        text:"🎁 Награда: +300 ₽ и +1 ⭐"
    },

    first_order:{
        money:500,
        pies:10,
        text:"🎁 Награда: +500 ₽ и +10 пирожков"
    },

    open_stall:{
        money:600,
        pies:15,
        reputation:1,
        text:"🎁 Награда: +600 ₽, +15 пирожков и +1 ⭐"
    },


    // 🟣 СЛОЖНЫЕ ДОСТИЖЕНИЯ
    pies_1000:{
        money:600,
        pies:15,
        text:"🎁 Награда: +600 ₽ и +15 пирожков"
    },

    money_10000:{
        pies:20,
        reputation:2,
        text:"🎁 Награда: +20 пирожков и +2 ⭐"
    },

    rep_50:{
        money:700,
        reputation:2,
        text:"🎁 Награда: +700 ₽ и +2 ⭐"
    },

    cats_10:{
        money:600,
        pies:15,
        text:"🎁 Награда: +600 ₽ и +15 пирожков"
    },

    orders_10:{
        money:800,
        reputation:2,
        text:"🎁 Награда: +800 ₽ и +2 ⭐"
    },

    open_cafe:{
        money:900,
        pies:20,
        reputation:2,
        text:"🎁 Награда: +900 ₽, +20 пирожков и +2 ⭐"
    },

    recipe_jam:{
        money:500,
        pies:15,
        text:"🎁 Награда: +500 ₽ и +15 пирожков"
    },


    // 🟠 ОЧЕНЬ СЛОЖНЫЕ ДОСТИЖЕНИЯ
    pies_10000:{
        money:1000,
        pies:20,
        text:"🎁 Награда: +1000 ₽ и +20 пирожков"
    },

    money_100000:{
        money:1000,
        reputation:3,
        text:"🎁 Награда: +100 ₽ и +3 ⭐"
    },

    rep_150:{
        pies:20,
        reputation:3,
      text:"🎁 Награда: +20 пирожков и +3 ⭐"
    },

    cats_30:{
        money:900,
        pies:20,
        text:"🎁 Награда: +900 ₽ и +20 пирожков"
    },

    orders_50:{
        money:1000,
        reputation:3,
        text:"🎁 Награда: +1000 ₽ и +3 ⭐"
    },

    open_restaurant:{
        money:1000,
        pies:20,
        reputation:4,
        text:"🎁 Награда: +1000 ₽, +20 пирожков и +4 ⭐"
    },

    all_recipes:{
        clickIncome:1,
        reputation:4,
        text:"🎁 Награда: +1 ₽ к цене пирожка и +4 ⭐"
    },


    // 🔴 ПОЧТИ НЕВЫПОЛНИМЫЕ ДОСТИЖЕНИЯ
    pies_100000:{
        money:1000,
        pies:20,
        clickIncome:1,
        text:"🎁 Награда: +1000 ₽, +20 пирожков и +1 ₽ к цене пирожка"
    },

    money_1000000:{
        money:1000,
        reputation:5,
        text:"🎁 Награда: +1 000 ₽ и +5 ⭐"
    },

    rep_500:{
        pies:20,
        clickIncome:1,
        text:"🎁 Награда: +20 пирожков и +1 ₽ к цене пирожка"
    },

    cats_50:{
        money:1000,
        pies:20,
        reputation:5,
        text:"🎁 Награда: +1000 ₽, +20 пирожков и +5 ⭐"
    },

    orders_100:{
        money:1000,
        reputation:5,
        clickIncome:1,
        text:"🎁 Награда: +1000 ₽, +5 ⭐ и +1 ₽ к цене пирожка"
    },

    all_upgrades_50:{
        money:1000,
        autoIncome:5,
        text:"🎁 Награда: +1000 ₽ и +5 силы автоготовки"
    },

    empire:{
        money:1000,
        pies:20,
        reputation:5,
        text:"🎁 Награда: +1000 ₽, +20 пирожков и +5 ⭐"
    },

    true_legend:{
        money:1000,
        pies:20,
        reputation:5,
        clickIncome:1,
        autoIncome:5,
        text:"👑 Легендарная награда: +1000 ₽, +20 пирожков, +5 ⭐, +1 ₽ к цене пирожка и +5 силы автоготовки"
    },

    galya_recipe:{
        money:1000,
        pies:20,
        reputation:5,
        text:"🎁 Награда: +1000 ₽, +20 пирожков и +5 ⭐"
    }

};
function updateAchievements(){

    ACH.forEach(achievement => {

        if(achievement.condition() && !game.achievements.includes(achievement.id)){

            game.achievements.push(achievement.id);

            giveAchievementReward(achievement);

        }

    });

    renderAchievements();

}

function renderAchievements(){

    if(!UI.achievementList) return;

    UI.achievementList.innerHTML = ACH.map(achievement => {

        const unlocked = game.achievements.includes(achievement.id);

        const reward = ACH_REWARDS[achievement.id];

        return `
            <div class="achievement-card ${unlocked ? "unlocked" : "locked"}">
                <div class="achievement-icon">${achievement.icon}</div>

                <div class="achievement-title">${achievement.title}</div>

                <div class="achievement-desc">${achievement.desc}</div>

                <div class="achievement-level">${achievement.level}</div>

                ${reward ? `<div class="achievement-reward">${reward.text}</div>` : ""}

                <small>${unlocked ? "Получено" : "Не открыто"}</small>
            </div>
        `;

    }).join("");

}
function getCatDelay(){

    let delay = 35000;

    if(game.catsCaught >= 50){
        delay = 90000;
    }else if(game.catsCaught >= 30){
        delay = 70000;
    }else if(game.catsCaught >= 10){
        delay = 50000;
    }

    if(game.dayTime === "night"){
        delay = Math.floor(delay * 0.6);
    }

    return delay;

}
function scheduleNextCat(){

    setTimeout(() => {

        spawnCat();

        scheduleNextCat();

    }, getCatDelay());

} 
function playCatSound(){
if(!game.soundEnabled){
        return;
    }
    if(!UI.catSound){
        return;
    }

    UI.catSound.currentTime = 0;
  UI.catSound.volume = game.effectsVolume / 100;

    UI.catSound.play().catch(() => {});

}

function showVipAdHelpPopup(guest,missingPies){

    pendingVipAdHelp = {
        guest:guest,
        missingPies:missingPies
    };

    if(UI.vipNeedPiesAdText){
        UI.vipNeedPiesAdText.innerHTML =
            "Для VIP-заказа не хватает: <b>" +
            missingPies +
            " 🥟</b><br><br>" +
            "Посмотри рекламу — Баба Галя срочно допечёт пирожки, " +
            "и заказ будет выполнен.";
    }

    if(UI.vipNeedPiesAdPopup){
        UI.vipNeedPiesAdPopup.classList.add("open");
    }

}

function closeVipAdHelpPopup(){

    if(UI.vipNeedPiesAdPopup){
        UI.vipNeedPiesAdPopup.classList.remove("open");
    }

}

function completeVipAfterAd(){

    if(!pendingVipAdHelp || !pendingVipAdHelp.guest){
        closeVipAdHelpPopup();
        return;
    }

    showRewardedAd().then((success) => {

        if(!success){
            showEvent("🎬 Реклама не была просмотрена.");
            return;
        }

        const guest = pendingVipAdHelp.guest;
        const missingPies = Math.max(0, guest.needPies - game.pies);

        game.pies += missingPies;

        closeVipAdHelpPopup();

        pendingVipAdHelp = null;

        acceptVIPGuest();

    });

}

function declineVipAdHelp(){

    pendingVipAdHelp = null;

    closeVipAdHelpPopup();

    showEvent("👑 VIP-заказ отклонён.");

    declineVIPGuest();

}
function showCatRewardPopup(reward){

    pendingCatReward = reward;

    if(UI.catRewardText){
        UI.catRewardText.innerHTML =
            "Кот добавлен в пойманные.<br><br>" +
            "Хочешь получить награду?<br>" +
            "<b>+" + reward.money + " ₽ и +" + reward.rep + " ⭐</b>";
    }

    if(UI.catRewardPopup){
        UI.catRewardPopup.classList.add("open");
    }

}

function closeCatRewardPopup(){

    if(UI.catRewardPopup){
        UI.catRewardPopup.classList.remove("open");
    }

}

function claimCatAdReward(){

    if(!pendingCatReward){
        closeCatRewardPopup();
        return;
    }

    showRewardedAd().then((success) => {

        if(!success){
            showEvent("🎬 Реклама не была просмотрена.");
            return;
        }

        game.money += pendingCatReward.money;
        game.reputation += pendingCatReward.rep;

        showEvent(
            "🎬 Награда получена! +" +
            pendingCatReward.money +
            " ₽ и +" +
            pendingCatReward.rep +
            " ⭐"
        );

        pendingCatReward = null;

        closeCatRewardPopup();

        updateGame();

    });

}

function skipCatAdReward(){

    pendingCatReward = null;

    closeCatRewardPopup();

    showEvent("🐈 Кот пойман без награды.");

    updateGame();

}
function spawnCat(){

if(game.paused){
        return;
    }    
if(!UI.cat){
        console.log("Кот не найден в HTML");
        return;
    }

    if(game.catActive){
        return;
    }

    const catLevel = getCatLevel();

    game.catActive = true;
playCatSound();
    UI.cat.style.display = "block";
    UI.cat.style.left = (window.innerWidth + 320) + "px";
    UI.cat.style.top = (300 + Math.random() * 220) + "px";
    UI.cat.style.zIndex = "999999";
    UI.cat.style.opacity = "1";
    UI.cat.style.transform = "scaleX(-1)";

    if(game.catsCaught >= 50){
        showEvent("🐈🚚 Кот-доставщик выехал с заказом!");
    }else{
        showEvent("🥓 Кот-воришка снова рядом!");
    }

    setTimeout(() => {
        UI.cat.style.left = "-320px";
    },100);

   UI.cat.onclick = () => {

    if(!game.catActive) return;

    const currentCatLevel = getCatLevel();

    game.catActive = false;

    game.catsCaught++;
    addDailyTaskProgress("cats",1);

    UI.cat.style.display = "none";
    UI.cat.style.left = (window.innerWidth + 320) + "px";

    if(game.catsCaught >= 50){

        showEvent("🐈🚚 Кот-доставщик пойман!");

        showCatRewardPopup({
            money:700,
            rep:3
        });

        if(typeof addNews === "function"){
            addNews(
                "🐈🚚 Кот-доставщик пойман",
                "Кот-доставщик снова помог Бабе Гале. Награду можно получить за рекламу."
            );
        }

    }else{

        showEvent("🐈 Кот пойман!");

        showCatRewardPopup({
            money:300,
            rep:1
        });

        if(typeof addNews === "function"){
            addNews(
                "🐈 Кот пойман",
                "Баба Галя поймала кота. Всего поймано котов: " + game.catsCaught + "."
            );
        }

    }

    updateGame();

};

    setTimeout(() => {

        if(game.catActive){

            const currentCatLevel = getCatLevel();

            game.catActive = false;

            if(game.catsCaught >= 50){

                game.money += 200;
                game.reputation += 1;

                showEvent("🐈🚚 Кот-доставщик оставил заказ у двери! +200 ₽ и +1 ⭐");

                if(typeof addNews === "function"){
                    addNews(
                        "🚚 Доставка выполнена",
                        "Кот-доставщик помог Бабе Гале доставить пирожки жителям города."
                    );
                }

            }else{

                game.money = Math.max(0, game.money - currentCatLevel.penalty);

                showEvent("🥓 Кот украл сосиски! -" + currentCatLevel.penalty + " ₽");
setGrandmaEmotion("angry",2500);

                if(typeof addNews === "function"){
                    addNews(
                        "🥓 Кот украл сосиски",
                        "Кот-воришка снова убежал. Баба Галя потеряла " + currentCatLevel.penalty + " ₽."
                    );
                }

            }

            UI.cat.style.display = "none";
            UI.cat.style.left = (window.innerWidth + 320) + "px";

            updateGame();

        }

    },6000);

}
function getHelper(id){
    return HELPERS.find(helper => helper.id === id);
}

function getHelperPrice(id){

    const helper = getHelper(id);

    if(!helper) return 0;

    const level = game.helpers[helper.id] || 0;

    if(helper.price === 0){
        return 0;
    }

    return Math.floor(helper.price * Math.pow(helper.grow, level));

}

function isHelperUnlocked(helper){

    if(helper.catRequired && game.catsCaught < helper.catRequired){
        return false;
    }

    return stageIndex(game.maxStage || game.stage) >= stageIndex(helper.stage);

}
function renderHelpers(){

    if(!UI.helperList) return;

    UI.helperList.innerHTML = HELPERS.map(helper => {

        const level = getHelperLevel(helper.id);
        const price = getHelperCost(helper);

        const stageLocked = stageIndex(game.maxStage || game.stage) < stageIndex(helper.stage);

        const catLocked = helper.catRequired && game.catsCaught < helper.catRequired;

        const maxed = level >= helper.maxLevel;

        let buttonText = "Нанять: " + price.toLocaleString("ru-RU") + " ₽";

        if(level > 0){
            buttonText = "Улучшить: " + price.toLocaleString("ru-RU") + " ₽";
        }

        if(maxed){
            buttonText = "Максимум";
        }

        if(stageLocked){
            buttonText = "Откроется: " + getStageTitle(helper.stage);
        }

        if(catLocked){
            buttonText = "Нужно поймать кота: " + helper.catRequired;
        }

        return `
            <div class="helper-card ${stageLocked || catLocked ? "locked" : ""}">
                <div class="helper-icon">${helper.icon}</div>

                <h3>${helper.title}</h3>

                <div class="helper-role">${helper.role}</div>

                <p>${helper.desc}</p>

                <div class="helper-info">
                    ${helper.effectText}
                </div>

                <div class="helper-level">
                    Уровень: ${level} / ${helper.maxLevel}
                </div>

                <button 
                    type="button" 
                    data-helper="${helper.id}" 
                    ${stageLocked || catLocked || maxed ? "disabled" : ""}
                >
                    ${buttonText}
                </button>
            </div>
        `;

    }).join("");

    UI.helperList.querySelectorAll("[data-helper]").forEach(button => {
        button.addEventListener("click", () => {
            hireHelper(button.dataset.helper);
        });
    });

}
function getHelperStatusText(helper){

    if(helper.catRequired && game.catsCaught < helper.catRequired){
        return "🔒 Нужно поймать кота " + helper.catRequired + " раз";
    }

    if(stageIndex(game.maxStage || game.stage) < stageIndex(helper.stage)){
        return "🔒 Откроется: " + getStageTitle(helper.stage);
    }

    return "✅ Доступен";

}

function updateHelpers(){

    if(!UI.helperList) return;

    renderHelpers();

}
function showNotEnoughMoneyPopup(needMoney){

    if(UI.notEnoughMoneyText){
        UI.notEnoughMoneyText.textContent =
            "Для покупки помощника нужно заработать ещё " +
            needMoney.toLocaleString("ru-RU") +
            " ₽.";
setGrandmaEmotion("sad",2200);
    }

    if(UI.notEnoughMoneyPopup){
        UI.notEnoughMoneyPopup.classList.add("open");
    }

}

function closeNotEnoughMoneyPopup(){

    if(UI.notEnoughMoneyPopup){
        UI.notEnoughMoneyPopup.classList.remove("open");
    }

}
function hireHelper(helperId){

    const helper = HELPERS.find(item => item.id === helperId);

    if(!helper) return;

    if(!game.helpers){
        game.helpers = {};
    }

    const level = getHelperLevel(helper.id);

    if(level >= helper.maxLevel){
        showEvent("👥 Этот помощник уже достиг максимального уровня.");
        return;
    }

    if(helper.catRequired && game.catsCaught < helper.catRequired){
        showEvent("🐈 Сначала поймай кота " + helper.catRequired + " раз.");
        return;
    }

    if(stageIndex(game.maxStage || game.stage) < stageIndex(helper.stage)){
        showEvent("🔒 Этот помощник откроется позже.");
        return;
    }

    const price = getHelperCost(helper);

    if(game.money < price){

    const needMoney = price - game.money;

    showNotEnoughMoneyPopup(needMoney);

    showEvent("💸 Не хватает денег на помощника.");

    return;

}
playBuySound();
    game.money -= price;

    game.helpers[helper.id] = level + 1;

    showEvent("👥 Нанят помощник: " + helper.title + "! Роль: " + helper.role);

    if(typeof addNews === "function"){
        addNews(
            "👥 Новый помощник",
            helper.title + " теперь помогает Бабе Гале. Роль: " + helper.role + "."
        );
    }

    updateGame();

}
function getHelperCost(helper){

    const level = getHelperLevel(helper.id);

    if(helper.price === 0){
        return 0;
    }

    return Math.floor(helper.price * Math.pow(helper.grow, level));

}
function getAvailableRandomEvents(){

    return EVENTS.filter(event => {

        const stageOk =
            stageIndex(game.maxStage || game.stage) >= stageIndex(event.minStage);

        const dayTimeOk =
            !event.dayTime || event.dayTime === game.dayTime;

        return stageOk && dayTimeOk;

    });

}

function chooseRandomEvent(events){

    const totalChance = events.reduce((sum,event) => {
        return sum + event.chance;
    },0);

    let random = Math.random() * totalChance;

    for(const event of events){

        random -= event.chance;

        if(random <= 0){
            return event;
        }

    }

    return events[0];

}

function randomEvent(){
 if(game.paused){
        return;
    }
    const availableEvents = getAvailableRandomEvents();

    if(availableEvents.length === 0){
        return;
    }

    const event = chooseRandomEvent(availableEvents);

    event.effect();

    showEvent(event.title,event.type);

    if(typeof addNews === "function"){
        addNews(
            event.title,
            event.text
        );
    }

    if(typeof setGrandmaEmotion === "function"){

        if(event.type === "bad"){
            setGrandmaEmotion("sad",2200);
        }else if(event.type === "legendary" || event.type === "rare"){
            setGrandmaEmotion("surprised",2400);
        }else{
            setGrandmaEmotion("happy",1600);
        }

    }

    updateGame();

}
function stopBackgroundMusicForNewLife(){

    if(UI.backgroundMusic){
        UI.backgroundMusic.pause();
    }

    game.musicEnabled = false;

}

function resumeBackgroundMusicAfterNewLife(){

    if(!game.soundEnabled){
        return;
    }

    game.musicEnabled = true;

    updateMusic();
    updateSoundButton();
    saveGame();

}

function playNewLifeSound(){

    if(!game.soundEnabled){
        resumeBackgroundMusicAfterNewLife();
        return;
    }

    if(!UI.newLifeSound){
        resumeBackgroundMusicAfterNewLife();
        return;
    }

    UI.newLifeSound.pause();
    UI.newLifeSound.currentTime = 0;
    UI.newLifeSound.volume = game.effectsVolume / 100;

    UI.newLifeSound.onended = () => {
        UI.newLifeSound.onended = null;
        resumeBackgroundMusicAfterNewLife();
    };

    UI.newLifeSound.play().catch(() => {
        resumeBackgroundMusicAfterNewLife();
    });

}
function openNewLifeChoicePopup(){

    if(UI.newLifeChoicePopup){
        UI.newLifeChoicePopup.classList.add("open");
    }

}

function closeNewLifeChoicePopup(){

    if(UI.newLifeChoicePopup){
        UI.newLifeChoicePopup.classList.remove("open");
    }

}



function startNewLifeWithAdReward(){

    showRewardedAd().then((success) => {

        if(!success){
            showEvent("🎬 Реклама не была просмотрена.");
            return;
        }

        closeNewLifeChoicePopup();

        newLifeGame(true);

    });

}
function newLifeGame(withAdGift){
    forceClosePause();

    closeNewLifeChoicePopup();

    if(UI.finalGoalPopup){
        UI.finalGoalPopup.classList.remove("open");
        UI.finalGoalPopup.style.display = "none";
    }
    game.paused = false;

    if(UI.pauseModal){
        UI.pauseModal.classList.remove("open");
    }

    if(UI.pauseButton){
        UI.pauseButton.innerHTML = "⏸<span>Пауза</span>";
    }

    if(UI.eventBar){
        UI.eventBar.textContent = "👑 Новая жизнь началась!";
    }

    stopBackgroundMusicForNewLife();

    playNewLifeSound();

    Object.assign(game,{
        money: withAdGift ? 500 : 0,
        pies: withAdGift ? 50 : 0,
        salesBuffer:0,
        productionBuffer:0,
        reputation: withAdGift ? 3 : 0,
        clickIncome:1,
        autoIncome:0,
        stage:"kitchen",
        maxStage:"kitchen",
        upgrades:{},
        achievements:[],
        catActive:false,
        catsCaught:0,
        questRewardClaimed:false,
        activeQuests:[],
        currentOrder:null,
        ordersCompleted:0,
        currentRecipe:"potato_pie",
        recipeLevels:{},
        helpers:{},
        newspaper:[],
        tutorialStep:0,
        tutorialDone:false,
        dailyTasks:[],
        dailyTasksDate:"",
        dailyTasksProgress:{},
        dailyTasksClaimed:[],
        musicEnabled:false,
        soundEnabled:game.soundEnabled,
        musicVolume:game.musicVolume,
        effectsVolume:game.effectsVolume,
        paused:false
    });

    setupDefaultUpgrades();
    setupQuests();
    setupOrder();

    localStorage.removeItem(SAVE_KEY);

    updateGame();
    updateSoundSettingsUI();
    updateSoundButton();

    if(withAdGift){
        showEvent("🎁 Новая жизнь началась с подарком: +500 ₽, +50 🥟 и +3 ⭐");
    }else{
        showEvent("👑 Новая жизнь началась!");
    }

}
function showEvent(text,type){

    if(!UI.eventBar) return;

    UI.eventBar.textContent = text;

    UI.eventBar.classList.remove(
        "good-event",
        "bad-event",
        "rare-event",
        "legendary-event"
    );

    if(type === "good"){
        UI.eventBar.classList.add("good-event");
    }

    if(type === "bad"){
        UI.eventBar.classList.add("bad-event");
    }

    if(type === "rare"){
        UI.eventBar.classList.add("rare-event");
    }

    if(type === "legendary"){
        UI.eventBar.classList.add("legendary-event");
    }

    clearTimeout(showEvent.timer);

    showEvent.timer = setTimeout(() => {
        UI.eventBar.textContent = "👵 Баба Галя печёт пирожки...";
        UI.eventBar.classList.remove(
            "good-event",
            "bad-event",
            "rare-event",
            "legendary-event"
        );
    },6000);

}
function floatMoney(text){

    const button = UI.pieButton;

    if(!button) return;

    const rect = button.getBoundingClientRect();

    const item = document.createElement("div");

    item.textContent = text;

    item.style.position = "fixed";

    item.style.left =
        (rect.left + rect.width / 2) + "px";

    item.style.top =
        (rect.top + rect.height / 2) + "px";

    item.style.transform =
        "translate(-50%, -50%)";

    item.style.fontSize = "34px";

    item.style.fontWeight = "bold";

    item.style.color = "#ffe066";

    item.style.textShadow =
        "2px 2px 6px rgba(0,0,0,.8)";

    item.style.pointerEvents = "none";

    item.style.zIndex = "9999";

    item.style.transition =
        "all .8s ease";

    document.body.appendChild(item);

    requestAnimationFrame(() => {

        item.style.top =
            (rect.top - 20) + "px";

        item.style.opacity = "0";

    });

    setTimeout(() => {

        item.remove();

    },850);

}
function saveGame(){localStorage.setItem(SAVE_KEY,JSON.stringify(game))}
function loadGame(){const s=localStorage.getItem(SAVE_KEY);
if(!s)return;try{Object.assign(game,JSON.parse(s))}catch(e){console.log("Ошибка загрузки:",e)}}
function resetSave(){localStorage.removeItem(SAVE_KEY);location.reload()}
function setupQuests(){

    if(!Array.isArray(game.activeQuests)){
        game.activeQuests = [];
    }

    if(game.activeQuests.length !== 3){
        game.activeQuests = getRandomQuests(3);
        game.questRewardClaimed = false;
    }

    QUESTS = game.activeQuests;

}

function getRandomQuests(count){

    const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5);

    return shuffled.slice(0,count);

}

function refreshQuests(){

    game.activeQuests = getRandomQuests(3);

    QUESTS = game.activeQuests;

    game.questRewardClaimed = false;

    showEvent("📖 В книге появились новые поручения!");

    updateGame();

}
function setupOrder(){

    if(!game.currentOrder){
        createNewOrder();
        return;
    }

    if(!game.orderDeadline || getOrderTimeLeft() <= 0){
        createNewOrder();
    }

}


function getRandomOrder(){

    const currentStageIndex = stageIndex(game.maxStage || game.stage);

    const availableOrders = ORDER_POOL.filter(order => {
        return stageIndex(order.stage) <= currentStageIndex;
    });

    return availableOrders[
        Math.floor(Math.random() * availableOrders.length)
    ];

}
function getOrderTimeLimit(order){

    if(!order){
        return 120000;
    }

    if(order.difficulty === "easy"){
        return 180000; // 3 минуты
    }

    if(order.difficulty === "medium"){
        return 240000; // 4 минуты
    }

    if(order.difficulty === "hard"){
        return 300000; // 5 минут
    }

    if(order.difficulty === "very-hard"){
        return 420000; // 7 минут
    }

    if(order.difficulty === "legendary"){
        return 600000; // 10 минут
    }

    return 180000;

}

function startOrderTimer(order){

    game.orderTimeLimit = getOrderTimeLimit(order);

    game.orderDeadline = Date.now() + game.orderTimeLimit;

}

function getOrderTimeLeft(){

    if(!game.orderDeadline){
        return 0;
    }

    return Math.max(0, game.orderDeadline - Date.now());

}

function formatOrderTime(ms){

    const totalSeconds = Math.ceil(ms / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");

}

function createNewOrder(){

    game.currentOrder = getRandomOrder();

    startOrderTimer(game.currentOrder);

}
function updateOrder(){

    if(!game.currentOrder){
        createNewOrder();
    }

    const order = game.currentOrder;

    const timeLeft = getOrderTimeLeft();

    if(timeLeft <= 0){

        showEvent("⏰ Время заказа вышло! Клиент ушёл.");

        if(typeof addNews === "function"){
            addNews(
                "⏰ Заказ не выполнен",
                "Клиент не дождался пирожков, и заказ пришлось заменить."
            );
        }

        createNewOrder();

        updateGame();

        return;
    }

    if(UI.orderCard){
        UI.orderCard.className = "order-card order-" + (order.difficulty || "easy");
    }

    if(UI.orderPerson){
        UI.orderPerson.textContent = order.person;
    }

    if(UI.orderText){
        UI.orderText.innerHTML = `
            <strong>${order.title || "Заказ"}</strong><br>
            <span class="order-difficulty">${order.difficultyText || "🟢 Простой"}</span><br>
            <span class="order-timer">⏰ Осталось: ${formatOrderTime(timeLeft)}</span><br>
            ${order.text}
        `;
    }

    if(UI.orderNeed){
        UI.orderNeed.textContent = order.needPies.toLocaleString("ru-RU");
    }

    if(UI.orderReward){
        UI.orderReward.textContent = order.rewardMoney.toLocaleString("ru-RU");
    }

    if(UI.orderRep){
        UI.orderRep.textContent = order.rewardRep.toLocaleString("ru-RU");
    }

    if(UI.completeOrderButton){
        UI.completeOrderButton.disabled = game.pies < order.needPies;
    }

}
function playOrderSound(){

    if(!game.soundEnabled){
        return;
    }

    if(!UI.orderSound){
        return;
    }

    UI.orderSound.currentTime = 0;
    UI.orderSound.volume = game.effectsVolume / 100;

    UI.orderSound.play().catch(() => {});

}
function completeOrder(){

    const order = game.currentOrder;

    if(!order){
        game.currentOrder = getRandomOrder();
        updateGame();
        return;
    }

    if(game.pies < order.needPies){
        showEvent("🥟 Не хватает пирожков для заказа!");
        return;
setGrandmaEmotion("sad",2200);
    }
if(!game.tutorialDone && game.tutorialStep === 3){
    game.tutorialStep++;
}
playOrderSound();
    game.pies -= order.needPies;
   let finalRewardMoney = order.rewardMoney;
let finalRewardRep = order.rewardRep;

if(game.dayTime === "morning"){
    finalRewardRep += 1;
}

game.money += finalRewardMoney;
addDailyTaskProgress("money",finalRewardMoney);
game.reputation += finalRewardRep;
    game.ordersCompleted++;
addDailyTaskProgress("orders",1);
addNews(
    "🧺 Выполнен заказ",
    order.person + " получил заказ на " + order.needPies + " пирожков. Город снова доволен Бабой Галей."
);
    showEvent("🧺 Заказ выполнен! +" + finalRewardMoney + " ₽ и +" + finalRewardRep + " ⭐");
setGrandmaEmotion("happy",2200);
  createNewOrder();

    updateGame();

}
function playNewsSound(){

    if(!game.soundEnabled){
        return;
    }

    if(!UI.newsSound){
        return;
    }

    UI.newsSound.currentTime = 0;
   UI.newsSound.volume = game.effectsVolume / 100;

    UI.newsSound.play().catch(() => {});

}
function openModal(id){

    const modal = document.getElementById(id);

    if(!modal) return;

    if(id === "newsModal"){
        playNewsSound();
    }

    modal.classList.add("open");

}

function closeModal(id){

    const modal = document.getElementById(id);

    if(!modal) return;

    if(id === "newsModal"){
        playNewsSound();
    }

    modal.classList.remove("open");

}
function getRecipe(id){
    return RECIPES.find(recipe => recipe.id === id);
}

function getRecipeLevel(recipeId){
    if(!game.recipeLevels){
        game.recipeLevels = {};
    }

    return Number(game.recipeLevels[recipeId]) || 0;
}

function getRecipeMoneyBonus(recipe){
    const level = getRecipeLevel(recipe.id);

    return recipe.baseMoneyBonus + level * recipe.moneyPerLevel;
}

function getRecipeRepChance(recipe){
    const level = getRecipeLevel(recipe.id);

    return recipe.baseRepChance + level * recipe.repPerLevel;
}

function getRecipeUpgradePrice(recipe){
    const level = getRecipeLevel(recipe.id);

    return Math.floor(recipe.upgradePrice * Math.pow(recipe.grow, level));
}

function upgradeRecipe(recipeId){

    const recipe = getRecipe(recipeId);

    if(!recipe) return;

    const level = getRecipeLevel(recipe.id);

    if(level >= recipe.maxLevel){
        showEvent("🥟 Этот рецепт уже улучшен до максимума.");
        return;
    }

    if(!isRecipeUnlocked(recipe)){
        showEvent("🔒 Этот рецепт откроется на этапе: " + getStageTitle(recipe.stage));
        return;
    }

    const price = getRecipeUpgradePrice(recipe);

    if(game.money < price){
        showEvent("💸 Не хватает денег на улучшение рецепта.");
        return;
    }
playBuySound();

    game.money -= price;

    game.recipeLevels[recipe.id] = level + 1;

    showEvent("🥟 Рецепт улучшен: " + recipe.title + " — уровень " + (level + 1));

    if(typeof setGrandmaEmotion === "function"){
        setGrandmaEmotion("happy",1800);
    }

    if(typeof addNews === "function"){
        addNews(
            "🥟 Улучшен рецепт",
            "Баба Галя улучшила рецепт «" + recipe.title + "» до уровня " + (level + 1) + "."
        );
    }

    updateGame();

}
function isRecipeUnlocked(recipe){

    return stageIndex(game.maxStage) >= stageIndex(recipe.stage);

}

function renderRecipes(){

    if(!UI.recipeList) return;

    UI.recipeList.innerHTML = RECIPES.map(recipe => {

        const unlocked = isRecipeUnlocked(recipe);
        const active = game.currentRecipe === recipe.id;
        const level = getRecipeLevel(recipe.id);
        const moneyBonus = getRecipeMoneyBonus(recipe);
        const repChance = Math.round(getRecipeRepChance(recipe) * 100);
        const upgradePrice = getRecipeUpgradePrice(recipe);
        const maxed = level >= recipe.maxLevel;

        let upgradeButtonText = "Улучшить: " + upgradePrice.toLocaleString("ru-RU") + " ₽";

        if(maxed){
            upgradeButtonText = "Максимум";
        }

        if(!unlocked){
            upgradeButtonText = "Закрыто";
        }

        return `
            <div class="recipe-card ${active ? "active" : ""} ${!unlocked ? "locked" : ""}">
                <div class="recipe-icon">${recipe.icon}</div>

                <div class="recipe-title">${recipe.title}</div>

                <div class="recipe-desc">${recipe.desc}</div>

                <div class="recipe-level">
                    Уровень: ${level} / ${recipe.maxLevel}
                </div>

                <div class="recipe-bonus">
                    💰 Цена пирожка: +${moneyBonus} ₽
                </div>

                <div class="recipe-rep">
                    ⭐ Шанс репутации: ${repChance}%
                </div>

                <div class="recipe-special">
                    ${recipe.special}
                </div>

                <div class="recipe-stage">
                    ${unlocked ? "✅ Доступен" : "🔒 Откроется: " + getStageTitle(recipe.stage)}
                </div>

                <button 
                    type="button" 
                    data-recipe="${recipe.id}"
                    ${!unlocked ? "disabled" : ""}
                >
                    ${active ? "Выбран" : "Выбрать"}
                </button>

                <button 
                    type="button" 
                    data-upgrade-recipe="${recipe.id}"
                    ${!unlocked || maxed ? "disabled" : ""}
                >
                    ${upgradeButtonText}
                </button>
            </div>
        `;

    }).join("");

    UI.recipeList.querySelectorAll("[data-recipe]").forEach(button => {
        button.addEventListener("click",() => {
            selectRecipe(button.dataset.recipe);
        });
    });

    UI.recipeList.querySelectorAll("[data-upgrade-recipe]").forEach(button => {
        button.addEventListener("click",() => {
            upgradeRecipe(button.dataset.upgradeRecipe);
        });
    });

}
function updateRecipes(){

    if(!UI.recipeList) return;

    renderRecipes();

    const recipe = getRecipe(game.currentRecipe) || RECIPES[0];

    if(UI.currentRecipeBadge){
        const level = getRecipeLevel(recipe.id);

        UI.currentRecipeBadge.textContent =
            "Сейчас печём: " +
            recipe.icon +
            " " +
            recipe.title.toLowerCase() +
            " · ур. " +
            level;
    }

}
function selectRecipe(id){

    const recipe = getRecipe(id);

    if(!recipe) return;

    if(!isRecipeUnlocked(recipe)){

        showEvent("🔒 Этот рецепт откроется на этапе: " + getStageTitle(recipe.stage));

        return;

    }

    game.currentRecipe = id;

    showEvent("🥟 Выбран рецепт: " + recipe.title);

    if(typeof addNews === "function"){

        addNews(
            "🥟 Новый рецепт в меню",
            "Баба Галя теперь печёт пирожок: " + recipe.title + ". " + recipe.desc
        );

    }

    updateGame();

}
function seedNews(){

    if(!Array.isArray(game.newspaper)){
        game.newspaper = [];
    }

    if(game.newspaper.length === 0){

        addNews(
            "👵 Первый выпуск",
            "Город с интересом наблюдает, как Баба Галя начинает свой путь и печёт первые пирожки."
        );

    }

}
function addNews(title,text){

    if(!Array.isArray(game.newspaper)){
        game.newspaper = [];
    }

    game.newspaper.unshift({
        title:title,
        text:text,
        date:new Date().toLocaleString("ru-RU")
    });

    if(game.newspaper.length > 12){
        game.newspaper.length = 12;
    }

}

function renderNews(){

    if(!UI.newsList) return;

    if(!game.newspaper || game.newspaper.length === 0){
        UI.newsList.innerHTML = `
            <div class="news-card">
                <h3>📰 Пока новостей нет</h3>
                <p>Скоро в городе начнут происходить интересные события.</p>
            </div>
        `;
        return;
    }

    UI.newsList.innerHTML = game.newspaper.map(item => `
        <div class="news-card">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
            <div class="news-date">${item.date}</div>
        </div>
    `).join("");

}
function getAvailableVIPGuests(){

    return VIP_GUESTS.filter(guest => {
        return stageIndex(game.maxStage || game.stage) >= stageIndex(guest.stage)
            && game.reputation >= guest.minRep;
    });

}

function checkVIPGuest(){
 if(game.paused){
        return;
    }
    if(game.vipActive) return;

    const availableGuests = getAvailableVIPGuests();

    if(availableGuests.length === 0){
        return;
    }

    let vipChance = 0.65;

    if(game.dayTime === "evening"){
        vipChance = 0.85;
    }

    const chance = Math.random();

    if(chance > vipChance){
        return;
    }

    const guest = availableGuests[
        Math.floor(Math.random() * availableGuests.length)
    ];

    showVIPGuest(guest);

}
function playVIPSound(){
if(!game.soundEnabled){
        return;
    }


    if(!UI.vipSound){
        return;
    }

    UI.vipSound.currentTime = 0;
    UI.vipSound.volume = game.effectsVolume / 100;

    UI.vipSound.play().catch(() => {});

}
function showVIPGuest(guest){
playVIPSound();

    game.vipActive = true;
    game.currentVIP = guest;

    if(UI.vipGuestAvatar){
    UI.vipGuestAvatar.src = guest.avatar;
    UI.vipGuestAvatar.alt = guest.name;
}

    if(UI.vipGuestName){
        UI.vipGuestName.textContent = guest.name;
    }

    if(UI.vipGuestText){
        UI.vipGuestText.textContent = guest.text;
    }

    if(UI.vipNeedPies){
        UI.vipNeedPies.textContent = guest.needPies.toLocaleString("ru-RU");
    }

    if(UI.vipRewardMoney){
        UI.vipRewardMoney.textContent = guest.rewardMoney.toLocaleString("ru-RU");
    }

    if(UI.vipRewardRep){
        UI.vipRewardRep.textContent = guest.rewardRep.toLocaleString("ru-RU");
    }

    if(UI.vipPopup){
    UI.vipPopup.style.display = "flex";
    UI.vipPopup.classList.add("open");
}

    showEvent("👑 В игре появился VIP-гость!");
setGrandmaEmotion("surprised",2500);
}

function closeVIPGuest(){

    game.vipActive = false;
    game.currentVIP = null;

    if(UI.vipPopup){
        UI.vipPopup.classList.remove("open");
        UI.vipPopup.style.display = "none";
    }

    closeNotEnoughPiesPopup();

    saveGame();
    updateHUD();
    renderNews();

}
function showNotEnoughPiesPopup(needPies){

    if(UI.notEnoughPiesText){
        UI.notEnoughPiesText.textContent =
            "Для VIP-заказа нужно испечь ещё " +
            needPies +
            " пирожков.";
    }

    if(UI.notEnoughPiesPopup){
        UI.notEnoughPiesPopup.style.display = "flex";
        UI.notEnoughPiesPopup.classList.add("open");
    }

}

function closeNotEnoughPiesPopup(){

    if(UI.notEnoughPiesPopup){
        UI.notEnoughPiesPopup.classList.remove("open");
        UI.notEnoughPiesPopup.style.display = "none";
    }

}

function acceptVIPGuest(){

    const guest = game.currentVIP;

    if(!guest){
        closeVIPGuest();
        return;
    }
if(game.pies < guest.needPies){

    const missingPies = guest.needPies - game.pies;

    if(UI.vipPopup){
        UI.vipPopup.classList.remove("open");
        UI.vipPopup.style.display = "none";
    }

    showVipAdHelpPopup(guest,missingPies);

    showEvent("🥟 Не хватает пирожков для VIP-заказа!");

    if(typeof setGrandmaEmotion === "function"){
        setGrandmaEmotion("sad",2500);
    }

    return;

}
    game.pies -= guest.needPies;
    game.money += guest.rewardMoney;
    game.reputation += guest.rewardRep;
    game.vipOrdersCompleted++;

    showEvent(
        "👑 VIP-заказ выполнен! +" +
        guest.rewardMoney +
        " ₽ и +" +
        guest.rewardRep +
        " ⭐"
    );

    if(typeof addNews === "function"){
        addNews(
            "👑 VIP-заказ выполнен",
            guest.name + " остался доволен заказом Бабы Гали."
        );
    }

    closeVIPGuest();

}
function declineVIPGuest(){

    showEvent("😢 VIP-гость ушёл без пирожков.");

    if(typeof setGrandmaEmotion === "function"){
        setGrandmaEmotion("sad",2500);
    }

    closeVIPGuest();

}
function getQuestProgress(quest){

    if(quest.type === "pies") return game.pies;

    if(quest.type === "money") return game.money;

    if(quest.type === "reputation") return game.reputation;

    if(quest.type === "cats") return game.catsCaught;

    if(quest.type === "orders") return game.ordersCompleted;

    return 0;

}
function updateQuests(){
    if(!UI.questList) return;

    UI.questList.className = "quest-grid";

    UI.questList.innerHTML = QUESTS.map(quest => {
        const progress = Math.min(
            getQuestProgress(quest),
            quest.target
        );

        const done = progress >= quest.target;

        return `
            <div class="quest-card ${done ? "done" : ""}">
                <h3>${quest.person}</h3>
                <p>${quest.text}</p>
                <div class="quest-progress">
                    ${Math.floor(progress).toLocaleString("ru-RU")}
                    /
                    ${quest.target.toLocaleString("ru-RU")}
                </div>
            </div>
        `;
    }).join("");

    if(UI.claimQuestReward){
        UI.claimQuestReward.disabled = !allQuestsDone() || game.questRewardClaimed;
    }
}

function allQuestsDone(){
    return QUESTS.every(quest =>
        getQuestProgress(quest) >= quest.target
    );
}

function claimQuestReward(){
    if(!allQuestsDone()){
        showEvent("📖 Сначала выполни все поручения!");
        return;
    }

    if(game.questRewardClaimed){
        showEvent("🎁 Подарок уже получен!");
        return;
    }

    game.money += 10000;
    game.reputation += 20;
    game.questRewardClaimed = true;
addNews(
    "🎁 Город благодарит Бабу Галю",
    "Все поручения выполнены! Жители собрали для Бабы Гали общий подарок."
);
    showEvent("🎁 Жители города подарили +10000 ₽ и +20 ⭐");

    updateGame();
}
document.addEventListener("DOMContentLoaded",initGame);