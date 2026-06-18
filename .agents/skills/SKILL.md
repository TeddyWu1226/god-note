---
name: god-note
description: "開發、維護與擴充《神祇記事》(God Note) 的純前端 RPG 遊戲系統。當使用者需要新增怪物、頭目、職業技能、隨機事件、裝備道具，或是調整戰鬥數值計算、存檔快取、UI 排版樣式時，啟用本 Skill。"
---

# ⚔️ 神祇記事 (God Note) 開發指南

本指南旨在幫助 AI 協作開發者快速理解《神祇記事》專案的架構設計、核心模組關係以及編碼規範，確保後續擴充怪物、技能、事件或優化戰鬥數值時能保持代碼的一致性與穩定性。

---

## 📂 專案架構概覽

*   `src/models/`：核心物件導向 (OOP) 類別定義，如 `MonsterModel`、`SkillModel`。
*   `src/store/`：Pinia 狀態管理庫，管理存檔、玩家屬性、遊戲進度、戰鬥日誌及統計數據。
*   `src/constants/`：靜態數據配置與核心函數：
    *   `monsters/`：怪物、Boss 範本與實例化 `MonsterFactory`。
    *   `skill/`：職業技能與裝備技能。
    *   `items/`：武器、防具、飾品、消耗品、材料。
    *   `status/`：狀態效果（Buff / Debuff）。
    *   `fight-func.ts`：戰鬥引擎的核心邏輯（傷害計算、怪物生成、掉落判斷）。
*   `src/components/`：UI 版面配置，特別是 `RoomLayout/room/FightRoom/` 負責戰鬥渲染。
*   `src/views/`：遊戲的核心頁面（`IntroPage` 角色選擇、`MainPage` 主戰場、`DeadPage` 死亡結算）。

---

## 🧠 狀態管理 (Pinia Stores)

本專案高度依賴 Pinia 配合 `pinia-plugin-persistedstate` 進行自動存檔與反序列化。

1.  **`usePlayerStore`** (`src/store/player-store.ts`)
    *   管理玩家屬性（HP, AD, AP, SP, Gold, Level, Exp）及背包、裝備、已學技能。
    *   提供玩家相關動作：`addStatus`、`gainItem`、`useItem`、`addExp`、`levelUp` 等。
2.  **`useGameStateStore`** (`src/store/game-state-store.ts`)
    *   管理遊戲天數（`days`、`stageDays`）、當前層數（`currentStage`）、當前房間類型（`currentRoomValue`）。
    *   管理當前敵人陣列（`currentEnemy`）。
    *   **⚠️ 重要監聽器**：深度監聽 `currentEnemy`，若發現陣列中含有非 `MonsterModel` 執行個體（如存檔後加載的純 JS 物件），會自動透過 `MonsterFactory.createMonster` 將其反序列化為對應的子類別 Class 實例。
3.  **`useTrackerStore`** (`src/store/track-store.ts`)
    *   統計玩家本輪與整場的數據（怪物擊殺總數、菁英擊殺、和平天數、賭博輸贏等）。
    *   **本數據僅作統計與歷史記錄，成就系統本身已完全移除**。
4.  **`useSaveStore`** (`src/store/save-store.ts`)
    *   管理存檔槽與存檔的讀取、抹除及寫入。

---

## 👾 怪物系統 (OOP & Lifecycle Hooks)

專案已完全廢棄舊版的外部註冊表查表機制，所有怪物行為一律寫在繼承 `MonsterModel` 的子類別中。

### 1. 怪物基類：`MonsterModel` (`src/models/monster-model.ts`)
定義了所有怪物的基本屬性，並提供 5 個生命週期 Hook 供子類別覆寫：
*   `onStartHook(params)`：戰鬥開始時觸發（如召喚小怪、上警告 Buff）。
*   `onAttackHook(params)`：主動發起攻擊前觸發（如扣防、吸血、上狀態）。
*   `onAttackedHook(params)`：被玩家攻擊受傷後觸發（如反擊、分身、增加防禦）。
*   `onDeadHook(params)`：死亡時觸發（如遺言、復活、給予玩家負面效果）。
*   `onRoundBehaviorHook(battleRound, logStore)`：每回合結束/開始的獨特習性（如體型變大、隨時間流逝削弱）。

