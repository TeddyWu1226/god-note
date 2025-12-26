import {
    AncientRootsWeights,
    BeginForestWeights,
    FairyBarrierWeights, GuardiansDenWeights,
    SunkenGroveWeights
} from "@/constants/stage-monster-weights";
import {EquipmentType} from "@/types";
import {Weapon} from "@/constants/equipment/weapon-info";
import {Armor} from "@/constants/equipment/armor-info";
import {Head} from "@/constants/equipment/head-info";
import {Offhand} from "@/constants/equipment/offhand-info";

export const stageMonsterWeightsMap: Record<number, Record<string, number>> = {
    1: BeginForestWeights,
    2: SunkenGroveWeights,
    3: AncientRootsWeights,
    4: FairyBarrierWeights,
    5: GuardiansDenWeights
}


export const stageShopSaleEquipmentMap: Record<number, EquipmentType[]> = {
    1: [Weapon.RustyDagger, Armor.TatteredRags],
    2: [Head.StrawHat],
    3: [Offhand.WoodShield,Armor.PaddedArmor],
    4: [],
    5: [],
}