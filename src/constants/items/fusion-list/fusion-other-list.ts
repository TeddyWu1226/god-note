import {FusionListType, UsableType} from "@/types";
import {Potions} from "@/constants/items/usalbe-item/potion-info";
import {Material} from "@/constants/items/material/material-info";
import {Accessory2} from "@/constants/items/equipment/accessories-info";
import {SpecialItem} from "@/constants/items/special-item-info";


export const FusionOtherList = [
    {
        target: SpecialItem.ClearMirror,
        requirements: [
            {item: Material.CactusWater, count: 1},
            {item: Material.ScorpionBlackShell, count: 1}
        ]
    } as FusionListType,
    {
        target: SpecialItem.ClearMirror,
        requirements: [
            {item: SpecialItem.ClearMirrorFragment, count: 10}
        ]
    } as FusionListType,
]