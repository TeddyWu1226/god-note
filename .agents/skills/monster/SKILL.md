---
name: monster
description: "Used when developing, maintaining, or adding monsters and Bosses. Covers lifecycle hooks of the base class (MonsterModel), MonsterFactory registration, Boss setup, and Vue Key collision prevention rules."
---

# 👾 Monster & Boss System Development Guide

This guide helps developers understand and extend the monster and Boss system in God Note.

## 📂 Key File Paths
- **Base Class**: [monster-model.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/models/monster-model.ts)
- **Factory Class**: [monster-factory.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/monsters/monster-factory.ts)
- **Monster Definitions**:
  - Regular Monsters: `src/constants/monsters/monster-info/`
  - Boss Info: `src/constants/monsters/monster-info/99-boss-info.ts`

---

## 🧠 Base Class & Lifecycle Hooks (MonsterModel)
The project uses OOP where all monster behaviors are defined within subclasses inheriting from `MonsterModel`.

### 1. Lifecycle Hooks
Subclasses can override these 5 hooks to implement special mechanics:
- `onStartHook(params)`: Triggered at battle start (e.g., spawn minions, apply warnings).
- `onAttackHook(params)`: Triggered before attacking (e.g., reduce target defense, lifesteal).
- `onAttackedHook(params)`: Triggered after taking damage (e.g., counterattack, clone, boost defense).
- `onDeadHook(params)`: Triggered upon death (e.g., death rattle, revive, apply debuff to player).
- `onRoundBehaviorHook(battleRound, logStore)`: Custom behavior at start/end of each round (e.g., grow larger, weaken over time).

### 2. Stats Calculation & Class Preservation
To calculate actual stats (including status buffs), call `monster.getEffectiveStats()`.
The base implementation uses `this.constructor` and `Object.assign` to clone the object while **perfectly preserving the subclass type and overridden hooks**.

---

## 🛠️ Adding New Monsters

### 1. Adding Regular Monsters
1. In `src/constants/monsters/monster-info/`, create a class inheriting from `MonsterModel`.
2. Define base stats in `constructor()` and override lifecycle hooks as needed.
3. Export the class at the bottom of the file.
4. **Must** register the class in `MONSTER_CLASS_MAP` within [monster-factory.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/monsters/monster-factory.ts).

### 2. Adding Bosses
1. In `src/constants/monsters/monster-info/99-boss-info.ts`, declare your Boss class inheriting from `MonsterModel`.
2. Instantiate it in the `Boss` constant (e.g., `new YourBossClass()`).
3. Configure it to a Stage in `StageBosses` (Day 50 for mini-boss, Day 100 for main-boss).
4. Register the class in `MONSTER_CLASS_MAP`.

---

## ⚠️ Important Cautions
1. **Vue Key Collision Prevention**: Never hardcode a static `id` field in the subclass `constructor()`. All IDs must be dynamically assigned by the `MonsterModel` base constructor (e.g., via random hash) to prevent Vue virtual DOM crash during `v-for` rendering.
2. **Icons/Assets**: If adding monster icons, ensure an **8-bit high-granularity pixel art style with a transparent background and thick black outlines** (similar to classic retro RPG battle sprites). Generate using `generate_image` and save as PNG.
