import {FusionListType, UsableType} from "@/types";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Material} from "@/constants/items/material/material-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";
import {SpecialItem} from "@/constants/items/special-item-info";


export const FusionUsableList = [
    {
        target: Potions.Heal1,
        requirements: [
            {item: Material.DesertRabbitMeat, count: 2},
            {item: Material.SandWormBloodClot, count: 2},

        ]
    } as FusionListType,
    {
        target: Potions.Magic1,
        requirements: [
            {item: Material.DesertRabbitMeat, count: 2},
            {item: Material.CactusMeat, count: 2},
        ]
    } as FusionListType,
    {
        target: Potions.UnPoisonPotion,
        requirements: [
            {item: Material.BeeStinger, count: 2},
            {item: Material.SandWormBloodClot, count: 2},
        ]
    } as FusionListType,
]

export const ExtraFusionUsableItem = {
    DuneBeastBomb:
        {
            target: Usable.DuneBeastBomb,
            requirements: [
                {item: SpecialItem.DuneBeastBombCenter, count: 1},
                {item: Material.DesertRabbitMeat, count: 10},
                {item: Material.SandWormBloodClot, count: 10},
            ]
        } as FusionListType,
}