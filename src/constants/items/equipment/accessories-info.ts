import {EquipmentType} from "@/types";
import {EquipmentPosition} from "@/enums/enums";

export const Accessory1 = {
    DefendRing0: {
        name: '劣質防禦戒指',
        description: '劣質的裝飾品,些微的增加抗性。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 0,
        defendIncrease: 3
    } as EquipmentType,
    DefendRing1: {
        name: '防禦戒指',
        description: '普通的裝飾品,增加微量的抗性。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 1,
        defendIncrease: 6
    } as EquipmentType,
    DefendRing2: {
        name: '精緻的防禦戒指',
        description: '精製的裝飾品,增加抗性。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 2,
        defendIncrease: 9
    } as EquipmentType,
    DefendRing3: {
        name: '藍寶石的防禦戒指',
        description: '鑲有防禦屬性藍寶石的裝飾品,增加不錯的抗性。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 3,
        defendIncrease: 12,
    } as EquipmentType,
    DefendRing4: {
        name: '清澈的藍寶石防禦戒指',
        description: '鑲有高階防禦屬性藍寶石的裝飾品,增加優秀的抗性。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 4,
        defendIncrease: 15,
    } as EquipmentType,
    DefendRing5: {
        name: '湛藍衛士之戒',
        description: '象徵守衛家園的決心,增加大量抗性外,還額外提升大量生命。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 5,
        defendIncrease: 20,
        hpLimit: 200
    } as EquipmentType,
    HitRing0: {
        name: '劣質的命中戒指',
        description: '表面凹凸不平，稍微穩定了一下揮動武器時的手感。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 0,
        hit: 5
    } as EquipmentType,
    HitRing1: {
        name: '命中戒指',
        description: '雖然外觀樸素，但平衡感不錯，提升了攻擊的精準度。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 1,
        hit: 10
    } as EquipmentType,
    HitRing2: {
        name: '精緻的命中戒指',
        description: '刻有鷹眼的符號，讓佩戴者更容易捕捉敵人的破綻。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 2,
        hit: 20
    } as EquipmentType,
    HitRing3: {
        name: '翡翠的命中戒指',
        description: '鑲有命中屬性的翡翠寶石，彷彿能透過寶石預判敵人的位移。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 3,
        hit: 30,
    } as EquipmentType,
    HitRing4: {
        name: '銳利的翡翠命中戒指',
        description: '鑲有高階命中屬性的翡翠寶石，使攻擊如影隨形，更能命中。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 4,
        hit: 40,
    } as EquipmentType,
    HitRing5: {
        name: '翡翠獵人之戒',
        description: '象徵潛伏於旁的精準獵人，高額提升命中外,增加了爆擊的機率。',
        icon: '💍',
        position: EquipmentPosition.ACCESSORY1,
        quality: 5,
        hit: 50,
        critRate: 10
    } as EquipmentType
};


export const Accessory2 = {
    PowerNecklace0: {
        name: '劣質的攻擊項鍊',
        description: '用麻繩簡單綁著的發光碎石，能感覺到微弱的能量。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 0,
        adIncrease: 4,
        apIncrease: 4
    } as EquipmentType,
    PowerNecklace1: {
        name: '攻擊項鍊',
        description: '經過簡單打磨的吊墜，能稍微提升輸出。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 1,
        adIncrease: 7,
        apIncrease: 7
    } as EquipmentType,
    PowerNecklace2: {
        name: '精緻的攻擊項鍊',
        description: '工藝精良的裝飾品，讓佩戴者戰意高漲，提升輸出能力。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 2,
        adIncrease: 11,
        apIncrease: 11
    } as EquipmentType,
    PowerNecklace3: {
        name: '紅瑪瑙的攻擊項鍊',
        description: '鑲有紅瑪瑙的項鍊，引發肌肉與乙太的共鳴。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 3,
        adIncrease: 14,
        apIncrease: 14
    } as EquipmentType,
    PowerNecklace4: {
        name: '閃耀的紅瑪瑙項鍊',
        description: '鑲有高階紅瑪瑙，散發出的熱氣不斷激發潛能，大幅提升輸出。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 4,
        adIncrease: 17,
        apIncrease: 17,
    } as EquipmentType,
    PowerNecklace5: {
        name: '鬥士瑪瑙之鍊',
        description: '象徵不屈鬥士的紅瑪瑙鎖鍊，賦予佩戴者排山倒海般的破壞力，並提供SP以便繼續進攻。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 5,
        adIncrease: 20,
        apIncrease: 20,
        spLimit: 200
    } as EquipmentType,
    CritNecklace0: {
        name: '劣質的要害墜飾',
        description: '鋸齒狀的邊緣黑色石塊的粗糙項鍊，些微提升爆擊時的傷害。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 0,
        critIncrease: 5
    } as EquipmentType,
    CritNecklace1: {
        name: '要害墜飾',
        description: '一顆打磨過的黑色石頭項鍊，提升一點爆擊時的傷害。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 1,
        critIncrease: 10
    } as EquipmentType,
    CritNecklace2: {
        name: '精緻的要害墜飾',
        description: '工藝精密的黑色石頭項鍊，稍微提升爆擊時的傷害。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 2,
        critIncrease: 15
    } as EquipmentType,
    CritNecklace3: {
        name: '黑曜石的要害墜飾',
        description: '鑲有黑曜石的項鍊，提升爆擊時的傷害。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 3,
        critIncrease: 20,
    } as EquipmentType,
    CritNecklace4: {
        name: '深邃的黑曜石要害墜飾',
        description: '鑲有哭泣黑曜石的項鍊，提升爆擊時較多的傷害。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 4,
        critIncrease: 25,
    } as EquipmentType,
    CritNecklace5: {
        name: '黑曜暗殺之墜飾',
        description: '象徵致命暗殺者的黑曜石鎖鍊，賦予佩戴者爆擊的大量傷害外,還能提供不錯的閃避。',
        icon: '📿',
        position: EquipmentPosition.ACCESSORY2,
        quality: 5,
        critIncrease: 30,
        dodge: 30
    } as EquipmentType
}

export const SpecialAccessory = {
    SoulAnchor: {
        name: '靈魂錨點',
        description: '將存在感固定在虛無中。',
        icon: '⚓',
        position: EquipmentPosition.ACCESSORY2,
        quality: 10,
        adIncrease: 1000,
        hit: 100
    } as EquipmentType,
}