---
name: skill-system
description: "Used when developing, maintaining, or adding active and passive skills. Covers skill base classes (SkillModel), SkillFactory registration, evolution/fusion rules (EVOLUTION_RULES), and SVG icon styling guidelines."
---

# 🔮 Skill & Evolution System Development Guide

This guide helps developers maintain active/passive skills and configure evolution/fusion rules in God Note.

## 📂 Key File Paths
- **Base Class**: [skill-model.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/models/skill-model.ts)
- **Skill Factory**: [learned-skill/index.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/skill/learned-skill/index.ts)
- **Evolution & Skill Trees**: `src/constants/skill/learned-skill/skill-tree/` (including `index.ts` containing `SKILL_TREE_NODES`, `sword-skill-tree.ts`, `knife-skill-tree.ts`, etc.)
- **Categorized Skills**: `src/constants/skill/learned-skill/lv[1-3]/`
- **Offhand Skills**: `src/constants/skill/offhand-skill/`

---

## 🧠 Skill Architecture

### 1. Base Class (`SkillModel`)
All skills subclass `SkillModel` and override the following core methods:
- **`description(playerStore)`**: Returns a dynamic description string. Can use the `ColorText` helper to format rich-text colors.
- **`execute(params)`**: (Active skills only) Defines execution logic, e.g., SP consumption, target damage, or status buff application.
- **`getPassiveBonus(player)`**: (Passive skills only) Returns attribute bonuses (e.g., `{ ad: 5, hit: 10 }`), which are automatically summed in `playerStore.totalBonus`.
- **`toJSON()`**: Limits serialization to dynamic fields (`id`, `level`, `proficiency`, `currentCd`) to keep save file sizes small.

### 2. Evolution & Fusion Rules (`SKILL_TREE_NODES`)
Defined in `src/constants/skill/learned-skill/skill-tree/` (e.g. `index.ts`, `sword-skill-tree.ts`):
- `id`: Skill ID.
- `pathId`: Unique branch/flow ID.
- `tier`: Skill tier (1, 2, or 3).
- `evolvesFrom`: Base skills to replace when this skill is learned (optional).
- `fusesFrom`: Ingredient skills to consume/remove when this skill is learned (optional).
- `checkEligible(playerStore, trackerStore)`: Validation logic.
  > [!TIP]
  > Use **`playerStore.checkSkillPath(pathId)`** to check if the player possesses any passive or active skill belonging to a specific branch/flow (e.g. `checkSkillPath('knifeplay')` for dagger/assassination passive requirements).

---

## 🛠️ Adding New Skills
1. **Create Skill Class**:
   - In `src/constants/skill/learned-skill/lv[1-3]/[active|passive]/`, create a class inheriting from `SkillModel`.
   - Call `super()` in `constructor()` and configure: `id`, `name`, `icon` (SVG path), `type` ('active'|'passive'), `rarity`.
2. **Register in Factory**:
   - Register the class under `SKILL_CLASS_MAP` in `learned-skill/index.ts`.
3. **Configure Evolution (Optional)**:
   - Add rules/nodes to the relevant skill tree file under `src/constants/skill/learned-skill/skill-tree/`.

---

## 🎨 Skill SVG Icon Styling Standards
To ensure UI consistency, all SVG skill icons must adhere to:
1. **Transparent Background**: Keep background transparent. Do not use solid background rectangles (e.g. remove `fill="#1b1c20"` or `fill="#121216"`).
2. **Active Skills (`type: 'active'`)**: Must include a 1px border colored `#3d3d4e` defined exactly as:
   ```xml
   <rect x="0.5" y="0.5" width="15" height="15" fill="none" stroke="#3d3d4e" stroke-width="1" rx="0.5" ry="0.5" />
   ```
3. **Passive Skills (`type: 'passive'`)**: Do not include any border; draw the icon graphics directly.
