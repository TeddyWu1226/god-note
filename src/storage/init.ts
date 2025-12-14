import {UserInfo} from "@/storage/userinfo-storage";
import {DEFAULT_FLOOR, DEFAULT_ROOM_WEIGHTS, DEFAULT_USER_INFO} from "@/assets/default-const";
import {createTrapezoidDataWithWeights, Floor, getRoomValue} from "@/storage/floor-storage";
import {useGameStateStore} from "@/store/game-state-store";

/**
 * 初始化
 */
export const initAll = async () => {
    const gameStateStore = useGameStateStore();
    // 初始化角色
    UserInfo.value = {...DEFAULT_USER_INFO}
    // 初始化階層
    Floor.value = {...DEFAULT_FLOOR}
    Floor.value.currentStageRooms = createTrapezoidDataWithWeights(DEFAULT_ROOM_WEIGHTS, 19, 17)
    // 初始化
    gameStateStore.init()
    // 前往第一層
    gameStateStore.setRoomValue(getRoomValue(Floor.value.currentRoom))
}