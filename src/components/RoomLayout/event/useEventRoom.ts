import {SpecialEventEnum} from "@/enums/enums";
import NoneEvent from "@/components/RoomLayout/event/NoneEvent.vue";
import GambleEvent from "@/components/RoomLayout/event/GambleEvent.vue";
import GetFruitEvent from "@/components/RoomLayout/event/GetFruitEvent.vue";
import JobWarriorEvent from "@/components/RoomLayout/event/JobWarriorEvent.vue";
import ChestEvent from "@/components/RoomLayout/event/ChestEvent.vue";
import JobWizardrEvent from "@/components/RoomLayout/event/JobWizardrEvent.vue";
import PotionEvent from "@/components/RoomLayout/event/PotionEvent.vue";
import StorytellerEvent from "@/components/RoomLayout/event/StorytellerEvent.vue";

export const eventComponentMap = {
    [SpecialEventEnum.None]: NoneEvent,
    [SpecialEventEnum.Gamble]: GambleEvent,
    [SpecialEventEnum.GetFruit]: GetFruitEvent,
    [SpecialEventEnum.JobWarrior]: JobWarriorEvent,
    [SpecialEventEnum.JobWizard]: JobWizardrEvent,
    [SpecialEventEnum.Chest]: ChestEvent,
    [SpecialEventEnum.Potion]: PotionEvent,
    [SpecialEventEnum.Storyteller]: StorytellerEvent,
};