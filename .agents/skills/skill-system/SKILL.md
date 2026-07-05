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
- `tier`: Skill tier (0 to 6), which automatically enforces a minimum player level to learn:
  - `0`: No limit
  - `1`: Level 5+
  - `2`: Level 10+
  - `3`: Level 25+
  - `4`: Level 40+
  - `5`: Level 60+
  - `6`: Level 80+
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

## 🎨 Skill SVG Icon Styling Standards & Directories
All SVG skill icons must be stored in the correct subfolders under `public/skills/` based on their mechanism/attribute category:
- **Magic/Spell Skills**: Place icons in `public/skills/magic/` (e.g. `magic_ball_icon.svg`, `shockwave.svg`, `heal_icon.svg`).
- **Physical/Weapon Skills**: Place icons in `public/skills/physical/` (e.g. `vertical_slash_icon.svg`, `knife_base.svg`, `will_buff.svg`).
- **Deprecated Directories**: Do NOT place icons in `public/skills/active/` or `public/skills/passive/` (these directories have been removed).

To ensure UI consistency, all SVG skill icons must adhere to:
1. **Transparent Background**: Keep background transparent. Do not use solid background rectangles (e.g. remove `fill="#1b1c20"` or `fill="#121216"`).
2. **Active Skills (`type: 'active'`)**: Must include a 1px border colored `#3d3d4e` defined exactly as:
   ```xml
   <rect x="0.5" y="0.5" width="15" height="15" fill="none" stroke="#3d3d4e" stroke-width="1" rx="0.5" ry="0.5" />
   ```
3. **Passive Skills (`type: 'passive'`)**: Do not include any border; draw the icon graphics directly.

---

## 💎 Global Skill Design Standards (Applies to ALL Skills)

To ensure consistency, readability, and ease of maintenance across all active and passive skills, follow these rules:

1. **Plain Text Tooltip Descriptions**:
   - The `description()` method of all skills **must return a clean, plain text string without HTML `<span>` or other tags**.
   - Raw HTML tags clutter the tooltips and break UI rendering. Keep them clean and plain text.

2. **Decoupled Local Methods Pattern (Critical)**:
   - **Do NOT** use global shared configuration variables, constants, or objects to store skill properties or attributes.
   - **Do** define all skill properties, stats, and scale rates (e.g. SP regen, hit rating, damage reduction percentages) inside **self-contained custom class methods** directly on the skill class (e.g. `getSpRegen()`, `getHit()`, `getDamageReduction()`).
   - Retrieve these values inside `description()`, `getPassiveBonus()`, and the battle formulas in [fight-func.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/fight-func.ts) by invoking these methods on the skill instance (utilizing `this` context or casting in the helper).

---

## 📦 Code Style & Import Rules
- **Import Paths**: Always use path alias `@/*` (e.g., `@/models/skill-model`, `@/types`) instead of relative paths or `src/*` prefix. Do NOT use `import ... from "src/..."` when reference importing from the source root.

---

## 📝 Recent Skill Implementations & Design Patterns

### 1. Magic Skill: Mana Armor (魔力裝甲)
- **Classification**: Active Magic Skill (Tier 0). Requires `AP >= 10`.
- **Icon**: [mana_armor.svg](file:///c:/Users/Ted/WebstormProjects/tower/public/skills/magic/mana_armor.svg) (placed in `skills/magic/` with standard active skill border).
- **Effect**: Grants defense increase based on player Magic Attack (`AP * 0.2`).

### 2. Fire Passive Skills: Fire Adaptability/Advancement/Master (元素適性/進階/大師: 火)
- **Classification**: Passive Magic Skills (Tier 1-3).
- **Code Location**: Defined inside [fire_skills/fire_base.ts](file:///c:/Users/Ted/WebstormProjects/tower/src/constants/skill/learned-skill/fire_skills/fire_base.ts).
- **Icons**:
  - `fire_adaptability.svg` (small delicate fire spark / seed).
  - `fire_master.svg` (multi-layered flame with bright white and orange **cross-shaped sparkles** representing mastery).
- **Design Pattern Applied**: Follows the **Global Skill Design Standards** by utilizing clean plain-text descriptions and implementing the **Decoupled Local Methods Pattern** to declare SP regeneration, hit, and damage reduction values as local methods in each class.


