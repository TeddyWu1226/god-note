import {SpecialEventEnum} from "@/enums/enums";
import NoneEvent from "@/components/RoomLayout/event/NoneEvent.vue";
import GambleEvent from "@/components/RoomLayout/event/GambleEvent.vue";
import GetFruitEvent from "@/components/RoomLayout/event/GetFruitEvent.vue";
import ChestEvent from "@/components/RoomLayout/event/ChestEvent.vue";
import PotionEvent from "@/components/RoomLayout/event/PotionEvent.vue";
import NeedWaterEvent from "@/components/RoomLayout/event/NeedWaterEvent.vue";
import BushSearchEvent from "@/components/RoomLayout/event/BushSearchEvent.vue";
import UnknownGraveEvent from "@/components/RoomLayout/event/UnknownGraveEvent.vue";
import DragonSkeletonEvent from "@/components/RoomLayout/event/DragonSkeletonEvent.vue";
import AncientWrathEvent from "@/components/RoomLayout/event/AncientWrathEvent.vue";
import EndlessBetrayalEvent from "@/components/RoomLayout/event/EndlessBetrayalEvent.vue";

export const eventComponentMap = {
	[SpecialEventEnum.None]: NoneEvent,
	[SpecialEventEnum.Gamble]: GambleEvent,
	[SpecialEventEnum.GetFruit]: GetFruitEvent,
	[SpecialEventEnum.Chest]: ChestEvent,
	[SpecialEventEnum.Potion]: PotionEvent,
	[SpecialEventEnum.NeedWater]: NeedWaterEvent,
	[SpecialEventEnum.BushSearch]: BushSearchEvent,
	[SpecialEventEnum.UnknownGrave]: UnknownGraveEvent,
	[SpecialEventEnum.DragonSkeleton]: DragonSkeletonEvent,
	[SpecialEventEnum.AncientWrath]: AncientWrathEvent,
	[SpecialEventEnum.EndlessBetrayal]: EndlessBetrayalEvent,
};