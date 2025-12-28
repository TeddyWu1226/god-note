import {SpecialEventEnum} from "@/enums/enums";
import NoneEvent from "@/components/RoomLayout/event/NoneEvent.vue";
import GambleEvent from "@/components/RoomLayout/event/GambleEvent.vue";
import GetFruitEvent from "@/components/RoomLayout/event/GetFruitEvent.vue";
import JobWarriorEvent from "@/components/RoomLayout/event/JobWarriorEvent.vue";
// ... 導入所有事件組件

export const eventComponentMap = {
    [SpecialEventEnum.None]: NoneEvent,
    [SpecialEventEnum.Gamble]: GambleEvent,
    [SpecialEventEnum.GetFruit]: GetFruitEvent,
    [SpecialEventEnum.JobWarrior]: JobWarriorEvent
};