import {
    MonsterType, StatusEffect, DropEntry, BattleOutcome, MonsterActionParams, MonsterOnAttackParams,
    MonsterOnAttackedParams, logStoreType, BonusType, MonsterOnAttackHitParams, MonsterRoundBehaviorParams
} from "@/types";
import {genCustomStatus} from "@/utils/create";


export class MonsterModel implements MonsterType {
    id: string;
    code: string;
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
    hpRegen?: number;
    description?: string;
    class?: string;
    drop?: DropEntry[];
    dropGold?: number;
    status: StatusEffect[];
    onStart?: MonsterType["onStart"];
    onAttack?: MonsterType["onAttack"];
    onAttackHit?: MonsterType["onAttackHit"];
    onAttacked?: MonsterType["onAttacked"];
    onDead?: MonsterType["onDead"];
    lastDamageResult?: BattleOutcome;
    tick?: Record<string, number | any[]>;
    roundBehavior?: string;

    constructor(data: MonsterType) {
        this.id = data.id;
        this.code = data.code;
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
        this.hpRegen = data.hpRegen || 0;
        this.onStart = data.onStart;
        this.onAttack = data.onAttack;
        this.onAttackHit = data.onAttackHit;
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
    getEffectiveStats(): MonsterModel {
        const finalStats: MonsterType = {
            id: this.id,
            code: this.code,
            icon: this.icon,
            name: this.name,
            description: this.description,
            level: this.level,
            hp: this.hp,
            ad: this.ad,
            hpRegen: this.hpRegen,
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
            onAttackHit: this.onAttackHit,
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

        const Constructor = this.constructor as any;
        const instance = new Constructor(finalStats);
        Object.assign(instance, finalStats);
        return instance;
    }

    /**
     * 施加狀態效果
     */
    addEffect(effect: StatusEffect,
              custom?: {
                  bonus?: BonusType,
                  value?: number,
                  duration?: number
              }) {
        const existingIdx = this.status.findIndex(e => e.name === effect.name);
        if (existingIdx > -1) {
            this.status[existingIdx] = effect;
        } else {
            this.status.push(
                genCustomStatus({
                        base: effect,
                        bonus: custom?.bonus,
                        value: custom?.value,
                        duration: custom?.duration,
                    }
                )
            );
        }
    }

    /**
     * 移除指定的狀態 (Buff 或 Debuff)
     * @param statusName 狀態名稱
     */
    removeStatus(statusName: string) {
        const index = this.status.findIndex(e => e.name === statusName);
        if (index !== -1) {
            this.status.splice(index, 1);
        }
    }

    /**
     * 檢查是否有指定效果
     */
    hasStatus(statusName: string) {
        return this.status?.find(
            (effect) => effect.name === statusName
        );
    }

    /**
     * 檢查是否暈眩
     */
    isStuck() {
        return this.status?.some((eff) => eff.type === 'stuck')
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

    // 子類別可覆寫的生命週期鉤子方法
    onStartHook(params: MonsterActionParams): void {
    }

    onAttackHook(params: MonsterOnAttackParams): boolean | void {
        return true
    }

    onAttackHitHook(params: MonsterOnAttackHitParams): void {
        if (typeof this.onAttackHit === 'function') {
            this.onAttackHit({
                ...params
            });
        }
    }

    onAttackedHook(params: MonsterOnAttackedParams): void {
    }

    onDeadHook(params: MonsterActionParams): void {
    }

    //怪物在特定回合開始的獨特習性行為
    onRoundBehaviorHook(params: MonsterRoundBehaviorParams): void {
    }


    /**
     * 觸發回合開始被動/效果
     */
    triggerOnStart(params: MonsterActionParams): void {
        this.onStartHook(params);
    }

    /**
     * 執行怪物在特定回合開始的獨特習性行為
     */
    triggerRoundBehavior(params: MonsterRoundBehaviorParams) {
        if (this.hp <= 0) return;
        this.onRoundBehaviorHook(params);
    }

    /**
     * 觸發攻擊前 被動/效果
     * 如果回傳 false 則不進行攻擊
     */
    triggerOnAttack(params: MonsterOnAttackParams): boolean {
        const trigger = this.onAttackHook(params)
        return trigger !== false;
    }

    /**
     * 觸發攻擊命中後 被動/效果
     */
    triggerOnAttackHit(params: MonsterOnAttackHitParams): void {
        this.onAttackHitHook(params);
    }

    /**
     * 觸發被攻擊命中後 被動/效果
     */
    triggerOnAttacked(params: MonsterOnAttackedParams): void {
        this.onAttackedHook(params);
    }

    /**
     * 觸發死亡被動/效果
     */
    triggerOnDead(params: Omit<MonsterActionParams, 'monster'>): void {
        this.onDeadHook(params);
    }
}


