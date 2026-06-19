import {GameStateStoreType, NoneMonsterItemSkillParams, SpecifyMonsterItemSkillParams} from "@/types";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {GameState} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {ItemStatus} from "@/constants/status/item-status";
import {UnitStatus} from "@/constants/status/unit-status";
import {Boss} from "../monsters/monster-info/99-boss-info";
import {useSaveStore} from "@/store/save-store";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import EvnStatus from "@/constants/status/evn-status";
import {useCardStatusEffect} from "@/components/RoomLayout/comps/useCardStatusEffect";
import {useFloatingMessage} from "@/components/Shared/FloatingMessage/useFloatingMessage";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";

const cantUse = () => {
    useFloatingMessage("現在無法使用!", null, {color: 'red', duration: 1000})
}
const isOnlyCanUseInSelection = (gameStateStore?: GameStateStoreType) => {
    if (!gameStateStore?.stateIs(GameState.SELECTION_PHASE)) {
        cantUse()
        return true;
    }
    return false;
}
const onCanUseInFight = (
    params: SpecifyMonsterItemSkillParams | NoneMonsterItemSkillParams,
    useFn: () => void
) => {
    const isFightRoom = params.gameStateStore?.roomIs([RoomEnum.Fight.value, RoomEnum.EliteFight.value])
    if (!isFightRoom || !params.gameStateStore?.stateIs(GameState.EVENT_PHASE)) {
        cantUse()
        params.callback(false);
        return
    }
    useFn()
}

export const ItemSkill: Record<string, (params: SpecifyMonsterItemSkillParams | NoneMonsterItemSkillParams) => void> = {
    /**
     * 營火
     */
    useCampfire: ({playerStore, gameStateStore, callback}) => {
        if (isOnlyCanUseInSelection(gameStateStore)) {
            callback(false);
            return
        }
        playerStore.healFull()
        callback(true)
    },
    /**
     * 破舊帳篷
     */
    useShabbyTent: ({playerStore, gameStateStore, callback}) => {
        if (isOnlyCanUseInSelection(gameStateStore)) {
            callback(false);
            return
        }
        playerStore.info.hp = Math.min(playerStore.finalStats.hpLimit, playerStore.info.hp + Math.round(playerStore.finalStats.hpLimit / 2))
        callback(true)
    },
    /**
     * 存檔
     */
    useGodNotePage: ({playerStore, gameStateStore, callback}) => {
        if (isOnlyCanUseInSelection(gameStateStore)) {
            callback(false);
            return
        }
        const saveStore = useSaveStore()
        playerStore.removeItem(Usable.GodNotePage.name)
        saveStore.saveAll()
        callback(true);
        return
    },

    // 戰鬥回合使用
    /**
     * 煙霧但
     */
    useSmokeBomb: (params) => {
        onCanUseInFight(params, () => {
            const {playerStore, callback} = params;
            playerStore.addStatus(ItemStatus.SmokeBomb)
            useFullScreenEffect({
                message: '😶‍🌫️😶‍🌫️😶‍🌫️',
                color: 'white',
            });
            callback(true)
        })
    },
    useCamouflageGrass: (params) => {
        onCanUseInFight(params, () => {
            const {playerStore, callback} = params;
            playerStore.addStatus(ItemStatus.CamouflageGrass)
            useFullScreenEffect({
                message: '🫣🫣🫣️',
                color: '#9b9b9b',
            });
            callback(true)
        })
    },
    useBurningPotion: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {monster, playerStore, gameStateStore, callback, cardElement} = params;
            if (playerStore.hasStatus(UnitStatus.SpiderStuck.name)) {
                playerStore.removeStatus(UnitStatus.SpiderStuck.name);
                useFullScreenEffect({
                    message: '🔥蜘蛛絲被燒斷🔥',
                    color: '#e38f63',
                });
                callback(true)
                return
            }
            if (monster) {
                gameStateStore.addEffectToMonster(monster, ItemStatus.OnBurn)
                if (cardElement) {
                    useCardStatusEffect({
                        target: cardElement,
                        message: '燃燒',
                        color: '#e67e22',
                        icon: '🔥',
                        duration: 1500
                    });
                }
                callback(true)
                return
            }
            cantUse()
            callback(false)
        })
    },
    useUnPoisonPotion: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {playerStore, callback, targetElement} = params;
            if (playerStore.hasStatus('中毒') || playerStore.hasStatus('劇毒')) {
                playerStore.removeStatus('中毒');
                playerStore.removeStatus('劇毒');
                showEffect(targetElement, "中毒狀態已消除", 'buff')
                callback(true)
            } else {
                showEffect(targetElement, "沒有中毒狀態!", "debuff")
                callback(false);
            }
        })
    },
    usePauseToken: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {monster, callback, targetElement} = params;
            if (monster && monster.name == Boss.Twilight.name) {
                if (monster.ad > 10) {
                    monster.ad -= 4
                    monster.adDefend -= 4
                } else {
                    monster.ad = 10
                    monster.adDefend = 10
                }
                showEffect(targetElement, "攻擊節奏減緩了!", "fullscreen")
                callback(true)
            } else {
                showEffect(targetElement, "現在無法使用!", "debuff")
                callback(false)
            }
        })
    },
    useDuneBeastBomb: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {monster, playerStore, callback, targetElement} = params;
            if (monster) {
                if (monster.name.includes('巨獸')) {
                    monster.hp = 300
                    monster.adDefend = 5
                    monster.apDefend = 5
                    monster.ad = 50
                    showEffect(targetElement, "💥炸彈在巨獸身體內引爆💥", "fullscreen")
                } else {
                    monster.hp -= 200
                    playerStore.info.hp -= 100
                    showEffect(targetElement, "💥炸彈引爆了💥!!", "debuff")
                }
                callback(true)
            } else {
                showEffect(targetElement, "現在無法使用!", "debuff")
                callback(false)
            }
        })
    },
    useWarmFruit: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {playerStore, callback} = params;
            playerStore.addStatus(ItemStatus.Warming)
            callback(true)
        })
    },
    useHotFruit: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {playerStore, callback, targetElement} = params;
            playerStore.removeStatus('寒冷');
            showEffect(targetElement, "寒冷狀態已消除,但中毒了", 'buff')
            playerStore.addStatus(EvnStatus.Poison)
            callback(true)
        })
    },
};