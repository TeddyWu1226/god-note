import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {UnitStatus} from "@/constants/status/unit-status";
import {checkProbability} from "@/utils/math";

export class RiftSlime extends MonsterModel {
    constructor() {
        super({
            icon: '🟢',
            code: 'RiftSlime',
            name: '裂谷史萊姆',
            description: '在被撕裂的地縫中蠕動的史萊姆，極不穩定',
            ad: 35,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 12,
            dodge: 10,
            hit: 35,
            hp: 250,
            hpLimit: 250,
            level: 16,
            dropGold: 35,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class CanyonHarpy extends MonsterModel {
    constructor() {
        super({
            icon: '🧚',
            code: 'CanyonHarpy',
            name: '峽谷女妖',
            description: '佔領峭壁的半人半鳥魔物，其尖嘯能擾亂心神',
            ad: 40,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 8,
            dodge: 20,
            hit: 40,
            hp: 220,
            hpLimit: 220,
            level: 16,
            dropGold: 38,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.5)) {
            playerStore.addStatus(UnitStatus.Blind);
            logStore.logger.add(`女妖發出刺耳尖嘯，你的命中降低了！`);
        }
    }
}

export class WindCutter extends MonsterModel {
    constructor() {
        super({
            icon: '🌀',
            code: 'WindCutter',
            name: '風刃元素',
            description: '峽谷中強烈亂流凝聚而成的風元素，攻擊頻繁且銳利',
            ad: 45,
            critIncrease: 250,
            critRate: 20,
            adDefend: 10,
            dodge: 30,
            hit: 45,
            hp: 240,
            hpLimit: 240,
            level: 17,
            dropGold: 40,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class ThunderLizard extends MonsterModel {
    constructor() {
        super({
            icon: '🦎',
            code: 'ThunderLizard',
            name: '雷擊蜥蜴',
            description: '能引導谷底雷電力量的奇特蜥蜴，攻擊附帶麻痺雷擊',
            ad: 42,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 15,
            dodge: 15,
            hit: 35,
            hp: 270,
            hpLimit: 270,
            level: 17,
            dropGold: 45,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }

    override onAttackHitHook({playerStore, logStore}: any) {
        if (checkProbability(0.4)) {
            playerStore.addStatus(UnitStatus.Shock);
            logStore.logger.add(`你被雷電擊中，進入感電狀態。`);
        }
    }
}

export class SkySlasher extends MonsterModel {
    constructor() {
        super({
            icon: '🦅',
            code: 'SkySlasher',
            name: '裂空雕',
            class: 'elite',
            description: '峽谷頂端稱霸的猛禽，能以驚人的速度連續襲擊獵物',
            ad: 75,
            critIncrease: 200,
            critRate: 30,
            adDefend: 15,
            dodge: 40,
            hit: 60,
            hp: 420,
            hpLimit: 420,
            level: 19,
            dropGold: 120
        });
    }

    override onStartHook() {
        this.addEffect(UnitStatus.Flying);
    }
}

export class EchoStone extends MonsterModel {
    constructor() {
        super({
            icon: '🗿',
            code: 'EchoStone',
            name: '迴音石像',
            class: 'elite',
            description: '能吸收聲音並反彈能量的奇異石像，防禦非常頑固',
            ad: 65,
            critIncrease: WorldDefault.critIncrease,
            critRate: 10,
            adDefend: 40,
            dodge: -10,
            hit: 40,
            hp: 500,
            hpLimit: 500,
            level: 19,
            dropGold: 130
        });
    }

    override onAttackedHook({playerStore, logStore, damage}: any) {
        if (damage && damage.totalDamage > 0 && checkProbability(0.5)) {
            const reflect = Math.round(damage.totalDamage * 0.25);
            const result = playerStore.takeDamage(reflect);
            if (result.shieldAbsorbed > 0) {
                logStore.logger.add(`🛡️ 護盾吸收了 ${result.shieldAbsorbed} 點傷害！`);
            }
            logStore.logger.add(`🗿 迴音石像反射了音波，對玩家造成了 ${reflect} 點震盪傷害！`);
        }
    }
}

export class CanyonSpecter extends MonsterModel {
    constructor() {
        super({
            icon: '👻',
            code: 'CanyonSpecter',
            name: '峽谷幽靈',
            description: '不幸墜谷的冒險者靈魂凝聚而成的幽靈，普通攻擊很難觸碰到它',
            ad: 50,
            critIncrease: WorldDefault.critIncrease,
            critRate: 15,
            adDefend: 15,
            dodge: 45,
            hit: 40,
            hp: 290,
            hpLimit: 290,
            level: 18,
            dropGold: 50,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export class ShadowLeopard extends MonsterModel {
    constructor() {
        super({
            icon: '🐆',
            code: 'ShadowLeopard',
            name: '幽影豹',
            description: '利用峽谷岩石陰影隱藏身形的凶猛野獸，一擊必殺',
            ad: 52,
            critIncrease: 250,
            critRate: 25,
            adDefend: 14,
            dodge: 25,
            hit: 50,
            hp: 280,
            hpLimit: 280,
            level: 18,
            dropGold: 55,
            drop: [{item: Material.LowerNormal, chance: 0.5}]
        });
    }
}

export const SplitCanyonMonster = {
    RiftSlime: new RiftSlime(),
    CanyonHarpy: new CanyonHarpy(),
    WindCutter: new WindCutter(),
    ThunderLizard: new ThunderLizard(),
    SkySlasher: new SkySlasher(),
    EchoStone: new EchoStone(),
    CanyonSpecter: new CanyonSpecter(),
    ShadowLeopard: new ShadowLeopard()
};
