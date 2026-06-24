---
name: combat
description: "Used when adjusting combat logic, damage calculation formulas, enemy spawning, and battle logs (Log Store). Covers hit rates, critical strikes, defense mitigation, and combat execution flows."
---

# ⚔️ Combat Engine & Calculations Development Guide

This guide helps developers maintain and extend the combat engine, damage formulas, and battle logging in God Note.

## 📂 Key File Paths
- **Combat Functions**: [fight-func.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/fight-func.ts)
- **Combat Logs Store**: [log-store.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/store/log-store.ts)

---

## 🧠 Combat Engine Mechanics

### 1. Damage Calculation Formula (`calculateDamage`)
- **Hit Rate**:
  $$\text{Hit Rate} = \text{BASE\_HIT\_RATE (100)} + \text{Attacker's hit} - \text{Defender's dodge}$$
  If a random roll exceeds the Hit Rate, the attack fails as a Miss.
- **Critical Strike**:
  Based on the attacker's `critRate`. On a critical hit, damage is multiplied by $\text{critIncrease} / 100$.
- **Defense Mitigation (Flat)**:
  Physical damage is first reduced by the target's flat defense `adDefend`.
- **Percentage Mitigation (Ratio)**:
  Then, percentage damage reduction `defendIncrease` is applied. The final mitigation is capped at a maximum of **95%**.

### 2. Executing Attacks (`applyAttackDamage` & `applySkillDamage`)
- **HP Deduction**: Apply final calculated damage to the target.
- **Log Store Logging**: Write all combat events (damage dealt, skills cast, misses, deaths) to `logStore`.
- **Floating Numbers**: Use `useFloatingMessage` to spawn combat damage numbers on screen for visual feedback.

### 3. Combat Spawning (`spawnMonsters`)
- **Selector**: Select monsters randomly from the stage-monster weight tables.
- **Elite Boost**: If the combat is an elite battle (`eliteBoost = true`), monster stats are multiplied according to formulas.
- **Instantiation**: Instantiate monsters via `MonsterFactory.createMonster` and load them into `gameStateStore.currentEnemy`.

---

## ⚠️ Important Cautions
1. **Value Balancing**: When adjusting calculations, be careful with cumulative flat defense and percentage reduction. Multiplicative or additive buffs could make targets fully immune. Always enforce the 95% cap for `defendIncrease`.
2. **Log Feedback**: Ensure every active/passive skill that inflicts damage calls `logStore.addLog` and `useFloatingMessage` to display proper UI hit feedback.