### 2. 屬性計算與類別保留
當需要計算包含 Buff 影響的實際屬性時，會調用 `monster.getEffectiveStats()`。
基類的實作會透過 `this.constructor` 與 `Object.assign` 在複製物件的同時**完美保留子類別的 Class 類型與 overridden Hooks**。

### 3. 實例化工廠：`MonsterFactory` (`src/constants/monsters/monster-factory.ts`)
*   維護 `MONSTER_CLASS_MAP`。當新增怪物類別時，**必須**在此 Map 中進行註冊，以便工廠能根據名稱或 ID 正確還原 Class 實例。

---

## ⚔️ 戰鬥引擎與計算 (`src/constants/fight-func.ts`)

*   **傷害計算 (`calculateDamage`)**：
    *   命中判斷：`BASE_HIT_RATE (100) + hit - dodge`。
    *   暴擊判斷：基於 `critRate`，暴擊時傷害乘以 `critIncrease / 100`。
    *   防禦力減免：物理傷害扣除防禦 `adDefend`，並依據 `defendIncrease` 套用比例減傷（最大 95%）。
*   **戰鬥執行 (`applyAttackDamage`)**：
    *   計算傷害並扣減 HP，記錄日誌至 `logStore`，並利用 `useFloatingMessage` 產生受擊數字的浮動特效。
*   **怪物生成 (`spawnMonsters`)**：
    *   自權重表中隨機挑選怪物，若為菁英戰鬥（`eliteBoost = true`），則依據特定公式加倍屬性，最終透過 `MonsterFactory.createMonster` 實例化。

---

## 🛠️ 常見擴充指南

### 1. 新增普通怪物
1.  在 `src/constants/monsters/monster-info/1-misty-forest-monster.ts` 中建立繼承 `MonsterModel` 的 Class。
2.  在 `constructor` 中設定初始數值。
3.  覆寫需要的 Hook（例如：`onAttackHook`）。
4.  將類別註冊進 `MistyForestMonster` 物件（檔案底部），並匯入至 `src/constants/monsters/monster-factory.ts` 的 `MONSTER_CLASS_MAP`。

### 2. 新增 Boss
1.  in `src/constants/monsters/monster-info/99-boss-info.ts` 中宣告 Boss 類別。
2.  在 `Boss` 常數中以 `new YourBossClass()` 進行暫存。
3.  在 `StageBosses` 中將其配置到相應的 Stage（Day 50 為 mini，Day 100 為 main）。
4.  註冊至 `MONSTER_CLASS_MAP`。

### 3. 新增狀態效果 (Status Effect)
1.  在 `src/constants/status/unit-status.ts` (針對怪物或玩家) 或 `usual-status.ts` 中定義狀態模板。
2.  設定對應屬性的 `bonus` 值（如 `{ ad: 5 }`），系統在 `getEffectiveStats()` 中會自動進行數值疊加。

---

## ⚠️ 開發注意事項

1.  **無 placeholders**：如果需要新增介面插圖，請利用 `generate_image` 工具生成專屬素材，像素寫實風格為主，技能\裝備圖示請用svg，怪物圖示請用png。
2.  **Vue Key 碰撞問題**：怪物類別的 `constructor` 中**嚴禁**使用固定的靜態 `id` 欄位。所有的 `id` 必須交由 `MonsterModel` 基類建構子動態分配（例如隨機 hash），以防 Vue 虛擬 DOM 渲染 `v-for` 時發生 Key 碰撞崩潰。
3.  **成就系統禁止重裝**：本專案已完全將成就系統（`achievement-store`、`AchievementDialog` 等）移除。如有數值累計需求，請直接記錄在 `trackerStore` 內作為純數據指標即可。
4.  **編譯驗證**：每次變更模型或資料結構後，由開發者自行測試，確保 Pinia 持久化快取在頁面重新整理（F5）時能毫無障礙地恢復類別狀態。
