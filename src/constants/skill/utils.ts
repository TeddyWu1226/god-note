import {isMatchedWeapon, WeaponCnNameMapping, WeaponMatchType} from "@/constants/default-const";
import {UserType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";
import {showEffect} from "@/components/Shared/FloatingEffect/EffectManager";

export const isEquip = (weaponKey: WeaponMatchType, equipPosition: EquipmentPosition, player?: Omit<UserType, 'skills'>,) => {
    if (!player?.equips) {
        return false;
    }
    const equipName = player?.equips[equipPosition]?.name;
    if (!equipName) {
        return false;
    }
    return isMatchedWeapon(weaponKey, equipName)
}

export const wrongWeaponEffect = (weaponKey: WeaponMatchType,) => {
    showEffect(
        {
            text: `沒有穿戴 ${WeaponCnNameMapping[weaponKey]?.join(', ')} 的裝備...`,
            type: 'debuff'
        }
    )
}