import {MonsterType} from "@/types";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {MonsterModel} from "@/models/monster-model";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {useEpicSubtitle} from "@/components/Shared/EpicSubtitle/useEpicSubtitle";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {UnitStatus} from "@/constants/status/unit-status";
import {SpecialItem} from "@/constants/items/special-item-info";
import {checkProbability} from "@/utils/math";


export class AncientSpider extends MonsterModel {
    constructor() {
        super({
            icon: '🕷️',
            name: '古蜘蛛',
            description: '巨大古老的蜘蛛,擅長蜘蛛網網住獵物,且對於被網住的生物必定爆擊',
            class: 'boss big',
            ad: 22,
            critIncrease: 200,
            critRate: 0,
            adDefend: 10,
            dodge: 15,
            hit: 30,
            hp: 300,
            hpLimit: 300,
            level: 5,
            dropGold: 250,
            chaseIncrease: 200
        });
    }

    override onStartHook({playerStore, targetElement}: any) {
        useFloatingMessage(
            '絲絲絲!',
            targetElement,
            {
                duration: 2000,
                color: 'red'
            }
        );
        playerStore.addStatus(UnitStatus.SpiderStuck);
    }

    override onAttackHook({gameStateStore, playerStore}: any) {
        if (playerStore.statusEffects?.find((e: any) => e.name === '綑綁')) {
            gameStateStore.addEffectToMonster(this, UnitStatus.SpiderHunter);
        }
    }
}

export class Twilight extends MonsterModel {
    constructor() {
        super({
            icon: '🕺🏼',
            name: '墮落的半神',
            class: 'mystery',
            description: '掌控森林日出日落的半神,卻因失去愛人而墮落,決定讓太陽永不墜落,在遙遠的地平線上垂死掙扎,直到他的愛人回來。',
            ad: 10,
            critIncrease: 100,
            critRate: 0,
            adDefend: 10,
            dodge: 20,
            hit: 30,
            hp: 500,
            hpLimit: 500,
            level: 10,
            dropGold: 500,
            chaseIncrease: 200,
            drop: [
                {item: Usable.GodStar, chance: 1},
                {item: Usable.GodNotePage, chance: 1}
            ]
        });
    }

    override onStartHook() {
        useEpicSubtitle("「餘暉已候多時，只為繼續沈溺在這曲無盡的舞。而你－－蟲子，太吵了。」", 4000);
    }

    override onDeadHook({playerStore}: any) {
        useEpicSubtitle("「希望...與汝再...舞一曲...」", 3000);
        playerStore.removeItem(SpecialItem.PauseToken.name, -1);
    }

    override onAttackHook({targetElement, logStore}: any) {
        this.adDefend += 2;
        this.ad += 2;
        showEffect(targetElement, "節奏加速了 ⚔️⬆️ 🛡️⬆️", "buff");
        logStore.logger.add('半神的攻擊更凌厲了,防禦也更加堅固!');
    }

    override onAttackedHook({playerStore, logStore}: any) {
        const chance = 0.2 + (((this.ad - 14) / 2) * 0.1);
        if (checkProbability(chance)) {
            playerStore.gainItem(SpecialItem.PauseToken);
            logStore.logger.add(`你得到了一個神秘的符號`);
        }
    }
}

export const Boss = {
    // --- 迷霧森林 (Misty Forest) ---
    AncientRoots: new AncientSpider(),
    Twilight: new Twilight(),
};

export const StageBosses: Record<number, { mini: MonsterType; main: MonsterType }> = {
    1: {
        mini: Boss.AncientRoots, // Region 1 Mini Boss (Day 50)
        main: Boss.Twilight      // Region 1 Main Boss (Day 100)
    }
};