import {FusionListType, UsableType} from "@/types";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Material} from "@/constants/items/material/material-info";
import {Accessory1, Accessory2} from "@/constants/items/equipment/accessories-info";
import {Offhand} from "@/constants/items/equipment/offhand-info";
import {Weapon} from "@/constants/items/equipment/weapon-info";


export const FusionEquipList = [
    // 一階
    {
        target: Accessory1.DefendRing1,
        requirements: [
            {item: Material.LowerNormal, count: 3},
            {item: Material.ScorpionShell, count: 3},
        ]
    } as FusionListType,
    {
        target: Accessory1.HitRing1,
        requirements: [
            {item: Material.LowerNormal, count: 3},
            {item: Material.DesertRabbitMeat, count: 10},
        ]
    } as FusionListType,
    {
        target: Accessory2.PowerNecklace1,
        requirements: [
            {item: Material.LowerNormal, count: 3},
            {item: Material.VultureFeather, count: 3},
        ]
    } as FusionListType,
    {
        target: Accessory2.CritNecklace1,
        requirements: [
            {item: Material.LowerNormal, count: 3},
            {item: Material.SandWormBloodClot, count: 10},
        ]
    } as FusionListType,
    // 二階
    {
        target: Accessory1.DefendRing2,
        requirements: [
            {item: Material.LowerNormal, count: 5},
            {item: Material.ScorpionBlackShell, count: 1},
        ]
    } as FusionListType,
    {
        target: Accessory1.HitRing2,
        requirements: [
            {item: Material.LowerNormal, count: 5},
            {item: Material.DesertRabbitLeg, count: 1},
        ]
    } as FusionListType,
    {
        target: Accessory2.PowerNecklace2,
        requirements: [
            {item: Material.LowerNormal, count: 5},
            {item: Material.VultureSilverFeather, count: 1},
        ]
    } as FusionListType,
    {
        target: Accessory2.CritNecklace2,
        requirements: [
            {item: Material.LowerNormal, count: 5},
            {item: Material.VultureSilverFeather, count: 1},
        ]
    } as FusionListType,
]