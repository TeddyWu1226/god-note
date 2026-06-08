import {MonsterType, StatusEffect, DropEntry, BattleOutcome, MonsterActionParams, MonsterOnAttackParams} from "@/types";
import {MonsterOnStart} from "@/constants/monsters/monster-action/on-start";
import {MonsterOnAttack} from "@/constants/monsters/monster-action/on-attack";
import {MonsterOnAttacked} from "@/constants/monsters/monster-action/on-attacked";
import {MonsterOnDead} from "@/constants/monsters/monster-action/on-dead";

export class Monster implements MonsterType {
    id: string;
    icon: string;
    name: string;
    ad: number;
    critIncrease: number;
    critRate: number;
    adDefend: number;
    apDefend: number;
    dodge: number;
    hit: number;
    hp: number;
    hpLimit: number;
    level: number;
    adIncrease?: number;
    apIncrease?: number;
    defendIncrease?: number;
    runIncrease?: number;
    chaseIncrease?: number;
    lifeSteal?: number;
    heal?: number;
    description?: string;
    class?: string;
    drop?: DropEntry[];
    dropGold?: number;
    status: StatusEffect[];
    onStart?: MonsterType["onStart"];
    onAttack?: MonsterType["onAttack"];
    onAttacked?: MonsterType["onAttacked"];
    onDead?: MonsterType["onDead"];
    lastDamageResult?: BattleOutcome;
    tick?: Record<string, number | any[]>;
    roundBehavior?: string;

    constructor(data: MonsterType) {
        this.id = data.id || Math.random().toString(36).substring(2, 9);
        this.icon = data.icon;
        this.name = data.name;
        this.ad = data.ad;
        this.critIncrease = data.critIncrease;
        this.critRate = data.critRate;
        this.adDefend = data.adDefend;
        this.apDefend = data.apDefend || 0;
        this.dodge = data.dodge;
        this.hit = data.hit;
        this.hp = data.hp;
        this.hpLimit = data.hpLimit;
        this.level = data.level;
        this.adIncrease = data.adIncrease || 0;
        this.apIncrease = data.apIncrease || 0;
        this.defendIncrease = data.defendIncrease || 0;
        this.runIncrease = data.runIncrease || 0;
        this.chaseIncrease = data.chaseIncrease || 0;
        this.lifeSteal = data.lifeSteal || 0;
        this.description = data.description;
        this.class = data.class;
        this.drop = data.drop;
        this.dropGold = data.dropGold;
        this.status = data.status || [];
        this.heal = data.heal || 0;
        this.onStart = data.onStart;
        this.onAttack = data.onAttack;
        this.onAttacked = data.onAttacked;
        this.onDead = data.onDead;
        this.lastDamageResult = data.lastDamageResult;
        this.tick = data.tick || {};
        this.roundBehavior = data.roundBehavior;
    }

    ap?: number;
    magic?: number;

    /**
     * 計算包含 Buff/Debuff 狀態後的實際屬性值
     */
    getEffectiveStats(): Monster {
        const finalStats: MonsterType = {
            id: this.id,
            icon: this.icon,
            name: this.name,
            description: this.description,
            level: this.level,
            hp: this.hp,
            ad: this.ad,
            heal: this.heal,
            adDefend: this.adDefend,
            apDefend: this.apDefend,
            hpLimit: this.hpLimit,
            dodge: this.dodge,
            hit: this.hit,
            critRate: this.critRate,
            critIncrease: this.critIncrease,
            adIncrease: this.adIncrease,
            apIncrease: this.apIncrease,
            defendIncrease: this.defendIncrease,
            lifeSteal: this.lifeSteal,
            runIncrease: this.runIncrease,
            chaseIncrease: this.chaseIncrease,
            status: this.status,
            class: this.class,
            drop: this.drop,
            dropGold: this.dropGold,
            onStart: this.onStart,
            onAttack: this.onAttack,
            onAttacked: this.onAttacked,
            onDead: this.onDead,
            lastDamageResult: this.lastDamageResult,
            tick: this.tick,
            roundBehavior: this.roundBehavior,
        };

        // 遍歷所有狀態，疊加 Bonus
        this.status.forEach(eff => {
            if (eff.bonus) {
                (Object.keys(eff.bonus) as Array<keyof typeof eff.bonus>).forEach(key => {
                    const val = eff.bonus![key];
                    if (typeof val === 'number') {
                        if (key in finalStats) {
                            (finalStats as any)[key] += val;
                        }
                    }
                });
            }
        });

        return new Monster(finalStats);
    }

    /**
     * 施加狀態效果
     */
    addEffect(effect: StatusEffect, logStore?: any) {
        if (logStore) {
            logStore.logger.add(`${this.name} 受到 [${effect.name}] 效果。`);
        }
        const existingIdx = this.status.findIndex(e => e.name === effect.name);
        if (existingIdx > -1) {
            this.status[existingIdx].duration = effect.duration;
        } else {
            this.status.push({...effect});
        }
    }

