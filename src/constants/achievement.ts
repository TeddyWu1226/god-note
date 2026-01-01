import {AchievementType} from "@/types";

/**
 * 公開成就：玩家可以直接看到目標並朝其努力
 */
const PublicAchievement = {
    Kill20: {
        name: "初試身手",
        icon: "⚔️",
        quality: 0,
        description: "累計擊敗 20 隻任何怪物",
        isHide: false,
    } as AchievementType,
    Kill200: {
        name: "狩獵開始了",
        icon: "⚔️",
        quality: 2,
        description: "累計擊敗 200 隻任何怪物",
        isHide: false,
    } as AchievementType,
    Kill2000: {
        name: "屠殺殆盡",
        icon: "⚔️",
        quality: 4,
        description: "累計擊敗 2000 隻任何怪物",
        isHide: false,
    } as AchievementType,
    EliteHunter10: {
        name: "樂於苦戰",
        icon: "💀",
        quality: 1,
        description: "累計擊敗 10 隻標註為【菁英】的怪物",
        isHide: false,
    } as AchievementType,
    EliteHunter100: {
        name: "菁英獵手",
        icon: "💀",
        quality: 3,
        description: "累計擊敗 100 隻標註為【菁英】的怪物",
        isHide: false,
    } as AchievementType,
    EliteHunter1000: {
        name: "遇強則強",
        icon: "💀",
        quality: 5,
        description: "累計擊敗 1000 隻標註為【菁英】的怪物",
        isHide: false,
    } as AchievementType,
    Gold1000: {
        name: "有錢人",
        icon: "🪙",
        quality: 1,
        description: "有超過 1000 G的金幣在身上",
        isHide: false,
    } as AchievementType,
    Gold9999: {
        name: "富翁",
        icon: "💰",
        quality: 3,
        description: "有超過 9999 G的金幣在身上",
        isHide: false,
    } as AchievementType,
    Boss0: {
        name: "開始遊戲",
        icon: "🐻",
        quality: 0,
        description: "擊敗「森林守護者」",
        isHide: false,
    } as AchievementType,
}

/**
 * 隱藏成就：解鎖前僅顯示暗示或完全保密
 */
const HideAchievement = {
    ThisGameHasJob: {
        name: "這遊戲還有轉職?",
        icon: "💼",
        quality: 3,
        description: "成功轉職任一職業",
        isUnlocked: false,
        isHide: true,
        hindHint: "找到另一個出路..."
    } as AchievementType,
    NewKillWolf: {
        name: "初生之犢不畏狼",
        icon: "🐺",
        quality: 4,
        description: "在[初始之森]擊敗森林之狼",
        isUnlocked: false,
        isHide: true,
        hindHint: "在初始的森林中證明你的膽識..."
    } as AchievementType,
    NearDeath: {
        name: "命懸一線",
        icon: "🩸",
        quality: 4,
        description: "在血量低於 5% 的情況下獲得戰鬥勝利",
        isUnlocked: false,
        isHide: true,
        hindHint: "在死亡邊緣品嚐勝利的滋味..."
    } as AchievementType,
    Pacifist: {
        name: "和平主義者",
        icon: "🕊️",
        quality: 5,
        description: "在不擊殺任何怪物的狀況下度過 30 天",
        isUnlocked: false,
        isHide: true,
        hindHint: "如果所有衝突都能被避免..."
    } as AchievementType,
    GambleMaster: {
        name: "逆命4ni",
        icon: "🎲",
        quality: 4,
        description: "連續贏得3場賭博",
        isUnlocked: false,
        isHide: true,
        hindHint: "如果能連續贏下賭博..."
    } as AchievementType,
    // 魔樹成就
    EvilTree1: {
        name: "樵夫1",
        icon: "🪓",
        quality: 4,
        description: "取得「尖刺木槍」",
        isUnlocked: false,
        isHide: true,
        hindHint: "拆毀邪惡之物..."
    } as AchievementType,
    EvilTree2: {
        name: "樵夫2",
        icon: "🪓",
        quality: 6,
        description: "取得「詛咒的荊棘之戒」",
        isUnlocked: false,
        isHide: true,
        hindHint: "擊敗邪惡之物..."
    } as AchievementType,
    EvilTree3: {
        name: "樵夫3",
        icon: "🪓",
        quality: 8,
        description: "取得「邪靈樹妖之心」",
        isUnlocked: false,
        isHide: true,
        hindHint: "培養邪惡之物..."
    } as AchievementType,
}

export const Achievement = {...PublicAchievement, ...HideAchievement}