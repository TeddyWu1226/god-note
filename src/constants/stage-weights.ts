import {
    AncientRootsWeights,
    BeginForestWeights,
    FairyBarrierWeights, TwilightWeights,
    SunkenGroveWeights, ScorchingDunesWeights
} from "@/constants/stage-monster-weights";
import {EquipmentType} from "@/types";
import {Weapon} from "@/constants/items/equipment/weapon-info";
import {Armor} from "@/constants/items/equipment/armor-info";
import {Head} from "@/constants/items/equipment/head-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";

export const stageMonsterWeightsMap: Record<number, Record<string, number>> = {
    1: BeginForestWeights,
    2: SunkenGroveWeights,
    3: AncientRootsWeights,
    4: FairyBarrierWeights,
    5: TwilightWeights,
    6: ScorchingDunesWeights
}
