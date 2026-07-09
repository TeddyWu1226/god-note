import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {playerAdjustSanity} from "@/constants/status/advanced-status-utils";
import EvnStatus from "@/constants/status/evn-status";
import {
    GameStateStoreType,
    MonsterActionParams,
    MonsterOnAttackedParams,
    MonsterOnAttackHitParams,
    MonsterOnAttackParams
} from "@/types";
import {UsualStatus} from "@/constants/status/usual-status";
import {applySkillDamage} from "@/constants/fight-func";

// ==========================================
// 幻想系列環境適應怪物 (Split Adaptable Monsters)
// ==========================================

export class SplitSlime extends MonsterModel {
    constructor() {
        super({
            icon: '⚪',
            code: 'SplitSlime',
            name: '幻想史萊姆',
            class: [],
            description: '受到龐大能量輻射影響化為幻想體的史萊姆魔物，會因為現在屬於白日/黑夜影響，轉化為對應能量型態。',
            ad: 45,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 30,
            dodge: 60,
            hit: 100,
            hp: 400,
            hpLimit: 400,
            level: 40,
            dropGold: 90,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook({gameStateStore}: MonsterActionParams) {
        this.updateState(gameStateStore);
    }


    private updateState(gameStateStore: any) {
        switch (gameStateStore?.environmentMode) {
            case 'day':
                this.icon = '🟡'
                this.class.push('icon-yellow')
                break
            case 'night':
                this.icon = '🟣'
                this.class.push('icon-purple')
                break
        }
    }

    override onAttackedHook({playerStore, logStore, gameStateStore}: MonsterOnAttackedParams) {
        let amount = gameStateStore.environmentMode === 'day' ? 3 : -3
        playerAdjustSanity(playerStore, amount);
        logStore.logger.add(`魔物身上的能量刺穿你的靈魂，使你的理智 ${amount > 0 ? '+' : ''}${amount}`)
    }
}

export class SplitIllusion extends MonsterModel {
    constructor() {
        super({
            icon: '☪',
            code: 'SplitIllusion',
            name: '幻想魔元素',
            class: [],
            description: '受龐大魔能量匯集而成具有反映環境的魔力元素體。',
            ad: 40,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 35,
            dodge: 65,
            hit: 100,
            hp: 650,
            hpLimit: 650,
            level: 42,
            dropGold: 110,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook({gameStateStore}: MonsterActionParams) {
        this.updateState(gameStateStore);
    }


    private updateState(gameStateStore: any) {
        switch (gameStateStore?.environmentMode) {
            case 'day':
                this.icon = '🌕'
                this.class.push('icon-yellow')
                break
            case 'night':
                this.icon = '🌑'
                this.class.push('icon-purple')
                break
        }
    }

    override onAttackHitHook({playerStore, logStore}: MonsterOnAttackHitParams) {
        const currentSens = playerStore.hasStatus(EvnStatus.Sanity.name)
        const damage = Math.floor(Math.abs(currentSens.value) / 3)
        playerStore.takeDamage(damage)
        logStore.logger.add(`魔物身上能量侵蝕你的理智，使你受到 ${damage} 點傷害`)
        return true;
    }
}

export class SplitButterfly extends MonsterModel {
    constructor() {
        super({
            icon: '🦋',
            code: 'SplitButterfly',
            name: '幻想蝶',
            class: [],
            description: '受龐大魔能量影響的蝶型魔物。在對應的環境下擁有高額閃避或是高額輸出。',
            ad: 30,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 30,
            dodge: 55,
            hit: 80,
            hp: 600,
            hpLimit: 600,
            level: 42,
            dropGold: 100,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook({gameStateStore}: MonsterActionParams) {
        this.updateState(gameStateStore);
    }

    private updateState(gameStateStore: GameStateStoreType) {
        if (gameStateStore?.environmentMode === 'day') {
            this.class.push('icon-yellow');
            this.addEffect({
                name: '閃匿',
                icon: '🦋',
                duration: -1,
                isBuff: true,
                description: '在白晝環境下，獲得 %dodge% 點閃避值。',
                bonus: {dodge: 50}
            });
        } else if (gameStateStore?.environmentMode === 'night') {
            this.class.push('icon-purple')
            this.addEffect({
                name: '夜襲',
                icon: '🦋',
                duration: -1,
                isBuff: true,
                description: '在黑夜環境下，獲得 %ad% 點傷害與 %hit% 點命中。',
                bonus: {ad: 25, hit: 30}
            });
        }
    }
}

export class SplitHound extends MonsterModel {
    constructor() {
        super({
            icon: '🐕',
            code: 'SplitHound',
            name: '幻想獵犬',
            class: [],
            description: '受環境能量影響的獵犬。爆擊率取決於目標身上理智值。',
            ad: 43,
            critIncrease: WorldDefault.critIncrease,
            critRate: 0,
            adDefend: 38,
            dodge: 60,
            hit: 100,
            hp: 700,
            hpLimit: 700,
            level: 43,
            dropGold: 110,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook({gameStateStore}: MonsterActionParams) {
        this.updateState(gameStateStore);
    }

    private updateState(gameStateStore: any) {
        switch (gameStateStore?.environmentMode) {
            case 'day':
                this.class.push('icon-yellow');
                break;
            case 'night':
                this.class.push('icon-purple');
                break;
        }
    }

    override onAttackHook({playerStore}: MonsterOnAttackParams) {
        const currentSens = playerStore.hasStatus(EvnStatus.Sanity.name)
        this.critRate = Math.floor(Math.abs(currentSens.value))
        return true;
    }
}

export class SplitStalker extends MonsterModel {
    constructor() {
        super({
            icon: '𓀁',
            code: 'SplitStalker',
            name: '幻想行者',
            class: [],
            description: '適應極端日夜環境的峽谷行者。',
            ad: 65,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
            adDefend: 50,
            dodge: 80,
            hit: 100,
            hp: 800,
            hpLimit: 800,
            level: 44,
            dropGold: 120,
            drop: [{item: Material.MediumUpperNormal, chance: 0.5}]
        });
    }

    override onStartHook({gameStateStore}: MonsterActionParams) {
        this.updateState(gameStateStore);
    }

    private updateState(gameStateStore: GameStateStoreType) {
        switch (gameStateStore?.environmentMode) {
            case 'day':
                this.class.push('icon-yellow');
                break;
            case 'night':
                this.class.push('icon-purple');
                break;
        }
        this.addEffect(UsualStatus.Resistance, {value: 3, duration: -1});
    }

    onAttackedHook({playerStore, logStore}: MonsterOnAttackedParams) {
        const currentSens = playerStore.hasStatus(EvnStatus.Sanity.name)
        const damage = Math.floor(Math.abs(currentSens.value) / 2)
        {
            playerStore.takeDamage(damage)
            logStore.logger.add(`魔物身上的能量刺穿了你，造成 ${damage} 真實傷害`)
        }
    }
}

export class DelusionMonster extends MonsterModel {
    constructor() {
        super({
            icon: '👤',
            code: 'DelusionMonster',
            name: '???',
            class: ['secret', 'icon-purple'],
            description: '妄想的產物, 直擊你的心靈層面, 所造成的傷害都會穿透裝甲造成真實傷害',
            ad: 0,
            critIncrease: WorldDefault.critIncrease,
            critRate: 0,
            adDefend: 0,
            dodge: 50,
            hit: 50,
            hp: 1,
            hpLimit: 1,
            level: 1,
            dropGold: 0,
            drop: []
        });
    }

    override onStartHook({playerStore}: MonsterActionParams) {
        // 獲取玩家屬性
        this.ad = Math.floor(Math.max(playerStore.info.ad, playerStore.info.ap) / 2)
        this.dodge = playerStore.info.dodge
        this.hit = playerStore.info.hit
        this.hpLimit = Math.floor(playerStore.info.hpLimit / 2)
        this.hp = Math.floor(playerStore.info.hpLimit / 2)
    }

    override onAttackHook({playerStore}: MonsterOnAttackParams) {
        applySkillDamage({
            speller: this,
            target: playerStore,
            baseValue: this.ad,
            type: "true",
            sureHit: true,
            skillName: '精神攻擊'
        })
        return false
    }
}

export const SplitCanyonMonster = {
    SplitSlime: new SplitSlime(),
    SplitIllusion: new SplitIllusion(),
    SplitButterfly: new SplitButterfly(),
    SplitHound: new SplitHound(),
    SplitStalker: new SplitStalker(),
    DelusionMonster: new DelusionMonster()
};
