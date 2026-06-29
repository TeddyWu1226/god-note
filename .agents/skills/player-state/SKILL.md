---
name: player-state
description: "Used when developing, maintaining, or modifying player character state. Covers player attributes (HP, AD, AP, SP, Exp, Level, Gold), inventory, equipment, learned skills, Pinia player-store actions, and serialization/deserialization mechanics."
---

# 👤 Player State Development Guide

This guide helps developers maintain and extend the player character state system in God Note.

## 📂 Key File Paths
- **Store Management**: [player-store.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/store/player-store.ts)
- **Type Definitions**: [types.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/types.ts)

---

## 🧠 State Design & Attributes (usePlayerStore)
`usePlayerStore` manages player attributes, inventory, equipment, and skills:
1. **Base Attributes**: HP, AD (Physical Attack), AP (Magic Attack), SP (Skill Points), Gold, Level, Exp.
2. **Inventory & Equipment**: The player's `backpack` stores items, and equipment slots hold weapons, armor, and accessories.
3. **Learned Skills**: `info.value.skills` holds instances of `SkillModel`.

---

## ⚠️ Important Mechanisms & Cautions

### 1. Save Deserialization & Class Restoration (Critical Watcher)
The project uses Pinia persisted state. When the page is reloaded (F5) or a save is loaded, the `skills` array is restored as plain JS objects instead of `SkillModel` class instances.
- **Auto Restoration**: A deep `watch` on `info.value.skills` in `player-store.ts` checks for plain objects.
- **Restoration Logic**: If a non-`SkillModel` object is detected, it automatically calls `SkillFactory.createSkill(skill.id, skill)` to restore it to the correct class instance.
- **Modifying the Store**: Ensure any operation on the skills array respects this restoration logic so that class methods (like `execute` or `description`) are not lost.

### 2. Common Player Actions
- `addStatus(statusId, stacks)`: Apply Buff/Debuff.
- `gainItem(itemId, count)`: Gain items.
- `useItem(itemIndex)`: Use consumables or equip items.
- `addExp(exp)`: Add experience, automatically triggers `levelUp()` when full.
- `checkAndTriggerEvolutions()`: Check and trigger eligible skill evolutions/fusions.
- `totalBonus`: Computes final player stats including all equipment, active status effects, and passive skills.

---

### 3. Equipment Enhancement System (裝備熔煉與強化)
Equipment can be enhanced at the Dwarf Blacksmith in the shop:
- **Level Limit**: Up to `+5` max.
- **Cost**: Scaled using `Math.pow(2, currentLvl)` of `Monster Crystal` matching the equipment quality.
- **Success & Failure Rate**: 60% Success, 32% Safe Fail, 8% Break Fail (destroys equipment).
- **Attribute Boost**: On success, one of the positive base stats (> 0) is chosen randomly and increased by 20% of its base value per upgrade level. Negative stats are not eligible for enhancement.
- **Removal Action**: If an equipment breaks, it is removed from the inventory using the exported `_removeItemFromBag(type, index)` action in `player-store.ts`. Ensure any changes to equipment removal logic keep this function available.
