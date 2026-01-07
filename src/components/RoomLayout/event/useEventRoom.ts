import {SpecialEventEnum} from "@/enums/enums";
import NoneEvent from "@/components/RoomLayout/event/NoneEvent.vue";
import GambleEvent from "@/components/RoomLayout/event/GambleEvent.vue";
import GetFruitEvent from "@/components/RoomLayout/event/GetFruitEvent.vue";
import JobWarriorEvent from "@/components/RoomLayout/event/JobWarriorEvent.vue";
import ChestEvent from "@/components/RoomLayout/event/ChestEvent.vue";
import JobWizardEvent from "@/components/RoomLayout/event/JobWizardEvent.vue";
import PotionEvent from "@/components/RoomLayout/event/PotionEvent.vue";
import StorytellerEvent from "@/components/RoomLayout/event/StorytellerEvent.vue";
import FusionEvent from "@/components/RoomLayout/event/FusionEvent.vue";
import NeedWaterEvent from "@/components/RoomLayout/event/NeedWaterEvent.vue";
import HuntDuneBeastEvent from "@/components/RoomLayout/event/HuntDuneBeastEvent.vue";

export const eventComponentMap = {
    [SpecialEventEnum.None]: NoneEvent,
    [SpecialEventEnum.Gamble]: GambleEvent,
    [SpecialEventEnum.GetFruit]: GetFruitEvent,
    [SpecialEventEnum.JobWarrior]: JobWarriorEvent,
    [SpecialEventEnum.JobWizard]: JobWizardEvent,
    [SpecialEventEnum.Chest]: ChestEvent,
    [SpecialEventEnum.Potion]: PotionEvent,
    [SpecialEventEnum.Storyteller]: StorytellerEvent,
    [SpecialEventEnum.Fusion]: FusionEvent,
    [SpecialEventEnum.NeedWater]: NeedWaterEvent,
    [SpecialEventEnum.HuntDuneBeast]: HuntDuneBeastEvent,
};