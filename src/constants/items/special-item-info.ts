import {ItemType, UsableType} from "@/types";


export const SpecialItem = {
    DragonBlood: {
        name: '龍之血',
        icon: '🩸',
        description: '從龍族身上採集到的血液，蘊含著古老魔力與生命力。',
        quality: 5,
        unsellable: true,
    } as ItemType,
    Wrath: {
        name: '憤怒',
        icon: '∑',
        description: '泰坦遺留下來力量，受到龍族始祖影響而變化的刻印。記錄著遠古龍族的屈辱與憤怒。',
        quality: 7,
        unsellable: true,
    } as ItemType,

    AvelynNecklace: {
        name: '破損的古代項鍊',
        icon: '𑣿',
        description: '一枚殘破的空殼項鍊，彷彿有曾有神力的量儲備於此，但如今只剩空殼。背後刻有「艾芙琳」的字樣。',
        quality: 0,
        unsellable: true,
    } as ItemType,
    Betray: {
        name: '背叛',
        icon: '≠',
        description: '泰坦遺留下來力量，受到德魯伊始祖影響而變化的刻印。記錄著過去自己的背叛、親友與愛人的背叛。',
        quality: 7,
        unsellable: true,
    } as ItemType,

}