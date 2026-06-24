---
name: game-params
description: "Used when adjusting game parameters, probability weights, statistics tracking (Tracker Store), and save data management (Save Store). Applies to modifying stage monster weights, day weights, player stats tracking, and save persistence settings."
---

# ⚙️ Game Parameters & Save System Development Guide

This guide helps developers maintain static configurations, random weights generation, metrics tracking, and save slot operations in God Note.

## 📂 Key File Paths
- **Default Parameters**: [default-const.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/default-const.ts)
- **Stage Navigation Weights**: [stage-weights.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/stage-weights.ts)
- **Monster Spawning Weights**: [stage-monster-weights.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/stage-monster-weights.ts)
- **Stats Tracking Store**: [track-store.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/store/track-store.ts)
- **Save Management Store**: [save-store.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/store/save-store.ts)

---

## 🧠 Core System Modules

### 1. Game Constants & Random Weight Tables
- **`default-const.ts`**: Contains base attributes for the player and monsters.
- **`stage-weights.ts` & `stage-monster-weights.ts`**: Define room type probabilities per stage and random monster spawn weights per level/day. Modifying these directly scales difficulty and pacing.

### 2. Statistics Tracker (useTrackerStore)
- **Metrics Tracking**: Records stats for the current run and lifetime totals (kills, elite kills, peaceful days, gambling outcomes).
- **⚠️ Important Constraint**: **The achievement system (e.g., `achievement-store`, `AchievementDialog`) is fully removed**. All milestones must be recorded as raw metrics in `trackerStore` only. Do not re-add achievement UI/dialogs.

### 3. Save Game State (useSaveStore)
- Handles writing, loading, and erasing save slots.
- Leverages `pinia-plugin-persistedstate` for automatic local storage synchronization.

---

## ⚠️ Verification & Quality Checklist
1. **Save Slot Integrity**: When modifying player stats, inventory schema, or monster classes, **always** verify that the Pinia persisted state correctly recovers all class instances and methods upon page refresh (F5).
2. **Save Reset & Wipe**: Test that wiping/clearing save slots resets LocalStorage cleanly and prevents errors from stale data configurations.
