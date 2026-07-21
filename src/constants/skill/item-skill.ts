import {GameStateStoreType, NoneMonsterItemSkillParams, SpecifyMonsterItemSkillParams} from "@/types";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";
import {GameState} from "@/enums/enums";
import {RoomEnum} from "@/enums/room-enum";
import {ItemStatus} from "@/constants/status/item-status";
import {UnitStatus} from "@/constants/status/unit-status";
import {Boss} from "../monsters/monster-info/99-boss-info";
import {useSaveStore} from "@/store/save-store";
import {useFullScreenEffect} from "@/components/Shared/FullScreenEffect/useFullScreenEffect";
import {getMonsterElement} from "@/utils/create";
import {useCardImpactEffect} from "@/components/Shared/CardImpactEffect/useCardImpactEffect";

const cantUse = () => {
    showEffect(
        {
            text: "現在無法使用!",
            type: "debuff"
        }
    )
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
    const isFightRoom = params.gameStateStore?.roomIs(
        [RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value]
    )
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
        // playerStore.removeItem(Usable.GodNotePage.name)
        saveStore.saveAll()
        callback(true);
        return
    },
    useTeleportCrystal: ({playerStore, gameStateStore, callback}) => {
        const isSelection = gameStateStore?.stateIs(GameState.SELECTION_PHASE);
        const isCombat = gameStateStore?.roomIs([RoomEnum.Fight.value, RoomEnum.EliteFight.value, RoomEnum.Boss.value]) && gameStateStore?.stateIs(GameState.EVENT_PHASE);

        if (!isSelection && !isCombat) {
            cantUse();
            callback(false);
            return;
        }

        // 如果在戰鬥中，清空當前怪物與隨機怪物池，防範戰鬥殘留
        if (isCombat && gameStateStore) {
            gameStateStore.currentEnemy = [];
            gameStateStore.switchEnemy = [];
        }

        if (gameStateStore) {
            gameStateStore.currentStage = 0;
            gameStateStore.stageDays = 0;
            gameStateStore.setRoom(RoomEnum.Station.value);
        }
        callback(true);
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
            const {monster, playerStore, gameStateStore, callback} = params;
            if (!!playerStore.hasStatus(UnitStatus.SpiderStuck.name)) {
                playerStore.removeStatus(UnitStatus.SpiderStuck.name);
                useFullScreenEffect({
                    message: '🔥蜘蛛絲被燒斷🔥',
                    color: '#e38f63',
                });
                callback(true)
                return
            }
            if (monster) {
                monster.addEffect(ItemStatus.OnBurn)
                useCardImpactEffect(getMonsterElement(params.monster.id), 'burn');
                callback(true)
                return
            }
            cantUse()
            callback(false)
        })
    },
    useUnPoisonPotion: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {playerStore, callback} = params;
            if (!!playerStore.hasStatus('中毒')) {
                playerStore.removeStatus('中毒');
                useFullScreenEffect({
                    message: '中毒狀態已消除',
                    color: 'green',
                });
                callback(true)
            } else if (!!playerStore.hasStatus('燃燒')) {
                playerStore.removeStatus('燃燒');
                useFullScreenEffect({
                    message: '燃燒狀態已消除',
                    color: 'red',
                });
                callback(true)
            } else {
                cantUse()
                callback(false);
            }
        })
    },
    usePauseToken: (params: SpecifyMonsterItemSkillParams) => {
        onCanUseInFight(params, () => {
            const {monster, callback} = params;
            if (monster && monster.name == Boss.Twilight.name) {
                if (monster.ad > 10) {
                    monster.ad -= 4
                    monster.adDefend -= 4
                } else {
                    monster.ad = 10
                    monster.adDefend = 10
                }
                callback(true)
            } else {
                callback(false)
            }
        })
    }
};