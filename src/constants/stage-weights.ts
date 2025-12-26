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
    1: [Weapon.Dagger0, Weapon.Sword0, Weapon.Axe0, Armor.Armor0],
    2: [Weapon.Dagger0, Weapon.Sword0, Weapon.Axe0, Armor.Armor0, Head.HpHead0],
    3: [Weapon.Dagger0, Weapon.Sword0, Weapon.Axe0, Armor.Armor0, Head.HpHead0, Offhand.Shield0,
        Armor.Armor1],
    4: [Weapon.Dagger0, Weapon.Sword0, Weapon.Axe0, Armor.Armor0, Head.HpHead0, Offhand.Shield0,
        Armor.Armor1, Weapon.Dagger1, Weapon.Sword1, Weapon.Axe1],
    5: [Weapon.Dagger0, Weapon.Sword0, Weapon.Axe0, Armor.Armor0, Head.HpHead0, Offhand.Shield0, Armor.Armor1],
}