import {MonsterModel} from "@/models/monster-model";
import {WorldDefault} from "@/assets/const";
import {Material} from "@/constants/items/material/material-info";
import {playerAdjustSanity} from "@/constants/status/advanced-status-utils";
import EvnStatus from "@/constants/status/evn-status";
import {
    MonsterActionParams,
    MonsterOnAttackParams,
    MonsterRoundBehaviorParams,
    MonsterOnAttackedParams,
    MonsterOnAttackHitParams,
    GameStateStoreType
} from "@/types";
import {UsualStatus} from "@/constants/status/usual-status";

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

    override onRoundBehaviorHook({gameStateStore}: MonsterRoundBehaviorParams) {
        this.updateState(gameStateStore);
    }

    private updateState(gameStateStore: any) {
        switch (gameStateStore?.environmentMode) {
            case 'day':
                this.icon = '🟡'
                this.class = ['icon-yellow']
                if (this.hasStatus(EvnStatus.NighttimeEffect.name)) {
                    this.removeStatus(EvnStatus.NighttimeEffect.name);
                }
                this.addEffect(EvnStatus.DaytimeEffect);
                break
            case 'night':
                this.icon = '🟣'
                this.class = ['icon-purple']
                if (this.hasStatus(EvnStatus.DaytimeEffect.name)) {
                    this.removeStatus(EvnStatus.DaytimeEffect.name);
                }
                this.addEffect(EvnStatus.NighttimeEffect);
                break
        }
    }

    override onAttackedHook({playerStore, logStore}: MonsterOnAttackedParams) {
        let amount = this.hasStatus(EvnStatus.DaytimeEffect.name) ? 3 : -3
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
            ad: 45,
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

    override onRoundBehaviorHook({gameStateStore}: MonsterRoundBehaviorParams) {
        this.updateState(gameStateStore);
    }

    private updateState(gameStateStore: any) {
        switch (gameStateStore?.environmentMode) {
            case 'day':
                this.icon = '🌕'
                this.class = ['icon-yellow']
                this.addEffect(EvnStatus.DaytimeEffect);
                break
            case 'night':
                this.icon = '🌑'
                this.class = ['icon-purple']
                this.addEffect(EvnStatus.NighttimeEffect);
                break
        }
    }

    override onAttackHitHook({playerStore, logStore}: MonsterOnAttackHitParams) {
        const currentSens = playerStore.hasStatus(EvnStatus.Sanity.name)
        if ((this.hasStatus(EvnStatus.DaytimeEffect.name) && currentSens.value > 0) ||
            (this.hasStatus(EvnStatus.NighttimeEffect.name) && currentSens.value < 0)
        ) {
            const damage = Math.floor(Math.abs(currentSens.value) / 3)
            playerStore.takeDamage(damage)
            logStore.logger.add(`魔物身上相同的能量侵蝕你的理智，使你受到 ${damage} 點傷害`)
        }
        return true;
    }
}

export class SplitButterfly extends MonsterModel {
    constructor() {
        super({
            icon: '🦋',
            code: 'SplitButterfly',
            name: '幻想蝶妖',
            class: [],
            description: '受龐大魔能量影響的蝶妖。在對應的環境下擁有高額閃避或是高額輸出。',
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
            this.class = ['icon-yellow'];
            this.addEffect(EvnStatus.DaytimeEffect);
            this.addEffect({
                name: '閃匿',
                icon: '🦋',
                duration: -1,
                isBuff: true,
                description: '在白晝環境下，獲得 %dodge% 點閃避值。',
                bonus: {dodge: 50}
            });
        } else if (gameStateStore?.environmentMode === 'night') {
            this.class = ['icon-purple'];
            this.addEffect(EvnStatus.NighttimeEffect);
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
            description: '受環境能量影響的獵犬。狩獵屬於另一方勢力的敵人時必定爆擊。',
            ad: 66,
            critIncrease: WorldDefault.critIncrease,
            critRate: WorldDefault.critRate,
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
        if (gameStateStore?.environmentMode === 'day') {
            this.class = ['icon-yellow'];
            this.addEffect(EvnStatus.DaytimeEffect);
        } else if (gameStateStore?.environmentMode === 'night') {
            this.class = ['icon-purple'];
            this.addEffect(EvnStatus.NighttimeEffect);
        }
    }

    override onAttackHook({playerStore}: MonsterOnAttackParams) {
        if (this.hasStatus(EvnStatus.DaytimeEffect.name) && playerStore.hasStatus(EvnStatus.LowSanity.name) ||
            this.hasStatus(EvnStatus.NighttimeEffect.name) && playerStore.hasStatus(EvnStatus.HighSanity.name)
        ) {
            this.critRate = 100;
        } else {
            this.critRate = 15;
        }
        return true;
    }
}

export class SplitStalker extends MonsterModel {
    constructor() {
        super({
            icon: '👤',
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
        if (gameStateStore?.environmentMode === 'day') {
            this.class = ['icon-yellow'];
            this.addEffect(EvnStatus.DaytimeEffect);
        } else if (gameStateStore?.environmentMode === 'night') {
            this.class = ['icon-purple'];
            this.addEffect(EvnStatus.NighttimeEffect);
        }
        this.addEffect(UsualStatus.Resistance, {value: 3, duration: -1});
    }

    onAttackedHook({playerStore, logStore}: MonsterOnAttackedParams) {
        if (this.hasStatus(EvnStatus.DaytimeEffect.name) && playerStore.hasStatus(EvnStatus.LowSanity.name) ||
            this.hasStatus(EvnStatus.NighttimeEffect.name) && playerStore.hasStatus(EvnStatus.HighSanity.name)
        ) {
            playerStore.takeDamage(this.ad)
            logStore.logger.add(`魔物身上的相反的能量刺穿了你，造成 ${this.ad} 真實傷害`)
        }
    }
}

// ==========================================
// 分裂之谷怪物導出 (Export Registry)
// ==========================================

export const SplitCanyonMonster = {
    SplitSlime: new SplitSlime(),
    SplitIllusion: new SplitIllusion(),
    SplitButterfly: new SplitButterfly(),
    SplitHound: new SplitHound(),
    SplitStalker: new SplitStalker()
};