    /**
     * 每回合觸發：更新狀態、處理DoT和HoT
     */
    tickEffects(logStore: any) {
        if (this.hp <= 0) return;

        // 1. 處理每回合跳血/回血 (DoT/HoT)
        this.status.forEach(eff => {
            let logMessage: string | undefined;
            if (eff.type === 'damage' && eff.value) {
                logMessage = `${this.name} 因[${eff.name}]受到了 ${eff.value} 點傷害。`;
                this.hp = Math.max(0, this.hp - eff.value);
            } else if (eff.type === 'heal' && eff.value) {
                const finalStats = this.getEffectiveStats(); // 計算包含 buff 的上限
                this.hp = Math.min(finalStats.hpLimit, this.hp + eff.value);
                logMessage = `${this.name} 因[${eff.name}]回復了 ${eff.value} 點生命。`;
            }
            if (logMessage && logStore) {
                logStore.logger.add(logMessage);
            }
        });

        // 2. 減少持續時間並過濾掉已結束的狀態
        this.status = this.status
            .map(eff => ({
                ...eff,
                duration: eff.duration === -1 ? -1 : eff.duration - 1
            }))
            .filter(eff => eff.duration !== 0);
    }

    /**
     * 執行怪物在特定回合的獨特習性行為
     */
    executeRoundBehavior(battleRound: number, logStore: any) {
        if (this.hp <= 0) return;

        // 1. 在 Class 內自定義：針對特定怪物的硬編碼行為 (方便直接在此調整)

        // 🟢 史萊姆：在第 3 回合體型變大，獲得攻擊力與生命上限加成
        if (this.name === '史萊姆' || this.name.includes('史萊姆')) {
            if (battleRound === 3) {
                this.ad += 3;
                this.hpLimit += 10;
                this.hp += 10;
                if (logStore) {
                    logStore.logger.add(`🟢 [獨特習性] ${this.name} 吸收了周圍的魔力，體型變大！攻擊力與生命上限提升！`);
                }
            }
        }

        // 😡 菁英怪：在第 5 回合進入狂暴狀態，提升 50% 物理傷害，增加 20% 暴擊率
        if (this.class === 'elite') {
            if (battleRound === 5) {
                this.ad = Math.round(this.ad * 1.5);
                this.critRate = (this.critRate || 0) + 20;
                if (logStore) {
                    logStore.logger.add(`😡 [獨特習性] 菁英怪物 ${this.name} 陷入狂怒！攻擊力與暴擊率大幅提升！`);
                }
            }
        }

        // 2. 映射表自定義：若有指定 roundBehavior 鍵值，則執行對應的註冊函式
        if (this.roundBehavior && MonsterRoundBehaviors[this.roundBehavior]) {
            MonsterRoundBehaviors[this.roundBehavior](this, battleRound, logStore);
        }
    }

    /**
     * 觸發回合開始被動/效果
     */
    triggerOnStart(params: Omit<MonsterActionParams, 'monster'>): void {
        if (this.onStart) {
            const fn = typeof this.onStart === 'function' ? this.onStart : (MonsterOnStart as Record<string, any>)[this.onStart];
            if (fn) {
                fn({...params, monster: this});
            }
        }
    }

    /**
     * 觸發攻擊前被動/效果
     */
    triggerOnAttack(params: Omit<MonsterOnAttackParams, 'monster'>): void {
        if (this.onAttack) {
            const fn = typeof this.onAttack === 'function' ? this.onAttack : (MonsterOnAttack as Record<string, any>)[this.onAttack];
            if (fn) {
                fn({...params, monster: this});
            }
        }
    }

    /**
     * 觸發被攻擊後被動/效果
     */
    triggerOnAttacked(params: Omit<MonsterActionParams, 'monster'> & { damage: BattleOutcome }): void {
        if (this.onAttacked) {
            const fn = typeof this.onAttacked === 'function' ? this.onAttacked : (MonsterOnAttacked as Record<string, any>)[this.onAttacked];
            if (fn) {
                fn({...params, monster: this});
            }
        }
    }

    /**
     * 觸發死亡被動/效果
     */
    triggerOnDead(params: Omit<MonsterActionParams, 'monster'>): void {
        if (this.onDead) {
            const fn = typeof this.onDead === 'function' ? this.onDead : (MonsterOnDead as Record<string, any>)[this.onDead];
            if (fn) {
                fn({...params, monster: this});
            }
        }
    }
}

/**
 * 外部自定義行為註冊表
 */
export const MonsterRoundBehaviors: Record<
    string,
    (monster: Monster, battleRound: number, logStore: any) => void
> = {
    slimeStrengthen: (monster, round, logStore) => {
        if (round === 3) {
            monster.ad += 5;
            if (logStore) {
                logStore.logger.add(`🧪 [獨特習性] 史萊姆產生化學反應，攻擊力提升 5 點！`);
            }
        }
    },
    decayByTime: (monster, round, logStore) => {
        if (round >= 6) {
            monster.ad = Math.max(1, monster.ad - 2);
            monster.adDefend = Math.max(0, monster.adDefend - 1);
            if (logStore) {
                logStore.logger.add(`🍂 [獨特習性] ${monster.name} 隨著時間流逝肉體逐漸腐朽，攻擊與防禦降低。`);
            }
        }
    }
};
