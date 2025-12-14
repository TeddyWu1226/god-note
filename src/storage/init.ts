import {UserInfo} from "@/storage/userinfo-storage";
import {DEFAULT_USER_INFO} from "@/assets/default-const";
import {useGameStateStore} from "@/store/game-state-store";

/**
 * 初始化
 */
export const initAll = async () => {
    const gameStateStore = useGameStateStore();
    // 初始化角色
    UserInfo.value = {...DEFAULT_USER_INFO}
    // 初始化
    gameStateStore.init()
    // 前往第一層
    gameStateStore.setRoom(gameStateStore.getCurrentRoom)
}