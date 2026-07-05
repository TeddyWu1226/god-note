---
name: room-gameplay
description: "Used when adjusting gameplay, room transitions, special events, and room UI layouts. Covers progression of stages/days, random room generation, event process tracking, and rendering of rooms (FightRoom, ShopRoom, BlessRoom)."
---

# 🗺️ Room Transitions & Gameplay Development Guide

This guide helps developers maintain room transitions, navigation, event flows, and room-specific layouts in God Note.

## 📂 Key File Paths
- **Game State Store**: [game-state-store.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/store/game-state-store.ts)
- **Room Enumerations**: [room-enum.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/enums/room-enum.ts)
- **Room UI Components**:
  - Main Room Router Layout: [RoomLayout.vue](file:///c:/Users/Ted/WebstormProjects/tower/src/components/RoomLayout/RoomLayout.vue)
  - Room Components: `src/components/RoomLayout/room/` (BlessRoom, FightRoom, MainEventRoom, RestRoom, ShopRoom, StationRoom)
- **Primary Views**: `src/views/` (IntroPage, MainPage, DeadPage)

---

## 🧠 Core Gameplay Architecture

### 1. Stage & Progress Flow (useGameStateStore)
- **Progression Variables**:
  - `days`: Cumulative survival days (key milestone for infinite challenge mode).
  - `stageDays`: Current days survived within this stage.
  - `currentStage`: The current stage (major level/floor).
- **Navigation Flow**:
  - `currentRoomValue`: Current room code (matches values in `RoomEnum`).
  - `nextRooms`: A randomly generated list of next rooms presented to the player for choice.

### 2. Special Events Engine
- `currentEventType` and `lastEventType` track the current and previous Special Events.
- `eventProcess` map stores progress integers for each `SpecialEventEnum`.
- Read current event states using the `getEventProcess(event)` getter.

### 3. Room Routing & UI Mounting
- **`RoomLayout.vue`**: Switch-mounts the correct Vue component depending on `gameStateStore.currentRoomValue`:
  - `FightRoom`: Arena render with active enemies list.
  - `ShopRoom`: Gear purchase/sell actions.
  - `RestRoom`: Recovery options for HP/SP.
  - `BlessRoom`: Interactive altars offering stat upgrades.
  - `MainEventRoom`: Stage/area introduction on Day 0 of each stage.
  - `StationRoom`: Intermission hub for inventory management and gear sorting.

### 4. Day Progress & Daily Cooldown / Status Tick Rules
- **Daily Cooldown / Status Progression**:
  - Every time a day passes (which occurs when transitioning to a room other than Special Event `RoomEnum.Event.value` inside `selectRoom` in `NextOperation.vue`), `playerStore.nextTurnStatus()` is triggered.
  - This automatically decreases player status durations by 1, processes daily healing/damage ticks on the player (e.g. poison damage), applies HP/SP regenerations, and decreases skill CDs and offhand skill CDs by 1.
  - **Start of Combat Cooldown Retention**: Skill CDs and offhand CDs are NOT reset/cleared when a new combat begins. They persist across combat rooms and cool down day by day or round by round.

---

## ⚠️ Important Cautions
1. **State Synchronization**: When switching rooms (e.g., player clicks to progress), ensure `gameStateStore` states are cleanly reset/synced with `playerStore` to avoid leaks (like active combat states persisting into a RestRoom).
2. **Event Progression Persistence**: Save all event states directly inside the `eventProcess` map so Pinia can persist them, preventing event progress resets upon page refresh.
