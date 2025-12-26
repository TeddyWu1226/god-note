// @/constants/material-info.ts
import { ItemType } from "@/types";

export const MATERIAL = {
    SlimeGoo: {
        name: '史萊姆黏液',
        icon: '🧪',
        description: '黏糊糊的綠色液體，可以用來製作簡易藥水',
        quality: 0,
    } as ItemType,
    AntShell: {
        name: '螞蟻甲殼',
        icon: '🐜',
        description: '堅硬的昆蟲外殼，是製作輕甲的素材',
        quality: 0,
    } as ItemType,
    ForestWood: {
        name: '靈木細枝',
        icon: '🌿',
        description: '帶有微弱魔力的樹枝',
        quality: 0,
    } as ItemType,
    OwlFeather: {
        name: '夜行梟羽毛',
        icon: '🪶',
        description: '非常輕盈且不沾水，適合製作箭矢',
        quality: 1,
    } as ItemType,
    RabbitHorn: {
        name: '角兔的小角',
        icon: '𓄏',
        description: '尖銳的小型角，可用作武器尖端',
        quality: 0,
    } as ItemType,
    BeeStinger: {
        name: '毒蜂刺',
        icon: '🐝',
        description: '末端帶有倒鉤，依然殘留著強烈毒性',
        quality: 1,
    } as ItemType,
    MushroomSpore: {
        name: '幻覺孢子',
        icon: '✨',
        description: '蕈人散發出的粉末，吸入過多會產生幻覺',
        quality: 2,
    } as ItemType,
    ViperScale: {
        name: '枯葉蛇鱗',
        icon: '🍂',
        description: '與落葉顏色一致，具有極佳的隱蔽性',
        quality: 2,
    } as ItemType,
    WolfSkin: {
        name: '狼皮',
        icon: '🐺',
        description: '精良的狼皮，只有狩獵森林之狼才能取得',
        quality: 2,
    } as ItemType,
    MandrakeRoot: {
        name: '蔓陀羅根',
        icon: '🍠',
        description: '長得像人臉的怪異根部，極為珍貴的鍊金素材',
        quality: 3,
    } as ItemType,
}