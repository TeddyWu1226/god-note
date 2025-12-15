// @/components/Events/EventMap.ts (事件組件的映射)

import JobChange from "./JobChange.vue";
import GambleEvent from "./GambleEvent.vue";
import AngelBlessing from "./AngelBlessing.vue";
import {SpecialEventEnum} from "@/enums/enums";
// ... 導入所有事件組件

export const eventComponentMap = {
	[SpecialEventEnum.JobChange]: JobChange,
	[SpecialEventEnum.Gamble]: GambleEvent,
	[SpecialEventEnum.AngelBlessing]: AngelBlessing,
	// ...
};