import {UserInfo} from "@/storage/userinfo-storage";
import {DEFAULT_FLOOR, DEFAULT_ROOM_WEIGHTS, DEFAULT_USER_INFO} from "@/assets/default-const";
import {createTrapezoidDataWithWeights, Floor} from "@/storage/floor-storage";

/**
 * 初始化
 */
export const initAll = async () => {
    // 初始化角色
    UserInfo.value = {...DEFAULT_USER_INFO}
    // 初始化階層
    Floor.value = {...DEFAULT_FLOOR}
    Floor.value.currentStageRooms = createTrapezoidDataWithWeights(DEFAULT_ROOM_WEIGHTS, 19, 17)
    // 初始化操作

}