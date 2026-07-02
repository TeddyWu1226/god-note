import {SkillModel} from "@/models/skill-model";
import {SkillStatus} from "@/constants/status/skill-status";
import {SkillOnStartParams, SkillParams} from "@/types";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

export class ConcealBreathInstinct extends SkillModel {
    constructor() {
        super({
            id: 'ConcealBreathInstinct',
            name: "隱蔽本能",
            icon: "skills/active/conceal_breath.svg",
            type: 'active',
            rarity: 'perfect',
            uniqueFields: ['隱蔽氣息'],
            maxProficiency: 0,
            proficiencyGain: 0,
            costAction: 1,
            costSp: 10,
            maxCd: 3
        });
    }

    description(): string {
        return `戰鬥開始時獲得「藏匿」效果（提升 50% 爆擊與 50 點閃避，最多持續 2 回合，若攻擊則消失）。也可以主動使用。`;
    }

    protected execute({playerStore}: SkillParams): boolean {
        playerStore.addStatus(SkillStatus.HideStatus);
        useFullScreenEffect({
            message: this.name,
            color: '#ffffff',
        });
        return true;
    }

    override onRoundStart({playerStore, gameStateStore, logStore}: SkillOnStartParams) {
        const round = gameStateStore?.battleRound ?? 1;
        if (round === 1 && playerStore) {
            playerStore.addStatus(SkillStatus.HideStatus);
            if (logStore) {
                logStore.logger.add(`[隱蔽氣息] 戰鬥開始！玩家獲得「藏匿」效果。`);
            }
        }
    }
}
