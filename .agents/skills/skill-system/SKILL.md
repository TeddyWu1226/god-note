---
name: skill-system
description: "Used when developing, maintaining, or adding active and passive skills. Covers skill base classes (SkillModel), SkillFactory registration, evolution/fusion rules (EVOLUTION_RULES), and SVG icon styling guidelines."
---

# 🔮 Skill & Evolution System Development Guide

This guide helps developers maintain active/passive skills and configure evolution/fusion rules in God Note.

## 📂 Key File Paths
- **Base Class**: [skill-model.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/models/skill-model.ts)
- **Skill Factory**: [learned-skill/index.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/skill/learned-skill/index.ts)
- **Evolution Rules**: [evolution-rule.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/skill/learned-skill/evolution-rule.ts)
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

### 2. Evolution & Fusion Rules (`EVOLUTION_RULES`)
Defined in `evolution-rule.ts` under `EVOLUTION_RULES`:
- `evolvedSkillId`: Resulting skill ID.
- `baseSkillId`: Base skill to be replaced (optional).
- `fuseSkillIds`: Supplementary materials/skills to remove.
- `checkEligible(playerStore, trackerStore)`: Validation logic (e.g., max proficiency, having specific combinations).

---

## 🛠️ Adding New Skills
1. **Create Skill Class**:
   - In `src/constants/skill/learned-skill/lv[1-3]/[active|passive]/`, create a class inheriting from `SkillModel`.
   - Call `super()` in `constructor()` and configure: `id`, `name`, `icon` (SVG path), `type` ('active'|'passive'), `rarity`.
2. **Register in Factory**:
   - Register the class under `SKILL_CLASS_MAP` in `learned-skill/index.ts`.
3. **Configure Evolution (Optional)**:
   - Add rules to `EVOLUTION_RULES` in `evolution-rule.ts`.

---

## 🎨 Skill SVG Icon Styling Standards
To ensure UI consistency, all SVG skill icons must adhere to:
1. **Transparent Background**: Keep background transparent. Do not use solid background rectangles (e.g. remove `fill="#1b1c20"` or `fill="#121216"`).
2. **Active Skills (`type: 'active'`)**: Must include a 1px border colored `#3d3d4e` defined exactly as:
   ```xml
   <rect x="0.5" y="0.5" width="15" height="15" fill="none" stroke="#3d3d4e" stroke-width="1" rx="0.5" ry="0.5" />
   ```
3. **Passive Skills (`type: 'passive'`)**: Do not include any border; draw the icon graphics directly.
