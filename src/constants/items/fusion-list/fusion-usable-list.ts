import {FusionListType} from "@/types";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Material} from "@/constants/items/material/material-info";
import {Usable} from "@/constants/items/usalbe-item/usable-info";


export const FusionUsableList = [
    {
        target: Potions.Heal1,
        requirements: [
            {item: Material.LowerNormal, count: 3},
        ]
    } as FusionListType,
    {
        target: Potions.Magic1,
        requirements: [
            {item: Material.LowerNormal, count: 3},
        ]
    } as FusionListType,
    {
        target: Usable.UnPoisonPotion,
        requirements: [
            {item: Material.LowerNormal, count: 3},
        ]
    } as FusionListType,
]
